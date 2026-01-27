CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`issue_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`book_code` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`is_available` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_book_code_unique` UNIQUE(`book_code`)
);
--> statement-breakpoint
CREATE TABLE `borrowing_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`book_id` int NOT NULL,
	`book_code` varchar(50) NOT NULL,
	`student_name` varchar(255) NOT NULL,
	`roll_number` varchar(50) NOT NULL,
	`email` varchar(320) NOT NULL,
	`borrow_date` timestamp NOT NULL DEFAULT (now()),
	`return_date` timestamp,
	`is_returned` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `borrowing_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lit_weekly_issues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`issue_number` int NOT NULL,
	`publish_date` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lit_weekly_issues_id` PRIMARY KEY(`id`),
	CONSTRAINT `lit_weekly_issues_issue_number_unique` UNIQUE(`issue_number`)
);
