// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../Graphic ../../../core/promiseUtils ../../../geometry/SpatialReference ../../../layers/support/Field ./WorkerHandle".split(" "),function(f,g,d,k,l,h,m,n){Object.defineProperty(g,"__esModule",{value:!0});f=function(){function b(a){this._handle=new p(a)}b.prototype.destroy=function(){this._handle.destroy()};b.prototype.invoke=function(a,c){void 0===c&&(c=null);if(!a.buffer||0===a.buffer.byteLength)return l.resolve(null);a.options.sourceSpatialReference&&a.options.sourceSpatialReference instanceof
h&&(a.options=d.__assign(d.__assign({},a.options),{sourceSpatialReference:a.options.sourceSpatialReference.toJSON()}));return this._handle.invoke(a,c).then(function(a){a.spatialReference=h.fromJSON(a.spatialReference);if(a.fields)for(var c=0;c<a.fields.length;c++)a.fields[c]=m.fromJSON(a.fields[c]);for(var c=a.spatialReference,b=0,d=a.features;b<d.length;b++){var e=d[b];e.uid=k.generateUID();e.geometry&&(e.geometry.spatialReference=c)}return a})};return b}();g.PBFDecoder=f;var p=function(b){function a(a){return b.call(this,
"PBFDecoderWorker","_parseFeatureQuery",a,{strategy:"dedicated"})||this}d.__extends(a,b);a.prototype.getTransferList=function(a){return[a.buffer]};return a}(n.WorkerHandle)});