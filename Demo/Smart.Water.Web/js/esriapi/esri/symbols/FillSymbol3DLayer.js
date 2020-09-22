// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../core/maybe ../core/accessorSupport/decorators ./Symbol3DLayer ./edges/utils ./support/colors ./support/Symbol3DFillMaterial ./support/Symbol3DOutline".split(" "),function(p,q,c,f,d,l,m,g,n,h){return function(k){function b(a){a=k.call(this,a)||this;a.type="fill";a.material=null;a.castShadows=!0;a.outline=null;a.edges=null;return a}c.__extends(b,k);e=b;b.prototype.clone=function(){return new e({edges:f.isSome(this.edges)?this.edges.clone():null,enabled:this.enabled,
material:f.isSome(this.material)?this.material.clone():null,castShadows:this.castShadows,outline:f.isSome(this.outline)?this.outline.clone():null})};b.fromSimpleFillSymbol=function(a){return new e({material:{color:(a.color||g.transparentWhite).clone()},outline:a.outline?new h.default({size:a.outline.width||0,color:(a.outline.color||g.white).clone()}):null})};var e;c.__decorate([d.enumeration({Fill:"fill"})],b.prototype,"type",void 0);c.__decorate([d.property({type:n.default,json:{write:!0}})],b.prototype,
"material",void 0);c.__decorate([d.property({type:Boolean,nonNullable:!0,json:{write:!0,default:!0}})],b.prototype,"castShadows",void 0);c.__decorate([d.property({type:h.default,json:{write:!0}})],b.prototype,"outline",void 0);c.__decorate([d.property(m.symbol3dEdgesProperty)],b.prototype,"edges",void 0);return b=e=c.__decorate([d.subclass("esri.symbols.FillSymbol3DLayer")],b)}(l)});