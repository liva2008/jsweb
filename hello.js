import { Application } from "./mod.js";
let app = new Application();

//添加中间件
app.use((ctx) => {
  ctx.res.body = "<h1>Hello world!</h1>";
});

app.listen('127.0.0.1', 5000);