import { Request, Response } from 'express';
import { CreateItemDto, CustomError, ItemRepository, UpdateItemDto } from '../../domain';


export class ItemsController {

    constructor(private readonly itemRepository : ItemRepository){}

    private handleError(res: Response, err : unknown){
        if (err instanceof CustomError){
            return res.status(err.statusCode).json(err.message);
        }
        console.error(err);
        return res.status(500).send(err);
    }

    public getItemById = async (req :  Request , res  : Response) => {
        try{
            const item = await this.itemRepository.getItemById(req.params.id);
            return res.status(200).json(item);
        }catch(err: any) {
            return this.handleError(res, err);
        }
    }

    public createItem = async (req : Request, res : Response) => {

        const [error, createItemDto] = CreateItemDto.create(req.body)
        if (error) return res.status(400).json(error);
        
        try {
            const newItem = await this.itemRepository.createItem(createItemDto!);
            return res.status(201).json(newItem);
        } catch (err: any) {
            return this.handleError(res, err);
        }
    }
    
    public updateItem = async (req : Request, res : Response) => {
        const [error, updateItemDto] = UpdateItemDto.create(req.body)
        if (error) return res.status(400).json(error);
        
        try {
            const updatedItem = await this.itemRepository.updateItem(updateItemDto!);
            return res.status(200).json(updatedItem);
        } catch (err: any) {
            return this.handleError(res, err);
        }
    }

    public deleteItem = async (req: Request, res: Response) =>{
        const id = req.params.id;
         
        try {
            await this.itemRepository.deleteItem(id)
            return res.status(204).send()
        } catch (error) {
            return this.handleError(res, error)
        }
    }
    
    // public getAllTodos = async (req : Request , res : Response) => {
    //     try{
    //         const items = await prisma.item.findMany();
    //         res.json(items)
    //     }catch(err) {
    //         const messageError ='Error fetching all items from postgres: ' + err
    //         console.error(messageError);
    //         res.status(500).send(messageError);
    //     }
    // }
}