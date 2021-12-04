# jsweb

- jsweb is a JSON CORS ORM super micro web framework based on node and deno.

## Web Server

- deno dependencies:
    - https://deno.land/std@0.116.0/http/server.ts

- node dependencies:
    - none

- web server switch node and deno is only one place to modify.
  
 ```javascript

let app = new Application('deno'); // select deno
let app = new Application('node'); // select node

``` 
- app.js

```javascript

import { Application, Router,cors } from "https://deno.land/x/jsweb/mod.js"; //remote
//import { Application, Router,cors } from "./mod.js";

// deno run --allow-net app.js
// node app.js
let app = new Application('deno');
let router = new Router();

/*
app.use(async (ctx, next) => {  
    console.log(ctx.req.url);
    await next();
});
*/

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

- run app.js
> deno run --allow-net app.js

> node app.js

## Database

- deno dependencies:
    - https://deno.land/x/mysql/mod.ts
    - https://deno.land/x/sqlite/mod.ts

- node dependencies:(Install by double click node.bat on windows )
    - npm install mysql2 --save
    - npm install sqlite3 --save
    - npm install sqlite --save 

- Database switch mysql and sqlite is two place to modify.

```javascript

// first parameters select deno, second parameters select database
let db = new Database('deno','mysql'); 
await db.connect('hello', 'localhost', 'root', '123456')

// first parameters select node, second parameters select database
let db = new Database('node','sqlite'); 
await db.connect('hello.db');
```

- db.js

```javascript
import { Database } from "https://deno.land/x/jsweb/mod.js"; //remote
//import { Database } from './mod.js'; //local

// deno run --allow-net --allow-read --allow-write db.js
/* 
* 1st: platform deno or node
* 2nd: database type mysql or mongodb
*/
//let db = new Database('deno', "mysql");
let db = new Database('deno', "sqlite");

// node db.js
// npm install --save mysql2
// npm install sqlite3 --save
// npm install sqlite --save
//let db = new Database('node', "mysql");

/* connect database
*  1st parameter: database name
*  2nd parameter: database address
*  3rd parameter: database username
*  4th parameter: database password
*/
//await db.connect('hello', 'localhost', 'root', '123456')
await db.connect('hello.db');


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
let r1 = await db.execute(`update student set sname='test1' where sno='10001'`);

//if update, delete, insert return affected rows. 
console.log(r1);

//if select return array
let r2 = await db.execute(`select * from student`);
console.log(r2);

//if update, delete, insert return affected rows. 
let r3 = await db.execute(`insert into student values('10015', 'liva', '男', 25, 'cs')`);
console.log(r3);

// close database
await db.close();

```

- run db.js
> deno run --allow-net --allow-read --allow-write db.js

> node db.js