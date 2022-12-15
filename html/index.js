
class TestInput1Element extends JSWEBElement {
    //设置要监听的元素属性, 对应的属性变量为this.props.value,实现双向绑定
    static attributes = {
        value: { type: String }
    };

    constructor() {
        super();

        //设置样式集
        this.css(`.myinput{ border: red solid 1px;}`);

        console.log("sub constructor");
    }

    events() {
        //this指向自定义元素
        /*
        this.shadowRoot.querySelector("#myinput").addEventListener('blur', (event) => {
            this.props.value = this.shadowRoot.querySelector("#myinput").value;
        });
        */

        this.shadowRoot.querySelector("#myinput").onblur = (event) => {
            this.props.value = this.shadowRoot.querySelector("#myinput").value;
        };
    }

    render() {
        this.html(`<input id="myinput" type='text' value="${this.props.value}">
            <div id="mydisplay">${this.props.value}</div>
        `)
    }
}

class TimerElement extends JSWEBElement{
    constructor(){
        super();
        this.state['seconds'] = 0;

        setInterval(() => {
            console.log(this.state.seconds);
            this.state.seconds += 1;
        }, 1000);
    }

    render(){
        this.html(`<div>Seconds: ${this.state.seconds}</div>`);
    }
}

class TestInputElement extends JSWEBElement {

    constructor() {
        super();

        //设置样式集
        this.css(`.myinput{ border: red solid 1px;}`);

    }

    events() {
        this.shadowRoot.querySelector("#myinput").addEventListener('input', (event) => {
            this.shadowRoot.querySelector("#mydisplay").innerHTML = this.shadowRoot.querySelector("#myinput").innerHTML;
        });
    }

    render() {
        this.html(`<div id='myinput' class='myinput' contenteditable='true'></div>
            <div id="mydisplay"></div>
        `)
    }
}

class TestElement extends JSWEBElement {
    //设置要监听的元素属性, 对应的属性变量为this.props.value,实现双向绑定
    static attributes = {
        name: { type: String },
        value: { type: String }
    };

    constructor() {
        super();
        //设置样式集
        this.css(`button{ border: red solid 1px;}`);
    }

    handleClick(event) {
        console.log(this)
        console.log(event.target)
        alert(`${this.props.name} ${this.props.value}`);
    }

    events() {
        this.shadowRoot.querySelector("#mybutton").addEventListener('click', (event) => this.handleClick(event));
    }

    render() {
        //console.log("sub render");
        return this.html(`<button id='mybutton'>${this.props.name} ${this.props.value}</button>`);
    }
}

class TableElement extends JSWEBElement {
    //设置要监听的元素属性, 对应的属性变量为this.props.url,实现双向绑定
    static attributes = {
        url: { type: String },
        columns: { type: String },
        page: { type: Number },
        limit: { type: Number },
        insert: { type: String },
    };

    constructor() {
        super();

        this.data = [];
        this.pages = 0;

        this.css(`
        :host{
            padding: 10px;
            width: 100%;
        }
        .tableycontent {
            top: 100px;
            width: 100%;
        }
        
        .tablerow {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-row-gap: 0px;
            margin-top: 0px;
            margin-bottom: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
            border-top: darkgray solid 1px;
        }
        
        .tablecell {
            padding-left: 20px;
            height: 30px;
            padding-top: 10px;
            margin: 5px;
        }
        ul.pagination {
            display: inline-block;
            padding: 0;
            margin: 0;
        }
        
        ul.pagination li {display: inline;}
        
        ul.pagination li a {
            color: black;
            float: left;
            padding: 8px 16px;
            text-decoration: none;
        }
        
        ul.pagination li a.active {
            background-color: #4CAF50;
            color: white;
        }
        
        ul.pagination li a:hover:not(.active) {background-color: #ddd;}
        `);
    }

