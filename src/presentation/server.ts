import express, { Router } from 'express';
import path from 'path';

type ServerOptions = {
    port: number,
    routes : Router,
    publicPath?: string
}

export class Server {

    public readonly app = express();
    private serverListening? : any;
    private readonly port : number;
    private readonly publicPath : string;
    private readonly routes: Router;

    constructor(options : ServerOptions) {
    this.port = options.port
    this.routes = options.routes;
    this.publicPath = options.publicPath ?? 'public';
    }
    async start(){

        //middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));// x-www-form-urlencoded

        //routes
        this.app.use(this.routes);

        // //public folders
        // this.app.use(express.static(this.publicPath));

        //SPA
        // this.app.get('*', (req, res) => {
        //     const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
        //     res.sendFile(indexPath);
        // });

        this.serverListening = this.app.listen(3000, () => console.log('Server is running on port 3000'));
        // return this.app;
    }

    public close(){ 
        this.serverListening?.close();
    }
}