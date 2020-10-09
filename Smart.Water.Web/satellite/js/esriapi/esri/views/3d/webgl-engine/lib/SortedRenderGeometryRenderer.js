// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../core/Accessor ../../../../core/MapUtils ../../../../core/maybe ../../../../core/PooledArray ../../../../core/accessorSupport/decorators ./Material ./rendererUtils".split(" "),function(p,q,g,r,m,t,h,k,u,v){Object.defineProperty(q,"__esModule",{value:!0});var w=function(){return function(){}}();p=function(n){function b(){var a=null!==n&&n.apply(this,arguments)||this;a._pendingAddsRemoves=new Map;a._adds=new h;a._removes=new h;a._updates=new h({allocator:function(a){return a||
new w},deallocator:function(a){a.renderGeometry=null;return a}});a._materialRenderers=new Map;a._sortedMaterialRenderers=new h;a._hasHighlights=!1;a._hasWater=!1;return a}g.__extends(b,n);b.prototype.dispose=function(){this._adds.prune();this._removes.prune();this._updates.prune();this._materialRenderers&&(this._materialRenderers.forEach(function(a){return a.dispose()}),this._materialRenderers.clear(),this._sortedMaterialRenderers.clear())};Object.defineProperty(b.prototype,"updating",{get:function(){return 0<
this._pendingAddsRemoves.size||0<this._updates.length},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"hasHighlights",{get:function(){return this._hasHighlights},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"hasWater",{get:function(){return this._hasWater},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"rendersOccluded",{get:function(){return m.someMap(this._materialRenderers,function(a){return a.rendersOccluded})},enumerable:!0,configurable:!0});
b.prototype.stopAnimationsAtTime=function(a){this._sortedMaterialRenderers.forEach(function(f){return t.applySome(f.material.animation,function(c){return c.stopAtTime(a)})})};Object.defineProperty(b.prototype,"isEmpty",{get:function(){return!this.updating&&0===this._materialRenderers.size},enumerable:!0,configurable:!0});b.prototype.commitChanges=function(){var a=this,f=!1;if(!this.updating)return!1;this.updateAddsRemoves();var c=!1,d=!1;v.splitRenderGeometryChangeSetByMaterial({numToAdd:this._adds.length,
toAdd:this._adds.data,numToRemove:this._removes.length,toRemove:this._removes.data,numToUpdate:this._updates.length,toUpdate:this._updates.data}).forEach(function(b,l){var e=a._materialRenderers.get(l);!e&&0<b.toAdd.length&&(e=l.createRenderer(a.rctx,a.materialRepository),a._materialRenderers.set(l,e),d=c=f=!0);if(e){var g=c||e.hasHighlights,h=d||e.hasWater;e.modify(b);c=c||g!==e.hasHighlights;d=d||h!==e.hasWater;e.isEmpty&&(a._materialRenderers.delete(l),e.dispose(),f=!0)}});this._adds.clear();this._removes.clear();
this._updates.clear();this._pendingAddsRemoves.clear();f&&this.updateSortedMaterialRenderers();c&&(this._hasHighlights=m.someMap(this._materialRenderers,function(a){return a.hasHighlights}));d&&(this._hasWater=m.someMap(this._materialRenderers,function(a){return a.hasWater}));this.notifyChange("updating");return!0};b.prototype.add=function(a){for(var b=0===this._pendingAddsRemoves.size,c=0;c<a.length;c++)this._pendingAddsRemoves.set(a[c],0);b&&0<this._pendingAddsRemoves.size&&this.notifyChange("updating")};
b.prototype.remove=function(a){for(var b=0===this._pendingAddsRemoves.size,c=0;c<a.length;c++){var d=a[c],e=this._pendingAddsRemoves.get(d);0===e?this._pendingAddsRemoves.set(d,2):2!==e&&this._pendingAddsRemoves.set(d,1)}b&&0<this._pendingAddsRemoves.size&&this.notifyChange("updating")};b.prototype.modify=function(a,b){for(var c=0===this._updates.length,d=0;d<a.length;d++){var e=a[d],f=this._updates.pushNew();f.renderGeometry=e;f.updateType=b}c&&0<this._updates.length&&this.notifyChange("updating")};
b.prototype.updateLogic=function(a){for(var b=!1,c=0;c<this._sortedMaterialRenderers.length;c++){var d=this._sortedMaterialRenderers.data[c].materialRenderer;d.updateLogic&&d.updateLogic(a)&&(b=!0)}return b};b.prototype.draw=function(a,b,c){for(var d=0;d<this._sortedMaterialRenderers.length;d++){var e=this._sortedMaterialRenderers.data[d];if(u.materialPredicate(e.material,a)){var f=c.getMaterialRenderStatsObject(e.materialRenderer.type);e.materialRenderer.render(null,a,b,f)}}};b.prototype.updateSortedMaterialRenderers=
function(){var a=this;this._sortedMaterialRenderers.clear();var b=0;this._materialRenderers.forEach(function(c,d){d.insertOrder=b++;a._sortedMaterialRenderers.push({material:d,materialRenderer:c})});this._sortedMaterialRenderers.sort(function(a,b){var c=b.material.renderPriority-a.material.renderPriority;return 0!==c?c:a.material.insertOrder-b.material.insertOrder})};b.prototype.updateAddsRemoves=function(){var a=this;this._adds.clear();this._removes.clear();this._pendingAddsRemoves.forEach(function(b,
d){switch(b){case 0:a._adds.push(d);break;case 1:a._removes.push(d)}});for(var b=0;b<this._updates.length;)this._pendingAddsRemoves.has(this._updates.data[b].renderGeometry)?this._updates.removeUnorderedIndex(b):b++};Object.defineProperty(b.prototype,"test",{get:function(){return{sortedMaterialRenderers:this._sortedMaterialRenderers}},enumerable:!0,configurable:!0});g.__decorate([k.property()],b.prototype,"rctx",void 0);g.__decorate([k.property()],b.prototype,"materialRepository",void 0);g.__decorate([k.property()],
b.prototype,"updating",null);return b=g.__decorate([k.subclass("esri.views.3d.webgl-engine.lib.SortedRenderGeometryRenderer")],b)}(r);q.SortedRenderGeometryRenderer=p});