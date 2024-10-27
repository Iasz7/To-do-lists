import { prisma } from "../../data/postgres/init";
import { CustomError, ListDatasource, ListEntity, ListOptions } from "../../domain";


export class ListPostgresDs implements ListDatasource{
    async getListById(id: string,  userId: string):Promise<ListEntity>{
        try {
            const list = await prisma.list.findUnique({where: {id}})
            if (!list) throw new CustomError(`List with id: ${id} not found`, 404)
            if (list.userId !== userId) throw CustomError.forbidden(`User: ${userId} unauthorized to access list: ${id}`)
            return list
        }
        catch(err: any){
            const messageError = `Error fetching list with id: ${id} from postgres: ${err.message}`
            // console.error(messageError);
            throw new CustomError(messageError, (err instanceof CustomError) ? err.statusCode: 500);
        }
    }
    async findListsByName(name: string, userId : string):Promise<ListEntity[]>{
        try {
            const lists = await prisma.list.findMany({where: {name, userId}})
            if (!lists) throw new CustomError(`Lists with name: ${name} not found`, 404)
            return lists
        }
        catch(err: any){
            const messageError = `Error fetching lists with name: ${name} from postgres: ${err.message}`
            // console.error(messageError);
            throw new CustomError(messageError, (err instanceof CustomError) ? err.statusCode: 500);
        }
    }
    async getListsByUserId(userId : string):Promise<ListEntity[]>{
        try {
            const lists = await prisma.list.findMany({where: {userId}})
            if (!lists) throw new CustomError(`Lists with user id: ${userId} not found`, 404)
            return lists
        }
        catch(err: any){
            const messageError = `Error fetching lists with user id: ${userId} from postgres: ${err.message}`
            // console.error(messageError);
            throw new CustomError(messageError, (err instanceof CustomError) ? err.statusCode: 500);
        }
    }
    async createList(listOptions: ListOptions):Promise<ListEntity>{
            throw new Error("createList not implemented");
    }
    async updateList(updatedListOptions: ListOptions):Promise<ListEntity>{
        throw new Error("updateList not implemented");
    }
    async removeListById(id: string, userId: string):Promise<void>{
        try {
            const list = await prisma.list.findUnique({where: {id}})
            if (!list) throw new CustomError(`List with id: ${id} not found`, 404)
            if (list.userId!== userId) throw CustomError.forbidden(`User: ${userId} unauthorized to delete list: ${id}`)
            
            await prisma.item.deleteMany({where: {listId: id}})
            await prisma.list.delete({where: {id}})
            return
        }
        catch(err: any){
            const messageError = `Error fetching list with id: ${id} from postgres: ${err.message}`
            // console.error(messageError);
            throw new CustomError(messageError, (err instanceof CustomError) ? err.statusCode: 500);
        }
    }
}