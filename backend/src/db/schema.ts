import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

// ============================================================
// USERS & AUTH
// ============================================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Internal UUID
  publicId: text('public_id').notNull().unique(), // STY-USR-000001
  email: text('email').notNull().unique(),
  phone: text('phone'),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['CUSTOMER', 'OWNER', 'SUPER_ADMIN'] }).notNull().default('CUSTOMER'),
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
  tokenHash: text('token_hash').notNull(), // Only store hashed tokens
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_sessions_user').on(table.userId),
  index('idx_sessions_token').on(table.tokenHash),
]);

// ============================================================
// OWNER & CUSTOMER PROFILES
// ============================================================

export const ownerProfiles = sqliteTable('owner_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  publicId: text('public_id').notNull().unique(), // STY-OWN-000001
  businessName: text('business_name'),
  panNumber: text('pan_number'),
  gstNumber: text('gst_number'),
  bankAccountNumber: text('bank_account_number'),
  bankIfsc: text('bank_ifsc'),
  bankName: text('bank_name'),
  address: text('address'),
  city: text('city').notNull().default('Bengaluru'),
  isKycVerified: integer('is_kyc_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const customerProfiles = sqliteTable('customer_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  publicId: text('public_id').notNull().unique(), // STY-CUS-000001
  college: text('college'),
  course: text('course'),
  emergencyContactName: text('emergency_contact_name'),
  emergencyContactPhone: text('emergency_contact_phone'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ============================================================
// PROPERTIES
// ============================================================

export const properties = sqliteTable('properties', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(), // STY-PG-000001
  ownerId: text('owner_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['BOYS', 'GIRLS', 'COLIVING'] }).notNull(),
  status: text('status', {
    enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'VERIFIED', 'PUBLISHED', 'REJECTED', 'SUSPENDED']
  }).notNull().default('DRAFT'),
  address: text('address').notNull(),
  locality: text('locality').notNull(),
  city: text('city').notNull().default('Bengaluru'),
  pincode: text('pincode'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  whatsappNumber: text('whatsapp_number'),
  // Amenities as JSON string
  amenities: text('amenities'), // JSON: { wifi, food, ac, laundry, parking, gym, ... }
  policies: text('policies'), // JSON: { gateClosing, visitors, smoking, ... }
  startingPrice: integer('starting_price'), // Lowest bed price in paise
  totalBeds: integer('total_beds').notNull().default(0),
  availableBeds: integer('available_beds').notNull().default(0),
  avgRating: real('avg_rating').default(0),
  reviewCount: integer('review_count').notNull().default(0),
  adminNotes: text('admin_notes'), // Internal notes from Super Admin
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
]);

export const propertyPhotos = sqliteTable('property_photos', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  r2Key: text('r2_key').notNull(), // R2 object key
  caption: text('caption'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_photos_property').on(table.propertyId),
]);

export const propertyDocuments = sqliteTable('property_documents', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  r2Key: text('r2_key').notNull(),
  documentType: text('document_type').notNull(), // 'license', 'ownership_proof', etc.
  status: text('status', { enum: ['PENDING', 'VERIFIED', 'REJECTED'] }).notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ============================================================
// BUILDINGS, FLOORS, ROOMS, BEDS
// ============================================================

export const buildings = sqliteTable('buildings', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // "Main Building", "Block A"
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_buildings_property').on(table.propertyId),
]);

export const floors = sqliteTable('floors', {
  id: text('id').primaryKey(),
  buildingId: text('building_id').notNull().references(() => buildings.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // "Ground Floor", "1st Floor"
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_floors_building').on(table.buildingId),
]);

export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  floorId: text('floor_id').references(() => floors.id),
  roomNumber: text('room_number').notNull(),
  sharingType: integer('sharing_type').notNull(), // 1=single, 2=double, 3=triple, etc.
  hasAc: integer('has_ac', { mode: 'boolean' }).notNull().default(false),
  hasAttachedBathroom: integer('has_attached_bathroom', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_rooms_property').on(table.propertyId),
  index('idx_rooms_floor').on(table.floorId),
]);

export const beds = sqliteTable('beds', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  propertyId: text('property_id').notNull().references(() => properties.id),
  label: text('label'), // "Bed A", "Bed B"
  monthlyRent: integer('monthly_rent').notNull(), // In paise (₹8500 = 850000)
  status: text('status', {
    enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'BLOCKED']
  }).notNull().default('AVAILABLE'),
  availableFrom: integer('available_from', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_beds_room').on(table.roomId),
  index('idx_beds_property').on(table.propertyId),
  index('idx_beds_status').on(table.status),
]);

// ============================================================
// TENANTS & BED ASSIGNMENTS
// ============================================================

export const bedAssignments = sqliteTable('bed_assignments', {
  id: text('id').primaryKey(),
  bedId: text('bed_id').notNull().references(() => beds.id),
  tenantUserId: text('tenant_user_id').notNull().references(() => users.id),
  propertyId: text('property_id').notNull().references(() => properties.id),
  monthlyRent: integer('monthly_rent').notNull(),
  moveInDate: integer('move_in_date', { mode: 'timestamp' }).notNull(),
  moveOutDate: integer('move_out_date', { mode: 'timestamp' }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_assignments_bed').on(table.bedId),
  index('idx_assignments_tenant').on(table.tenantUserId),
  index('idx_assignments_property').on(table.propertyId),
  index('idx_assignments_active').on(table.isActive),
]);

// ============================================================
// KYC
// ============================================================

export const kycVerifications = sqliteTable('kyc_verifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  documentType: text('document_type').notNull(), // 'aadhaar', 'pan', 'college_id'
  r2Key: text('r2_key').notNull(), // Private R2 path
  status: text('status', {
    enum: ['PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED']
  }).notNull().default('PENDING'),
  rejectionReason: text('rejection_reason'),
  verifiedBy: text('verified_by').references(() => users.id),
  verifiedAt: integer('verified_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_kyc_user').on(table.userId),
  index('idx_kyc_status').on(table.status),
]);

// ============================================================
// APPLICATIONS & BOOKINGS
// ============================================================

export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(), // STY-APP-000001
  customerId: text('customer_id').notNull().references(() => users.id),
  propertyId: text('property_id').notNull().references(() => properties.id),
  preferredRoomType: integer('preferred_room_type'), // sharing type
  preferredMoveIn: integer('preferred_move_in', { mode: 'timestamp' }),
  message: text('message'),
  status: text('status', {
    enum: ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'EXPIRED']
  }).notNull().default('PENDING'),
  respondedAt: integer('responded_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_applications_customer').on(table.customerId),
  index('idx_applications_property').on(table.propertyId),
  index('idx_applications_status').on(table.status),
]);

