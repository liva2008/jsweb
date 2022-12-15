//根据hash进行路由
class Router{
    constructor() {
        this.handlers = [];
    }

    route(hash, element){
        this.handlers.push({hash: hash, element: element});
    }

    routes(){
        window.addEventListener('hashchange', ()=>{
            let hash = window.location.hash;

            for(let h of this.handlers){
                if(h.hash == hash){
                    document.querySelector(h.element).style.display = "block";
                }else{
                    document.querySelector(h.element).style.display = "none";
                }
            }
        })
    }
}