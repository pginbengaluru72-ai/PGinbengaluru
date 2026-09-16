import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, sql, and } from 'drizzle-orm';
import * as schema from '../db/schema';
import { requireAuth, requireRole, verifyPropertyOwnership, apiError, apiSuccess, type AuthUser } from '../lib/middleware';

type Bindings = { DB: D1Database; BUCKET: R2Bucket };
type Variables = { user: AuthUser; requestId: string };

const ownerRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// All owner routes require authentication + OWNER role
ownerRouter.use('*', requireAuth());
ownerRouter.use('*', requireRole('OWNER'));

// Helper: generate URL-safe slug
function generateSlug(name: string, locality: string): string {
  const base = `${name}-${locality}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

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

  const [roomsResult] = await db
    .select({
      totalBeds: sql<number>`coalesce(sum(${schema.rooms.totalBeds}), 0)`,
      availableBeds: sql<number>`coalesce(sum(${schema.rooms.availableBeds}), 0)`,
    })
    .from(schema.rooms)
    .innerJoin(schema.properties, eq(schema.rooms.propertyId, schema.properties.id))
    .where(eq(schema.properties.ownerId, user.id));

  const [leadsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.leads)
    .where(eq(schema.leads.ownerId, user.id));

  const totalProperties = Number(propertiesResult?.count || 0);
  const totalBeds = Number(roomsResult?.totalBeds || 0);
  const availableBeds = Number(roomsResult?.availableBeds || 0);
  const occupiedBeds = totalBeds - availableBeds;
  const totalLeads = Number(leadsResult?.count || 0);

  return apiSuccess(c, {
    totalProperties,
    totalBeds,
    availableBeds,
    occupiedBeds,
    occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
    totalLeads,
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
      slug: schema.properties.slug,
      name: schema.properties.name,
      type: schema.properties.type,
      status: schema.properties.status,
      locality: schema.properties.locality,
      city: schema.properties.city,
      totalBeds: schema.properties.totalBeds,
      availableBeds: schema.properties.availableBeds,
      startingPrice: schema.properties.startingPrice,
      leadCount: schema.properties.leadCount,
      viewCount: schema.properties.viewCount,
      createdAt: schema.properties.createdAt,
    })
    .from(schema.properties)
    .where(eq(schema.properties.ownerId, user.id))
    .orderBy(desc(schema.properties.createdAt));

  return apiSuccess(c, { properties });
});

// ============================================================
// POST /api/owner/properties — Create new property (DRAFT)
// ============================================================
ownerRouter.post('/properties', async (c) => {
  const user = c.get('user');
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const { name, type, address, locality, city, description, whatsappNumber, pincode, startingPrice, amenities, policies, localityId, listPublicly } = body;

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
  const slug = generateSlug(name, locality);

  const finalStatus = listPublicly === true ? 'SUBMITTED' : 'DRAFT';

  await db.insert(schema.properties).values({
    id: propertyId,
    publicId,
    slug,
    ownerId: user.id,
    name: name.trim(),
    description: description?.trim() || null,
    type,
    status: finalStatus,
    address: address.trim(),
    localityId: localityId || null,
    locality: locality.trim(),
    city: city?.trim() || 'Bengaluru',
    pincode: pincode?.trim() || null,
    whatsappNumber: whatsappNumber || null,
    startingPrice: startingPrice ? Number(startingPrice) : 0,
    amenities: amenities ? JSON.stringify(amenities) : null,
    policies: policies ? JSON.stringify(policies) : null,
    createdAt: now,
    updatedAt: now,
  });

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

  return apiSuccess(c, { propertyId: publicId, slug }, 201);
});

// ============================================================
// GET /api/owner/properties/:id — Get property detail
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

  // Fetch photos
  const photos = await db.select().from(schema.propertyPhotos)
    .where(eq(schema.propertyPhotos.propertyId, propertyId))
    .orderBy(schema.propertyPhotos.sortOrder);

  // Fetch rooms
  const roomsList = await db.select().from(schema.rooms)
    .where(eq(schema.rooms.propertyId, propertyId));

  return apiSuccess(c, { property: rows[0], photos, rooms: roomsList });
});

// ============================================================
// PUT /api/owner/properties/:id — Edit property
// ============================================================
ownerRouter.put('/properties/:id', async (c) => {
  const user = c.get('user');
  const propertyId = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const db = drizzle(c.env.DB, { schema });
  const property = await verifyPropertyOwnership(db as any, user.id, propertyId);
  if (!property) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  const updateData: any = { updatedAt: new Date() };
  if (body.name !== undefined) updateData.name = body.name.trim();
  if (body.description !== undefined) updateData.description = body.description?.trim() || null;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.address !== undefined) updateData.address = body.address.trim();
  if (body.locality !== undefined) updateData.locality = body.locality.trim();
  if (body.city !== undefined) updateData.city = body.city.trim();
  if (body.pincode !== undefined) updateData.pincode = body.pincode?.trim() || null;
  if (body.whatsappNumber !== undefined) updateData.whatsappNumber = body.whatsappNumber || null;
  if (body.startingPrice !== undefined) updateData.startingPrice = Number(body.startingPrice);
  if (body.amenities !== undefined) updateData.amenities = JSON.stringify(body.amenities);
  if (body.policies !== undefined) updateData.policies = JSON.stringify(body.policies);

  await db.update(schema.properties).set(updateData)
    .where(and(eq(schema.properties.id, propertyId), eq(schema.properties.ownerId, user.id)));

  return apiSuccess(c, { message: 'Property updated.' });
});

// ============================================================
// DELETE /api/owner/properties/:id — Soft delete (set DRAFT)
// ============================================================
ownerRouter.delete('/properties/:id', async (c) => {
  const user = c.get('user');
  const propertyId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const property = await verifyPropertyOwnership(db as any, user.id, propertyId);
  if (!property) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  await db.update(schema.properties).set({
    status: 'DRAFT',
    updatedAt: new Date(),
  }).where(and(eq(schema.properties.id, propertyId), eq(schema.properties.ownerId, user.id)));

  return apiSuccess(c, { message: 'Property archived.' });
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
// ROOM MANAGEMENT
// ============================================================

ownerRouter.get('/properties/:id/rooms', async (c) => {
  const user = c.get('user');
  const propertyId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const property = await verifyPropertyOwnership(db as any, user.id, propertyId);
  if (!property) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  const roomsList = await db.select().from(schema.rooms).where(eq(schema.rooms.propertyId, propertyId));
  return apiSuccess(c, { rooms: roomsList });
});

ownerRouter.post('/properties/:id/rooms', async (c) => {
  const user = c.get('user');
  const propertyId = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const db = drizzle(c.env.DB, { schema });
  const property = await verifyPropertyOwnership(db as any, user.id, propertyId);
  if (!property) return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');

  const { roomNumber, sharingType, totalBeds, monthlyRent, hasAc, hasAttachedBathroom } = body;
  if (!roomNumber || !sharingType || !monthlyRent) {
    return apiError(c, 400, 'MISSING_FIELDS', 'Room number, sharing type, and monthly rent are required.');
  }

  let parsedSharing = 1;
  if (typeof sharingType === 'string') {
    parsedSharing = parseInt(sharingType.replace(/\D/g, '')) || 1;
  } else if (typeof sharingType === 'number') {
    parsedSharing = sharingType;
  }

  const bedCount = totalBeds || parsedSharing;
  const now = new Date();
  const roomId = crypto.randomUUID();

  await db.insert(schema.rooms).values({
    id: roomId,
    propertyId,
    roomNumber,
    sharingType: parsedSharing,
    totalBeds: bedCount,
    availableBeds: bedCount,
    monthlyRent: Number(monthlyRent),
    hasAc: hasAc || false,
    hasAttachedBathroom: hasAttachedBathroom || false,
    createdAt: now,
    updatedAt: now,
  });

  // Recalculate property totals
  await recalculatePropertyBeds(db, propertyId);

  return apiSuccess(c, { roomId }, 201);
});

ownerRouter.put('/rooms/:id', async (c) => {
  const user = c.get('user');
  const roomId = c.req.param('id');
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const db = drizzle(c.env.DB, { schema });

  // Verify room ownership via property
  const [room] = await db.select().from(schema.rooms).where(eq(schema.rooms.id, roomId)).limit(1);
  if (!room) return apiError(c, 404, 'ROOM_NOT_FOUND', 'Room not found.');

  const property = await verifyPropertyOwnership(db as any, user.id, room.propertyId);
  if (!property) return apiError(c, 403, 'FORBIDDEN', 'Access denied.');

  const updateData: any = { updatedAt: new Date() };
  if (body.roomNumber !== undefined) updateData.roomNumber = body.roomNumber;
  if (body.sharingType !== undefined) updateData.sharingType = Number(body.sharingType);
  if (body.totalBeds !== undefined) updateData.totalBeds = Number(body.totalBeds);
  if (body.availableBeds !== undefined) updateData.availableBeds = Number(body.availableBeds);
  if (body.monthlyRent !== undefined) updateData.monthlyRent = Number(body.monthlyRent);
  if (body.hasAc !== undefined) updateData.hasAc = body.hasAc;
  if (body.hasAttachedBathroom !== undefined) updateData.hasAttachedBathroom = body.hasAttachedBathroom;

  await db.update(schema.rooms).set(updateData).where(eq(schema.rooms.id, roomId));

  // Recalculate property totals
  await recalculatePropertyBeds(db, room.propertyId);

  return apiSuccess(c, { message: 'Room updated.' });
});

ownerRouter.delete('/rooms/:id', async (c) => {
  const user = c.get('user');
  const roomId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const [room] = await db.select().from(schema.rooms).where(eq(schema.rooms.id, roomId)).limit(1);
  if (!room) return apiError(c, 404, 'ROOM_NOT_FOUND', 'Room not found.');

  const property = await verifyPropertyOwnership(db as any, user.id, room.propertyId);
  if (!property) return apiError(c, 403, 'FORBIDDEN', 'Access denied.');

  await db.delete(schema.rooms).where(eq(schema.rooms.id, roomId));

  // Recalculate property totals
  await recalculatePropertyBeds(db, room.propertyId);

  return apiSuccess(c, { message: 'Room deleted.' });
});

// Helper: recalculate totalBeds + availableBeds + startingPrice on property
async function recalculatePropertyBeds(db: any, propertyId: string) {
  const [stats] = await db.select({
    totalBeds: sql<number>`coalesce(sum(${schema.rooms.totalBeds}), 0)`,
    availableBeds: sql<number>`coalesce(sum(${schema.rooms.availableBeds}), 0)`,
    minPrice: sql<number>`min(${schema.rooms.monthlyRent})`,
  }).from(schema.rooms).where(eq(schema.rooms.propertyId, propertyId));

  await db.update(schema.properties).set({
    totalBeds: Number(stats?.totalBeds || 0),
    availableBeds: Number(stats?.availableBeds || 0),
    startingPrice: stats?.minPrice ? Number(stats.minPrice) : 0,
    updatedAt: new Date(),
  }).where(eq(schema.properties.id, propertyId));
}

// ============================================================
// MEDIA UPLOAD
// ============================================================

ownerRouter.post('/upload', async (c) => {
  const user = c.get('user');
  const body = await c.req.parseBody().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const file = body['file'] as File;
  const propertyId = body['propertyId'] as string;

  if (!file || !propertyId) return apiError(c, 400, 'MISSING_FIELDS', 'File and propertyId are required.');
  if (file.size > 10 * 1024 * 1024) return apiError(c, 400, 'FILE_TOO_LARGE', 'File size exceeds 10MB limit.');
  if (!file.type.startsWith('image/')) return apiError(c, 400, 'INVALID_FILE_TYPE', 'Only images are allowed.');

  const db = drizzle(c.env.DB, { schema });
  const property = await verifyPropertyOwnership(db as any, user.id, propertyId);
  if (!property) return apiError(c, 403, 'FORBIDDEN', 'Access denied.');

  const fileExt = file.name.split('.').pop();
  const secureFilename = `${crypto.randomUUID()}.${fileExt}`;
  const key = `properties/${propertyId}/gallery/${secureFilename}`;

  await c.env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });

  const url = `https://hsrpg-images.pginbengaluru72.workers.dev/${key}`;

  // Check if this is the first photo (make it primary)
  const existingPhotos = await db.select({ id: schema.propertyPhotos.id })
    .from(schema.propertyPhotos)
    .where(eq(schema.propertyPhotos.propertyId, propertyId))
    .limit(1);

  await db.insert(schema.propertyPhotos).values({
    id: crypto.randomUUID(),
    propertyId,
    r2Key: key,
    caption: '',
    isPrimary: existingPhotos.length === 0, // First photo is primary
    createdAt: new Date(),
  });

  return apiSuccess(c, { url, key }, 201);
});

// ============================================================
// LEADS — What owner cares about most
// ============================================================

ownerRouter.get('/leads', async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  const leadsList = await db.select({
    id: schema.leads.id,
    customerName: schema.leads.customerName,
    customerPhone: schema.leads.customerPhone,
    customerEmail: schema.leads.customerEmail,
    source: schema.leads.source,
    createdAt: schema.leads.createdAt,
    propertyName: schema.properties.name,
    propertyId: schema.properties.publicId,
  }).from(schema.leads)
    .innerJoin(schema.properties, eq(schema.leads.propertyId, schema.properties.id))
    .where(eq(schema.leads.ownerId, user.id))
    .orderBy(desc(schema.leads.createdAt))
    .limit(100);

  return apiSuccess(c, { leads: leadsList });
});

export default ownerRouter;
