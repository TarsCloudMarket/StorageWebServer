import { DbManager, tConfig } from "./db";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import TarsLogs from "@tars/logs";
import * as TarsStream from "@tars/stream";

export class Dao {
    protected _logger: TarsLogs = new TarsLogs("TarsRotate");

    private _db: DbManager = new DbManager();

    public async initialize(config: any) {

        this._logger.debug('initialize:', JSON.stringify(config));

        await this._db.initialize(config.dbConf);
    }


    public async getStorageList() {

        return await tConfig.findAll({
            raw: true
        });
    };

    public async addStorage(obj: string, name: string) {

        return await tConfig.create({
            obj: obj,
            name: name,
            create_time: new Date(),
            update_time: new Date()
        });
    };

    public async updateStorage(obj: string, name: string) {

        return await tConfig.update({
            name: name
        }, {
            where: {
                obj: obj
            }
        });
    };

    public async deleteStorage(obj: string) {

        return await tConfig.destroy({
            where: {
                obj: obj
            }
        });
    };
}

