import { ListEntity, ListOptions } from "../entities/list.entity"


export default abstract class ListDatasource{
    
    abstract getListById: (id: string) => Promise<ListEntity>;

    abstract findListsByName: (name: string) => Promise<ListEntity[]>;

    abstract getAllLists: () => Promise<ListEntity[]>

    abstract createList: (listOptions: ListOptions) => Promise<ListEntity>

    abstract updateList: (updatedListOptions: ListOptions) => Promise<ListEntity>

    abstract removeListById: (id: string) => Promise<void>
}