import { CreateItemDto, UpdateItemDto, ItemEntity } from '..';

export abstract class ItemDatasource {
    abstract createItem (createItemDto: CreateItemDto, userId: string): Promise<ItemEntity>;

    abstract updateItem (updateItemDto: UpdateItemDto, userId: string): Promise<ItemEntity>;

    abstract getItemById(itemId : string, userId: string): Promise<ItemEntity>;
    
    abstract deleteItem (itemId : string, userId: string): Promise<void>;

    abstract findItemsByDescription(description : string, userId: string): Promise<ItemEntity[]>;
} 
