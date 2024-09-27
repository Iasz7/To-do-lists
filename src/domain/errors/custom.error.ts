export class customError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = "CustomError";
    }
}