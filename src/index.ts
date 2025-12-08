import { Elysia } from "elysia";
import { routes } from "./routes";
import { corsMiddleware, loggingMiddleware, errorHandler } from "./middleware";

const app = new Elysia()
  .onError(errorHandler)
  .use(corsMiddleware)
  .use(loggingMiddleware)
  .get("/", () => ({
    version: "1.0.0",
    endpoints: {
      health: "/api/health"
    }
  }))
  .use(routes)
  .all("*", ({ set, request }) => {
    set.status = 404;
    return {
      success: false,
      error: "Endpoint not found",
      message: "The requested resource could not be found"
    };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
