class Componnet {
    constructor(objName) {
        this.objName = objName;
    }
}

function guid() {
    return 'jswebxxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function render(componnet, containter) {
    if (containter) {
        if (componnet.toString().match(/^class/)) {
            let objName = guid();
            window[objName] = new componnet(objName);
            window[objName].objName = objName;
            document.getElementById(containter).innerHTML = window[objName].render();
        } else if (componnet.toString().match(/^function/)) {
            document.getElementById(containter).innerHTML = componnet();
        } else {
            document.getElementById(containter).innerHTML = componnet;
        }
    } else {
        if (componnet.toString().match(/^class/)) {
            let objName = guid();
            window[objName] = new componnet(objName);
            window[objName].objName = objName;
            return window[objName].render();
        } else if (componnet.toString().match(/^function/)) {
            return componnet();
        } else {
            return componnet;
        }
    }
}