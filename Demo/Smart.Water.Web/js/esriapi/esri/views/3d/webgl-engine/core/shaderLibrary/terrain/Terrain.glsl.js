// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../Slice.glsl ../Transform.glsl ../attributes/VertexTangent.glsl ../output/OutputDepth.glsl ../output/OutputHighlight.glsl ../shading/EvaluateSceneLighting.glsl ../shading/NormalUtils.glsl ./Overlay.glsl ./Skirts.glsl ./TerrainTexture.glsl ../util/HeaderComment.glsl ../util/RgbaFloatEncoding.glsl ../../shaderModules/interfaces ../../shaderModules/ShaderBuilder".split(" "),function(W,k,c,M,e,N,O,P,Q,f,l,R,S,T,U,d,V){Object.defineProperty(k,"__esModule",{value:!0});k.build=
function(b){var a=new V.ShaderBuilder;a.include(T.HeaderComment,{name:"Terrain Shader",output:b.output});a.include(R.Skirts);a.attributes.add("position","vec3");a.attributes.add("uv0","vec2");a.vertex.uniforms.add("proj","mat4").add("view","mat4").add("origin","vec3").add("skirtScale","float");if(0===b.output){a.include(e.Transform,{linearDepth:!1});a.include(f.NormalUtils,b);a.include(S.TerrainTexture,b);var h=0!==b.overlayMode,g=2===b.overlayMode;h&&a.include(l.Overlay,{pbrMode:3,useCustomDTRExponentForWater:!1,
ssrEnabled:b.ssrEnabled,highStepCount:b.highStepCount});g&&a.include(N.VertexTangent,b);a.varyings.add("vnormal","vec3");a.varyings.add("vpos","vec3");a.vertex.uniforms.add("viewNormal","mat4");b.receiveShadows&&a.varyings.add("linearDepth","float");b.tileBorders&&a.varyings.add("vuv","vec2");b.atmosphere&&(a.vertex.uniforms.add("lightingMainDirection","vec3"),a.varyings.add("wnormal","vec3"),a.varyings.add("wlight","vec3"));b.screenSizePerspective&&(a.vertex.uniforms.add("screenSizePerspective",
"vec4"),a.varyings.add("screenSizeDistanceToCamera","float"),a.varyings.add("screenSizeCosAngle","float"));a.vertex.code.add(d.glsl(m||(m=c.__makeTemplateObject(["\n      void main(void) {\n        vpos \x3d position;\n        vnormal \x3d getLocalUp(vpos, origin);\n\n        vec2 uv \x3d uv0;\n        vpos \x3d applySkirts(uv, vpos, vnormal, skirtScale);\n        ","\n        ","\n        ","\n        gl_Position \x3d transformPosition(proj, view, vpos);\n        ","\n        forwardTextureCoordinates(uv);\n        ",
"\n        ","\n      }\n    "],["\n      void main(void) {\n        vpos \x3d position;\n        vnormal \x3d getLocalUp(vpos, origin);\n\n        vec2 uv \x3d uv0;\n        vpos \x3d applySkirts(uv, vpos, vnormal, skirtScale);\n        ","\n        ","\n        ","\n        gl_Position \x3d transformPosition(proj, view, vpos);\n        ","\n        forwardTextureCoordinates(uv);\n        ","\n        ","\n      }\n    "])),b.atmosphere?d.glsl(n||(n=c.__makeTemplateObject(["\n        wnormal \x3d (viewNormal * vec4(normalize(vpos+origin), 1.0)).xyz;\n        wlight \x3d (view  * vec4(-lightingMainDirection, 1.0)).xyz;"],
["\n        wnormal \x3d (viewNormal * vec4(normalize(vpos+origin), 1.0)).xyz;\n        wlight \x3d (view  * vec4(-lightingMainDirection, 1.0)).xyz;"]))):"",b.tileBorders?d.glsl(p||(p=c.__makeTemplateObject(["vuv \x3d uv;"],["vuv \x3d uv;"]))):"",b.screenSizePerspective?d.glsl(q||(q=c.__makeTemplateObject(["\n        vec3 viewPos \x3d (view * vec4(vpos, 1.0)).xyz;\n        screenSizeDistanceToCamera \x3d length(viewPos);\n        vec3 viewSpaceNormal \x3d (viewNormal * vec4(normalize(vpos + origin), 1.0)).xyz;\n        screenSizeCosAngle \x3d abs(viewSpaceNormal.z);"],
["\n        vec3 viewPos \x3d (view * vec4(vpos, 1.0)).xyz;\n        screenSizeDistanceToCamera \x3d length(viewPos);\n        vec3 viewSpaceNormal \x3d (viewNormal * vec4(normalize(vpos + origin), 1.0)).xyz;\n        screenSizeCosAngle \x3d abs(viewSpaceNormal.z);"]))):"",b.receiveShadows?d.glsl(r||(r=c.__makeTemplateObject(["linearDepth \x3d gl_Position.w;"],["linearDepth \x3d gl_Position.w;"]))):"",h?d.glsl(t||(t=c.__makeTemplateObject(["setOverlayVTC(uv);"],["setOverlayVTC(uv);"]))):"",g?d.glsl(u||
(u=c.__makeTemplateObject(["forwardVertexTangent(vnormal);"],["forwardVertexTangent(vnormal);"]))):d.glsl(v||(v=c.__makeTemplateObject([""],[""])))));a.extensions.add("GL_OES_standard_derivatives");a.extensions.add("GL_EXT_shader_texture_lod");a.include(M.Slice,b);a.include(Q.EvaluateSceneLighting,b);a.fragment.uniforms.add("camPos","vec3").add("viewDirection","vec3").add("ssaoTex","sampler2D").add("viewportPixelSz","vec4").add("opacity","float");b.screenSizePerspective&&a.fragment.uniforms.add("screenSizePerspective",
"vec4");g&&(a.fragment.uniforms.add("ovInnerWaterTex","sampler2D"),a.fragment.uniforms.add("ovOuterWaterTex","sampler2D"),a.fragment.uniforms.add("view","mat4"));a.fragment.code.add(d.glsl(w||(w=c.__makeTemplateObject(["\n      const vec3 ambient \x3d vec3(0.2, 0.2, 0.2);\n      const vec3 diffuse \x3d vec3(0.8, 0.8, 0.8);\n      const float diffuseHardness \x3d 2.5;\n      const float sliceOpacity \x3d 0.2;\n\n      float lum(vec3 c) {\n        float max \x3d max(max(c.r, c.g), c.b);\n        float min \x3d min(min(c.r, c.g), c.b);\n        return (min + max) * 0.5;\n      }\n      "],
["\n      const vec3 ambient \x3d vec3(0.2, 0.2, 0.2);\n      const vec3 diffuse \x3d vec3(0.8, 0.8, 0.8);\n      const float diffuseHardness \x3d 2.5;\n      const float sliceOpacity \x3d 0.2;\n\n      float lum(vec3 c) {\n        float max \x3d max(max(c.r, c.g), c.b);\n        float min \x3d min(min(c.r, c.g), c.b);\n        return (min + max) * 0.5;\n      }\n      "]))));b.atmosphere&&a.fragment.code.add(d.glsl(x||(x=c.__makeTemplateObject(["\n      vec3 atmosphere(vec3 lightPos, vec3 normal, vec3 view) {\n        vec3 surfaceColor   \x3d vec3(0.0);\n        vec3 fuzzySpecColor \x3d vec3(1.0);\n        vec3 subColor       \x3d vec3(0.0);\n        float rollOff       \x3d 1.0;\n\n        vec3 Ln \x3d normalize(lightPos);\n        vec3 Nn \x3d normalize(normal);\n        vec3 Hn \x3d normalize(view + Ln);\n\n        float ldn \x3d dot(Ln, Nn);\n        float diffComp \x3d max(0.0, ldn);\n        // clamp necessary here because values might cause flickering: #21549\n        float vdn \x3d clamp(1.0 - dot(view, Nn), 0.0, 1.0);\n        float ndv \x3d dot(view, Ln);\n\n        vec3 diffContrib \x3d surfaceColor * diffComp;\n        float subLamb \x3d max(0.0, smoothstep(-rollOff, 1.0, ldn) - smoothstep(0.0, 1.0, ldn));\n\n        vec3 subContrib \x3d subLamb * subColor;\n        vec3 vecColor \x3d vec3(vdn);\n\n        vec3 diffuseContrib \x3d (subContrib + diffContrib);\n        vec3 specularContrib \x3d (vecColor * fuzzySpecColor);\n\n        return (diffContrib + specularContrib) * rollOff;\n      }\n      "],
["\n      vec3 atmosphere(vec3 lightPos, vec3 normal, vec3 view) {\n        vec3 surfaceColor   \x3d vec3(0.0);\n        vec3 fuzzySpecColor \x3d vec3(1.0);\n        vec3 subColor       \x3d vec3(0.0);\n        float rollOff       \x3d 1.0;\n\n        vec3 Ln \x3d normalize(lightPos);\n        vec3 Nn \x3d normalize(normal);\n        vec3 Hn \x3d normalize(view + Ln);\n\n        float ldn \x3d dot(Ln, Nn);\n        float diffComp \x3d max(0.0, ldn);\n        // clamp necessary here because values might cause flickering: #21549\n        float vdn \x3d clamp(1.0 - dot(view, Nn), 0.0, 1.0);\n        float ndv \x3d dot(view, Ln);\n\n        vec3 diffContrib \x3d surfaceColor * diffComp;\n        float subLamb \x3d max(0.0, smoothstep(-rollOff, 1.0, ldn) - smoothstep(0.0, 1.0, ldn));\n\n        vec3 subContrib \x3d subLamb * subColor;\n        vec3 vecColor \x3d vec3(vdn);\n\n        vec3 diffuseContrib \x3d (subContrib + diffContrib);\n        vec3 specularContrib \x3d (vecColor * fuzzySpecColor);\n\n        return (diffContrib + specularContrib) * rollOff;\n      }\n      "]))));
a.fragment.code.add(d.glsl(y||(y=c.__makeTemplateObject(["\n      void main() {\n        ","\n        float vndl \x3d dot(normalize(vnormal), -lightingMainDirection);\n        float k \x3d smoothstep(0.0, 1.0, clamp(vndl*diffuseHardness, 0.0, 1.0));\n        vec3 d \x3d (1.0 - shadow/1.8) * diffuse * k;\n\n        float ssao \x3d viewportPixelSz.w \x3c .0 ? 1.0 : texture2D(ssaoTex, (gl_FragCoord.xy - viewportPixelSz.xy) * viewportPixelSz.zw).a;\n        vec4 tileColor \x3d getTileColor() * opacity;\n        ",
"\n        if (rejectBySlice(vpos)) {\n          tileColor *\x3d sliceOpacity;\n        }\n        vec3 atm \x3d vec3(0.0);\n        ","\n        vec3 albedo \x3d atm + tileColor.rgb;\n        vec3 normal \x3d normalize(vnormal);\n\n        // heuristic shading function used in the old terrain, now used to add ambient lighting\n        float additionalAmbientScale \x3d smoothstep(0.0, 1.0, clamp(vndl*2.5, 0.0, 1.0));\n        vec3 additionalLight \x3d ssao * lightingMainIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;\n\n        gl_FragColor \x3d vec4(evaluateSceneLightingExt(normal, albedo, shadow, 1.0 - ssao, additionalLight), tileColor.a);\n        ",
"\n        ","\n        ","\n        gl_FragColor \x3d highlightSlice(gl_FragColor, vpos);\n      }\n    "],["\n      void main() {\n        ","\n        float vndl \x3d dot(normalize(vnormal), -lightingMainDirection);\n        float k \x3d smoothstep(0.0, 1.0, clamp(vndl*diffuseHardness, 0.0, 1.0));\n        vec3 d \x3d (1.0 - shadow/1.8) * diffuse * k;\n\n        float ssao \x3d viewportPixelSz.w \x3c .0 ? 1.0 : texture2D(ssaoTex, (gl_FragCoord.xy - viewportPixelSz.xy) * viewportPixelSz.zw).a;\n        vec4 tileColor \x3d getTileColor() * opacity;\n        ",
"\n        if (rejectBySlice(vpos)) {\n          tileColor *\x3d sliceOpacity;\n        }\n        vec3 atm \x3d vec3(0.0);\n        ","\n        vec3 albedo \x3d atm + tileColor.rgb;\n        vec3 normal \x3d normalize(vnormal);\n\n        // heuristic shading function used in the old terrain, now used to add ambient lighting\n        float additionalAmbientScale \x3d smoothstep(0.0, 1.0, clamp(vndl*2.5, 0.0, 1.0));\n        vec3 additionalLight \x3d ssao * lightingMainIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;\n\n        gl_FragColor \x3d vec4(evaluateSceneLightingExt(normal, albedo, shadow, 1.0 - ssao, additionalLight), tileColor.a);\n        ",
"\n        ","\n        ","\n        gl_FragColor \x3d highlightSlice(gl_FragColor, vpos);\n      }\n    "])),b.receiveShadows?d.glsl(z||(z=c.__makeTemplateObject(["float shadow \x3d readShadowMap(vpos, linearDepth);"],["float shadow \x3d readShadowMap(vpos, linearDepth);"]))):d.glsl(A||(A=c.__makeTemplateObject(["float shadow \x3d 0.0;"],["float shadow \x3d 0.0;"]))),h?d.glsl(B||(B=c.__makeTemplateObject(["\n            vec4 overlayColorOpaque \x3d getOverlayColor(ovInnerColorTex, ovOuterColorTex, vtcOverlay);\n            vec4 overlayColor \x3d overlayOpacity * overlayColorOpaque;\n            vec4 groundColor \x3d tileColor;\n            tileColor \x3d tileColor * (1.0 - overlayColor.a) + overlayColor;"],
["\n            vec4 overlayColorOpaque \x3d getOverlayColor(ovInnerColorTex, ovOuterColorTex, vtcOverlay);\n            vec4 overlayColor \x3d overlayOpacity * overlayColorOpaque;\n            vec4 groundColor \x3d tileColor;\n            tileColor \x3d tileColor * (1.0 - overlayColor.a) + overlayColor;"]))):"",b.atmosphere?d.glsl(C||(C=c.__makeTemplateObject(["\n            float ndotl \x3d max(0.0, min(1.0, vndl));\n            atm \x3d atmosphere(wlight, wnormal, -viewDirection);\n            atm *\x3d max(0.0, min(1.0, (1.0-lum(tileColor.rgb)*1.5))); //avoid atmosphere on bright base maps\n            atm *\x3d max(0.0, min(1.0, ndotl*2.0)); // avoid atmosphere on dark side of the globe\n            atm *\x3d tileColor.a; // premultiply with tile alpha"],
["\n            float ndotl \x3d max(0.0, min(1.0, vndl));\n            atm \x3d atmosphere(wlight, wnormal, -viewDirection);\n            atm *\x3d max(0.0, min(1.0, (1.0-lum(tileColor.rgb)*1.5))); //avoid atmosphere on bright base maps\n            atm *\x3d max(0.0, min(1.0, ndotl*2.0)); // avoid atmosphere on dark side of the globe\n            atm *\x3d tileColor.a; // premultiply with tile alpha"]))):"",g?d.glsl(D||(D=c.__makeTemplateObject(["\n            vec4 overlayWaterMask \x3d getOverlayColor(ovInnerWaterTex, ovOuterWaterTex, vtcOverlay);\n            float waterNormalLength \x3d length(overlayWaterMask);\n            if (waterNormalLength \x3e 0.95) {\n              mat3 tbnMatrix \x3d mat3(tbnTangent, tbnBiTangent, vnormal);\n              vec4 waterOverlayColor \x3d vec4(overlayColor.w \x3e 0.0 ? overlayColorOpaque.xyz/overlayColor.w : vec3(1.0), overlayColor.w);\n              vec4 viewPosition \x3d view*vec4(vpos, 1.0);\n              vec4 waterColorLinear \x3d getOverlayWaterColor(overlayWaterMask, waterOverlayColor, -normalize(vpos - camPos), shadow, vnormal, tbnMatrix, viewPosition.xyz);\n              vec4 waterColorNonLinear \x3d delinearizeGamma(vec4(waterColorLinear.xyz, 1.0));\n              // un-gamma the ground color to mix in linear space\n              gl_FragColor \x3d mix(groundColor, waterColorNonLinear, waterColorLinear.w);\n            }"],
["\n            vec4 overlayWaterMask \x3d getOverlayColor(ovInnerWaterTex, ovOuterWaterTex, vtcOverlay);\n            float waterNormalLength \x3d length(overlayWaterMask);\n            if (waterNormalLength \x3e 0.95) {\n              mat3 tbnMatrix \x3d mat3(tbnTangent, tbnBiTangent, vnormal);\n              vec4 waterOverlayColor \x3d vec4(overlayColor.w \x3e 0.0 ? overlayColorOpaque.xyz/overlayColor.w : vec3(1.0), overlayColor.w);\n              vec4 viewPosition \x3d view*vec4(vpos, 1.0);\n              vec4 waterColorLinear \x3d getOverlayWaterColor(overlayWaterMask, waterOverlayColor, -normalize(vpos - camPos), shadow, vnormal, tbnMatrix, viewPosition.xyz);\n              vec4 waterColorNonLinear \x3d delinearizeGamma(vec4(waterColorLinear.xyz, 1.0));\n              // un-gamma the ground color to mix in linear space\n              gl_FragColor \x3d mix(groundColor, waterColorNonLinear, waterColorLinear.w);\n            }"]))):
"",b.screenSizePerspective?d.glsl(E||(E=c.__makeTemplateObject(["\n          float perspectiveScale \x3d screenSizePerspectiveScaleFloat(1.0, screenSizeCosAngle, screenSizeDistanceToCamera, screenSizePerspective);\n          if (perspectiveScale \x3c\x3d 0.25) {\n            gl_FragColor \x3d mix(gl_FragColor, vec4(1.0, 0.0, 0.0, 1.0), perspectiveScale * 4.0);\n          }\n          else if (perspectiveScale \x3c\x3d 0.5) {\n            gl_FragColor \x3d mix(gl_FragColor, vec4(0.0, 0.0, 1.0, 1.0), (perspectiveScale - 0.25) * 4.0);\n          }\n          else if (perspectiveScale \x3e\x3d 0.99) {\n            gl_FragColor \x3d mix(gl_FragColor, vec4(0.0, 1.0, 0.0, 1.0), 0.2);\n          }\n          else {\n            gl_FragColor \x3d mix(gl_FragColor, vec4(1.0, 0.0, 1.0, 1.0), (perspectiveScale - 0.5) * 2.0);\n          }"],
["\n          float perspectiveScale \x3d screenSizePerspectiveScaleFloat(1.0, screenSizeCosAngle, screenSizeDistanceToCamera, screenSizePerspective);\n          if (perspectiveScale \x3c\x3d 0.25) {\n            gl_FragColor \x3d mix(gl_FragColor, vec4(1.0, 0.0, 0.0, 1.0), perspectiveScale * 4.0);\n          }\n          else if (perspectiveScale \x3c\x3d 0.5) {\n            gl_FragColor \x3d mix(gl_FragColor, vec4(0.0, 0.0, 1.0, 1.0), (perspectiveScale - 0.25) * 4.0);\n          }\n          else if (perspectiveScale \x3e\x3d 0.99) {\n            gl_FragColor \x3d mix(gl_FragColor, vec4(0.0, 1.0, 0.0, 1.0), 0.2);\n          }\n          else {\n            gl_FragColor \x3d mix(gl_FragColor, vec4(1.0, 0.0, 1.0, 1.0), (perspectiveScale - 0.5) * 2.0);\n          }"]))):
"",b.tileBorders?d.glsl(F||(F=c.__makeTemplateObject(["\n            vec2 dVuv \x3d fwidth(vuv);\n            vec2 edgeFactors \x3d smoothstep(vec2(0.0), 1.5 * dVuv, min(vuv, 1.0 - vuv));\n            float edgeFactor \x3d 1.0 - min(edgeFactors.x, edgeFactors.y);\n            gl_FragColor \x3d mix(gl_FragColor, vec4(1.0, 0.0, 0.0, 1.0), edgeFactor);"],["\n            vec2 dVuv \x3d fwidth(vuv);\n            vec2 edgeFactors \x3d smoothstep(vec2(0.0), 1.5 * dVuv, min(vuv, 1.0 - vuv));\n            float edgeFactor \x3d 1.0 - min(edgeFactors.x, edgeFactors.y);\n            gl_FragColor \x3d mix(gl_FragColor, vec4(1.0, 0.0, 0.0, 1.0), edgeFactor);"]))):
""))}if(1===b.output||3===b.output)a.include(e.Transform,{linearDepth:!0}),a.include(U.RgbaFloatEncoding),a.include(O.OutputDepth,{output:b.output}),a.include(f.NormalUtils,b),a.varyings.add("linearDepth","float"),a.vertex.uniforms.add("nearFar","vec2"),a.vertex.code.add(d.glsl(G||(G=c.__makeTemplateObject(["\n        void main(void) {\n          vec3 normal \x3d getLocalUp(position, origin);\n          vec2 uv \x3d uv0;\n          vec3 vpos \x3d applySkirts(uv, position, normal.xyz, skirtScale);\n\n          gl_Position \x3d transformPositionWithDepth(proj, view, vpos, nearFar, linearDepth);\n        }\n    "],
["\n        void main(void) {\n          vec3 normal \x3d getLocalUp(position, origin);\n          vec2 uv \x3d uv0;\n          vec3 vpos \x3d applySkirts(uv, position, normal.xyz, skirtScale);\n\n          gl_Position \x3d transformPositionWithDepth(proj, view, vpos, nearFar, linearDepth);\n        }\n    "])))),a.fragment.code.add(d.glsl(H||(H=c.__makeTemplateObject(["\n        void main() {\n          outputDepth(linearDepth);\n        }\n    "],["\n        void main() {\n          outputDepth(linearDepth);\n        }\n    "]))));
2===b.output&&(a.include(e.Transform,{linearDepth:!1}),a.include(f.NormalUtils,b),a.varyings.add("vnormal","vec3"),a.varyings.add("vpos","vec3"),a.vertex.uniforms.add("viewNormal","mat4"),a.vertex.code.add(d.glsl(I||(I=c.__makeTemplateObject(["\n        void main(void) {\n          vec3 normal \x3d getLocalUp(position, origin);\n          vec2 uv \x3d uv0;\n          vpos \x3d applySkirts(uv, position, normal, skirtScale);\n\n          gl_Position \x3d transformPosition(proj, view, vpos);\n          vnormal \x3d normalize((viewNormal * vec4(normal, 1.0)).xyz);\n        }\n    "],
["\n        void main(void) {\n          vec3 normal \x3d getLocalUp(position, origin);\n          vec2 uv \x3d uv0;\n          vpos \x3d applySkirts(uv, position, normal, skirtScale);\n\n          gl_Position \x3d transformPosition(proj, view, vpos);\n          vnormal \x3d normalize((viewNormal * vec4(normal, 1.0)).xyz);\n        }\n    "])))),a.fragment.code.add(d.glsl(J||(J=c.__makeTemplateObject(["\n        void main() {\n          vec3 normal \x3d normalize(vnormal);\n          if (gl_FrontFacing \x3d\x3d false) {\n            normal \x3d -normal;\n          }\n          gl_FragColor \x3d vec4(vec3(0.5) + 0.5 * normal, 0.0);\n        }\n    "],
["\n        void main() {\n          vec3 normal \x3d normalize(vnormal);\n          if (gl_FrontFacing \x3d\x3d false) {\n            normal \x3d -normal;\n          }\n          gl_FragColor \x3d vec4(vec3(0.5) + 0.5 * normal, 0.0);\n        }\n    "])))));4===b.output&&(a.include(e.Transform,{linearDepth:!1}),a.include(f.NormalUtils,b),a.include(l.Overlay,{pbrMode:0}),a.vertex.code.add(d.glsl(K||(K=c.__makeTemplateObject(["\n          void main() {\n            vec3 vnormal \x3d getLocalUp(position, origin);\n            vec2 uv \x3d uv0;\n            vec3 vpos \x3d applySkirts(uv, position, vnormal, skirtScale);\n            setOverlayVTC(uv);\n\n            gl_Position \x3d transformPosition(proj, view, vpos);\n          }\n      "],
["\n          void main() {\n            vec3 vnormal \x3d getLocalUp(position, origin);\n            vec2 uv \x3d uv0;\n            vec3 vpos \x3d applySkirts(uv, position, vnormal, skirtScale);\n            setOverlayVTC(uv);\n\n            gl_Position \x3d transformPosition(proj, view, vpos);\n          }\n      "])))),a.include(P.OutputHighlight),a.fragment.code.add(d.glsl(L||(L=c.__makeTemplateObject(["\n        void main() {\n          vec4 overlayColor \x3d getCombinedOverlayColor();\n\n          if (overlayColor.a \x3d\x3d 0.0) {\n            gl_FragColor \x3d vec4(0.0);\n            return;\n          }\n\n          outputHighlight();\n        }\n      "],
["\n        void main() {\n          vec4 overlayColor \x3d getCombinedOverlayColor();\n\n          if (overlayColor.a \x3d\x3d 0.0) {\n            gl_FragColor \x3d vec4(0.0);\n            return;\n          }\n\n          outputHighlight();\n        }\n      "])))));return a};var n,p,q,r,t,u,v,m,w,x,z,A,B,C,D,E,F,y,G,H,I,J,K,L});