import Elysia from "elysia";

export const corsMiddleware = new Elysia()
    .onRequest(({ request, set }) => {
        // Add CORS headers
        set.headers["Access-Control-Allow-Origin"] = "*"; // Consider using specific domain in production
        set.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH";
        set.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Origin, Host, User-Agent, Accept-Encoding, Accept-Language, Cache-Control, Connection, X-Company-Domain";
        set.headers["Access-Control-Expose-Headers"] = "Content-Length, Content-Range, Accept-Ranges, X-Upload-Progress";
        set.headers["Access-Control-Allow-Credentials"] = "true"; // Enable if you need cookies/auth
        set.headers["Access-Control-Max-Age"] = "86400"; // Cache preflight for 24 hours
    })
    .options("*", ({ set }) => {
        set.status = 200;
        return "";
    });