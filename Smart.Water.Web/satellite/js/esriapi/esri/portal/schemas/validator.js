// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports ../../core/Error ../../libs/ajv/ajv.bundle ./buildingSceneLayerItem ./integratedMeshLayerItem ./pointCloudLayerItem ./sceneLayerItem ../../support/validationUtilsAjv".split(" "),function(n,a,d,e,f,g,h,k,l){function m(b){switch(b){case "building-scene":return f.json;case "integrated-mesh":return g.json;case "point-cloud":return h.json;case "scene":return k.json;default:throw new d("poratlitemlayertype:unknown","Can not validate against unknown PortalItemLayerType.");}}Object.defineProperty(a,
"__esModule",{value:!0});var c=new e({allErrors:!0,extendRefs:!0});a.validate=function(b,a){return c.validate(b,m(a))?[]:l.convertAjvErrors(c.errors)}});