// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../core/Handles ../../core/Identifiable ../../core/watchUtils ../../core/accessorSupport/decorators ../Widget ../support/widget @dojo/framework/shim/Promise".split(" "),function(k,p,d,l,m,g,f,n,e){return function(h){function c(a,b){a=h.call(this,a,b)||this;a._legend=null;a._handles=new l;a.content=null;a.image=null;a.listItem=null;a.open=!1;a.visible=!0;return a}d.__extends(c,h);c.prototype.initialize=function(){var a=this;this.own([g.init(this,"content",function(b){return a._createLegend(b)})])};
c.prototype.destroy=function(){var a=this._legend;a&&a.destroy();this._legend=null};Object.defineProperty(c.prototype,"className",{get:function(){var a=this.image,b=this._getFirstWidget();return this._get("className")||!a&&b?b.iconClass:""},set:function(a){void 0===a?this._clearOverride("className"):this._override("className",a)},enumerable:!0,configurable:!0});Object.defineProperty(c.prototype,"title",{get:function(){var a=this._getFirstWidget();return this._get("title")||a?a.label:""},set:function(a){void 0===
a?this._clearOverride("title"):this._override("title",a)},enumerable:!0,configurable:!0});c.prototype.render=function(){return e.tsx("div",{class:"esri-layer-list-panel"},this._renderContents())};c.prototype._renderContent=function(a){var b=this._legend,c=this.listItem;return a?"legend"===a?c&&c.view&&c.layer&&b?e.tsx("div",{class:this.classes("esri-layer-list-panel__content","esri-layer-list-panel__content--legend"),key:b},b.render()):null:"string"===typeof a?e.tsx("div",{class:this.classes("esri-layer-list-panel__content",
"esri-layer-list-panel__content--string"),key:a,innerHTML:a}):e.isWidget(a)?e.tsx("div",{class:this.classes("esri-layer-list-panel__content","esri-layer-list-panel__content--widget"),key:a},a.render()):a instanceof HTMLElement?e.tsx("div",{class:this.classes("esri-layer-list-panel__content","esri-layer-list-panel__content--html-element"),key:a,bind:a,afterCreate:this._attachToNode}):null:null};c.prototype._renderContents=function(){var a=this,b=this.content;return Array.isArray(b)?b.map(function(b){return a._renderContent(b)}):
this._renderContent(b)};c.prototype._getLegendOptions=function(a){if(a){var b=a.layer;a=a.view;if(b&&a)return{view:a,layerInfos:[{layer:b,title:""}]}}};c.prototype._createLegend=function(a){var b=this;this._hasLegend(a)&&!this._legend&&(new Promise(function(a,b){k(["../Legend"],a,b)})).then(function(a){var c=b._handles,d=new a(b._getLegendOptions(b.listItem));b._legend=d;b.notifyChange("className");b.notifyChange("title");a=g.init(b,["listItem.view","listItem.layer"],function(){return b._updateLegend(d)});
c.add(a,"legends");b.scheduleRender()})};c.prototype._hasLegend=function(a){return"legend"===a?!0:Array.isArray(a)?a.some(function(a){return"legend"===a}):!1};c.prototype._attachToNode=function(a){a.appendChild(this)};c.prototype._updateLegend=function(a){var b=this.listItem;if(b){var c=b.layer;a.view=b.view;a.layerInfos=[{layer:c,title:null}];this.scheduleRender()}};c.prototype._getWidget=function(a){return"legend"===a?this._legend:e.isWidget(a)?a:null};c.prototype._getFirstWidget=function(){var a=
this,b=this.content;if(Array.isArray(b)){var c=null;b.some(function(b){(b=a._getWidget(b))&&(c=b);return!!b});return c}return this._getWidget(b)};d.__decorate([f.property({dependsOn:["content","image"]})],c.prototype,"className",null);d.__decorate([f.property(),e.renderable()],c.prototype,"content",void 0);d.__decorate([f.property()],c.prototype,"image",void 0);d.__decorate([f.property()],c.prototype,"listItem",void 0);d.__decorate([f.property({dependsOn:["content"]})],c.prototype,"title",null);d.__decorate([f.property(),
e.renderable()],c.prototype,"open",void 0);d.__decorate([f.property()],c.prototype,"visible",void 0);return c=d.__decorate([f.subclass("esri.widgets.LayerList.ListItemPanel")],c)}(m.IdentifiableMixin(n))});