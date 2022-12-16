//JSON Web Token:将jwt对象添加到context对象中
import {  db } from "./mongodb.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

//密钥表结构定义(只有一个name为jswebsecret的文档)
interface UserSchema {
    _id: ObjectId;  //id
    name: string; //name:'jswebsecret'
    secretkey: string; //密钥
    publickey: string; //公钥
    privatekey: string; //私钥
  }

  //绑定到mongodb数据库中secrets集合
const secrets = db.collection<UserSchema>("secrets");

export class jwt {
	constructor() {
		this.key = null;
		this.keyPair = {};
		this.header = {
			"alg": "HS256",
			"typ": "JWT"
		  };
	}

	//jwt middlerware
    add() {
        return async (ctx, next) => {
			ctx.jwt = this;
            await next();
        }
    }

	//从mongodb加载密钥
	async loadKey(){
		let s = await secrets.findOne({name: 'jswebsecrets'})
		if(s){
			//存在，则导入密钥
			await this.importKey(s.secretkey);
			await this.importPublicKey(s.publickey);
			await this.importPrivateKey(s.privatekey);
		}
		else{
			//不存在
			console.log("没有创建密钥，请在server路径下运行deno run -A jwt.js");
		}
	}
	//向mongodb存储密钥
	async storeKey(){
		let secretKey = await this.exportKey();
		let publicKey = await this.exportPublicKey();
		let privateKey = await this.exportPrivateKey();
		let s = await secrets.findOne({name: 'jswebsecrets'})
		if(s){
			//存在，则更新
			const { matchedCount, modifiedCount, upsertedId } = await secrets.updateOne({name: 'jswebsecrets'}, {$set: {secretkey: secretKey, publickey: publicKey, privatekey: privateKey}})
			if(modifiedCount){
				console.log("密钥成功保存");
			}
			else{
				console.log("密钥保存失败");
			}
		}
		else{
			//不存在，则插入
			let ret = await secrets.insertOne({name: 'jswebsecrets', secretkey: secretKey, publickey: publicKey, privatekey: privateKey});
			if(ret){
				console.log("密钥成功保存");
			}
			else{
				console.log("密钥保存失败");
			}
		}
	}

	//产生密钥
	async generateKey() {
		this.key = await window.crypto.subtle.generateKey(
			{
				name: "HMAC",
				hash: { name: "SHA-512" }
			},
			true,
			["sign", "verify"]
		);
	}

	//导出密钥
	async exportKey(){
		const exported = await window.crypto.subtle.exportKey(
			"jwk",
			this.key
		  );
		return exported;
	}

	//导入密钥
	async importKey(jwk){
		this.key = await window.crypto.subtle.importKey(
			"jwk",
			jwk,
			{
				name: "HMAC",
				hash: { name: "SHA-512" }
			},
			true,
			["sign", "verify"]
		  );
	}

	//产生公钥，私钥
	async generateKeyPair() {
		this.keyPair = await window.crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				// Consider using a 4096-bit key for systems that require long-term security
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: "SHA-256",
			},
			true,
			["encrypt", "decrypt"]
		)
	}

	//导出公钥
	async exportPublicKey(){
		const exported = await window.crypto.subtle.exportKey(
			"jwk",
			this.keyPair.publicKey
		  );
		return exported;
	}

	//导出私钥
	async exportPrivateKey(){
		const exported = await window.crypto.subtle.exportKey(
			"jwk",
			this.keyPair.privateKey
		  );
		return exported;
	}

	//导入公钥
	async importPublicKey(jwk){
		this.keyPair.publicKey = await window.crypto.subtle.importKey(
			"jwk",
			jwk,
			{
				name: "RSA-OAEP",
				hash: { name: "SHA-256" }
			},
			true,
			["encrypt"]
		  );
	}

	//导入私钥
	async importPrivateKey(jwk){
		this.keyPair.privateKey = await window.crypto.subtle.importKey(
			"jwk",
			jwk,
			{
				name: "RSA-OAEP",
				hash: { name: "SHA-256" }
			},
			true,
			["decrypt"]
		  );
	}


	//ArrayBuffer转Base64
	arrayBufferToBase64(buffer) {
		let str = "";
		const bytes = new Uint8Array(buffer);
		for (let i = 0; i < bytes.length; i++) {
			str += String.fromCharCode(bytes[i]);
		}
		return window.btoa(str);
	}

	//Base64转ArrayBuffer
	base64ToArrayBuffer(base64) {
		const str = window.atob(base64);
		const byteLength = str.length;
		const bytes = new Uint8Array(byteLength);
		for (let i = 0; i < byteLength; i++) {
			bytes[i] = str.charCodeAt(i);
		}
		return bytes.buffer;
	}

	//签名
	async sign(payLoad) {
		try {
			let data = new TextEncoder().encode(JSON.stringify(payLoad));
			const algorithm = "HMAC";
			const signature = await window.crypto.subtle.sign(
				algorithm,
				this.key,
				data
			);
			return btoa(JSON.stringify(this.header)) + "." + 
				   btoa(JSON.stringify(payLoad)) + "." +
				this.arrayBufferToBase64(signature);
		} catch (e) {
			return `error signing message: ${e}`;
		}
	};

	//验签
	async verify(jwt) {
		if(!jwt) return false;
		try {
			let json = jwt.split(".");
			//console.log(json[2]);
			let signature = this.base64ToArrayBuffer(json[2].toString());
			let tmp = atob(json[1]);
			let payLoad = new TextEncoder().encode(tmp);
			const algorithm = "HMAC";
			const result = await window.crypto.subtle.verify(
				algorithm,
				this.key,
				signature, payLoad
			);
			//检查token是否过期
			if(result){
				let load = JSON.parse(tmp);
				//console.log(load);
				if(Date.now() - load.iat > load.exp){
					return false; //过期
				}
			}
			return result;
		} catch (e) {
			return `error verifing message: ${e}`;
		}
	};

	//加密
	async encrypt(messageJSON) {
		try {
			let data = new TextEncoder().encode(JSON.stringify(messageJSON));

			const algorithm = { name: "RSA-OAEP" };
			const encryptedData = await window.crypto.subtle.encrypt(
				algorithm,
				this.keyPair.publicKey,
				data
			);
			return this.arrayBufferToBase64(encryptedData);
		} catch (e) {
			return `error encrypting message: ${e}`;
		}
	};

	//解密
	async decrypt(base64) {
		if(!base64) return JSON.stringify({});
		try {
			let data = this.base64ToArrayBuffer(base64);
			const algorithm = { name: "RSA-OAEP" };
			const decryptedData = await window.crypto.subtle.decrypt(
				algorithm,
				this.keyPair.privateKey,
				data
			);
			return new TextDecoder().decode(decryptedData);
		} catch (e) {
			return `error decrypting message: ${e}`;
		}
	};
}