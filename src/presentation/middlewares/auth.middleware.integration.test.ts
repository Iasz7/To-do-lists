import request from 'supertest';
import { testServer } from '../test-server';
import { prisma } from '../../data/postgres/init';
import { bcryptAdapter, JwtGeneretor } from '../../config/plugins';

// ------------------- integration tests -------------------
describe('auth.middleware.ts integration test' , function () {
    const user  = {id: '1', name: 'User 1', email: 'test1@gmail.com', password: bcryptAdapter.hash( '123456'), emailValidated: true}, 
      list1 = {id: '1', name:'testing list 1', createdAt: new Date(), userId: user.id},
      //list2 = {id: '2', name:'testing list 2', createdAt: new Date(), userId: user.id},
      item1 = {id: '1', description: 'test item 1', listId: '1'}
      //, item2 = {id: '2', description: 'test item 2', listId: '1'}
    
    beforeAll(async ()=> {
        await prisma.item.deleteMany()
        await prisma.list.deleteMany()
        await prisma.user.deleteMany()

        await prisma.user.create({data: user}),
        await prisma.list.create({data: list1}),
        await prisma.item.create({data: item1})

        await testServer.start()
    });

    afterAll(async ()=> {
        await testServer.close();
    });
    
    test('should return a clear error and status 401 with no token provided ', async function () {
        const {body} = await request(testServer.app)
            .get(`/api/items/${item1.id}`)
            .expect(401)

        expect(body).toEqual({error: 'No token provided.'});
    });

    test('should return a clear error and status 401 when invalid Bearer token', async function () {
        const {body} = await request(testServer.app)
            .get(`/api/items/${item1.id}`)
            .set('Authorization', 'not-bearer-token')
            .expect(401)

            expect(body).toEqual({error: 'Invalid Bearer token.'});
    });

    test('with valid token and user id validateToken should call next() and write user data on body', async () => {
        const {body} = await request(testServer.app)
        .get(`/api/items/${item1.id}`)
        .set('Authorization', (`Bearer ${await JwtGeneretor.generateToken(user)}`))
        .expect(200)

        expect(body).toEqual(expect.objectContaining(item1));
    });
})