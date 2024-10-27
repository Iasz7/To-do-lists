import { ListDatasource, ListEntity, ListOptions, ListRepository } from "../../domain";


export class ListRepositoryImpl implements ListRepository {

    constructor(private readonly listDatasource: ListDatasource){}

    getListById(id: string):Promise<ListEntity>{
        return this.listDatasource.getListById(id);
    }
    findListsByName(name: string, userId: string):Promise<ListEntity[]>{
        return this.listDatasource.findListsByName(name, userId);
    }
    getListsByUserId(userId: string) : Promise<ListEntity[]>{
        return this.listDatasource.getListsByUserId(userId);
    }
    createList(listOptions: ListOptions): Promise<ListEntity>{
        return this.listDatasource.createList(listOptions);
    }
    updateListById(updatedListOptions: ListOptions) : Promise<ListEntity>{
        return this.listDatasource.updateList(updatedListOptions);
    }
    removeListById(id: string):Promise<void>{
        return this.listDatasource.removeListById(id);
    }

}