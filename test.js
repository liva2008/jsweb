//import { Application, Router,cors } from "https://deno.land/x/jsweb/mod.js"; //remote jsweb
import { Application, Router, cors, db, GridFSBucket, ObjectId} from "./mod.js"; //local jsweb

// deno run --allow-net app.js

//新建Web应用
let app = new Application();
//路由器
let router = new Router();

//中间件
app.use(async (ctx, next) => {
    //console.log(ctx.req.url);
    await next();
    //console.log('end.');
});

//跨域CORS(Cross Origin Resource Sharing)
app.use(cors);

//get test using http://127.0.0.1:5000/hello
router.get('/hello', function (ctx) {
    let body = "<h1>Hello jsweb</h1>";
    ctx.res.setHeader("Content-Type", 'text/html');
    //send data assign to ctx.res.body
    ctx.res.body = body;
})

//get with params test using http://127.0.0.1:5000/hi?name=jsweb
router.get('/hi', function (ctx) {
    // get data in ctx.req.params
    let body = `<h1>Hello ${ctx.req.params.get('name')}</h1>`;
    ctx.res.setHeader("Content-Type", 'text/html');
    ctx.res.body = body;
})

//post test using index.html in jsweb folder
router.post('/test1', async (ctx) => {
    // JSON解析
    let d = await ctx.req.json();
    console.log(d);
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify(d);
})

router.post('/test2', async (ctx) => {
    // FormData解析
    let d = await ctx.req.formData();
    console.log(d);
    console.log(ctx.req.headers.get('Content-Type'));
    //formData 不用设置Content-Type:multipart/form-data; boundary=----WebKitFormBoundarymCn9w2dMKkZ0mSAK
    //ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
})

router.post('/test3', async (ctx) => {
    // 文本解析
    let d = await ctx.req.text();
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
})

router.post('/test4', async (ctx) => {
    // Blob解析
    let d = await ctx.req.blob();
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
})

router.post('/test5', async (ctx) => {
    // Blob解析
    let d = await ctx.req.blob();
    console.log(d);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'));
    ctx.res.body = d;
})

router.post('/test7', async (ctx) => {
    // Stream解析
    let stream = await ctx.req.body;
    console.log(stream);

    // Upload
    const bucket = new GridFSBucket(db);
    let id = new ObjectId();
    console.log(id);
    const upstream = await bucket.openUploadStreamWithId(id, "test.jpg");

    await stream.pipeTo(upstream);

    //Download
    let downstream = await bucket.openDownloadStream(id);
    ctx.res.setHeader("Content-Type", ctx.req.headers.get('Content-Type'))
    ctx.res.body = downstream;
})

router.post('/test6', async (ctx) => {
    // Step 1：获得一个 reader
    let stream = await ctx.req.body;
    let reader = stream.getReader();

    // Step 2：获得总长度（length）
    const contentLength = ctx.req.headers.get('Content-Length');

    // Step 3：读取数据
    let receivedLength = 0; // 当前接收到了这么多字节
    let chunks = []; // 接收到的二进制块的数组（包括 body）
    while(true) {
        const {done, value} = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        receivedLength += value.length;

        console.log(`Received ${receivedLength} of ${contentLength}`)
    }

    ctx.res.setHeader("Content-Type", 'text/plain');
    ctx.res.body = "ok";
})

// router middleware
app.use(router.routes());
//服务器监听
app.listen('127.0.0.1', 5000);