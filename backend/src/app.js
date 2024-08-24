import 'babel-polyfill';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import * as http from 'http';
import { environments, services } from './core/framework';
import { boot, exit, preBoot, preExit } from './core/boot';
import { config } from './core/config';
import { jsonError, jsonSuccess, logger } from './utils/system';
import { errors } from './utils/constants/message';
import { regulators } from './middleware/regulators';
import * as controllers from './controllers';
import { Limiter } from './core/limitRequest';

(async () => {
    let awaitResult;
    let keys;

    // -- handle signals
    const shutdownProcess = async () => {
        if (!global.isShuttingDown) {
            global.isShuttingDown = true;
            awaitResult = await preExit();
            if (awaitResult && !awaitResult.success) logger.warn(awaitResult);

            awaitResult = await exit();
            if (awaitResult && !awaitResult.success) logger.warn(awaitResult);
            logger.info('All services stopped. Server exited.');
            return process.exit();
        }
    };
    process.on('SIGTERM', () => {
        logger.warn('interrupt signal');
        return shutdownProcess();
    });
    process.on('SIGINT', () => {
        logger.warn('interrupt signal');
        return shutdownProcess();
    });
    process.on('uncaughtException', err => {
        console.log(err);
        logger.error('uncaughtException');
        return shutdownProcess();
    });
    process.on('unhandledRejection', (reason, p) => {
        console.log(reason, p);
        logger.error('unhandledRejection');
        return shutdownProcess();
    });

    // -- load env
    if (!environments || environments.length === 0) {
        logger.error('At least one environment must be set');
        throw jsonError(errors.SYSTEM_ERROR);
    }

    global.env = process.env.NODE_ENV || 'LCL';
    if (environments.indexOf(global.env) < 0) {
        logger.error('Environment not found');
        throw errors.SYSTEM_ERROR;
    }
    try {
        const env = dotenv.parse(fs.readFileSync(path.join(__dirname, `../env/${global.env}.env`)));
        process.env = { ...env, ...process.env };
        logger.info(`Current environment: ${global.env}`);
    } catch (err) {
        logger.error(`File not found: ${env}.env`);
        throw errors.SYSTEM_ERROR;
    }
    global.getEnv = (key, defaultValue) => {
        key = `${global.env}_${key}`;
        if (process.env[key] !== null && process.env[key] !== undefined) {
            return process.env[key];
        }
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        logger.error(key);
        throw errors.ENV_NOT_SET_ERROR;
    };

    logger.verbose('Pre-booting...');
    // -- pre-boot and load models
    awaitResult = await preBoot();
    if (!awaitResult.success) throw awaitResult.error;

    // -- boot the services
    keys = Object.keys(services);
    for (let i = 0; i < keys.length; i++) {
        const s = services[keys[i]];
        if (s.boot) {
            logger.verbose(`${s.name} booting`);
            awaitResult = await s.boot();
            if (awaitResult && !awaitResult.success) throw awaitResult.error;
            logger.verbose(`${s.name} boot completed`);
        }
    }

    // -- run boot after all services had started
    awaitResult = await boot();
    if (!awaitResult.success) throw awaitResult.error;

    // -- create server and apply configs
    const app = express();

    const listener = http.createServer(app);

    app.use((req, res, next) => {
        if (global.isShuttingDown) return res.json(jsonError(errors.SERVER_SHUTTING_DOWN));
        return next();
    });

    /** limit request: 300 request/1minute  */
    app.use(Limiter);
    /** security header with helmet https://helmetjs.github.io/docs/ */
    app.use(helmet());

    if (config.CORS && config.CORS.enabled) {
        const settings = Object.keys(config.CORS.settings).map(key => [key, config.CORS.settings[key]]);
        app.use((_, res, next) => {
            for (let i = 0; i < settings.length; i++) {
                res.header(settings[i][0], settings[i][1]);
            }
            next();
        });
    }

    if (config.session && config.session.enabled) {
        app.use(session(config.session.settings));
    }

    if (config.bodyParser && config.bodyParser.enabled) {
        if (config.bodyParser.settings.urlencoded && config.bodyParser.settings.urlencoded.enabled) {
            app.use(express.urlencoded(config.bodyParser.settings.urlencoded.settings));
        }
        if (config.bodyParser.settings.json && config.bodyParser.settings.json.enabled) {
            app.use(express.json(config.bodyParser.settings.json.settings));
            app.use((err, req, res, next) => {
                if (err instanceof SyntaxError && 'body' in err) {
                    return handleValidationFailResponse(req, res, { message: err.message });
                }
                next();
            });
        }
    }

    // -- apply middleware
    if (regulators && regulators.length) {
        for (let i = 0; i < regulators.length; i++) app.use(regulators[i]);
    }

    // -- load controllers
    Object.keys(controllers).forEach(g => {
        logger.verbose(`Mounting controller group: ${g}`);
        controllers[g].controllers.forEach(c => {
            app.use(`${controllers[g].prefix ? `/${controllers[g].prefix}` : ''}/${c.base || ''}`, c);
        });
    });

    // -- start server
    const port = getEnv('API_PORT');
    const host = getEnv('API_HOST');
    awaitResult = await new Promise((resolve, reject) => {
        listener
            .listen(port, host, err => {
                if (err) return reject(err);
                return resolve(jsonSuccess());
            })
            .on('error', () => {
                reject(jsonError(errors.LISTEN_ERROR));
            });
    });

    if (!awaitResult.success) throw awaitResult.error;

    return { port, host };
})()
    .then(result => {
        logger.info(`Server bootstrapped. Listening at address: http://${result.host}:${result.port}`);
    })
    .catch(err => {
        console.log('ERROR START SERVER: ', err);
        logger.error(err);
        process.exit();
    });
