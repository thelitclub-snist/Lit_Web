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
      // Adapt Web API Request to Express-like interface for compatibility
      // Replicate isSecureRequest logic from server/_core/cookies.ts for consistency
      const url = new URL(opts.req.url);
      const forwardedProtoHeader = opts.req.headers.get("x-forwarded-proto") || "";
      
      // Check if request is secure (matches isSecureRequest logic exactly)
      // First check protocol from URL, then fall back to x-forwarded-proto header
      let isSecure = url.protocol === "https:";
      if (!isSecure && forwardedProtoHeader) {
        // Handle comma-separated values (RFC 7239)
        const protoList = forwardedProtoHeader.split(",");
        isSecure = protoList.some(proto => proto.trim().toLowerCase() === "https");
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

      // Create a response-like object that handles cookie clearing
      // When clearCookie is called (e.g., in logout mutation), we apply it
      // directly to response headers via the resHeaders object
      const expressLikeRes = {
        cookie: () => {},
        clearCookie: (name: string, options: any) => {
          // Apply cookie clearing to response headers immediately
          // Format: Set-Cookie header with max-age=0 to clear the cookie
          // Options come from getSessionCookieOptions which always sets secure explicitly (true/false)
          const cookieOptions = options || {};
          const secure = cookieOptions.secure === true; // Only add Secure flag if explicitly true
          const sameSite = cookieOptions.sameSite || "none";
          const path = cookieOptions.path || "/";
          
          // Clear cookie by setting it with max-age=0
          // Must match original cookie attributes (httpOnly, secure, sameSite, path)
          const cookieValue = `${name}=; Path=${path}; Max-Age=0; HttpOnly; SameSite=${sameSite}${secure ? "; Secure" : ""}`;
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

export const config = {
  runtime: "nodejs20.x",
};
