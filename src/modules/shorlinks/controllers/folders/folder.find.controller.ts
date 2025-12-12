import Elysia from "elysia";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";
import { FolderQuery } from "@/shorlinks/repositories/prisma/folder.query";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import loader from "../../../../loader";

class FolderFindController {
    constructor(
        private folderQuery: FolderQuery
    ) { }

    async handle({ params }: {
        params: { id: string }
    }) {
        const folder = await this.folderQuery.findById(params.id);

        if (!folder) {
            throw new Error("Folder not found");
        }

        return successResponse(folder);
    }
}

const FolderFindFactory = ({ repositoryFactory }: any) => {
    const folderQuery = repositoryFactory.createRepository(FolderQuery);
    return new FolderFindController(folderQuery);
};

export const folderFind = new Elysia()
    .use(loader)
    .decorate('folderFindFactory', FolderFindFactory)
    .get("/:id", async ({ params, folderFindFactory, repositoryFactory }) =>
        await folderFindFactory({ repositoryFactory }).handle({
            params
        }));
