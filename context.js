
export class Context{

    constructor(app, req) {
        this.app = app;
        this.req = req;
        this.res = {body:'',status:200, headers:{}};
    }
}