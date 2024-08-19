import { getUUID } from "../../config/plugins";

export type ItemOptions = {
    description : string,
    isActivated : boolean,
    id?         : string,
    createdAt?   : Date,
    lastModifiedAt? : Date,
}

export class Item {
    public createdAt: Date;
    public lastModifiedAt : Date;
    public id: string;
    public description: string;
    public isActivated: boolean;

    constructor(itemOptions : ItemOptions){
        const {id, description, isActivated, createdAt, lastModifiedAt} = itemOptions
        this.id = id ?? getUUID();
        this.description = description;
        this.isActivated = isActivated;
        this.createdAt = createdAt ?? new Date();
        this.lastModifiedAt = lastModifiedAt ?? new Date();
    }
    public updateLastModifiedDate(): void {
        this.lastModifiedAt = new Date();
    }
}
