CREATE TABLE `bills` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`property_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`amount` integer NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`due_date` integer,
	`paid_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tenant_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bills_public_id_unique` ON `bills` (`public_id`);
