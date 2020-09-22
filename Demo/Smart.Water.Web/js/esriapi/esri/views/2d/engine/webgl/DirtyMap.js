// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","./Utils"],function(h,k,m){function l(a,c,d){if(!a.allDirty)if(null!=a.from&&null!=a.count){var b=Math.min(a.from,c);c=Math.max(a.from+a.count,c+d)-b;a.from=b;a.count=c}else a.from=c,a.count=d}Object.defineProperty(k,"__esModule",{value:!0});h=function(){function a(){this._dirties=m.createGeometryData(function(){return{indices:{from:null,count:null,allDirty:!1}}},function(){return{vertices:{from:null,count:null,allDirty:!1}}})}a.prototype.hasDirty=function(){for(var c=
0,d=this._dirties;c<d.length;c++){var b=d[c];if(null!==b.data.indices.count||b.data.indices.allDirty)return!0}return!1};a.prototype.markAllClean=function(){for(var c=0,d=this._dirties;c<d.length;c++){var b=d[c];b.data.indices.from=null;b.data.indices.count=null;b.data.indices.allDirty=!1;for(var a in b.buffers)b.buffers[a].data.vertices.from=null,b.buffers[a].data.vertices.count=null,b.buffers[a].data.vertices.allDirty=!1}};a.prototype.markAllDirty=function(){for(var c=0,a=this._dirties;c<a.length;c++){var b=
a[c];b.data.indices.allDirty=!0;for(var f in b.buffers)b.buffers[f].data.vertices.allDirty=!0}};a.prototype.forEach=function(a){for(var c=0;c<this._dirties.length;++c){var b=this._dirties[c],f={},g;for(g in b.buffers){var e=b.buffers[g].data.vertices;if(e.allDirty||null!=e.from&&null!=e.count&&0<e.count)f[g]=e}b=b.data.indices;e=void 0;e=b.allDirty||null!=b.from&&null!=b.count&&0<b.count?{indices:b,vertices:f}:{indices:null,vertices:f};(e.indices||0<Object.keys(e).length)&&a(e,c)}};a.prototype.markDirtyIndices=
function(a,d,b){l(this._dirties[a].data.indices,d,b)};a.prototype.markDirtyVertices=function(a,d,b,f){l(this._dirties[a].buffers[d].data.vertices,b,f)};return a}();k.default=h});