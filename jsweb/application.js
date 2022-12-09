//引用HTTP库
import { serve } from "https://deno.land/std@0.166.0/http/server.ts";

import {
    Context
} from "./context.js";
import {
    compose
} from "./middleware.js";

export class Application {

    constructor() {
        //中间件数组
        this.middleware = [];
    }

    //服务器监听
    async listen(hostname = '127.0.0.1', port = 5000) {
        //连接处理器
        const handler = async (request) => {
            //新建上下文
            const ctx = new Context(this, request);
            //创建URL
            let url = new URL(ctx.req.url);
            //解析路径
            ctx.req.pathname = url.pathname;
            //解析数据类型
            //console.log(ctx.req.headers.get('Content-Type'));
            //解析请求方法
            //console.log(ctx.req.method);                     
            //解析GET方法参数
            ctx.req.params = url.searchParams;
            //解析POST方法数据,有六种方法，根据需要选择一种即可。
            //json: ctx.req.json();
            //text: ctx.req.text();
            //FormData: ctx.req.formData();
            //Blob: ctx.req.blob();
            //ArrayBuffer: ctx.req.arrayBuffer();
            //stream: ctx.req.body;
            
            // Creating Headers Object
            ctx.res.headers = new Headers();
            // set header method
            ctx.res.setHeader = (name, value) => {
                ctx.res.headers.append(name, value);
            }
            //执行中间件
            await compose(this.middleware)(ctx);

            //返回响应对象
            return new Response(ctx.res.body, {
                status: ctx.res.status,
                headers: ctx.res.headers
            });
        };

        //启动服务器
        console.log(`jsWeb is running. Access it at: http://${hostname}:${port}/`);
        await serve(handler, {
            hostname: hostname, port: port
        });
    }

    //添加中间件
    use(middleware) {
        this.middleware.push(middleware);
        return this;
    }
}