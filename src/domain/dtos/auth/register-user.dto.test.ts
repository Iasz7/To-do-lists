import { RegisterUserDto } from './register-user.dto';


describe('login-user.dto.ts', () => {
    
    test('should create a dto with the correct parameters', () => {
        const email = 'email@example.com';
        const password = '123456'
        const name = 'test user' 

        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual(null);
        expect(dto).toBeInstanceOf(RegisterUserDto);
        expect(dto).toEqual({email, password, name});
    })

    // EMAIL VALIDATIONS TESTS
    test('should validate that email exists', () => {
        const password = '123456'
        const email = ''
        const name = 'test user' 

        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual('Missing email');
        expect(dto).toEqual(null);
    })
    test('should validate that email is valid', () => {
        const password = '123456'
        const email = 'not-valid-email'
        const name = 'test user' 

        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual('Invalid email');
        expect(dto).toEqual(null);
    })
    test('should validate that email is a string', () => {
        const password = '123456'
        const email = 123
        const name = 'test user' 

        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual('Invalid email');
        expect(dto).toEqual(null);
    })

    // PASSWORD VALIDATIONS TESTS
    test('should validate that password exists', () => {
        const password = ''
        const email = 'email@example.com';
        const name = 'test user' 

        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual('Missing password');
        expect(dto).toEqual(null);
    })

    test('should validate that password has at least 6 chars', () => {
        const password = '123'
        const email = 'email@example.com';
        const name = 'test user' 

        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual('Password must have 6 characters');
        expect(dto).toEqual(null);
    })

    test('should validate that password is a string', () => {
        const password = 123456
        const email = 'email@example.com';
        const name = 'test user' 

        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual('password must be a string');
        expect(dto).toEqual(null);
    })

    // NAME VALIDATIONS TESTS
    test('should validate that name exists', () => {
        const password = '123456'
        const email = 'email@example.com';
        const name = ''
        
        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual('Missing name');
        expect(dto).toEqual(null);
    });

    test('should validate that name is a string', () => {
        const password = '123456'
        const email = 'email@example.com';
        const name = 123
        
        const [error, dto] = RegisterUserDto.create({ email, password, name })

        expect(error).toEqual('name must be a string');
        expect(dto).toEqual(null);
    });
});