import { Server } from './presentation/server';
import { envs } from './config/plugins/envs';

jest.mock('./presentation/server');

describe('App.ts', () => {
    test('should start the server with arguments and start method` ', async () => {
        await import('./app')   

        expect(Server).toHaveBeenCalledWith({
            port: envs.PORT,
            routes: expect.any(Function),
            publicPath: envs.PUBLIC_PATH
        });

        expect(Server.prototype.start).toHaveBeenCalledTimes(1);
    });
})