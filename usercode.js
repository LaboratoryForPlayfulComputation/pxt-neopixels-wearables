var extId = window.location.hash.substr(1);
var idToType = {};
var usercode = {};

console.log(`extension id: ${this.extId}`);
window.addEventListener(
    "message",
    //ev => ev.data.type == "pxtpkgext" ? receiveMessage(ev.data) : undefined,
    ev => ev.type == "pxtpkgext" ? receiveMessage(ev) : undefined,
    false);
sendRequest("extinit");

function receiveMessage(ev) {
    console.log(ev);
    if (ev.event) {
        switch (ev.event) {
            case "extconsole":
                var cons = ev;
                if (cons.body.sim) return;
                break;
            case "extshown":
                console.log('shown');
                //sendRequest("extdatastream");
                sendRequest("extreadcode");
                break;
            case "exthidden":
                console.log('hidden');
                break;           
            default:
                break;
        }
        return;
    }

    var action = idToType[ev.id];
    console.log(`msg: ${action}`)
    delete idToType[ev.id];
    switch (action) {
        case "extinit":
            sendRequest("extdatastream");
            sendRequest("extreadcode");
            break;
        case "extreadcode":
            // received existing code
            var usercode = data;
            console.log(usercode);
            break;
        default: break;
    }
}

function sendRequest(action) {
    var id = Math.random().toString();
    idToType[id] = action;
    var msg = {
        type: "pxtpkgext",
        action: action,
        extId: extId,
        response: true,
        id: id
    };
    window.parent.postMessage(msg, "*");
}

function sendGeneratedCode(body) {
    var id = Math.random().toString();
    idToType[id] = "extwritecode";
    var msg = {
        id: id,
        type: "pxtpkgext",
        action: "extwritecode",
        extId: extId,
        body: body
    }
    window.parent.postMessage(msg, "*");
}

function renderUserCode() {
    var ts = `// This file was autogenerated, do not edit.
namespace layoutdesigner {

/*
* A neopixel layout
*/
//% blockId="testblock" block="testblock %num"   
export function testing(num: number): number {
    return num;
}
}` 
    return ts;
}

function saveUserCode() {            
    /*var ts = renderUserCode();
    sendRequest("extwritecode", {
        code: ts,
        json: JSON.stringify(usercode, null, 2)
    });*/
    var ts = renderUserCode();
    console.log("Saving generated blocks: ", ts);
    sendGeneratedCode({code: ts, json: JSON.stringify(usercode, null, 2)});
}