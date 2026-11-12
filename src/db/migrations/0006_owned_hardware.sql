CREATE TABLE `owned_hardware` (
	`id` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`hardware_id` text NOT NULL,
	`nickname` text,
	`acquired_at` integer,
	`retired_at` integer,
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`hardware_id`) REFERENCES `canonical_hardware`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `owned_hardware_household` ON `owned_hardware` (`household_id`);