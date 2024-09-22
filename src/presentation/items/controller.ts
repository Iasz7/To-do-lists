import { Request, Response } from 'express';
import { CreateItemDto, ItemRepository, UpdateItemDto } from '../../domain';


export class ItemsController {

    constructor(private readonly itemRepository : ItemRepository){}

    public getItemById = async (req :  Request , res  : Response) => {
        try{
            const item = await this.itemRepository.getItemById(req.params.id);
            res.status(200).json(item)
        }catch(err: any) {
            const status: number = (err.message.includes('not found')) ? 404 : 500;
            res.status(status).json(err.message);
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

    public createItem =async (req : Request, res : Response) => {

        const [error, createItemDto] = CreateItemDto.create(req.body)
        if (error) res.status(400).json(error);
        
        try{ 
            const newItem = await this.itemRepository.createItem(createItemDto!);
            res.status(201).json(newItem);
        }
        catch (err:any) {
            const status: number = (err.message.includes('exist')) ? 404 : 500;
            res.status(status).json(err.message);
        }
    }
    
    public updateItem = async (req : Request, res : Response) => {
        const [error, updateItemDto] = UpdateItemDto.create(req.body)
        if (error) res.status(400).json(error);

        try{ 
            const updatedItem = await this.itemRepository.updateItem(updateItemDto!)
            res.status(201).json(updatedItem);
        }
        catch (err:any) {
            const status: number = (err.message.includes('not found')) ? 404 : 500;
            res.status(status).json(err.message);
        }
    }

    public deleteItem = (req: Request, res: Response) =>{
        const id = req.params.id;
         
        this.itemRepository.deleteItem(id)
            .then((deletedItem) =>  res.status(200).send(deletedItem))
            .catch((err: any) => {
                const status: number = (err.message.includes('not found')) ? 404 : 500;
                res.status(status).json(err.message);
            })
    }
}