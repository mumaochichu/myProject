// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../../../core/promiseUtils","./bufferview"],function(g,h,k,l){Object.defineProperty(h,"__esModule",{value:!0});g=function(){function f(a){this.gltf=a;this.bufferViews=[];this.isFinalized=!1;a.buffers||(a.buffers=[]);this.index=a.buffers.length;var b={byteLength:-1};a.buffers.push(b);this.buffer=b}f.prototype.addBufferView=function(a,b,c){if(this.finalizePromise)throw Error("Cannot add buffer view after fiinalizing buffer");a=new l.BufferView(this,this.gltf,a,b,c);
this.bufferViews.push(a);return a};f.prototype.getByteOffset=function(a){for(var b=0,c=0,d=this.bufferViews;c<d.length;c++){var e=d[c];if(e===a)return b;b+=e.size}throw Error("Given bufferView was not present in this buffer");};f.prototype.getViewFinalizePromises=function(a){for(var b=[],c=0,d=this.bufferViews;c<d.length;c++){var e=d[c];if(a&&e===a)break;b.push(e.finalized)}return b};f.prototype.getArrayBuffer=function(){if(!this.isFinalized)throw Error("Cannot get ArrayBuffer from Buffer before it is finalized");
for(var a=this.getTotalSize(),a=new ArrayBuffer(a),b=0,c=0,d=this.bufferViews;c<d.length;c++){var e=d[c];e.writeOutToBuffer(a,b);b+=e.size}return a};f.prototype.finalize=function(){var a=this;if(this.finalizePromise)throw Error("Buffer "+this.index+" was already finalized");this.finalizePromise=k.create(function(b){b(k.eachAlways(a.getViewFinalizePromises()))}).then(function(){a.isFinalized=!0;var b=a.getArrayBuffer();a.buffer.byteLength=b.byteLength;a.buffer.uri=b});this.gltf.extras.promises.push(this.finalizePromise);
return this.finalizePromise};f.prototype.getTotalSize=function(){for(var a=0,b=0,c=this.bufferViews;b<c.length;b++)a+=c[b].size;return a};return f}();h.Buffer=g});