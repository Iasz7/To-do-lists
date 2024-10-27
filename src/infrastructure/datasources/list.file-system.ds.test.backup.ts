// import ListFileSystemDs from './list.file-system.ds';
import ListFileSystemDs from '../datasources/list.file-system.ds.backup';
import fs from 'fs';
import { ListOptions, ListEntity } from '../../domain/entities/list.entity';
import { buildLogger } from '../../config/plugins';




describe('ListFileSystemDs', () => {
    const listFileSystemDs = new ListFileSystemDs();
    
    const newListOptions: ListOptions = { id: '1', name: 'Test List'};

    const logger = buildLogger('list.file-system.ds.test.ts')

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("getAllLists should return an empty array if the file does not exist", async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    
        const result = await listFileSystemDs.getAllLists();
    
        expect(result).toEqual([]);
        expect(fs.existsSync).toHaveBeenCalledWith(listFileSystemDs.filePath);
    });
    
    test("getAllLists should return an empty array if the file is empty", async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    
        const result = await listFileSystemDs.getAllLists();
    
        expect(result).toEqual([]);
        expect(fs.readFileSync).toHaveBeenCalledWith(listFileSystemDs.filePath, 'utf8');
    });
    
    test("getAllLists should return a parsed list if the file contains data", async () => {
        const mockData = JSON.stringify([{ id: 1, name: 'Test List' }]); 
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue(mockData);
    
        const result = await listFileSystemDs.getAllLists();
    
        expect(result).toEqual([{ id: 1, name: 'Test List' }]);
        expect(fs.readFileSync).toHaveBeenCalledWith(listFileSystemDs.filePath, 'utf8');
    });


    test("creatList  method should create a list and write it to the file system, and write the respective folder", async () => { 
        listFileSystemDs.outputPath = 'outputs/test-directory/'
        fs.existsSync(listFileSystemDs.outputPath) && fs.rmSync(listFileSystemDs.outputPath, { recursive: true, force: true });
        const writeFileSyncSpy = jest.spyOn(fs, "writeFileSync");

        const testList = new ListEntity(newListOptions)
        await listFileSystemDs.createList(testList);

        expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
        expect(writeFileSyncSpy).toHaveBeenCalledWith(
            listFileSystemDs.filePath,
            JSON.stringify([(testList)], null, 2)
        );
        expect(fs.existsSync(listFileSystemDs.outputPath)).toBe(true);
    });

    test("getListById should throw an error when trying to get a list by an ID that does not exist", async () => {
        const nonExistentId = "non-existent-id";
    
        await expect(listFileSystemDs.getListById(nonExistentId)).rejects.toThrow(
            `List with ID ${nonExistentId} not found`
        );
    });

    test("findListsByName should return an empty array when trying to find lists by a name that does not exist", async () => {
        const lists = await listFileSystemDs.findListsByName("nonExistentName");
    
        expect(lists).toEqual([]);
    });
    

    test("updateListById should update an existing list and overwrite the file system with the updated list", async () => {
        
        const updatedList = new ListEntity({ id: "1", name: "Updated List" })
        const writeFileSyncSpy = jest.spyOn(fs, "writeFileSync");

        await listFileSystemDs.updateList(updatedList);

        expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
        expect(writeFileSyncSpy).toHaveBeenCalledWith(
            listFileSystemDs.filePath,
            JSON.stringify([(updatedList)], null, 2)
        );

    });
       
    
    // Unit test for removing a list from the file system and updating the file system accordingly


    
    // Import the class to test and the mocked dependencies
    // test("should remove a list from the file system and update the file system accordingly", async () => {
    //     const listIdToRemove = "test-list-id";
    //     const listNameToRemove = "test-list-name";
    //     const listOptionsToRemove = { id: listIdToRemove, name: listNameToRemove };
    //     const listEntityToRemove = new ListEntity(listOptionsToRemove);

    //     // Mock the ListEntity constructor to return the mocked entity
    //     jest.mock("../../domain/entities/list.entity", () => {
    //     return {
    //         ListEntity: jest.fn().mockImplementation((options) => ({
    //             ...options,
    //             toString: jest.fn().mockReturnValue(JSON.stringify(options)),
    //         })),
    //     };
    //     });

    //     // Mock the file system operations
    //     jest.mock("fs", () => ({
    //         ...jest.requireActual("fs"),
    //         readFileSync: jest.fn().mockReturnValue(JSON.stringify([listEntityToRemove])),
    //         writeFileSync: jest.fn(),
    //     }));
    
    //     // Act
    //     await listFileSystemDs.removeListById(listIdToRemove);
    
    //     // Assert
    //     expect(fs.readFileSync).toHaveBeenCalledWith(listFileSystemDs.outputPath, "utf8");
    //     expect(fs.writeFileSync).toHaveBeenCalledWith(
    //         listFileSystemDs.outputPath,
    //         JSON.stringify([], null, 2)
    //     );
    // });

});