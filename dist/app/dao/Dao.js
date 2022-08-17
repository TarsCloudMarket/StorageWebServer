"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dao = void 0;
const db_1 = require("./db");
const logs_1 = __importDefault(require("@tars/logs"));
class Dao {
    constructor() {
        this._logger = new logs_1.default("TarsRotate");
        this._db = new db_1.DbManager();
    }
    async initialize(config) {
        this._logger.debug('initialize:', JSON.stringify(config));
        await this._db.initialize(config.dbConf);
    }
    async getStorageList() {
        return await db_1.tConfig.findAll({
            raw: true
        });
    }
    ;
    async addStorage(obj, name) {
        return await db_1.tConfig.create({
            obj: obj,
            name: name,
            create_time: new Date(),
            update_time: new Date()
        });
    }
    ;
    async updateStorage(obj, name) {
        return await db_1.tConfig.update({
            name: name
        }, {
            where: {
                obj: obj
            }
        });
    }
    ;
    async deleteStorage(obj) {
        return await db_1.tConfig.destroy({
            where: {
                obj: obj
            }
        });
    }
    ;
}
exports.Dao = Dao;
