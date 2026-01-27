import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user contexts
const adminUser = {
  id: 1,
  openId: "admin-user",
  email: "admin@example.com",
  name: "Admin User",
  loginMethod: "manus",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const regularUser = {
  id: 2,
  openId: "regular-user",
  email: "user@example.com",
  name: "Regular User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createContext(user: typeof adminUser | typeof regularUser | null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("tRPC Procedures", () => {
  describe("litWeekly.list", () => {
    it("should return empty array when no issues exist", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.litWeekly.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("litWeekly.create", () => {
    it("should reject non-admin users", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.litWeekly.create({
          title: "Test Issue",
          issueNumber: 1,
          publishDate: new Date(),
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin users to create issues", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.litWeekly.create({
        title: "Test Issue",
        issueNumber: 1,
        publishDate: new Date(),
      });

      expect(result).toBeDefined();
      expect(result.title).toBe("Test Issue");
      expect(result.issueNumber).toBe(1);
    });
  });

  describe("books.list", () => {
    it("should return list of books", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.books.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("books.create", () => {
    it("should reject non-admin users", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.books.create({
          bookCode: "LIT-001",
          title: "Test Book",
          author: "Test Author",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin users to create books", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.books.create({
        bookCode: "LIT-001",
        title: "Test Book",
        author: "Test Author",
      });

      expect(result).toBeDefined();
      expect(result.bookCode).toBe("LIT-001");
      expect(result.title).toBe("Test Book");
      expect(result.isAvailable).toBe(1);
    });
  });

  describe("borrowing.borrow", () => {
    it("should reject borrowing with invalid book code", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.borrowing.borrow({
          bookCode: "INVALID-CODE",
          studentName: "John Doe",
          rollNumber: "123",
          email: "john@example.com",
        });
        expect.fail("Should have thrown NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("should validate email format", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.borrowing.borrow({
          bookCode: "LIT-001",
          studentName: "John Doe",
          rollNumber: "123",
          email: "invalid-email",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("borrowing.list", () => {
    it("should reject non-admin users", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.borrowing.list();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin users to list borrowing records", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.borrowing.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("auth.me", () => {
    it("should return null for unauthenticated users", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).toBeNull();
    });

    it("should return user data for authenticated users", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.me();
      expect(result).toEqual(adminUser);
    });
  });

  describe("auth.logout", () => {
    it("should clear session cookie", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();

      expect(result.success).toBe(true);
      expect(ctx.res.clearCookie).toHaveBeenCalled();
    });
  });
});
