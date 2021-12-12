//import { Application, Router,cors } from "https://deno.land/x/jsweb/mod.js"; //remote
import { Application, Router,cors } from "./mod.js";

// deno run --allow-net app.js
// node app.js

let app = new Application('deno');
let router = new Router();

//middleware
app.use(async (ctx, next) => {  
    console.log(ctx.req.url);
    await next();
});

//Cross Origin Resource Sharing
app.use(cors);

//get test using http://127.0.0.1:5000/hello
router.get('/hello', function (ctx) {
    let body = "<h1>Hello jsweb</h1>";
    ctx.res.setHeader("Content-Type",'text/html');
    //send data assign to ctx.res.body
    ctx.res.body = body;
})

//get with params test using http://127.0.0.1:5000/hi?name=jsweb
router.get('/hi', function (ctx) {
    // get data in ctx.req.get
    let body = `<h1>Hello ${ctx.req.get.get('name')}</h1>`;
    ctx.res.setHeader("Content-Type",'text/html');
    ctx.res.body = body;
})

//post test using index.html in jsweb folder
router.post('/test1', async (ctx) =>{
    // post data in ctx.req.post:json
    let d = await ctx.req.post.get('json');
    console.log(d);
    ctx.res.setHeader("Content-Type",'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify(d);
    /*
    console.log(ctx.req.post.json);
    let x = new Uint8Array(ctx.req.post.arrayBuffer);
    console.log(x[0]);
    ctx.res.setHeader("Content-Type",'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify(ctx.req.post.json);
    */
    
})

router.post('/test2', async (ctx) =>{
    // post data in ctx.req.post: formData
    let d = await ctx.req.post.get('formdata');
    console.log(d);
    //form data deno not setting, node must be setting content-type
    ctx.res.setHeader("Content-Type",ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;

    /*
    console.log(ctx.req.post.formData);
    
    //form data deno not setting, node must be setting content-type
    //ctx.res.setHeader("Content-Type",ctx.req.headers.get('Content-Type'));
    
    ctx.res.body = ctx.req.post.formData;
    */
})

router.post('/test3', async (ctx) =>{
    // post data in ctx.req.post: text
    //console.log('hello')
    let d = await ctx.req.post.get('text');
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
    /*
    console.log(ctx.req.post.text);
    
    ctx.res.setHeader("Content-Type",ctx.req.headers.get('Content-Type'));
    
    ctx.res.body = ctx.req.post.text;
    */
})

router.post('/test4', async (ctx) =>{
    // post data in ctx.req.post: Blob
    //console.log('hello')
    let d = await ctx.req.post.get('text');
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
    /*
    console.log(ctx.req.post.text);
    
    ctx.res.setHeader("Content-Type",ctx.req.headers.get('Content-Type'));
    
    ctx.res.body = ctx.req.post.text;
    */
})

router.post('/test5', async (ctx) =>{
    // post data in ctx.req.post: Blob
    //console.log('hello')
    let d = await ctx.req.post.get('blob');
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
    /*
    console.log(ctx.req.post.blob);
    
    ctx.res.setHeader("Content-Type",ctx.req.headers.get('Content-Type'));
    
    ctx.res.body = ctx.req.post.blob;
    */
})

// router middleware
app.use(router.routes());
app.listen('127.0.0.1', 5000);