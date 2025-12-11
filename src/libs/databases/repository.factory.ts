import { DatabaseScope, IDatabaseProvider, ScopedClient } from "@/libs/databases/types";

export interface IRepositoryFactory {
    createScopedRepository<T>(
        RepositoryClass: new (client: ScopedClient) => T,
        scope: DatabaseScope,
        dbName?: string,
        shardOrUrl?: string
    ): T;
    
    createRepository<T>(
        RepositoryClass: new (client: ScopedClient) => T,
        dbName?: string,
        shardOrUrl?: string
    ): T;
}

export class RepositoryFactory implements IRepositoryFactory {
    constructor(
        private dbProvider: IDatabaseProvider,
        private defaultDbName: string = 'main'
    ) {}

    createScopedRepository<T>(
        RepositoryClass: new (client: ScopedClient) => T,
        scope: DatabaseScope,
        dbName?: string,
        shardOrUrl?: string
    ): T {
        const databaseName = dbName || this.defaultDbName;
        const scopedClient = this.dbProvider.withScope(databaseName, scope, shardOrUrl);
        return new RepositoryClass(scopedClient);
    }
    
    createRepository<T>(
        RepositoryClass: new (client: ScopedClient) => T,
        dbName?: string,
        shardOrUrl?: string
    ): T {
        const databaseName = dbName || this.defaultDbName;
        const client = this.dbProvider.getClient(databaseName, shardOrUrl);
        return new RepositoryClass(client);
    }
}
