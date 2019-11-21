import logger from '../../common-service/src/logger/loggerFactory';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import * as path from 'path';
import { PassportAuthenticator, Server } from 'typescript-rest';

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
     * Start the server
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
        this.configureAuthenticator();
    }

    private configureAuthenticator() {
        const JWT_SECRET: string = process.env.JWT_SECRET;
        const jwtConfig: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(JWT_SECRET)
        };
        const strategy = new Strategy(jwtConfig, (payload: any, done: (err: any, user: any) => void) => {
            done(null, payload);
        });
        const authenticator = new PassportAuthenticator(strategy, {
            deserializeUser: (user: string) => JSON.parse(user),
            serializeUser: (user: any) => {
                return JSON.stringify(user);
            }
        });
        Server.registerAuthenticator(authenticator);
        Server.registerAuthenticator(authenticator, 'secondAuthenticator');
    }
}
