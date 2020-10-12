// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../core/Accessor ../../core/HandleOwner ../../core/accessorSupport/decorators".split(" "),function(h,k,c,f,g,d){return function(e){function a(b){b=e.call(this,b)||this;b.arcade=null;b.config=null;b.description=null;b.feature=null;b.label=null;b.state="expanded";b.visibilityExpression=null;return b}c.__extends(a,e);Object.defineProperty(a.prototype,"compiledFunc",{get:function(){var b=this.arcade;return b&&b.arcadeUtils.createFunction(this.visibilityExpression)},enumerable:!0,
configurable:!0});Object.defineProperty(a.prototype,"evaluatedVisibility",{get:function(){var b=this.compiledFunc;if(b){var a=this.arcade;return a.arcadeUtils.executeFunction(b,a.arcadeUtils.createExecContext(this.feature))}},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"inputFields",{get:function(){return this._get("inputFields")},set:function(a){var b=this;this.handles.removeAll();a&&this.handles.add(a.map(function(a){return a.watch("visible",b._dirtyEvaluatedVisibility)}));
this._set("inputFields",a)},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"visible",{get:function(){return!1!==this.evaluatedVisibility&&this.inputFields&&this.inputFields.some(function(a){return a.visible})},enumerable:!0,configurable:!0});a.prototype._dirtyEvaluatedVisibility=function(){this.visibilityExpression&&this.notifyChange("evaluatedVisibility")};c.__decorate([d.property()],a.prototype,"arcade",void 0);c.__decorate([d.property({dependsOn:["arcade","visibilityExpression"]})],
a.prototype,"compiledFunc",null);c.__decorate([d.property()],a.prototype,"config",void 0);c.__decorate([d.property({dependsOn:["compiledFunc","feature"]})],a.prototype,"evaluatedVisibility",null);c.__decorate([d.property({aliasOf:"config.description"})],a.prototype,"description",void 0);c.__decorate([d.property()],a.prototype,"feature",void 0);c.__decorate([d.property()],a.prototype,"inputFields",null);c.__decorate([d.property({aliasOf:"config.label"})],a.prototype,"label",void 0);c.__decorate([d.property()],
a.prototype,"state",void 0);c.__decorate([d.property({aliasOf:"config.visibilityExpression"})],a.prototype,"visibilityExpression",void 0);c.__decorate([d.property({dependsOn:["evaluatedVisibility","inputFields"]})],a.prototype,"visible",null);return a=c.__decorate([d.subclass("esri.widgets.FeatureForm.InputFieldGroup")],a)}(g.HandleOwnerMixin(f))});