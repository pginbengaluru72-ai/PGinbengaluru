import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, sql, and } from 'drizzle-orm';
import * as schema from '../db/schema';
import { requireAuth, requireRole, apiError, apiSuccess, type AuthUser } from '../lib/middleware';
import { hashPassword } from '../lib/crypto';

type Bindings = { DB: D1Database };
type Variables = { user: AuthUser; requestId: string };

const superadminRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// All admin routes require SUPER_ADMIN role
superadminRouter.use('*', requireAuth());
superadminRouter.use('*', requireRole('SUPER_ADMIN'));

// ============================================================
// GET /api/admin/overview — Platform stats
// ============================================================
superadminRouter.get('/overview', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
  const [ownersCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.users).where(eq(schema.users.role, 'OWNER'));
  const [customersCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.users).where(eq(schema.users.role, 'CUSTOMER'));

  const [propertiesTotal] = await db.select({ count: sql<number>`count(*)` }).from(schema.properties);
  const [propertiesVerified] = await db.select({ count: sql<number>`count(*)` }).from(schema.properties).where(eq(schema.properties.status, 'PUBLISHED'));
  const [propertiesPending] = await db.select({ count: sql<number>`count(*)` }).from(schema.properties).where(eq(schema.properties.status, 'SUBMITTED'));

  const [bedsStats] = await db.select({
    total: sql<number>`count(*)`,
    occupied: sql<number>`sum(case when status = 'OCCUPIED' then 1 else 0 end)`,
    available: sql<number>`sum(case when status = 'AVAILABLE' then 1 else 0 end)`,
  }).from(schema.beds);

  const totalBeds = Number(bedsStats?.total || 0);
  const occupiedBeds = Number(bedsStats?.occupied || 0);
  const availableBeds = Number(bedsStats?.available || 0);

  return apiSuccess(c, {
    totalUsers: Number(usersCount?.count || 0),
    totalOwners: Number(ownersCount?.count || 0),
    totalCustomers: Number(customersCount?.count || 0),
    totalProperties: Number(propertiesTotal?.count || 0),
    verifiedProperties: Number(propertiesVerified?.count || 0),
    pendingProperties: Number(propertiesPending?.count || 0),
    totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
  });
});

// ============================================================
// GET /api/admin/verifications — Properties awaiting review
// ============================================================
superadminRouter.get('/verifications', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const pending = await db.select({
    id: schema.properties.id,
    publicId: schema.properties.publicId,
    name: schema.properties.name,
    type: schema.properties.type,
    status: schema.properties.status,
    locality: schema.properties.locality,
    city: schema.properties.city,
    pincode: schema.properties.pincode,
    startingPrice: schema.properties.startingPrice,
    amenities: schema.properties.amenities,
    ownerId: schema.properties.ownerId,
    createdAt: schema.properties.createdAt,
  }).from(schema.properties)
    .where(eq(schema.properties.status, 'SUBMITTED'))
    .orderBy(desc(schema.properties.createdAt));

  return apiSuccess(c, { properties: pending });
});

// ============================================================
// POST /api/admin/verifications/:id/verify — Approve property
// ============================================================
superadminRouter.post('/verifications/:id/verify', async (c) => {
  const propertyId = c.req.param('id');
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });
  const now = new Date();

  const rows = await db.select().from(schema.properties).where(eq(schema.properties.id, propertyId)).limit(1);
  if (rows.length === 0) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  await db.update(schema.properties).set({
    status: 'VERIFIED',
    verifiedAt: now,
    verifiedBy: user.id,
    updatedAt: now,
  }).where(eq(schema.properties.id, propertyId));

  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    actorId: user.id,
    actorRole: 'SUPER_ADMIN',
    action: 'PROPERTY_VERIFIED',
    entityType: 'property',
    entityId: propertyId,
    requestId: c.get('requestId'),
    createdAt: now,
  });

  return apiSuccess(c, { message: 'Property verified successfully.' });
});

