import { prisma } from "../../data/postgres/init";
import { CreateItemDto, CustomError, ItemDatasource, ItemEntity, UpdateItemDto } from "../../domain";


export class ItemPostgresDs implements ItemDatasource{
    
    private async validateUserAccess(listId: string, userId_toValidate: string): Promise<void> {
        const list = await prisma.list.findUnique({where: {id:listId}})
        if(list?.userId === userId_toValidate) return;
        throw CustomError.forbidden((`User: ${userId_toValidate} unauthorized to access to item from list: ${listId}`));
    }
    
    async createItem(createItemDto: CreateItemDto, userId: string): Promise<ItemEntity> {
        const id = createItemDto.id
        try{ 
            const item = await prisma.item.findUnique({where: {id}})
            if (item) throw CustomError.badRequest(`Item with id: ${id} already exists`);
            await this.validateUserAccess(createItemDto.listId, userId)


            const prismaItem = await prisma.item.create({data: createItemDto})
            console.log("new item created");
            return prismaItem;
        }
        catch (err:any) {
            const errorMessage = 'Error creating item in postgres: ' + err.message
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
    
    async updateItem(updateItemDto: UpdateItemDto, userId: string): Promise<ItemEntity> {
        const id = updateItemDto.id
        try{ 
            //validate that the item exists before updating
            const item = await prisma.item.findUnique({where: {id}})
            if (!item) throw new CustomError(`Item with id: ${id} not found`, 404);
            await this.validateUserAccess(item.listId, userId)
            
            const updatedItem = await prisma.item.update({
                where: {id},
                data: updateItemDto.updatedValues})
            console.log(`Item with ${id} updated`);
            return updatedItem;
        }
        catch (err:any) {
            const errorMessage = `Error updating item with id ${id} in postgres: ${err.message}`
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
    
    async getItemById(id: string, userId: string): Promise<ItemEntity> {
        try {
            const item = await prisma.item.findUnique({where: {id}})
            if (!item) throw new CustomError(`Item with id: ${id} not found`, 404)
            this.validateUserAccess(item!.listId, userId );
            return item
        }
        catch(err: any){
            const errorMessage = `Error fetching item with id: ${id} from postgres: ${err.message}`
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }

    async findItemsByDescription(description: string,  userId: string): Promise<ItemEntity[]> {
        throw new Error("Method not implemented.");
    }
    
    async deleteItem(id: string,  userId: string): Promise<void> {
        
        const item = await prisma.item.findUnique({where: {id}})
        if (!item) throw new CustomError(`Item with id: ${id} not found`, 404);
        await this.validateUserAccess(item.listId, userId)

        try{ 
            //const deletedItem = 
            await prisma.item.delete({where: {id}});
            console.log(`Item with id: ${id} deleted`)
            // return deletedItem;
        }catch(err:any){
            const errorMessage = `Error in postgres deleting item with id: ${id}: ${err.message}`;
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
}