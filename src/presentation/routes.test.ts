import request from 'supertest';
import { testServer } from './test-server';
import { prisma } from '../data/postgres/init';
import { error } from 'console';

describe('routes.ts' , function () {
    
    const list  = {id: '1', name:'testing list', createdAt: new Date()},
          item1 = {id: '1', description: 'test item 1', listId: '1', createdAt: new Date()},
          item2 = {id: '2', description: 'test item 2', listId: '1'}

    beforeAll(async ()=> {
        await prisma.item.deleteMany()
        await prisma.list.deleteMany()
        await testServer.start()
        await prisma.list.create({data: list}),
        await prisma.item.createMany({data: [item1, item2]})
    });

    afterAll(()=> {
        testServer.close();
    }); 

    // --------------------------------GET ITEM BY ID TESTS-----------------------------------------
    test('getItemByID should return item by Id', async function () {
        await request(testServer.app)
            .get(`/api/items/${item1.id}`)
            .expect(200)
    });

    test('getItemByID should return status 404 when the id is not found', async function () {
        const testId = 'id-that-dont-exist';
        
        const {body} =  await request(testServer.app)
            .get(`/api/items/${testId}`)
            .expect(404)
        
        expect(body).toEqual(expect.stringContaining(`Item with id: ${testId} not found`));
    });

    // --------------------------------CREATE ITEM TESTS-----------------------------------------
    test('createItem should create and return new item and return status 201', async function () {
        const newItem = {id: '3', description: 'test item 3', listId: '1'}

        const{body} =  await request(testServer.app)
            .post(`/api/items/`)
            .send(newItem)
            .expect(201)

        expect(body.id).toEqual(newItem.id)
        expect(body.description).toEqual(newItem.description)
        expect(body.listId).toEqual(newItem.listId)
    });
    
    test('createItem should return an error when description is not a string,', async function () {
        const item = {id: '10', description: 10, listId: '1'}

        const{body} = await request(testServer.app)
            .post('/api/items/')
            .send(item)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("description"))
    });

    test('createItem should return an error when description is empty', async function () {
        const item = {id: '11', description: '', listId: '1'}

        const{body} = await request(testServer.app)
            .post('/api/items/')
            .send(item)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("description"))
    });

    test('createItem should return an error when description is not present', async function () {
        const item = {id: '12', listId: '1'}

        const{body} = await request(testServer.app)
            .post('/api/items/')
            .send(item)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("description"))
    });

    test('createItem should return an error when ID is repeatead', async function () {
        const item = {id: '1', description: 'item with repeated id ', listId: '1'}

        const{body} = await request(testServer.app)
            .post('/api/items/')
            .send(item)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("id"))
    });
    
    test('createItem should return an error when createdAt is not a date', async function () {
        const item = {id: '14', description: 'item with bad created at', listId: '1', createdAt:'not a date'};

        const{body} = await request(testServer.app)
            .post('/api/items/')
            .send(item)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("date"))
    });    
    
   // --------------------------------UPDATE ITEM TESTS-----------------------------------------
   test('updateItem should update and return item, and return status 200', async function () {
        const item = {id: '1', description: 'TEST UPDATE item 3'}

        const{body} =  await request(testServer.app)
            .put('/api/items/')
            .send(item)
            .expect(200)

        expect(body.id).toEqual(item.id)
        expect(body.description).toEqual(item.description)
    });

    test('updeteItem should return status 404 when the id is not found', async function () {
        const item = {id: 'id-that-dont-exist', description: 'TEST UPDATE'} ;
        
        const {body} =  await request(testServer.app)
            .put('/api/items/')
            .send(item)
            .expect(404)
        
        expect(body).toEqual(expect.stringContaining(`Item with id: ${item.id} not found`));
    });

    test('updeteItem should return an error when description is not a string,', async function () {
        const item = {id: '1', description: 7}

        const{body} = await request(testServer.app)
            .put('/api/items/')
            .send(item)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("description"))
    });

    test('updeteItem should return an error when description is empty', async function () {
        const item = {id: '1', description: '', listId: '1'}

        const{body} = await request(testServer.app)
            .put('/api/items/')
            .send(item)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("description"))
    });

    test('updeteItem should return an error when createdAt is not a date', async function () {
            const item = {id: '1', description: 'item with bad created at', listId: '1', createdAt:'not a date'};

            const{body} = await request(testServer.app)
                .put('/api/items/')
                .send(item)
                .expect(400)

            expect(body).toEqual(expect.stringContaining("date"))
        });   

    // --------------------------------DELETE ITEM TESTS-----------------------------------------
    test('deleteItemByID should return status 404 when the id is not found', async function () {
        const testId = 'id-that-dont-exist';
        
        const {body} =  await request(testServer.app)
            .delete(`/api/items/${testId}`)
            .expect(404)
        
        expect(body).toEqual(expect.stringContaining(`Item with id: ${testId} not found`));
    });

    test('deleteItem should delete item and return status 204', async function () {
        const item = {id: '99', description: 'test item to be deleted', listId: '1'}
        await prisma.item.create({data: item})

        const{body} =  await request(testServer.app)
            .delete(`/api/items/${item.id}`)
            .send(item)
            .expect(204)

        expect(await prisma.item.findUnique({where: {id: item.id}})).toEqual(null)
  
    });
    //list routes
    // test('getLists should return array of lists', async function () {
        
    //     const {body} = await request(testServer.app)
    //         .get(`/api/lists/`)
    //         .expect(200)

    //     expect(body).toBeInstanceOf(Array);
    //     expect(body.length).toBe(1);
    //     expect(body[0].id).toBe(list.id);
    //     expect(body[0].name).toBe(list.name);
    //     expect(body[0].createdAt).toBe(list.createdAt);

    // });

    // test('getListById should return a list by Id', async function () {
        
    //     const {body} = await request(testServer.app)
    //         .get(`/api/lists/${list.id}`)
    //         .expect(200)

    //     expect(body.id).toBe(list.id);
    //     expect(body.name).toBe(list.name);
    //     expect(body.createdAt).toBe(list.createdAt);

    // });

});