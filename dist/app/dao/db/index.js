"use strict";
// import _ from "lodash";
// import fs from 'fs-extra';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tConfig = exports.DbManager = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const t_config_1 = __importDefault(require("./db_storage_config_models/t_config"));
exports.tConfig = t_config_1.default;
class DbManager {
    get sequelize() {
        return this._sequelize;
    }
    async initialize(config) {
        const s = new sequelize_typescript_1.Sequelize("", config.user, config.password, {
            host: config.host,
            port: config.port,
            dialect: "mysql",
            define: {
                charset: config.charset,
            },
            dialectOptions: {
                charset: config.charset
            },
        });
        await s.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`);
        //初始化sequelize
        this._sequelize = new sequelize_typescript_1.Sequelize(config.database, config.user, config.password, {
            host: config.host,
            port: config.port,
            dialect: "mysql",
            define: {
                charset: config.charset,
            },
            dialectOptions: {
                charset: config.charset
            },
            logging(sqlText) {
                console.debug(sqlText);
                // logger.debug(sqlText);
            },
            pool: {
                max: config.pool.max || 10,
                min: config.pool.min || 0,
                idle: config.pool.idle || 10000
            },
            modelPaths: [__dirname + "/" + config.model + "_models"],
            timezone: (() => {
                const timezone = String(0 - new Date().getTimezoneOffset() / 60);
                return "+" + (timezone.length < 2 ? ("0" + timezone) : timezone) + ":00";
            })() //获取当前时区并做转换
        });
        await this._sequelize.authenticate();
        console.log("Connection has been established successfully.");
        await this._sequelize.sync({ alter: true });
    }
}
exports.DbManager = DbManager;
