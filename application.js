//引用HTTP库
//import { serve } from "https://deno.land/std@0.116.0/http/server.ts";
//import http from 'http';

import {
    Context
} from "./context.js";
import {
    compose
} from "./middleware.js";

export class Application {

    constructor(platform = 'deno') {
        this.platform = platform;
        this.middleware = [];
    }

    async listen(hostname = '127.0.0.1', port = 5000) {
        if (this.platform == 'deno') {
            this.listen1(`${hostname}:${port}`);
        } else {
            this.listen2(hostname, port);
        }
    }

    async listen1(addr = "127.0.0.1:5000") {
        let {
            serve
        } = await import("https://deno.land/std@0.116.0/http/server.ts");
        //连接处理器
        const handler = async (request) => {
            //console.log(this.middleware);
            const ctx = new Context(this, request);
            let url = new URL(ctx.req.url);
            ctx.req.pathname = url.pathname;
            if (ctx.req.method === 'POST') {
                //Reading post data
                ctx.req.post = await ctx.req.json();
            }
            // Creating Headers Object
            ctx.res.headers = new Headers();
            // set header method
            ctx.res.setHeader = (name, value) => {
                ctx.res.headers.append(name, value);
            }
            await compose(this.middleware)(ctx);
            return new Response(ctx.res.body, {
                status: ctx.res.status,
                headers: ctx.res.headers
            });
        };

        //启动服务器
        console.log(`jsWeb running. Access it at: http://${addr}/`);
        await serve(handler, {
            addr
        });
    }

    async listen2(hostname = '127.0.0.1', port = 5000) {
        let http = await import('http');
        const server = http.createServer(async (req, res) => {
            const ctx = new Context(this, req);
            ctx.req.pathname = ctx.req.url;
            if (ctx.req.method == 'POST') {
                //Reading post data
                let data = '';
                // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到data变量中
                req.on('data', function (chunk) {
                    data += chunk;
                });

                // 在end事件触发后即可获取POST提交的数据。
                req.on('end', async () => {
                    //data即为POST提交的JSON数据
                    ctx.req.post = data;
                    ctx.res = res;
                    ctx.res.body = '';
                    await compose(this.middleware)(ctx);
                    ctx.res.statusCode = 200;
                    ctx.res.end(ctx.res.body);
                });
            } else {
                ctx.res = res;
                ctx.res.body = '';
                await compose(this.middleware)(ctx);
                ctx.res.statusCode = 200;
                ctx.res.end(ctx.res.body);
            }
        });

        //服务器监听
        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    }

    use(middleware) {
        this.middleware.push(middleware);
        return this;
    }
}