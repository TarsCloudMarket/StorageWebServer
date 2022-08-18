import * as path from "path";
import { rpcClient } from "../common/rpc";
import Koa from "koa";
import TarsStream from "@tars/stream";
import AdminService from "../common/AdminService";
import logger from "../logger";

export default class DataController {

    public static async hasRead(obj: string, uid: string) {
        let v = obj.split(".");

        logger.debug(`has read, obj: ${obj}, uid: ${uid}`);

        return await AdminService.hasDevAuth(v[0], v[1], uid);
    }

    public static async hasWrite(obj: string, uid: string) {
        let v = obj.split(".");
        logger.debug(`has write, obj: ${obj}, uid: ${uid}`);

        return await AdminService.hasOpeAuth(v[0], v[1], uid);
    }

    public static async listTable(ctx: Koa.Context) {

        let { obj } = ctx.paramsObj;

        let options = new rpcClient.StorageProxy.Options();
        options.leader = true;

        try {
            let rst = await rpcClient.getStoragePrx(obj).listTable(options);

            ctx.makeResObj(200, "", rst.response.arguments.tables.toObject());
        }
        catch (e) {
            logger.error(`list table error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }


    public static async listQueue(ctx: Koa.Context) {

        let { obj } = ctx.paramsObj;

        let options = new rpcClient.StorageProxy.Options();
        options.leader = true;

        try {
            let rst = await rpcClient.getStoragePrx(obj).listQueue(options);

            ctx.makeResObj(200, "", rst.response.arguments.queues.toObject());
        }
        catch (e) {
            logger.error(`list queue error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

    public static async createData(ctx: Koa.Context) {

        let { obj, type, name } = ctx.paramsObj;

        if (await this.hasRead(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }

        try {
            let rst;

            if (type == "table") {
                rst = await rpcClient.getStoragePrx(obj).createTable(name);
            } else {
                rst = await rpcClient.getStoragePrx(obj).createQueue(name);
            }

            if (rst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }

        }
        catch (e) {
            logger.error(`create storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

    public static async listTableData(ctx: Koa.Context) {

        let { obj, table, mkey = "", ukey = "", forward = true, include = false, limit = 50, over = false } = ctx.paramsObj;

        if (await this.hasRead(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }

        let options = new rpcClient.StorageProxy.Options();
        options.leader = true;

        let req = new rpcClient.StorageProxy.PageReq();
        req.skey.table = table;
        req.skey.mkey = mkey;
        req.skey.ukey = ukey;
        req.forward = forward;
        req.limit = limit;
        req.include = include;
        req.over = over;

        // console.log(req.toObject());

        try {
            let rst = await rpcClient.getStoragePrx(obj).trans(options, req);

            ctx.makeResObj(200, "", rst.response.arguments.data.toObject());

        }
        catch (e) {
            logger.error(`trans table storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }


    public static async listQueueData(ctx: Koa.Context) {

        let { obj, queue, index = "", forward = true, limit = 50, include = false } = ctx.paramsObj;
        if (await this.hasRead(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }

        let options = new rpcClient.StorageProxy.Options();
        options.leader = true;

        let req = new rpcClient.StorageProxy.QueuePageReq();
        req.queue = queue;
        req.forward = forward;
        req.limit = limit;
        req.index = "" + index;
        req.include = include;

        // console.log(req.toObject());

        try {
            let rst = await rpcClient.getStoragePrx(obj).transQueue(options, req);

            ctx.makeResObj(200, "", rst.response.arguments.data.toObject());

        }
        catch (e) {
            logger.error(`trans queue storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

    public static async editQueueData(ctx: Koa.Context) {

        let { obj, queue, data } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }

        let options = new rpcClient.StorageProxy.Options();
        options.leader = true;

        let list = new TarsStream.List(rpcClient.StorageProxy.QueueRsp);

        let value = new rpcClient.StorageProxy.QueueRsp();
        value.queue = queue;
        value.index = data.index;
        value.expireTime = data.expireTime;
        value.data.writeString(data.data);

        list.push(value);

        try {
            let urst = await rpcClient.getStoragePrx(obj).setQueueData(list);

            if (urst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }


        }
        catch (e) {
            logger.error(`set queue data storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

    public static async editTableData(ctx: Koa.Context) {
        let { obj, table, data } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let req = new rpcClient.StorageProxy.StorageKey();
        req.table = table;
        req.mkey = data.mkey;
        req.ukey = data.ukey;

        let options = new rpcClient.StorageProxy.Options();
        options.leader = true;

        let value = new rpcClient.StorageProxy.StorageData();
        value.skey = req;
        value.svalue.version = data.version;
        value.svalue.expireTime = parseInt(data.expireTime);
        value.svalue.timestamp = parseInt(data.timestamp);
        value.svalue.data.writeString(data.data);

        // console.log(value.svalue.toObject());

        try {
            let urst = await rpcClient.getStoragePrx(obj).set(value);

            if (urst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }

        }
        catch (e) {
            logger.error(`set storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

    public static async addQueueData(ctx: Koa.Context) {
        let { obj, queue, data } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let pushList = new TarsStream.List(rpcClient.StorageProxy.QueuePushReq);

        let pushReq = new rpcClient.StorageProxy.QueuePushReq();
        pushReq.queue = queue;
        pushReq.back = data.back;
        pushReq.expireTime = data.expireTime;
        pushReq.data.writeString(data.data);

        pushList.push(pushReq);

        try {
            let urst = await rpcClient.getStoragePrx(obj).push_queue(pushList);

            if (urst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }

        }
        catch (e) {
            logger.error(`push queue storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }


    public static async addTableData(ctx: Koa.Context) {
        let { obj, table, data } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let req = new rpcClient.StorageProxy.StorageKey();
        req.table = table;
        req.mkey = data.mkey;
        req.ukey = data.ukey;

        let options = new rpcClient.StorageProxy.Options();
        options.leader = true;

        try {
            let rst = await rpcClient.getStoragePrx(obj).get(options, req);

            if (rst.response.return == rpcClient.StorageProxy.STORAGE_RT.S_OK) {
                ctx.makeResObj(500, "#storage.data.exists#", {});
                return;
            }

            // console.log(rst.response.return);
            if (rst.response.return != rpcClient.StorageProxy.STORAGE_RT.S_NO_DATA) {
                ctx.makeErrResObj();
                return;
            }


        }
        catch (e) {
            logger.error(`get storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }

        let value = new rpcClient.StorageProxy.StorageData();
        value.skey = req;
        value.svalue.version = data.version;
        value.svalue.expireTime = parseInt(data.expireTime);
        value.svalue.timestamp = data.timestamp;

        value.svalue.data.writeString(data.data);

        try {
            let urst = await rpcClient.getStoragePrx(obj).set(value);

            if (urst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }

        }
        catch (e) {
            logger.error(`set storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

    public static async deleteTableData(ctx: Koa.Context) {
        let { obj, table, mkey = "", ukey = "" } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let req = new rpcClient.StorageProxy.StorageKey();
        req.table = table;
        req.mkey = mkey;
        req.ukey = ukey;
        try {
            let rst = await rpcClient.getStoragePrx(obj).del(req);

            if (rst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }

        }
        catch (e) {
            logger.error(`del storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

    public static async deleteTable(ctx: Koa.Context) {
        let { obj, table } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        // console.log(obj, table);

        try {
            let rst = await rpcClient.getStoragePrx(obj).deleteTable(table);

            if (rst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }

        }
        catch (e) {
            logger.error(`delete table storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }


    public static async deleteQueue(ctx: Koa.Context) {
        let { obj, queue } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }

        try {
            let rst = await rpcClient.getStoragePrx(obj).deleteQueue(queue);

            if (rst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }

        }
        catch (e) {
            logger.error(`delete queue storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

    public static async deleteQueueData(ctx: Koa.Context) {
        let { obj, queue, index } = ctx.paramsObj;
        if (await this.hasWrite(obj, ctx.uid)) {
            ctx.makeNotAuthResObj();
            return;
        }
        let req = new rpcClient.StorageProxy.QueueIndex();
        req.queue = queue;
        req.index = index;

        let list = new TarsStream.List(rpcClient.StorageProxy.QueueIndex);
        list.push(req);

        try {
            let rst = await rpcClient.getStoragePrx(obj).deleteQueueData(list);

            if (rst.response.return != 0) {
                ctx.makeErrResObj();
            } else {
                ctx.makeResObj(200, "", {});
            }

        }
        catch (e) {
            logger.error(`delete queue data storege error, obj: ${obj}`);
            ctx.makeResObj(500, "#storage.error#", {});
        }
    }

}
