// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","tslib","../../core/JSONSupport","../../core/accessorSupport/decorators"],function(g,h,b,f,e){return function(c){function a(){var a=null!==c&&c.apply(this,arguments)||this;a.unit=null;return a}b.__extends(a,c);d=a;a.prototype.clone=function(){return new d({unit:this.unit})};var d;b.__decorate([e.property({type:String,json:{write:!0}})],a.prototype,"unit",void 0);return a=d=b.__decorate([e.subclass("esri.renderers.support.DotDensityLegendOptions")],a)}(f.JSONSupport)});