class JSWEBElement extends HTMLElement {
    //要监听的元素属性(attributes)为静态属性attributes
    //要对应的属性变量(properties)为代理对象this.props
    //元素属性监听通过observedAttributes()设置
    //元素属性变化则通过attributeChangedCallback回调函数更新属性变量
    //属性变量的监听通过Proxy代理实现
    //尾性变量变化则更新元素视图
    //元素属性和属性变量实现双向绑定
    static attributes = {};

    constructor() {
        super();
        //let template = document.createElement('template');
        let style = document.createElement('style');
        style.id = "jswebstyle";
        var div = document.createElement('div');
        div.id = "jswebcontent";
        //this指向自定义元素本身
        let shadow = this.attachShadow({ mode: 'open' });
        //shadow指向this.shadowRoot
        //shadow.appendChild(template.content.cloneNode(true));
        shadow.appendChild(style);
        shadow.appendChild(div);

        //connectedCallback函数执行之后再开始属性变量变化后的更新功能
        this.startListen = false;
        
        //存储属性变量
        let propValue={};

        //组件内部状态
        let stateValue = {};

        //用代理监听属性变量的变化,若变化，则调用更新
        //对属性变量更改，通过this.props代理实现元素视图更新
        this.props = new Proxy(propValue, {
            set: async (target, prop, val)=>{
                console.log(target, prop, val);
                target[prop] = val;
                if(this.startListen){
                    //更新元素视图
                    await this.render();
                    await this.events();
                }
                return true;
            }
        })

        //代理监听组件状态变化，变化则更新
        this.state = new Proxy(stateValue, {
            set: async (target, prop, val)=>{
                console.log(target, prop, val);
                target[prop] = val;
                if(this.startListen){
                    //更新元素视图
                    await this.render();
                    await this.events();
                }
                return true;
            }
        })

        console.log("super constructor");
    }

    //样式
    css(style) {
        this.shadowRoot.querySelector("#jswebstyle").innerHTML = style;
    }

    //HTML
    html(content) {
        this.shadowRoot.querySelector("#jswebcontent").innerHTML = content;
    }

    //渲染处理接口
    //要调用html()进行真正渲染
    async render() {
        console.log("super render");
    }

    //事件处理接口
    //不能使用内联事件处理器，即给元素添加onevent属性处理事件的方法
    //只能通过外部事件处理器和addEventListener()方法
    //首先，添加的事件的元素要设置id，通过this.shadowRoot.querySelector('#id')找到元素
    //再次，事件处理器要用箭头函数或通过bind(this)方法将this对象绑定到事件处理器中，this才指向自定义元素本身
    //this.shadowRoot.querySelector("#").onevent = (event) => { 事件处理过程; };
    //this.shadowRoot.querySelector("#").addEventListener('event', (event)=>{ 事件处理过程; });
    async events() {

    }

    //插入DOM时调用
    async connectedCallback() {
        console.log("connectedCallback");

        //更新元素视图
        await this.render();
        await this.events();

        //开始监听属性变量的变化更新元素视图
        this.startListen = true;
    }

    //设置要监听的元素属性
    static get observedAttributes() {
        console.log("observedAttributes",this.attributes);
        let prop = [];
        //将监听元素的属性添加到prop数组中
        for (let i in this.attributes) {
            prop.push(i);
        }
        //返回要监听的元素属性数组
        return prop;
    }

    //元素属性变化调用
    async attributeChangedCallback(name, oldValue, newValue) {
        console.log("attributeChangedCallback", name, oldValue, newValue);
        //元素属性变化，则更新属性变量，属性变量变化，则更新元素视图
        this.props[name] = newValue;

        //await this.render();
        //await this.events();
    }
}