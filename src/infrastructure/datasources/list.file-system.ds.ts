import buildLogger from "../../config/plugins/logger.plugin";
import ListDatasource from "../../domain/datasources/list.datasource";
import { ListEntity, ListOptions } from "../../domain/entities/list.entity";
import fs from 'fs';

const logger = buildLogger('list.file-sistem')

export default class ListFileSystemDs implements ListDatasource{

    public outputPath: string = 'outputs/lists/';
    
    public fileName: string = 'to-do-list'

    public get filePath(): string {return `${this.outputPath}${this.fileName}.txt` }

    public writeFile(lists: ListEntity[]){
        fs.writeFileSync(this.filePath, JSON.stringify(lists, null, 2));
        // console.log(`Escritura en ${this.filePath} finalizada`);
    }

    async getListById (id: string) : Promise<ListEntity>{
        const lists = await this.getAllLists()
        const list = lists.find(list => list.id === id);
        if (list) {
            return list;
        } else {
            throw new Error(`List with ID ${id} not found`);
        }
    }
    
    async findListsByName(name: string) : Promise<ListEntity[]>{
        const lists = await this.getAllLists();
        const matchingLists = lists.filter(list => list.name.includes(name));
        return matchingLists;
    }
    
    async getAllLists(): Promise<ListEntity[]>{
        if(!fs.existsSync(this.filePath)){
            console.error(`Cannot find file ${this.filePath}`); 
            return [];
        }
        const content = fs.readFileSync(this.filePath, 'utf8')

        if (content === '') return [];
        return JSON.parse(content) as ListEntity[];
    }


    async createList(listOptions: ListOptions): Promise<ListEntity> {
        const newList = new ListEntity(listOptions);
        try {
            let lists = await this.getAllLists();

            // Verificar si ya existe una lista con el mismo ID
            if (lists.some(list => list.id === newList.id)) {
                throw new Error(`List with ID ${newList.id} already exists`);
            }

            lists.push(newList);
            if (!fs.existsSync(this.outputPath)) {
                fs.mkdirSync(this.outputPath, { recursive: true });
            }
            this.writeFile(lists);
            logger.log(`List ${newList.name} written in ${this.fileName}`);
            return newList;   
        } catch (error) {
            logger.error(`Error writing list ${listOptions.name}: ${error}`);
            throw error;
        }  
    }

    async updateList(updatedListOptions: ListOptions):  Promise<ListEntity>{
        let lists = await this.getAllLists();

        if (!updatedListOptions.id) throw new Error('Id is required to update list');
        
        const index = lists.findIndex(list => list.id === updatedListOptions.id);
        
        if (index === -1) {
            throw new Error(`List with ID ${updatedListOptions.id} not found`);
        }

        lists[index] = new ListEntity(updatedListOptions);
        this.writeFile(lists);
        logger.log(`List with ID ${updatedListOptions.id} updated successfully`);
        return lists[index];
    }

    async removeListById(id: string):  Promise<void>{
        let lists = await this.getAllLists();
        const index = lists.findIndex(list => list.id === id);
        
        if (index === -1)throw new Error(`List with ID ${id} not found`);

        lists.splice(index, 1);
        this.writeFile(lists);
        logger.log(`List with ID ${id} removed successfully`);
    }
}
    
    // ~~~TODO ESTE CODIGO ERA PARA CREAR UN ARCHIVO PARA CADA LISTA~~~
    // public outputPath: string = 'outputs/lists/';

    // private filePathByName(name:string): string{
    //     return `${this.outputPath}${name}.txt`;
    // }
    
    // private async getListByName(listName: string):Promise<ListEntity>{
    //     const filePath = this.filePathByName(listName);
    //     if(fs.existsSync(filePath)){
    //         const content = fs.readFileSync(filePath, 'utf-8')
    //         logger.log(`file: ${filePath} found and read successfully`) 
    //         return JSON.parse(content) as ListEntity;
    //     } else {
    //         throw new Error(`List ${filePath} not found`);
    //     }
    // }

    // async createList(listOptions: ListOptions) : Promise<ListEntity>{
    //     const newList = new ListEntity(listOptions)
    //     try {
    //         fs.mkdirSync(this.outputPath, {recursive : true});
    //         fs.writeFileSync(`${this.outputPath}${listOptions.name}`,  newList.toString());
    //         logger.log(`list ${listOptions.name} created in ${this.outputPath}`)
    //         return newList;
    //     } catch (error) {
    //         logger.error(`Error creating list ${listOptions.name}: ${error}`)
    //         throw error;
    //     }
    
    // }    // async removeListById(id: string):  Promise<void>{
    //     fs.rmSync(this.outputPath);
    // }