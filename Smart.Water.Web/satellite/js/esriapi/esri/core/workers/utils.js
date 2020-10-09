// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../has"],function(l,b,h){function f(a){return a&&"object"===typeof a&&("result"in a||"transferList"in a)}function g(a){if(!a||!a.length)return null;if(h("esri-workers-arraybuffer-transfer"))return a;a=a.filter(function(a){return!(a instanceof ArrayBuffer||a&&a.constructor&&"ArrayBuffer"===a.constructor.name)});return a.length?a:null}Object.defineProperty(b,"__esModule",{value:!0});var e;(function(a){a[a.HANDSHAKE=0]="HANDSHAKE";a[a.CONFIGURE=1]="CONFIGURE";a[a.CONFIGURED=
2]="CONFIGURED";a[a.OPEN=3]="OPEN";a[a.OPENED=4]="OPENED";a[a.RESPONSE=5]="RESPONSE";a[a.INVOKE=6]="INVOKE";a[a.ABORT=7]="ABORT";a[a.CLOSE=8]="CLOSE";a[a.OPEN_PORT=9]="OPEN_PORT";a[a.ON=10]="ON"})(e=b.MessageType||(b.MessageType={}));var k=0;b.newJobId=function(){return k++};b.isTranferableResult=f;b.toInvokeError=function(a){return a?"string"===typeof a?JSON.stringify({name:"message",message:a}):a.toJSON?JSON.stringify(a):JSON.stringify({name:a.name,message:a.message,details:a.details,stack:a.stack}):
null};b.postMessage=function(a,c,b,d){c.type===e.OPEN_PORT?a.postMessage(c,[c.port]):c.type!==e.INVOKE&&c.type!==e.RESPONSE?a.postMessage(c):(f(b)?(d=g(b.transferList),c.data=b.result):(d=g(d),c.data=b),d?a.postMessage(c,d):a.postMessage(c))};b.receiveMessage=function(a){return a?(a=a.data)?"string"===typeof a?JSON.parse(a):a:null:null}});