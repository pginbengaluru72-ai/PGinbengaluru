import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, sql, and } from 'drizzle-orm';
import * as schema from '../db/schema';
import { hashPassword } from '../lib/crypto';
import { requireAuth, requireRole, verifyPropertyOwnership, apiError, apiSuccess, type AuthUser } from '../lib/middleware';

type Bindings = { DB: D1Database; BUCKET: R2Bucket };
type Variables = { user: AuthUser; requestId: string };

const ownerRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// All owner routes require authentication + OWNER role
ownerRouter.use('*', requireAuth());
ownerRouter.use('*', requireRole('OWNER'));

// ============================================================
// GET /api/owner/dashboard — Overview stats
// ============================================================
ownerRouter.get('/dashboard', async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  const [propertiesResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.properties)
    .where(eq(schema.properties.ownerId, user.id));

  const [bedsResult] = await db
    .select({
      total: sql<number>`count(*)`,
      available: sql<number>`sum(case when ${schema.beds.status} = 'AVAILABLE' then 1 else 0 end)`,
      occupied: sql<number>`sum(case when ${schema.beds.status} = 'OCCUPIED' then 1 else 0 end)`,
    })
    .from(schema.beds)
    .where(eq(schema.beds.propertyId, sql`(SELECT id FROM properties WHERE owner_id = ${user.id})`));

  const totalProperties = Number(propertiesResult?.count || 0);
  const totalBeds = Number(bedsResult?.total || 0);
  const availableBeds = Number(bedsResult?.available || 0);
  const occupiedBeds = Number(bedsResult?.occupied || 0);

  return apiSuccess(c, {
    totalProperties,
    totalBeds,
    availableBeds,
    occupiedBeds,
    occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
  });
});

// ============================================================
// GET /api/owner/properties — List owner's properties
// ============================================================
ownerRouter.get('/properties', async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  const properties = await db
    .select({
      id: schema.properties.id,
      publicId: schema.properties.publicId,
      name: schema.properties.name,
      type: schema.properties.type,
      status: schema.properties.status,
      locality: schema.properties.locality,
      city: schema.properties.city,
      totalBeds: schema.properties.totalBeds,
      availableBeds: schema.properties.availableBeds,
      startingPrice: schema.properties.startingPrice,
      avgRating: schema.properties.avgRating,
      createdAt: schema.properties.createdAt,
    })
    .from(schema.properties)
    .where(eq(schema.properties.ownerId, user.id))
    .orderBy(desc(schema.properties.createdAt));

  return apiSuccess(c, { properties });
});

// ============================================================
// GET /api/owner/complaints — List tickets for owner's properties
// ============================================================
ownerRouter.get('/complaints', async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  const tickets = await db
    .select({
      id: schema.complaints.id,
      publicId: schema.complaints.publicId,
      subject: schema.complaints.subject,
      description: schema.complaints.description,
      status: schema.complaints.status,
      createdAt: schema.complaints.createdAt,
      propertyName: schema.properties.name,
      reporterName: schema.users.name,
    })
    .from(schema.complaints)
    .innerJoin(schema.properties, eq(schema.complaints.propertyId, schema.properties.id))
    .innerJoin(schema.users, eq(schema.complaints.reporterId, schema.users.id))
    .where(eq(schema.properties.ownerId, user.id))
    .orderBy(desc(schema.complaints.createdAt));

  return apiSuccess(c, { tickets });
});

