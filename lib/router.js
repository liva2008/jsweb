//路由器中间件
import { compose } from "./middleware.js";

export class Router {
    constructor(){
        //处理器数组
        this.handlerware = [];
    }
    
    get(path, handler){
        return this.route('GET', path, handler);
    }

    post(path, handler){
        return this.route('POST', path, handler);
    }

    put(path, handler){
        return this.route('PUT', path, handler);
    }

    delete(path, handler){
        return this.route('DELETE', path, handler);
    }

    options(path, handler){
        return this.route('OPTIONS', path, handler);
    }

    route(method, path, handler) {
        this.handlerware.push(this.generate(method, path, handler));
        return this;
    }

    generate(method, path, handler) {
        return async (ctx, next) => {
            //方法匹配
            if (method.toUpperCase() === ctx.req.method.toUpperCase()) {
                //路径匹配
                const match = this.match(path, ctx.req.pathname);
                if (match) {
                    //调用处理器
                    await handler(ctx);
                    return;
                }
            }
            await next();
        }
    }

    match(re, str) {
        const match = str.match(re);
        if (!match) return;
        return match;
    }

    //router handlerware
    routes() {
        return async (ctx, next) => {
            await next();
            await compose(this.handlerware)(ctx);
        }
    }
}