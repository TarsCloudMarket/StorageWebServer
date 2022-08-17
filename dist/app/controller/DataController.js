"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("../common/rpc");
const stream_1 = __importDefault(require("@tars/stream"));
const AdminService_1 = __importDefault(require("../common/AdminService"));
class DataController {
    static async hasRead(obj, uid) {
        let v = obj.split(".");
        return await AdminService_1.default.hasDevAuth(v[0], v[1], uid);
    }
    static async hasWrite(obj, uid) {
        let v = obj.split(".");
        return await AdminService_1.default.hasOpeAuth(v[0], v[1], uid);
    }
    static async listTable(ctx) {
        let { obj } = ctx.paramsObj;
        let options = new rpc_1.rpcClient.StorageProxy.Options();
        options.leader = true;
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).listTable(options);
        ctx.makeResObj(200, "", rst.response.arguments.tables.toObject());
    }
    static async listQueue(ctx) {
        let { obj } = ctx.paramsObj;
        let options = new rpc_1.rpcClient.StorageProxy.Options();
        options.leader = true;
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).listQueue(options);
        ctx.makeResObj(200, "", rst.response.arguments.queues.toObject());
    }
    static async createData(ctx) {
        let { obj, type, name } = ctx.paramsObj;
        if (await this.hasRead(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let rst;
        if (type == "table") {
            rst = await rpc_1.rpcClient.getStoragePrx(obj).createTable(name);
        }
        else {
            rst = await rpc_1.rpcClient.getStoragePrx(obj).createQueue(name);
        }
        if (rst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
    static async listTableData(ctx) {
        let { obj, table, mkey = "", ukey = "", forward = true, include = false, limit = 50, over = false } = ctx.paramsObj;
        if (await this.hasRead(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let options = new rpc_1.rpcClient.StorageProxy.Options();
        options.leader = true;
        let req = new rpc_1.rpcClient.StorageProxy.PageReq();
        req.skey.table = table;
        req.skey.mkey = mkey;
        req.skey.ukey = ukey;
        req.forward = forward;
        req.limit = limit;
        req.include = include;
        req.over = over;
        // console.log(req.toObject());
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).trans(options, req);
        ctx.makeResObj(200, "", rst.response.arguments.data.toObject());
    }
    static async listQueueData(ctx) {
        let { obj, queue, index = "", forward = true, limit = 50, include = false } = ctx.paramsObj;
        if (await this.hasRead(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let options = new rpc_1.rpcClient.StorageProxy.Options();
        options.leader = true;
        let req = new rpc_1.rpcClient.StorageProxy.QueuePageReq();
        req.queue = queue;
        req.forward = forward;
        req.limit = limit;
        req.index = "" + index;
        req.include = include;
        console.log(req.toObject());
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).transQueue(options, req);
        ctx.makeResObj(200, "", rst.response.arguments.data.toObject());
    }
    static async editQueueData(ctx) {
        let { obj, queue, data } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let options = new rpc_1.rpcClient.StorageProxy.Options();
        options.leader = true;
        let list = new stream_1.default.List(rpc_1.rpcClient.StorageProxy.QueueRsp);
        let value = new rpc_1.rpcClient.StorageProxy.QueueRsp();
        value.queue = queue;
        value.index = data.index;
        value.expireTime = data.expireTime;
        value.data.writeString(data.data);
        list.push(value);
        let urst = await rpc_1.rpcClient.getStoragePrx(obj).setQueueData(list);
        if (urst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
    static async editTableData(ctx) {
        let { obj, table, data } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let req = new rpc_1.rpcClient.StorageProxy.StorageKey();
        req.table = table;
        req.mkey = data.mkey;
        req.ukey = data.ukey;
        let options = new rpc_1.rpcClient.StorageProxy.Options();
        options.leader = true;
        let value = new rpc_1.rpcClient.StorageProxy.StorageData();
        value.skey = req;
        value.svalue.version = data.version;
        value.svalue.expireTime = parseInt(data.expireTime);
        value.svalue.timestamp = parseInt(data.timestamp);
        value.svalue.data.writeString(data.data);
        // console.log(value.svalue.toObject());
        let urst = await rpc_1.rpcClient.getStoragePrx(obj).set(value);
        if (urst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
    static async addQueueData(ctx) {
        let { obj, queue, data } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let pushList = new stream_1.default.List(rpc_1.rpcClient.StorageProxy.QueuePushReq);
        let pushReq = new rpc_1.rpcClient.StorageProxy.QueuePushReq();
        pushReq.queue = queue;
        pushReq.back = data.back;
        pushReq.expireTime = data.expireTime;
        pushReq.data.writeString(data.data);
        pushList.push(pushReq);
        let urst = await rpc_1.rpcClient.getStoragePrx(obj).push_queue(pushList);
        if (urst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
    static async addTableData(ctx) {
        let { obj, table, data } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let req = new rpc_1.rpcClient.StorageProxy.StorageKey();
        req.table = table;
        req.mkey = data.mkey;
        req.ukey = data.ukey;
        let options = new rpc_1.rpcClient.StorageProxy.Options();
        options.leader = true;
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).get(options, req);
        if (rst.response.return == rpc_1.rpcClient.StorageProxy.STORAGE_RT.S_OK) {
            ctx.makeResObj(500, "#storage.data.exists#", {});
            return;
        }
        // console.log(rst.response.return);
        if (rst.response.return != rpc_1.rpcClient.StorageProxy.STORAGE_RT.S_NO_DATA) {
            ctx.makeErrResObj();
            return;
        }
        let value = new rpc_1.rpcClient.StorageProxy.StorageData();
        value.skey = req;
        value.svalue.version = data.version;
        value.svalue.expireTime = parseInt(data.expireTime);
        value.svalue.timestamp = data.timestamp;
        value.svalue.data.writeString(data.data);
        let urst = await rpc_1.rpcClient.getStoragePrx(obj).set(value);
        if (urst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
    static async deleteTableData(ctx) {
        let { obj, table, mkey = "", ukey = "" } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let req = new rpc_1.rpcClient.StorageProxy.StorageKey();
        req.table = table;
        req.mkey = mkey;
        req.ukey = ukey;
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).del(req);
        if (rst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
    static async deleteTable(ctx) {
        let { obj, table } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        // console.log(obj, table);
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).deleteTable(table);
        if (rst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
    static async deleteQueue(ctx) {
        let { obj, queue } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).deleteQueue(queue);
        if (rst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
    static async deleteQueueData(ctx) {
        let { obj, queue, index } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let req = new rpc_1.rpcClient.StorageProxy.QueueIndex();
        req.queue = queue;
        req.index = index;
        let list = new stream_1.default.List(rpc_1.rpcClient.StorageProxy.QueueIndex);
        list.push(req);
        let rst = await rpc_1.rpcClient.getStoragePrx(obj).deleteQueueData(list);
        if (rst.response.return != 0) {
            ctx.makeErrResObj();
        }
        else {
            ctx.makeResObj(200, "", {});
        }
    }
}
exports.default = DataController;
