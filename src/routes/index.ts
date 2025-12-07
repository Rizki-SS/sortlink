import { Elysia } from "elysia";
import { healthRoutes } from "./health";
import { dashboardRoutes } from "./dashboard";

export const routes = new Elysia({ prefix: "/api" })
  .use(healthRoutes)
  .use(dashboardRoutes);

export const adminRoutes = new Elysia()
  .use(dashboardRoutes);
