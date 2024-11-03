import { CreateListDto, UpdateListDto, ListEntity } from "../";


export abstract class ListDatasource{
    
    abstract getListById:     (id: string)     => Promise<ListEntity | null>;

    abstract getListsByUserId:(userId: string) => Promise<ListEntity[]>
    
    abstract removeListById:  (id: string)     => Promise<void>
    
    abstract createList:      (createListDto: CreateListDto) => Promise<ListEntity>
    
    abstract updateList:      (updateListDto: UpdateListDto) => Promise<ListEntity>
    
    abstract findListsByName: (name: string, userId: string) => Promise<ListEntity[]>;
}