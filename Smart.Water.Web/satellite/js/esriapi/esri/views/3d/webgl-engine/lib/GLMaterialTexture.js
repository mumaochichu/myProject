// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../core/maybe ./DefaultTextureUnits ./GLMaterial".split(" "),function(k,l,g,e,c,h){return function(f){function d(a){var b=f.call(this,a)||this;b._textureIDs=new Set;b._textureRepository=a.textureRep;b._textureId=a.textureId;b._initTransparent=!!a.initTextureTransparent;b._texture=b._acquireIfNotUndefined(b._textureId);b._textureNormal=b._acquireIfNotUndefined(a.normalTextureId);b._textureEmissive=b._acquireIfNotUndefined(a.emissiveTextureId);b._textureOcclusion=
b._acquireIfNotUndefined(a.occlusionTextureId);b._textureMetallicRoughness=b._acquireIfNotUndefined(a.metallicRoughnessTextureId);return b}g.__extends(d,f);d.prototype.dispose=function(){var a=this;this._textureIDs.forEach(function(b){return a._textureRepository.release(b)});this._textureIDs.clear()};d.prototype.updateTexture=function(a){a!==this._textureId&&(this._releaseIfNotUndefined(this._textureId),this._textureId=a,this._texture=this._acquireIfNotUndefined(this._textureId))};d.prototype.bindTexture=
function(a,b){e.isSome(this._texture)&&(b.setUniform1i("tex",c.DefaultTextureUnits.DIFFUSE),a.bindTexture(this._texture.glTexture,c.DefaultTextureUnits.DIFFUSE));e.isSome(this._textureNormal)&&(b.setUniform1i("normalTexture",c.DefaultTextureUnits.NORMAL),a.bindTexture(this._textureNormal.glTexture,c.DefaultTextureUnits.NORMAL));e.isSome(this._textureEmissive)&&(b.setUniform1i("texEmission",c.DefaultTextureUnits.EMISSION),a.bindTexture(this._textureEmissive.glTexture,c.DefaultTextureUnits.EMISSION));
e.isSome(this._textureOcclusion)&&(b.setUniform1i("texOcclusion",c.DefaultTextureUnits.OCCLUSION),a.bindTexture(this._textureOcclusion.glTexture,c.DefaultTextureUnits.OCCLUSION));e.isSome(this._textureMetallicRoughness)&&(b.setUniform1i("texMetallicRoughness",c.DefaultTextureUnits.METALLIC_ROUGHNESS),a.bindTexture(this._textureMetallicRoughness.glTexture,c.DefaultTextureUnits.METALLIC_ROUGHNESS))};d.prototype.bindTextureScale=function(a,b){(a=e.isSome(this._texture)&&this._texture.glTexture)&&a.descriptor.textureCoordinateScaleFactor?
b.setUniform2fv("textureCoordinateScaleFactor",a.descriptor.textureCoordinateScaleFactor):b.setUniform2f("textureCoordinateScaleFactor",1,1)};d.prototype._acquireIfNotUndefined=function(a){if(!e.isNone(a))return this._textureIDs.add(a),this._textureRepository.acquire(a,this._initTransparent)};d.prototype._releaseIfNotUndefined=function(a){void 0!==a&&(this._textureIDs.delete(a),this._textureRepository.release(a))};return d}(h.GLMaterial)});