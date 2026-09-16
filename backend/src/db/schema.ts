import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

// ============================================================
// USERS & AUTH — Admins + Owners only
// ============================================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['OWNER', 'SUPER_ADMIN'] }).notNull().default('OWNER'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  mustChangePassword: integer('must_change_password', { mode: 'boolean' }).notNull().default(false),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_users_email').on(table.email),
  index('idx_users_role').on(table.role),
  index('idx_users_public_id').on(table.publicId),
]);

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_sessions_user').on(table.userId),
  index('idx_sessions_token').on(table.tokenHash),
]);

// ============================================================
// OWNER PROFILES
// ============================================================

export const ownerProfiles = sqliteTable('owner_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  publicId: text('public_id').notNull().unique(),
  businessName: text('business_name'),
  panNumber: text('pan_number'),
  gstNumber: text('gst_number'),
  address: text('address'),
  city: text('city').notNull().default('Bengaluru'),
  isKycVerified: integer('is_kyc_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ============================================================
// PROPERTIES — The core entity
// ============================================================

export const properties = sqliteTable('properties', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  slug: text('slug').notNull().unique(), // SEO-friendly URL slug
  ownerId: text('owner_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['BOYS', 'GIRLS', 'COLIVING'] }).notNull(),
  status: text('status', {
    enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'PUBLISHED', 'REJECTED', 'SUSPENDED']
  }).notNull().default('DRAFT'),
  address: text('address').notNull(),
  localityId: text('locality_id').references(() => localities.id),
  locality: text('locality').notNull(), // denormalized for fast queries
  city: text('city').notNull().default('Bengaluru'),
  pincode: text('pincode'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  whatsappNumber: text('whatsapp_number'),
  // Amenities as JSON string
  amenities: text('amenities'), // JSON: { wifi, food, ac, laundry, parking, gym, ... }
  policies: text('policies'), // JSON: { gateClosing, visitors, smoking, ... }
  startingPrice: integer('starting_price'), // Lowest room price in rupees
  totalBeds: integer('total_beds').notNull().default(0),
  availableBeds: integer('available_beds').notNull().default(0),
  avgRating: real('avg_rating').default(0),
  reviewCount: integer('review_count').notNull().default(0),
  leadCount: integer('lead_count').notNull().default(0), // total leads generated
  viewCount: integer('view_count').notNull().default(0), // page views
  adminNotes: text('admin_notes'),
  verifiedAt: integer('verified_at', { mode: 'timestamp' }),
  verifiedBy: text('verified_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_properties_owner').on(table.ownerId),
  index('idx_properties_status').on(table.status),
  index('idx_properties_locality').on(table.locality),
  index('idx_properties_type').on(table.type),
  index('idx_properties_city').on(table.city),
  index('idx_properties_slug').on(table.slug),
]);

export const propertyPhotos = sqliteTable('property_photos', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  r2Key: text('r2_key').notNull(),
  caption: text('caption'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_photos_property').on(table.propertyId),
]);

// ============================================================
// ROOMS — Simplified (absorbs beds)
// ============================================================

export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  roomNumber: text('room_number').notNull(),
  sharingType: integer('sharing_type').notNull(), // 1=single, 2=double, 3=triple, etc.
  totalBeds: integer('total_beds').notNull().default(1),
  availableBeds: integer('available_beds').notNull().default(1),
  monthlyRent: integer('monthly_rent').notNull(), // per bed price in rupees
  hasAc: integer('has_ac', { mode: 'boolean' }).notNull().default(false),
  hasAttachedBathroom: integer('has_attached_bathroom', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_rooms_property').on(table.propertyId),
]);

// ============================================================
// LOCALITIES — Proper table for service areas
// ============================================================

export const localities = sqliteTable('localities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),          // "Sector 2"
  area: text('area').notNull(),           // "HSR Layout"
  city: text('city').notNull(),           // "Bengaluru"
  slug: text('slug').notNull().unique(),  // "hsr-layout-sector-2"
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  propertyCount: integer('property_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_localities_slug').on(table.slug),
  index('idx_localities_city').on(table.city),
  index('idx_localities_active').on(table.isActive),
]);

// ============================================================
// LEADS — The money table. Track customer interest.
// ============================================================

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull().references(() => properties.id),
  ownerId: text('owner_id').notNull().references(() => users.id),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  customerEmail: text('customer_email'),
  source: text('source', {
    enum: ['WHATSAPP_CLICK', 'PHONE_CLICK', 'CONTACT_FORM']
  }).notNull(),
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_leads_property').on(table.propertyId),
  index('idx_leads_owner').on(table.ownerId),
  index('idx_leads_created').on(table.createdAt),
]);

// ============================================================
// COMPLAINTS — Owner support tickets to admin
// ============================================================

export const complaints = sqliteTable('complaints', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  reporterId: text('reporter_id').notNull().references(() => users.id),
  propertyId: text('property_id').references(() => properties.id),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  status: text('status', {
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
  }).notNull().default('OPEN'),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_complaints_reporter').on(table.reporterId),
  index('idx_complaints_status').on(table.status),
]);

// ============================================================
// AUDIT LOGS
// ============================================================

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').references(() => users.id),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  metadata: text('metadata'), // JSON
  requestId: text('request_id'),
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_audit_actor').on(table.actorId),
  index('idx_audit_entity').on(table.entityType, table.entityId),
  index('idx_audit_action').on(table.action),
  index('idx_audit_created').on(table.createdAt),
]);

// ============================================================
// PLATFORM SETTINGS
// ============================================================

export const platformSettings = sqliteTable('platform_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedBy: text('updated_by').references(() => users.id),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
