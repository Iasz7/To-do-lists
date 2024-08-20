import { ItemEntity, ItemOptions } from '../entities/item.entity';


export default abstract class itemDataSource {

    abstract createItem(listId : string, itemOptions: ItemOptions): Promise<ItemEntity>;

    abstract updateItem(itemId : string, itemOptions: ItemOptions): Promise<ItemEntity>;

    abstract getItemById(itemId : string): Promise<ItemEntity>;

    abstract findItemsByDescription(name : string): Promise<ItemEntity[]>;

    abstract getAllItemsByListId(listId : string): Promise<ItemEntity[]>;

    abstract toggleItemActivation(itemId : string): Promise<void>;

    abstract deleteItem(itemId : string): Promise<void>;
} 
