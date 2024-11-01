import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../domain';

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {

    if (error instanceof CustomError){
        if (error.statusCode === 500) console.error(error.message);
        return res.status(error.statusCode).json(error.message);
    }
    console.error(error);
    res.status(500).json(error.message);
};