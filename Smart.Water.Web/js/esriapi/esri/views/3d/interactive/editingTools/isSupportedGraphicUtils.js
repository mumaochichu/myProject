// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../../core/compilerUtils"],function(c,a,b){Object.defineProperty(a,"__esModule",{value:!0});a.isSupportedGraphicResultMessage=function(a){switch(a){case 0:break;case 1:return"not owned by a graphics layer";case 2:return"no geometry";case 3:return"the geometry type is not supported";case 4:return"the elevation mode is not supported";case 5:return"the symbol type is not supported";default:b.neverReached(a)}return""}});