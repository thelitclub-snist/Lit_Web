
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Helper to check if user is admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ Lit Weekly Issues ============
  litWeekly: router({
    list: publicProcedure.query(async () => {
      return await db.getAllLitWeeklyIssues(true);
    }),

    listAll: adminProcedure.query(async () => {
      return await db.getAllLitWeeklyIssues(false);
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const issue = await db.getLitWeeklyIssueById(input.id);
      if (!issue) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Issue not found' });
      }
      return issue;
    }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          issueNumber: z.number(),
          publishDate: z.date(),
          articles: z.array(
            z.object({
              title: z.string().min(1),
              author: z.string().min(1),
              category: z.string().min(1),
              content: z.string().min(1),
              order: z.number().optional(),
            })
          ).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const issueId = await db.createLitWeeklyIssue({
          title: input.title,
          description: input.description,
          issueNumber: input.issueNumber,
          publishDate: input.publishDate,
        });

        // Create articles if provided
        if (input.articles && input.articles.length > 0) {
          for (let i = 0; i < input.articles.length; i++) {
            const article = input.articles[i];
            await db.createArticle({
              issueId: Number(issueId),
              title: article.title,
              author: article.author,
              category: article.category,
              content: article.content,
              order: article.order ?? i,
            });
          }
        }

        return { id: issueId };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          publishDate: z.date().optional(),
          isPublished: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateLitWeeklyIssue(id, data);
        return { success: true };
      }),

    publish: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateLitWeeklyIssue(input.id, { isPublished: 1 });
        return { success: true };
      }),

    unpublish: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateLitWeeklyIssue(input.id, { isPublished: 0 });
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteLitWeeklyIssue(input.id);
        return { success: true };
      }),
  }),

  // ============ Articles ============
  articles: router({
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
        const article = await db.getArticleById(input.id);
        if (!article) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Article not found' });
        }
        return article;
    }),
    getByIssueId: publicProcedure
      .input(z.object({ issueId: z.number() }))
      .query(async ({ input }) => {
        return await db.getArticlesByIssueId(input.issueId);
      }),

    create: adminProcedure
      .input(
        z.object({
          issueId: z.number(),
          title: z.string().min(1),
          author: z.string().min(1),
          category: z.string().min(1),
          content: z.string().min(1),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const articleId = await db.createArticle(input);
        return { id: articleId };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          author: z.string().optional(),
          category: z.string().optional(),
          content: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateArticle(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteArticle(input.id);
        return { success: true };
      }),
  }),

  // ============ Books ============
  books: router({
    list: publicProcedure.query(async () => {
      return await db.getAllBooks();
    }),

    getByCode: publicProcedure
      .input(z.object({ bookCode: z.string() }))
      .query(async ({ input }) => {
        const book = await db.getBookByCode(input.bookCode);
        if (!book) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Book not found' });
        }
        return book;
      }),

    create: adminProcedure
      .input(
        z.object({
          bookCode: z.string().min(1),
          title: z.string().min(1),
          author: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const bookId = await db.createBook(input);
        return { id: bookId };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          author: z.string().optional(),
          isAvailable: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateBook(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBook(input.id);
        return { success: true };
      }),
  }),

  // ============ Borrowing Records ============
  borrowing: router({
    list: adminProcedure.query(async () => {
      return await db.getAllBorrowingRecords();
    }),

    borrow: publicProcedure
      .input(
        z.object({
          bookCode: z.string().min(1),
          studentName: z.string().min(1),
          rollNumber: z.string().min(1),
          email: z.string().email(),
        })
      )
      .mutation(async ({ input }) => {
        // Check if book exists
        const book = await db.getBookByCode(input.bookCode);
        if (!book) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Book code not found' });
        }

        // Check if book is available
        if (book.isAvailable === 0) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Book is currently borrowed' });
        }

        // Create borrowing record
        await db.createBorrowingRecord({
          bookId: book.id,
          bookCode: input.bookCode,
          studentName: input.studentName,
          rollNumber: input.rollNumber,
          email: input.email,
        });

        // Mark book as borrowed
        await db.updateBook(book.id, { isAvailable: 0 });

        return { success: true, message: 'Book borrowed successfully' };
      }),

    return: adminProcedure
      .input(z.object({ recordId: z.number() }))
      .mutation(async ({ input }) => {
        const records = await db.getAllBorrowingRecords();
        const record = records.find((r: any) => r.id === input.recordId);

        if (!record || record.isReturned) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Borrowing record not found or already returned' });
        }

        // Mark as returned
        await db.returnBook(input.recordId);

        // Mark book as available
        await db.updateBook(record.book.id, { isAvailable: 1 });

        return { success: true, message: 'Book returned successfully' };
      }),

    getByBookCode: publicProcedure
      .input(z.object({ bookCode: z.string() }))
      .query(async ({ input }) => {
        return await db.getBorrowingRecordsByBookCode(input.bookCode);
      }),
  }),
});

export type AppRouter = typeof appRouter;
