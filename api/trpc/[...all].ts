import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import type { TrpcContext } from "../../server/_core/context";

/**
 * Vercel serverless function handler for tRPC API
 *
 * This adapts the Express-based tRPC setup to work with Vercel's serverless functions.
 * The fetch adapter from tRPC handles the conversion from Web API Request/Response
 * to tRPC's internal format.
 *
 * Cookie handling: The context's clearCookie method applies cookie clearing directly
 * to response headers via the resHeaders object provided by the fetch adapter.
 */
export default async function handler(req: Request): Promise<Response> {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async (opts): Promise<TrpcContext> => {
      // Replicate isSecureRequest logic from server/_core/cookies.ts
      const url = new URL(opts.req.url);
      const forwardedProtoHeader =
        opts.req.headers.get("x-forwarded-proto") || "";

      let isSecure = url.protocol === "https:";
      if (!isSecure && forwardedProtoHeader) {
        const protoList = forwardedProtoHeader.split(",");
        isSecure = protoList.some(
          (proto) => proto.trim().toLowerCase() === "https"
        );
      }

      const expressLikeReq = {
        headers: {
          cookie: opts.req.headers.get("cookie") || "",
          "x-forwarded-proto": forwardedProtoHeader,
        },
        protocol: isSecure ? "https" : "http",
        hostname: url.hostname,
        originalUrl: url.pathname,
      } as any;

      const expressLikeRes = {
        cookie: () => {},
        clearCookie: (name: string, options: any) => {
          const cookieOptions = options || {};
          const secure = cookieOptions.secure === true;
          const sameSite = cookieOptions.sameSite || "none";
          const path = cookieOptions.path || "/";

          const cookieValue = `${name}=; Path=${path}; Max-Age=0; HttpOnly; SameSite=${sameSite}${
            secure ? "; Secure" : ""
          }`;

          opts.resHeaders.append("Set-Cookie", cookieValue);
        },
        setHeader: () => {},
        getHeader: () => undefined,
        status: () => ({ json: () => {} }),
      } as any;

      return {
        req: expressLikeReq,
        res: expressLikeRes,
        user: null,
      };
    },
    onError: ({ error, path }) => {
      console.error(`tRPC error on '${path}':`, error);
    },
  });
}

/**
 * ✅ IMPORTANT:
 * Vercel only supports "nodejs", NOT "nodejs20.x"
 */


