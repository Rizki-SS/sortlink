import ClientDB from "@/libs/databases/indext";
import { disconnectAllLinkDbClients } from "@/libs/databases/link.db";
import { SHARD_DB } from "@/shorlinks/config/databases";
import { ConsistentHash } from "@/shorlinks/libs/hash";
import CRC32 from "crc-32";

async function handleAddNode(
    newNode: string,
    oldRing: ConsistentHash,
    newRing: ConsistentHash
) {
    console.log(`📦 Rebalancing data to new node: ${newNode}...`);

    const newRingEntries = newRing.getRing();
    let migratedCount = 0;

    for (let i = 0; i < newRingEntries.length; i++) {
        const [hash, node] = newRingEntries[i];

        // Only process ranges assigned to the new node
        if (node !== newNode) continue;

        const prevIndex = (i - 1 + newRingEntries.length) % newRingEntries.length;
        const [prevHash] = newRingEntries[prevIndex];

        const rangeStart = prevHash;
        const rangeEnd = hash;

        console.log(`Processing range: ${rangeStart} → ${rangeEnd}`);
        const oldOwner = oldRing.getNodeForHash(hash);

        console.log(`Fetching data from: ${oldOwner}`);
        const shardMetas = await ClientDB.getClient('main').links_shards.findMany({
            where: { shardKey: oldOwner }
        });

        for (const meta of shardMetas) {
            const keyHash = CRC32.str(meta.hashId) >>> 0;

            // Check if key falls in current range
            const inRange =
                rangeStart < rangeEnd
                    ? keyHash >= rangeStart && keyHash < rangeEnd
                    : keyHash >= rangeStart || keyHash < rangeEnd; // wrap case

            if (!inRange) continue;

            console.log(`Moving ${meta.hashId}: ${oldOwner} → ${newNode}`);

            // Get link data from old shard
            const linkData = await ClientDB.getClient('links', oldOwner).links.findUnique({
                where: { hashId: meta.hashId },
            });

            if (!linkData) {
                console.warn(`⚠️ Link data not found for ${meta.hashId}, skipping...`);
                continue;
            }

            // Create in new shard
            await ClientDB.getClient('links', newNode).links.create({
                data: linkData,
            });

            // Update metadata
            await ClientDB.getClient('main').links_shards.update({
                where: { id: meta.id },
                data: { shardKey: newNode }
            });

            // Delete from old shard
            await ClientDB.getClient('links', oldOwner).links.delete({
                where: { hashId: meta.hashId }
            });

            migratedCount++;
            console.log(`✔ ${meta.hashId} migrated successfully`);
        }
    }

    console.log(`✅ Migrated ${migratedCount} links to ${newNode}`);
}

async function handleRemoveNode(
    nodeToRemove: string,
    oldRing: ConsistentHash,
    newRing: ConsistentHash
) {
    console.log(`📦 Migrating data from ${nodeToRemove}...`);

    // Get all data from the node being removed
    const allLinks = await ClientDB.getClient('links', nodeToRemove).links.findMany();
    
    console.log(`Found ${allLinks.length} links to migrate`);

    for (const link of allLinks) {
        const keyHash = CRC32.str(link.hashId) >>> 0;
        const newOwner = newRing.getNodeForHash(keyHash);

        console.log(`Moving ${link.hashId}: ${nodeToRemove} → ${newOwner}`);
        // Get link data from old shard
        const shard_link = await ClientDB.getClient('links', nodeToRemove).links.findUnique({
            where: { hashId: link.hashId },
        });

        if (!shard_link) {
            console.warn(`⚠️ Link data not found for ${link.hashId}, skipping...`);
            continue;
        }

        // Create link in new shard
        await ClientDB.getClient('links', newOwner).links.create({
            data: {
                hashId: shard_link.hashId,
                url: shard_link.url,
                domainId: shard_link.domainId,
                userId: shard_link.userId,
                teamId: shard_link.teamId,
                createdAt: shard_link.createdAt,
                updatedAt: shard_link.updatedAt,
            },
        });

        // Update links_shards metadata
        const shardMeta = await ClientDB.getClient('main').links_shards.findFirst({
            where: { hashId: link.hashId }
        });

        if (shardMeta) {
            await ClientDB.getClient('main').links_shards.update({
                where: { id: shardMeta.id },
                data: { shardKey: newOwner }
            });
        } else {
            // Create new metadata if not exists
            await ClientDB.getClient('main').links_shards.create({
                data: {
                    hashId: link.hashId,
                    domainId: link.domainId,
                    userId: link.userId,
                    teamId: link.teamId,
                    shardKey: newOwner,
                }
            });
        }

        console.log(`✔ ${link.hashId} migrated successfully`);
    }

    // Delete all data from old node
    console.log(`🗑️ Cleaning up ${nodeToRemove}...`);
    await ClientDB.getClient('links', nodeToRemove).links.deleteMany();

    console.log(`✅ Node ${nodeToRemove} is now empty and can be safely removed`);
}

async function main(newNodeArg?: string, actions: 'add' | 'remove' = 'add') {
    const NEW_SHARD_DB = actions === 'add'
        ? SHARD_DB.concat(newNodeArg ? [newNodeArg] : [])
        : SHARD_DB.filter(n => n !== newNodeArg);

    console.log("🚀 Starting shard rebalance...");
    console.log("Old nodes:", SHARD_DB);
    console.log("New nodes:", NEW_SHARD_DB);

    const oldRing = new ConsistentHash(SHARD_DB, 100);
    const newRing = new ConsistentHash(NEW_SHARD_DB, 100);

    if (actions === 'remove') {
        console.log(`🗑️ Removing node: ${newNodeArg}`);
        await handleRemoveNode(newNodeArg!, oldRing, newRing);
        console.log("🎉 Node removal and rebalance completed!");
        process.exit(0);
    }

    const newShardNode = NEW_SHARD_DB.find(n => !SHARD_DB.includes(n));
    if (!newShardNode) {
        console.log("Tidak ada node baru yang terdeteksi. Tidak ada yang perlu di-rebalance.");
        process.exit(0);
    }

    console.log(`➕ Adding new node: ${newShardNode}`);
    await handleAddNode(newShardNode, oldRing, newRing);
    console.log("🎉 Node addition and rebalance completed!");
}

const newNodeArg = process.argv[2];
const actions = process.argv[3];

if (!newNodeArg) {
    console.error("❌ Please provide a new shard node as argument");
    console.error("Usage: npm run rebalance <new-shard-node>");
    process.exit(1);
}

main(newNodeArg, actions as 'add' | 'remove' || 'add')
    .catch(e => {
        console.error("❌ Error:", e);
    })
    .finally(async () => {
        disconnectAllLinkDbClients();
        process.exit(0);
    });