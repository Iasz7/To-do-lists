import { CreateListDto, CustomError, ListEntity, ListRepository, UpdateListDto } from "../../domain";

export class ListService{
    
    constructor(
        private readonly listRepository : ListRepository
    ){}
    
    private validateAccess(listUserId : string, userIdToValidate : string) {
        if (listUserId !== userIdToValidate) throw CustomError.forbidden(`User: ${userIdToValidate} unauthorized to access list: ${listUserId}`)
    }
    
    async getListById(id: string,  userId: string):Promise<ListEntity>{
        try {
            const list = await this.listRepository.getListById(id);
            this.validateAccess(list.userId, userId);
            return list;
        }
        catch(err: any){
            throw new CustomError(err.message, (err.statusCode || 500));
        }
    }
    async findListsByName(name: string, userId : string):Promise<ListEntity[]>{
        try {
            return await this.listRepository.findListsByName(name, userId);
        }
        catch(err: any){
            throw new CustomError(`Error fetching lists with name: ${name}: ${err.message}`, (err.statusCode || 500));
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
            //validation that list id doesn't exists before creation is done on DS
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
            const list = await this.listRepository.getListById(id);
            this.validateAccess(list.userId, updateListDto.userId);

            const updatedList = this.listRepository.updateListById(updateListDto);
            console.log(`List with ${id} updated`);
            return updatedList;
        }
        catch (err:any) {
            throw new CustomError(`Error updating list with id ${id}: ${err.message}`, (err.statusCode || 500));
        }
    }
    async removeListById(id: string, userId: string):Promise<void>{
        try {
            const list = await this.listRepository.getListById(id);
            this.validateAccess(list.userId, userId);

            await this.listRepository.removeListById(id);
            return
        }
        catch(err: any){
            throw new CustomError(`Error removing list with id: ${id}: ${err.message}`, (err.statusCode || 500));
        }
    }
}