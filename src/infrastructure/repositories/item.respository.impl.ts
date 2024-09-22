import { CreateItemDto, ItemDatasource, ItemEntity, ItemRepository, UpdateItemDto } from "../../domain";


export class ItemRepositoryImpl implements ItemRepository{

    constructor(private readonly itemDatasource: ItemDatasource){}
    createItem(createItemDto: CreateItemDto): Promise<ItemEntity> {
        return this.itemDatasource.createItem(createItemDto);
    }
    updateItem(updateItemDto: UpdateItemDto): Promise<ItemEntity> {
        return this.itemDatasource.updateItem(updateItemDto);
    }
    getItemById(itemId: string): Promise<ItemEntity> {
        return this.itemDatasource.getItemById(itemId);
    }
    findItemsByDescription(name: string): Promise<ItemEntity[]> {
        return this.itemDatasource.findItemsByDescription(name);
    }
    deleteItem(itemId: string): Promise<void> {
        return this.itemDatasource.deleteItem(itemId)
    }
}