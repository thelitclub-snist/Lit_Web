import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Lit Weekly Issues table
 * Stores published issues of the literary magazine
 */
export const litWeeklyIssues = mysqlTable("lit_weekly_issues", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  issueNumber: int("issue_number").notNull().unique(),
  publishDate: timestamp("publish_date").notNull(),
  isPublished: int("is_published").default(0).notNull(), // 0 = draft, 1 = published
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type LitWeeklyIssue = typeof litWeeklyIssues.$inferSelect;
export type InsertLitWeeklyIssue = typeof litWeeklyIssues.$inferInsert;

/**
 * Articles table
 * Stores articles within each Lit Weekly issue
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  issueId: int("issue_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  content: text("content").notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Books table
 * Stores physical books available for borrowing
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  bookCode: varchar("book_code", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  isAvailable: int("is_available").default(1).notNull(), // 1 = available, 0 = borrowed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;

/**
 * Borrowing Records table
 * Tracks who borrowed which book and when
 */
export const borrowingRecords = mysqlTable("borrowing_records", {
  id: int("id").autoincrement().primaryKey(),
  bookId: int("book_id").notNull(),
  bookCode: varchar("book_code", { length: 50 }).notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  rollNumber: varchar("roll_number", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  borrowDate: timestamp("borrow_date").defaultNow().notNull(),
  returnDate: timestamp("return_date"),
  isReturned: int("is_returned").default(0).notNull(), // 0 = borrowed, 1 = returned
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BorrowingRecord = typeof borrowingRecords.$inferSelect;
export type InsertBorrowingRecord = typeof borrowingRecords.$inferInsert;
