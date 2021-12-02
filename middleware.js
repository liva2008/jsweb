
/* 将多个中间件组合成一个中间件*/
export function compose(middleware){
    return function composedMiddleware(context, next){
        let index = -1;

        async function dispatch(i){
            if (i <= index){
                throw new Error("next() called multiple times.");
            }
            index = i;
            let fn = middleware[i];

            if(i === middleware.length){
                fn = next;
            }
            if(!fn){
                return;
            }
            return fn(context, dispatch.bind(null, i + 1));
        }
        return dispatch(0);
    }
}