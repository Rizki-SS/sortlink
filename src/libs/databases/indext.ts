import { mainClient } from "./main.db"

class ClientDB{
    getClient(name: string){
        switch(name){
            case 'main':
                return mainClient;
            default:
                throw new Error(`Database client ${name} not found`);
        }
    }   
}

export default ClientDB;