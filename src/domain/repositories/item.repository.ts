import { Item, ItemOptions } from '../entities/item.entity';


export default abstract class itemRepository {

    abstract createItem(listId : string, itemOptions: ItemOptions): Promise<Item>;

    abstract updateItem(itemId : string, itemOptions: ItemOptions): Promise<Item>;

    abstract getItemById(itemId : string): Promise<Item>;

    abstract findItemsByDescription(name : string): Promise<Item[] | undefined>;

    abstract getAllItemsByListId(listId : string): Promise<Item[]>;

    abstract toggleItemActivation(itemId : string): Promise<void>;

    abstract deleteItem(itemId : string): Promise<void>;
}