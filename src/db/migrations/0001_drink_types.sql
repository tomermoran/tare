CREATE TABLE `drink_types` (
	`id` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`name_key` text,
	`name` text,
	`has_milk` integer NOT NULL,
	`typical_milk_ml` real,
	`hidden` integer DEFAULT false,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `drink_types_household_order` ON `drink_types` (`household_id`,`sort_order`);