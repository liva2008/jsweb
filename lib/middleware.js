
/* 
jsWeb中间件采用一种类似递归调用的方式进行级联， 当执行到 await next()语句时，jsweb暂停了该中间件，
继续执行下一个符合请求的中间件,在没有更多的中间件执行下游之后，堆栈将退出，并且每个中间件被恢复以执行其上游行为。
*/
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