// ============================================================
// POST /api/admin/verifications/:id/reject — Reject property
// ============================================================
superadminRouter.post('/verifications/:id/reject', async (c) => {
  const propertyId = c.req.param('id');
  const user = c.get('user');
  const body = await c.req.json().catch(() => null);
  const db = drizzle(c.env.DB, { schema });
  const now = new Date();

  await db.update(schema.properties).set({
    status: 'REJECTED',
    adminNotes: body?.reason || null,
    updatedAt: now,
  }).where(eq(schema.properties.id, propertyId));

  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    actorId: user.id,
    actorRole: 'SUPER_ADMIN',
    action: 'PROPERTY_REJECTED',
    entityType: 'property',
    entityId: propertyId,
    metadata: JSON.stringify({ reason: body?.reason }),
    requestId: c.get('requestId'),
    createdAt: now,
  });

  return apiSuccess(c, { message: 'Property rejected.' });
});

// ============================================================
// POST /api/admin/owners/create — Create owner account
// ============================================================
superadminRouter.post('/owners/create', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const { email, name, phone, tempPassword } = body;
  if (!email || !name || !tempPassword) {
    return apiError(c, 400, 'MISSING_FIELDS', 'Email, name, and temporary password are required.');
  }

  const db = drizzle(c.env.DB, { schema });
  const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim())).limit(1);
  if (existing.length > 0) return apiError(c, 409, 'EMAIL_EXISTS', 'Account with this email already exists.');

  const userId = crypto.randomUUID();
  const now = new Date();
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);

  await db.insert(schema.users).values({
    id: userId,
    publicId: `STY-USR-${timestamp}${random}`.toUpperCase(),
    email: email.toLowerCase().trim(),
    phone: phone || null,
    name: name.trim(),
    passwordHash: await hashPassword(tempPassword),
    role: 'OWNER',
    isActive: true,
    mustChangePassword: true, // Force password change on first login
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(schema.ownerProfiles).values({
    id: crypto.randomUUID(),
    userId,
    publicId: `STY-OWN-${timestamp}${random}`.toUpperCase(),
    city: 'Bengaluru',
    createdAt: now,
    updatedAt: now,
  });

  const adminUser = c.get('user');
  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    actorId: adminUser.id,
    actorRole: 'SUPER_ADMIN',
    action: 'OWNER_ACCOUNT_CREATED',
    entityType: 'user',
    entityId: userId,
    requestId: c.get('requestId'),
    createdAt: now,
  });

  return apiSuccess(c, { message: 'Owner account created. They must change password on first login.' }, 201);
});

// ============================================================
// GET /api/admin/audit-logs — View audit trail
// ============================================================
superadminRouter.get('/audit-logs', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = Math.min(parseInt(c.req.query('limit') || '50', 10), 100);
  const offset = (page - 1) * limit;

  const logs = await db.select().from(schema.auditLogs)
    .orderBy(desc(schema.auditLogs.createdAt))
    .limit(limit)
    .offset(offset);

  const [total] = await db.select({ count: sql<number>`count(*)` }).from(schema.auditLogs);

  return apiSuccess(c, {
    logs,
    pagination: { page, limit, total: Number(total?.count || 0) },
  });
});

// ============================================================
// POST /api/admin/broadcast — Push global notice
// ============================================================
superadminRouter.post('/broadcast', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.message) return apiError(c, 400, 'MISSING_FIELDS', 'Message is required.');

  const db = drizzle(c.env.DB, { schema });
  const user = c.get('user');
  const now = new Date();

  const broadcastData = JSON.stringify({
    message: body.message,
    level: body.level || 'info',
    target: body.target || 'all',
    createdAt: now.toISOString()
  });

  await db.insert(schema.platformSettings).values({
    key: 'global_broadcast',
    value: broadcastData,
    updatedBy: user.id,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: schema.platformSettings.key,
    set: {
      value: broadcastData,
      updatedBy: user.id,
      updatedAt: now,
    }
  });

  return apiSuccess(c, { message: 'Broadcast pushed successfully.' }, 201);
});

export default superadminRouter;
