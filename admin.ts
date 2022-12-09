import { db } from "./mod.js";
import { Hash } from "https://deno.land/x/checksum@1.4.0/mod.ts";

interface UserSchema {
  _id: ObjectId; //id
  username: string; //用户名
  password: string; //密码
  type: number; //类型：1普通用户 2管理员
}

const users = db.collection<UserSchema>("users");

//初始化向数据库中添加管理员
const user = await users.findOne({ username: "admin" });

if(!user){
  //管理员用户不存在
  const insertId = await users.insertOne({
    username: "admin",  //管理员帐号，默认admin
    password: new Hash("md5").digestString("admin").hex(), //管理员密码,默认admin
    type: 2 //管理员类型
  });
  console.log("管理员添加成功");
}
else{
  console.log("管理员用户已添加");
}

