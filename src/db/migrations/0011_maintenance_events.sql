CREATE TABLE `maintenance_events` (
	`id` text PRIMARY KEY NOT NULL,
	`owned_hardware_id` text NOT NULL,
	`kind` text NOT NULL,
	`is_recalibration` integer DEFAULT false NOT NULL,
	`note` text,
	`occurred_at` integer NOT NULL,
	`grind_shift` real,
	`grind_scale` real,
	`offset_source_recipe_id` text,
	FOREIGN KEY (`owned_hardware_id`) REFERENCES `owned_hardware`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`offset_source_recipe_id`) REFERENCES `pinned_recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `maintenance_events_unit_time` ON `maintenance_events` (`owned_hardware_id`,`occurred_at`);