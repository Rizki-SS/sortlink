import Elysia from "elysia";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";
import { FolderMutate } from "@/shorlinks/repositories/prisma/folder.mutate";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import loader from "../../../../loader";

class FolderDeleteController {
    constructor(
        private folderMutate: FolderMutate
    ) { }

    async handle({ store, params }: {
        store: AppStore,
        params: { id: string }
    }) {
        await this.folderMutate.deleteById(params.id);
        return successResponse({ message: "Folder deleted successfully" });
    }
}

const FolderDeleteFactory = ({ repositoryFactory }: any) => {
    const folderMutate = repositoryFactory.createRepository(FolderMutate);
    return new FolderDeleteController(folderMutate);
};

export const folderDelete = new Elysia()
    .use(loader)
    .decorate("folderDeleteFactory", FolderDeleteFactory)
    .delete("/:id", async ({ store, params, folderDeleteFactory, repositoryFactory }) =>
        await folderDeleteFactory({ repositoryFactory }).handle({
            store: store as AppStore,
            params
        }));
