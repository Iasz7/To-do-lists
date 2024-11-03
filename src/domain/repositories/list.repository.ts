import { ListEntity, UpdateListDto, CreateListDto} from "../"


export abstract class ListRepository{
    
        abstract getListById:     (id: string)     => Promise<ListEntity>;
    
        abstract getListsByUserId:(userId: string) => Promise<ListEntity[]>
        
        abstract removeListById:  (listId: string) => Promise<void>
        
        abstract findListsByName: (name: string, userId: string)=> Promise<ListEntity[]>;
        
        abstract createList:      (createListDto: CreateListDto)=> Promise<ListEntity>
        
        abstract updateListById:  (updateListDto: UpdateListDto)=> Promise<ListEntity>
    }