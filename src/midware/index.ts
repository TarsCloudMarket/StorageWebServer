import * as Koa from "koa";
import Router from "koa-router";
import { confType } from "./type";

import { pageConf, apiConf } from "../app/index";

import noCacheMidware from "./noCacheMidware";
import { paramsDealMidware, paramsCheckMidware } from "./paramsMidware";
import loginMidware from "./loginMidware";

//获取路由
const getRouter = (prefix: string, router: Router, routerConf: any[]) => {
    routerConf.forEach(function (conf: confType) {
        try {
            const [method, url, obj, controller, checkRule, validParams] = conf;

            //前置参数合并校验相关中间件
            router.register(prefix + url, [method], [paramsDealMidware(validParams), paramsCheckMidware(checkRule), noCacheMidware, loginMidware, async (ctx: Koa.Context, next: Koa.Next) => {

                await controller.call(obj, ctx);
                await next();
            }]);

            // console.log(v);
        } catch (e) {
            console.log(e);
        }

    });
};

//页面类型路由
const pageRouter = new Router();
getRouter("/", pageRouter, pageConf);

const apiRouter = new Router();
getRouter("/plugins/base/storage", apiRouter, apiConf);


export { pageRouter, apiRouter };