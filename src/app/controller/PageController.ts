
import * as Koa from "koa";
export default class PageController {

    public static async index(ctx: Koa.Context) {

        console.log("index", ctx);
        await ctx.redirect("/index.html");
    }
}
