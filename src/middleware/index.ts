import Elysia from "elysia";
import { corsMiddleware } from "./cors-middleware";
import { loggingMiddleware } from "./log-request";
import { authMiddleware } from "./auth";
import openapi from "@elysiajs/openapi";

const defaultMiddleware = new Elysia()
    .use(corsMiddleware)
    .use(loggingMiddleware)
    .use(openapi())

export default defaultMiddleware;
export { corsMiddleware, loggingMiddleware, authMiddleware };