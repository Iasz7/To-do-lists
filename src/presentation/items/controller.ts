import { Request, Response, NextFunction } from 'express';
import { CreateItemDto, CustomError, ItemRepository, ListRepository, UpdateItemDto } from '../../domain';
import { ItemService } from '../services/items.service';
import { ListService } from '../services/lists.service';


export class ItemsController {
    public itemService: ItemService;
    constructor(
        listRepository : ListRepository,
        itemRepository : ItemRepository,
    ){
        this.itemService = new ItemService(itemRepository, listRepository);
    }
    public getItemById = (req :  Request , res  : Response, next: NextFunction) => {

        this.itemService.getItemById(req.params.id, req.body.user.id)
            .then((item) => res.status(200).json(item))
            .catch(next)
    }

    public createItem = (req : Request, res : Response, next: NextFunction) => {

        const [error, createItemDto] = CreateItemDto.create(req.body)
        if (error) return res.status(400).json(error);
        
        this.itemService.createItem(createItemDto!, req.body.user.id)
            .then((newItem) => res.status(201).json(newItem))
            .catch(next)
    }
    
    public updateItem = async (req : Request, res : Response, next: NextFunction) => {
        const [error, updateItemDto] = UpdateItemDto.create(req.body)
        if (error) return res.status(400).json(error);
        
        this.itemService.updateItem(updateItemDto!, req.body.user.id)
            .then((updatedItem) => res.status(200).json(updatedItem))
            .catch(next);

    }

    public deleteItem = async (req: Request, res: Response, next: NextFunction) =>{
        const id = req.params.id;
         
        this.itemService.deleteItem(id, req.body.user.id)
           .then(()=> res.status(204).send())
           .catch(next);
    }
}