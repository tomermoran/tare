CREATE TABLE `canonical_hardware` (
	`id` text PRIMARY KEY NOT NULL,
	`maker_id` text NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`capabilities` text,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`merged_into_id` text,
	`created_by_household_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`maker_id`) REFERENCES `hardware_makers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`merged_into_id`) REFERENCES `canonical_hardware`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "canonical_hardware_kind" CHECK("canonical_hardware"."kind" in ('machine', 'grinder', 'basket'))
);
--> statement-breakpoint
CREATE TABLE `hardware_makers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`merged_into_id` text,
	`created_by_household_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`merged_into_id`) REFERENCES `hardware_makers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
