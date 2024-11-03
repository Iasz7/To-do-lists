import { ListDatasource, ListEntity, CreateListDto, ListRepository, UpdateListDto } from "../../domain";


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
    createList(createListDto: CreateListDto): Promise<ListEntity>{
        return this.listDatasource.createList(createListDto);
    }
    updateListById(updateListDto: UpdateListDto) : Promise<ListEntity>{
        return this.listDatasource.updateList(updateListDto);
    }
    removeListById(id: string):Promise<void>{
        return this.listDatasource.removeListById(id);
    }

}