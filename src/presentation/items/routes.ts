import { Router } from "express";
import { ItemsController } from './controller';
import { ItemRepositoryImpl } from '../../infrastructure/repositories/item.respository.impl';
import { ItemPostgresDs } from "../../infrastructure/datasources/item.postgres.ds";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class ItemRoutes {

    static get routes(): Router{
        const router = Router();
        
        const itemDatasource  = new ItemPostgresDs();
        const itemRepository  = new ItemRepositoryImpl(itemDatasource)
        const itemsController = new ItemsController(itemRepository)

        // router.get('/', itemsController.getAllTodos);
        //getItemsByList ?????
        router.get   ('/:id', itemsController.getItemById);
        router.post  ('/',    itemsController.createItem);
        router.put   ('/',    itemsController.updateItem);
        router.delete('/:id', itemsController.deleteItem);

        return router;
    }

}