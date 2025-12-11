import { mainClient } from "./main.db"
import { getLinkDbClient, getLinkDbClientByUrl, ShardName } from "./link.db";
import { applyScopeToClient } from "./scope.extension";
import { DatabaseScope, IDatabaseProvider } from "./types";

const ClientDB: IDatabaseProvider = {

    getClient(name: string, shardOrUrl?: string){
        switch(name){
            case 'main':
                return mainClient;
            case 'links':
                if (!shardOrUrl) {
                    throw new Error('Shard name or connection URL is required for links database');
                }
                
                if (shardOrUrl.startsWith('postgresql://') || shardOrUrl.startsWith('postgres://')) {
                    return getLinkDbClientByUrl(shardOrUrl);
                }
                return getLinkDbClient(shardOrUrl as ShardName);
            default:
                throw new Error(`Database client ${name} not found`);
        }
    },
    
    withScope(name: string, filters: DatabaseScope, shardOrUrl?: string) {
        const client = this.getClient(name, shardOrUrl);
        return applyScopeToClient(client, filters);
    }
    
}

export default ClientDB;