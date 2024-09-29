import { envs } from '../config/plugins/envs';
import { AppRoutes } from './routes';
import {Server} from './server'; 


export const testServer = new Server({
    port: envs.PORT,
    routes : AppRoutes.routes,
    publicPath : envs.PUBLIC_PATH
});
