import Elysia from "elysia";

export const loggingMiddleware = new Elysia()
    .onRequest(({ request }) => {
        console.log(`${new Date().toISOString()} - ${request.method} ${request.url}`);
    });