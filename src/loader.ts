import Elysia from "elysia";
import ClientDB from "./libs/databases/indext";
import { RepositoryFactory } from "./libs/databases/repository.factory";

const loader = new Elysia()
    .decorate('repositoryFactory', new RepositoryFactory(ClientDB))

export default loader;