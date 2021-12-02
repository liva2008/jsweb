import { compose } from "./middleware.js";

export class Router {
    constructor(){
        this.middleware = [];
    }
    
    get(path, handler){
        return this.route('GET', path, handler);
    }

    post(path, handler){
        return this.route('POST', path, handler);
    }

    options(path, handler){
        return this.route('OPTIONS', path, handler);
    }


    route(method, path, handler) {
        this.middleware.push(this.generate(method, path, handler));
        return this;
    }

    generate(method, path, handler) {
        return async (ctx, next) => {
            if (method.toUpperCase() === ctx.req.method.toUpperCase()) {
                const match = this.match(path, ctx.req.pathname);
                if (match) {
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

    //router middleware
    routes() {
        return async (ctx, next) => {
            await next();
            await compose(this.middleware)(ctx);
        }
    }
}