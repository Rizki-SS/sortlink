import Elysia from "elysia";
import { FolderCreationSchema } from "../../requests/folder.form";
import { successResponse } from "@/libs/http/response";
import AppStore from "@/libs/type/store.user";
import { FolderMutate } from "@/shorlinks/repositories/prisma/folder.mutate";
import { RepositoryFactory } from "@/libs/databases/repository.factory";
import loader from "../../../../loader";

class FolderCreateController {
    constructor(
        private folderMutate: FolderMutate
    ) { }

    async handle({ body, store }: {
        body: any,
        store: AppStore
    }) {
        const folder = await this.folderMutate.create({
            name: body.name,
            parentId: body.parentId || null,
            userId: store.user.sub,
            teamId: store.user.selected_teamId || null
        });

        return successResponse(folder);
    }
}

const FolderCreateFactory = ({ repositoryFactory }: any) => {
    const folderMutate = repositoryFactory.createRepository(FolderMutate);
    return new FolderCreateController(folderMutate);
};

const folderCreate = new Elysia()
    .use(loader)
    .decorate('folderCreateFactory', FolderCreateFactory)
    .post("/", async ({ store, body, folderCreateFactory, repositoryFactory }) =>
        await folderCreateFactory({ repositoryFactory }).handle({
            store: store as AppStore,
            body
        }), {
        body: FolderCreationSchema,
        store: true
    });

export default folderCreate;
