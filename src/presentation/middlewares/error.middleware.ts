import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../domain';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof CustomError){
        if (err.statusCode === 500) console.error(err.message);
        return res.status(err.statusCode).json(err.message);
    }
    
    console.error(err);
    res.status(500).send(err);
};