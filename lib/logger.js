import {
    green,
    cyan,
    red,
    yellow,
  } from "https://deno.land/std@0.166.0/fmt/colors.ts";
export async function logger(ctx, next) {
    const start = Date.now();
    console.log(ctx.req.url);
    await next();
    const ms = Date.now() - start;
    let output = `response time:${ms}`;
    console.log(`${green(output)}`);
}