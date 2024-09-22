import { CreateItemDto, UpdateItemDto, ItemEntity } from '..';

export abstract class ItemDatasource {
    abstract createItem(createItemDto: CreateItemDto): Promise<ItemEntity>;

    abstract updateItem(updateItemDto: UpdateItemDto): Promise<ItemEntity>;

    abstract getItemById(itemId : string): Promise<ItemEntity>;

    abstract findItemsByDescription(description : string): Promise<ItemEntity[]>;

    abstract deleteItem(itemId : string): Promise<void>;
} 
