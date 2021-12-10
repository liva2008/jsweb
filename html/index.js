
/* 
* @description POST method send data
*
* @param {string} url post address
* @param data may be javascript object, string, FormData, Blob
* @param {string} requestType may be application/json(javascript object), 
*                    multipart/form-data(FormData), 
*                    text/*, text/plain, text/html, text/css, text/javascript(string)
*                    image/*, image/jpeg, image/png, image/gif, image/svg+xml(Blob)
*                    application/*, application/octet-stream, application/pdf,application/zip(Blob) 
* @param {string}  responseType text, json, blob, formdata, arraybuffer, stream     
* @return may be javascript object, String, FormData, Blob              
* @license 0.1.6
*/

async function postData(url = '', data = '', requestType = 'text/*', responseType = 'text') {
    
    if(requestType.match("application/json")){  // application/json
        return await postJSON(url, data, responseType);
    }
    else if(requestType.match("multipart/form-data")){ // multipart/form-data
        return await  postFORM(url, data, responseType);
    }
    else if(requestType.match('text/*')){ // text/plain, text/html, text/css, text/javascript
        return await  postTEXT(url, data, responseType);
    }
    else{ // image/*, audio/*, video/*, application/*
        return await postBLOB(url, data, requestType, responseType);
    }
}

async function postJSON(url = '', data = {}, responseType) {
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
    /*
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
    */
    if(responseType == 'json'){
        return res.json();
    }
    else if(responseType == 'text'){
        return res.text();
    }
    else if(responseType == 'formdata'){
        return res.formData();
    }
    else if(responseType == 'blob'){
        return res.blob();
    }
    else if(responseType == 'arraybuffer'){
        return res.arrayBuffer();
    }
    else if(responseType == 'stream'){
        return res.body;
    }
    return ; 
}

async function postFORM(url = '', data = new FormData(), responseType) {
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
    /*
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
    */
    if(responseType == 'json'){
        return res.json();
    }
    else if(responseType == 'text'){
        return res.text();
    }
    else if(responseType == 'formdata'){
        return res.formData();
    }
    else if(responseType == 'blob'){
        return res.blob();
    }
    else if(responseType == 'arraybuffer'){
        return res.arrayBuffer();
    }
    else if(responseType == 'stream'){
        return res.body;
    }
    return ; 
}

async function postTEXT(url = '', data = '', responseType) {
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
    /*
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
    */
    if(responseType == 'json'){
        return res.json();
    }
    else if(responseType == 'text'){
        return res.text();
    }
    else if(responseType == 'formdata'){
        return res.formData();
    }
    else if(responseType == 'blob'){
        return res.blob();
    }
    else if(responseType == 'arraybuffer'){
        return res.arrayBuffer();
    }
    else if(responseType == 'stream'){
        return res.body;
    }
    return ; 
}

async function postBLOB(url = '', data = new Blob(), type = 'text/*', responseType) {
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
    /*
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
        
        //ArrayBuffer to Blob
        //let ret = await res.arrayBuffer();
        //console.log(ret);
        //return new Blob([ret], {type:type1});
    }
    */
    if(responseType == 'json'){
        return res.json();
    }
    else if(responseType == 'text'){
        return res.text();
    }
    else if(responseType == 'formdata'){
        return res.formData();
    }
    else if(responseType == 'blob'){
        return res.blob();
    }
    else if(responseType == 'arraybuffer'){
        return res.arrayBuffer();
    }
    else if(responseType == 'stream'){
        return res.body;
    }
    return ;  
}