import { relations } from "drizzle-orm";
import {
  litWeeklyIssues,
  articles,
  books,
  borrowingRecords,
} from "./schema";

export const litWeeklyIssueRelations = relations(litWeeklyIssues, ({ many }) => ({
  articles: many(articles),
}));

export const articleRelations = relations(articles, ({ one }) => ({
  issue: one(litWeeklyIssues, {
    fields: [articles.issueId],
    references: [litWeeklyIssues.id],
  }),
}));

export const bookRelations = relations(books, ({ many }) => ({
  borrowingHistory: many(borrowingRecords),
}));

export const borrowingRecordRelations = relations(borrowingRecords, ({ one }) => ({
  book: one(books, {
    fields: [borrowingRecords.bookId],
    references: [books.id],
  }),
}));
