import { UpdateListDto } from './update-list.dto';


describe('update-list.dto.ts', () => {
    test('should create a dto with the minimum parameters required', () => {
        const name = 'test list';
        const id = 'test-id';
        const user = { id: 'test-user-id' };
    
        const [error, result] = UpdateListDto.create({name,id, user });

        expect(error).toBeNull();
        expect(result).toEqual({ id, name, userId: 'test-user-id', lastModifiedAt: expect.any(Date) });
    });
    //name validations
    test('should validate that name is not a number', () => {
        const name = 12345;
        const id = 'test-id';
        const user = { id: 'test-user-id' };
    
        const [error, result] = UpdateListDto.create({ id, name, user });
    
        expect(error).toEqual('name must be a string');
        expect(result).toBeNull();
    });

    test('should validate that name is not an empty string', () => {
        const name = '';
        const id = 'test-id';
        const user = { id: 'test-user-id' };

        const [error, result] = UpdateListDto.create({ id, name, user });

        expect(error).toEqual('name is required');
        expect(result).toBeNull();
    })

    test('should validate that name is not an longer than maxLength', () => {
        let name: string = 'long name';
        for (let index = 0; index < UpdateListDto.maxLength; index++) {
            name = name + 'a'
        };
        const id = 'test-id';
        const user = { id: 'test-user-id' };

        const [error, result] = UpdateListDto.create({ id, name, user });

        expect(error).toEqual(expect.stringContaining(UpdateListDto.maxLength.toString()));
        expect(result).toBeNull();
    })
    //id validation
    test('should validate that id exists', () => {
        const name = 'test-name';
        const user = { id: 'test-user-id' };

        const [error, result] = UpdateListDto.create({name, user });

        expect(error).toEqual('id is required');
        expect(result).toBeNull();
    })
    test('should validate that id is not empty', () => {
        const name = 'test-name';
        const id = '';
        const user = { id: 'test-user-id' };;

        const [error, result] = UpdateListDto.create({ id, name, user });

        expect(error).toEqual('id is required');
        expect(result).toBeNull();
    })
    test('should validate that id is a string', () => {
        const name = 'test-name';
        const id = 123;
        const user = { id: 'test-user-id' };

        const [error, result] = UpdateListDto.create({name, user, id });

        expect(error).toEqual('id must be a string');
        expect(result).toBeNull();
    })
    //user.id validation
    test('should validate that userId exists', () => {
        const name = 'test-name';
        const id = 'test-id';
        const user = null;

        const [error, result] = UpdateListDto.create({ id, name, user });

        expect(error).toEqual('user.id is required');
        expect(result).toBeNull();
    })

    test('should validate that userId is not empty', () => {
        const name = 'test-name';
        const id = 'test-id';
        const user = { id: '' };

        const [error, result] = UpdateListDto.create({ id, name, user });

        expect(error).toEqual('user.id is required');
        expect(result).toBeNull();
    })
    //createdAt validations
    test('should validate that createdAt is not a string', () => {
        const name = 'test-name';
        const id = 'test-id';
        const createdAt = '2022-01-01';
        const user = { id: 'test-user-id' };
    
        const [error, result] = UpdateListDto.create({ id, name, createdAt, user });
    
        expect(error).toEqual('createdAt must be a valid date');
        expect(result).toBeNull();
    });
})