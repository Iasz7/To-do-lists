import { Router } from "express";
import { ItemRepositoryImpl } from '../../infrastructure/repositories/item.respository.impl';
import { ItemPostgresDs } from "../../infrastructure/datasources/item.postgres.ds";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";


export class AuthRoutes {

    static get routes(): Router{
        const router = Router();
        
        const emailService = new EmailService()
        const authService    = new AuthService(emailService)
        const authController = new AuthController(authService)

        router.post('/login', authController.loginUser)
        router.post('/register', authController.registerUser)
        router.get ('/validate-email/:token', authController.validateEmail)


        return router;
    }

}