type DtoItemOptions = {
    description?     : string,
    listId         : string,
    id             : string,
    isActivated?    : boolean,
    createdAt?      : Date,
}

export class UpdateItemDto {
    public id             : string;
    public lastModifiedAt : Date;
    public createdAt?     : Date;
    public description?   : string;
    public isActivated?   : boolean;
    public listId?        : string;

    private constructor(options : DtoItemOptions){
        const {id, description, isActivated, createdAt, listId} = options
        this.id = id;
        this.listId = listId;
        this.description = description;
        this.isActivated = isActivated;
        this.createdAt = createdAt;
        this.lastModifiedAt = new Date();
    }

    public get updatedValues(){
        const retObject : {[key: string]: any} = {};
        //obligatory properties
        retObject.id             = this.id;
        retObject.lastModifiedAt = this.lastModifiedAt;
        //opcianl properties
        if(this.description) retObject.description   = this.description;
        if(this.isActivated) retObject.isActivated   = this.isActivated;
        if(this.createdAt)   retObject.createdAt     = this.createdAt;
        if(this.listId)      retObject.listId        = this.listId;
        
        return retObject;
    }

    static create(props : {[key: string]:any}) : [string|null ,UpdateItemDto|null]{
        const {id, description, isActivated, createdAt, listId} = props;
        //id is an obligatory property
        if(!id) return ['id is required', null];
        //validation of isActivated
        if (isActivated != undefined && typeof isActivated != "boolean"){
            return ['isActivated must be a boolean', null]
        }
        // validacian de crated at y modifed at
        if (createdAt != undefined && !isValidDate(createdAt)){
            return ['createdAt must be a valid date', null]
        }
        //validar que description sea string
        if (typeof description != "string"){
            return ['description must be a string', null]
        }

        const options : DtoItemOptions = {id, description, isActivated, createdAt, listId}
        
        return [null, new UpdateItemDto(options)];
    }
}

function isValidDate(date: any) : boolean{
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
  }