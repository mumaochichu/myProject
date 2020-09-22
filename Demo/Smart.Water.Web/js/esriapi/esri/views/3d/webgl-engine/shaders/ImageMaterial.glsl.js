// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../core/shaderLibrary/Slice.glsl ../core/shaderLibrary/Transform.glsl ../core/shaderLibrary/util/AlphaDiscard.glsl ../core/shaderModules/interfaces ../core/shaderModules/ShaderBuilder".split(" "),function(m,b,d,g,h,k,c,l){Object.defineProperty(b,"__esModule",{value:!0});b.build=function(b){var a=new l.ShaderBuilder;a.include(h.Transform,{linearDepth:!1});a.vertex.uniforms.add("proj","mat4").add("view","mat4");a.attributes.add("position","vec3");a.attributes.add("uv0",
"vec2");a.varyings.add("vpos","vec3");a.vertex.uniforms.add("textureCoordinateScaleFactor","vec2");a.vertex.code.add(c.glsl(e||(e=d.__makeTemplateObject(["\n    void main(void) {\n      vpos \x3d position;\n      vTexCoord \x3d uv0 * textureCoordinateScaleFactor;\n      gl_Position \x3d transformPosition(proj, view, vpos);\n    }\n  "],["\n    void main(void) {\n      vpos \x3d position;\n      vTexCoord \x3d uv0 * textureCoordinateScaleFactor;\n      gl_Position \x3d transformPosition(proj, view, vpos);\n    }\n  "]))));
a.include(g.Slice,b);a.fragment.uniforms.add("tex","sampler2D");a.fragment.uniforms.add("opacity","float");a.varyings.add("vTexCoord","vec2");a.fragment.code.add(c.glsl(f||(f=d.__makeTemplateObject(["\n    void main() {\n      discardBySlice(vpos);\n      gl_FragColor \x3d texture2D(tex, vTexCoord) * opacity;\n\n      if (gl_FragColor.a \x3c ",") {\n        discard;\n      }\n\n      gl_FragColor \x3d highlightSlice(gl_FragColor, vpos);\n    }\n    "],["\n    void main() {\n      discardBySlice(vpos);\n      gl_FragColor \x3d texture2D(tex, vTexCoord) * opacity;\n\n      if (gl_FragColor.a \x3c ",
") {\n        discard;\n      }\n\n      gl_FragColor \x3d highlightSlice(gl_FragColor, vpos);\n    }\n    "])),c.glsl.float(k.defaultMaskAlphaCutoff)));return a};var e,f});