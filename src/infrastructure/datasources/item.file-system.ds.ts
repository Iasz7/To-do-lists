import buildLogger from "../../config/plugins/logger.plugin";
import {ItemEntity, ItemOptions, ListEntity, ListOptions} from "../../domain/entities";
import fs from 'fs';
import ListFileSystemDs from "./list.file-system.ds";
import ItemDatasource from "../../domain/datasources/item.datasource";

const logger = buildLogger('list.file-sistem')

export default class ItemFileSystemDs implements ItemDatasource{
    constructor(
        //is neccessary to pass the list datasource to make sure to write in the same directory and file name that the lists are written.
        public listFileSystemDs : ListFileSystemDs
    ){}
    async createItem(listId: string, itemOptions: ItemOptions): Promise<ItemEntity> {
        //verificacion que exita la lista
        const lists = await this.listFileSystemDs.getAllLists();
        const selectedList = lists.find(list => list.id === listId);
        if(!selectedList) throw new Error(`List with ID ${listId} not found.`);

        //si se envio ID verificacion que no exista otro item con el mismo ID
        if (itemOptions.id){
            for (const list of lists) {
                for (const item of list.items) {
                    if(item.id == itemOptions.id) throw new Error (`Item ${item.id} already exists`);
                }
            }
        }

        const newItem: ItemEntity = new ItemEntity(itemOptions);
        selectedList.items.push(newItem);
        this.listFileSystemDs.writeFile(lists);
        logger.log(`Item created with ID ${newItem.id} in list ${selectedList.name}`);
        return newItem;
    }
    async updateItem(itemOptions: ItemOptions): Promise<ItemEntity> {
        if(!itemOptions.id)throw new Error(`ID is required to update`);

        const lists = await this.listFileSystemDs.getAllLists();

        for (const list of lists) {
            const selectedItem = list.items.find(item => item.id === itemOptions.id);
            if (selectedItem) {
                selectedItem.description = itemOptions.description;
                if (itemOptions.isActivated !== undefined) selectedItem.isActivated = itemOptions.isActivated;
                if (itemOptions.createdAt) selectedItem.createdAt = itemOptions.createdAt;
                selectedItem.lastModifiedAt = new Date();
                this.listFileSystemDs.writeFile(lists);
                logger.log(`Item with ID ${itemOptions.id} updated in list ${list.name}`);
                return selectedItem;
            }
        }
        throw new Error(`Item with ID ${itemOptions.id} not found.`);
    }
    async getItemById(itemId: string): Promise<ItemEntity> {
        const lists = await this.listFileSystemDs.getAllLists();

        for (const list of lists) {
            const selectedItem = list.items.find(item => item.id === itemId);
            if (selectedItem) {
                return selectedItem;
            }
        }

        throw new Error(`Item with ID ${itemId} not found.`);
    }

    async findItemsByDescription(description: string): Promise<ItemEntity[]> {
        const lists = await this.listFileSystemDs.getAllLists();
        const matchedItems: ItemEntity[] = [];

        lists.forEach(list => {
            list.items.forEach(item => {
                if (item.description.includes(description)) {
                    item.listId = list.id;
                    matchedItems.push(item);
                }
            });
        });

        return matchedItems;
    }
    
    async toggleActivation(itemId: string): Promise<void> {
        const lists = await this.listFileSystemDs.getAllLists();
        for (const list of lists) {
            const item = list.items.find(item => item.id === itemId);
            if (item) {
                item.isActivated = !item.isActivated;
                this.listFileSystemDs.writeFile(lists);
                logger.log(`Item with ID ${itemId} activation toggled to ${item.isActivated}`);
                return;
            }
        }
        throw new Error(`Item with ID ${itemId} not found.`);
    }
    async deleteItem(itemId: string): Promise<void> {
        const lists = await this.listFileSystemDs.getAllLists();
        
        for (const list of lists) {
            const itemIndex = list.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                list.items.splice(itemIndex, 1);
                this.listFileSystemDs.writeFile(lists);

                logger.log(`Item with ID ${itemId} deleted from list ${list.name}`);
                return;
            }
        }
        throw new Error(`Item with ID ${itemId} not found.`);
    }
}