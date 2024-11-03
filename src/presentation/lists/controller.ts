import { NextFunction, Request, Response } from 'express';
import { CreateListDto, ItemRepository, ListRepository, UpdateListDto } from '../../domain';
import { ItemService } from '../services/items.service';
import { ListService } from '../services/lists.service';

export class ListsController {
    public listService: ListService;
    constructor(
        listRepository : ListRepository,
    ){
        this.listService = new ListService(listRepository);
    }


    public findListsByName = (req :  Request , res  : Response, next: NextFunction) => {
        const name = req.params.name;
        const userId = req.body.user.id;

        this.listService.findListsByName(name, userId)
            .then(lists => res.status(200).json(lists))
            .catch(next);
    }

    public getListsByUserId = (req :  Request , res  : Response, next: NextFunction) => {
        const userId = req.body.user.id;
        
        this.listService.getListsByUserId(userId)
            .then(lists => res.status(200).json(lists))
            .catch(next);
    }
    
    public getListById = (req :  Request , res  : Response, next: NextFunction) => {
        const listId = req.params.id;
        const userId = req.body.user.id;


        this.listService.getListById(listId, userId)
            .then(list => res.status(200).json(list))
            .catch(next);
    }

    public createList = (req :  Request , res  : Response, next: NextFunction) => {
        const [error, createListDto] = CreateListDto.create(req.body)
        if (error) return res.status(400).json(error);
        
        this.listService.createList(createListDto!)
            .then(list => res.status(201).json(list))
            .catch(next);
    }

    public updateListById = (req :  Request , res  : Response, next: NextFunction) => {
        const [error, updateListDto] = UpdateListDto.create(req.body)
        if (error) return res.status(400).json(error);

        this.listService.updateList(updateListDto!)
            .then(list => res.status(200).json(list))
            .catch(next);
    }

    public removeListById = (req :  Request , res  : Response, next: NextFunction) => {
        const listId = req.params.id;
        const userId = req.body.user.id;
        
        this.listService.removeListById(listId, userId)
            .then(()=> res.status(204).end())
            .catch(next);
    }
}