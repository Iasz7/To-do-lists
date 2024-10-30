import { LoginUserDto } from './login-user.dto';


describe('login-user.dto.ts', () => {
    
    test('should create a dto with the correct parameters', () => {
        const email = 'email@example.com';
        const password = '123456'

        const [error, dto] = LoginUserDto.create({ email, password })

        expect(error).toEqual(null);
        expect(dto).toBeInstanceOf(LoginUserDto);
        expect(dto).toEqual({email, password});
    })

    // EMAIL VALIDATIONS TESTS
    test('should validate that email exists', () => {
        const password = '123456'
        const email = ''

        const [error, dto] = LoginUserDto.create({password , email })

        expect(error).toEqual('Missing email');
        expect(dto).toEqual(null);
    })
    test('should validate that email is valid', () => {
        const password = '123456'
        const email = 'not-valid-email'

        const [error, dto] = LoginUserDto.create({password , email })

        expect(error).toEqual('Invalid email');
        expect(dto).toEqual(null);
    })
    test('should validate that email is a string', () => {
        const password = '123456'
        const email = 123

        const [error, dto] = LoginUserDto.create({password , email })

        expect(error).toEqual('Invalid email');
        expect(dto).toEqual(null);
    })

    // PASSWORD VALIDATIONS TESTS
    test('should validate that password exists', () => {
        const password = ''
        const email = 'email@example.com';

        const [error, dto] = LoginUserDto.create({password , email })

        expect(error).toEqual('Missing password');
        expect(dto).toEqual(null);
    })

    test('should validate that password has at least 6 chars', () => {
        const password = '123'
        const email = 'email@example.com';

        const [error, dto] = LoginUserDto.create({password , email })

        expect(error).toEqual('Password must have 6 characters');
        expect(dto).toEqual(null);
    })

    test('should validate that password is a string', () => {
        const password = 123456
        const email = 'email@example.com';

        const [error, dto] = LoginUserDto.create({password , email })

        expect(error).toEqual('password must be a string');
        expect(dto).toEqual(null);
    })
});