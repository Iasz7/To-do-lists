import { envs } from './config/plugins/envs';
import { Server } from './presentation/server';

(()=> {
    main()
})()

async function main(){
    const server = new Server({
        port: envs.PORT,
        publicPath : envs.PUBLIC_PATH
    });
    server.start();  
}