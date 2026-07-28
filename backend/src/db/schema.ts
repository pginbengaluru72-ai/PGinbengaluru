import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Better Auth core tables
export const users = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
    role: text("role").default("tenant").notNull(), // 'owner' or 'tenant'
});

export const sessions = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => users.id)
});

export const accounts = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => users.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const verifications = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }),
	updatedAt: integer("updatedAt", { mode: "timestamp" })
});

// App specific tables
export const properties = sqliteTable("property", {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    type: text("type").notNull(), // 'boys', 'girls', 'colive'
    address: text("address").notNull(),
    locality: text("locality").notNull(), // e.g., 'HSR Layout'
    sector: text("sector"), // e.g., 'Sector 1'
    city: text("city").notNull().default("Bengaluru"),
    description: text("description"),
    foodIncluded: integer("food_included", { mode: "boolean" }).default(false).notNull(),
    acAvailable: integer("ac_available", { mode: "boolean" }).default(false).notNull(),
    wifiAvailable: integer("wifi_available", { mode: "boolean" }).default(true).notNull(),
    whatsappNumber: text("whatsapp_number").notNull(),
    isVerified: integer("is_verified", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const rooms = sqliteTable("room", {
    id: text("id").primaryKey(),
    propertyId: text("property_id").notNull().references(() => properties.id),
    roomNumber: text("room_number"),
    sharingType: integer("sharing_type").notNull(), // 1 for single, 2 for double, etc.
    pricePerBed: integer("price_per_bed").notNull(),
    ac: integer("ac", { mode: "boolean" }).default(false).notNull(),
    attachedBathroom: integer("attached_bathroom", { mode: "boolean" }).default(true).notNull(),
});

export const beds = sqliteTable("bed", {
    id: text("id").primaryKey(),
    roomId: text("room_id").notNull().references(() => rooms.id),
    isOccupied: integer("is_occupied", { mode: "boolean" }).default(false).notNull(),
});

export const media = sqliteTable("media", {
    id: text("id").primaryKey(),
    propertyId: text("property_id").notNull().references(() => properties.id),
    url: text("url").notNull(), // R2 URL
    type: text("type").notNull(), // 'image' or 'video'
    isPrimary: integer("is_primary", { mode: "boolean" }).default(false).notNull(),
});

// Phase 2 Expansion: Subscriptions, Leads, Tickets, Expenses

export const subscriptions = sqliteTable("subscription", {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull().references(() => users.id),
    status: text("status").notNull().default("inactive"), // 'active', 'inactive', 'past_due', 'free_trial'
    planType: text("plan_type").notNull().default("free_trial"), // 'free_trial', 'premium'
    startDate: integer("start_date", { mode: "timestamp" }),
    endDate: integer("end_date", { mode: "timestamp" }),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const leads = sqliteTable("lead", {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id").notNull().references(() => users.id),
    propertyId: text("property_id").notNull().references(() => properties.id),
    status: text("status").notNull().default("pending"), // 'pending', 'contacted', 'booked', 'rejected'
    message: text("message"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const tickets = sqliteTable("ticket", {
    id: text("id").primaryKey(),
    tenantId: text("tenant_id").notNull().references(() => users.id),
    propertyId: text("property_id").notNull().references(() => properties.id),
    issueType: text("issue_type").notNull(), // 'plumbing', 'electrical', 'internet', 'cleaning', 'other'
    description: text("description").notNull(),
    status: text("status").notNull().default("open"), // 'open', 'in_progress', 'resolved'
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const expenses = sqliteTable("expense", {
    id: text("id").primaryKey(),
    propertyId: text("property_id").notNull().references(() => properties.id),
    category: text("category").notNull(), // 'electricity', 'water', 'maintenance', 'salary', 'other'
    amount: integer("amount").notNull(), // stored in cents/paise
    date: integer("date", { mode: "timestamp" }).notNull(),
    notes: text("notes"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull()
});

// Phase 4 Expansion: Dynamic Localities

export const localities = sqliteTable("locality", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(), // e.g., 'HSR Layout', 'Koramangala', 'BTM Layout'
    city: text("city").notNull().default("Bengaluru"),
    isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

