CREATE TABLE `milk_types` (
	`id` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`name_key` text,
	`name` text,
	`kind` text NOT NULL,
	`hidden` integer DEFAULT false,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `milk_types_household_order` ON `milk_types` (`household_id`,`sort_order`);