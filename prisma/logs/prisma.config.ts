import 'dotenv/config'
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/logs/schema.prisma',
    migrations: {
        path: 'prisma/logs/migrations',
    },
    datasource: {
        url: env('LOG_DATABASE_URL'),
    },
});