    //获取分页数据
    async get(page, limit, url, cols, insert) {
        console.log(this.props.page);
        console.log(page)
        //提交数据
        let body = {
            username: user.username, //当前登录的用户名
            page: page,              //当前页码           
            limit: limit,            //每页行数
            token: user.token        //认证的jwt token
        };
        //GET 方法 参数附加到URL中
        //username可能是中文，token采用base64编码，因此要用encodeURIComponent编码，解析要用decodeURIComponent解码
        let dataurl = url + `?username=${encodeURIComponent(user.username)}&page=${page}&limit=${limit}&token=${encodeURIComponent(user.token)}`;
        //提交操作
        let res = await jswebFetchData(dataurl, 'GET', {}, "application/json");
        let ret = await res.json();
        //返回处理
        if (ret.code == 0) {
            this.data = ret.data;

            //表格采用网络布局
            //表头
            let table = `
                <center>
                <h2>用户管理(JSWEB组件)</h2>
                </center>
                <div class="tablecontent">
                `;

            //获取所有列宽
            let colwidth = ``;
            //console.log(cols.length);
            for (let i = 0; i < cols.length; i++) {
                colwidth += ` ${cols[i].width}`;
            }
            //console.log(colwidth);

            //表头
            table += `<div style="display: grid;grid-template-columns: ${colwidth};grid-row-gap: 0px;margin-top: 0px;margin-bottom: 0px;padding-top: 0px;padding-bottom: 0px;border-top: darkgray solid 1px;">`;


            for (let i = 0; i < cols.length; i++) {
                table += `<div class="tablecell"><b>${cols[i].title}</b></div>`;
            }

            table += `</div>
            <div id="userlist">`;

            //每一行
            for (let i = 0; i < ret.data.length; i++) {
                table += `<div id='id${ret.data[i]._id}'  style="display: grid;grid-template-columns: ${colwidth};grid-row-gap: 0px;margin-top: 0px;margin-bottom: 0px;padding-top: 0px;padding-bottom: 0px;border-top: darkgray solid 1px;">`;
                //第1列
                table += `<div id='cid${ret.data[i]._id}' class="tablecell" contenteditable="${cols[0].editable ? true : false}"><input type="checkbox" id="sid${ret.data[i]._id}" value="${ret.data[i]._id}">${ret.data[i][cols[0].field]}</div>`;
                for (let j = 1; j < cols.length - 1; j++) {
                    table += `<div id='${cols[j].field}${ret.data[i]._id}' class="tablecell" style="${cols[j].editable ? 'border:gray solid 1px;' : ''}" contenteditable="${cols[j].editable ? true : false}">${ret.data[i][cols[j].field]}</div>`;
                }
                //最后一列
                table += `<div class="tablecell"><input id="del${ret.data[i]._id}" type="button" value="删除"></div>`;
                table += '</div>';
            }
            table += `</div></div>`;

            //分页：首页(|<) 上一页(<<) 当前页 下一页(>>) 尾页(>|)
            this.pages = Math.ceil(ret.count / limit);
            this.page = page;
            let pagination = `
            <ul class="pagination">
                <li><a class="active" id="selectall">全选</a></li>
                <li><a class="active" id="unselectall">取消全选</a></li>
                <li><a class="active" id="delete">删除</a></li>
                ${insert == 'true' ? '<li><a class="active" id="insert">新增</a></li>' : ''}
                <li><a id='firstpage'>|<</a></li>
                <li><a id='prevpage'>\<\<</a></li>
                <li><a class="active">${page}</a></li>
                <li><a id='nextpage'>\>\></a></li>
                <li><a id='tailpage'>\>|</a></li>
            </ul>`;

            //显示表和分页
            return (table + pagination);
        } else {
            //失败返回
            alert(ret.msg);
            return '';
        }
    }

    async render() {
        if (user.type == 2) {
            console.log(this.props.url, this.props.columns, this.props.page, this.props.limit, this.props.insert);
            let ret = await this.get(this.props.page, this.props.limit,
                this.props.url, JSON.parse(this.props.columns), this.props.insert);
            return this.html(ret);
        }
        return '';
    }

