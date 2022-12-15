//处理器
//http://127.0.0.1:5000/testcontroller/hello
export async function hello(ctx) {
    let body = "<h1>Hello jsweb</h1>";
    ctx.res.setHeader("Content-Type", 'text/html');
    //send data assign to ctx.res.body
    ctx.res.body = body;
}

//处理器
//http://127.0.0.1:5000/testcontroller/say
export async function say(ctx) {
    let body = "<h1>Hello liva</h1>";
    ctx.res.setHeader("Content-Type", 'text/html');
    //send data assign to ctx.res.body
    ctx.res.body = body;
}
