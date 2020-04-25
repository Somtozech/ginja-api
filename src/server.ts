/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Module dependencies.
 */

/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

import compression from 'compression';
import graphServer from './graphql';
// Middlewares
import handleErrors from './core/middlewares/handleErrors';

// websocket connection
import validateWebSocketToken from './core/middlewares/validateWebSocketToken';

import setUserStatus from './core/utils/userStatus';

const app = express();

// Resolve CORS
app.use(cors());
app.options('*', cors()); // TODO: sort out CORS issues Fidelis mentioned

// view engine setup
app.set('views', path.join('./', './views'));
app.engine('html', require('ejs').renderFile);

app.use(compression());
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('./', './public')));

// Get Request URL
app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
    res.locals.getFullUrl = (): string => `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    return next();
});

// v1 API Routes
app.get('/health', (req: express.Request, res: express.Response): void => {
    res.sendStatus(200);
});

// error handler
app.use(handleErrors);

// handle 404 errors
app.use((req: express.Request, res: express.Response, _next: express.NextFunction): void => {
    res.status(404).send({
        status: false,
        message: 'resource not found',
        data: null,
        path: req.url
    });
});

// handle unexpected errors
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction): void => {
    // set locals, only providing error in development
    res.locals.message = err.message;

    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const options = {
    port: process.env.SERVER_GQL_PORT || 9700,
    endpoint: '/api',
    subscriptions: {
        path: '/subscriptions',
        onConnect: async (connectionParams: any, websocket: any) => {
            if (connectionParams.Authorization) {
                try {
                    const user = await validateWebSocketToken(connectionParams.Authorization);

                    setUserStatus(user, true);
                    return {
                        user
                    };
                } catch (err) {
                    console.log(err);
                }

            }

            // throw new Error('Missing auth token!');
        },
        onDisconnect: async (parent: any, context: any) => {
            console.log('disconnecting...');
            const { user } = await context.initPromise;
            if (user) {
                setUserStatus(user, false);
            }
        }
    },
    playground: '/playground'
};

graphServer.start(options, (param: any) => {
    const { port } = param;
    console.log(`Server started, listening on port ${port} for incoming requests.`);
});
