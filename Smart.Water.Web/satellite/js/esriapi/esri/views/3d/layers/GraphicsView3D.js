// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../core/Accessor ../../../core/maybe ../../../core/promiseUtils ../../../core/accessorSupport/decorators ./graphics/Graphics3DGraphicLikeLayerView ../../layers/GraphicsView".split(" "),function(l,m,b,e,f,g,c,h,k){return function(d){function a(a){a=d.call(this,a)||this;a.graphics3d=null;a.slicePlaneEnabled=!1;a.drapeSourceType=1;a.mockLayerId="__sceneView.graphics-"+Date.now().toString(16);return a}b.__extends(a,d);a.prototype.initialize=function(){this._set("graphics3d",
new h({owner:this,layer:{id:this.mockLayerId,uid:this.mockLayerId}}));this.graphics3d.setup()};a.prototype.destroy=function(){this.graphics3d&&(this.graphics3d.destroy(),this._set("graphics3d",null))};Object.defineProperty(a.prototype,"updating",{get:function(){return!(this.graphics3d&&!this.graphics3d.updating)},enumerable:!0,configurable:!0});a.prototype.notifyGraphicUpdate=function(a,b){this.graphics3d.graphicsCore.notifyGraphicUpdate(a,b)};Object.defineProperty(a.prototype,"graphics3DGraphics",
{get:function(){return this.graphics3d.graphicsCore.graphics3DGraphics},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"graphics3DGraphicsByObjectID",{get:function(){return this.graphics3d.graphicsCore.graphics3DGraphicsByObjectID},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"symbolUpdateType",{get:function(){return this.graphics3d.graphicsCore.symbolUpdateType},enumerable:!0,configurable:!0});a.prototype.getGraphicFromGraphicUid=function(a){return this.graphics3d.getGraphicFromGraphicUid(a)};
a.prototype.whenGraphicBounds=function(a,b){return this.graphics3d.whenGraphicBounds(a,b)};a.prototype.graphicChanged=function(a){this.graphics3d.graphicsCore.graphicUpdateHandler(a)};a.prototype.queryGraphics=function(){return g.resolve(this.loadedGraphics)};a.prototype.fetchPopupFeatures=function(a,c){return b.__awaiter(this,void 0,void 0,function(){return b.__generator(this,function(a){return[2,f.isSome(c)?c.clientGraphics:null]})})};b.__decorate([c.property({readOnly:!0,aliasOf:"view.graphics"})],
a.prototype,"graphics",void 0);b.__decorate([c.property({aliasOf:"graphics"})],a.prototype,"loadedGraphics",void 0);b.__decorate([c.property({readOnly:!0,dependsOn:["graphics3d.updating"]})],a.prototype,"updating",null);b.__decorate([c.property({constructOnly:!0})],a.prototype,"view",void 0);b.__decorate([c.property()],a.prototype,"graphics3d",void 0);b.__decorate([c.property({type:Boolean})],a.prototype,"slicePlaneEnabled",void 0);b.__decorate([c.property({aliasOf:"graphics3d.graphicsCore.hasDraped"})],
a.prototype,"hasDraped",void 0);return a=b.__decorate([c.subclass("esri.views.3d.layers.GraphicsView3D")],a)}(k.GraphicsView(e))});