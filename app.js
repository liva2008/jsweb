//import { Application, Router,cors } from "https://deno.land/x/jsweb/mod.js"; //remote
import { Application, Router,cors } from "./mod.js";

// deno run --allow-net app.js
// node app.js
let app = new Application('deno');
let router = new Router();


app.use(async (ctx, next) => {  
    console.log(ctx.req.url);
    await next();
});


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
    console.log(ctx.req.post);
    ctx.res.setHeader("Content-Type",'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify(ctx.req.post);
})

router.post('/test2', async (ctx) =>{
    // post data in ctx.req.post: formData
    //console.log('hello')
    console.log(ctx.req.post);
    
    //ctx.res.setHeader("Content-Type",ctx.req.headers.get('Content-Type'));
    
    ctx.res.body = ctx.req.post;
})

app.use(router.routes());
app.listen('127.0.0.1', 5000);