import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth";

export const healthRoutes = new Elysia({ prefix: "/health" })
  .get("/", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "api-video-services"
  }))
  .get("/ping", () => "pong")
  .get("/status", () => ({
    status: "healthy",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: "1.0.50"
  }));
