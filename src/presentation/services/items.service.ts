import { CreateItemDto, CustomError, ItemEntity, ItemRepository, ListRepository, UpdateItemDto } from "../../domain";


export class ItemService{
    
    constructor(
        private readonly itemReposistory : ItemRepository,
        private readonly listRepository : ListRepository
    ){}
    private async validateUserAccess(listId: string, userId_toValidate: string): Promise<void> {
        const list = await this.listRepository.getListById(listId);
        if (list.userId === userId_toValidate) return;
        throw CustomError.forbidden((`User: ${userId_toValidate} unauthorized to access to item from list: ${listId}`));
    }
    
    async createItem(createItemDto: CreateItemDto, userId: string): Promise<ItemEntity> {
        const id = createItemDto.id
        try{ 
            await this.validateUserAccess(createItemDto.listId, userId);
            //validation that the item exists is done in the repository
            const newItem = await this.itemReposistory.createItem(createItemDto);
            console.log("new item created");
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
            await this.validateUserAccess(item.listId!, userId)
            
            const updatedItem = this.itemReposistory.updateItem(updateItemDto);
            console.log(`Item with ${id} updated`);
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
            await this.validateUserAccess(item.listId!, userId );
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
        await this.validateUserAccess(item.listId!, userId);

        try{ 
            //const deletedItem = 
            await this.itemReposistory.deleteItem(item.id);
            return console.log(`Item with id: ${id} deleted`);
            // return deletedItem;
        }catch(err:any){
            const errorMessage = `Error deleting item with id: ${id}: ${err.message}`;
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
}