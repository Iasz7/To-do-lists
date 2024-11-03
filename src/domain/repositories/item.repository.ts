import { CreateItemDto, UpdateItemDto, ItemEntity } from '..';


export abstract class ItemRepository {
    abstract getItemById (itemId: string) : Promise<ItemEntity | null>;

    abstract deleteItem  (itemId: string) : Promise<void>;
    
    abstract findItemsByDescription(name: string, userId: string) : Promise<ItemEntity[]>;
    
    abstract updateItem            (updateItemDto: UpdateItemDto) : Promise<ItemEntity>;
    
    abstract createItem            (createItemDto: CreateItemDto) : Promise<ItemEntity>;
}