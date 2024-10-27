import { Request, Response } from 'express';
import { CustomError, ListRepository } from '../../domain';

export class ListsController {
    constructor(private readonly listRepository : ListRepository){}

    private handleError(res: Response, err : any){
        if (err instanceof CustomError){
            return res.status(err.statusCode).send(err.message);
        }
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }

    public findListsByName = (req :  Request , res  : Response) => {
        const name = req.params.name;
        const userId = req.body.user.id;

        this.listRepository.findListsByName(name, userId)
            .then(lists => res.status(200).json(lists))
            .catch(err => this.handleError(res, err));
    }

    public getListsByUserId = (req :  Request , res  : Response) => {
        const userId = req.body.user.id;
        
        this.listRepository.getListsByUserId(userId)
            .then(lists => res.status(200).json(lists))
            .catch(err => this.handleError(res, err));
    }
    
    public getListById = (req :  Request , res  : Response) => {
        const listId = req.params.id;
        const userId = req.body.user.id;

        this.listRepository.getListById(listId, userId)
            .then(list => res.status(200).json(list))
            .catch(err => this.handleError(res, err));
    }

    public createList = (req :  Request , res  : Response) => {
        const listOptions = req.body;
        
        this.listRepository.createList(listOptions)
            .then(list => res.status(201).json(list))
            .catch(err => this.handleError(res, err));
    }

    public updateListById = (req :  Request , res  : Response) => {
        const updatedListOptions = req.body;

        this.listRepository.updateListById(updatedListOptions)
            .then(list => res.status(200).json(list))
            .catch(err => this.handleError(res, err));
    }

    public removeListById = (req :  Request , res  : Response) => {
        const listId = req.params.id;
        const userId = req.body.user.id;
        
        this.listRepository.removeListById(listId, userId)
            .then(()=> res.status(204).end())
            .catch(err => this.handleError(res, err));
    }
}