// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../core/Error ../../../../core/maybe ../../../../core/ObjectPool ../../../../core/screenUtils ../../../../core/libs/gl-matrix-2/vec2f64 ../../../../symbols/callouts/calloutUtils ./ElevationAligners ./elevationAlignmentUtils ./ElevationContext ./Graphics3DObject3DGraphicLayer ./Graphics3DSymbolLayer ./graphicUtils ./pointUtils ../../webgl-engine/lib/Geometry ../../webgl-engine/lib/GeometryData ../../webgl-engine/lib/GeometryUtil ../../webgl-engine/lib/TextRenderParameters ../../webgl-engine/lib/TextTexture ../../webgl-engine/materials/HUDMaterial".split(" "),
function(p,q,r,z,h,A,B,C,D,E,v,F,G,H,w,t,I,J,u,K,L,x){function y(g,c,a){g&&g.forEach(function(b){var e=c(b);h.isSome(e)&&a(e,b.graphic)})}Object.defineProperty(q,"__esModule",{value:!0});var M=[0,0,1];p=function(g){function c(a,b,e,d){a=g.call(this,a,b,e,d)||this;a._geometryDataPool=new A(J.GeometryData,function(a,b,d){var e=b.translation;d=h.isSome(d)?[d.displayWidth,d.displayHeight]:[0,0];b=b.centerOffset;0===a.indexCount?u.createPointGeometry(M,e,null,d,b,[0,0],null,a):u.updatePointGeometry(null,
e,null,d,b,null,null,a)});a._elevationOptions={supportsOffsetAdjustment:!0,supportsOnTheGround:!1};a.ensureDrapedStatus(!1);return a}r.__extends(c,g);c.prototype.doLoad=function(){return r.__awaiter(this,void 0,void 0,function(){var a;return r.__generator(this,function(b){if(!this._drivenProperties.size&&(a=w.validateSymbolLayerSize(this.symbolLayer.size)))throw new z("graphics3dtextsymbollayer:invalid-size",a);this._createTextRenderParameters();return[2]})})};c.prototype._createTextRenderParameters=
function(){this._textRenderParameters=K.default.fromSymbol(this.symbolLayer,this._context.layerView.view.pixelRatio)};c.prototype.destroy=function(){g.prototype.destroy.call(this);this._geometryDataPool.destroy()};c.prototype.createGraphics3DGraphic=function(a){a=a.graphic;var b=t.placePointOnGeometry(a.geometry);if(h.isNone(b))return this.logger.warn("unsupported geometry type for text symbol: "+a.geometry.type),null;var e=this.symbolLayer.text;if(!e)return null;var d=D.isCalloutSupport(this.symbol)&&
this.symbol.hasVisibleVerticalOffset()?this.symbol:null;return this._createAs3DShape(a,b,e,d)};c.prototype.onRemoveGraphic=function(a){this._geometryDataPool.release(a.stageObject.geometries[0].data)};c.prototype.createLabel=function(a,b,e,d){a=a.graphic;var k=t.placePointOnGeometry(a.geometry);if(h.isNone(k))return this.logger.warn("unsupported geometry type for label: "+a.geometry.type),null;var c=b.text;return!c||/^\s+$/.test(c)?null:this._createAs3DShape(a,k,c,b,b,e,d)};c.prototype.setGraphicElevationContext=
function(a,b,c){void 0===c&&(c=0);a=g.prototype.setGraphicElevationContext.call(this,a,b);a.addOffsetRenderUnits(c);return a};c.prototype.layerOpacityChanged=function(){this.logger.warn("layer opacity change not yet implemented in Graphics3DTextSymbolLayer");return!1};c.prototype.layerElevationInfoChanged=function(a,b){var c=this;y(a,b,function(a,b){c.updateGraphicElevationContext(b,a)});return v.SymbolUpdateType.UPDATE};c.prototype.slicePlaneEnabledChanged=function(a,b){var c=this;y(a,b,function(a){var b=
0;for(a=a.stageObject.geometryRecords;b<a.length;b++)a[b].material.setParameterValues({slicePlaneEnabled:c._context.slicePlaneEnabled})});return!0};c.prototype.physicalBasedRenderingChanged=function(){return!0};c.prototype.pixelRatioChanged=function(){return!1};c.prototype.updateGraphicElevationContext=function(a,b){this.setGraphicElevationContext(a,b.elevationContext,b.metadata.elevationOffset);b.needsElevationUpdates=v.needsElevationUpdates2D(b.elevationContext.mode)||"absolute-height"===b.elevationContext.mode};
c.prototype._defaultElevationInfoNoZ=function(){return N};c.prototype._createAs3DShape=function(a,b,c,d,k,l,g){void 0===k&&(k=O);var e=this.setGraphicElevationContext(a,new F.ElevationContext,k.elevationOffset),n=this._context.layer.id+"_label_"+a.uid,m="polyline"===h.get(a.geometry,"type"),p=a.uid;a=this._context.stage.renderView.renderingContext;var f=w.namedAnchorToHUDMaterialAnchorPos[k.anchor in w.namedAnchorToHUDMaterialAnchorPos?k.anchor:"center"];a=h.isNone(g)?new L(a,c,this._textRenderParameters,
n):null;f={occlusionTest:!0,screenOffset:k.screenOffset,anchorPos:f,polygonOffset:!0,color:[1,1,1,1],centerOffsetUnits:k.centerOffsetUnits,debugDrawBorder:k.debugDrawBorder,drawInSecondSlot:!0};h.isSome(a)&&(f.textureId=a.id,f.texCoordScale=a.texcoordScale);h.isSome(g)&&(f.textureId=g.textureId);if(h.isSome(d)&&h.isSome(d.verticalOffset)){d=d.verticalOffset;g=d.minWorldLength;var q=d.maxWorldLength;f.verticalOffset={screenLength:B.pt2px(d.screenLength),minWorldLength:g||0,maxWorldLength:null!=q?q:
Infinity}}this._context.screenSizePerspectiveEnabled&&(d=this._context.sharedResources,g=d.screenSizePerspectiveSettings,f.screenSizePerspective=d.screenSizePerspectiveSettingsLabels.overridePadding(this._textRenderParameters.haloSize),f.screenSizePerspectiveAlignment=g);m&&(f.shaderPolygonOffset=1E-4);f.slicePlaneEnabled=this._context.slicePlaneEnabled;m=null;h.isSome(l)?(d=JSON.stringify(f),m=l.getMaterial(d),null==m&&(m=new x.default(f,n),l.addMaterial(d,m))):m=new x.default(f,n);m=[m];f=this._geometryDataPool.acquire(k,
a);f=[new I(f,n)];n=t.createStageObjectForHUD(this._context,b,f,m,null,null,e,n,this._context.layer.uid,p);if(null===n)return null;p=E.perObjectElevationAligner;l=new G(this,n.object,f,h.isNone(l)?m:null,h.isSome(a)?[a]:null,p,e);l.alignedSampledElevation=n.sampledElevation;l.needsElevationUpdates=v.needsElevationUpdates2D(e.mode)||"absolute-height"===e.mode;var e=h.isSome(a)?a:k,r=e.displayWidth,u=e.displayHeight;l.getScreenSize=function(a){void 0===a&&(a=C.vec2f64.create());a[0]=r;a[1]=u;return a};
l.metadata={labelText:c,elevationOffset:k.elevationOffset};t.extendPointGraphicElevationContext(l,b,this._context.elevationProvider);return l};return c}(H.default);q.Graphics3DTextSymbolLayer=p;var N={mode:"relative-to-ground",offset:0},O={text:null,translation:[0,0,0],elevationOffset:0,centerOffset:[0,0,0,1],screenOffset:[0,0],anchor:"center",verticalOffset:null,centerOffsetUnits:null,debugDrawBorder:!1,displayWidth:0,displayHeight:0};q.default=p});