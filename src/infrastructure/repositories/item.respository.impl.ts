import { CreateItemDto, ItemDatasource, ItemEntity, ItemRepository, UpdateItemDto } from "../../domain";


export class ItemRepositoryImpl implements ItemRepository{

    constructor(private readonly itemDatasource: ItemDatasource){}
    createItem (createItemDto: CreateItemDto, userId: string): Promise<ItemEntity> {
        return this.itemDatasource.createItem(createItemDto, userId);
    }
    updateItem (updateItemDto: UpdateItemDto, userId: string): Promise<ItemEntity> {
        return this.itemDatasource.updateItem(updateItemDto, userId);
    }
    getItemById (itemId: string, userId: string): Promise<ItemEntity> {
        return this.itemDatasource.getItemById(itemId, userId);
    }
    findItemsByDescription (name: string, userId: string): Promise<ItemEntity[]> {
        return this.itemDatasource.findItemsByDescription(name, userId);
    }
    deleteItem (itemId: string, userId: string): Promise<void> {
        return this.itemDatasource.deleteItem(itemId, userId)
    }
}