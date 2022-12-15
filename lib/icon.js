//静态HTML服务器中间件
//图标中间件
export async function icon(ctx, next){
    //静态文件的根目录为./html/
    if(ctx.req.pathname == '/favicon.ico'){
        return ;
    }
    await next();
}