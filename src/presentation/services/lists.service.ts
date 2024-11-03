import { CreateListDto, CustomError, ListEntity, ListRepository, UpdateListDto } from "../../domain";

export class ListService{
    
    constructor( private readonly listRepository : ListRepository ){}
    
    private validateAccess(listUserId : string, userIdToValidate : string) {
        if (listUserId !== userIdToValidate) throw CustomError.forbidden(`User: ${userIdToValidate} unauthorized to access list: ${listUserId}`)
    }

    private async _checkListExistsAndUserAuth(listId: string,  userId: string):Promise<ListEntity>{
            const list = await this.listRepository.getListById(listId);
            if (!list) throw new CustomError(`List with id: ${listId} not found`, 404);
            this.validateAccess(list.userId, userId);
            return list;
    }
    
    async getListById(id: string,  userId: string):Promise<ListEntity>{
        try {
            return await this._checkListExistsAndUserAuth(id, userId);
        }
        catch(err: any){
            throw new CustomError(`Error fetching list with id ${id}: ${err.message}`, (err.statusCode || 500));
        }
    }
    async findListsByName(name: string, userId : string):Promise<ListEntity[]>{
        try {
            return await this.listRepository.findListsByName(name, userId);
        }
        catch(err: any){
            throw new CustomError(`Error fetching lists with name ${name} from user ${userId}: ${err.message}`, (err.statusCode || 500));
        }
    }
    async getListsByUserId(userId : string):Promise<ListEntity[]>{
        try {
            return await this.listRepository.getListsByUserId(userId);
        }
        catch(err: any){
            throw new CustomError(`Error fetching lists from user: ${userId}: ${err.message}`, (err.statusCode || 500));
        }
    }
    async createList(createListDto: CreateListDto):Promise<ListEntity>{
        try{ 
            const list = await this.listRepository.getListById(createListDto.id);
            if (list) throw new CustomError(`List with id: ${createListDto.id} already exists`, 404)

            const newList = await this.listRepository.createList(createListDto);
            console.log("New list created");
            return newList;
        }
        catch (err:any) {
            throw new CustomError('Error creating list: ' + err.message, (err.statusCode || 500));
        }
    }
    async updateList(updateListDto: UpdateListDto):Promise<ListEntity>{
        const id = updateListDto.id
        try{ 
            await this._checkListExistsAndUserAuth(updateListDto.id, updateListDto.userId);
            const updatedList = await this.listRepository.updateListById(updateListDto);
            console.log(`List with ${id} updated`);
            return updatedList;
        }
        catch (err:any) {
            throw new CustomError(`Error updating list with id ${id}: ${err.message}`, (err.statusCode || 500));
        }
    }
    async removeListById(id: string, userId: string):Promise<void>{
        try {
            await this._checkListExistsAndUserAuth(id, userId);
            await this.listRepository.removeListById(id);
            return
        }
        catch(err: any){
            throw new CustomError(`Error removing list with id: ${id}: ${err.message}`, (err.statusCode || 500));
        }
    }
}