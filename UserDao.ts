import { makeCaptchaBySVG, makeCaptchaByCanvas} from "./mod.js";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Hash } from "https://deno.land/x/checksum@1.4.0/mod.ts";
import { users } from "./user.ts"

//JSON Web Token
//let j = new jwt();
//加载密钥
//await j.loadKey();

//验证码处理器
export async function captcha(ctx) {
  //生成验证码
  //const captcha = makeCaptchaBySVG();
  const captcha = makeCaptchaByCanvas();
  //验证码图片
  const svgContext = captcha.svgContext
  //验证码文本
  const text = captcha.text
  //对验证码文本进行加密，并设置验证码过期时间为10分钟
  let a = await ctx.jwt.encrypt({ text: text, exp: 1000 * 60 * 10, iat: Date.now() });
  //返回处理结果
  ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
  ctx.res.body = JSON.stringify({ "code": svgContext, "text": a });
}

//检测用户是否重名处理器
export async function checkUsername(ctx) {
  //获取请求数据
  let data = await ctx.req.json();
  //在mongodb数据库中查找是否存在
  let user = await users.findOne({ username: data.username });
  if (user) {
    //存在
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 3, msg: '用户名已存在!' });
    return false;
  }
  //不存在，表示要注册的用户名可用
  ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
  ctx.res.body = JSON.stringify({ code: 0, msg: '用户名可用!' });
}

//注册处理器
export async function reg(ctx) {
  //获得注册数据
  let data = await ctx.req.json();
  //解密验证码文本
  let dest = await ctx.jwt.decrypt(data.text);
  //解析验证码
  let code = JSON.parse(dest);
  if ((code.text == null) || (code.text.toLowerCase() != data.captcha.toLowerCase())) {
    //验证码不区配
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 1, msg: '验证码错误!' });
    return false;
  }
  if (Date.now() - code.iat > code.exp) {
    //验证码过期
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 2, msg: '验证码过期!' });
    return false;
  }
  //验证码正确
  //在mongodb数据库查找是否存在该用户
  let user = await users.findOne({ username: data.username });
  if (user) {
    //用户已存在
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 3, msg: '用户名已存在!' });
    return false;
  }
  //写入数据库
  await users.insertOne({
    username: data.username, //用户名
    password: new Hash("md5").digestString(data.password).hex(), //密码,md5加密，管理人员都看不到用户密码
    type: 1  //用户类型，普通用户
  });
  //在数据库再次查找该用户
  user = await users.findOne({ username: data.username });
  if (user) {
    //注册成功
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 0, msg: '注册成功!' });
  }
  else {
    //注册失败
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 4, msg: '注册失败!' });
  }
}

//登录处理器
export async function login(ctx) {
  //获得提交数据
  let data = await ctx.req.json();
  //解密验证码
  let dest = await ctx.jwt.decrypt(data.text);
  //解析验证码
  let code = JSON.parse(dest);
  if (code.text.toLowerCase() != data.captcha.toLowerCase()) {
    //验证码错误
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 1, msg: '验证码错误!' });
    return false;
  }
  if (Date.now() - code.iat > code.exp) {
    //验证码过期
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 2, msg: '验证码过期!' });
    return false;
  }
  //验证通过
  //在数据库中查找该用户
  let user = await users.findOne({ username: data.username, password: new Hash("md5").digestString(data.password).hex() });
  if (user) {
    //登录成功，发送jwt
    //生成JSON Web Token
    let sign = await ctx.jwt.sign({ username: user.username, type: user.type, exp: 1000 * 60 * 60 * 12, iat: Date.now() });
    //返回结果
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 0, msg: '登录成功!', type: user.type, sign: sign });
    return true;
  }
  //登录失败
  ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
  ctx.res.body = JSON.stringify({ code: 3, msg: '用户名或密码错误，登录失败!' });
}

