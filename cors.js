export async function cors(ctx, next){
    
    ctx.res.setHeader('Access-Control-Allow-Origin', '*');
    ctx.res.setHeader('Access-Control-Allow-Method', 'GET,PUT,POST,DELETE,OPTIONS');
    ctx.res.setHeader('Access-Control-Allow-Headers', 'content-type');
    await next();
}
