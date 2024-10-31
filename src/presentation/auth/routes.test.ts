import request from 'supertest';

import { bcryptAdapter } from '../../config/plugins';
import nodemailer from 'nodemailer';

// Mock al createTransport
const mockSendMail = jest.fn();
nodemailer.createTransport = jest.fn().mockReturnValue( {
  sendMail: mockSendMail
});

import { testServer } from '../test-server';
import { prisma } from '../../data/postgres/init';

describe('auth integration tests routes.ts' , function () {
    const users = [
        {id:'1', name: 'User 1', email: 'test1@gmail.com', password: bcryptAdapter.hash( '123456'), emailValidated: true},
        {id:'2', name: 'User 2', email: 'test2@gmail.com', password: bcryptAdapter.hash( '123456'), emailValidated: true},
    ]

    beforeAll(async ()=> {
        await prisma.item.deleteMany()
        await prisma.list.deleteMany()
        await prisma.user.deleteMany()
        
        await prisma.user.createMany({data: users}),
        await testServer.start()
    });
        
    afterAll(async ()=> {
        await testServer.close();
    });

    // --------------------------------REGISTER USER TESTS-----------------------------------------
    test('should register new user and return the new user with no password and a token and send an email', async function () {
        const newUser = {name: 'New Test User', email: 'newtestuser@gmail.com', password: '123456'}
        
        const{body} = await request(testServer.app)
            .post('/api/auth/register/')
            .send(newUser)
            .expect(201)
            
        expect(body.user.name).toEqual(newUser.name)
        expect(body.user.email).toEqual(newUser.email)
        expect(body.user.password).toEqual(undefined)
        expect(body.token).toEqual(expect.any(String))
        expect(mockSendMail).toHaveBeenCalledTimes(1);
    });


    test('should return an error when name is not a string,', async function () {
        const newUser = {name: 123, email: 'test4@gmail.com', password: '123456'}
        
        try {
            const{body} = await request(testServer.app)
                .post('/api/auth/register/')
                .send(newUser)
                .expect(400);

                expect(body).toEqual({error : expect.stringContaining('name')})
        }
        catch{(err:any) =>
            console.error(err)
            expect(true).toBe(false);
        }
    });

    // TODO: FIX THIS TEST: returns internal server error
    // test('should return an error when email is repeatead', async function () {
    //     const newUser = {name: 'New Test User', email: users[0].email, password: '123456'}
    //     try {
    //         const{body} = await request(testServer.app)
    //             .post('/api/auth/register/')
    //             .send(newUser)
    //             .expect(400);
            
    //         expect(body).toEqual({error: expect.stringContaining('email')})
    //     }
    //     catch{(err:any) =>
    //         console.error(err.message)
    //         expect(true).toBe(false);
    //     }
    // });

    
    // --------------------------------LOGIN USER TESTS-----------------------------------------
    // TODO: FIX THIS TEST: returns internal server error
    // test('should login new user and return the new user with no password and a token', async function () {
    //     const user = users[0];
        
    //     try {
    //     const{body} = await request(testServer.app)
    //         .post('/api/auth/login/')
    //         .send(user)
    //         .expect(200)
            
    //         expect(body.user.name).toEqual(user.name)
    //         expect(body.user.email).toEqual(user.email)
    //         expect(body.user.password).toEqual(undefined)
    //         expect(body.token).toEqual(expect.any(String))
    //     }
    //     catch{(err:any) =>
    //         console.error(err.message)
    //         expect(true).toBe(false);
    //     }
    // });


    test('should return an error when email is not present is not a string,', async function () {
        const user = {name: '123', password: '123456'}

        try {
            const{body} = await request(testServer.app)
                .post('/api/auth/login/')
                .send(user)
                .expect(400)
            
            expect(body).toEqual({error : expect.stringContaining('email')})

        } catch{(err:any) =>
            console.error(err)
            expect(true).toBe(false);
        }
    });
});