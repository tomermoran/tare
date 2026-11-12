CREATE TABLE `batch_portions` (
	`id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`weight` real NOT NULL,
	`frozen_at` integer,
	`thawed_at` integer,
	`opened_at` integer,
	`finished_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `batch_portions_batch` ON `batch_portions` (`batch_id`);--> statement-breakpoint
CREATE TABLE `batches` (
	`id` text PRIMARY KEY NOT NULL,
	`household_id` text NOT NULL,
	`bean_id` text NOT NULL,
	`lot_code` text,
	`roast_date` integer,
	`packed_at` integer,
	`best_before` integer,
	`bag_weight` real NOT NULL,
	`purchased_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`household_id`) REFERENCES `households`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`bean_id`) REFERENCES `canonical_beans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stock_checks` (
	`id` text PRIMARY KEY NOT NULL,
	`portion_id` text NOT NULL,
	`remaining_weight` real NOT NULL,
	`checked_at` integer NOT NULL,
	FOREIGN KEY (`portion_id`) REFERENCES `batch_portions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `stock_checks_portion_time` ON `stock_checks` (`portion_id`,`checked_at`);