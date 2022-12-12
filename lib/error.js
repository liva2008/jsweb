export async function error(ctx, next) {
    try {
      await next();
    } catch (err) {
        ctx.res.body = `${err}`;
        console.log(err);
    }
}