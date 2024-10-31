import { CreateListDto, UpdateListDto, ListEntity } from "../";


export abstract class ListDatasource{
    
    abstract getListById:     (id: string, userId: string)   => Promise<ListEntity>;

    abstract findListsByName: (name: string, userId: string) => Promise<ListEntity[]>;

    abstract getListsByUserId:(userId: string)               => Promise<ListEntity[]>

    abstract createList:      (createListDto: CreateListDto) => Promise<ListEntity>

    abstract updateList:      (updateListDto: UpdateListDto) => Promise<ListEntity>

    abstract removeListById:  (id: string, userId: string)   => Promise<void>
}