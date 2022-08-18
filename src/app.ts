import Koa from "koa";
import * as path from "path";
import bodyparser from "koa-bodyparser";
// import staticRouter from "koa-static";
import { Serve } from "static-koa-router";
import KoaRouter from "koa-router";

import { pageRouter, apiRouter } from "./midware";
import { Config } from '@tars/utils';
import webConf from './config/webConf';
import localeMidware from "./midware/localeMidware";
import AdminService from "./app/common/AdminService";
import StorageController from "./app/controller/StorageController";
const app = new Koa();

//信任proxy头部，支持 X-Forwarded-Host
app.proxy = true;

// error handler
// onerror(app);

const appInitialize = async () => {

    await registerPlugin();

    StorageController.initialize(webConf.config);

    app.use(async (ctx: Koa.Context, next) => {
        // console.log(ctx);

        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
        ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        if (ctx.method == 'OPTIONS') {
            ctx.body = 200;
        } else {
            await next();
        }
    });

    app.use(bodyparser());

    //国际化多语言中间件
    app.use(localeMidware);

    // app.use(staticRouter(path.join(__dirname, "../client/dist"), { maxage: 7 * 24 * 60 * 60 * 1000 }));
    app.use(pageRouter.routes());
    app.use(apiRouter.routes());

    //注意这里路由前缀一样的, 接口处理以后不要next, 否则匹配到静态路由了
    const staticRouter = new KoaRouter({
        prefix: webConf.config.path
    });

    Serve(path.join(__dirname, '../client/dist'), staticRouter);

    app.use(staticRouter.routes());
};


const registerPlugin = async () => {

    if (process.env.TARS_CONFIG) {

        let config = new Config();

        config.parseFile(process.env.TARS_CONFIG);

        try {
            const rst = await AdminService.registerPlugin("存储管理平台", "StorageWeb", config.get("tars.application.server.app") + "." + config.get("tars.application.server.server") + ".WebObj", 1, webConf.config.path);

            console.log("registerPlugin", rst);
        } catch (e) {
            console.log("registerPlugin:", e.message);
        }

    } else {

        try {
            const rst = await AdminService.registerPlugin("存储管理平台", "StorageWeb", "Base.StorageWebServer.WebObj", 1, webConf.config.path);

            console.log("registerPlugin", rst);
        } catch (e) {
            console.log("registerPlugin error:", e.message);
        }
    }

};

export { app, appInitialize };