    async events() {
        let cols = JSON.parse(this.props.columns);

        //获取所有列宽
        let colwidth = ``;
        //console.log(cols.length);
        for (let i = 0; i < cols.length; i++) {
            colwidth += ` ${cols[i].width}`;
        }

        for (let i = 0; i < this.data.length; i++) {
            //删除事件
            if (this.shadowRoot.querySelector(`#del${this.data[i]._id}`)) {
                this.shadowRoot.querySelector(`#del${this.data[i]._id}`).addEventListener('click', () => this.del(this.shadowRoot, [this.data[i]._id], this.props.url));
                for (let j = 1; j < cols.length - 1; j++) {
                    if (cols[j].editable) {
                        //更新事件
                        if (this.shadowRoot.querySelector(`#${cols[j].field}${this.data[i]._id}`)) {
                            this.shadowRoot.querySelector(`#${cols[j].field}${this.data[i]._id}`).addEventListener('blur', () => {
                                let data = {};
                                data[cols[j].field] = cols[j].type == 'number' ? Number(this.shadowRoot.querySelector(`#${cols[j].field}${this.data[i]._id}`).innerHTML) : this.shadowRoot.querySelector(`#${cols[j].field}${this.data[i]._id}`).innerHTML;
                                this.put(this.data[i]._id, data, this.props.url)
                            })
                        }
                    }
                }
            }
        }

        //新增事件
        if (this.props.insert == 'true') {
            if (this.shadowRoot.querySelector('#insert')) {
                this.shadowRoot.querySelector('#insert').addEventListener('click', () => {
                    //console.log(this.shadowRoot.querySelector('#userlist').innerHTML);
                    let row = `<div id='insertrow' style="display: grid;grid-template-columns: ${colwidth};grid-row-gap: 0px;margin-top: 0px;margin-bottom: 0px;padding-top: 0px;padding-bottom: 0px;border-top: darkgray solid 1px;">
                        <div class="tablecell"></div>`;
                    for (let i = 1; i < cols.length - 1; i++) {
                        row += `<div id='jsweb${cols[i].field}' class="tablecell" style="border:gray solid 1px;" contenteditable="true"></div>`;
                    }
                    row += `<div class="tablecell"><input id="save" type="button" value="保存"></div></div>`;
                    this.shadowRoot.querySelector('#userlist').innerHTML += row;
                    this.shadowRoot.querySelector('#save').onclick = () => {
                        //console.log('click');
                        for (let i = 1; i < cols.length - 1; i++) {
                            if (!this.shadowRoot.querySelector(`#jsweb${cols[i].field}`).innerHTML) {
                                alert(`${cols[i].title}不能为空！`);
                                return false;
                            }
                        }
                        let data = {};
                        for (let i = 1; i < cols.length - 1; i++) {
                            data[cols[i].field] = cols[i].type == 'number' ? Number(this.shadowRoot.querySelector(`#jsweb${cols[i].field}`).innerHTML) : this.shadowRoot.querySelector(`#jsweb${cols[i].field}`).innerHTML;
                        }
                        //console.log(data);
                        this.add(this.shadowRoot, data, this.props.url);
                    }
                });
            }
        }

        //全选事件
        if (this.shadowRoot.querySelector('#selectall')) {
            this.shadowRoot.querySelector('#selectall').addEventListener('click', () => {
                let s = this.shadowRoot.querySelectorAll("input[type=checkbox]");
                console.log(s)
                for (let n of s) {
                    n.checked = true;
                }
            });
        }
        //取消全选
        if (this.shadowRoot.querySelector('#unselectall')) {
            this.shadowRoot.querySelector('#unselectall').addEventListener('click', () => {
                let s = this.shadowRoot.querySelectorAll("input[type=checkbox]");
                for (let n of s) {
                    n.checked = false;
                }
            });
        }
        //删除事件
        if (this.shadowRoot.querySelector('#delete')) {
            this.shadowRoot.querySelector('#delete').addEventListener('click', () => {
                let s = this.shadowRoot.querySelectorAll("input[type=checkbox]");
                let data = [];
                for (let n of s) {
                    if (n.checked) {
                        data.push(n.value);
                    }
                }
                //console.log(data);
                if (data.length == 0) {
                    alert("没有选中行，请选择！");
                } else {
                    this.del(this.shadowRoot, data, this.props.url);
                }
            });
        }

        //分页事件
        if (this.shadowRoot.querySelector('#firstpage')) {
            this.shadowRoot.querySelector('#firstpage').addEventListener('click', async () => {
                //let ret = await this.get(1, this.limit, this.url, JSON.parse(this.columns), this.insert);
                //this.html(ret);
                //await this.events();
                //更新属性，页面刷新
                //this.setAttribute('page', 1);
                this.props.page = 1;
            });
            this.shadowRoot.querySelector('#prevpage').addEventListener('click', async () => {
                //let ret = await this.get(this.page > 1 ? (this.page - 1) : 1, this.limit, this.url, JSON.parse(this.columns), this.insert)
                //this.html(ret);
                //await this.events();
                //this.setAttribute('page', this.page > 1 ? (this.page - 1) : 1);
                this.props.page = this.props.page > 1 ? (this.props.page - 1) : 1;
            });
            this.shadowRoot.querySelector('#nextpage').addEventListener('click', async () => {
                //let ret = await this.get(this.page < this.pages ? (Number(this.page) + 1) : this.pages, this.limit, this.url, JSON.parse(this.columns), this.insert)
                //this.html(ret);
                //await this.events();
                //this.setAttribute('page', this.page < this.pages ? (Number(this.page) + 1) : this.pages);
                this.props.page = this.props.page < this.pages ? (Number(this.props.page) + 1) : this.pages;
            });
            this.shadowRoot.querySelector('#tailpage').addEventListener('click', async () => {
                //let ret = await this.get(this.pages, this.limit, this.url, JSON.parse(this.columns), this.insert)
                //this.html(ret);
                //await this.events();
                //this.setAttribute('page', this.pages);
                this.props.page = this.pages;
            });
        }
    }

    //删除用户
    async del(shadow, ids, url) {
        if (confirm(`确实要删除${ids.length}个记录吗？`)) {
            //提交数据
            let body = {
                currentusername: user.username,
                ids: ids,
                token: user.token
            };
            //提交操作
            let res = await jswebFetchData(url, 'DELETE', body, "application/json");
            let ret = await res.json();
            //返回处理
            if (ret.code == 0) {
                //成功
                let userlist = shadow.querySelector("#userlist");
                for (let id of ids) {
                    let n = shadow.getElementById(`id${id}`);
                    userlist.removeChild(n);
                }
            } else if (ret.code == 1) {
                alert(ret.msg);
            } else if (ret.code == 3) {
                alert(ret.msg);
                location.href = 'login.html';
            }
        }
    }

