// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","tslib","../shaderModules/interfaces"],function(k,e,c,d){Object.defineProperty(e,"__esModule",{value:!0});e.ForwardLinearDepth=function(a,b){0===b.output&&b.receiveShadows?(a.varyings.add("linearDepth","float"),a.vertex.code.add(d.glsl(f||(f=c.__makeTemplateObject(["\n      void forwardLinearDepth() { linearDepth \x3d gl_Position.w; }\n    "],["\n      void forwardLinearDepth() { linearDepth \x3d gl_Position.w; }\n    "]))))):1===b.output||3===b.output?(a.varyings.add("linearDepth",
"float"),a.vertex.uniforms.add("uCameraNearFar","vec2"),a.vertex.code.add(d.glsl(g||(g=c.__makeTemplateObject(["\n      void forwardLinearDepth() {\n        linearDepth \x3d (-position_view().z - uCameraNearFar[0]) / (uCameraNearFar[1] - uCameraNearFar[0]);\n      }\n    "],["\n      void forwardLinearDepth() {\n        linearDepth \x3d (-position_view().z - uCameraNearFar[0]) / (uCameraNearFar[1] - uCameraNearFar[0]);\n      }\n    "]))))):a.vertex.code.add(d.glsl(h||(h=c.__makeTemplateObject(["\n      void forwardLinearDepth() {}\n    "],
["\n      void forwardLinearDepth() {}\n    "]))))};var f,g,h});