CREATE TABLE `setup_parts` (
	`setup_id` text NOT NULL,
	`owned_hardware_id` text NOT NULL,
	PRIMARY KEY(`setup_id`, `owned_hardware_id`),
	FOREIGN KEY (`setup_id`) REFERENCES `setups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owned_hardware_id`) REFERENCES `owned_hardware`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `setup_parts_owned_hardware` ON `setup_parts` (`owned_hardware_id`);--> statement-breakpoint
CREATE TABLE `setups` (
	`id` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`parts_key` text NOT NULL,
	`name` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `setups_household_parts` ON `setups` (`household_id`,`parts_key`);