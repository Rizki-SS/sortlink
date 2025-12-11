import { Elysia } from "elysia";
import { AppError } from "../types/errors";

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

export const loggingMiddleware = new Elysia()
  .onRequest(({ request }) => {
    console.log(`${new Date().toISOString()} - ${request.method} ${request.url}`);
  });

export const errorHandler = ({ code, error, set, request }: any) => {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  
  const isError = error instanceof Error;
  const errorMessage = isError ? error.message : 'Unknown error';
  const errorStack = isError ? error.stack : undefined;
  
  console.error(`[${timestamp}] ${method} ${url} - Error:`, {
    code,
    message: errorMessage,
    stack: errorStack
  });
  
  if (error instanceof AppError) {
    set.status = error.statusCode;
    return {
      success: false,
      error: error.code,
      message: error.message,
      timestamp,
      path: url
    };
  }
  
  switch (code) {
    case "NOT_FOUND":
      set.status = 404;
      return { 
        success: false,
        error: "NOT_FOUND",
        message: "The requested resource could not be found",
        timestamp,
        path: url
      };
    
    case "VALIDATION":
      set.status = 400;
      return { 
        success: false,
        error: "VALIDATION_ERROR",
        message: "Invalid request data. Please check your request parameters.",
        timestamp,
        path: url
      };
    
    case "PARSE":
      set.status = 400;
      return { 
        success: false,
        error: "PARSE_ERROR",
        message: "Request body contains invalid JSON",
        timestamp,
        path: url
      };
    
    case "UNKNOWN":
    default:
      // Handle unexpected errors
      set.status = 500;
      return { 
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        message: process.env.NODE_ENV === 'production' 
          ? "Something went wrong on our end" 
          : errorMessage,
        timestamp,
        path: url,
        ...(process.env.DEBUG == 'true' && errorStack && { stack: errorStack })
      };
  }
};

export const errorMiddleware = new Elysia()
  .onError(errorHandler);

  export { authMiddleware } from "./auth";