// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","tslib","../../shaderModules/interfaces"],function(h,b,c,d){Object.defineProperty(b,"__esModule",{value:!0});b.VertexColor=function(a,b){b.attributeColor?(a.attributes.add("color","vec4"),a.varyings.add("vColor","vec4"),a.vertex.code.add(d.glsl(e||(e=c.__makeTemplateObject(["\n      void forwardVertexColor() { vColor \x3d color; }\n    "],["\n      void forwardVertexColor() { vColor \x3d color; }\n    "])))),a.vertex.code.add(d.glsl(f||(f=c.__makeTemplateObject(["\n      void forwardNormalizedVertexColor() { vColor \x3d color * 0.003921568627451; }\n    "],
["\n      void forwardNormalizedVertexColor() { vColor \x3d color * 0.003921568627451; }\n    "]))))):a.vertex.code.add(d.glsl(g||(g=c.__makeTemplateObject(["\n      void forwardVertexColor() {}\n      void forwardNormalizedVertexColor() {}\n    "],["\n      void forwardVertexColor() {}\n      void forwardNormalizedVertexColor() {}\n    "]))))};var e,f,g});