//跨域中间件
export async function cors(ctx, next){
    ctx.res.setHeader('Access-Control-Allow-Origin', '*');  //源
    ctx.res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); //方法
    //ctx.res.setHeader('Access-Control-Allow-Methods', '*');
    //ctx.res.setHeader('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');  //Headers
    ctx.res.setHeader('Access-Control-Allow-Headers', '*');
    ctx.res.setHeader('Access-Control-Max-Age', '86400'); // prefight request被缓存时长，单位：秒
    //ctx.res.setHeader('Access-Control-Allow-Credentials', 'true');  //携带凭据进行实际的请求
    await next();
}
