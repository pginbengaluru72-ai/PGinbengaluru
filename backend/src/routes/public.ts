import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, and, sql, like, inArray, gte, lte } from 'drizzle-orm';
import * as schema from '../db/schema';
import { apiError, apiSuccess } from '../lib/middleware';

type Bindings = { DB: D1Database };
type Variables = { requestId: string };

const publicRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ============================================================
// GET /api/public/properties — Search PGs (no auth)
// ============================================================
publicRouter.get('/properties', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
  const limit = Math.min(parseInt(c.req.query('limit') || '20', 10), 50);
  const offset = (page - 1) * limit;

  const locality = c.req.query('locality');
  const type = c.req.query('type');
  const search = c.req.query('q');
  const minPrice = c.req.query('minPrice');
  const maxPrice = c.req.query('maxPrice');
  const localitySlug = c.req.query('localitySlug');

  // Only show VERIFIED/PUBLISHED properties
  let conditions: any[] = [
    inArray(schema.properties.status, ['VERIFIED', 'PUBLISHED'])
  ];

  if (locality) conditions.push(eq(schema.properties.locality, locality));
  if (localitySlug) {
    // Join with localities to filter by slug
    // For now, we do a subquery approach
  }
  if (type) {
    const typesArray = type.split(',').filter(t => ['BOYS', 'GIRLS', 'COLIVING'].includes(t));
    if (typesArray.length > 0) {
      conditions.push(inArray(schema.properties.type, typesArray as any));
    }
  }
  if (search) {
    conditions.push(like(schema.properties.name, `%${search}%`));
  }
  if (minPrice) {
    conditions.push(gte(schema.properties.startingPrice, parseInt(minPrice, 10)));
  }
  if (maxPrice) {
    conditions.push(lte(schema.properties.startingPrice, parseInt(maxPrice, 10)));
  }

  const properties = await db.select({
    id: schema.properties.id,
    publicId: schema.properties.publicId,
    slug: schema.properties.slug,
    name: schema.properties.name,
    type: schema.properties.type,
    locality: schema.properties.locality,
    city: schema.properties.city,
    startingPrice: schema.properties.startingPrice,
    totalBeds: schema.properties.totalBeds,
    availableBeds: schema.properties.availableBeds,
    avgRating: schema.properties.avgRating,
    reviewCount: schema.properties.reviewCount,
    amenities: schema.properties.amenities,
    description: schema.properties.description,
  }).from(schema.properties)
    .where(and(...conditions))
    .orderBy(desc(schema.properties.createdAt))
    .limit(limit)
    .offset(offset);

  const [total] = await db.select({ count: sql<number>`count(*)` })
    .from(schema.properties)
    .where(and(...conditions));

  // Fetch primary photos for all properties
  const propertyIds = properties.map(p => p.id);
  let photosMap: Record<string, string> = {};
  if (propertyIds.length > 0) {
    const photos = await db.select({
      propertyId: schema.propertyPhotos.propertyId,
      r2Key: schema.propertyPhotos.r2Key,
    }).from(schema.propertyPhotos)
      .where(and(
        inArray(schema.propertyPhotos.propertyId, propertyIds),
        eq(schema.propertyPhotos.isPrimary, true)
      ));
    photos.forEach(p => { photosMap[p.propertyId] = p.r2Key; });
  }

  const enriched = properties.map(p => ({
    ...p,
    primaryPhoto: photosMap[p.id] || null,
  }));

  return apiSuccess(c, {
    properties: enriched,
    pagination: { page, limit, total: Number(total?.count || 0) },
  });
});

