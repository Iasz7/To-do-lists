import { Router } from "express";
import { ItemRoutes } from "./items/routes";
import { ListRoutes } from "./lists/routes";


export class AppRoutes {

    static get routes(): Router {
        const router = Router();
        
        router.use('/api/items', ItemRoutes.routes)
        router.use('/api/lists', ListRoutes.routes)
        
        return router;
    }

}