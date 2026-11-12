CREATE TABLE `canonical_beans` (
	`id` text PRIMARY KEY NOT NULL,
	`roaster_id` text NOT NULL,
	`name` text NOT NULL,
	`roast_level` text,
	`tasting_notes` text,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`merged_into_id` text,
	`created_by_household_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`roaster_id`) REFERENCES `roasters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`merged_into_id`) REFERENCES `canonical_beans`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roasters` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`merged_into_id` text,
	`created_by_household_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`merged_into_id`) REFERENCES `roasters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
