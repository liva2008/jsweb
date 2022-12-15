/* 路由器中间件
*  FILE路由算法：http://127.0.0.1:5000/path1/.../pathn/controller/handler?k1=v1&k2=v2
*  ctrl文件夹为控制器根目录
*  根据/path1/.../pathn/controller加载控制器程序，根据handler执行处理器程序。
*  不会区分请求方法
*/
export async function router(ctx, next) {
    try {
        //解析出controller和handler
        let n = ctx.req.pathname.lastIndexOf("/");
        let controllerpath = ctx.req.pathname.substring(0, n);
        //console.log(controllerpath)
        let handlername = ctx.req.pathname.substring(n + 1);
        //console.log(handlername);
        //加载controller
        let controller = await import(`../ctrl${controllerpath}.ts`);
        //执行handler
        await controller[handlername].call(null, ctx);
    }
    catch (e) {
        throw new Error(e);
    }
    return;
}