import { ListEntity, ListOptions } from "../entities/list.entity"


export abstract class ListDatasource{
    
    abstract getListById: (id: string) => Promise<ListEntity>;

    abstract findListsByName: (name: string, userId: string) => Promise<ListEntity[]>;

    abstract getListsByUserId: (userId: string) => Promise<ListEntity[]>

    abstract createList: (listOptions: ListOptions) => Promise<ListEntity>

    abstract updateList: (updatedListOptions: ListOptions) => Promise<ListEntity>

    abstract removeListById: (id: string) => Promise<void>
}