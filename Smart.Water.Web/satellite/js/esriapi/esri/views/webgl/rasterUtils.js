// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../webgl"],function(k,g,h){Object.defineProperty(g,"__esModule",{value:!0});g.createRasterTexture=function(a,c,e,b){void 0===e&&(e="nearest");void 0===b&&(b=!1);var f=!(b&&"u8"===c.pixelType);b=f?5126:5121;f=null==c.pixels||0===c.pixels.length?null:f?c.getAsRGBAFloat():c.getAsRGBA();return new h.Texture(a,{width:c.width,height:c.height,target:3553,pixelFormat:6408,internalFormat:6408,samplingMode:"bilinear"===e||"cubic"===e?9729:9728,dataType:b,wrapMode:33071,flipped:!1},
f)};g.createFrameBuffer=function(a,c,e,b){b=new h.Texture(a,{width:c,height:e,target:3553,pixelFormat:6408,internalFormat:6408,samplingMode:9728,dataType:b?5121:5126,wrapMode:33071,flipped:!1});return new h.FramebufferObject(a,{colorTarget:0,depthStencilTarget:3,width:c,height:e},b)};g.createTransformTexture=function(a,c){for(var e=4*c.size[0],b=c.size[1],f={width:e,height:b,target:3553,pixelFormat:6408,internalFormat:6408,dataType:5126,samplingMode:9728,wrapMode:33071,flipped:!1},e=new Float32Array(e*
b*4),d=b=0;d<c.coefficients.length;d++)e[b++]=c.coefficients[d],2===d%3&&(e[b++]=1);return new h.Texture(a,f,e)};g.createColormapTexture=function(a,c){return new h.Texture(a,{width:c.length/4,height:1,target:3553,pixelFormat:6408,internalFormat:6408,dataType:5121,samplingMode:9728,wrapMode:33071,flipped:!1},c)};g.getCommonUniforms=function(a,c,e,b,f,d){void 0===b&&(b=1);void 0===f&&(f=!0);void 0===d&&(d=!1);return{u_flipY:f,u_isFloatTexture:d,u_applyTransform:a?!0:!1,u_opacity:b,u_transformSpacing:a?
a.spacing:null,u_transformGridSize:a?a.size:null,u_targetImageSize:c,u_srcImageSize:e}};g.getColormapUniforms=function(a,c){return{u_colormapOffset:c||0,u_colormapMaxIndex:a?a.length/4-1:null}};g.getBasicGridUniforms=function(a,c){return{u_scale:a,u_offset:c}};g.getStretchUniforms=function(a){return{u_bandCount:a.bandCount,u_minOutput:a.outMin,u_maxOutput:a.outMax,u_minCutOff:a.minCutOff,u_maxCutOff:a.maxCutOff,u_factor:a.factor,u_useGamma:a.useGamma,u_gamma:a.gamma,u_gammaCorrection:a.gammaCorrection}};
g.getShadedReliefUniforms=function(a){return{u_hillshadeType:a.hillshadeType,u_sinZcosAs:a.sinZcosAs,u_sinZsinAs:a.sinZsinAs,u_cosZs:a.cosZs,u_weights:a.weights,u_factor:a.factor,u_minValue:a.minValue,u_maxValue:a.maxValue}};g.getUniformLocationInfos=function(a,c){a=a.gl;c=c.glName;for(var e=a.getProgramParameter(c,a.ACTIVE_UNIFORMS),b=new Map,f,d=0;d<e;d++)(f=a.getActiveUniform(c,d))&&b.set(f.name,{location:a.getUniformLocation(c,f.name),info:f});return b};g.setUniforms=function(a,c,e){Object.keys(e).forEach(function(b){var f=
c.get(b)||c.get(b+"[0]");if(f){var d=e[b];if(null!==f&&null!=d)switch(f=f.info,f.type){case 5126:1<f.size?a.setUniform1fv(b,d):a.setUniform1f(b,d);break;case 35664:a.setUniform2fv(b,d);break;case 35665:a.setUniform3fv(b,d);break;case 35666:a.setUniform4fv(b,d);break;case 35675:a.setUniformMatrix3fv(b,d);break;case 35676:a.setUniformMatrix4fv(b,d);break;case 5124:1<f.size?a.setUniform1iv(b,d):a.setUniform1i(b,d);break;case 35670:a.setUniform1i(b,d?1:0);break;case 35667:case 35671:a.setUniform2iv(b,
d);break;case 35668:case 35672:a.setUniform3iv(b,d);break;case 35669:case 35673:a.setUniform4iv(b,d)}}})};g.setTextures=function(a,c,e,b){e.length===b.length&&(b.some(function(a){return null==a})||e.some(function(a){return null==a})||e.forEach(function(e,d){c.setUniform1i(e,d);a.bindTexture(b[d],d)}))}});