export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(), // STY-BKG-000001
  applicationId: text('application_id').references(() => applications.id),
  customerId: text('customer_id').notNull().references(() => users.id),
  propertyId: text('property_id').notNull().references(() => properties.id),
  bedId: text('bed_id').notNull().references(() => beds.id),
  status: text('status', {
    enum: ['PENDING', 'RESERVED', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'COMPLETED']
  }).notNull().default('PENDING'),
  moveInDate: integer('move_in_date', { mode: 'timestamp' }).notNull(),
  reservedUntil: integer('reserved_until', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_bookings_customer').on(table.customerId),
  index('idx_bookings_property').on(table.propertyId),
  index('idx_bookings_bed').on(table.bedId),
  index('idx_bookings_status').on(table.status),
]);

// ============================================================
// RENT BILLING
// ============================================================

export const rentInvoices = sqliteTable('rent_invoices', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(), // STY-INV-000001
  assignmentId: text('assignment_id').notNull().references(() => bedAssignments.id),
  tenantUserId: text('tenant_user_id').notNull().references(() => users.id),
  propertyId: text('property_id').notNull().references(() => properties.id),
  billingMonth: text('billing_month').notNull(), // "2026-07"
  baseRent: integer('base_rent').notNull(), // paise
  foodCharge: integer('food_charge').notNull().default(0),
  electricityCharge: integer('electricity_charge').notNull().default(0),
  maintenanceCharge: integer('maintenance_charge').notNull().default(0),
  otherCharges: integer('other_charges').notNull().default(0),
  discount: integer('discount').notNull().default(0),
  lateFee: integer('late_fee').notNull().default(0),
  totalAmount: integer('total_amount').notNull(), // paise
  paidAmount: integer('paid_amount').notNull().default(0),
  status: text('status', {
    enum: ['DRAFT', 'ISSUED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'VOID']
  }).notNull().default('DRAFT'),
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  issuedAt: integer('issued_at', { mode: 'timestamp' }),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_invoices_tenant').on(table.tenantUserId),
  index('idx_invoices_property').on(table.propertyId),
  index('idx_invoices_status').on(table.status),
  index('idx_invoices_month').on(table.billingMonth),
]);

export const rentPayments = sqliteTable('rent_payments', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull().references(() => rentInvoices.id),
  amount: integer('amount').notNull(), // paise
  paymentMethod: text('payment_method'), // 'upi', 'cash', 'bank_transfer'
  providerPaymentId: text('provider_payment_id'), // Razorpay payment ID
  providerOrderId: text('provider_order_id'),
  status: text('status', {
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED']
  }).notNull().default('PENDING'),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_payments_invoice').on(table.invoiceId),
  index('idx_payments_provider').on(table.providerPaymentId),
]);

