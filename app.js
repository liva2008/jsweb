//import { Application, Router,cors } from "https://deno.land/x/jsweb/mod.js"; //remote jsweb
import { Application, Router, icon, cors, html,error,logger,  jwt } from "./mod.js"; //local jsweb
import { captcha, checkUsername, reg, login, getData, remove, modPassword, update, list, add, userpri, adminpri} from './userdao.ts'; //用户控制器

// deno run --allow-net app.js

//新建Web应用
let app = new Application();
//路由器
let router = new Router();

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

//JSON Web Token
let j = new jwt();
//加载密钥
await j.loadKey();
app.use(j.add());

//用户权限中间件
app.use(userpri);
//管理员权限中间件
app.use(adminpri);

//用户微服务
router.post('/user/code', captcha)  //验证码
router.post('/user/check', checkUsername) //检测用户名
router.post('/user/reg', reg)  //注册用户
router.post('/user/login', login) //登录
router.post('/user/getdata', getData) //用户列表
router.post('/user/delete', remove) //删除用户
router.post('/user/modpassword', modPassword) //修改密码
router.post('/user/update', update) //修改数据

//users表服务
router.put('/user/users', update) //修改数据
router.delete('/user/users', remove) //删除用户
router.get('/user/users', list) //用户列表
router.post('/user/users', add) //添加数据

// router middleware
app.use(router.routes());
//服务器监听
app.listen('127.0.0.1', 5000);