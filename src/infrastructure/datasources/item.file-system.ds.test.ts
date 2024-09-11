import ListFileSystemDs from './list.file-system.ds';
import { ItemOptions, ListOptions, ListEntity, ItemEntity } from '../../domain/entities';
import ItemFileSystemDs from './item.file-system.ds';



describe('ItemFileSystemDs', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    //preparando los Ds y crear una lista para todos los testing
    const listDs = new ListFileSystemDs()
    listDs.fileName = 'testing-list'
    const itemDs = new ItemFileSystemDs(listDs)
    const testingList : ListEntity = new ListEntity({ name: "Testing-list", id: "1"})
    //preparando los items para iniciar el testing
    const itemsOptions : ItemOptions[] = [
        { description: "Item 1", id: "1", isActivated: true},
        { description: "Item 2", id: "2", isActivated: true},
        { description: "Item 3", id: "3", isActivated: true}
    ];  

    beforeAll(async () => {
        try{
            await listDs.removeListById(testingList.id)
        }catch(err){}
        await listDs.createList(testingList)}
    )

    afterAll(() => listDs.removeListById(testingList.id));
    
    test("createItem should create an item with custom values", async () => {
        for (const item of itemsOptions) {
            await itemDs.createItem(testingList.id, item)
        }

        let modifiedList = await listDs.getListById(testingList.id)
        for (let index = 0; index < itemsOptions.length; index++) {
            expect(modifiedList.items[index].description)
                .toEqual(itemsOptions[index].description)
            
            expect(modifiedList.items[index].id)
                .toEqual(itemsOptions[index].id)
        }
    })

    test('createItem should throw error when the the list was not created', async () => {
        await expect(itemDs.createItem('2', itemsOptions[0])).rejects.toThrow('List with ID 2 not found.');        
    })

    test("getItemById should return the item by its ID", async () => {
        const item = await itemDs.getItemById(itemsOptions[0].id!)

        expect(item.description).toEqual(itemsOptions[0].description)
        expect(item.id).toEqual(itemsOptions[0].id)
        expect(item.isActivated).toEqual(itemsOptions[0].isActivated)
    });

    test("updateItem should update an item by its ID", async () => {
        const updateItemOptions : ItemOptions = {
            id :itemsOptions[0].id, 
            description: "Testing-updateItem", 
            isActivated : false 
        }
        await itemDs.updateItem(updateItemOptions)

        let modifiedItem = await itemDs.getItemById(updateItemOptions.id!)
        expect(modifiedItem.description).toEqual(updateItemOptions.description)
        expect(modifiedItem.isActivated).toEqual(updateItemOptions.isActivated)
    });

    test("toogleActivated should toogle the activated state", async () => {
        const testingItem = itemsOptions[1]
        await itemDs.toggleActivation(testingItem.id!)

        let modifiedItem = await itemDs.getItemById(testingItem.id!)
        expect(modifiedItem.isActivated).toEqual(!testingItem.isActivated)
    })


    test("deleteItem should remove an item by its ID", async () => {
        await itemDs.deleteItem(itemsOptions[(itemsOptions.length - 1)].id!);

        let modifiedList = await listDs.getListById(testingList.id)
        expect(modifiedList.items.length).toEqual(itemsOptions.length - 1);
    });

    test("deleteItem, getItemById, updateItemByID and toogleActivation should return an error when item ID is not found", async () => {
        const itemId = 'ID-that-does-not-exist'
        const updateItemOptions : ItemOptions = {
            id : itemId, 
            description: "Testing-updateItem", 
        }
        const errorMessage = `Item with ID ${itemId} not found.`

        expect(itemDs.deleteItem(itemId)).rejects.toThrow(errorMessage); 
        expect(itemDs.toggleActivation(itemId)).rejects.toThrow(errorMessage);
        expect(itemDs.getItemById(itemId)).rejects.toThrow(errorMessage);
        expect(itemDs.updateItem(updateItemOptions)).rejects.toThrow(errorMessage);
    });
});