//用户列表处理器
export async function getData(ctx) {
  //获取用户提交的数据
  let data = await ctx.req.json();
  //验证用户是否登录
  let verify = await ctx.jwt.verify(data.token);
  if (verify) {
    //已登录
    if (checkAdmin(data.token)) { //判断用户是否为管理员
      //当前页号
      let page = Number.parseInt(data.page);
      //每页行数
      let limit = Number.parseInt(data.limit);
      //获取用户表
      const cursor = users.find();
      //统计用户表中用户数量
      let count = await users.countDocuments();
      //分页查询
      cursor.skip((page - 1) * limit).limit(limit);
      //将查询结果转为数组
      const u = await cursor.toArray();
      //返回结果
      ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
      ctx.res.body = JSON.stringify({
        code: 0,
        msg: "",
        count: count,  //用户数量
        data: u        //用户数组
      });
    }
    else {
      //非管理员
      ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
      ctx.res.body = JSON.stringify({ code: 4, msg: '没有管理权限，请更换用户登录!' });
    }
  }
  else {
    //没有登录
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 3, msg: '没有登录，请登录!' });
  }
}

//用户列表处理器
export async function list(ctx) {
  //获取用户提交的数据
  let data = await ctx.req.params;
  //对参数token解码
  let token = decodeURIComponent(data.get('token'));
  //验证用户是否登录
  let verify = await ctx.jwt.verify(token);
  if (verify) {
    //已登录
    if (checkAdmin(token)) { //判断用户是否为管理员
      //当前页号
      let page = Number.parseInt(data.get('page'));
      //每页行数
      let limit = Number.parseInt(data.get('limit'));
      //获取用户表
      const cursor = users.find();
      //统计用户表中用户数量
      let count = await users.countDocuments();
      //分页查询
      cursor.skip((page - 1) * limit).limit(limit);
      //将查询结果转为数组
      const u = await cursor.toArray();
      //返回结果
      ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
      ctx.res.body = JSON.stringify({
        code: 0,
        msg: "",
        count: count,  //用户数量
        data: u        //用户数组
      });
    }
    else {
      //非管理员
      ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
      ctx.res.body = JSON.stringify({ code: 4, msg: '没有管理权限，请更换用户登录!' });
    }
  }
  else {
    //没有登录
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 3, msg: '没有登录，请登录!' });
  }
}

//验证管理员权限处理器
function checkAdmin(jwt) {
  //解析JSON Web Token
  //Header.Payload.Signature
  let json = jwt.split(".");
  //解析Payload
  let tmp = JSON.parse(atob(json[1]));
  //用户类型为2表示管理员
  if (tmp.type == '2') {
    return true;
  }
  return false;
}

//删除处理器
export async function remove(ctx) {
  //获取用户提交数据
  let data = await ctx.req.json();
  //console.log(data);
  //验证数字签名，只能判断用户是否登录及是否过期
  let verify = await ctx.jwt.verify(data.token);
  if (verify) {
    if (checkAdmin(data.token)) { //判断用户是否为管理员
      //在数据库中删除该用户
      let count = 0;
      for(let id of data.ids){
        const deleteCount = await users.deleteOne({ _id: new ObjectId(id) });
        count += deleteCount;
      }
      if (count == data.ids.length) {
        //删除成功
        ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
        ctx.res.body = JSON.stringify({ code: 0, msg: '删除成功!' });
      }
      else {
        //删除失败
        ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
        ctx.res.body = JSON.stringify({ code: 1, msg: '删除失败!' });
      }
    }
    else {
      //非管理员
      ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
      ctx.res.body = JSON.stringify({ code: 4, msg: '没有管理权限，请更换用户登录!' });
    }
  }
  else {
    //没有登录
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 3, msg: '没有登录，请登录!' });
  }
}

