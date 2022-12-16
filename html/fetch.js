//服务器提交的基址
let baseUrl = 'http://127.0.0.1:5000';
//let baseUrl = 'https://www.jscoding.net/jsweb';

/* 
* @description POST method send data
*
* @param {string} url request address
* @param {string} method request method(GET, PUT, DELETE, POST)
* @param data may be javascript object, string, FormData, Blob
* @param {string} requestType may be application/json(javascript object), 
*                    multipart/form-data(FormData), 
*                    text/*, text/plain, text/html, text/css, text/javascript(string)
*                    image/*, image/jpeg, image/png, image/gif, image/svg+xml(Blob)
*                    application/*, application/octet-stream, application/pdf,application/zip(Blob) 
* @param {string}  responseType text, json, blob, formdata, arraybuffer, stream  
* @param {string}  token is jwt or sessionid 
* @return Response Object              
* @license 0.1.6
*/
async function jswebFetchData(url = '',method ='GET', data = '', requestType = 'text/*', token = '') {

    if (requestType.match("application/json")) {  // application/json
        return await jswebFetchJSON(url, method, data, token);
    }
    else if (requestType.match("multipart/form-data")) { // multipart/form-data
        return await jswebFetchForm(url, method, data, token);
    }
    else if (requestType.match('text/*')) { // text/plain, text/html, text/css, text/javascript
        return await jswebFetchText(url, method, data, token);
    }
    else { // image/*, audio/*, video/*, application/*
        return await jswebFetchBlob(url, method, data, requestType, token);
    }
}

async function jswebFetchJSON(url, method = 'GET', data = {}, token = '') {
    let res;
    if (method == 'GET') {
        res = await fetch(url, {
            method: 'GET', //访问方法：*GET, POST, PUT, DELETE, etc.
            mode: 'cors', //跨域访问:no-cors, *cors, same-origin
            cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
            headers: new Headers({   //提交数据类型
                //'Content-Type': 'multipart/form-data'
                'Authorization': token
            }),
        });
    } else {
        res = await fetch(url, {
            method: method, //访问方法：*GET, POST, PUT, DELETE, etc.
            mode: 'cors', //跨域访问:no-cors, *cors, same-origin
            cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
            headers: new Headers({   //提交数据类型
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': token
            }),
            body: JSON.stringify(data) //body的数据类型要和"Content-Type"一致
        });
    }
   
    return res;
}


async function jswebFetchForm(url, method = 'GET', data = new FormData(), token = '') {
    let res;
    if (method == 'GET') {
        res = await fetch(url, {
            method: 'GET', //访问方法：*GET, POST, PUT, DELETE, etc.
            mode: 'cors', //跨域访问:no-cors, *cors, same-origin
            cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
            headers: new Headers({   //提交数据类型
                //'Content-Type': 'multipart/form-data'
                'Authorization': token
            }),
        });
    } else {
        res = await fetch(url, {
            method: method, //访问方法：*GET, POST, PUT, DELETE, etc.
            mode: 'cors', //跨域访问:no-cors, *cors, same-origin
            cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
            headers: new Headers({   //提交数据类型
                //'Content-Type': 'multipart/form-data'
                'Authorization': token
            }),
            body: data //body的数据类型要和"Content-Type"一致
        });
    }
    
    return res;
}

async function jswebFetchBlob(url, method = 'GET', data = new Blob(), requestType = 'text/*', token = '') {
    let res;
    if (method == 'GET') {
        res = await fetch(url, {
            method: 'GET', //访问方法：*GET, POST, PUT, DELETE, etc.
            mode: 'cors', //跨域访问:no-cors, *cors, same-origin
            cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
            headers: new Headers({   //提交数据类型
                //'Content-Type': 'multipart/form-data'
                'Authorization': token
            }),
        });
    } else {
        res = await fetch(url, {
            method: method, //访问方法：*GET, POST, PUT, DELETE, etc.
            mode: 'cors', //跨域访问:no-cors, *cors, same-origin
            cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
            headers: new Headers({   //提交数据类型
                'Content-Type': requestType,
                'Authorization': token
            }),
            body: data //body的数据类型要和"Content-Type"一致
        });
    }
    
    return res;
}

async function jswebFetchText(url, method = 'GET', data = '', token = '') {
    let res;
    if (method == 'GET') {
        res = await fetch(url, {
            method: 'GET', //访问方法：*GET, POST, PUT, DELETE, etc.
            mode: 'cors', //跨域访问:no-cors, *cors, same-origin
            cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
            headers: new Headers({   //提交数据类型
                //'Content-Type': 'multipart/form-data'
                'Authorization': token
            }),
        });
    } else {
        res = await fetch(url, {
            method: method, //访问方法：*GET, POST, PUT, DELETE, etc.
            mode: 'cors', //跨域访问:no-cors, *cors, same-origin
            cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
            headers: new Headers({   //提交数据类型
                'Content-Type': 'text/plain;charset=utf-8',
                'Authorization': token
            }),
            body: data //body的数据类型要和"Content-Type"一致
        });
    }
    
    return res;
}