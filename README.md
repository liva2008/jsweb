# jsweb

- jsweb is a json cors stateless super micro web framework based on node and deno.

- switch node and deno is only one place to modify.

```javascript

let app = new Application('deno'); // select deno
let app = new Application('node'); //select node

```

## deno

- app.js
  
```javascript

import { Application, Router,cors } from "https://deno.land/x/jsweb@v0.1.3/mod.js"; //remote
//import { Application, Router,cors } from "./mod.js"; //local

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
router.post('/test', async (ctx) =>{
    // post data in ctx.req.post
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

import { Application, Router,cors } from "./mod.js"; //local

let app = new Application('node');
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
router.post('/test', async (ctx) =>{
    // post data in ctx.req.post
    console.log(ctx.req.post);
    ctx.res.setHeader("Content-Type",'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify(ctx.req.post);
})

app.use(router.routes());

app.listen('127.0.0.1', 5000);

```

> node app.js

## mysql

```javascript
import { Database } from "https://deno.land/x/jsweb@v0.1.3/mod.js"; //remote
//import { Database} from './mod.js'; //local

// deno run --allow-net --allow-read db.js
let db = new Database('deno');

// node db.js
//let db = new Database('node');

/* connect database
*  1st parameter: database address
*  2nd parameter: database username
*  3rd parameter: database password
*  4th parameter: database
*/
await db.connect('localhost', 'root', '123456', 'hello')

let r0 = await db.execute(`
CREATE TABLE IF NOT EXISTS Student          
      (Sno   CHAR(9) PRIMARY KEY,                   
       Sname CHAR(20),
       Ssex  CHAR(2),
       Sage  SMALLINT,
       Sdept CHAR(20)
      ); 
`)
console.log(r0);

// executing sql by db.exectue method
let r1 = await db.execute(`update student set sname='test' where sno='10001'`);

//if update, delete, insert return affected rows. 
console.log(r1);

//if select return array
let r2 = await db.execute(`select * from student`);
console.log(r2);

//if update, delete, insert return affected rows. 
let r3 = await db.execute(`insert into student values('10009', 'liva', '男', 25, 'cs')`);
console.log(r3);

// close database
await db.close();

```