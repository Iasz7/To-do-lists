import { envs } from './config/plugins/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(()=> {
    main()
})()

async function main(){
    const server = new Server({
        port: envs.PORT,
        routes : AppRoutes.routes,
        publicPath : envs.PUBLIC_PATH
    });
    server.start();  
}