import { CreateItemDto, UpdateItemDto, ItemEntity } from '..';


export abstract class ItemRepository {

    abstract createItem(createItemDto: CreateItemDto): Promise<ItemEntity>;

    abstract updateItem(updateItemDto: UpdateItemDto): Promise<ItemEntity>;

    abstract getItemById(itemId : string): Promise<ItemEntity>;

    abstract findItemsByDescription(name : string): Promise<ItemEntity[]>;

    abstract deleteItem(itemId : string): Promise<void>;
}