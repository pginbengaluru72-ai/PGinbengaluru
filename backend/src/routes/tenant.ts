import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, and, sql, like, gte, lte, inArray } from 'drizzle-orm';
import * as schema from '../db/schema';
import { requireAuth, requireRole, apiError, apiSuccess, type AuthUser } from '../lib/middleware';

type Bindings = { DB: D1Database };
type Variables = { user: AuthUser; requestId: string };

const customerRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ============================================================
// PUBLIC: GET /api/customer/properties — Search PGs (no auth needed)
// ============================================================
customerRouter.get('/properties', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
  const limit = Math.min(parseInt(c.req.query('limit') || '20', 10), 50);
  const offset = (page - 1) * limit;

  const city = c.req.query('city');
  const locality = c.req.query('locality');
  const type = c.req.query('type'); // BOYS, GIRLS, COLIVING
  const search = c.req.query('q');

  // Only show VERIFIED and PUBLISHED properties to customers
  let conditions = [inArray(schema.properties.status, ['VERIFIED', 'PUBLISHED'])];

  if (city) conditions.push(eq(schema.properties.city, city));
  if (locality) conditions.push(eq(schema.properties.locality, locality));
  if (type) {
    const typesArray = type.split(',').filter(t => ['BOYS', 'GIRLS', 'COLIVING'].includes(t));
    if (typesArray.length > 0) {
      conditions.push(inArray(schema.properties.type, typesArray as any));
    }
  }
  if (search) {
    conditions.push(like(schema.properties.name, `%${search}%`));
  }

  const properties = await db.select({
    id: schema.properties.id,
    publicId: schema.properties.publicId,
    name: schema.properties.name,
    type: schema.properties.type,
    locality: schema.properties.locality,
    city: schema.properties.city,
    startingPrice: schema.properties.startingPrice,
    availableBeds: schema.properties.availableBeds,
    avgRating: schema.properties.avgRating,
    reviewCount: schema.properties.reviewCount,
    amenities: schema.properties.amenities,
  }).from(schema.properties)
    .where(and(...conditions))
    .orderBy(desc(schema.properties.avgRating))
    .limit(limit)
    .offset(offset);

  const [total] = await db.select({ count: sql<number>`count(*)` })
    .from(schema.properties)
    .where(and(...conditions));

  return apiSuccess(c, {
    properties,
    pagination: { page, limit, total: Number(total?.count || 0) },
  });
});

// ============================================================
// PUBLIC: GET /api/customer/properties/:id — PG detail page
// ============================================================
customerRouter.get('/properties/:id', async (c) => {
  const publicId = c.req.param('id');
  const db = drizzle(c.env.DB, { schema });

  const rows = await db.select().from(schema.properties)
    .where(and(
      eq(schema.properties.publicId, publicId),
      inArray(schema.properties.status, ['VERIFIED', 'PUBLISHED'])
    ))
    .limit(1);

  if (rows.length === 0) {
    return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'PG not found or not yet published.');
  }

  const property = rows[0];

  // Fetch photos
  const photos = await db.select({
    id: schema.propertyPhotos.id,
    r2Key: schema.propertyPhotos.r2Key,
    caption: schema.propertyPhotos.caption,
    isPrimary: schema.propertyPhotos.isPrimary,
  }).from(schema.propertyPhotos)
    .where(eq(schema.propertyPhotos.propertyId, property.id))
    .orderBy(schema.propertyPhotos.sortOrder);

  // Fetch room types with bed availability
  const rooms = await db.select({
    sharingType: schema.rooms.sharingType,
    hasAc: schema.rooms.hasAc,
    hasAttachedBathroom: schema.rooms.hasAttachedBathroom,
  }).from(schema.rooms)
    .where(eq(schema.rooms.propertyId, property.id));

  // Fetch reviews
  const reviews = await db.select({
    rating: schema.reviews.rating,
    title: schema.reviews.title,
    body: schema.reviews.body,
    createdAt: schema.reviews.createdAt,
  }).from(schema.reviews)
    .where(and(
      eq(schema.reviews.propertyId, property.id),
      eq(schema.reviews.status, 'PUBLISHED')
    ))
    .orderBy(desc(schema.reviews.createdAt))
    .limit(10);

  return apiSuccess(c, {
    property: {
      ...property,
      // Strip internal fields
      ownerId: undefined,
      adminNotes: undefined,
      verifiedBy: undefined,
    },
    photos,
    roomTypes: rooms,
    reviews,
  });
});

