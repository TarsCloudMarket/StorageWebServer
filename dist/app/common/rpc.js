"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpcClient = void 0;
const rpc_1 = require("@tars/rpc");
const StorageProxy_1 = require("./protocol/StorageProxy");
const AdminRegProxy_1 = require("./protocol/AdminRegProxy");
if (!process.env.TARS_CONFIG) {
    rpc_1.client.setProperty("locator", "tars.tarsregistry.QueryObj@tcp -h 127.0.0.1 -p 17890");
}
//tars环境自动寻址,非tars写死
let servant = "";
//本地启动读取配置
if (!process.env.TARS_CONFIG) {
    servant = "@tcp -h 42.193.249.129 -p 8080 -t 60000";
}
class rpcClient {
    static getStoragePrx(obj) {
        if (!this.storagePrx.has(obj)) {
            this.storagePrx.set(obj, rpc_1.client.stringToProxy(this.StorageProxy.StorageProxy, obj + servant));
        }
        return this.storagePrx.get(obj);
    }
    static getAdminRegPrx() {
        if (!this.adminRegPrx) {
            this.adminRegPrx = rpc_1.client.stringToProxy(AdminRegProxy_1.tars.AdminRegProxy, "tars.tarsAdminRegistry.AdminRegObj" + servant);
        }
        return this.adminRegPrx;
    }
}
exports.rpcClient = rpcClient;
rpcClient.StorageProxy = StorageProxy_1.Base;
rpcClient.AdminRegProxy = AdminRegProxy_1.tars;
rpcClient.storagePrx = new Map();
