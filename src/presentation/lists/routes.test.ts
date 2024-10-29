import request from 'supertest';
import { testServer } from '../test-server';
import { prisma } from '../../data/postgres/init';
import { bcryptAdapter, JwtGeneretor } from '../../config/plugins';


describe('lists integration tests routes.ts' , function () {
    
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
        {id: '2', description: 'test item 2', listId: lists[0].id}
    ]

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
    // -------------------------------- GET LISTS TESTS --------------------------------
    test('should return array of lists by user id', async function () {
    
        const {body} = await request(testServer.app)
            .get(`/api/lists/`)
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(users[0])}`))
            .expect(200)

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].id).toBe(lists[0].id);
        expect(body[0].name).toBe(lists[0].name);
    });

    test('getListById should return a list by Id', async function () {
        const list = lists[2], user = users[1];

        const {body} = await request(testServer.app)
            .get(`/api/lists/${list.id}`)
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .expect(200)

        expect(body.id).toBe(list.id);
        expect(body.items.lenght).toBe(0 || undefined);
        expect(body.name).toBe(list.name);
    });

    test('getListById should return forbidden acces when access is required by a different user', async function () {
        const list = lists[0], user = users[1]; // la lista 0 pertenece al user 0, no al 1

        await request(testServer.app)
            .get(`/api/lists/${list.id}`)
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .expect(403)
    });

    test('getItemByID should return status 404 when the  is not found', async function () {
        const testId = 'id-that-dont-exist';
        
        const {body} =  await request(testServer.app)
            .get(`/api/lists/${testId}`)
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(users[0])}`))
            .expect(404)
        
        expect(body).toEqual(expect.stringContaining(`List with id: ${testId} not found`));
    });

        // --------------------------------CREATE LISTS TESTS-----------------------------------------
    test('createItem should create and return new list and return status 201', async function () {
        const user = users[1], newList = {id: '99', name: 'test list 99', userId: user.id}

        const{body} =  await request(testServer.app)
            .post(`/api/lists/`)
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .send(newList)
            .expect(201);

        expect(body.id).toEqual(newList.id)
        expect(body.name).toEqual(newList.name)
        expect(body.userId).toEqual(newList.userId)
    });

    test('createList should return an error when name is not present', async function () {
        const user = users[1], newList = {id: 'no-name', userId: user.id}

        const{body} = await request(testServer.app)
            .post('/api/lists/')
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .send(newList)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("name"))
    });

    test('createItem should return an error when ID is repeatead', async function () {
        const user = users[0], newList = lists[0];

        const{body} = await request(testServer.app)
            .post('/api/lists/')
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .send(newList)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("id"))
    });
    // --------------------------------DELETE LISTS TESTS-----------------------------------------
    test('deleteItemByID should return status 404 when the id is not found', async function () {
        const testId = 'id-that-dont-exist';
        
        const {body} =  await request(testServer.app)
            .delete(`/api/lists/${testId}`)
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(users[0])}`))
            .expect(404)
        
        expect(body).toEqual(expect.stringContaining(`List with id: ${testId} not found`));
    });

    test('deleteList should delete list and return status 204', async function () {
        const user = users[0];
        const list = {id: '777', name: 'test list to be deleted', userId: user.id}
        await prisma.list.create({data: list})

        await request(testServer.app)
            .delete(`/api/lists/${list.id}`)
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .send(list)
            .expect(204)

        expect(await prisma.list.findUnique({where: {id: list.id}})).toEqual(null)
    
    });
    
    test('deleteList should return forbidden acces when access is required by a different user', async function () {
        const list = lists[0], user = users[1]; // la lista 0 pertenece al user 0, no al 1

        const {body} = await request(testServer.app)
            .delete(`/api/lists/${list.id}`)
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .expect(403)
    });

       // --------------------------------UPDATE LIST TESTS-----------------------------------------
    test('updeteList should update and return item, and return status 200', async function () {
        const user = users[0];
        const list = {id: lists[0].id, name: 'TEST UPDATE list', userId: user.id};
        
        const{body} =  await request(testServer.app)
            .put('/api/lists/')
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .send(list)
            .expect(200)

        expect(body.id).toEqual(list.id)
        expect(body.name).toEqual(list.name)
    });

    test('updeteList should return status 404 when the id is not found', async function () {
        const user = users[0];
        const list = {id: 'id-that-dont-exist', name: 'TEST UPDATE list', userId: user.id};
        
        const{body} =  await request(testServer.app)
            .put('/api/lists/')
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .send(list)
            .expect(404)
        
        expect(body).toEqual(expect.stringContaining(`List with id: ${list.id} not found`));
    });

    test('updeteList should return an error when name is not a string,', async function () {
        const user = users[0];
        const list = {id: lists[0].id, name: 7, userId: user.id};

        const{body} =  await request(testServer.app)
            .put('/api/lists/')
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .send(list)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("name"))
    });

    test('updeteList should return an error when createdAt is not a date', async function () {
        const user = users[0];
        const list = {id: lists[0].id, name: "list with bad created at", userId: user.id, createdAt:'not a date'};

        const{body} =  await request(testServer.app)
            .put('/api/lists/')
            .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
            .send(list)
            .expect(400)

        expect(body).toEqual(expect.stringContaining("date"))
    });   
});