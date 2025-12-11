import { describe, it, expect, mock } from "bun:test";
import { DatabaseScope, IDatabaseProvider } from "../types";

// Mock implementation for testing
class MockDatabaseProvider implements IDatabaseProvider {
    private mockClient: any;

    constructor() {
        this.mockClient = {
            $extends: mock((extension: any) => ({
                ...this.mockClient,
                _extended: true,
                _extension: extension
            }))
        };
    }

    getClient(name: string) {
        if (name !== 'main') {
            throw new Error(`Database client ${name} not found`);
        }
        return this.mockClient;
    }

    withScope(name: string, filters: DatabaseScope) {
        const client = this.getClient(name);
        return client.$extends({ filters });
    }
}

describe("DatabaseProvider", () => {
    it("should get client by name", () => {
        const provider = new MockDatabaseProvider();
        const client = provider.getClient('main');
        
        expect(client).toBeDefined();
    });

    it("should throw error for unknown client", () => {
        const provider = new MockDatabaseProvider();
        
        expect(() => provider.getClient('unknown')).toThrow('Database client unknown not found');
    });

    it("should create scoped client with filters", () => {
        const provider = new MockDatabaseProvider();
        const filters = { teamId: "team-123", userId: "user-456" };
        
        const scopedClient = provider.withScope('main', filters);
        
        expect(scopedClient).toBeDefined();
        expect(scopedClient._extended).toBe(true);
    });
});