//修改密码处理器
export async function modPassword(ctx) {
  //获取用户提交的数据
  let data = await ctx.req.json();
  //验证签名
  let verify = await ctx.jwt.verify(data.token);
  if (verify) {
    //在数据库查找该用户
    const user = await users.findOne({ username: data.username, password: new Hash("md5").digestString(data.oldpassword).hex() });
    if (user) {
      //若用户存在，则修改密码
      const { matchedCount, modifiedCount, upsertedId } = await users.updateOne(
        { username: data.username },
        { $set: { password: new Hash("md5").digestString(data.newpassword).hex() } }
      );

      if (modifiedCount == 1) {
        //修改成功
        ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
        ctx.res.body = JSON.stringify({ code: 0, msg: '修改成功!' });
      }
      else {
        //修改失败
        ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
        ctx.res.body = JSON.stringify({ code: 1, msg: '修改失败!' });
      }
    }
    else {
      //旧密码错误
      ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
      ctx.res.body = JSON.stringify({ code: 2, msg: '旧密码错误!' });
    }
  }
  else {
    //用户没有登录
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 3, msg: '没有登录，请登录!' });
  }
}

//更新数据处理器
export async function update(ctx) {
  //获取用户提交的数据
  let data = await ctx.req.json();
  //验证签名
  let verify = await ctx.jwt.verify(data.token);
  if (verify) {
    if (checkAdmin(data.token)) { //判断用户是否为管理员
      //在数据库查找该文档
      //console.log(data.id);
      const user = await users.findOne({ _id: new ObjectId(data.id) });
      if (user) {
        //若存在，则修改数据
        const { matchedCount, modifiedCount, upsertedId } = await users.updateOne(
          { _id: new ObjectId(data.id) },
          { $set: data.data }
        );
        //console.log(data.data);

        if (modifiedCount == 1) {
          //修改成功
          ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
          ctx.res.body = JSON.stringify({ code: 0, msg: '修改成功!' });
        }
        else {
          //修改失败
          ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
          ctx.res.body = JSON.stringify({ code: 1, msg: '修改失败!' });
        }
      }
      else {
        //修改数据不存在
        ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
        ctx.res.body = JSON.stringify({ code: 2, msg: '修改数据不存在!' });
      }
    }
    else {
      //非管理员
      ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
      ctx.res.body = JSON.stringify({ code: 4, msg: '没有管理权限，请更换用户登录!' });
    }
  }
  else {
    //用户没有登录
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 3, msg: '没有登录，请登录!' });
  }
}

//添加数据处理器
export async function add(ctx) {
  //获取用户提交的数据
  let data = await ctx.req.json();
  //验证签名
  let verify = await ctx.jwt.verify(data.token);
  if (verify) {
    if (checkAdmin(data.token)) { //判断用户是否为管理员
      //在数据库查找该文档
      const user = await users.findOne({ username: data.data.username });
      if (!user) {
        //若不存在，则添加数据
        await users.insertOne({
          username: data.data.username, //用户名
          password: new Hash("md5").digestString(data.data.password).hex(), //密码,md5加密，管理人员都看不到用户密码
          type: data.data.type  //用户类型，普通用户
        });
        //在数据库再次查找该用户
        let user1 = await users.findOne({ username: data.data.username });
        if (user1) {
          //注册成功
          ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
          ctx.res.body = JSON.stringify({ code: 0, msg: '添加成功!' });
        }
        else {
          //注册失败
          ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
          ctx.res.body = JSON.stringify({ code: 1, msg: '添加失败!' });
        }
      }
      else {
        //数据存在
        ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
        ctx.res.body = JSON.stringify({ code: 2, msg: '用户名已存在，请重新添加!' });
      }
    }
    else {
      //非管理员
      ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
      ctx.res.body = JSON.stringify({ code: 3, msg: '没有管理权限，请更换用户登录!' });
    }
  }
  else {
    //用户没有登录
    ctx.res.setHeader("Content-Type", 'application/json;charset=utf-8');
    ctx.res.body = JSON.stringify({ code: 4, msg: '没有登录，请登录!' });
  }
}