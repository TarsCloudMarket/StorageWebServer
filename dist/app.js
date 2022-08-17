"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appInitialize = exports.app = void 0;
const koa_1 = __importDefault(require("koa"));
const path = __importStar(require("path"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_static_1 = __importDefault(require("koa-static"));
const midware_1 = require("./midware");
const utils_1 = require("@tars/utils");
const webConf_1 = __importDefault(require("./config/webConf"));
const localeMidware_1 = __importDefault(require("./midware/localeMidware"));
const AdminService_1 = __importDefault(require("./app/common/AdminService"));
const StorageController_1 = __importDefault(require("./app/controller/StorageController"));
const app = new koa_1.default();
exports.app = app;
//信任proxy头部，支持 X-Forwarded-Host
app.proxy = true;
// error handler
// onerror(app);
const appInitialize = async () => {
    await registerPlugin();
    StorageController_1.default.initialize(webConf_1.default.config);
    app.use(async (ctx, next) => {
        // console.log(ctx);
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
        ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        if (ctx.method == 'OPTIONS') {
            ctx.body = 200;
        }
        else {
            await next();
        }
    });
    app.use(koa_bodyparser_1.default());
    //国际化多语言中间件
    app.use(localeMidware_1.default);
    app.use(koa_static_1.default(path.join(__dirname, "../client/dist"), { maxage: 7 * 24 * 60 * 60 * 1000 }));
    app.use(midware_1.pageRouter.routes());
    app.use(midware_1.apiRouter.routes());
};
exports.appInitialize = appInitialize;
const registerPlugin = async () => {
    if (process.env.TARS_CONFIG) {
        let config = new utils_1.Configure();
        config.parseFile(process.env.TARS_CONFIG);
        try {
            const rst = await AdminService_1.default.registerPlugin("存储管理平台", "StorageWeb", config.get("tars.application.server.app") + "." + config.get("tars.application.server.server") + ".WebObj", 1, webConf_1.default.config.path);
            console.log("registerPlugin", rst);
        }
        catch (e) {
            console.log("registerPlugin:", e.message);
        }
    }
    else {
        try {
            const rst = await AdminService_1.default.registerPlugin("存储管理平台", "StorageWeb", "Base.StorageWebServer.WebObj", 1, webConf_1.default.config.path);
            console.log("registerPlugin", rst);
        }
        catch (e) {
            console.log("registerPlugin error:", e.message);
        }
    }
};
