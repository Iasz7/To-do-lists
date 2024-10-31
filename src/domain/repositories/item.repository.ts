import { CreateItemDto, UpdateItemDto, ItemEntity } from '..';


export abstract class ItemRepository {

    abstract createItem  (createItemDto: CreateItemDto, userId: string)  : Promise<ItemEntity>;

    abstract updateItem  (updateItemDto: UpdateItemDto, userId: string)  : Promise<ItemEntity>;
    
    abstract findItemsByDescription (name: string, userId: string)      : Promise<ItemEntity[]>;

    abstract getItemById            (itemId: string, userId: string)    : Promise<ItemEntity>;

    abstract deleteItem             (itemId: string, userId : string)   : Promise<void>;

}