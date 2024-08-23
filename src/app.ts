// import { buildLogger, getUUID} from "./config/plugins";
import 'dotenv/config'
import ListFileSystemDs from "./infrastructure/datasources/list.file-system.ds";
import { ListOptions } from './domain/entities/list.entity';
import { buildLogger } from './config/plugins';

const logger =  buildLogger("app.ts");

const listDs = new ListFileSystemDs()
const listOptions : ListOptions[] = [
    { name: "list1", id: "1"},
    { name: "list2", id: "2"},
    { name: "list3", id: "3"}
];

(async () => {
    for (const options of listOptions) {
        await listDs.createList(options).catch(err => {logger.error(err);});
    }
    const lists = await listDs.getAllLists();
    console.log(lists);
     
})();