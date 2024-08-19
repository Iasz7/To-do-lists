import { List, ListOptions } from "../entities/list.entity"


export default abstract class listDatasource{
    
    abstract getListById: (id: string) => Promise<List>;

    abstract findListsByName: (name: string) => Promise<List[] | undefined>;

    abstract getAllLists: () => Promise<List[]>

    abstract createList: (listOptions: ListOptions) => Promise<List>

    abstract updateListById: (updatedListOptions: ListOptions) => Promise<List>

    abstract removeListById: (id: string) => Promise<void>
}