import Elysia from "elysia";
import { domainCreate } from "./controllers/domains/domain.create.controller";
import { domainFind } from "./controllers/domains/domain.find.controller";
import { domainFetch } from "./controllers/domains/domain.fetch.controller";
import linkCreate from "./controllers/links/link.create.controller";
import { linkGet } from "./controllers/links/link.get.controllers";
import { linkFind } from "./controllers/links/link.find.controller";
import { linkUpdate } from "./controllers/links/link.update.controller";
import { linkDelete } from "./controllers/links/link.delete.controller";
import { authMiddleware } from "src/middleware";

export const routes = new Elysia()
    .use(authMiddleware)
    .group("/links", (app) =>
        app.use([linkGet, linkCreate, linkFind, linkUpdate, linkDelete])
    )
    .group("/domains", (domainApp) =>
        domainApp.use([domainFetch, domainCreate, domainFind])
    );