//import { Application, Router,cors } from "https://deno.land/x/jsweb/mod.js"; //remote jsweb
import { Application, router, icon, cors, html,error,logger} from "./mod.js"; //local jsweb

// deno run --allow-net app.js

//新建Web应用
let app = new Application();

//icon中间件
app.use(icon);

//错误处理中间件
app.use(error);

//日志中间件
app.use(logger);

//静态HTML服务器中间件
app.use(html);

//跨域CORS(Cross Origin Resource Sharing)
app.use(cors);

// 路由器中件间
app.use(router);
//服务器监听
app.listen('127.0.0.1', 5000);