    //修改数据
    async put(id, data, url) {
        //提交数据
        let body = {
            currentusername: user.username,
            token: user.token,
            id: id,
            data: data
        };
        //console.log(JSON.stringify(body))
        //提交操作
        let res = await jswebFetchData(url, 'put', body, "application/json");
        let ret = await res.json();
        //返回处理
        if (ret.code == 0) {
            //成功

        } else if (ret.code == 1) {
            alert(ret.msg);
        } else if (ret.code == 3 || ret.code == 4) {
            alert(ret.msg);
            location.href = 'login.html';
        }
    }

    //添加数据
    async add(shadow, data, url) {
        //提交数据
        let body = {
            currentusername: user.username,
            token: user.token,
            data: data
        };
        //console.log(JSON.stringify(body))
        //提交操作
        let res = await jswebFetchData(url, 'post', body, "application/json");
        let ret = await res.json();
        //返回处理
        if (ret.code == 0) {
            //成功
            alert(ret.msg);
            let i = shadow.querySelector('#insertrow');
            console.log(i);
            i.parentNode.removeChild(i);
        } else if (ret.code == 1 || ret.code == 2) {
            alert(ret.msg);
        } else if (ret.code == 3 || ret.code == 4) {
            alert(ret.msg);
            location.href = 'login.html';
        }
    }
}

class Reg extends HTMLElement {
    constructor() {
        super();
        let template = document.createElement('template');
        template.innerHTML = `
        <style>
        :host{
            margin:  0px;
            padding:  0px;
            width: 100%;
        }
        .form {
            border-radius: 5px;
            background-color: #f2f2f2;
            padding: 20px;
            width: 97%;
        }
        
        form>input[type=text] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        form>input[type=password] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        form>input[type=button] {
            width: 100%;
            background-color: #4CAF50;
            color: white;
            padding: 14px 20px;
            margin: 8px 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        form>input[type=button]:hover {
            background-color: #4CAF50;
        }        
        </style>
        <center><h3>用户注册(组件)</h3></center>
        <div class="form">
            <form>
            <label for="username">Username<span id="umsg" style="color: red;"></span></label>
            <input type="text" id="username" name="username" placeholder="Your username..">

            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Your password..">

            <label for="confirmPassword">Confirm Password<span id="pmsg" style="color: red;"></span></label>
            <input type="password" id="confirmpassword" name="confirmpassword" placeholder="Your confirm password..">

            <label for="captcha">Captcha<span id="cmsg" style="color: red;"></span><img id="code" /></label>
            <input type="text" id="captcha" name="captcha" placeholder="click here and get the captcha..">
            <input id="submit" type="button" value="Submit">
            </form>
        </div>
        
        `;
        let shadow = this.attachShadow({ mode: 'closed' });
        shadow.appendChild(template.content.cloneNode(true));

        //根据用户名获取验证码，防止机器人暴力破解密码
        let text;
        shadow.querySelector("#captcha").addEventListener('focus', getCaptcha);
        async function getCaptcha() {
            //提交地址
            let url = `${baseUrl}/user/code`
            //提交操作
            let res = await jswebFetchData(url, 'POST',  {}, 'application/json');
            let ret = await res.json();
            //返回图片验证码
            shadow.querySelector("#code").src = ret.code;
            //返回加密验证码:用于在服务端解密之后与输入的验证码比对
            text = ret.text;
        }

        //检测用户名是否存在
        shadow.querySelector("#username").addEventListener('blur', checkUsername);
        async function checkUsername() {
            let username = shadow.querySelector("#username");
            if (username.value == null || username.value == '') {
                username.placeholder = "用户名不能为空，请输入用户名!";
                return false;
            }
            //提交地址
            let url = `${baseUrl}/user/check`;
            //提交数据
            let body = {
                username: username.value
            };
            //提交操作
            let res = await jswebFetchData(url, 'POST',  body, 'application/json');
            let ret = await res.json();
            //返回处理
            if (ret.code == 0) {
                //成功
                username.style.color = "green";
                shadow.querySelector("#umsg").style.color = "green";
                shadow.querySelector("#umsg").innerHTML = ret.msg;
            } else {
                //失败
                username.style.color = "red";
                shadow.querySelector("#umsg").style.color = "red";
                shadow.querySelector("#umsg").innerHTML = ret.msg;
            }
        }


        //注册用户
        shadow.querySelector("#submit").addEventListener('click', submitCheckAndData);
        async function submitCheckAndData() {
            let username = shadow.querySelector("#username");
            let password = shadow.querySelector("#password");
            let confirmPassword = shadow.querySelector("#confirmpassword");
            let captcha = shadow.querySelector("#captcha");

            if (username.value == null || username.value == '') {
                username.placeholder = "用户名不能为空，请输入用户名!";
                return false;
            }

            if (password.value == null || password.value == '') {
                password.placeholder = "密码不能为空，请输入密码!";
                return false;
            }

            if (confirmPassword.value == null || confirmPassword.value == '') {
                confirmPassword.placeholder = "密码不能为空，请输入密码!";
                return false;
            }

            if (password.value != confirmPassword.value) {
                document.querySelector("#pmsg").innerHTML = "(确认密码与密码不一致，请重新输入密码!)";

                return false;
            }

            if (captcha.value == null || captcha.value == '') {
                document.querySelector("#cmsg").innerHTML = "(验证码错误，请重输!)";

                return false;
            }

            //提交地址
            let url = `${baseUrl}/user/reg`;
            //提交数据
            let body = {
                username: username.value, //用户名
                password: password.value, //密码
                confirmPassword: confirmPassword.value, //确认密码
                captcha: captcha.value,  //输入的验证码
                text: text //服务器返回的加密验证码
            };
            //提交操作
            let res = await jswebFetchData(url, 'POST', body, 'application/json');
            let ret = await res.json();
            //返回处理
            if (ret.code == 0) {
                //成功注册
                alert(ret.msg);
                location.href = "login.html";
            } else if (ret.code == 3) {
                //用户名错误
                shadow.querySelector("#umsg").innerHTML = ret.msg;
            } else if (ret.code == 1 || ret.code == 2) {
                //验证码错误
                shadow.querySelector("#cmsg").innerHTML = ret.msg;
            } else {
                //失败
                alert(ret.msg);
            }
        }
    }
}

