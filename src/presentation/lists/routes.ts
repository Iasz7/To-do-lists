import { Router } from "express";
import { ListsController } from './controller';
import { ListPostgresDs, ListRepositoryImpl } from "../../infrastructure";


export class ListRoutes {

    static get routes(): Router{
        const router = Router();
        const listDatasource  = new ListPostgresDs();
        const listRepository  = new ListRepositoryImpl(listDatasource)
        const listsController = new ListsController(listRepository)

        router.get('/',       listsController.getListsByUserId);
        router.get('/:id',    listsController.getListById);
        router.post('/',      listsController.createList);
        router.put('/',    listsController.updateListById);
        router.delete('/:id', listsController.removeListById);
        router.get('/find-name/:name', listsController.findListsByName);

        return router;
    }

}