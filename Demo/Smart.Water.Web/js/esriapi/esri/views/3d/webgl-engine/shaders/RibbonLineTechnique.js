// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../core/maybe ../../../../core/maybe ../core/shaderLibrary/Slice.glsl ../core/shaderLibrary/Transform.glsl ../core/shaderLibrary/output/OutputHighlight.glsl ../core/shaderLibrary/shading/VisualVariables.glsl ../core/shaderTechnique/ReloadableShaderModule ../core/shaderTechnique/ShaderTechnique ../core/shaderTechnique/ShaderTechniqueConfiguration ../lib/StencilUtils ./RibbonLine.glsl ../../../webgl/Program ../../../webgl/renderState @dojo/framework/shim/Promise".split(" "),
function(m,h,c,l,n,p,q,r,t,u,k,b,d,v,w,g){Object.defineProperty(h,"__esModule",{value:!0});h.RibbonVertexAttributeConstants={POSITION:"position",SUBDIVISIONFACTOR:"subdivisionFactor",UV0:"uv0",AUXPOS1:"auxpos1",AUXPOS2:"auxpos2",SUBDIVISIONS:"subdivisions",COLOR:"color",COLORFEATUREATTRIBUTE:"colorFeatureAttribute",SIZE:"size",SIZEFEATUREATTRIBUTE:"sizeFeatureAttribute",OPACITYFEATUREATTRIBUTE:"opacityFeatureAttribute"};h.ribbonVertexAttributeLocations={position:0,subdivisionFactor:1,uv0:2,auxpos1:3,
auxpos2:4,size:6,sizeFeatureAttribute:6,color:5,colorFeatureAttribute:5,opacityFeatureAttribute:7};k=function(b){function a(e,a){a=b.call(this,e,a)||this;a.stipplePattern=null;a.stippleTextureBind=null;a.stippleTextureRepository=e.stippleTextureRepository;return a}c.__extends(a,b);a.prototype.initializeProgram=function(e){var b=a.shader.get(),f=this.configuration,b=b.build({output:f.output,slicePlaneEnabled:f.slicePlaneEnabled,sliceHighlightDisabled:f.sliceHighlightDisabled,sliceEnabledForVertexPrograms:!1,
stippleEnabled:f.stippleEnabled,stippleOffColorEnabled:f.stippleOffColorEnabled,stippleUVMaxEnabled:f.stippleIntegerRepeatsEnabled,stippleIntegerRepeatsEnabled:f.stippleIntegerRepeatsEnabled,roundCaps:f.roundCaps,roundJoins:f.roundJoins,vvColor:f.vvColor,vvSize:f.vvSize,vvInstancingEnabled:!0,vvOpacity:f.vvOpacity,falloffEnabled:f.falloffEnabled,innerColorEnabled:f.innerColorEnabled});return new w(e.rctx,b.generateSource("vertex"),b.generateSource("fragment"),h.ribbonVertexAttributeLocations)};a.prototype.dispose=
function(){b.prototype.dispose.call(this);this.stippleTextureRepository.release(this.stipplePattern);this.stippleTextureBind=this.stipplePattern=null};a.prototype.bindPass=function(e,a,b){4===this.configuration.output&&r.OutputHighlight.bindOutputHighlight(e,this.program,b);this.program.setUniform1f("intrinsicWidth",a.width);this.program.setUniform4fv("intrinsicColor",a.color);this.program.setUniform1f("miterLimit","miter"!==a.join?0:a.miterLimit);this.program.setUniform1f("nearPlane",b.nearFar[0]);
this.program.setUniform1f("pixelRatio",b.pixelRatio);this.program.setUniform2fv("screenSize",[b.viewport[2],b.viewport[3]]);t.VisualVariables.bindUniformsWithOpacity(this.program,a);if(this.stipplePattern!==a.stipplePattern){var c=a.stipplePattern;this.stippleTextureBind=this.stippleTextureRepository.swap(this.stipplePattern,c);this.stipplePattern=c}this.configuration.stippleEnabled&&(e=n.isSome(this.stippleTextureBind)?this.stippleTextureBind(e,0)*b.pixelRatio:1,this.program.setUniform1i("stipplePatternTexture",
0),this.program.setUniform1f("stipplePatternPixelSizeInv",1/e),this.configuration.stippleOffColorEnabled&&(e=l.unwrap(a.stippleOffColor),this.program.setUniform4f("stippleOffColor",e[0],e[1],e[2],3<e.length?e[3]:1)));this.configuration.falloffEnabled&&this.program.setUniform1f("falloff",a.falloff);this.configuration.innerColorEnabled&&(this.program.setUniform4fv("innerColor",l.unwrapOr(a.innerColor,a.color)),this.program.setUniform1f("innerWidth",a.innerWidth*b.pixelRatio))};a.prototype.bindDraw=
function(a){q.Transform.bindUniforms(this.program,a);p.Slice.bindUniformsWithOrigin(this.program,this.configuration,a)};a.prototype.initializePipeline=function(){var a=this.configuration,b=g.separateBlendingParams(770,1,771,771),c=a.polygonOffset&&x;a.occluder&&(this._occluderPipelineTransparent=g.makePipelineState({blending:b,polygonOffset:c,depthTest:d.depthCompareAlways,depthWrite:null,colorWrite:g.defaultColorWriteParams,stencilWrite:null,stencilTest:d.stencilToolTransparentOccluderParams}),this._occluderPipelineOpaque=
g.makePipelineState({polygonOffset:c,depthTest:d.depthCompareAlways,depthWrite:null,colorWrite:g.defaultColorWriteParams,stencilWrite:d.stencilWriteMaskOff,stencilTest:d.stencilToolMaskOccluderParams}),this._occluderPipelineMaskWrite=g.makePipelineState({polygonOffset:c,depthTest:d.depthCompareLess,depthWrite:null,colorWrite:null,stencilWrite:d.stencilWriteMaskOn,stencilTest:d.stencilToolMaskBaseParams}));if(0===a.output){var h=function(e){return g.makePipelineState({blending:b,polygonOffset:c,depthTest:d.depthCompareLess,
depthWrite:!a.transparent&&a.writeDepth&&g.defaultDepthWriteParams,colorWrite:g.defaultColorWriteParams,stencilWrite:a.sceneHasOcludees?d.stencilWriteMaskOn:null,stencilTest:a.sceneHasOcludees?e?d.stencilToolMaskBaseParams:a.sceneHasOcludees?d.stencilBaseAllZerosParams:null:null})};this._occludeePipeline=h(!0);return h(!1)}return g.makePipelineState({polygonOffset:c,depthTest:d.depthCompareLess,depthWrite:!a.transparent&&a.writeDepth&&g.defaultDepthWriteParams,colorWrite:g.defaultColorWriteParams})};
Object.defineProperty(a.prototype,"occluderPipelineTransparent",{get:function(){return this._occluderPipelineTransparent},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"occluderPipelineOpaque",{get:function(){return this._occluderPipelineOpaque},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"occludeePipeline",{get:function(){return this._occludeePipeline},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"occluderPipelineMaskWrite",{get:function(){return this._occluderPipelineMaskWrite},
enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"primitiveType",{get:function(){return 5},enumerable:!0,configurable:!0});a.shader=new u.ReloadableShaderModule(v,function(){return new Promise(function(a,b){m(["./RibbonLine.glsl"],a,b)})});return a}(k.ShaderTechnique);h.RibbonLineTechnique=k;var x={factor:0,units:-4};k=function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.output=0;a.occluder=!1;a.slicePlaneEnabled=!1;a.sliceHighlightDisabled=!1;a.vertexColors=!1;
a.transparent=!1;a.polygonOffset=!1;a.writeDepth=!1;a.stippleEnabled=!1;a.stippleOffColorEnabled=!1;a.stippleIntegerRepeatsEnabled=!1;a.roundCaps=!1;a.roundJoins=!1;a.vvSize=!1;a.vvColor=!1;a.vvOpacity=!1;a.falloffEnabled=!1;a.innerColorEnabled=!1;a.sceneHasOcludees=!1;return a}c.__extends(a,d);c.__decorate([b.parameter({count:7})],a.prototype,"output",void 0);c.__decorate([b.parameter()],a.prototype,"occluder",void 0);c.__decorate([b.parameter()],a.prototype,"slicePlaneEnabled",void 0);c.__decorate([b.parameter()],
a.prototype,"sliceHighlightDisabled",void 0);c.__decorate([b.parameter()],a.prototype,"vertexColors",void 0);c.__decorate([b.parameter()],a.prototype,"transparent",void 0);c.__decorate([b.parameter()],a.prototype,"polygonOffset",void 0);c.__decorate([b.parameter()],a.prototype,"writeDepth",void 0);c.__decorate([b.parameter()],a.prototype,"stippleEnabled",void 0);c.__decorate([b.parameter()],a.prototype,"stippleOffColorEnabled",void 0);c.__decorate([b.parameter()],a.prototype,"stippleIntegerRepeatsEnabled",
void 0);c.__decorate([b.parameter()],a.prototype,"roundCaps",void 0);c.__decorate([b.parameter()],a.prototype,"roundJoins",void 0);c.__decorate([b.parameter()],a.prototype,"vvSize",void 0);c.__decorate([b.parameter()],a.prototype,"vvColor",void 0);c.__decorate([b.parameter()],a.prototype,"vvOpacity",void 0);c.__decorate([b.parameter()],a.prototype,"falloffEnabled",void 0);c.__decorate([b.parameter()],a.prototype,"innerColorEnabled",void 0);c.__decorate([b.parameter()],a.prototype,"sceneHasOcludees",
void 0);return a}(b.ShaderTechniqueConfiguration);h.RibbonLineTechniqueConfiguration=k});