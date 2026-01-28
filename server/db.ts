
import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from './_core/env';
import * as schema from '../drizzle/schema';
import * as relations from '../drizzle/relations';


let _db: any = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL, { schema: { ...schema, ...relations }, mode: 'default' });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: schema.InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: schema.InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(schema.users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(schema.users).where(eq(schema.users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Lit Weekly Issues ============

export async function getAllLitWeeklyIssues(publishedOnly = false) {
    const db = await getDb();
    if (!db) return [];
    const where = publishedOnly ? eq(schema.litWeeklyIssues.isPublished, 1) : undefined;
    return await db.query.litWeeklyIssues.findMany({
        where,
        orderBy: [desc(schema.litWeeklyIssues.publishDate)],
        with: {
            articles: {
                orderBy: [schema.articles.order],
            },
        },
    });
}

export async function getLitWeeklyIssueById(id: number) {
    const db = await getDb();
    if (!db) return undefined;
    return await db.query.litWeeklyIssues.findFirst({
        where: eq(schema.litWeeklyIssues.id, id),
        with: {
            articles: {
                orderBy: [schema.articles.order],
            },
        },
    });
}

export async function createLitWeeklyIssue(data: { title: string; description?: string; issueNumber: number; publishDate: Date; isPublished?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.litWeeklyIssues).values({ ...data, isPublished: data.isPublished ?? 0 });
  return result[0].insertId;
}

export async function updateLitWeeklyIssue(id: number, data: Partial<{ title: string; description?: string; publishDate: Date; isPublished: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(schema.litWeeklyIssues).set(data).where(eq(schema.litWeeklyIssues.id, id));
}

export async function deleteLitWeeklyIssue(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(schema.articles).where(eq(schema.articles.issueId, id));
  return await db.delete(schema.litWeeklyIssues).where(eq(schema.litWeeklyIssues.id, id));
}

// ============ Articles ============

export async function getArticlesByIssueId(issueId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(schema.articles).where(eq(schema.articles.issueId, issueId)).orderBy(schema.articles.order);
}

export async function getArticleById(id: number) {
    const db = await getDb();
    if (!db) return undefined;
    const result = await db.select().from(schema.articles).where(eq(schema.articles.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}

export async function createArticle(data: { issueId: number; title: string; author: string; category: string; content: string; order?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.articles).values(data);
  return result[0].insertId;

}

export async function updateArticle(id: number, data: Partial<{ title: string; author: string; category: string; content: string; order: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(schema.articles).set(data).where(eq(schema.articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(schema.articles).where(eq(schema.articles.id, id));
}

// ============ Books ============

export async function getAllBooks() {
  const db = await getDb();
  if (!db) return [];
  return await db.query.books.findMany({
      orderBy: [schema.books.createdAt],
  });
}

export async function getBookByCode(bookCode: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.query.books.findFirst({
      where: eq(schema.books.bookCode, bookCode)
  });
  return result;
}

export async function createBook(data: { bookCode: string; title: string; author: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.books).values({ ...data, isAvailable: 1 });
  return result[0].insertId;
}

export async function updateBook(id: number, data: Partial<{ title: string; author: string; isAvailable: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(schema.books).set(data).where(eq(schema.books.id, id));
}

export async function deleteBook(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(schema.books).where(eq(schema.books.id, id));
}

// ============ Borrowing Records ============

export async function getAllBorrowingRecords() {
  const db = await getDb();
  if (!db) return [];
  return await db.query.borrowingRecords.findMany({
    orderBy: [desc(schema.borrowingRecords.borrowDate)],
    with: {
      book: true,
    },
  });
}

export async function getBorrowingRecordsByBookCode(bookCode: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.query.borrowingRecords.findMany({
      where: eq(schema.borrowingRecords.bookCode, bookCode),
      orderBy: [desc(schema.borrowingRecords.borrowDate)],
      with: {
          book: true,
      },
  });
}

export async function createBorrowingRecord(data: { bookId: number; bookCode: string; studentName: string; rollNumber: string; email: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(schema.borrowingRecords).values(data);
}

export async function returnBook(recordId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(schema.borrowingRecords).set({ isReturned: 1, returnDate: new Date() }).where(eq(schema.borrowingRecords.id, recordId));
}

export async function getActiveBorrowingRecord(bookCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(schema.borrowingRecords).where(and(eq(schema.borrowingRecords.bookCode, bookCode), eq(schema.borrowingRecords.isReturned, 0))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

