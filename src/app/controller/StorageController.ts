import * as path from "path";
import Koa from "koa";
import StorageService from "../service/StorageService";
import AdminService from "../common/AdminService";
export default class StorageController {

    private static _service: StorageService = new StorageService();

    public static async initialize(config: any) {

        await this._service.initialize(config);
    }

    public static async list(ctx: Koa.Context) {

        let rst = await this._service.getStorageList();

        let data = [];
        for (let i = 0; i < rst.length; i++) {

            let v = rst[i].obj.split(".");

            if (await AdminService.hasDevAuth(v[0], v[1], ctx.uid)) {

                data.push(rst[i]);
            }
        }

        ctx.makeResObj(200, "", data);
    }

    public static async add(ctx: Koa.Context) {

        if (!await AdminService.hasAdminAuth(ctx.uid)) {

            ctx.makeNotAuthResObj();
            return;
        }

        await this._service.addStorage(ctx.paramsObj.obj, ctx.paramsObj.name);

        ctx.makeResObj(200, "", {});
    }

    public static async del(ctx: Koa.Context) {
        if (!await AdminService.hasAdminAuth(ctx.uid)) {

            ctx.makeNotAuthResObj();
            return;
        }

        await this._service.deleteStorage(ctx.paramsObj.obj);

        ctx.makeResObj(200, "", {});
    }
}
