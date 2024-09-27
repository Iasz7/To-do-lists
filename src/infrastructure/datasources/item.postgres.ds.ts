import { prisma } from "../../data/postgres/init";
import { CreateItemDto, customError, ItemDatasource, ItemEntity, UpdateItemDto } from "../../domain";


export class ItemPostgresDs implements ItemDatasource{
    
    
    async createItem(createItemDto: CreateItemDto): Promise<ItemEntity> {
        try{ 
            await this.validateItemExists(createItemDto.id, false);

            const prismaItem = await prisma.item.create({data: createItemDto})
            console.log("new item created");
            return prismaItem;
        }
        catch (err:any) {
            const errorMessage = 'Error creating item in postgres: ' + err.message
            console.error(errorMessage);
            throw new customError (errorMessage, (err instanceof customError) ? err.statusCode: 500);
        }
    }
    
    async updateItem(updateItemDto: UpdateItemDto): Promise<ItemEntity> {
        const id = updateItemDto.id
        try{ 
            //validate that the item exists before updating
            await this.validateItemExists(id);
            
            const updatedItem = await prisma.item.update({
                where: {id},
                data: updateItemDto.updatedValues})
            console.log(`Item with ${id} updated`);
            return (updatedItem);
        }
        catch (err:any) {
            const errorMessage = `Error updating item with id ${id} in postgres: ${err.message}`
            console.error(errorMessage);
            throw new customError(errorMessage, (err instanceof customError) ? err.statusCode: 500);
        }
    }
    
    async getItemById(id: string): Promise<ItemEntity> {
        try {
            const item = await prisma.item.findUnique({where: {id}})
            if (!item) throw new customError(`Item with id: ${id} not found`, 404)
            return item
        }
        catch(err: any){
            const messageError = `Error fetching item with id: ${id} from postgres: ${err.message}`
            console.error(messageError);
            throw new customError(messageError, (err instanceof customError) ? err.statusCode: 500);
        }
    }

    async findItemsByDescription(description: string): Promise<ItemEntity[]> {
        throw new Error("Method not implemented.");
    }
    
    async deleteItem(id: string): Promise<void> {
        
        await this.validateItemExists(id)
        try{ 
            //const deletedItem = 
            await prisma.item.delete({where: {id}});
            console.log(`Item with id: ${id} deleted`)
            // return deletedItem;
        }catch(err:any){
            const errorMessage = `Error in postgres deleting item with id: ${id}: ${err.message}`;
            console.error(errorMessage);
            throw new customError(errorMessage, (err instanceof customError) ? err.statusCode: 500);
        }
    }

    public getAllItems = async () : Promise<ItemEntity[]> => {
        try{
            const items = await prisma.item.findMany();
            return items
        }catch(err) {
            const messageError ='Error fetching all items from postgres: ' + err
            console.error(messageError);
            throw new Error(messageError);
        }
    }

    private validateItemExists = async (id: string, awaitedValue? : boolean) : Promise<boolean> => {
        if (awaitedValue === undefined) awaitedValue= true;
        const item = await prisma.item.findUnique({where: {id}})
        if (awaitedValue &&! item) throw new customError(`Item with id: ${id} not found`, 404);
        if (awaitedValue == false && item) throw new customError(`Item with id: ${id} already exists`, 400)
        
        return (item) ?  true : false;
    }

}