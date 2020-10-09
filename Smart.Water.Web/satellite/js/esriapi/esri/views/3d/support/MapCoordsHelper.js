// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../geometry ../../../core/Error ../../../core/unitUtils ../../../portal/support/geometryServiceUtils ../../../tasks/support/ProjectParameters".split(" "),function(a,d,c,f,g,n,p,q){Object.defineProperty(d,"__esModule",{value:!0});a=function(){function a(r,a,b){void 0===b&&(b=null);this.spatialReference=a;this.unitInMeters=n.getMetersPerUnitForSR(this.spatialReference);this._geometryServicePromise=this.loadGeometryService(r,b)}a.prototype.loadGeometryService=function(a,
e){return c.__awaiter(this,void 0,void 0,function(){return c.__generator(this,function(b){switch(b.label){case 0:if(e)return[2,e];b.label=1;case 1:return b.trys.push([1,3,,4]),[4,p.create(a&&a.get("portalItem"))];case 2:return[2,b.sent()];case 3:throw b.sent(),new g("mapcoordshelper:missing-geometry-service","Must specify geometryService in esri/config");case 4:return[2]}})})};a.prototype.toGeographic=function(a){return c.__awaiter(this,void 0,void 0,function(){var e,b,d,k,l,m,h,g=this;return c.__generator(this,
function(c){switch(c.label){case 0:return[4,this._geometryServicePromise];case 1:return e=c.sent(),b=!0,Array.isArray(a[0])&&"number"!==typeof a[0]?d=a:(d=[a],b=!1),k=d.map(function(a){return a instanceof f.Point?a:new f.Point(a,g.spatialReference)}),l=new q({geometries:k,outSpatialReference:f.SpatialReference.WGS84}),[4,e.project(l)];case 2:return m=c.sent(),h=m.map(function(a){return"point"===a.type?[a.x,a.y]:void 0}),[2,b?h:h[0]]}})})};return a}();d.MapCoordsHelper=a;d.default=a});