export const SHARD_DB = process.env.SHARD_DB_NODES
    ? process.env.SHARD_DB_NODES.split(',').map(s => s.trim())
    : [];