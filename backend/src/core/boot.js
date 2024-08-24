import path from 'path';
import Sequelize from 'sequelize';
import { exec } from 'child_process';
import { jsonError, jsonSuccess, logger } from '../utils/system';
import { errors } from '../utils/constants/message';
import { schemas } from './framework';

let sequelize;
const textAttrs = [];
const preBoot = async () => {
    // -- this boot runs before any services' boot, we can connect database here

    logger.verbose('Creating database if not existed...');
    // -- create database in mysql if not existed
    await new Promise(resolve => {
        exec(
            `sequelize --config=${path.join(__dirname, '../models/config.js')} --models-path=${path.join(
                __dirname,
                '../models/schema'
            )} --migrations-path=${path.join(__dirname, '../models/migrations')} db:create --env=${
                global.env
            } --charset=utf8 --collate=utf8_unicode_ci`,
            { env: process.env },
            err => {
                if (err) {
                    logger.verbose(err);
                }
                return resolve();
            }
        );
    });
    logger.verbose('Database OK');

    logger.verbose('Connecting to mysql...');
    const mysqlResult = await new Promise(resolve => {
        const sequelizeConfig = require(path.join(__dirname, '../models/config.js'))[global.env];
        sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
            ...sequelizeConfig, // operatorsAliases: Sequelize.Op,
            dialectOptions: { decimalNumbers: true }
        });
        sequelize.authenticate().then(err => {
            if (err) {
                logger.error('Mysql connection error', err);
                return resolve(jsonError(errors.SYSTEM_ERROR));
            }
            return resolve(jsonSuccess(sequelize));
        });
    });
    if (!mysqlResult.success) return mysqlResult;
    logger.verbose('Connected to mysql');

    sequelize = mysqlResult.result;
    // -- run sql migration
    await new Promise((resolve, reject) => {
        logger.verbose('Migrating database...');
        exec(
            `sequelize --config=${path.join(__dirname, '../models/config.js')} --models-path=${path.join(
                __dirname,
                '../models/schema'
            )} --migrations-path=${path.join(__dirname, '../models/migrations')} db:migrate --env=${global.env}`,
            { env: process.env },
            err => {
                if (err) {
                    console.log(err);
                    return reject();
                }
                logger.verbose('Database migration succeeded');
                return resolve();
            }
        );
    });

    // -- load models
    const sequelizeModels = {};
    logger.verbose('Loading models...');
    let keys = Object.keys(schemas);
    for (let i = 0; i < keys.length; i++) {
        logger.verbose(`Loading schema ${keys[i]}...`);
        // -- in reality we either use mongo or sequelize, not both, do we don't check
        // the function name
        const schema = schemas[keys[i]];
        if (!schema) {
            logger.error(`Cannot load ${keys[i]}, please make sure you include the schema in framework`);
            return jsonError(errors.SYSTEM_ERROR);
        }

        let model;
        switch (schema.name) {
            case 's':
                model = schema(mysqlResult.result, Sequelize);
                sequelizeModels[model.name] = model;
                break;
        }
    }

    keys = Object.keys(sequelizeModels);
    for (let i = 0; i < keys.length; i++) {
        logger.verbose(`Associating model ${keys[i]}...`);
        if (sequelizeModels[keys[i]].associate) {
            sequelizeModels[keys[i]].associate(sequelizeModels);
        }
    }

    return jsonSuccess();
};
const boot = async () =>
    // -- this boot runs after all services had successfully booted
    jsonSuccess();
const preExit = async () =>
    // -- this exit runs before any services' exit
    jsonSuccess();
const exit = async () =>
    // -- this exit runs after all services had exited
    jsonSuccess();
export { preBoot, boot, preExit, exit, sequelize, textAttrs };
