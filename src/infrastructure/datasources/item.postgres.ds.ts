import { prisma } from "../../data/postgres/init";
import { CreateItemDto, CustomError, ItemDatasource, ItemEntity, UpdateItemDto } from "../../domain";


export class ItemPostgresDs implements ItemDatasource{
    async createItem(createItemDto: CreateItemDto): Promise<ItemEntity> {
        try{ 
            const item = await prisma.item.findUnique({where: {id: createItemDto.id}})
            if (item) throw CustomError.badRequest(`Item with id: ${createItemDto.id} already exists`);

            const prismaItem = await prisma.item.create({data: createItemDto})
            return prismaItem;
        }
        catch (err:any) {
            const errorMessage = 'Error creating item in postgres: ' + err.message
            throw new CustomError (errorMessage, (err.statusCode || 500));
        }
    }
    
    async updateItem(updateItemDto: UpdateItemDto): Promise<ItemEntity> {
        const id = updateItemDto.id
        try{ 
            const updatedItem = await prisma.item.update({
                where: {id},
                data: updateItemDto.updatedValues})
            return updatedItem;
        }
        catch (err:any) {
            const errorMessage = `Error updating item with id ${id} in postgres: ${err.message}`
            throw new CustomError(errorMessage, 500);
        }
    }
    
    async getItemById(id: string): Promise<ItemEntity> {
        try {
            const item = await prisma.item.findUnique({where: {id}})
            if (!item) throw new CustomError(`Item with id: ${id} not found`, 404)
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
    
    async deleteItem(id: string): Promise<void> {
        try{ 
            //const deletedItem = 
            await prisma.item.delete({where: {id}});
            // return deletedItem;
        }catch(err:any){
            const errorMessage = `Error in postgres deleting item with id: ${id}: ${err.message}`;
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
}