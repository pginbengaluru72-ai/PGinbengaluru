CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`property_id` text NOT NULL,
	`preferred_room_type` integer,
	`preferred_move_in` integer,
	`message` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`responded_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `applications_public_id_unique` ON `applications` (`public_id`);--> statement-breakpoint
CREATE INDEX `idx_applications_customer` ON `applications` (`customer_id`);--> statement-breakpoint
CREATE INDEX `idx_applications_property` ON `applications` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_applications_status` ON `applications` (`status`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`actor_role` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`metadata` text,
	`request_id` text,
	`ip_address` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_audit_actor` ON `audit_logs` (`actor_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_entity` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_action` ON `audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `idx_audit_created` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `bed_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`bed_id` text NOT NULL,
	`tenant_user_id` text NOT NULL,
	`property_id` text NOT NULL,
	`monthly_rent` integer NOT NULL,
	`move_in_date` integer NOT NULL,
	`move_out_date` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`bed_id`) REFERENCES `beds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_assignments_bed` ON `bed_assignments` (`bed_id`);--> statement-breakpoint
CREATE INDEX `idx_assignments_tenant` ON `bed_assignments` (`tenant_user_id`);--> statement-breakpoint
CREATE INDEX `idx_assignments_property` ON `bed_assignments` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_assignments_active` ON `bed_assignments` (`is_active`);--> statement-breakpoint
CREATE TABLE `beds` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`property_id` text NOT NULL,
	`label` text,
	`monthly_rent` integer NOT NULL,
	`status` text DEFAULT 'AVAILABLE' NOT NULL,
	`available_from` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_beds_room` ON `beds` (`room_id`);--> statement-breakpoint
CREATE INDEX `idx_beds_property` ON `beds` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_beds_status` ON `beds` (`status`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`application_id` text,
	`customer_id` text NOT NULL,
	`property_id` text NOT NULL,
	`bed_id` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`move_in_date` integer NOT NULL,
	`reserved_until` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bed_id`) REFERENCES `beds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_public_id_unique` ON `bookings` (`public_id`);--> statement-breakpoint
