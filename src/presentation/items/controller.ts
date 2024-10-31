import { Request, Response } from 'express';
import { CreateItemDto, CustomError, ItemRepository, UpdateItemDto } from '../../domain';


export class ItemsController {
    constructor(private readonly itemRepository : ItemRepository){}

    private handleError(res: Response, err : unknown){
        if (err instanceof CustomError){
            if (err.statusCode === 500) console.error(err.message);
            return res.status(err.statusCode).json(err.message);
        }
        console.error(err);
        res.status(500).send(err);
    }

    public getItemById = async (req :  Request , res  : Response) => {
        try{
            const item = await this.itemRepository.getItemById(req.params.id, req.body.user.id);
            return res.status(200).json(item);
        }catch(err: any) {
            return this.handleError(res, err);
        }
    }

    public createItem = async (req : Request, res : Response) => {

        const [error, createItemDto] = CreateItemDto.create(req.body)
        if (error) return res.status(400).json(error);
        
        try {
            const newItem = await this.itemRepository.createItem(createItemDto!, req.body.user.id);
            return res.status(201).json(newItem);
        } catch (err: any) {
            return this.handleError(res, err);
        }
    }
    
    public updateItem = async (req : Request, res : Response) => {
        const [error, updateItemDto] = UpdateItemDto.create(req.body)
        if (error) return res.status(400).json(error);
        
        try {
            const updatedItem = await this.itemRepository.updateItem(updateItemDto!, req.body.user.id);
            return res.status(200).json(updatedItem);
        } catch (err: any) {
            return this.handleError(res, err);
        }
    }

    public deleteItem = async (req: Request, res: Response) =>{
        const id = req.params.id;
         
        try {
            await this.itemRepository.deleteItem(id, req.body.user.id)
            return res.status(204).send()
        } catch (error) {
            return this.handleError(res, error)
        }
    }
}