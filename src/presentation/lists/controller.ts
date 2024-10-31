import { NextFunction, Request, Response } from 'express';
import { CreateListDto, CustomError, ListRepository, UpdateListDto } from '../../domain';

export class ListsController {
    constructor(private readonly listRepository : ListRepository){}

    public findListsByName = (req :  Request , res  : Response, next: NextFunction) => {
        const name = req.params.name;
        const userId = req.body.user.id;

        this.listRepository.findListsByName(name, userId)
            .then(lists => res.status(200).json(lists))
            .catch(next);
    }

    public getListsByUserId = (req :  Request , res  : Response, next: NextFunction) => {
        const userId = req.body.user.id;
        
        this.listRepository.getListsByUserId(userId)
            .then(lists => res.status(200).json(lists))
            .catch(next);
    }
    
    public getListById = (req :  Request , res  : Response, next: NextFunction) => {
        const listId = req.params.id;
        const userId = req.body.user.id;


        this.listRepository.getListById(listId, userId)
            .then(list => res.status(200).json(list))
            .catch(next);
    }

    public createList = (req :  Request , res  : Response, next: NextFunction) => {
        const [error, createListDto] = CreateListDto.create(req.body)
        if (error) return res.status(400).json(error);
        
        this.listRepository.createList(createListDto!)
            .then(list => res.status(201).json(list))
            .catch(next);
    }

    public updateListById = (req :  Request , res  : Response, next: NextFunction) => {
        const [error, updateListDto] = UpdateListDto.create(req.body)
        if (error) return res.status(400).json(error);

        this.listRepository.updateListById(updateListDto!)
            .then(list => res.status(200).json(list))
            .catch(next);
    }

    public removeListById = (req :  Request , res  : Response, next: NextFunction) => {
        const listId = req.params.id;
        const userId = req.body.user.id;
        
        this.listRepository.removeListById(listId, userId)
            .then(()=> res.status(204).end())
            .catch(next);
    }
}