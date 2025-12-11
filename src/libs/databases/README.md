# Database Client System - Clean & Flexible Architecture

## Overview
This refactored database system provides clean, testable, and flexible access to multiple databases with support for sharding.

## Features
- ✅ Multiple database support (main, links, logs, etc.)
- ✅ Database sharding with easy shard selection
- ✅ Custom connection string injection
- ✅ Automatic client caching
- ✅ Scoped queries (teamId, userId filters)
- ✅ Repository factory pattern
- ✅ Clean dependency injection

## Database Structure

```
├── main.db.ts          # Main database client
├── link.db.ts          # Links database with sharding
├── indext.ts           # Unified database provider
├── types.ts            # Type definitions
├── scope.extension.ts  # Prisma scope extension
└── repository.factory.ts # Repository factory
```

## Quick Start

### 1. Environment Variables

```env
# Main Database
DATABASE_URL="postgresql://user:pass@host:port/main_db"

# Sharded Links Databases
DATABASE_URL_LINK_A="postgresql://user:pass@host:port/links_a"
DATABASE_URL_LINK_B="postgresql://user:pass@host:port/links_b"
```

### 2. Get Database Client

```typescript
import ClientDB from "@/libs/databases/indext";

// Main database
const mainClient = ClientDB.getClient('main');

// Links database - shard A
const linksA = ClientDB.getClient('links', 'a');

// Links database - shard B
const linksB = ClientDB.getClient('links', 'b');

// Custom connection string
const customDb = ClientDB.getClient('links', 'postgresql://custom-url');
```

### 3. Scoped Queries

```typescript
// Apply automatic filters to all queries
const scopedClient = ClientDB.withScope('links', {
    userId: 'user-123',
    teamId: 'team-456'
}, 'a'); // shard A

// All queries automatically include userId and teamId filters
```

### 4. Repository Factory

```typescript
import { RepositoryFactory } from "@/libs/databases/repository.factory";

const factory = new RepositoryFactory(ClientDB, 'main');

// Create scoped repository for links shard A
const repo = factory.createScopedRepository(
    LinksQuery,
    { userId: 'user-123' },
    'links',
    'a' // shard name
);

const links = await repo.findWithPagination({...});
```

### 5. Controller Integration

```typescript
export const linksFetch = new Elysia()
    .decorate("repoFactory", new RepositoryFactory(ClientDB))
    .get("/links/:shard", async ({ repoFactory, params, store, query }) => {
        const repo = repoFactory.createScopedRepository(
            LinksQuery,
            { userId: store.user.sub },
            'links',
            params.shard // Dynamic shard selection
        );

        const { total, data } = await repo.findWithPagination({...});
        return paginatedResponse(data, page, limit, total);
    });
```

## Shard Selection Strategy

### Option 1: Hash-based Distribution
```typescript
function getShardByUserId(userId: string): 'a' | 'b' {
    const hash = userId.split('').reduce((acc, char) => 
        acc + char.charCodeAt(0), 0
    );
    return hash % 2 === 0 ? 'a' : 'b';
}
```

### Option 2: Geographic Distribution
```typescript
function getShardByRegion(region: string): 'a' | 'b' {
    return region === 'us-east' ? 'a' : 'b';
}
```

### Option 3: Load-based Distribution
```typescript
async function getAvailableShard(): Promise<'a' | 'b'> {
    const loadA = await checkShardLoad('a');
    const loadB = await checkShardLoad('b');
    return loadA < loadB ? 'a' : 'b';
}
```

## Testing

```typescript
// Mock the database provider
const mockProvider: IDatabaseProvider = {
    getClient: mock(() => ({} as any)),
    withScope: mock((name, filters, shard) => ({
        _scoped: true,
        _filters: filters,
        _shard: shard
    } as any))
};

const factory = new RepositoryFactory(mockProvider);
const repo = factory.createScopedRepository(
    MyRepository,
    { userId: 'test' },
    'links',
    'a'
);
```

## Benefits

### Clean Separation
- Database logic separated from business logic
- Easy to mock and test
- Type-safe interfaces

### Flexible Sharding
- Select shard by name
- Use custom connection strings
- Runtime shard selection

### Automatic Scoping
- Filters applied automatically
- Multi-tenant support
- Team/user isolation

### Performance
- Client caching
- Connection pooling
- Lazy initialization

## Migration

```bash
# Generate Prisma clients
npm run prisma-main:generate
npm run prisma-db-link-a:generate
npm run prisma-db-link-b:generate

# Run migrations
npm run prisma-main:migrate
npm run prisma-db-link-a:migrate
npm run prisma-db-link-b:migrate
```
