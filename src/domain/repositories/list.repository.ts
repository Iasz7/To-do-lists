import { ListEntity, ListOptions } from "../entities/list.entity"


export abstract class ListRepository{
    
        abstract getListById: (id: string, userId: string) => Promise<ListEntity>;
    
        abstract findListsByName: (name: string, userId: string) => Promise<ListEntity[]>;
    
        abstract getListsByUserId: (userId: string) => Promise<ListEntity[]>
    
        abstract createList: (listOptions: ListOptions) => Promise<ListEntity>
    
        abstract updateListById: (updatedListOptions: ListOptions) => Promise<ListEntity>
    
        abstract removeListById: (listId: string, userId: string) => Promise<void>
    }