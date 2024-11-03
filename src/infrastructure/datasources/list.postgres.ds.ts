import { prisma } from "../../data/postgres/init";
import { CreateListDto, CustomError, ListDatasource, ListEntity, UpdateListDto } from "../../domain";

export class ListPostgresDs implements ListDatasource{
    async getListById(id: string):Promise<ListEntity>{
        try {
            const list = await prisma.list.findUnique({where: {id}})
            if (!list) throw new CustomError(`List with id: ${id} not found`, 404)
            return this.fillListWithItems(list)
        }
        catch(err: any){
            const errorMessage = `Error fetching list id: ${id} from postgres: ${err.message}`
            throw new CustomError( errorMessage, (err.statusCode || 500));
        }
    }
    async findListsByName(name: string, userId : string):Promise<ListEntity[]>{
        try {
            const lists = await prisma.list.findMany({where: {name, userId}})
            if (!lists) return []
            const filledList = await this.fillListsWithItems(lists);
            return filledList!;
        }
        catch(err: any){
            const errorMessage = `Error fetching lists with name: ${name} from postgres: ${err.message}`
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
    async getListsByUserId(userId : string):Promise<ListEntity[]>{
        try {
            const lists = await prisma.list.findMany({where: {userId}})
            if (!lists) throw new CustomError(`Lists with user id: ${userId} not found`, 404)
            const filledList = await this.fillListsWithItems(lists);
            return filledList!;
        }
        catch(err: any){
            const errorMessage = `Error fetching lists from user: ${userId} from postgres: ${err.message}`
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
    async createList(createListDto: CreateListDto):Promise<ListEntity>{
        try{ 
            //validate that list id doesn't exists before creating it
            const id = createListDto.id;
            const list = await prisma.list.findUnique({where: {id}})
            if (list) throw new CustomError(`List with id: ${id} already exists`, 404)

            const newList = await prisma.list.create({data: createListDto})
            console.log("New list created");
            return newList;
        }
        catch (err:any) {
            const errorMessage = 'Error creating list in postgres: ' + err.message
            throw new CustomError(errorMessage, (err.statusCode || 500));
        }
    }
    async updateList(updateListDto: UpdateListDto):Promise<ListEntity>{
        const id = updateListDto.id
        try{ 
            const updatedList = await prisma.list.update({
                where: {id},
                data: updateListDto.updatedValues})
            return updatedList;
        }
        catch (err:any) {
            throw new CustomError(`Error updating list with id ${id} in postgres: ${err.message}`, 500);
        }
    }
    async removeListById(id: string):Promise<void>{
        try {
            await prisma.item.deleteMany({where: {listId: id}})
            await prisma.list.delete({where: {id}})
            return
        }
        catch(err: any){
            throw new CustomError(`Error removing list with id: ${id} from postgres: ${err.message}`, 500);
        }
    }

    private async fillListWithItems(list: ListEntity ){
        try {
            list.items = await prisma.item.findMany({where: {listId: list.id}})
            return list
        }
        catch(err: any){
            throw new CustomError(`Error filling list id: ${list.id} with items from list from postgres: ${err.message}`, 500);
        }
    }

    private async fillListsWithItems(lists: ListEntity[]){
        for (let list of lists){
            list = await this.fillListWithItems(list)
            return lists!
        }
    }
}