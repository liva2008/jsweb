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
            console.log(ctx.req.headers.get('Content-Type'));                      
            //parse get params
            ctx.req.get = url.searchParams;
            if (ctx.req.method === 'POST') {
                //Reading post data
                //console.log(ctx.req.body);
                //console.log(ctx.req.body.tee());
                //console.log(ctx.req.body);
                ctx.req.post = {};

                ctx.req.post.get = async (mime) => {
                    if(mime == 'json'){
                        return ctx.req.json();
                    }
                    else if(mime == 'text'){
                        return ctx.req.text();
                    }
                    else if(mime == 'formdata'){
                        return ctx.req.formData();
                    }
                    else if(mime == 'blob'){
                        return ctx.req.blob();
                    }
                    else if(mime == 'arraybuffer'){
                        return ctx.req.arrayBuffer();
                    }
                    else if(mime == 'stream'){
                        return ctx.req.body;
                    }
                }

                /*
                let stream = ctx.req.clone();
                let ab = ctx.req.clone();
                ctx.req.post.arrayBuffer = await ab.arrayBuffer();
                ctx.req.post.readableStream = stream.body;
                console.log(ctx.req.post.readableStream);
                
                let type = ctx.req.headers.get('Content-Type');
                if(type.match("application/json")){  // application/json
                    ctx.req.post.json = await ctx.req.json();
                }
                else if(type.match("multipart/form-data")){ // multipart/form-data
                    ctx.req.post.formData = await ctx.req.formData();
                    //console.log(ctx.req.post);
                }
                else if(type.match('text/*')){ // text/plain, text/html, text/css, text/javascript
                    ctx.req.post.text = await ctx.req.text();
                }
                else{ // image/*, audio/*, video/*, application/*
                    ctx.req.post.blob = await ctx.req.blob();
                }
                */
                
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
        console.log(`jsWeb running on ${this.platform}. Access it at: http://${addr}/`);
        await serve(handler, {
            addr
        });
    }

    async listen2(hostname = '127.0.0.1', port = 5000) {
        let http = await import('http');
        let { URL } = await import('url');


        const server = http.createServer(async (req, res) => {
            
            const ctx = new Context(this, req);
            
            let url = new URL(req.url, `http://${req.headers.host}`);
            //parse pathname
            ctx.req.pathname = url.pathname;
            //parse get params
            ctx.req.get = url.searchParams;
            console.log(ctx.req.headers['content-type']);
            ctx.req.headers.get = function(name){
                return ctx.req.headers[name.toLowerCase()];
            }
            if (ctx.req.method == 'POST') {
                //Reading post data
                let data = [];
                // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到data变量中
                req.on('data', function (chunk) {
                    data.push(chunk);
                });

                // 在end事件触发后即可获取POST提交的数据。
                req.on('end', async () => {
                    //data即为POST提交的JSON数据
                    let type = ctx.req.headers['content-type'];
                    let buf = Buffer.concat(data);
                    ctx.req.post = {};

                    ctx.req.post.get = async (mime) => {
                        if(mime == 'json'){
                            return JSON.parse(buf.toString());;
                        }
                        else if(mime == 'text'){
                            return buf.toString();
                        }
                        else if(mime == 'formdata'){
                            return buf;
                        }
                        else if(mime == 'blob'){
                            return buf;
                        }
                        else if(mime == 'arraybuffer'){
                            return buf;
                        }
                        else if(mime == 'stream'){
                            return buf;
                        }
                    }

                    /*
                    if(type.match("application/json")){  // application/json
                        ctx.req.post.json = JSON.parse(buf.toString());
                    }
                    else if(type.match("multipart/form-data")){ // multipart/form-data
                        // not parsing the multipart/form-data
                        ctx.req.post.formData = buf;
                    }
                    else if(type.match('text/*')){ // text/plain, text/html, text/css, text/javascript
                        ctx.req.post.text = buf.toString();
                    }
                    else{ // image/*, audio/*, video/*, application/*
                        ctx.req.post.blob = buf;
                    }
                    */
    
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
            console.log(`jsWeb running on ${this.platform}. Access it at: http://${hostname}:${port}/`);
        });
    }

    use(middleware) {
        this.middleware.push(middleware);
        return this;
    }
}