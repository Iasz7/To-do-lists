import {getUUID} from '../../src/plugins/';

describe('plugins/get-id.plugin.ts', () => {
    test('Genera un UUID', () => {
        const id = getUUID();
        expect(typeof id).toBe('string');
        expect(id.length).toBe(36);
        expect(id.split('-').length).toBe(5); // 5 guiones en un UUID
    });
}   
)
 