// ============================================================
// STAYSURE OWNER SUBSCRIPTIONS
// ============================================================

export const subscriptionPlans = sqliteTable('subscription_plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // 'STARTER', 'GROWTH', 'PRO'
  displayName: text('display_name').notNull(),
  priceMonthly: integer('price_monthly').notNull(), // paise
  maxProperties: integer('max_properties').notNull(),
  maxBeds: integer('max_beds').notNull(),
  features: text('features'), // JSON
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const ownerSubscriptions = sqliteTable('owner_subscriptions', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  planId: text('plan_id').notNull().references(() => subscriptionPlans.id),
  status: text('status', {
    enum: ['ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED', 'FREE_TRIAL']
  }).notNull().default('FREE_TRIAL'),
  currentPeriodStart: integer('current_period_start', { mode: 'timestamp' }).notNull(),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }).notNull(),
  cancelledAt: integer('cancelled_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_subs_owner').on(table.ownerId),
  index('idx_subs_status').on(table.status),
]);

export const subscriptionInvoices = sqliteTable('subscription_invoices', {
  id: text('id').primaryKey(),
  subscriptionId: text('subscription_id').notNull().references(() => ownerSubscriptions.id),
  ownerId: text('owner_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  status: text('status', {
    enum: ['PENDING', 'PAID', 'FAILED', 'VOID']
  }).notNull().default('PENDING'),
  providerPaymentId: text('provider_payment_id'),
  billingPeriod: text('billing_period').notNull(), // "2026-07"
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_sub_inv_owner').on(table.ownerId),
]);

// ============================================================
// REVIEWS & COMPLAINTS
// ============================================================

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  propertyId: text('property_id').notNull().references(() => properties.id),
  customerId: text('customer_id').notNull().references(() => users.id),
  bookingId: text('booking_id').references(() => bookings.id),
  rating: integer('rating').notNull(), // 1-5
  title: text('title'),
  body: text('body'),
  status: text('status', {
    enum: ['PENDING', 'PUBLISHED', 'HIDDEN', 'FLAGGED']
  }).notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_reviews_property').on(table.propertyId),
  index('idx_reviews_customer').on(table.customerId),
]);

export const complaints = sqliteTable('complaints', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(),
  reporterId: text('reporter_id').notNull().references(() => users.id),
  propertyId: text('property_id').references(() => properties.id),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  status: text('status', {
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED']
  }).notNull().default('OPEN'),
  assignedTo: text('assigned_to').references(() => users.id),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_complaints_reporter').on(table.reporterId),
  index('idx_complaints_property').on(table.propertyId),
  index('idx_complaints_status').on(table.status),
]);

// ============================================================
// NOTIFICATIONS
// ============================================================

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'APPLICATION_RECEIVED', 'PAYMENT_SUCCESS', etc.
  title: text('title').notNull(),
  message: text('message').notNull(),
  entityType: text('entity_type'), // 'application', 'booking', 'invoice'
  entityId: text('entity_id'),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_notif_user').on(table.userId),
  index('idx_notif_read').on(table.isRead),
]);

// ============================================================
// AUDIT LOGS
// ============================================================

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').references(() => users.id),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(), // 'PROPERTY_VERIFIED', 'TENANT_ASSIGNED', etc.
  entityType: text('entity_type').notNull(), // 'property', 'bed', 'user'
  entityId: text('entity_id').notNull(),
  metadata: text('metadata'), // Safe JSON metadata
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
// PLATFORM SETTINGS & FEATURE FLAGS
// ============================================================

export const platformSettings = sqliteTable('platform_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedBy: text('updated_by').references(() => users.id),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const featureFlags = sqliteTable('feature_flags', {
  key: text('key').primaryKey(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(false),
  description: text('description'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ============================================================
// FAVORITES (Customer saved PGs)
// ============================================================

export const favorites = sqliteTable('favorites', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  propertyId: text('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  uniqueIndex('idx_favorites_unique').on(table.customerId, table.propertyId),
]);

// ============================================================
// BILLING SYSTEM (Invoices)
// ============================================================

export const bills = sqliteTable('bills', {
  id: text('id').primaryKey(),
  publicId: text('public_id').notNull().unique(), // e.g. STY-BILL-XYZ
  propertyId: text('property_id').notNull().references(() => properties.id),
  ownerId: text('owner_id').notNull().references(() => users.id),
  tenantId: text('tenant_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(), // in rupees
  description: text('description').notNull(), // "Rent for Sep 2026", "Maintenance"
  status: text('status', { enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'] }).notNull().default('PENDING'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
