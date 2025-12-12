import { Elysia } from "elysia";
import { AppError } from "src/types";

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