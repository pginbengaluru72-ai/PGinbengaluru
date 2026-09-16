import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, sql, and } from 'drizzle-orm';
import * as schema from '../db/schema';
import { requireAuth, requireRole, apiError, apiSuccess, type AuthUser } from '../lib/middleware';
import { hashPassword } from '../lib/crypto';

type Bindings = { DB: D1Database };
type Variables = { user: AuthUser; requestId: string };

const adminRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// All admin routes require SUPER_ADMIN role
adminRouter.use('*', requireAuth());
adminRouter.use('*', requireRole('SUPER_ADMIN'));

// ============================================================
// GET /api/admin/overview — Platform stats
// ============================================================
adminRouter.get('/overview', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const [ownersCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.users).where(eq(schema.users.role, 'OWNER'));
  const [propertiesTotal] = await db.select({ count: sql<number>`count(*)` }).from(schema.properties);
  const [propertiesVerified] = await db.select({ count: sql<number>`count(*)` }).from(schema.properties).where(eq(schema.properties.status, 'VERIFIED'));
  const [propertiesPending] = await db.select({ count: sql<number>`count(*)` }).from(schema.properties).where(eq(schema.properties.status, 'SUBMITTED'));
  const [totalLeads] = await db.select({ count: sql<number>`count(*)` }).from(schema.leads);
  const [localitiesCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.localities).where(eq(schema.localities.isActive, true));

  const [roomStats] = await db.select({
    totalBeds: sql<number>`coalesce(sum(${schema.rooms.totalBeds}), 0)`,
    availableBeds: sql<number>`coalesce(sum(${schema.rooms.availableBeds}), 0)`,
  }).from(schema.rooms);

  const totalBeds = Number(roomStats?.totalBeds || 0);
  const availableBeds = Number(roomStats?.availableBeds || 0);
  const occupiedBeds = totalBeds - availableBeds;

  return apiSuccess(c, {
    totalOwners: Number(ownersCount?.count || 0),
    totalProperties: Number(propertiesTotal?.count || 0),
    verifiedProperties: Number(propertiesVerified?.count || 0),
    pendingProperties: Number(propertiesPending?.count || 0),
    totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
    totalLeads: Number(totalLeads?.count || 0),
    activeLocalities: Number(localitiesCount?.count || 0),
  });
});

// ============================================================
// PROPERTY VERIFICATION
// ============================================================

adminRouter.get('/verifications', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const pending = await db.select({
    id: schema.properties.id,
    publicId: schema.properties.publicId,
    slug: schema.properties.slug,
    name: schema.properties.name,
    type: schema.properties.type,
    status: schema.properties.status,
    locality: schema.properties.locality,
    city: schema.properties.city,
    address: schema.properties.address,
    whatsappNumber: schema.properties.whatsappNumber,
    startingPrice: schema.properties.startingPrice,
    amenities: schema.properties.amenities,
    totalBeds: schema.properties.totalBeds,
    createdAt: schema.properties.createdAt,
    ownerName: schema.users.name,
    ownerEmail: schema.users.email,
  }).from(schema.properties)
    .innerJoin(schema.users, eq(schema.properties.ownerId, schema.users.id))
    .where(eq(schema.properties.status, 'SUBMITTED'))
    .orderBy(desc(schema.properties.createdAt));

  return apiSuccess(c, { properties: pending });
});

