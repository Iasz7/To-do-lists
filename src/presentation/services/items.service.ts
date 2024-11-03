import { CreateItemDto, CustomError, ItemEntity, ItemRepository, ListRepository, UpdateItemDto } from "../../domain";


export class ItemService{
    
    constructor(
        private readonly itemReposistory : ItemRepository,
        private readonly listRepository : ListRepository
    ){}
    private async _checkListAndUserAuth(listId: string, userId_toValidate: string): Promise<void> {
        const list = await this.listRepository.getListById(listId);
        if (!list) throw new CustomError(`List with id: ${listId} not found`, 404);
        if (list.userId === userId_toValidate) return;
        throw CustomError.forbidden((`User: ${userId_toValidate} unauthorized to access to item from list: ${listId}`));
    }
    
    async createItem(createItemDto: CreateItemDto, userId: string): Promise<ItemEntity> {
        const id = createItemDto.id
        try{ 
            const item = await this.itemReposistory.getItemById(id);
            if (item) throw CustomError.badRequest(`Item with id: ${createItemDto.id} already exists`);

            await this._checkListAndUserAuth(createItemDto.listId, userId);
            
            const newItem = await this.itemReposistory.createItem(createItemDto);
            // console.log("new item created");
            return newItem;
        }
        catch (err:any) {
            const errorMessage = 'Error creating item: ' + err.message
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
    
    async updateItem(updateItemDto: UpdateItemDto, userId: string): Promise<ItemEntity> {
        const id = updateItemDto.id
        try{ 
            //validate that the item exists before updating
            const item = await this.itemReposistory.getItemById(id);
            if (!item) throw new CustomError(`Item with id: ${id} not found`, 404);
            await this._checkListAndUserAuth(item.listId!, userId)
            
            const updatedItem = this.itemReposistory.updateItem(updateItemDto);
            // console.log(`Item with ${id} updated`);
            return updatedItem;
        }
        catch (err:any) {
            const errorMessage = `Error updating item with id ${id}: ${err.message}`
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
    
    async getItemById(id: string, userId: string): Promise<ItemEntity> {
        try {
            const item = await this.itemReposistory.getItemById(id);
            if (!item) throw new CustomError(`Item with id: ${id} not found`, 404)
            await this._checkListAndUserAuth(item.listId!, userId );
            return item
        }
        catch(err: any){
            const errorMessage = `Error fetching item with id: ${id}: ${err.message}`
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }

    async findItemsByDescription(description: string,  userId: string): Promise<ItemEntity[]> {
        throw new Error("Method not implemented.");
    }

    async deleteItem(id: string,  userId: string): Promise<void> {
        const item = await this.itemReposistory.getItemById(id);
        if (!item) throw new CustomError(`Item with id: ${id} not found`, 404);
        await this._checkListAndUserAuth(item.listId!, userId);

        try{ 
            await this.itemReposistory.deleteItem(item.id);
            // return console.log(`Item with id: ${id} deleted`);
        }catch(err:any){
            const errorMessage = `Error deleting item with id: ${id}: ${err.message}`;
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
}