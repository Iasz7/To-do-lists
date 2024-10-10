export class CustomError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = "CustomError";
    }

    static notFound = (message: string) => new CustomError(message, 404);
    static badRequest = (message: string) => new CustomError(message, 400);
    static unauthorized = () => new CustomError("Unauthorized access", 401);
    static forbidden = () => new CustomError("Forbidden access", 403);
    static internalServerError = (message: string) => new CustomError(message, 500);
}