// ============================================================
// POST /api/owner/properties — Create new property (DRAFT)
// ============================================================
ownerRouter.post('/properties', async (c) => {
  const user = c.get('user');
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const { name, type, address, locality, city, description, whatsappNumber, pincode, startingPrice, amenities, listPublicly } = body;

  if (!name || !type || !address || !locality) {
    return apiError(c, 400, 'MISSING_FIELDS', 'Name, type, address, and locality are required.');
  }

  if (!['BOYS', 'GIRLS', 'COLIVING'].includes(type)) {
    return apiError(c, 400, 'INVALID_TYPE', 'Type must be BOYS, GIRLS, or COLIVING.');
  }

  const db = drizzle(c.env.DB, { schema });
  const now = new Date();
  const propertyId = crypto.randomUUID();
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  const publicId = `STY-PG-${timestamp}${random}`.toUpperCase();

  const finalStatus = listPublicly === true ? 'SUBMITTED' : 'DRAFT';

  await db.insert(schema.properties).values({
    id: propertyId,
    publicId,
    ownerId: user.id,
    name: name.trim(),
    description: description?.trim() || null,
    type,
    status: finalStatus,
    address: address.trim(),
    locality: locality.trim(),
    city: city?.trim() || 'Bengaluru',
    pincode: pincode?.trim() || null,
    whatsappNumber: whatsappNumber || null,
    startingPrice: startingPrice ? Number(startingPrice) : 0,
    amenities: amenities ? JSON.stringify(amenities) : null,
    createdAt: now,
    updatedAt: now,
  });

  // Log audit
  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    actorId: user.id,
    actorRole: user.role,
    action: 'PROPERTY_CREATED',
    entityType: 'property',
    entityId: propertyId,
    requestId: c.get('requestId'),
    createdAt: now,
  });

  return apiSuccess(c, { propertyId: publicId }, 201);
});

// ============================================================
// GET /api/owner/properties/:id — Get property detail (ownership enforced)
// ============================================================
ownerRouter.get('/properties/:id', async (c) => {
  const user = c.get('user');
  const propertyId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const rows = await db.select().from(schema.properties)
    .where(and(eq(schema.properties.id, propertyId), eq(schema.properties.ownerId, user.id)))
    .limit(1);

  if (rows.length === 0) {
    return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');
  }

  return apiSuccess(c, { property: rows[0] });
});

// ============================================================
// POST /api/owner/properties/:id/submit — Submit for verification
// ============================================================
ownerRouter.post('/properties/:id/submit', async (c) => {
  const user = c.get('user');
  const propertyId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const property = await verifyPropertyOwnership(db as any, user.id, propertyId);
  if (!property) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  await db.update(schema.properties).set({
    status: 'SUBMITTED',
    updatedAt: new Date(),
  }).where(and(eq(schema.properties.id, propertyId), eq(schema.properties.ownerId, user.id)));

  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    actorId: user.id,
    actorRole: user.role,
    action: 'PROPERTY_SUBMITTED',
    entityType: 'property',
    entityId: propertyId,
    requestId: c.get('requestId'),
    createdAt: new Date(),
  });

  return apiSuccess(c, { message: 'Property submitted for verification.' });
});

// ============================================================
// GET /api/owner/properties/:id/rooms — List rooms for property
// ============================================================
ownerRouter.get('/properties/:id/rooms', async (c) => {
  const user = c.get('user');
  const propertyId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const property = await verifyPropertyOwnership(db as any, user.id, propertyId);
  if (!property) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  const propertyRooms = await db.select().from(schema.rooms).where(eq(schema.rooms.propertyId, propertyId));
  return apiSuccess(c, { rooms: propertyRooms });
});

// ============================================================
// POST /api/owner/properties/:id/rooms — Create a new room
// ============================================================
ownerRouter.post('/properties/:id/rooms', async (c) => {
  const user = c.get('user');
  const propertyId = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const property = await verifyPropertyOwnership(drizzle(c.env.DB, { schema }) as any, user.id, propertyId);
  if (!property) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  const { roomNumber, sharingType, hasAc, hasAttachedBathroom } = body;
  if (!roomNumber || !sharingType) return apiError(c, 400, 'MISSING_FIELDS', 'Room number and sharing type are required.');

  // Safely parse sharingType from strings like "2 Sharing" to integer
  let parsedSharing = 1;
  if (typeof sharingType === 'string') {
    parsedSharing = parseInt(sharingType.replace(/\D/g, '')) || 1;
  } else if (typeof sharingType === 'number') {
    parsedSharing = sharingType;
  }

  const db = drizzle(c.env.DB, { schema });
  const now = new Date();
  const roomId = crypto.randomUUID();

  await db.insert(schema.rooms).values({
    id: roomId,
    propertyId,
    roomNumber,
    sharingType: parsedSharing,
    hasAc: hasAc || false,
    hasAttachedBathroom: hasAttachedBathroom || false,
    createdAt: now,
    updatedAt: now,
  });

  return apiSuccess(c, { roomId }, 201);
});

