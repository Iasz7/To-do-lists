import { NextFunction, Request, Response } from 'express';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';


export class AuthController {

    constructor(
        public readonly authService: AuthService,
    ){}

    registerUser = (req: Request, res: Response, next: NextFunction) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json(error);
        
        this.authService.registerUser(registerDto!)
            .then((user) => res.status(201).json(user))
            .catch(next);
    }

    loginUser = (req: Request, res: Response, next: NextFunction) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json(error);
        
        this.authService.loginUser(loginUserDto!)
            .then((user) => res.status(200).json(user))
            .catch(next);
    }

    validateEmail = (req: Request, res: Response, next: NextFunction) => {
        const token = req.params.token;
        this.authService.validateEmail(token)
            .then((user) => res.status(204).json(user))
            .catch(next);
    }

}