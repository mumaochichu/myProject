// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../core/JSONSupport ../../core/lang ../../core/accessorSupport/decorators ./AuthoringInfoClassBreakInfo".split(" "),function(c,b,d,f,g,e,h){Object.defineProperty(b,"__esModule",{value:!0});c=function(c){function a(a){a=c.call(this,a)||this;a.field="";a.normalizationField="";a.label="";a.classBreakInfos=[];return a}d.__extends(a,c);b=a;a.prototype.clone=function(){return new b({field:this.field,normalizationField:this.normalizationField,label:this.label,classBreakInfos:g.clone(this.classBreakInfos)})};
var b;d.__decorate([e.property({type:String,json:{write:!0}})],a.prototype,"field",void 0);d.__decorate([e.property({type:String,json:{write:!0}})],a.prototype,"normalizationField",void 0);d.__decorate([e.property({type:String,json:{write:!0}})],a.prototype,"label",void 0);d.__decorate([e.property({type:[h.default],json:{write:!0}})],a.prototype,"classBreakInfos",void 0);return a=b=d.__decorate([e.subclass("esri.renderers.support.AuthoringInfoFieldInfo")],a)}(f.JSONSupport);b.AuthoringInfoFieldInfo=
c;b.default=c});