// ============================================================
// POST /api/owner/rooms/:id/beds — Create a bed in a room
// ============================================================
ownerRouter.post('/rooms/:id/beds', async (c) => {
  const user = c.get('user');
  const roomId = c.req.param('id');
  const body = await c.req.json().catch(() => null);

  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');
  
  const { label, monthlyRent } = body;
  if (!label || !monthlyRent) return apiError(c, 400, 'MISSING_FIELDS', 'Label and monthly rent are required.');

  const db = drizzle(c.env.DB, { schema });

  // verify room ownership via property
  const roomRows = await db.select().from(schema.rooms).where(eq(schema.rooms.id, roomId)).limit(1);
  if (roomRows.length === 0) return apiError(c, 404, 'ROOM_NOT_FOUND', 'Room not found.');
  
  const property = await verifyPropertyOwnership(db as any, user.id, roomRows[0].propertyId);
  if (!property) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  const now = new Date();
  const bedId = crypto.randomUUID();

  await db.insert(schema.beds).values({
    id: bedId,
    roomId,
    propertyId: roomRows[0].propertyId,
    label,
    monthlyRent: Number(monthlyRent),
    status: 'AVAILABLE',
    createdAt: now,
    updatedAt: now,
  });

  return apiSuccess(c, { bedId }, 201);
});

// ============================================================
// GET /api/owner/applications — Get pending applications
// ============================================================
ownerRouter.get('/applications', async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  // Join applications with properties owned by this owner
  const pendingApps = await db.select({
    id: schema.applications.id,
    publicId: schema.applications.publicId,
    status: schema.applications.status,
    preferredRoomType: schema.applications.preferredRoomType,
    preferredMoveIn: schema.applications.preferredMoveIn,
    message: schema.applications.message,
    createdAt: schema.applications.createdAt,
    customerName: schema.users.name,
    customerEmail: schema.users.email,
    propertyName: schema.properties.name,
  })
  .from(schema.applications)
  .innerJoin(schema.properties, eq(schema.applications.propertyId, schema.properties.id))
  .innerJoin(schema.users, eq(schema.applications.customerId, schema.users.id))
  .where(and(
    eq(schema.properties.ownerId, user.id),
    eq(schema.applications.status, 'PENDING')
  ))
  .orderBy(desc(schema.applications.createdAt));

  return apiSuccess(c, { applications: pendingApps });
});

// ============================================================
// POST /api/owner/applications/:id/accept — Accept application
// ============================================================
ownerRouter.post('/applications/:id/accept', async (c) => {
  const user = c.get('user');
  const appId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  // Verify ownership
  const appRows = await db.select({
    id: schema.applications.id,
    propertyId: schema.applications.propertyId,
    customerId: schema.applications.customerId
  }).from(schema.applications).where(eq(schema.applications.publicId, appId)).limit(1);

  if (appRows.length === 0) return apiError(c, 404, 'APPLICATION_NOT_FOUND', 'Application not found.');
  
  const property = await verifyPropertyOwnership(db as any, user.id, appRows[0].propertyId);
  if (!property) return apiError(c, 403, 'FORBIDDEN', 'Access denied.');

  const now = new Date();
  
  await db.update(schema.applications).set({
    status: 'ACCEPTED',
    respondedAt: now,
    updatedAt: now,
  }).where(eq(schema.applications.id, appRows[0].id));

  // Log audit
  await db.insert(schema.auditLogs).values({
    id: crypto.randomUUID(),
    actorId: user.id,
    actorRole: user.role,
    action: 'APPLICATION_ACCEPTED',
    entityType: 'application',
    entityId: appRows[0].id,
    requestId: c.get('requestId'),
    createdAt: now,
  });

  return apiSuccess(c, { message: 'Application accepted successfully.' });
});

