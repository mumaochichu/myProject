// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","tslib","../../core/accessorSupport/decorators"],function(e,b,c,d){Object.defineProperty(b,"__esModule",{value:!0});b.ScaleRangeLayer=function(b){return function(b){function a(){var a=null!==b&&b.apply(this,arguments)||this;a.minScale=0;a.maxScale=0;return a}c.__extends(a,b);Object.defineProperty(a.prototype,"scaleRangeId",{get:function(){return this.minScale+","+this.maxScale},enumerable:!0,configurable:!0});c.__decorate([d.property({type:Number,nonNullable:!0,json:{write:!0}})],
a.prototype,"minScale",void 0);c.__decorate([d.property({type:Number,nonNullable:!0,json:{write:!0}})],a.prototype,"maxScale",void 0);c.__decorate([d.property({readOnly:!0,dependsOn:["minScale","maxScale"]})],a.prototype,"scaleRangeId",null);return a=c.__decorate([d.subclass("esri.layers.mixins.ScaleRangeLayer")],a)}(b)}});