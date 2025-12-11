import { Elysia } from "elysia";
import { routes } from "./routes";
import { corsMiddleware, loggingMiddleware, errorHandler } from "./middleware";
import { disconnectAllLinkDbClients } from "./libs/databases/link.db";
import { mainClient } from "./libs/databases/main.db";
import { enableBigIntSerialization } from "./libs/utils/bigint.serializer";

// Enable global BigInt serialization
enableBigIntSerialization();

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

async function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  try {
    app.stop();
    console.log("✓ Server closed");
    
    await Promise.all([
      mainClient.$disconnect(),
      disconnectAllLinkDbClients()
    ]);
    console.log("✓ Database connections closed");
    
    console.log("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
