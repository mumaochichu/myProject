// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../Graphic ../../core/JSONSupport ../../core/accessorSupport/decorators ../../core/accessorSupport/decorators/reader ./FeatureSet ./NAMessage ./RouteResult".split(" "),function(n,p,b,d,h,c,e,k,l,m){function f(b){return b&&k.fromJSON(b).features.map(function(a){return a})}return function(g){function a(a){a=g.call(this,a)||this;a.barriers=null;a.messages=null;a.pointBarriers=null;a.polylineBarriers=null;a.polygonBarriers=null;a.routeResults=null;return a}b.__extends(a,
g);a.prototype.readPointBarriers=function(a,b){return f(b.barriers||b.pointBarriers)};a.prototype.readPolylineBarriers=function(a){return f(a)};a.prototype.readPolygonBarriers=function(a){return f(a)};b.__decorate([c.property({aliasOf:"pointBarriers"})],a.prototype,"barriers",void 0);b.__decorate([c.property({type:[l]})],a.prototype,"messages",void 0);b.__decorate([c.property({type:[d]})],a.prototype,"pointBarriers",void 0);b.__decorate([e.reader("pointBarriers",["barriers","pointBarriers"])],a.prototype,
"readPointBarriers",null);b.__decorate([c.property({type:[d]})],a.prototype,"polylineBarriers",void 0);b.__decorate([e.reader("polylineBarriers")],a.prototype,"readPolylineBarriers",null);b.__decorate([c.property({type:[d]})],a.prototype,"polygonBarriers",void 0);b.__decorate([e.reader("polygonBarriers")],a.prototype,"readPolygonBarriers",null);b.__decorate([c.property({type:[m]})],a.prototype,"routeResults",void 0);return a=b.__decorate([c.subclass("esri.tasks.support.RouteResultsContainer")],a)}(h.JSONSupport)});