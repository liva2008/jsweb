import { makeCaptcha, jwt, db } from "./mod.js";

//JSON Web Token
let j = new jwt();
//HMAC加密算法，产生密钥,用于数字签名
await j.generateKey();

//RSA-OAEP加密算法，产生私钥公钥对，用于加密信息
await j.generateKeyPair();

//存储密钥
await j.storeKey();