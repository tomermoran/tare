CREATE TABLE `catalog_aliases` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`name` text NOT NULL,
	`market` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `catalog_aliases_type_name` ON `catalog_aliases` (`entity_type`,`name`);--> statement-breakpoint
CREATE TABLE `catalog_merges` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`from_id` text NOT NULL,
	`into_id` text NOT NULL,
	`suggested_by` text NOT NULL,
	`confidence` real,
	`reason` text,
	`decided_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `catalog_urls` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`url` text NOT NULL,
	`normalized_url` text NOT NULL,
	`market` text,
	`added_by_household_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`added_by_household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `catalog_urls_normalized` ON `catalog_urls` (`normalized_url`);