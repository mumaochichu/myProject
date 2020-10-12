// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../core/watchUtils ../../core/accessorSupport/decorators ./Component ./UI ../../widgets/Attribution ../../widgets/Compass ../../widgets/NavigationToggle ../../widgets/Zoom".split(" "),function(q,r,d,e,f,h,k,l,m,n,p){return function(g){function b(a){a=g.call(this,a)||this;a._defaultPositionLookup={attribution:"manual",compass:"top-leading","navigation-toggle":"top-leading",zoom:"top-leading"};a.components=[];return a}d.__extends(b,g);b.prototype.initialize=function(){this._handles.add([e.init(this,
"components",this._componentsWatcher.bind(this)),e.init(this,"view",this._updateViewAwareWidgets.bind(this))])};b.prototype._removeComponents=function(a){var b=this;a.forEach(function(a){if(a=b._find(a))b.remove(a),a.destroy()})};b.prototype._updateViewAwareWidgets=function(a){var b=this;this.components.forEach(function(c){(c=(c=b._find(c))&&c.widget)&&void 0!==c.view&&(c.view=a)})};b.prototype._componentsWatcher=function(a,b){this._removeComponents(b);this._addComponents(a);this._adjustPadding(a)};
b.prototype._adjustPadding=function(a){-1!==a.indexOf("attribution")||this._isOverridden("padding")||(this.padding=this.padding.top)};b.prototype._addComponents=function(a){var b=this;this.initialized&&a.forEach(function(a){return b.add(b._createComponent(a),b._defaultPositionLookup[a])})};b.prototype._createComponent=function(a){var b=this._createWidget(a);if(b)return new h({id:a,node:b})};b.prototype._createWidget=function(a){if("attribution"===a)return this._createAttribution();if("compass"===
a)return this._createCompass();if("navigation-toggle"===a)return this._createNavigationToggle();if("zoom"===a)return this._createZoom()};b.prototype._createAttribution=function(){return new l({view:this.view})};b.prototype._createCompass=function(){return new m({view:this.view})};b.prototype._createNavigationToggle=function(){return new n({view:this.view})};b.prototype._createZoom=function(){return new p({view:this.view})};d.__decorate([f.property()],b.prototype,"components",void 0);return b=d.__decorate([f.subclass("esri.views.ui.DefaultUI")],
b)}(k)});