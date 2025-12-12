import { Elysia } from "elysia";
import { healthRoutes } from "./health";
import { linkRoutes } from "@/shorlinks";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import ClientDB from "@/libs/databases/indext";

export const routes = new Elysia({ prefix: "/api" })
  .use(healthRoutes)
  .use(linkRoutes);