// ============================================================
// GET /api/public/properties/:slug — PG detail (no auth)
// ============================================================
publicRouter.get('/properties/:slug', async (c) => {
  const slug = c.req.param('slug');
  const db = drizzle(c.env.DB, { schema });

  const rows = await db.select().from(schema.properties)
    .where(and(
      eq(schema.properties.slug, slug),
      inArray(schema.properties.status, ['VERIFIED', 'PUBLISHED'])
    ))
    .limit(1);

  if (rows.length === 0) {
    return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'PG not found or not yet published.');
  }

  const property = rows[0];

  // Increment view count (fire and forget)
  db.update(schema.properties).set({
    viewCount: sql`${schema.properties.viewCount} + 1`,
  }).where(eq(schema.properties.id, property.id)).execute().catch(() => {});

  // Fetch photos
  const photos = await db.select({
    id: schema.propertyPhotos.id,
    r2Key: schema.propertyPhotos.r2Key,
    caption: schema.propertyPhotos.caption,
    isPrimary: schema.propertyPhotos.isPrimary,
  }).from(schema.propertyPhotos)
    .where(eq(schema.propertyPhotos.propertyId, property.id))
    .orderBy(schema.propertyPhotos.sortOrder);

  // Fetch room types
  const roomTypes = await db.select({
    id: schema.rooms.id,
    roomNumber: schema.rooms.roomNumber,
    sharingType: schema.rooms.sharingType,
    totalBeds: schema.rooms.totalBeds,
    availableBeds: schema.rooms.availableBeds,
    monthlyRent: schema.rooms.monthlyRent,
    hasAc: schema.rooms.hasAc,
    hasAttachedBathroom: schema.rooms.hasAttachedBathroom,
  }).from(schema.rooms)
    .where(eq(schema.rooms.propertyId, property.id));

  // Fetch owner info (limited)
  const [owner] = await db.select({
    name: schema.users.name,
  }).from(schema.users)
    .where(eq(schema.users.id, property.ownerId))
    .limit(1);

  return apiSuccess(c, {
    property: {
      id: property.publicId,
      slug: property.slug,
      name: property.name,
      description: property.description,
      type: property.type,
      address: property.address,
      locality: property.locality,
      city: property.city,
      pincode: property.pincode,
      whatsappNumber: property.whatsappNumber,
      amenities: property.amenities,
      policies: property.policies,
      startingPrice: property.startingPrice,
      totalBeds: property.totalBeds,
      availableBeds: property.availableBeds,
      avgRating: property.avgRating,
      reviewCount: property.reviewCount,
      verifiedAt: property.verifiedAt,
    },
    photos,
    roomTypes,
    ownerName: owner?.name || 'Property Owner',
  });
});

// ============================================================
// GET /api/public/localities — Active service areas
// ============================================================
publicRouter.get('/localities', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const activeLocalities = await db.select({
    id: schema.localities.id,
    name: schema.localities.name,
    area: schema.localities.area,
    city: schema.localities.city,
    slug: schema.localities.slug,
    propertyCount: schema.localities.propertyCount,
  }).from(schema.localities)
    .where(eq(schema.localities.isActive, true))
    .orderBy(schema.localities.area, schema.localities.name);

  return apiSuccess(c, { localities: activeLocalities });
});

// ============================================================
// GET /api/public/localities/:slug — Locality detail
// ============================================================
publicRouter.get('/localities/:slug', async (c) => {
  const slug = c.req.param('slug');
  const db = drizzle(c.env.DB, { schema });

  const [locality] = await db.select().from(schema.localities)
    .where(and(eq(schema.localities.slug, slug), eq(schema.localities.isActive, true)))
    .limit(1);

  if (!locality) {
    return apiError(c, 404, 'LOCALITY_NOT_FOUND', 'Locality not found.');
  }

  // Fetch properties in this locality
  const properties = await db.select({
    id: schema.properties.id,
    publicId: schema.properties.publicId,
    slug: schema.properties.slug,
    name: schema.properties.name,
    type: schema.properties.type,
    locality: schema.properties.locality,
    city: schema.properties.city,
    startingPrice: schema.properties.startingPrice,
    availableBeds: schema.properties.availableBeds,
    amenities: schema.properties.amenities,
  }).from(schema.properties)
    .where(and(
      eq(schema.properties.localityId, locality.id),
      inArray(schema.properties.status, ['VERIFIED', 'PUBLISHED'])
    ))
    .orderBy(desc(schema.properties.createdAt));

  return apiSuccess(c, { locality, properties });
});

// ============================================================
// POST /api/public/leads — Log a customer lead
// ============================================================
publicRouter.post('/leads', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.propertyId || !body?.source) {
    return apiError(c, 400, 'MISSING_FIELDS', 'propertyId and source are required.');
  }

  const validSources = ['WHATSAPP_CLICK', 'PHONE_CLICK', 'CONTACT_FORM'];
  if (!validSources.includes(body.source)) {
    return apiError(c, 400, 'INVALID_SOURCE', 'Invalid lead source.');
  }

  const db = drizzle(c.env.DB, { schema });

  // Get property and owner
  const [property] = await db.select({
    id: schema.properties.id,
    ownerId: schema.properties.ownerId,
  }).from(schema.properties)
    .where(eq(schema.properties.publicId, body.propertyId))
    .limit(1);

  if (!property) {
    return apiError(c, 404, 'PROPERTY_NOT_FOUND', 'Property not found.');
  }

  const now = new Date();

  await db.insert(schema.leads).values({
    id: crypto.randomUUID(),
    propertyId: property.id,
    ownerId: property.ownerId,
    customerName: body.customerName?.trim() || null,
    customerPhone: body.customerPhone?.trim() || null,
    customerEmail: body.customerEmail?.trim() || null,
    source: body.source,
    ipAddress: c.req.header('CF-Connecting-IP') || null,
    createdAt: now,
  });

  // Increment lead count (fire and forget)
  db.update(schema.properties).set({
    leadCount: sql`${schema.properties.leadCount} + 1`,
  }).where(eq(schema.properties.id, property.id)).execute().catch(() => {});

  return apiSuccess(c, { message: 'Lead recorded.' }, 201);
});

export default publicRouter;
