"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const _ = require('lodash');
// const AdminService = require('../common/AdminService');
const AdminService_1 = __importDefault(require("../app/common/AdminService"));
let ignore = ['/plugins/base/storage/get_locale'];
async function LoginMidware(ctx, next) {
    if (!process.env.TARS_CONFIG) {
        ctx.uid = 'admin';
    }
    else {
        if (ignore.indexOf(ctx.request.path) == -1) {
            let ticket = ctx.paramsObj.ticket || ctx.cookies.get("ticket") || ctx.request.header["x-token"];
            if (!ticket) {
                ctx.makeResObj(403, "no auth", {});
                return;
            }
            let uid = await AdminService_1.default.checkTicket(ticket);
            if (!uid) {
                ctx.makeResObj(403, "no auth", {});
                return;
            }
            ctx.uid = uid;
        }
    }
    await next();
}
exports.default = LoginMidware;
// module.exports = async (ctx, next) => {
// 	console.log(ctx.request.path);
// 	if (ignore.indexOf(ctx.request.path) == -1) {
// 		let ticket = ctx.paramsObj.ticket || ctx.cookies.get("ticket") || ctx.request.header["x-token"];
// 		if (!ticket) {
// 			ctx.makeResObj(403, "no auth", {});
// 			return;
// 		}
// 		let uid = await AdminService.checkTicket(ticket);
// 		if (!uid) {
// 			ctx.makeResObj(403, "no auth", {});
// 			return;
// 		}
// 		ctx.uid = uid;
// 	}
// 	await next();
// };
