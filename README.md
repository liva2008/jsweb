# jsweb

- jsweb is a fullstack micro web framework based on node and deno.
    - Web Server(node, deno)
    - Database(sqlite, mysql)
    - Browser(Chrome, Edge, Firefox)

## Web Server

### Dependencies
- deno dependencies:
    - https://deno.land/std@0.116.0/http/server.ts

- node dependencies:
    - none

### Application

- Application switching node and deno is only one place to modify.
  
 ```javascript

let app = new Application('deno'); // select deno
let app = new Application('node'); // select node

``` 
### Router

 ```javascript
let router = new Router();

//get test using http://127.0.0.1:5000/hello
router.get('/hello', function (ctx) {
    let body = "<h1>Hello jsweb</h1>";
    ctx.res.setHeader("Content-Type",'text/html');
    //send data assign to ctx.res.body
    ctx.res.body = body;
})

// router middleware
app.use(router.routes());

```

### CORS
  
 ```javascript

//Cross Origin Resource Sharing
app.use(cors);

```

### Request GET method parameter

- Request get method parameter using ctx.req.get object
- ctx.req.get is URLSearchParams Object
- ctx.req.get.get(name) returns the value of the first name-value pair whose name is name. 
  
> http://127.0.0.1:5000/hi?name=jsweb

 ```javascript

//get with params test using http://127.0.0.1:5000/hi?name=jsweb
router.get('/hi', function (ctx) {
    // get data in ctx.req.get
    let body = `<h1>Hello ${ctx.req.get.get('name')}</h1>`;
    ctx.res.setHeader("Content-Type",'text/html');
    ctx.res.body = body;
})

```

### Request POST method parameter 

- POST method parameter is using ctx.req.post object
- ctx.req.post.get() returns results which you need
  
| parameter | return type |
| --------- | ----------- |
| ctx.req.post.get('json') | json javascript object |
| ctx.req.post.get('text') | String |
| ctx.req.post.get('blob') | Blob   |
| ctx.req.post.get('formdata') | FormData |
| ctx.req.post.get('arraybuffer') | ArrayBuffer |
| ctx.req.post.get('stream') | ReadableStream |

 ```javascript

router.post('/test1', async (ctx) =>{
    // post data in ctx.req.post:json
    let d = await ctx.req.post.get('json');
    console.log(d);
    ctx.res.setHeader("Content-Type",'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify(d);

})

 ```

### Example

- app.js

```javascript

import { Application, Router,cors } from "https://deno.land/x/jsweb/mod.js"; //remote
//import { Application, Router,cors } from "./mod.js";

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
})

router.post('/test2', async (ctx) =>{
    // post data in ctx.req.post: formData
    let d = await ctx.req.post.get('formdata');
    console.log(d);
    //form data deno not setting, node must be setting content-type
    //ctx.res.setHeader("Content-Type",ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
})

router.post('/test3', async (ctx) =>{
    // post data in ctx.req.post: text
    let d = await ctx.req.post.get('text');
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
})

router.post('/test4', async (ctx) =>{
    // post data in ctx.req.post: Blob
    let d = await ctx.req.post.get('text');
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
})

router.post('/test5', async (ctx) =>{
    // post data in ctx.req.post: Blob
    let d = await ctx.req.post.get('blob');
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
})

// router middleware
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

- Database switching mysql and sqlite is two place to modify.

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

## Brower

- postData function
  
```javascript

/* 
* @description POST method send data
*
* @param {string} url post address
* @param data may be javascript object, string, FormData, Blob
* @param {string} requestType may be application/json(javascript object), 
*                    multipart/form-data(FormData), 
*                    text/*, text/plain, text/html, text/css, text/javascript(string)
*                    image/*, image/jpeg, image/png, image/gif, image/svg+xml(Blob)
*                    application/*, application/octet-stream, application/pdf,application/zip(Blob) 
* @param {string}  responseType text, json, blob, formdata, arraybuffer, stream     
* @return may be javascript object, String, FormData, Blob              
* @license 0.1.6
*/

async function postData(url = '', data = '', requestType = 'text/*', responseType = 'text')

```

- example

```html

<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Post test</title>
	<script src='index.js'></script>
</head>

<body>
	<form id="myForm">
		<input type='text' id='username' name='username'>
		<input type="password" id='password' name="password">
		<input type="file" id='myfile' name="myfile" accept="image/*" multiple onchange="sendBLOB1(this.files)">
		<input type="file" id='myfile' name="myfile1" accept="application/*">
		<input type="button" onclick="sendJSON()" value="sendJSON">
		<input type="button" onclick="sendFORM()" value="sendFORM">
		<input type="button" onclick="sendTEXT()" value="sendTEXT">
		<input type="button" onclick="sendBLOB()" value="sendBLOB">
	</form>
	<div id="result"></div>
	<script>
		async function sendJSON() {
			let username = document.querySelector('#username');
			let password = document.querySelector('#password');
			//待提交的数据
			let user = { username: username.value, password: password.value };
			console.log(user);

			let res = await postData('http://localhost:5000/test1', user, 'application/json', 'json');
			let ret = document.getElementById('result');
			//服务器返回的数据
			ret.innerHTML = JSON.stringify(res);
		}

		async function sendFORM() {

			let form = document.querySelector("#myForm");
			//将获得的表单元素作为参数，对formData进行初始化
			let formdata = new FormData(form);
			console.log(formdata);

			let res = await postData('http://localhost:5000/test2', formdata, 'multipart/form-data', 'formdata');
			let ret = document.getElementById('result');
			//服务器返回的数据
			ret.innerHTML = res.get('username') + "|" + res.get('password') + "|" + `<img src="${URL.createObjectURL(res.get('myfile'))}">`;
		}

		async function sendTEXT() {

			let username = document.querySelector('#username');
			let password = document.querySelector('#password');

			let res = await postData('http://localhost:5000/test3', `${username.value}|${password.value}`, 'text/plain', 'text');
			let ret = document.getElementById('result');
			//服务器返回的数据
			ret.innerHTML = res;
		}

		async function sendBLOB() {

			const leoHtmlFragment = ['<a id="a"><b id="b">hey leo！</b></a>']; // 一个包含 DOMString 的数组
			const leoBlob = new Blob(leoHtmlFragment, { type: 'text/html' });   // 得到 blob
			let res = await postData('http://localhost:5000/test4', leoBlob, 'text/html', 'text');
			let ret = document.getElementById('result');
			ret.innerHTML = res;
		}

		async function sendBLOB1(files) {

			console.log(files[0]);

			let res = await postData('http://localhost:5000/test5', files[0], files[0].type, 'blob');
			console.log(res);
			let ext = '';
			if(res.type == 'image/png')
				ext = '.png';
			else if(res.type == 'image/jpeg')
				ext = '.jpg';
			else if(res.type == 'image/gif')
				ext = '.gif';
			else if(res.type == 'image/svg+xml'){
				ext = '.svg';
			}
			let fileName = Date.parse(new Date()) + ext;
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(res);
			link.download = fileName;
			link.click();
			window.URL.revokeObjectURL(link.href);
		}
	</script>
</body>

</html>

```

