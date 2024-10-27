import { getUUID } from "../../config/plugins";
import {ItemEntity} from "./item.entity";

export type ListOptions = {
    name            : string,
    userId          : string,
    id?             : string,
    items?          : ItemEntity[],
    createdAt?      : Date,
    lastModifiedAt? : Date,
}

export class ListEntity {
    public id: string;
    public name: string;
    public createdAt : Date;
    public lastModifiedAt : Date;
    public userId: string;
    public items?: ItemEntity[];

    constructor( listOptions: ListOptions){
        const {id, name, createdAt, lastModifiedAt, items, userId} = listOptions; 
        this.id = id ?? getUUID();
        this.userId = userId;
        this.name = name;
        this.createdAt = createdAt ?? new Date();
        this.lastModifiedAt = lastModifiedAt ?? new Date();
        this.items = items ?? [];
    }

    // public get lastModifiedItem(): Date {
    //     // si no hay items devuelve directo el atributo de la misma clase
    //     if (this.items.length === 0) { return this.lastModifiedAt }
        
    //     // si hay items analiza cual es el ultimo item modificado
    //     const latestItem = this.items.reduce((latest, item) => {
    //         return (latest.lastModifiedAt > item.lastModifiedAt) ? latest : item;
    //     }, this.items[0]);
        
    //     //compara el ultimo item modificado y la fecha de la clase y devuleve la ultima fecha
    //     if (latestItem.lastModifiedAt > this.lastModifiedAt){
    //         return latestItem.lastModifiedAt;
    //     } else {
    //         return this.lastModifiedAt;
    //     }
    // }
}