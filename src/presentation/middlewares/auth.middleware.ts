import { NextFunction, Request, Response } from "express";
import { JwtGeneretor } from "../../config/plugins";
import { prisma } from "../../data/postgres/init";
import { UserEntity } from '../../domain/entities/user.entity';


export class AuthMiddleware {
    static async validateToken(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({error: 'No token provided.'});
        if (!authorization.startsWith("Bearer ")) return res.status(401).json({error: 'Invalid Bearer token.'});
        
        const token = authorization.split(' ').at(1) || '';
        let payload;
        try {
            payload = await JwtGeneretor.verifyToken<{id: string}>(token);
            if (!payload) throw new Error;
        } catch (err: any) {
            console.error(err.message)
            return res.status(401).json({error: (err.message == 'jwt expired') ? err.message :'Invalid token.'});
        }

        try {
            const user = await prisma.user.findUnique({where : {id: payload.id}});
            if (!user) return res.status(401).json({error: 'Invalid token - user not found.'}); 

            req.body.user = UserEntity.fromJSON(user);
            
            next();
            
        } catch (err: any) {
            console.error('Error on auth middleware:', err);
            return res.status(500).json({error: 'Internal server error'});
        }
    }
}