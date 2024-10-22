import { Request, Response } from 'express';
import { CreateItemDto, CustomError, ItemRepository, LoginUserDto, RegisterUserDto, UpdateItemDto } from '../../domain';
import { AuthService } from '../services/auth.service';


export class AuthController {

    constructor(
        public readonly authService: AuthService,
    ){}

    private handleError(res: Response, err : unknown){
        if (err instanceof CustomError){
            res.status(err.statusCode).json(err.message);
            return;
        }
        console.error(err);
        res.status(500).send(err);
    }

    registerUser=(req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({error});
        
        this.authService.registerUser(registerDto!)
            .then((user) => res.status(201).json(user))
            .catch((err: any) => this.handleError(res, err));
    }

    loginUser=(req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({error});
        
        this.authService.loginUser(loginUserDto!)
            .then((user) => res.status(200).json(user))
            .catch((err: any) => this.handleError(res, err));
    }

    validateEmail=(req: Request, res: Response) => {
        const token = req.params.token;
        this.authService.validateEmail(token)
            .then((user) => res.status(204).json(user))
            .catch((err: any) => this.handleError(res, err));
    }

}