import Elysia from "elysia";
import { authMiddleware } from "../../middleware";
import { linksGet } from "./controllers/links.get";
import db from "@/libs/databases/indext";

export const routes = new Elysia({ prefix: "/links" })
    .use(authMiddleware)
    .state('userRepository', new db())
    .get("/", async({ store }) => await linksGet({ db: store.userRepository }))
    .post("/", () => {})
    .get("/:id", () => {})
    .put("/:id", () => {})
    .delete("/:id", () => {});