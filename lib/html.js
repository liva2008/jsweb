import { extname } from "https://deno.land/std@0.166.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.166.0/media_types/mod.ts";

//静态HTML服务器中间件
export async function html(ctx, next){
    //静态文件的根目录为./html/
    if(ctx.req.pathname.startsWith('/html/')){
        //根据文件名获取Content-Type
        const contentTypeValue = contentType(extname(ctx.req.pathname));
        if (contentTypeValue) {
            //设置Content-Type
            ctx.res.setHeader("Content-Type", contentTypeValue);
        }
        let file;
        try{
            file = await Deno.open(`.${ctx.req.pathname}`, { read: true });
        }
        catch{
            ctx.res.setHeader('Contnet-Type', 'text/html');
            ctx.res.status = 404;
            ctx.res.body = 'Page Not Found';
            return;
        }
        ctx.res.body = file.readable;
    }
    await next();
}