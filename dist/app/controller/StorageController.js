"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StorageService_1 = __importDefault(require("../service/StorageService"));
const AdminService_1 = __importDefault(require("../common/AdminService"));
class StorageController {
    static async initialize(config) {
        await this._service.initialize(config);
    }
    static async list(ctx) {
        let rst = await this._service.getStorageList();
        let data = [];
        for (let i = 0; i < rst.length; i++) {
            let v = rst[i].obj.split(".");
            if (await AdminService_1.default.hasDevAuth(v[0], v[1], ctx.uid)) {
                data.push(rst[i]);
            }
        }
        ctx.makeResObj(200, "", data);
    }
    static async add(ctx) {
        if (!await AdminService_1.default.hasAdminAuth(ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        await this._service.addStorage(ctx.paramsObj.obj, ctx.paramsObj.name);
        ctx.makeResObj(200, "", {});
    }
    static async del(ctx) {
        if (!await AdminService_1.default.hasAdminAuth(ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        await this._service.deleteStorage(ctx.paramsObj.obj);
        ctx.makeResObj(200, "", {});
    }
}
exports.default = StorageController;
StorageController._service = new StorageService_1.default();
