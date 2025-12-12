import Elysia from "elysia";
import { corsMiddleware } from "./cors-middleware";
import { loggingMiddleware } from "./log-request";
import { authMiddleware } from "./auth";

const defaultMiddleware = new Elysia()
    .use(corsMiddleware)
    .use(loggingMiddleware);

export default defaultMiddleware;
export { corsMiddleware, loggingMiddleware, authMiddleware };