import { getUUID } from "../../../config/plugins";

export type CreateListOptions = {
    name            : string,
    userId          : string,
    id?             : string,
    createdAt?      : Date,
    lastModifiedAt? : Date,
}

export class CreateListDto {
    static maxLength: number = 35;
    
    public id            : string;
    public name          : string;
    public userId        : string;
    public createdAt     : Date;
    public lastModifiedAt: Date;

    private constructor(options : CreateListOptions){
        const {id, name, userId, lastModifiedAt, createdAt} = options
        this.id = id ?? getUUID();
        this.name = name;
        this.userId = userId;
        this.createdAt = createdAt?? new Date();
        this.lastModifiedAt = lastModifiedAt?? new Date();
    }

    static create(props : {[key: string]:any}) : [string|null ,CreateListDto|null]{
        const {id, name, createdAt, lastModifiedAt, user} = props;
        //name validations
        if(!name) return ['name is required', null];
        if (typeof name != "string"){
            return ['name must be a string', null]
        }
        if (name.length > this.maxLength){
            return [`name cannot be have more than ${this.maxLength} characters`, null];
        }
        //id validations, the parameter is not required
        if(id && typeof id != "string"){
            return ['id must be a string', null]
        }
        //user.id validations
        if(!user?.id || user.id.length === 0){ 
            return ['user.id is required', null];
        }
        // validacian de crated at y modifed at
        if (createdAt != undefined && !isValidDate(createdAt)){
            return ['createdAt must be a valid date', null]
        }
        if (lastModifiedAt != undefined && !isValidDate(lastModifiedAt)){
            return ['lastModifiedAt must be a valid date', null]
        }

        const options : CreateListOptions = {id, name, createdAt, lastModifiedAt, userId: user.id}
        
        return [null, new CreateListDto(options)];
    }
}

function isValidDate(date: any) : boolean{
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}