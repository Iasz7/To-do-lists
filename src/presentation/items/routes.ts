import { Router } from "express";
import { ItemsController } from './controller';
import { ItemRepositoryImpl } from '../../infrastructure/repositories/item.respository.impl';
import { ItemPostgresDs } from "../../infrastructure/datasources/item.postgres.ds";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class ItemRoutes {

    static get routes(): Router{
        const router = Router();
        
        const itemDatasource    = new ItemPostgresDs();
        const itemRepository    = new ItemRepositoryImpl(itemDatasource)
        const itemsController   = new ItemsController(itemRepository)

        // router.get('/', itemsController.getAllTodos);
        //getItemsByList ?????
        router.get   ('/:id', AuthMiddleware.validateToken, itemsController.getItemById);
        router.post  ('/',    AuthMiddleware.validateToken, itemsController.createItem);
        router.put   ('/',    AuthMiddleware.validateToken, itemsController.updateItem);
        router.delete('/:id', AuthMiddleware.validateToken, itemsController.deleteItem);

        return router;
    }

}