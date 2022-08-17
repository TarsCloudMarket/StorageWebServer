"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = exports.pageRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const index_1 = require("../app/index");
const noCacheMidware_1 = __importDefault(require("./noCacheMidware"));
const paramsMidware_1 = require("./paramsMidware");
const loginMidware_1 = __importDefault(require("./loginMidware"));
//获取路由
const getRouter = (prefix, router, routerConf) => {
    routerConf.forEach(function (conf) {
        try {
            const [method, url, obj, controller, checkRule, validParams] = conf;
            //前置参数合并校验相关中间件
            router.register(prefix + url, [method], [paramsMidware_1.paramsDealMidware(validParams), paramsMidware_1.paramsCheckMidware(checkRule), noCacheMidware_1.default, loginMidware_1.default, async (ctx, next) => {
                    await controller.call(obj, ctx);
                    await next();
                }]);
            // console.log(v);
        }
        catch (e) {
            console.log(e);
        }
    });
};
//页面类型路由
const pageRouter = new koa_router_1.default();
exports.pageRouter = pageRouter;
getRouter("/", pageRouter, index_1.pageConf);
const apiRouter = new koa_router_1.default();
exports.apiRouter = apiRouter;
getRouter("/plugins/base/storage", apiRouter, index_1.apiConf);
