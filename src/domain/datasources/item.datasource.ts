import { CreateItemDto, UpdateItemDto, ItemEntity } from '..';

export abstract class ItemDatasource {
    abstract createItem (createItemDto: CreateItemDto): Promise<ItemEntity>;

    abstract updateItem (updateItemDto: UpdateItemDto): Promise<ItemEntity>;

    abstract getItemById (itemId : string) : Promise<ItemEntity>;
    
    abstract deleteItem  (itemId : string) : Promise<void>;
    abstract findItemsByDescription(description : string, userId: string): Promise<ItemEntity[]>;
} 
