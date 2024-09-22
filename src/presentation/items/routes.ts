import { Router } from "express";
import { ItemsController } from './controller';
import { ItemRepositoryImpl } from '../../infrastructure/repositories/item.respository.impl';
import { ItemRepository } from '../../domain/repositories/item.repository';
import { ItemDatasource } from '../../domain/datasources/item.datasource';
import { ItemPostgresDs } from "../../infrastructure/datasources/item.postgres.ds";


export class ItemRoutes {

    static get routes(): Router{
        const router = Router();
        
        const itemDatasource    = new ItemPostgresDs();
        const itemRepository    = new ItemRepositoryImpl(itemDatasource)
        const itemsController   = new ItemsController(itemRepository)

        // router.get('/', itemsController.getAllTodos);
        router.get('/:id', itemsController.getItemById);
        router.post('/', itemsController.createItem);
        router.put('/', itemsController.updateItem);
        router.delete('/:id', itemsController.deleteItem);

        return router;
    }

}