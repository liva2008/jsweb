window.jsweb = {};

class Componnet {
    constructor(objectName) {
        this.objectName = 'jsweb.' + objectName;
        this.state = {};
    }
}

function guid() {
    return 'jswebxxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function render(componnet, containter, ...parameter) {
    if (containter) {
        if (componnet.toString().match(/^class/)) {
            let objName = guid();
            window.jsweb[objName] = new componnet(...parameter);
            window.jsweb[objName].objectName = 'jsweb.' + objName;
            document.getElementById(containter).innerHTML = window.jsweb[objName].render();
        } else if (componnet.toString().match(/^function/)) {
            document.getElementById(containter).innerHTML = componnet(...parameter);
        } else {
            document.getElementById(containter).innerHTML = componnet;
        }
    } else {
        if (componnet.toString().match(/^class/)) {
            let objName = guid();
            window.jsweb[objName] = new componnet(...parameter);
            window.jsweb[objName].objectName = 'jsweb.' + objName;
            return window.jsweb[objName].render();
        } else if (componnet.toString().match(/^function/)) {
            return componnet(...parameter);
        } else {
            return componnet;
        }
    }
}