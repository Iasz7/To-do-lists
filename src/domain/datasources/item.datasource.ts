import { ListEntity } from '../entities';
import { ItemEntity, ItemOptions } from '../entities/item.entity';
import ListDatasource from './list.datasource';


export default abstract class ItemDatasource {
    abstract createItem(listId : string, itemOptions: ItemOptions): Promise<ItemEntity>;

    abstract updateItem(itemOptions: ItemOptions): Promise<ItemEntity>;

    abstract getItemById(itemId : string): Promise<ItemEntity>;

    abstract findItemsByDescription(description : string): Promise<ItemEntity[]>;
    
    abstract toggleActivation(itemId : string): Promise<void>;

    abstract deleteItem(itemId : string): Promise<void>;
} 
