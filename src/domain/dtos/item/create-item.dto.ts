import { getUUID } from "../../../config/plugins";

export type DtoItemOptions = {
    description     : string,
    listId         : string,
    id?             : string,
    isActivated?    : boolean,
    createdAt?      : Date,
    lastModifiedAt? : Date,
}

export class CreateItemDto {
    public createdAt      : Date;
    public lastModifiedAt : Date;
    public id             : string;
    public description    : string;
    public isActivated    : boolean;
    public listId         : string;

    private constructor(options : DtoItemOptions){
        const {id, description, isActivated, createdAt, lastModifiedAt, listId} = options
        this.id = id ?? getUUID();
        this.listId = listId;
        this.description = description;
        this.isActivated = isActivated ?? true;
        this.createdAt = createdAt ?? new Date();
        this.lastModifiedAt = lastModifiedAt ?? new Date();
    }

    static create(props : {[key: string]:any}) : [string|null ,CreateItemDto|null]{
        const {id, description, isActivated, createdAt, lastModifiedAt, listId} = props;
        //description and list id are obligatory properties
        if(!description || description.length === 0){
            return ['description is required', null];
        }
        if(!listId || listId.length === 0){ 
            return ['listId is required', null];
        }
        //validation of isActivated
        if (isActivated != undefined && typeof isActivated != "boolean"){
            return ['isActivated must be a boolean', null]
        }
        // validacian de crated at y modifed at
        if (createdAt != undefined && !isValidDate(createdAt)){
            return ['createdAt must be a valid date', null]
        }
        if (lastModifiedAt != undefined && !isValidDate(lastModifiedAt)){
            return ['lastModifiedAt must be a valid date', null]
        }
        //validar que description sea string
        if (typeof description != "string"){
            return ['description must be a string', null]
        }


        const options : DtoItemOptions = {id, description, isActivated, createdAt, lastModifiedAt, listId}
        
        return [null, new CreateItemDto(options)];
    }
}

function isValidDate(date: any) : boolean{
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
  }