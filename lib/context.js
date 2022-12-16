//上下文
export class Context{

    constructor(app, req) {
        this.app = app; //应用程序
        this.req = req; //请求对象
        this.res = {body:'',status:200, headers:{}}; //响应对象
        this.jwt = null;  //JSON Web Token
        this.session = null; //Session
    }
}