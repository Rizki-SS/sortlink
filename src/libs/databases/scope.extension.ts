import { Prisma } from "../../../prisma/src/generated/main/prisma/client";
import { DatabaseClient, DatabaseScope } from "./types";

const SCOPED_OPERATIONS = [
    'findMany', 
    'findFirst', 
    'findUnique', 
    'findUniqueOrThrow',
    'count', 
    'update', 
    'updateMany', 
    'delete', 
    'deleteMany'
] as const;

export function createScopeExtension(filters: DatabaseScope) {
    return Prisma.defineExtension((client) => {
        return client.$extends({
            query: {
                $allModels: {
                    async $allOperations({ model, operation, args, query }) {
                        if (SCOPED_OPERATIONS.includes(operation as any)) {
                            if ('where' in args) {
                                args.where = { 
                                    ...args.where, 
                                    ...filters 
                                } as any;
                            }
                        }
                        return query(args);
                    }
                }
            }
        });
    });
}

export function applyScopeToClient(client: DatabaseClient, filters: DatabaseScope) {
    return client.$extends(createScopeExtension(filters));
}