adminRouter.post('/verifications/:id/verify', async (c) => {
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

adminRouter.post('/verifications/:id/reject', async (c) => {
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
// OWNER MANAGEMENT
// ============================================================

adminRouter.get('/owners', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const owners = await db.select({
    id: schema.users.id,
    publicId: schema.users.publicId,
    name: schema.users.name,
    email: schema.users.email,
    phone: schema.users.phone,
    isActive: schema.users.isActive,
    createdAt: schema.users.createdAt,
    businessName: schema.ownerProfiles.businessName,
    isKycVerified: schema.ownerProfiles.isKycVerified,
  }).from(schema.users)
    .leftJoin(schema.ownerProfiles, eq(schema.users.id, schema.ownerProfiles.userId))
    .where(eq(schema.users.role, 'OWNER'))
    .orderBy(desc(schema.users.createdAt));

  // Get property count per owner
  const propertyCountsRaw = await db.select({
    ownerId: schema.properties.ownerId,
    count: sql<number>`count(*)`,
  }).from(schema.properties)
    .groupBy(schema.properties.ownerId);

  const propertyCounts: Record<string, number> = {};
  propertyCountsRaw.forEach((pc: any) => { propertyCounts[pc.ownerId] = Number(pc.count); });

  const enriched = owners.map(o => ({
    ...o,
    propertyCount: propertyCounts[o.id] || 0,
  }));

  return apiSuccess(c, { owners: enriched });
});

adminRouter.post('/owners/create', async (c) => {
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
    mustChangePassword: true,
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

  return apiSuccess(c, { message: 'Owner account created.' }, 201);
});

adminRouter.put('/owners/:id/toggle', async (c) => {
  const ownerId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const [owner] = await db.select({ isActive: schema.users.isActive })
    .from(schema.users)
    .where(and(eq(schema.users.id, ownerId), eq(schema.users.role, 'OWNER')))
    .limit(1);

  if (!owner) return apiError(c, 404, 'OWNER_NOT_FOUND', 'Owner not found.');

  await db.update(schema.users).set({
    isActive: !owner.isActive,
    updatedAt: new Date(),
  }).where(eq(schema.users.id, ownerId));

  return apiSuccess(c, { message: `Owner ${owner.isActive ? 'disabled' : 'enabled'}.` });
});

// ============================================================
// ALL PROPERTIES — Platform-wide view
// ============================================================

adminRouter.get('/properties', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const allProperties = await db.select({
    id: schema.properties.id,
    publicId: schema.properties.publicId,
    slug: schema.properties.slug,
    name: schema.properties.name,
    type: schema.properties.type,
    status: schema.properties.status,
    locality: schema.properties.locality,
    city: schema.properties.city,
    totalBeds: schema.properties.totalBeds,
    availableBeds: schema.properties.availableBeds,
    leadCount: schema.properties.leadCount,
    viewCount: schema.properties.viewCount,
    createdAt: schema.properties.createdAt,
    ownerName: schema.users.name,
    ownerEmail: schema.users.email,
  }).from(schema.properties)
    .innerJoin(schema.users, eq(schema.properties.ownerId, schema.users.id))
    .orderBy(desc(schema.properties.createdAt));

  return apiSuccess(c, { properties: allProperties });
});

// ============================================================
// LEADS — Platform-wide analytics
// ============================================================

adminRouter.get('/leads', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const leadsList = await db.select({
    id: schema.leads.id,
    customerName: schema.leads.customerName,
    customerPhone: schema.leads.customerPhone,
    source: schema.leads.source,
    createdAt: schema.leads.createdAt,
    propertyName: schema.properties.name,
    ownerName: schema.users.name,
  }).from(schema.leads)
    .innerJoin(schema.properties, eq(schema.leads.propertyId, schema.properties.id))
    .innerJoin(schema.users, eq(schema.leads.ownerId, schema.users.id))
    .orderBy(desc(schema.leads.createdAt))
    .limit(200);

  const [totalCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.leads);

  // Leads by source
  const bySource = await db.select({
    source: schema.leads.source,
    count: sql<number>`count(*)`,
  }).from(schema.leads).groupBy(schema.leads.source);

  return apiSuccess(c, {
    leads: leadsList,
    totalLeads: Number(totalCount?.count || 0),
    bySource,
  });
});

// ============================================================
// LOCALITY MANAGEMENT
// ============================================================

adminRouter.get('/localities', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const allLocalities = await db.select().from(schema.localities)
    .orderBy(schema.localities.area, schema.localities.name);
  return apiSuccess(c, { localities: allLocalities });
});

adminRouter.post('/localities', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.name || !body?.area) {
    return apiError(c, 400, 'MISSING_FIELDS', 'Name and area are required.');
  }

  const db = drizzle(c.env.DB, { schema });
  const now = new Date();

  const slug = `${body.area}-${body.name}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  await db.insert(schema.localities).values({
    id: crypto.randomUUID(),
    name: body.name.trim(),
    area: body.area.trim(),
    city: body.city?.trim() || 'Bengaluru',
    slug,
    isActive: true,
    propertyCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  return apiSuccess(c, { message: 'Locality created.', slug }, 201);
});

adminRouter.put('/localities/:id', async (c) => {
  const localityId = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const db = drizzle(c.env.DB, { schema });
  const updateData: any = { updatedAt: new Date() };

  if (body.name !== undefined) updateData.name = body.name.trim();
  if (body.area !== undefined) updateData.area = body.area.trim();
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  await db.update(schema.localities).set(updateData)
    .where(eq(schema.localities.id, localityId));

  return apiSuccess(c, { message: 'Locality updated.' });
});

// ============================================================
// BROADCAST
// ============================================================

adminRouter.post('/broadcast', async (c) => {
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

  return apiSuccess(c, { message: 'Broadcast pushed.' }, 201);
});

// ============================================================
// AUDIT LOGS
// ============================================================

adminRouter.get('/audit-logs', async (c) => {
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

export default adminRouter;
