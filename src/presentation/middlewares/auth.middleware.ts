import { NextFunction, Request, Response } from "express";
import { JwtGeneretor } from "../../config/plugins";
import { prisma } from "../../data/postgres/init";
import { UserEntity } from '../../domain/entities/user.entity';


export class AuthMiddleware {
    static async validateToken(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({error :'No token provided.'});
        if (!authorization.startsWith("Bearer ")) return res.status(403).json({error :'Invalid Bearer token.'});
        
        const token = authorization.split(' ').at(1) || '';
        try {
            const payload = await JwtGeneretor.verifyToken<{id: string}>(token);
            if (!payload) return res.status(401).json({error :'Invalid token.'});

            const user = await prisma.user.findUnique({where : {id: payload.id}});
            if (!user) return res.status(401).json({error :'Invalid token - user not found.'}); 

            req.body.user = UserEntity.fromJSON(user);
            
            next();
            
        } catch (err: any) {
            console.error('Error verifying token:', err);
            return res.status(500).json({error :err.message});
        }
        next();
    }
}