// ============================================================
// POST /api/owner/upload — Upload media/documents
// ============================================================
ownerRouter.post('/upload', async (c) => {
  const user = c.get('user');
  const body = await c.req.parseBody().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const file = body['file'] as File;
  const propertyId = body['propertyId'] as string;

  if (!file || !propertyId) return apiError(c, 400, 'MISSING_FIELDS', 'File and propertyId are required.');

  // Validate file size (e.g. 10MB)
  if (file.size > 10 * 1024 * 1024) return apiError(c, 400, 'FILE_TOO_LARGE', 'File size exceeds 10MB limit.');

  // Validate mime type
  if (!file.type.startsWith('image/')) return apiError(c, 400, 'INVALID_FILE_TYPE', 'Only images are allowed.');

  const db = drizzle(c.env.DB, { schema });
  
  // Verify ownership
  const property = await verifyPropertyOwnership(db as any, user.id, propertyId);
  if (!property) return apiError(c, 403, 'FORBIDDEN', 'Access denied.');

  const fileExt = file.name.split('.').pop();
  // Don't trust original filename. Generate a secure random name.
  const secureFilename = `${crypto.randomUUID()}.${fileExt}`;
  const key = `properties/${propertyId}/gallery/${secureFilename}`;
  
  await c.env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });

  const url = `https://hsrpg-images.pginbengaluru72.workers.dev/${key}`;
  
  await db.insert(schema.propertyPhotos).values({
    id: crypto.randomUUID(),
    propertyId,
    r2Key: key,
    caption: '',
    isPrimary: false,
    createdAt: new Date(),
  });

  return apiSuccess(c, { url, key }, 201);
});

// ============================================================
// GET /api/owner/tenants — List tenants across owner's properties
// ============================================================
ownerRouter.get('/tenants', async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  // Get tenants based on assigned beds
  const tenants = await db
    .select({
      userId: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      phone: schema.users.phone,
      propertyName: schema.properties.name,
      roomNumber: schema.rooms.roomNumber,
      bedIdentifier: schema.beds.identifier,
    })
    .from(schema.users)
    .innerJoin(schema.beds, eq(schema.users.id, schema.beds.tenantId))
    .innerJoin(schema.rooms, eq(schema.beds.roomId, schema.rooms.id))
    .innerJoin(schema.properties, eq(schema.rooms.propertyId, schema.properties.id))
    .where(eq(schema.properties.ownerId, user.id))
    .orderBy(desc(schema.users.createdAt));

  return apiSuccess(c, { tenants });
});

// ============================================================
// POST /api/owner/tenants/create — Generate a tenant password & account
// ============================================================
ownerRouter.post('/tenants/create', async (c) => {
  const user = c.get('user');
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const { name, email, phone, propertyId } = body;

  if (!email || !name || !propertyId) {
    return apiError(c, 400, 'MISSING_FIELDS', 'Name, email, and propertyId are required.');
  }

  const db = drizzle(c.env.DB, { schema });

  // Verify ownership of the target property
  const [property] = await db.select().from(schema.properties)
    .where(and(eq(schema.properties.id, propertyId), eq(schema.properties.ownerId, user.id)))
    .limit(1);

  if (!property) {
    return apiError(c, 403, 'FORBIDDEN', 'You do not own this property or it does not exist.');
  }

  // Check if tenant already exists
  const [existingUser] = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase())).limit(1);
  if (existingUser) {
    return apiError(c, 400, 'USER_EXISTS', 'A user with this email already exists.');
  }

  // Generate random password
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const rawPassword = `${name.split(' ')[0].toUpperCase()}@${randomSuffix}`;
  const passwordHash = await hashPassword(rawPassword);

  const newUserId = crypto.randomUUID();
  const timestamp = Date.now().toString(36);
  const publicId = `STY-CUS-${timestamp}${randomSuffix}`.toUpperCase();
  const now = new Date();

  // Create User
  await db.insert(schema.users).values({
    id: newUserId,
    publicId,
    email: email.toLowerCase(),
    name,
    phone: phone || null,
    passwordHash,
    role: 'CUSTOMER',
    mustChangePassword: true, // Force change on first login
    createdAt: now,
    updatedAt: now,
  });

  // Create Profile
  await db.insert(schema.customerProfiles).values({
    id: crypto.randomUUID(),
    userId: newUserId,
    publicId: publicId,
    createdAt: now,
    updatedAt: now,
  });

  // (Optional) We could auto-assign them to a bed here if we passed a bedId, 
  // but for now, we just create the account and return the password.

  return apiSuccess(c, {
    tenant: { id: newUserId, name, email },
    generatedPassword: rawPassword,
    message: 'Tenant account created successfully.'
  }, 201);
});

export default ownerRouter;
