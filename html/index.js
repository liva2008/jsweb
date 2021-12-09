
/* 
* @description POST method send data
*
* @param {string} url post address
* @param data may be javascript object, string, FormData, Blob
* @param {string} type may be application/json(javascript object), 
*                    multipart/form-data(FormData), 
*                    text/*, text/plain, text/html, text/css, text/javascript(string)
*                    image/*, image/jpeg, image/png, image/gif, image/svg+xml(Blob)
*                    application/*, application/octet-stream, application/pdf,application/zip(Blob) 
*      
* @return may be javascript object, String, FormData, Blob              
* @license 0.1.6
*/

async function postData(url = '', data = new Blob(), type = 'text/*') {
    
    if(type.match("application/json")){  // application/json
        return await postJSON(url, data);
    }
    else if(type.match("multipart/form-data")){ // multipart/form-data
        return await  postFORM(url, data);
    }
    else if(type.match('text/*')){ // text/plain, text/html, text/css, text/javascript
        return await  postTEXT(url, data);
    }
    else{ // image/*, audio/*, video/*, application/*
        return await postBLOB(url, data, type);
    }
}

async function postJSON(url = '', data = {}) {
    // 注释中带*为缺省值
    let res = await fetch(url, {
        method: 'POST', //访问方法：*GET, POST, PUT, DELETE, etc.
        mode: 'cors', //跨域访问:no-cors, *cors, same-origin
        cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
        headers: new Headers({   //提交数据类型
            'Content-Type': 'application/json;charset=utf-8'
        }),
        body: JSON.stringify(data) //body的数据类型要和"Content-Type"一致
    });
    let type = res.headers.get('Content-Type');
    if(type.match("application/json")){  // application/json
        return res.json(); //Javascript Object
    }
    else if(type.match("multipart/form-data")){ // multipart/form-data
        return res.formData(); // FormData
    }
    else if(type.match('text/*')){ // text/plain, text/html, text/css, text/javascript
        return res.text();  //String
    }
    else{ // image/*, audio/*, video/*, application/*
        return res.blob();  //Blob
    }
    return ; 
}

async function postFORM(url = '', data = new FormData()) {
    // 注释中带*为缺省值
    let res = await fetch(url, {
        method: 'POST', //访问方法：*GET, POST, PUT, DELETE, etc.
        mode: 'cors', //跨域访问:no-cors, *cors, same-origin
        cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
        headers: new Headers({   //提交数据类型
            //'Content-Type': 'multipart/form-data'
        }),
        body: data //body的数据类型要和"Content-Type"一致
    });
    let type = res.headers.get('Content-Type');
    if(type.match("application/json")){  // application/json
        return res.json(); //Javascript Object
    }
    else if(type.match("multipart/form-data")){ // multipart/form-data
        return res.formData(); // FormData
    }
    else if(type.match('text/*')){ // text/plain, text/html, text/css, text/javascript
        return res.text();  //String
    }
    else{ // image/*, audio/*, video/*, application/*
        return res.blob();  //Blob
    }
    return ; 
}

async function postTEXT(url = '', data = '') {
    // 注释中带*为缺省值
    let res = await fetch(url, {
        method: 'POST', //访问方法：*GET, POST, PUT, DELETE, etc.
        mode: 'cors', //跨域访问:no-cors, *cors, same-origin
        cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
        headers: new Headers({   //提交数据类型
            'Content-Type': 'text/plain;charset=utf-8'
        }),
        body: data //body的数据类型要和"Content-Type"一致
    });
    let type = res.headers.get('Content-Type');
    if(type.match("application/json")){  // application/json
        return res.json(); //Javascript Object
    }
    else if(type.match("multipart/form-data")){ // multipart/form-data
        return res.formData(); // FormData
    }
    else if(type.match('text/*')){ // text/plain, text/html, text/css, text/javascript
        return res.text();  //String
    }
    else{ // image/*, audio/*, video/*, application/*
        return res.blob();  //Blob
    }
    return ; 
}

async function postBLOB(url = '', data = new Blob(), type = 'text/*') {
    // 注释中带*为缺省值
    let res = await fetch(url, {
        method: 'POST', //访问方法：*GET, POST, PUT, DELETE, etc.
        mode: 'cors', //跨域访问:no-cors, *cors, same-origin
        cache: 'no-cache', //缓存方法：*default, no-cache, reload, force-cache, only-if-cached
        headers: new Headers({   //提交数据类型
            'Content-Type': type
        }),
        body: data//body的数据类型要和"Content-Type"一致
    });

    let type1 = res.headers.get('Content-Type');
    if(type1.match("application/json")){  // application/json
        return res.json(); //Javascript Object
    }
    else if(type1.match("multipart/form-data")){ // multipart/form-data
        return res.formData(); // FormData
    }
    else if(type1.match('text/*')){ // text/plain, text/html, text/css, text/javascript
        return res.text();  //String
    }
    else{ // image/*, audio/*, video/*, application/*
        let ret = await  res.blob();  //Blob
        // Blob to arrayBuffer
        //let ab = await ret.arrayBuffer();
        //console.log(ab, 'test');
        return ret;
        
        /* ArrayBuffer to Blob
        let ret = await res.arrayBuffer();
        console.log(ret);
        return new Blob([ret], {type:type1});
        */
    }
    return ;  
}