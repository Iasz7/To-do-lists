import { Router } from "express";
import { ItemsController } from './controller';
import { ItemPostgresDs, ListPostgresDs, ListRepositoryImpl, ItemRepositoryImpl } from "../../infrastructure";


export class ItemRoutes {

    static get routes(): Router{
        const router = Router();
        
        const itemDS         = new ItemPostgresDs();
        const itemRepository = new ItemRepositoryImpl(itemDS)
        const listDS         = new ListPostgresDs();
        const listRepository = new ListRepositoryImpl(listDS)
        const itemsController= new ItemsController(listRepository, itemRepository)

        router.get   ('/:id', itemsController.getItemById);
        router.post  ('/',    itemsController.createItem);
        router.put   ('/',    itemsController.updateItem);
        router.delete('/:id', itemsController.deleteItem);

        return router;
    }

}