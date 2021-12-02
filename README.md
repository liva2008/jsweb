# jsweb

- jsweb is a restiful json cors post method stateless super micro web framework based on node and deno.

- switch node and deno is only one place to modify.

```javascript

let app = new Application('deno'); // select deno
let app = new Application('node'); //select node

```

## deno

- app.js
  
```javascript

import { Application, Router,cors } from "./mod.js";

let app = new Application('deno');
let router = new Router();

app.use(async (ctx, next) => {  
    console.log(ctx.req.url);
    await next();
});

app.use(cors);

//get test using http://127.0.0.1:5000/
router.get('/', function (ctx) {
    let body = "<h1>Hello jsweb</h1>";
    ctx.res.setHeader("Content-Type",'text/html');
    ctx.res.body = body;
})

//post test using index.html in jsweb folder
router.post('/test', async (ctx) =>{
    console.log(ctx.req.post);
    ctx.res.setHeader("Content-Type",'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify(ctx.req.post);
})

app.use(router.routes());

app.listen('127.0.0.1', 5000);

```

> deno run --allow-net app.js

## node

```javascript

import { Application, Router,cors } from "./mod.js";

let app = new Application('node');
let router = new Router();

app.use(async (ctx, next) => {  
    console.log(ctx.req.url);
    await next();
});

app.use(cors);

//get test using http://127.0.0.1:5000/
router.get('/', function (ctx) {
    let body = "<h1>Hello jsweb</h1>";
    ctx.res.setHeader("Content-Type",'text/html');
    ctx.res.body = body;
})

//post test using index.html in jsweb folder
router.post('/test', async (ctx) =>{
    console.log(ctx.req.post);
    ctx.res.setHeader("Content-Type",'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify(ctx.req.post);
})

app.use(router.routes());

app.listen('127.0.0.1', 5000);

```

> node app.js