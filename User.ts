import { db } from "./mod.js";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

//用户表结构定义
interface UserSchema {
    _id: ObjectId;  //id
    username: string; //用户名
    password: string; //密码
    type: number; // 1:普通用户 2:管理员
}

//绑定到mongodb数据库中users集合
export const users = db.collection<UserSchema>("users");
