CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`parentId` text,
	`name` text NOT NULL,
	`data` blob NOT NULL,
	`size` integer NOT NULL,
	FOREIGN KEY (`parentId`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`parentId` text
);
