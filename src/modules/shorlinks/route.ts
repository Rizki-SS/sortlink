import Elysia from "elysia";
import { domainCreate } from "./controllers/domains/domain.create.controller";
import { domainFind } from "./controllers/domains/domain.find.controller";
import { domainFetch } from "./controllers/domains/domain.fetch.controller";
import linkCreate from "./controllers/links/link.create.controller";
import { linkGet } from "./controllers/links/link.get.controllers";
import { linkFind } from "./controllers/links/link.find.controller";
import { linkUpdate } from "./controllers/links/link.update.controller";
import { linkDelete } from "./controllers/links/link.delete.controller";
import { linkTagsAdd } from "./controllers/links/link.tags.add.controller";
import { linkTagsRemove } from "./controllers/links/link.tags.remove.controller";
import folderCreate from "./controllers/folders/folder.create.controllers";
import { folderGet } from "./controllers/folders/folder.get.controller";
import { folderFind } from "./controllers/folders/folder.find.controller";
import { folderUpdate } from "./controllers/folders/folder.update.controller";
import { folderDelete } from "./controllers/folders/folder.delete.controller";
import { authMiddleware } from "src/middleware";
import { updateUtm } from "./controllers/link-configurations/utm.controller";

export const routes = new Elysia()
    .use(authMiddleware)
    .group("/links", (app) =>
        app.use([linkGet, linkCreate, linkFind, linkUpdate, linkDelete])
            .group("/:id/tags", (tagApp) =>
                tagApp.use([linkTagsAdd, linkTagsRemove])
            )
            .group("/:id", (utmApp) =>
                utmApp.use([updateUtm])
            )
    )
    .group("/domains", (domainApp) =>
        domainApp.use([domainFetch, domainCreate, domainFind])
    )
    .group("/folders", (folderApp) =>
        folderApp.use([folderGet, folderCreate, folderFind, folderUpdate, folderDelete])
    );