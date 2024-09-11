import express from 'express';
import path from 'path';

type ServerOptions = {
    port: number,
    publicPath?: string
}

export class Server {

    private app = express();
    private readonly port : number;
    private readonly publicPath : string;
    constructor(options : ServerOptions) {
    this.port = options.port
    this.publicPath = options.publicPath ?? 'public';
    }
    async start(){

        this.app.use(express.static(this.publicPath));

        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname + `../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        });

        this.app.listen(3000, () => console.log('Server is running on port 3000'));
        // return this.app;
    }
}