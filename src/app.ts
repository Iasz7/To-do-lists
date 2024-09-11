// import { buildLogger, getUUID} from "./config/plugins";
import 'dotenv/config'
import ListFileSystemDs from "./infrastructure/datasources/list.file-system.ds";
import { buildLogger } from './config/plugins';
import { ItemOptions, ItemEntity, ListEntity, ListOptions } from './domain/entities';
import ItemFileSystemDs from './infrastructure/datasources/item.file-system.ds';

const logger =  buildLogger("app.ts");
 
const listDs = new ListFileSystemDs()
const itemDs = new ItemFileSystemDs()
const listsOptions : ListOptions[] = [
    { name: "list1", id: "1"},
    { name: "list2", id: "2"},
    { name: "list3", id: "3"}
];
const itemsOptions : ItemOptions[] = [
    { description: "Item 1", id: "1"},
    { description: "Item 2", id: "2"},
    { description: "Item 3", id: "3"}
];
//MANUAL TESTING FOR LIST DS ON FILE SYSTEM
(async () => {
    try{
        //crea listas
        for (const listOptions of listsOptions) {
            await listDs.createList(listOptions).catch(err => {logger.error(err);});
        }

        //crea items en lista con id 1
        for (const item of itemsOptions) {
            await itemDs.createItem('1', item).catch(err => {logger.error(`Error al crear item ${JSON.stringify(item)}: ${err}`);})
        }

        //prueba de delete y update
        await itemDs.deleteItem('3');
        await itemDs.updateItem({id :'1', description: "Item 1 updated", isActivated: true })
        
        //mostrar lista después de las operaciones
        let lists = await listDs.getAllLists();
        console.log(JSON.stringify(lists, null, 2));
        
        //eleminar listas de prueba, y prueba de delete
        for (const list of lists) {
            await listDs.removeListById(list.id).catch(err => {console.log(`Error al eliminar lista ${list.name}`);});
        }  
    }
    catch(err){
        console.error(err);
    }
    finally {console.log(`\n\nEND OF APPLICATION\n\n`)}
})();