// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","./geometryEngineBase","./geometryAdapters/json"],function(l,d,e,f){Object.defineProperty(d,"__esModule",{value:!0});d.extendedSpatialReferenceInfo=function(b){return e.extendedSpatialReferenceInfo(b)};d.clip=function(b,a,c){return e.clip(f.jsonAdapter,b,a,c)};d.cut=function(b,a,c){return e.cut(f.jsonAdapter,b,a,c)};d.contains=function(b,a,c){return e.contains(f.jsonAdapter,b,a,c)};d.crosses=function(b,a,c){return e.crosses(f.jsonAdapter,b,a,c)};d.distance=function(b,a,
c,d){return e.distance(f.jsonAdapter,b,a,c,d)};d.equals=function(b,a,c){return e.equals(f.jsonAdapter,b,a,c)};d.intersects=function(b,a,c){return e.intersects(f.jsonAdapter,b,a,c)};d.touches=function(b,a,c){return e.touches(f.jsonAdapter,b,a,c)};d.within=function(b,a,c){return e.within(f.jsonAdapter,b,a,c)};d.disjoint=function(b,a,c){return e.disjoint(f.jsonAdapter,b,a,c)};d.overlaps=function(b,a,c){return e.overlaps(f.jsonAdapter,b,a,c)};d.relate=function(b,a,c,d){return e.relate(f.jsonAdapter,b,
a,c,d)};d.isSimple=function(b,a){return e.isSimple(f.jsonAdapter,b,a)};d.simplify=function(b,a){return e.simplify(f.jsonAdapter,b,a)};d.convexHull=function(b,a,c){void 0===c&&(c=!1);return e.convexHull(f.jsonAdapter,b,a,c)};d.difference=function(b,a,c){return e.difference(f.jsonAdapter,b,a,c)};d.symmetricDifference=function(b,a,c){return e.symmetricDifference(f.jsonAdapter,b,a,c)};d.intersect=function(b,a,c){return e.intersect(f.jsonAdapter,b,a,c)};d.union=function(b,a,c){void 0===c&&(c=null);return e.union(f.jsonAdapter,
b,a,c)};d.offset=function(b,a,c,d,g,h,k){return e.offset(f.jsonAdapter,b,a,c,d,g,h,k)};d.buffer=function(b,a,c,d,g){void 0===g&&(g=!1);return e.buffer(f.jsonAdapter,b,a,c,d,g)};d.geodesicBuffer=function(b,a,c,d,g,h,k){return e.geodesicBuffer(f.jsonAdapter,b,a,c,d,g,h,k)};d.nearestCoordinate=function(b,a,c,d){void 0===d&&(d=!0);return e.nearestCoordinate(f.jsonAdapter,b,a,c,d)};d.nearestVertex=function(b,a,c){return e.nearestVertex(f.jsonAdapter,b,a,c)};d.nearestVertices=function(b,a,c,d,g){return e.nearestVertices(f.jsonAdapter,
b,a,c,d,g)};d.rotate=function(b,a,c,d){if(null==a||null==d)throw Error("Illegal Argument Exception");a=e.rotate(a,c,d);a.spatialReference=b;return a};d.flipHorizontal=function(b,a,c){if(null==a||null==c)throw Error("Illegal Argument Exception");a=e.flipHorizontal(a,c);a.spatialReference=b;return a};d.flipVertical=function(b,a,c){if(null==a||null==c)throw Error("Illegal Argument Exception");a=e.flipVertical(a,c);a.spatialReference=b;return a};d.generalize=function(b,a,c,d,g){return e.generalize(f.jsonAdapter,
b,a,c,d,g)};d.densify=function(b,a,c,d){return e.densify(f.jsonAdapter,b,a,c,d)};d.geodesicDensify=function(b,a,c,d,g){void 0===g&&(g=0);return e.geodesicDensify(f.jsonAdapter,b,a,c,d,g)};d.planarArea=function(b,a,c){return e.planarArea(f.jsonAdapter,b,a,c)};d.planarLength=function(b,a,c){return e.planarLength(f.jsonAdapter,b,a,c)};d.geodesicArea=function(b,a,c,d){return e.geodesicArea(f.jsonAdapter,b,a,c,d)};d.geodesicLength=function(b,a,c,d){return e.geodesicLength(f.jsonAdapter,b,a,c,d)}});