class Login extends HTMLElement {
    constructor() {
        super();
        let template = document.createElement('template');
        template.innerHTML = `
        <style>
        :host{
            margin:  0px;
            padding:  0px;
            width: 100%;
        }
        .form {
            border-radius: 5px;
            background-color: #f2f2f2;
            padding: 20px;
            width: 97%;
        }
        
        form>input[type=text] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        form>input[type=password] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        form>input[type=button] {
            width: 100%;
            background-color: #4CAF50;
            color: white;
            padding: 14px 20px;
            margin: 8px 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        form>input[type=button]:hover {
            background-color: #4CAF50;
        }        
        </style>
        <center><h3>登录页面(组件)</h3></center>

        <div class="form">
            <form>
                <label for="username">Username<span id="umsg" style="color: red;"></span></label>
                <input type="text" id="username" name="username" placeholder="Your username..">

                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Your password..">

                <label for="captcha">Captcha<span id="cmsg" style="color: red;"></span><img id="code" /></label>
                <input type="text" id="captcha" name="captcha" placeholder="click here and get the captcha..">

                <input id="submit" type="button" value="Login">
            </form>
        </div>
        `;

        let shadow = this.attachShadow({ mode: 'closed' });
        shadow.appendChild(template.content.cloneNode(true));

        let text;

        //根据用户名获取验证码，防止机器人暴力破解密码
        shadow.querySelector("#captcha").addEventListener('focus', getCaptcha);
        async function getCaptcha() {
            //提交地址
            let url = `${baseUrl}/user/code`
            //提交操作
            let res = await jswebFetchData(url, 'POST',  {}, 'application/json');
            let ret = await res.json();
            //返回图片验证码
            shadow.querySelector("#code").src = ret.code;
            //返回加密验证码:用于在服务端解密之后与输入的验证码比对
            text = ret.text;
        }

        //登录功能
        shadow.querySelector("#submit").addEventListener('click', submitCheckAndData);
        async function submitCheckAndData() {
            let username = shadow.querySelector("#username");
            let password = shadow.querySelector("#password");
            let captcha = shadow.querySelector('#captcha');

            if (username.value == null || username.value == '') {
                username.placeholder = "用户名不能为空，请输入用户名!";
                return false;
            }

            if (password.value == null || password.value == '') {
                password.placeholder = "密码不能为空，请输入密码!";
                return false;
            }

            if (captcha.value == null || captcha.value == '') {
                captcha.placeholder = "点击本框获取验证码!";
                return false;
            }

            //提交地址
            let url = `${baseUrl}/user/login`;
            //提交数据
            let body = {
                username: username.value, //登录用户名
                password: password.value, //密码
                captcha: captcha.value, //输入的验证码
                text: text //服务器返回的加密验证码
            };
            //提交操作
            let res = await jswebFetchData(url, 'POST', body, 'application/json');
            let ret = await res.json();
            //返回处理
            if (ret.code == 0) {
                //成功返回
                //将服务器返回的用户信息（用户名username, 用户类型type, 用户token）存入到localStorage
                //用户登录之后的操作都要将这些用户信息连同其它一起发给服务器
                //这些用户信息用于验证用户身份
                //特别是token包含三部分信息：Header(头部).Payload(负载).Signature(签名)
                localStorage.setItem("user", JSON.stringify({
                    username: username.value,
                    type: ret.type,
                    token: ret.sign
                }));
                //转到index.html页面
                location.href = "index.html";
            } else if (ret.code == 1 || ret.code == 2) {
                //验证码错误 
                shadow.querySelector("#cmsg").innerHTML = ret.msg;
            } else {
                //登录失败
                alert(ret.msg);
            }
        }
    }
}

