type DtoListOptions = {
    name?       : string,
    id          : string,
    userId      : string, // not for updating on DB, just for authorization
    createdAt?  : Date,
}

export class UpdateListDto {
    public id             : string;
    public lastModifiedAt : Date;
    public userId         : string;
    public createdAt?     : Date;
    public name?          : string;

    private constructor(options : DtoListOptions){
        const {id, name, userId ,createdAt} = options
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.userId = userId;
        this.lastModifiedAt = new Date();
    }

    public get updatedValues(){
        const retObject : {[key: string]: any} = {};
        //obligatory properties
        retObject.id             = this.id;
        retObject.lastModifiedAt = this.lastModifiedAt;
        //opcianl properties
        if(this.name) retObject.name   = this.name;
        if(this.createdAt)   retObject.createdAt     = this.createdAt;
        
        return retObject;
    }

    static create(props : {[key: string]:any}) : [string|null ,UpdateListDto|null]{
        const {id, name, createdAt, user} = props;
        //id is an obligatory property
        if(!id) return ['id is required', null];
        // validacian de crated at y modifed at
        if (createdAt != undefined && !isValidDate(createdAt)){
            return ['createdAt must be a valid date', null]
        }
        //validar que name sea string o este vacia
        if (typeof name != "string"){
            return ['name must be a string', null]
        }
        if (name.length === 0){
            return ['name cannot be empty', null];
        }
        //validar que mandaron userId como userId o como user.id
        
        if(!user.id || user.id.length === 0){ 
            return ['user.id is required', null];
        }

        const options : DtoListOptions = {id, name, createdAt, userId: user.id}
        
        return [null, new UpdateListDto(options)];
    }
}

function isValidDate(date: any) : boolean{
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
  }