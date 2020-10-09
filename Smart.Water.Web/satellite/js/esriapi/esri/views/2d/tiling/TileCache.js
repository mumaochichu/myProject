// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../core/libs/gl-matrix-2/vec2"],function(f,g,m){Object.defineProperty(g,"__esModule",{value:!0});f=function(){function d(a,c,e){this.maxSize=a;this.tileInfoView=c;this.removedFunc=e;this._tilePerId=new Map;this._tileKeysPerLevel=[]}d.prototype.has=function(a){return this._tilePerId.has(a)};d.prototype.get=function(a){return this._tilePerId.get(a)};d.prototype.pop=function(a){var c=this._tilePerId.get(a);if(!c)return null;var e=this._tileKeysPerLevel[c.key.level];
this._tilePerId["delete"](a);for(var b=0;b<e.length;b++)if(e[b].id===a){e.splice(b,1);break}c.visible=!0;return c};d.prototype.add=function(a){a.visible=!1;var c=a.key,e=c.id;this._tilePerId.has(e)||(this._tilePerId.set(e,a),a=c.level,this._tileKeysPerLevel[a]||(this._tileKeysPerLevel[a]=[]),this._tileKeysPerLevel[a].push(c))};d.prototype.prune=function(a,c,e){var b=this._tilePerId.size;if(!(b<=this.maxSize)){for(var d=this._tileKeysPerLevel.length-1;b>this.maxSize&&0<=d;)d!==a&&(b=this._pruneAroundCenterTile(b,
c,e,d)),d--;b>this.maxSize&&(b=this._pruneAroundCenterTile(b,c,e,a))}};d.prototype._pruneAroundCenterTile=function(a,c,e,b){b=this._tileKeysPerLevel[b];if(!b||0===b.length)return a;var d=this.tileInfoView.tileInfo,f=d.size,h=d.origin,g=e*f[0],n=e*f[1],k=[0,0],l=[0,0];for(b.sort(function(a,b){k[0]=h.x+g*(a.col+.5);k[1]=h.y-n*(a.row+.5);l[0]=h.x+g*(b.col+.5);l[1]=h.y-n*(b.row+.5);return m.vec2.squaredDistance(k,c)-m.vec2.squaredDistance(l,c)});0<b.length&&(e=b.pop(),this._removeTile(e.id),a--,a!==this.maxSize););
return a};d.prototype._removeTile=function(a){var c=this._tilePerId.get(a);this.removedFunc&&this.removedFunc(c);this._tilePerId["delete"](a)};return d}();g.default=f});