class Table extends HTMLElement {
    constructor() {
        super();
        let template = document.createElement('template');
        template.innerHTML = `
        <style>
        :host{
            padding: 10px;
            width: 100%;
        }
        .tableycontent {
            top: 100px;
            width: 100%;
        }
        
        .tablerow {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-row-gap: 0px;
            margin-top: 0px;
            margin-bottom: 0px;
            padding-top: 0px;
            padding-bottom: 0px;
            border-top: darkgray solid 1px;
        }
        
        .tablecell {
            padding-left: 20px;
            height: 30px;
            padding-top: 10px;
            margin: 5px;
        }
        ul.pagination {
            display: inline-block;
            padding: 0;
            margin: 0;
        }
        
        ul.pagination li {display: inline;}
        
        ul.pagination li a {
            color: black;
            float: left;
            padding: 8px 16px;
            text-decoration: none;
        }
        
        ul.pagination li a.active {
            background-color: #4CAF50;
            color: white;
        }
        
        ul.pagination li a:hover:not(.active) {background-color: #ddd;}
        </style>
        <div id="content"></div>
        `;
        //shadow == this.shadowRoot
        let shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    //获取分页数据
    async get(shadow, page, limit, url, cols, insert) {
        //提交数据
        let body = {
            username: user.username, //当前登录的用户名
            page: page,              //当前页码           
            limit: limit,            //每页行数
            token: user.token        //认证的jwt token
        };
        //GET 方法 参数附加到URL中
        //username可能是中文，token采用base64编码，因此要用encodeURIComponent编码，解析要用decodeURIComponent解码
        let dataurl = url + `?username=${encodeURIComponent(user.username)}&page=${page}&limit=${limit}&token=${encodeURIComponent(user.token)}`;
        //提交操作
        let res = await jswebFetchData(dataurl, 'GET', {}, "application/json");
        let ret = await res.json();
        //返回处理
        if (ret.code == 0) {
            //成功返回

            //表格采用网络布局
            //表头
            let table = `
                <center>
                <h2>用户管理(标准组件)</h2>
                </center>
                <div class="tablecontent">
                `;

            //获取所有列宽
            let colwidth = ``;
            //console.log(cols.length);
            for (let i = 0; i < cols.length; i++) {
                colwidth += ` ${cols[i].width}`;
            }
            //console.log(colwidth);

            //表头
            table += `<div style="display: grid;grid-template-columns: ${colwidth};grid-row-gap: 0px;margin-top: 0px;margin-bottom: 0px;padding-top: 0px;padding-bottom: 0px;border-top: darkgray solid 1px;">`;


            for (let i = 0; i < cols.length; i++) {
                table += `<div class="tablecell"><b>${cols[i].title}</b></div>`;
            }

            table += `</div>
            <div id="userlist">`;

            //每一行
            for (let i = 0; i < ret.data.length; i++) {
                table += `<div id='id${ret.data[i]._id}'  style="display: grid;grid-template-columns: ${colwidth};grid-row-gap: 0px;margin-top: 0px;margin-bottom: 0px;padding-top: 0px;padding-bottom: 0px;border-top: darkgray solid 1px;">`;
                //第1列
                table += `<div id='cid${ret.data[i]._id}' class="tablecell" contenteditable="${cols[0].editable ? true : false}"><input type="checkbox" id="sid${ret.data[i]._id}" value="${ret.data[i]._id}">${ret.data[i][cols[0].field]}</div>`;
                for (let j = 1; j < cols.length - 1; j++) {
                    table += `<div id='${cols[j].field}${ret.data[i]._id}' class="tablecell" style="${cols[j].editable ? 'border:gray solid 1px;' : ''}" contenteditable="${cols[j].editable ? true : false}">${ret.data[i][cols[j].field]}</div>`;
                }
                //最后一列
                table += `<div class="tablecell"><input id="del${ret.data[i]._id}" type="button" value="删除"></div>`;
                table += '</div>';
            }
            table += `</div></div>`;

            //分页：首页(|<) 上一页(<<) 当前页 下一页(>>) 尾页(>|)
            let pages = Math.ceil(ret.count / limit);
            let pagination = `
            <ul class="pagination">
                <li><a class="active" id="selectall">全选</a></li>
                <li><a class="active" id="unselectall">取消全选</a></li>
                <li><a class="active" id="delete">删除</a></li>
                ${insert == 'true' ? '<li><a class="active" id="insert">新增</a></li>' : ''}
                <li><a id='firstpage'>|<</a></li>
                <li><a id='prevpage'>\<\<</a></li>
                <li><a class="active">${page}</a></li>
                <li><a id='nextpage'>\>\></a></li>
                <li><a id='tailpage'>\>|</a></li>
            </ul>`;

            //显示表和分页
            shadow.querySelector("#content").innerHTML = table + pagination;
            //删除事件
            for (let i = 0; i < ret.data.length; i++) {
                shadow.querySelector(`#del${ret.data[i]._id}`).addEventListener('click', () => this.del(this.shadowRoot, [ret.data[i]._id], url));
                for (let j = 1; j < cols.length - 1; j++) {
                    if (cols[j].editable) {
                        shadow.querySelector(`#${cols[j].field}${ret.data[i]._id}`).addEventListener('input', () => {
                            let data = {};
                            data[cols[j].field] = cols[j].type == 'number' ? Number(shadow.querySelector(`#${cols[j].field}${ret.data[i]._id}`).innerHTML) : shadow.querySelector(`#${cols[j].field}${ret.data[i]._id}`).innerHTML;
                            this.put(ret.data[i]._id, data, url)
                        })
                    }
                }
            }

            //新增数据事件
            if (insert == 'true') {
                shadow.querySelector('#insert').addEventListener('click', () => {
                    //console.log(this.shadowRoot.querySelector('#userlist').innerHTML);
                    let row = `<div id='insertrow' style="display: grid;grid-template-columns: ${colwidth};grid-row-gap: 0px;margin-top: 0px;margin-bottom: 0px;padding-top: 0px;padding-bottom: 0px;border-top: darkgray solid 1px;">
                            <div class="tablecell"></div>`;
                    for (let i = 1; i < cols.length - 1; i++) {
                        row += `<div id='jsweb${cols[i].field}' class="tablecell" style="border:gray solid 1px;" contenteditable="true"></div>`;
                    }
                    row += `<div class="tablecell"><input id="save" type="button" value="保存"></div></div>`;
                    this.shadowRoot.querySelector('#userlist').innerHTML += row;
                    this.shadowRoot.querySelector('#save').onclick = () => {
                        //console.log('click');
                        for (let i = 1; i < cols.length - 1; i++) {
                            if (!shadow.querySelector(`#jsweb${cols[i].field}`).innerHTML) {
                                alert(`${cols[i].title}不能为空！`);
                                return false;
                            }
                        }
                        let data = {};
                        for (let i = 1; i < cols.length - 1; i++) {
                            data[cols[i].field] = cols[i].type == 'number' ? Number(shadow.querySelector(`#jsweb${cols[i].field}`).innerHTML) : shadow.querySelector(`#jsweb${cols[i].field}`).innerHTML;
                        }
                        //console.log(data);
                        this.add(this.shadowRoot, data, url);
                    }
                });
            }

            //全选事件
            shadow.querySelector('#selectall').addEventListener('click', ()=>{
                let s = this.shadowRoot.querySelectorAll("input[type=checkbox]");
                for (let n of s){
                    n.checked = true;
                }
            });
            //取消全选
            shadow.querySelector('#unselectall').addEventListener('click', ()=>{
                let s = this.shadowRoot.querySelectorAll("input[type=checkbox]");
                for (let n of s){
                    n.checked = false;
                }
            });
            //删除事件
            shadow.querySelector('#delete').addEventListener('click', ()=>{
                let s = this.shadowRoot.querySelectorAll("input[type=checkbox]");
                let data = [];
                for (let n of s){
                    if(n.checked){
                        data.push(n.value);
                    }
                }
                //console.log(data);
                if(data.length == 0){
                    alert("没有选中行，请选择！");
                }else{
                    this.del(this.shadowRoot, data, url);
                }
            });

            //分页事件
            shadow.querySelector('#firstpage').addEventListener('click', () => this.get(this.shadowRoot, 1, limit, url, cols, insert));
            shadow.querySelector('#prevpage').addEventListener('click', () => this.get(this.shadowRoot, page > 1 ? (page - 1) : 1, limit, url, cols, insert));
            shadow.querySelector('#nextpage').addEventListener('click', () => this.get(this.shadowRoot, page < pages ? (Number(page) + 1) : pages, limit, url, cols, insert));
            shadow.querySelector('#tailpage').addEventListener('click', () => this.get(this.shadowRoot, pages, limit, url, cols, insert));
        } else {
            //失败返回
            alert(ret.msg);
        }
    }

    //删除用户
    async del(shadow, ids, url) {
        if (confirm(`确实要删除${ids.length}个记录吗？`)) {
            //提交数据
            let body = {
                currentusername: user.username,
                ids: ids,
                token: user.token
            };
            //提交操作
            let res = await jswebFetchData(url, 'DELETE', body, "application/json");
            let ret = await res.json();
            //返回处理
            if (ret.code == 0) {
                //成功
                let userlist = shadow.querySelector("#userlist");
                for(let id of ids){
                    let n = shadow.getElementById(`id${id}`);
                    userlist.removeChild(n);
                }
            } else if (ret.code == 1) {
                alert(ret.msg);
            } else if (ret.code == 3) {
                alert(ret.msg);
                location.href = 'login.html';
            }
        }
    }

    //修改数据
    async put(id, data, url) {
        //提交数据
        let body = {
            currentusername: user.username,
            token: user.token,
            id: id,
            data: data
        };
        //console.log(JSON.stringify(body))
        //提交操作
        let res = await jswebFetchData(url, 'put', body, "application/json");
        let ret = await res.json();
        //返回处理
        if (ret.code == 0) {
            //成功

        } else if (ret.code == 1) {
            alert(ret.msg);
        } else if (ret.code == 3 || ret.code == 4) {
            alert(ret.msg);
            location.href = 'login.html';
        }
    }

    //添加数据
    async add(shadow, data, url) {
        //提交数据
        let body = {
            currentusername: user.username,
            token: user.token,
            data: data
        };
        //console.log(JSON.stringify(body))
        //提交操作
        let res = await jswebFetchData(url, 'post', body, "application/json");
        let ret = await res.json();
        //返回处理
        if (ret.code == 0) {
            //成功
            alert(ret.msg);
            let i = shadow.querySelector('#insertrow');
            console.log(i);
            i.parentNode.removeChild(i);
        } else if (ret.code == 1 || ret.code == 2) {
            alert(ret.msg);
        } else if (ret.code == 3 || ret.code == 4) {
            alert(ret.msg);
            location.href = 'login.html';
        }
    }

    //首次被插入文档 DOM 时调用
    connectedCallback() {
        //this指向自定义元素节点,this.shadowRoot指Shadow DOM根节点
        let cols = this.getAttribute('columns');
        //console.log(JSON.parse(cols))
        if(user.type == 2)
            this.get(this.shadowRoot, this.getAttribute('page'), this.getAttribute('limit'),
                this.getAttribute('url'), JSON.parse(cols), this.getAttribute('insert'));
    }
}

class Menu extends HTMLElement {
    constructor() {
        super();
        let template = document.createElement('template');
        template.innerHTML = `
        <style>
        :host{
            padding: 10px;
            width: 100%;
        }

        /* 容器 <div> - 需要定位下拉内容 */
        .dropdown {
            position: relative;
            display: inline-block;
        }

        /* 下拉按钮样式 */
        ::slotted([slot="title"]) {
            background-color: rgb(56, 56, 56);
            color: white;
            border: none;
            cursor: pointer;
            padding-top: 11px;
            padding-bottom: 11px;
            padding-left: 20px;
            padding-right: 20px;
        }

        /* 下拉内容 (默认隐藏) */
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: rgb(56, 56, 56);
            min-width: 200px;
        }

        /* 下拉菜单的链接 */
        ::slotted([slot="item"]) {
            color: white;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
        }

        /* 在鼠标移上去后显示下拉菜单 */
        .dropdown:hover .dropdown-content {
            display: block;
        }

        /* 当下拉内容显示后修改下拉按钮的背景颜色 */
        ::slotted([slot="title"]:hover) {
            background-color: #999;
        }

        /* 鼠标移上去后修改下拉菜单链接颜色 */
        ::slotted([slot="item"]:hover) {
            background-color: #50BDFF
        }
        </style>

        <div class="dropdown">
            <slot name="title"></slot>
            <div class="dropdown-content"><slot name="item"></slot></div>
        </div>
        `;
        let shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }
}

class Menu1 extends JSWEBElement {
    constructor() {
        super();

        this.css(`
        :host{
            padding: 10px;
            width: 100%;
        }

        /* 容器 <div> - 需要定位下拉内容 */
        .dropdown {
            position: relative;
            display: inline-block;
        }

        /* 下拉按钮样式 */
        ::slotted([slot="title"]) {
            background-color: rgb(56, 56, 56);
            color: white;
            border: none;
            cursor: pointer;
            padding-top: 11px;
            padding-bottom: 11px;
            padding-left: 20px;
            padding-right: 20px;
        }

        /* 下拉内容 (默认隐藏) */
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: rgb(56, 56, 56);
            min-width: 200px;
        }

        /* 下拉菜单的链接 */
        ::slotted([slot="item"]) {
            color: white;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
        }

        /* 在鼠标移上去后显示下拉菜单 */
        .dropdown:hover .dropdown-content {
            display: block;
        }

        /* 当下拉内容显示后修改下拉按钮的背景颜色 */
        ::slotted([slot="title"]:hover) {
            background-color: #999;
        }

        /* 鼠标移上去后修改下拉菜单链接颜色 */
        ::slotted([slot="item"]:hover) {
            background-color: #50BDFF
        }
        `);
    }

    render(){
        this.html(`<div class="dropdown">
        <slot name="title"></slot>
        <div class="dropdown-content"><slot name="item"></slot></div>
    </div>`);
    }
}

customElements.define('jsweb-reg', Reg);
customElements.define('jsweb-login', Login);
customElements.define('jsweb-table', Table);
customElements.define('jsweb-test', TestElement);
customElements.define('jsweb-table1', TableElement);
customElements.define('jsweb-input', TestInputElement);
customElements.define('jsweb-input1', TestInput1Element);
customElements.define('jsweb-menu', Menu);
customElements.define('jsweb-menu1', Menu1);
customElements.define('jsweb-timer', TimerElement);