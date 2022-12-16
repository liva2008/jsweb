//session中间件: 将session对象添加到context对象中
//使用方法：
// let s = new Session();
// app.use(s.add());
export class Session{
    // 用户会话数据结构
	// {用户名:{iat:'创建时间', exp:'失效时间', k1:v1, k2:v2, ... , kn:vn}}
    #session = {};
    constructor(){
        //定期清理过期的session,节省内存空间
        setInterval(() => {
            for(let n in this.#session){
                if(Date.now() - this.#session[n].iat > this.#session[n].exp){
                    console.log('delete', this.#session[n]);
                    delete this.#session[n];
                }
            }
        }, 1000 * 60 * 1);
    }

    //{ username: user.username, type: user.type, exp: 1000 * 60 * 60 * 12, iat: Date.now() }
    set(s){
        this.#session[s.username] = s;
    }

    get(k){
        //刷新失效时间
        this.#session[k].iat = Date.now();
        return this.#session[k];
    }

    del(k){
        delete this.#session[k];
    }

    exist(k){
        return this.#session.hasOwnProperty(k);
    }

    //session middlerware
    add() {
        return async (ctx, next) => {
			ctx.session = this;
            await next();
        }
    }
}