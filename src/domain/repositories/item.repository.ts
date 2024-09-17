import { CreateItemDto, UpdateItemDto, ItemEntity } from '..';


export default abstract class itemRepository {

    abstract createItem(createItemDto: CreateItemDto): Promise<ItemEntity>;

    abstract updateItem(updateItemDto: UpdateItemDto): Promise<ItemEntity>;

    abstract getItemById(itemId : string): Promise<ItemEntity>;

    abstract findItemsByDescription(name : string): Promise<ItemEntity[]>;

    abstract toggleItemActivation(itemId : string): Promise<void>;

    abstract deleteItem(itemId : string): Promise<void>;
}