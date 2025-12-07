import { Elysia } from "elysia";
import { authMiddleware } from "../middleware";

export const dashboardRoutes = new Elysia({ prefix: "/sortlink" })
  .use(authMiddleware)
  .get("/", () => ({
    message: "Admin Dashboard - Bull Board",
    endpoints: {
      queues: "/admin/queues - Official Bull Dashboard UI",
      "redirect": "Visit /admin/queues for the Bull Dashboard"
    }
  }))
  .get("/test", () => ({ message: "Sort link test route working!" }));