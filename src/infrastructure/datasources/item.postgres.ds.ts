import { prisma } from "../../data/postgres/init";
import { CreateItemDto, ItemDatasource, ItemEntity, UpdateItemDto } from "../../domain";


export class ItemPostgresDs implements ItemDatasource{
    async createItem(createItemDto: CreateItemDto): Promise<ItemEntity> {
        const prismaItem = await prisma.item.create({data: createItemDto})
        return prismaItem;
    }
    
    async updateItem(updateItemDto: UpdateItemDto): Promise<ItemEntity> {
        const updatedItem = await prisma.item.update({
            where: {id :updateItemDto.id },
            data: updateItemDto.updatedValues})
        return updatedItem;
    }
    
    async getItemById(id: string): Promise<ItemEntity | null> {
        const item = await prisma.item.findUnique({where: {id}})
        return item
    }

    async findItemsByDescription(description: string,  userId: string): Promise<ItemEntity[]> {
        throw new Error("Method not implemented.");
    }
    
    async deleteItem(id: string): Promise<void> {
        await prisma.item.delete({where: {id}});
    }
}