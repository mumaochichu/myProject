// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../Utils","./VertexBuffer","../util/Writer"],function(h,f,l,m,g){Object.defineProperty(f,"__esModule",{value:!0});var k=function(){function a(b,a){this.data=b;this.stride=a}Object.defineProperty(a.prototype,"vertexCount",{get:function(){return this.data.length/(this.stride/4)},enumerable:!0,configurable:!0});a.prototype.transfer=function(b,a){var c=this.data.buffer();b.vertexCount=this.vertexCount;b.data=c;b.stride=this.stride;a.push(c)};return a}();f.default=k;h=function(){function a(b,
a,c){void 0===c&&(c=!1);this.geometryType=b;this.indexVector=new g.default(Uint32Array,a);this.namedVectors={};b=l.getStrides(b,c);for(var e in b){c=b[e];var d=void 0;switch(c%4){case 0:case 2:d=new g.default(Uint32Array,c/4*a);break;case 1:case 3:d=new g.default(Uint8Array,c*a)}this.namedVectors[e]=new k(d,c)}}a.prototype.get=function(b){return this.namedVectors[b].data};a.prototype.getVector=function(b){return this.namedVectors[b]};a.prototype.transfer=function(b,a){var c=this.indexVector.buffer(),
e={};a.push(c);for(var d in this.namedVectors){var f=this.namedVectors[d];e[d]={};f.transfer(e[d],a)}b.geometryType=this.geometryType;b.indexBuffer=c;b.namedBuffers=e;this.destroy()};a.prototype.intoBuffers=function(){var a=m.VertexBuffers.fromVertexVectors(this);this.destroy();return a};a.prototype.destroy=function(){this.namedVectors=this.indexVector=null};return a}();f.VertexVectors=h});