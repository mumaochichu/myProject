// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../core/Collection ../../core/JSONSupport ../../core/lang ../../core/uuid ../../core/accessorSupport/decorators ./BuildingFilterAuthoringInfo ./BuildingFilterAuthoringInfoCheckbox ./BuildingFilterBlock".split(" "),function(q,r,b,h,k,f,l,c,m,g,n){var p=h.ofType(n);return function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.description=null;a.filterBlocks=null;a.id=l.generateUUID();a.name=null;return a}b.__extends(a,d);e=a;a.prototype.clone=function(){return new e({description:this.description,
filterBlocks:f.clone(this.filterBlocks),id:this.id,name:this.name,filterAuthoringInfo:f.clone(this.filterAuthoringInfo)})};var e;b.__decorate([c.property({type:String,json:{write:!0}})],a.prototype,"description",void 0);b.__decorate([c.property({type:p,json:{write:{enabled:!0,isRequired:!0}}})],a.prototype,"filterBlocks",void 0);b.__decorate([c.property({types:{key:"type",base:m,typeMap:{checkbox:g}},json:{read:function(a){switch(a&&a.type){case "checkbox":return g.fromJSON(a);default:return null}},
write:!0}})],a.prototype,"filterAuthoringInfo",void 0);b.__decorate([c.property({type:String,constructOnly:!0,json:{write:{enabled:!0,isRequired:!0}}})],a.prototype,"id",void 0);b.__decorate([c.property({type:String,json:{write:{enabled:!0,isRequired:!0}}})],a.prototype,"name",void 0);return a=e=b.__decorate([c.subclass("esri.layers.support.BuildingFilter")],a)}(k.JSONSupport)});