import { getUUID } from "../../config/plugins";

export type ItemOptions = {
    description     : string,
    id?             : string,
    isActivated?    : boolean,
    createdAt?      : Date,
    lastModifiedAt? : Date,
    listId?         : string
}

export class ItemEntity {
    public createdAt      : Date;
    public lastModifiedAt : Date;
    public id             : string;
    public description    : string;
    public isActivated    : boolean;
    public listId?         : string

    constructor(itemOptions : ItemOptions){
        const {id, description, isActivated, createdAt, lastModifiedAt, listId} = itemOptions
        this.id = id ?? getUUID();
        this.description = description;
        this.isActivated = isActivated ?? true;
        this.createdAt = createdAt ?? new Date();
        this.lastModifiedAt = lastModifiedAt ?? new Date();
        this.listId = listId;
    }
}
