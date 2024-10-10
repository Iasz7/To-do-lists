import { Router } from "express";
import { ItemRoutes } from "./items/routes";
import { ListRoutes } from "./lists/routes";
import { AuthRoutes } from "./auth/routs";


export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        
        router.use('/api/items', ItemRoutes.routes)
        router.use('/api/lists', ListRoutes.routes)
        router.use('/api/auth', AuthRoutes.routes) 
        
        return router;
    }

}