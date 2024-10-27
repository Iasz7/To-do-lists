import { Router } from "express";
import { ItemRoutes } from "./items/routes";
import { ListRoutes } from "./lists/routes";
import { AuthRoutes } from "./auth/routs";
import { AuthMiddleware } from "./middlewares/auth.middleware";


export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        
        router.use('/api/items', AuthMiddleware.validateToken, ItemRoutes.routes)
        router.use('/api/lists', AuthMiddleware.validateToken, ListRoutes.routes)
        router.use('/api/auth', AuthRoutes.routes) 
        
        return router;
    }

}