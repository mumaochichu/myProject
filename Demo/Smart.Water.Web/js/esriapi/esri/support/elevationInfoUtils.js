// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../core/compilerUtils","../core/maybe","../symbols/support/unitConversionUtils"],function(q,c,n,f,p){function l(a,b){return f.isNone(b)||!b.mode?a?"absolute-height":"on-the-ground":b.mode}function g(a,b){return l(f.isSome(a)?a.hasZ:!1,b)}function m(a){var b=k(a);return g(a.geometry,b)}function k(a){return a.layer&&"elevationInfo"in a.layer?a.layer.elevationInfo:null}Object.defineProperty(c,"__esModule",{value:!0});c.getEffectiveElevationMode=l;c.getGeometryEffectiveElevationMode=
g;c.getGraphicEffectiveElevationMode=m;c.getGraphicEffectiveElevationInfo=function(a){var b=k(a);a=g(a.geometry,b);b=f.isSome(b)&&"on-the-ground"!==a?f.unwrapOr(b.offset,0)*p.getMetersPerUnit(f.unwrapOr(b.unit,"meters")):0;return{mode:a,offset:b}};c.hasGraphicFeatureExpressionInfo=function(a){if("on-the-ground"===m(a))return!1;a=k(a);a=f.isSome(a)&&a.featureExpressionInfo?a.featureExpressionInfo.expression:null;return!(!a||"0"===a)};c.getZForElevationMode=function(a,b,d){if(!f.isNone(d)&&d.mode){var e=
a.hasZ?a.z:0,c=f.isSome(d.offset)?d.offset:0;switch(d.mode){case "absolute-height":return e-c;case "on-the-ground":return 0;case "relative-to-ground":return a=(b.elevationProvider.getElevation(a.x,a.y,a.z,a.spatialReference,"ground")||0)+c,e-a;case "relative-to-scene":return a=(b.elevationProvider.getElevation(a.x,a.y,a.z,a.spatialReference,"scene")||0)+c,e-a}}};c.getConvertedElevation=function(a,b,d,e){void 0===e&&(e=null);if(!f.isNone(d)){var c=f.isSome(e)?e.mode:"absolute-height";if("on-the-ground"===
c)return 0;var h=b.hasZ?b.z:0,g=f.isSome(d.offset)?d.offset:0;switch(d.mode){case "absolute-height":h+=g;break;case "on-the-ground":h=a.elevationProvider.getElevation(b.x,b.y,0,b.spatialReference,"ground")||0;break;case "relative-to-ground":d=(a.elevationProvider.getElevation(b.x,b.y,b.z,b.spatialReference,"ground")||0)+g;h+=d;break;case "relative-to-scene":d=(a.elevationProvider.getElevation(b.x,b.y,b.z,b.spatialReference,"scene")||0)+g,h+=d}e=f.isSome(e)&&f.isSome(e.offset)?e.offset:0;switch(c){case "absolute-height":return h-
e;case "relative-to-ground":return a=(a.elevationProvider.getElevation(b.x,b.y,b.z,b.spatialReference,"ground")||0)+e,h-a;case "relative-to-scene":return d=(a.elevationProvider.getElevation(b.x,b.y,b.z,b.spatialReference,"scene")||0)+e,h-d;default:return n.neverReached(c),null}}}});