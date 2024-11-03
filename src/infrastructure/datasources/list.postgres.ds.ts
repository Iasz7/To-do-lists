import { prisma } from "../../data/postgres/init";
import { CreateListDto, CustomError, ListDatasource, ListEntity, UpdateListDto } from "../../domain";

export class ListPostgresDs implements ListDatasource{
    async getListById(id: string):Promise<ListEntity | null>{
        const list = await prisma.list.findUnique({where: {id}})
        if (!list) return null;
        return this.fillListWithItems(list)
    }

    async findListsByName(name: string, userId : string):Promise<ListEntity[]>{
        const lists = await prisma.list.findMany({where: {name, userId}})
        if (!lists) return []
        const filledList = await this.fillListsWithItems(lists);
        return filledList!;
    }

    async getListsByUserId(userId : string):Promise<ListEntity[]>{
        const lists = await prisma.list.findMany({where: {userId}})
        if (!lists) return [];
        
        const filledList = await this.fillListsWithItems(lists);
        return filledList!;
    }
    async createList(createListDto: CreateListDto):Promise<ListEntity>{
        const newList = await prisma.list.create({data: createListDto})
        return newList;
    }
    async updateList(updateListDto: UpdateListDto):Promise<ListEntity>{
        const updatedList = await prisma.list.update({
            where: {id: updateListDto.id},
            data: updateListDto.updatedValues})
        return updatedList;
    }
    async removeListById(id: string):Promise<void>{
        await prisma.item.deleteMany({where: {listId: id}})
        await prisma.list.delete({where: {id}})
        return
    }

    private async fillListWithItems(list: ListEntity ){
        try {
            list.items = await prisma.item.findMany({where: {listId: list.id}})
            return list
        }
        catch(err: any){
            throw new Error(`Error filling list id: ${list.id} with items from list from postgres: ${err.message}`);
        }
    }

    private async fillListsWithItems(lists: ListEntity[]){
        for (let list of lists){
            list = await this.fillListWithItems(list)
            return lists!
        }
    }
}