// ============================================================
// PROTECTED: POST /api/customer/applications — Apply to a PG
// ============================================================
customerRouter.post('/applications', requireAuth(), requireRole('CUSTOMER'), async (c) => {
  const user = c.get('user');
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const { propertyId, preferredRoomType, preferredMoveIn, message } = body;
  if (!propertyId) return apiError(c, 400, 'MISSING_FIELDS', 'propertyId is required.');

  const db = drizzle(c.env.DB, { schema });

  // Verify property is valid
  const property = await db.select({ id: schema.properties.id })
    .from(schema.properties)
    .where(and(
      eq(schema.properties.publicId, propertyId),
      inArray(schema.properties.status, ['VERIFIED', 'PUBLISHED'])
    ))
    .limit(1);

  if (property.length === 0) {
    return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'PG not found or not accepting applications.');
  }

  const now = new Date();
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);

  await db.insert(schema.applications).values({
    id: crypto.randomUUID(),
    publicId: `STY-APP-${timestamp}${random}`.toUpperCase(),
    customerId: user.id,
    propertyId: property[0].id,
    preferredRoomType: preferredRoomType || null,
    preferredMoveIn: preferredMoveIn ? new Date(preferredMoveIn) : null,
    message: message?.trim() || null,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
  });

  return apiSuccess(c, { message: 'Application submitted successfully.' }, 201);
});

// ============================================================
// PROTECTED: GET /api/customer/applications — My applications
// ============================================================
customerRouter.get('/applications', requireAuth(), requireRole('CUSTOMER'), async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  const apps = await db.select({
    id: schema.applications.publicId,
    status: schema.applications.status,
    createdAt: schema.applications.createdAt,
    propertyName: schema.properties.name,
    propertyLocality: schema.properties.locality,
  }).from(schema.applications)
    .innerJoin(schema.properties, eq(schema.applications.propertyId, schema.properties.id))
    .where(eq(schema.applications.customerId, user.id))
    .orderBy(desc(schema.applications.createdAt));

  return apiSuccess(c, { applications: apps });
});

// ============================================================
// PROTECTED: POST /api/customer/favorites — Save a PG
// ============================================================
customerRouter.post('/favorites', requireAuth(), requireRole('CUSTOMER'), async (c) => {
  const user = c.get('user');
  const body = await c.req.json().catch(() => null);
  if (!body?.propertyId) return apiError(c, 400, 'MISSING_FIELDS', 'propertyId is required.');

  const db = drizzle(c.env.DB, { schema });

  await db.insert(schema.favorites).values({
    id: crypto.randomUUID(),
    customerId: user.id,
    propertyId: body.propertyId,
    createdAt: new Date(),
  }).onConflictDoNothing();

  return apiSuccess(c, { message: 'Saved to favorites.' }, 201);
});

// ============================================================
// PROTECTED: GET /api/customer/favorites — Get saved PGs
// ============================================================
customerRouter.get('/favorites', requireAuth(), requireRole('CUSTOMER'), async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  const favs = await db.select({
    id: schema.favorites.id,
    propertyId: schema.properties.id,
    publicId: schema.properties.publicId,
    name: schema.properties.name,
    locality: schema.properties.locality,
    city: schema.properties.city,
    type: schema.properties.type,
    startingPrice: schema.properties.startingPrice,
    createdAt: schema.favorites.createdAt,
  }).from(schema.favorites)
    .innerJoin(schema.properties, eq(schema.favorites.propertyId, schema.properties.id))
    .where(eq(schema.favorites.customerId, user.id))
    .orderBy(desc(schema.favorites.createdAt));

  return apiSuccess(c, { favorites: favs });
});

// ============================================================
// PROTECTED: GET /api/customer/complaints — Get Maintenance Tickets
// ============================================================
customerRouter.get('/complaints', requireAuth(), requireRole('CUSTOMER'), async (c) => {
  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  const tickets = await db.select({
    id: schema.complaints.publicId,
    subject: schema.complaints.subject,
    description: schema.complaints.description,
    status: schema.complaints.status,
    createdAt: schema.complaints.createdAt,
    resolvedAt: schema.complaints.resolvedAt,
  }).from(schema.complaints)
    .where(eq(schema.complaints.reporterId, user.id))
    .orderBy(desc(schema.complaints.createdAt));

  return apiSuccess(c, { tickets });
});

// ============================================================
// PROTECTED: POST /api/customer/complaints — Raise Ticket
// ============================================================
customerRouter.post('/complaints', requireAuth(), requireRole('CUSTOMER'), async (c) => {
  const user = c.get('user');
  const body = await c.req.json().catch(() => null);
  if (!body?.subject || !body?.description) return apiError(c, 400, 'MISSING_FIELDS', 'subject and description are required.');

  const db = drizzle(c.env.DB, { schema });
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);

  await db.insert(schema.complaints).values({
    id: crypto.randomUUID(),
    publicId: `STY-TKT-${timestamp}${random}`.toUpperCase(),
    reporterId: user.id,
    subject: body.subject.trim(),
    description: body.description.trim(),
    status: 'OPEN',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return apiSuccess(c, { message: 'Ticket raised successfully.' }, 201);
});

export default customerRouter;
