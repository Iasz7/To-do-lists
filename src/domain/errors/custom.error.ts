export class CustomError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = "CustomError";
    }

    static notFound      = (message: string)                        => new CustomError(message, 404);
    static badRequest    = (message: string)                        => new CustomError(message, 400);
    static unauthorized  = (message: string = 'Unauthorized acces') => new CustomError(message, 401);
    static forbidden     = (message: string = 'Forbidden access')   => new CustomError(message, 403);
    static internalServerError=(message: string='Internal server error' )=> new CustomError(message, 500);
}