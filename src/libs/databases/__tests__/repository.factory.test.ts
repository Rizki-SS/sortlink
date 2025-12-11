import { describe, it, expect, mock } from "bun:test";
import { RepositoryFactory } from "../repository.factory";
import { DatabaseScope, IDatabaseProvider, ScopedClient } from "../types";

class MockRepository {
    constructor(public client: any) {}
    
    async findAll() {
        return [];
    }
}

describe("RepositoryFactory", () => {
    it("should create scoped repository with proper scope", () => {
        const mockProvider: IDatabaseProvider = {
            getClient: mock(() => ({} as any)),
            withScope: mock((name: string, filters: DatabaseScope, shardOrUrl?: string) => ({
                _scoped: true,
                _filters: filters,
                _shard: shardOrUrl
            } as any))
        };

        const factory = new RepositoryFactory(mockProvider);
        const scope = { teamId: "team-123", userId: "user-456" };
        
        const repo = factory.createScopedRepository(MockRepository, scope);
        
        expect(repo).toBeInstanceOf(MockRepository);
        expect(repo.client._scoped).toBe(true);
        expect(repo.client._filters).toEqual(scope);
        expect(mockProvider.withScope).toHaveBeenCalledWith('main', scope, undefined);
    });

    it("should create different repositories with different scopes", () => {
        const mockProvider: IDatabaseProvider = {
            getClient: mock(() => ({} as any)),
            withScope: mock((name: string, filters: DatabaseScope, shardOrUrl?: string) => ({
                _filters: filters,
                _shard: shardOrUrl
            } as any))
        };

        const factory = new RepositoryFactory(mockProvider);
        
        const repo1 = factory.createScopedRepository(MockRepository, { teamId: "team-1" });
        const repo2 = factory.createScopedRepository(MockRepository, { teamId: "team-2" });
        
        expect(repo1.client._filters).toEqual({ teamId: "team-1" });
        expect(repo2.client._filters).toEqual({ teamId: "team-2" });
        expect(mockProvider.withScope).toHaveBeenCalledTimes(2);
    });

    it("should create scoped repository with shard", () => {
        const mockProvider: IDatabaseProvider = {
            getClient: mock(() => ({} as any)),
            withScope: mock((name: string, filters: DatabaseScope, shardOrUrl?: string) => ({
                _scoped: true,
                _filters: filters,
                _shard: shardOrUrl
            } as any))
        };

        const factory = new RepositoryFactory(mockProvider);
        const scope = { teamId: "team-123" };
        
        const repo = factory.createScopedRepository(MockRepository, scope, 'links', 'a');
        
        expect(repo).toBeInstanceOf(MockRepository);
        expect(repo.client._shard).toBe('a');
        expect(mockProvider.withScope).toHaveBeenCalledWith('links', scope, 'a');
    });

    it("should create repository without scope", () => {
        const mockProvider: IDatabaseProvider = {
            getClient: mock((name: string, shardOrUrl?: string) => ({
                _dbName: name,
                _shard: shardOrUrl
            } as any)),
            withScope: mock(() => ({} as any))
        };

        const factory = new RepositoryFactory(mockProvider);
        
        const repo = factory.createRepository(MockRepository, 'links', 'b');
        
        expect(repo).toBeInstanceOf(MockRepository);
        expect(repo.client._dbName).toBe('links');
        expect(repo.client._shard).toBe('b');
        expect(mockProvider.getClient).toHaveBeenCalledWith('links', 'b');
    });
});
