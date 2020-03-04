import logger from '../../mongodb-service/src/logger/loggerFactory';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import * as path from 'path';
import { Server } from 'typescript-rest';

/**
 * Represents the API. It's responsible for defining the server's properties, initialising the
 * swagger for the microservice, initialising dependencies and managing its starting and stopping. 
 */
export class ApiServer {
    public PORT: number = +process.env.PORT || 5020;

    private readonly app: express.Application;
    private server: http.Server = null;

    constructor() {
        this.app = express();
        this.config();

        Server.useIoC();

        Server.loadServices(this.app, 'controllers/*', __dirname);
        Server.swagger(this.app, { filePath: './dist/swagger.json', endpoint: "es/swagger" });
    }

    /**
     * Start the server.
     */
    public async start() {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: any) => {
                if (err) {
                    return reject(err);
                }

                logger.info(`Listening to http://localhost:${this.PORT}`);

                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public async stop(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

    /**
     * Configure the express app.
     */
    private config(): void {
        // Native Express configuration
        this.app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
        this.app.use(cors());
        this.app.use(morgan('combined'));
    }
}
