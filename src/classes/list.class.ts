import {Item} from "./item";

class List {
    constructor(
        public id: number,
        public name: string,
        public createdAt : Date = new Date(),
        public lastModifiedAt : Date= new Date(),
        public items: Item[] = [],
    ){}

    public updateLastModifiedDate(): void {
        this.lastModifiedAt = new Date();
    }

    public get lastModifiedItem(): Date {
        // si no hay items devuelve directo el atributo de la misma clase
        if (this.items.length = 0) { return this.lastModifiedAt }
        
        // si hay items analiza cual es el ultimo item modificado
        const latestItem = this.items.reduce((latest, item) => {
            return (latest.lastModifiedAt > item.lastModifiedAt) ? latest : item;
        }, this.items[0]);
        
        //compara el ultimo item modificado y la fecha de la clase y devuleve la ultima fecha
        if (latestItem.lastModifiedAt > this.lastModifiedAt){
            return latestItem.lastModifiedAt;
        } else {
            return this.lastModifiedAt;
        }
    }
}

