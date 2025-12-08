import { Elysia } from "elysia";
import { healthRoutes } from "./health";
import { linkRoutes } from "@/shorlinks";

export const routes = new Elysia({ prefix: "/api" })
  .use(healthRoutes)
  .use(linkRoutes);
