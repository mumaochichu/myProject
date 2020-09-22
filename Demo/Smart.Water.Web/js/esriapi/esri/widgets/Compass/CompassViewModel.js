// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../core/Accessor ../../core/Handles ../../core/watchUtils ../../core/accessorSupport/decorators ../support/GoTo".split(" "),function(l,m,c,g,h,e,d,k){return function(f){function b(a){a=f.call(this,a)||this;a._handles=new h;a.orientation={x:0,y:0,z:0};a.view=null;a._updateForCamera=a._updateForCamera.bind(a);a._updateForRotation=a._updateForRotation.bind(a);a._updateRotationWatcher=a._updateRotationWatcher.bind(a);a.view;return a}c.__extends(b,f);b.prototype.initialize=
function(){this._handles.add(e.init(this,"view",this._updateRotationWatcher))};b.prototype.destroy=function(){this._handles.destroy();this.view=this._handles=null};Object.defineProperty(b.prototype,"canShowNorth",{get:function(){var a=this.get("view.spatialReference");return!(!a||!a.isWebMercator&&!a.isGeographic)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"state",{get:function(){return this.get("view.ready")?this.canShowNorth?"compass":"rotation":"disabled"},enumerable:!0,
configurable:!0});b.prototype.reset=function(){if(this.get("view.ready")){var a={};"2d"===this.view.type?a.rotation=0:a.heading=0;this.callGoTo({target:a})}};b.prototype._updateForRotation=function(a){void 0!==a&&null!==a&&(this.orientation={z:a})};b.prototype._updateForCamera=function(a){a&&(this.orientation={x:0,y:0,z:-a.heading})};b.prototype._updateRotationWatcher=function(a){this._handles.removeAll();a&&("2d"===a.type?this._handles.add(e.init(this,"view.rotation",this._updateForRotation)):this._handles.add(e.init(this,
"view.camera",this._updateForCamera)))};c.__decorate([d.property({dependsOn:["view.spatialReference.isWebMercator","view.spatialReference.wkid"],readOnly:!0})],b.prototype,"canShowNorth",null);c.__decorate([d.property()],b.prototype,"orientation",void 0);c.__decorate([d.property({dependsOn:["view.ready","canShowNorth"],readOnly:!0})],b.prototype,"state",null);c.__decorate([d.property()],b.prototype,"view",void 0);c.__decorate([d.property()],b.prototype,"reset",null);return b=c.__decorate([d.subclass("esri.widgets.CompassViewModel")],
b)}(k.GoToMixin(g))});