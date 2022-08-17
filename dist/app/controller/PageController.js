"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageController {
    static async index(ctx) {
        // console.log("index", ctx);
        await ctx.redirect("/index.html");
    }
}
exports.default = PageController;
