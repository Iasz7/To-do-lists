export class Item {
    public createdAt: Date;
    public lastModifiedAt : Date;
    constructor(
        public id: number,
        public description: string,
        public isActivated: boolean,
    ){
        this.createdAt = new Date();
        this.lastModifiedAt =new Date();
    }
    public updateLastModifiedDate(): void {
        this.lastModifiedAt = new Date();
    }
}
