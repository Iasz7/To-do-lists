import request from 'supertest';
import { testServer } from '../test-server';
import { prisma } from '../../data/postgres/init';
import { bcryptAdapter } from '../../config/plugins';
import { NextFunction, Request, Response } from 'express';


const users = [
    {id:'1', name: 'User 1', email: 'test1@gmail.com', password: bcryptAdapter.hash( '123456'), emailValidated: true},
    {id:'2', name: 'User 2', email: 'test2@gmail.com', password: bcryptAdapter.hash( '123456'), emailValidated: true},
]
const lists = [
    {id: '1', name:'testing list', createdAt: new Date(), userId: users[0].id},
    {id: '2', name:'testing list 2', createdAt: new Date(), userId: users[0].id},
    {id: '3', name:'testing list 3', createdAt: new Date(), userId: users[1].id},
]
const items = [
    {id: '1', description: 'test item 1', listId: lists[0].id, createdAt: new Date()},
    {id: '2', description: 'test item 2', listId: lists[0].id},
    {id: '3', description: 'test item 3', listId: lists[2].id}
]


         // Mock del middleware
 jest.mock('../middlewares/auth.middleware.ts', () => ({
    AuthMiddleware: {
        validateToken: (req:Request, res:Response, next:NextFunction) => {
            // Simulamos un usuario autenticado
            req.body.user = users[0];
            next();
        }
    }
})); 

describe('item integration tests routes.ts' , function () {
    beforeAll(async ()=> {
        await prisma.item.deleteMany()
        await prisma.list.deleteMany()
        await prisma.user.deleteMany()
        
        await prisma.user.createMany({data: users}),
        await prisma.list.createMany({data: lists}),
        await prisma.item.createMany({data: items})
        
        await testServer.start()
    });

    afterAll(async ()=> {
        await testServer.close();
    }); 

    // --------------------------------GET ITEM BY ID TESTS-----------------------------------------
    test('getItemByID should return item by Id', async function () {
        const item = items[0];

        await request(testServer.app)
            .get(`/api/items/${item.id}`)
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
        const newItem = {id: '777', description: 'item that should be created', listId: lists[0].id}
        try {
            const{body} =  await request(testServer.app)
                .post('/api/items/')
                .send(newItem)
                .expect(201)

            expect(body.id).toEqual(newItem.id)
            expect(body.description).toEqual(newItem.description)
            expect(body.listId).toEqual(newItem.listId)
        } catch (e: any) {
            console.error(e)
            expect(true).toBe(false);
        }
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

        await request(testServer.app)
            .delete(`/api/items/${item.id}`)
            .send(item)
            .expect(204)

        expect(await prisma.item.findUnique({where: {id: item.id}})).toEqual(null)
  
    });

    test('deleteItemByID should return status 403 when user is not the creator of the item', async function () {
        const testId = '3';
        
        const {body} =  await request(testServer.app)
            .delete(`/api/items/${testId}`)
            .expect(403)
        
        expect(body).toEqual(expect.stringContaining(`authorized to access`));
    });
});