CREATE INDEX `idx_bookings_customer` ON `bookings` (`customer_id`);--> statement-breakpoint
CREATE INDEX `idx_bookings_property` ON `bookings` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_bookings_bed` ON `bookings` (`bed_id`);--> statement-breakpoint
CREATE INDEX `idx_bookings_status` ON `bookings` (`status`);--> statement-breakpoint
CREATE TABLE `buildings` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_buildings_property` ON `buildings` (`property_id`);--> statement-breakpoint
CREATE TABLE `complaints` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`reporter_id` text NOT NULL,
	`property_id` text,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'OPEN' NOT NULL,
	`assigned_to` text,
	`resolved_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `complaints_public_id_unique` ON `complaints` (`public_id`);--> statement-breakpoint
CREATE INDEX `idx_complaints_reporter` ON `complaints` (`reporter_id`);--> statement-breakpoint
CREATE INDEX `idx_complaints_property` ON `complaints` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_complaints_status` ON `complaints` (`status`);--> statement-breakpoint
CREATE TABLE `customer_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`public_id` text NOT NULL,
	`college` text,
	`course` text,
	`emergency_contact_name` text,
	`emergency_contact_phone` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_profiles_user_id_unique` ON `customer_profiles` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `customer_profiles_public_id_unique` ON `customer_profiles` (`public_id`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`property_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_favorites_unique` ON `favorites` (`customer_id`,`property_id`);--> statement-breakpoint
CREATE TABLE `feature_flags` (
	`key` text PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`description` text,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `floors` (
	`id` text PRIMARY KEY NOT NULL,
	`building_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_floors_building` ON `floors` (`building_id`);--> statement-breakpoint
CREATE TABLE `kyc_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`document_type` text NOT NULL,
	`r2_key` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`rejection_reason` text,
	`verified_by` text,
	`verified_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_kyc_user` ON `kyc_verifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_kyc_status` ON `kyc_verifications` (`status`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_notif_user` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_notif_read` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE TABLE `owner_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`public_id` text NOT NULL,
	`business_name` text,
	`pan_number` text,
	`gst_number` text,
	`bank_account_number` text,
	`bank_ifsc` text,
	`bank_name` text,
	`address` text,
	`city` text DEFAULT 'Bengaluru' NOT NULL,
	`is_kyc_verified` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `owner_profiles_user_id_unique` ON `owner_profiles` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `owner_profiles_public_id_unique` ON `owner_profiles` (`public_id`);--> statement-breakpoint
CREATE TABLE `owner_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`status` text DEFAULT 'FREE_TRIAL' NOT NULL,
	`current_period_start` integer NOT NULL,
	`current_period_end` integer NOT NULL,
	`cancelled_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_subs_owner` ON `owner_subscriptions` (`owner_id`);--> statement-breakpoint
CREATE INDEX `idx_subs_status` ON `owner_subscriptions` (`status`);--> statement-breakpoint
CREATE TABLE `platform_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_by` text,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`address` text NOT NULL,
	`locality` text NOT NULL,
	`city` text DEFAULT 'Bengaluru' NOT NULL,
	`pincode` text,
	`latitude` real,
	`longitude` real,
	`whatsapp_number` text,
	`amenities` text,
	`policies` text,
	`starting_price` integer,
	`total_beds` integer DEFAULT 0 NOT NULL,
	`available_beds` integer DEFAULT 0 NOT NULL,
	`avg_rating` real DEFAULT 0,
	`review_count` integer DEFAULT 0 NOT NULL,
	`admin_notes` text,
	`verified_at` integer,
	`verified_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `properties_public_id_unique` ON `properties` (`public_id`);--> statement-breakpoint
CREATE INDEX `idx_properties_owner` ON `properties` (`owner_id`);--> statement-breakpoint
CREATE INDEX `idx_properties_status` ON `properties` (`status`);--> statement-breakpoint
CREATE INDEX `idx_properties_locality` ON `properties` (`locality`);--> statement-breakpoint
CREATE INDEX `idx_properties_type` ON `properties` (`type`);--> statement-breakpoint
CREATE INDEX `idx_properties_city` ON `properties` (`city`);--> statement-breakpoint
CREATE TABLE `property_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`r2_key` text NOT NULL,
	`document_type` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `property_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`r2_key` text NOT NULL,
	`caption` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_photos_property` ON `property_photos` (`property_id`);--> statement-breakpoint
CREATE TABLE `rent_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`assignment_id` text NOT NULL,
	`tenant_user_id` text NOT NULL,
	`property_id` text NOT NULL,
	`billing_month` text NOT NULL,
	`base_rent` integer NOT NULL,
	`food_charge` integer DEFAULT 0 NOT NULL,
	`electricity_charge` integer DEFAULT 0 NOT NULL,
	`maintenance_charge` integer DEFAULT 0 NOT NULL,
	`other_charges` integer DEFAULT 0 NOT NULL,
	`discount` integer DEFAULT 0 NOT NULL,
	`late_fee` integer DEFAULT 0 NOT NULL,
	`total_amount` integer NOT NULL,
	`paid_amount` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`due_date` integer NOT NULL,
	`issued_at` integer,
	`paid_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`assignment_id`) REFERENCES `bed_assignments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rent_invoices_public_id_unique` ON `rent_invoices` (`public_id`);--> statement-breakpoint
CREATE INDEX `idx_invoices_tenant` ON `rent_invoices` (`tenant_user_id`);--> statement-breakpoint
CREATE INDEX `idx_invoices_property` ON `rent_invoices` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_invoices_status` ON `rent_invoices` (`status`);--> statement-breakpoint
CREATE INDEX `idx_invoices_month` ON `rent_invoices` (`billing_month`);--> statement-breakpoint
CREATE TABLE `rent_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`amount` integer NOT NULL,
	`payment_method` text,
	`provider_payment_id` text,
	`provider_order_id` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`paid_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `rent_invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_payments_invoice` ON `rent_payments` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `idx_payments_provider` ON `rent_payments` (`provider_payment_id`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`booking_id` text,
	`rating` integer NOT NULL,
	`title` text,
	`body` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_property` ON `reviews` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_reviews_customer` ON `reviews` (`customer_id`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`floor_id` text,
	`room_number` text NOT NULL,
	`sharing_type` integer NOT NULL,
	`has_ac` integer DEFAULT false NOT NULL,
	`has_attached_bathroom` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`floor_id`) REFERENCES `floors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_rooms_property` ON `rooms` (`property_id`);--> statement-breakpoint
CREATE INDEX `idx_rooms_floor` ON `rooms` (`floor_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_token` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE TABLE `subscription_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`subscription_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`provider_payment_id` text,
	`billing_period` text NOT NULL,
	`paid_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`subscription_id`) REFERENCES `owner_subscriptions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sub_inv_owner` ON `subscription_invoices` (`owner_id`);--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`price_monthly` integer NOT NULL,
	`max_properties` integer NOT NULL,
	`max_beds` integer NOT NULL,
	`features` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'CUSTOMER' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`must_change_password` integer DEFAULT false NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_public_id_unique` ON `users` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `idx_users_public_id` ON `users` (`public_id`);