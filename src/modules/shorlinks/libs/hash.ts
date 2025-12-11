import crc32 from "crc-32";
import { SHARD_DB } from "../config/databases";

export class ConsistentHash {
    private nodes: string[];
    private virtualNodes: number;
    private ring: Map<number, string> = new Map();
    private sortedRing: [number, string][] = [];

    constructor(nodes: string[], virtualNodes: number = 100) {
        this.nodes = nodes;
        this.virtualNodes = virtualNodes;

        this.generateRing();
    }

    private hash(value: string): number {
        return crc32.str(value) >>> 0; // convert to unsigned
    }

    private generateRing(): void {
        for (const node of this.nodes) {
            for (let i = 0; i < this.virtualNodes; i++) {
                const hash = this.hash(`${node}:${i}`);
                this.ring.set(hash, node);
            }
        }

        // Sort by hash ascending
        this.sortedRing = Array.from(this.ring.entries()).sort(
            (a, b) => a[0] - b[0]
        );
    }

    public getNode(key: string): string {
        const keyHash = this.hash(key);

        for (const [hash, node] of this.sortedRing) {
            if (hash >= keyHash) {
                return node;
            }
        }

        // wrap around to the first node
        return this.sortedRing[0][1];
    }

    public addNode(node: string): void {
        this.nodes.push(node);
        this.ring.clear();
        this.generateRing();
    }

    public removeNode(node: string): void {
        this.nodes = this.nodes.filter(n => n !== node);
        this.ring.clear();
        this.generateRing();
    }

    public getRing(): [number, string][] {
        return this.sortedRing;
    }

    public getNodeForHash(hashValue: number): string {
        for (const [hash, node] of this.sortedRing) {
            if (hash >= hashValue) {
                return node;
            }
        }
        return this.sortedRing[0][1];
    }

}


export const ConsistentHashFactory = 
    new ConsistentHash(SHARD_DB);