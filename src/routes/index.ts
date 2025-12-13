import { Elysia } from "elysia";
import { healthRoutes } from "./health";
import { linkRoutes } from "@/shorlinks";

const APP_PREFIX = process.env.APP_PREFIX || "/api";

export const routes = new Elysia({ prefix: `${APP_PREFIX}` })
  .use(healthRoutes)
  .use(linkRoutes);
