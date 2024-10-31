import { prisma } from '../../data/postgres/init';
import { JwtGeneretor } from '../../config/plugins';
import { Request, Response } from 'express';
import { AuthMiddleware } from './auth.middleware';


describe('auth.middleware.ts unitary tests' , function () {
    // ------------------- unit tests -------------------
    test('validateToken should return status 401 when token is not provided in the Authorization header', async () => {
        const req: Request = {
            header: jest.fn().mockReturnValue(null),
        } as unknown as Request;
        const res: Response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();
    
        await AuthMiddleware.validateToken(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No token provided.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('when token is not a Bearer token validateToken should return status 401  and a clear error msg', async () => {
        const req = {
            header: jest.fn().mockReturnValue('Not-Bearer-token'),
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();
        
        await AuthMiddleware.validateToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Invalid Bearer token.'});
        expect(next).not.toHaveBeenCalled();
    });

    test('when token is not a valid token validateToken should return status 401 and a clear error msg', async () => {
        const req = {
            header: jest.fn().mockReturnValue('Bearer not-valid-token'),
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();
        
        await AuthMiddleware.validateToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Invalid token.'});
        expect(next).not.toHaveBeenCalled();
    });

    test('when token does not contain a valid user validateToken should return status 401 and a clear error msg', async () => {
        const testUser = {
            id: 'not a valid user id',
            name: 'User 1',
            email: 'test1@gmail.com',
            emailValidated: true
        },
            req = {header: jest.fn().mockReturnValue(`Bearer ${await JwtGeneretor.generateToken(testUser)}`)} as unknown as Request,
            res = {status: jest.fn().mockReturnThis(), json: jest.fn()} as unknown as Response,
            next = jest.fn();
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
        
        await AuthMiddleware.validateToken(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Invalid token - user not found.'});
        expect(next).not.toHaveBeenCalled();
    });

    test('with valid token and user id validateToken should call next() and write user data on body', async () => {
        const testUser = {
            id: 'valid user id',
            name: 'User 1',
            email: 'test1@gmail.com',
            password: '123456',
            emailValidated: true
        };
        jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(testUser);
        const req = {
            header: jest.fn().mockReturnValue(`Bearer ${await JwtGeneretor.generateToken(testUser)}`),
            body: {},
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();
        
        await AuthMiddleware.validateToken(req, res, next);
        
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(req.body.user).toEqual(testUser);
        expect(next).toHaveBeenCalled();
    });

    test('validateToken should return status 401 when token is expired', async () => {
        const expiredToken = 'Bearer expired-token';
        jest.spyOn(JwtGeneretor, 'verifyToken').mockRejectedValue(new Error('jwt expired'));
        const req = {
            header: jest.fn().mockReturnValue(expiredToken),
            body: {},
        } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        const next = jest.fn();
    
        await AuthMiddleware.validateToken(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'jwt expired'});
        expect(next).not.toHaveBeenCalled();
    });
});