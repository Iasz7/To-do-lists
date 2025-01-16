import express, { Router } from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware';

type ServerOptions = {
    port: number,
    routes : Router,
    publicPath?: string,
    frontendUrl: string
}

export class Server {

    public readonly app = express();
    private serverListening? : any;
    private readonly port : number;
    private readonly publicPath : string;
    private readonly routes: Router;
    private readonly frontendUrl: string;

    constructor(options : ServerOptions) {
    this.port = options.port
    this.routes = options.routes;
    this.publicPath = options.publicPath ?? 'public';
    this.frontendUrl = options.frontendUrl;
    }
    async start(){

        //middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));// x-www-form-urlencoded
        this.app.use(cors({ origin: this.frontendUrl, credentials: true }));
        //routes
        this.app.use(this.routes);
        

        // //public folders
        // this.app.use(express.static(this.publicPath));

        //SPA
        // this.app.get('*', (req, res) => {
        //     const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
        //     res.sendFile(indexPath);
        // });

        this.app.use(errorMiddleware)

        this.serverListening = this.app.listen(3000, () => console.log('Server is running on port 3000'));
        // return this.app;
    }

    public close(){ 
        this.serverListening?.close();
    }
}