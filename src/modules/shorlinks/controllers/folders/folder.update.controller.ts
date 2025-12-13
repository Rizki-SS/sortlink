import Elysia from "elysia";
import { FolderUpdateSchema } from "../../requests/folder.form";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";
import { FolderMutate } from "@/shorlinks/repositories/prisma/folder.mutate";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import loader from "../../../../loader";

class FolderUpdateController {
    constructor(
        private folderMutate: FolderMutate
    ) { }

    async handle({ body, store, params }: {
        body: any,
        store: AppStore,
        params: { id: string }
    }) {
        const folder = await this.folderMutate.updateById(params.id, {
            name: body.name,
            parent: body.folderId ? { connect: { id: body.folderId } } : undefined
        });

        return successResponse(folder);
    }
}

const FolderUpdateFactory = ({ repositoryFactory }: any) => {
    const folderMutate = repositoryFactory.createRepository(FolderMutate);
    return new FolderUpdateController(folderMutate);
};

export const folderUpdate = new Elysia()
    .use(loader)
    .decorate('folderUpdateFactory', FolderUpdateFactory)
    .put("/:id", async ({ body, store, params, folderUpdateFactory, repositoryFactory }) =>
        await folderUpdateFactory({ repositoryFactory }).handle({
            store: store as AppStore,
            body,
            params
        }), {
        body: FolderUpdateSchema,
        store: true
    });
