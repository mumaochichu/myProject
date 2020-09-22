// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../../core/compilerUtils ../../../../../core/Evented ../../../../../core/Handles ../../../../../core/handleUtils ../../../../../core/maybe ../../../../../core/watchUtils ../../../../../core/accessorSupport/decorators ../../../../../core/libs/gl-matrix-2/vec3 ../../../../../layers/graphics/dehydratedFeatures ../../../../../support/elevationInfoUtils ../../Manipulator3D ../../manipulatorUtils ../dragEventPipeline3D ../manipulatorUtils ../settings ../visualElementUtils ../editGeometry/EditGeometryHelper ../manipulations/config ../manipulations/MoveManipulation ../manipulations/moveUtils ../manipulations/MoveXYGraphicManipulation ../../visualElements/OutlineVisualElement ../../../layers/graphics/GraphicState ../../../support/stack ../../../webgl-engine/lib/Geometry ../../../webgl-engine/lib/GeometryUtil ../../../../interactive/dragEventPipeline".split(" "),
function(B,w,q,I,J,C,K,h,L,r,x,D,y,M,p,N,E,f,O,F,P,z,Q,R,S,T,U,t,u,A){Object.defineProperty(w,"__esModule",{value:!0});B=function(G){function e(a){a=G.call(this,a)||this;a._vertexManipulatorMaterial=p.createManipulatorMaterial(f.settings.colorToVec4(f.settings.reshapeManipulators.vertex.color),f.settings.reshapeManipulators.vertex.renderOccludedFlag);a._vertexManipulatorOutlineMaterial=p.createManipulatorOutlineMaterial(f.settings.colorToVec4(f.settings.reshapeManipulators.vertex.outlineColor),f.settings.reshapeManipulators.vertex.renderOccludedFlag);
a._vertexManipulatorHoverOutlineMaterial=p.createManipulatorOutlineMaterial(f.settings.colorToVec4(f.settings.reshapeManipulators.vertex.hoverOutlineColor),f.settings.reshapeManipulators.vertex.renderOccludedFlag);a._edgeManipulatorMaterial=p.createManipulatorMaterial(f.settings.colorToVec4(f.settings.reshapeManipulators.edge.color),f.settings.reshapeManipulators.edge.renderOccludedFlag);a._edgeManipulatorOutlineMaterial=p.createManipulatorOutlineMaterial(f.settings.colorToVec4(f.settings.reshapeManipulators.edge.outlineColor),
f.settings.reshapeManipulators.edge.renderOccludedFlag);a._selectedManipulatorMaterial=p.createManipulatorMaterial(f.settings.colorToVec4(f.settings.reshapeManipulators.selected.color),f.settings.reshapeManipulators.selected.renderOccludedFlag);a._selectedManipulatorOutlineMaterial=p.createManipulatorOutlineMaterial(f.settings.colorToVec4(f.settings.reshapeManipulators.selected.outlineColor),f.settings.reshapeManipulators.selected.renderOccludedFlag);a._selectedManipulatorHoverOutlineMaterial=p.createManipulatorOutlineMaterial(f.settings.colorToVec4(f.settings.reshapeManipulators.selected.hoverOutlineColor),
f.settings.reshapeManipulators.selected.renderOccludedFlag);a._selectedIndex=0;a._vertexManipulatorGeometry=null;a._vertexManipulatorOutlineGeometry=null;a._edgeManipulatorGeometry=null;a._edgeManipulatorOutlineGeometry=null;a._handles=new C;a._manipulatorHandles=new C;a._manipulatorInfos=[];a._reshapeHelper=null;a._graphicMoveManipulation=null;a._moveManipulation=null;a._numGrabbing=0;a._numDragging=0;a._reshapeEventState=0;a._outlineVisualElement=null;a.tool=null;a.outputGeometry=null;a._vertexLaserLineVisualElement=
null;return a}q.__extends(e,G);e.prototype.initialize=function(){var a=this,b=new T.GraphicState({graphic:this.graphic});this._graphicState=b;this._handles.add([b.watch("displaying",function(b){for(var c=0,d=a._manipulatorInfos;c<d.length;c++)d[c].manipulator.available=b}),this.view.trackGraphicState(b)])};e.prototype.destroy=function(){this._clear();this._handles.destroy()};Object.defineProperty(e.prototype,"inputGeometry",{get:function(){return h.isSome(this._reshapeHelper)?this._reshapeHelper.geometry:
null},set:function(a){this._recreateManipulators(a)},enumerable:!0,configurable:!0});Object.defineProperty(e.prototype,"manipulators",{get:function(){return this.tool.manipulators},enumerable:!0,configurable:!0});Object.defineProperty(e.prototype,"view",{get:function(){return this.tool.view},enumerable:!0,configurable:!0});Object.defineProperty(e.prototype,"graphic",{get:function(){return this.tool.graphic},enumerable:!0,configurable:!0});Object.defineProperty(e.prototype,"enableZ",{get:function(){return this.tool.enableZ},
enumerable:!0,configurable:!0});e.prototype.removeSelectedVertices=function(){var a=this._manipulatorInfos.filter(function(a){return a.manipulator.selected&&"vertex"===a.handle.type});this._removeVertices(a)};e.prototype.manipulatorSelectionChanged=function(){this.emit("manipulators-changed")};e.prototype._clear=function(){this._moveManipulation&&this._moveManipulation.destroy();this._graphicMoveManipulation&&this._graphicMoveManipulation.destroy();this._manipulatorHandles.removeAll();this.manipulators.removeAll();
this._manipulatorInfos=[];this._reshapeHelper=this._moveManipulation=this._graphicMoveManipulation=null;this._numDragging=this._numGrabbing=0};e.prototype._recreateManipulators=function(a){void 0===a&&(a=this.inputGeometry);this._clear();if(!h.isNone(a)){this._reshapeHelper=new H(F.EditGeometry.fromGeometry(a,this.view.viewingMode),a.type);a=y.getGraphicEffectiveElevationInfo(this.graphic);for(var b=0,c=this._reshapeHelper.data.components;b<c.length;b++){for(var k=c[b],d=0,l=k.vertices;d<l.length;d++)this._createPerVertexManipulator(l[d],
a);d=0;for(k=k.edges;d<k.length;d++)this._createPerVertexManipulator(k[d],a)}this._createGraphicMoveManipulators(a)}};e.prototype._perGraphicManipulatorDragAction=function(a,b){if("end"!==b.action){var c=[],k=this._manipulatorInfos.some(function(a){return"vertex"===a.handle.type&&a.manipulator.selected}),d=1===a&&k;a=h.unwrap(this._reshapeHelper);for(var l=0,g=this._manipulatorInfos;l<g.length;l++)k=g[l],"vertex"!==k.handle.type||k.manipulator.grabbing||d&&!k.manipulator.selected||(h.unwrap(a).moveVertices([k.handle],
b.mapDeltaX,b.mapDeltaY,b.mapDeltaZ),c.push(k.handle.pos),this._updateManipulatorPosition(k));if(0!==c.length){l=d=0;for(g=this._manipulatorInfos;l<g.length;l++)k=g[l],"vertex"===k.handle.type&&d++;this.outputGeometry=a.geometry;c.length===d?(this._updateEventState(1),this.destroyed||this.emit("move",{type:"move",dx:b.screenDeltaX,dy:b.screenDeltaY,mover:this.graphic})):(this._updateEventState(2),this.destroyed||this.emit("reshape",{type:"reshape",mover:this.graphic}))}}};e.prototype._perVertexManipulatorDragAction=
function(a,b){this._updateEventState(2);if(!this.destroyed){var c=b.mapDeltaX,k=b.mapDeltaY,d=b.mapDeltaZ;if(c||k||d){b=[];for(var l=0,g=this._manipulatorInfos;l<g.length;l++){var e=g[l];"vertex"===e.handle.type&&(e.manipulator.selected&&!e.manipulator.grabbing||e===a)&&b.push(e)}l=h.unwrap(this._reshapeHelper);for(g=0;g<b.length;g++)a=b[g],l.moveVertices([a.handle],c,k,d);this.outputGeometry=l.geometry;for(c=0;c<b.length;c++)a=b[c],this._updateManipulatorPosition(a);this.emit("reshape",{type:"reshape",
mover:this.graphic})}}};e.prototype._updateEventState=function(a){if(a===this._reshapeEventState)return!1;switch(a){case 0:if(0!==this._numGrabbing||0!==this._numDragging)return!1;switch(this._reshapeEventState){case 1:this.emit("move",{type:"move-stop",dx:0,dy:0,mover:this.graphic});break;case 2:this.emit("reshape",{type:"reshape-stop",mover:this.graphic})}break;case 1:switch(this._reshapeEventState){case 0:this.emit("move",{type:"move-start",dx:0,dy:0,mover:this.graphic});break;case 2:this.emit("reshape",
{type:"reshape-stop",mover:this.graphic}),this.destroyed||this.emit("move",{type:"move-start",dx:0,dy:0,mover:this.graphic})}break;case 2:switch(this._reshapeEventState){case 0:this.emit("reshape",{type:"reshape-start",mover:this.graphic});break;case 1:this.emit("move",{type:"move-stop",dx:0,dy:0,mover:this.graphic}),this.destroyed||this.emit("reshape",{type:"reshape-start",mover:this.graphic})}}if(this.destroyed)return!1;var b=this._reshapeEventState!==a;this._reshapeEventState=a;return b};e.prototype._createGraphicMoveManipulators=
function(a){var b=this;this._graphicMoveManipulation=new R.MoveXYGraphicManipulation({tool:this.tool,view:this.view,graphicState:this._graphicState});this._manipulatorHandles.add(this._graphicMoveManipulation.createDragPipeline(function(a,d,c){d.next(function(a){return b._trackNumDragging(a)}).next(function(a){b._perGraphicManipulatorDragAction(0,a)});c.next(b._cancelDragOperation())}));this._graphicMoveManipulation.forEachManipulator(function(a){return b._manipulatorHandles.add([b._watchAndUpdateGrabState(a,
!1),a.events.on("immediate-click",function(a){b._manipulatorInfos.some(function(a){return a.manipulator.selected})?b._clearSelection():b.emit("immediate-click");a.stopPropagation()})])});this._moveManipulation=new z.MoveManipulation({tool:this.tool,view:this.view,xyAvailable:!0,xyAxisAvailable:!0,zAvailable:this.enableZ&&E.canMoveZ(this.graphic),snapToScene:!1,radius:z.MoveManipulation.radiusForSymbol(this.graphic.symbol)});this._moveManipulation.forEachManipulator(function(a){b._handles.add([b._watchAndUpdateGrabState(a,
!1),a.events.on("immediate-click",function(d){b._moveManipulation.zManipulation.hasManipulator(a)||b._manipulatorInfos.some(function(a){return a.manipulator.selected})||b.emit("immediate-click");d.stopPropagation()})])});this._moveManipulation.elevationInfo={mode:"absolute-height",offset:0};var c=h.unwrap(this.graphic.geometry).spatialReference;this._handles.add([this._moveManipulation.createDragPipeline(function(a,d,c){d.next(function(a){return b._trackNumDragging(a)}).next(A.addMapDelta()).next(function(a){b._perGraphicManipulatorDragAction(1,
a)});c.next(b._cancelDragOperation())},a,c),L.init(this._graphicState,"displaying",function(a){b._moveManipulation.xyManipulation.available=a;b._moveManipulation.xyAxisManipulation.available=!0;b._moveManipulation.zManipulation.available=a&&b.enableZ&&E.canMoveZ(b.graphic);b._updateMoveManipulationPosition()}),this._graphicState.on("changed",function(){return b._updateMoveManipulationPosition()})]);this._updateMoveManipulationPosition();a=O.createVisualElements({view:this.view,graphic:this.graphic,
forEachManipulator:function(a){if(!b.destroyed){b._graphicMoveManipulation.forEachManipulator(a);for(var d=0,c=b._manipulatorInfos;d<c.length;d++)a(c[d].manipulator,1);b._moveManipulation.forEachManipulator(a)}},onManipulatorsChanged:function(a){return b.on("manipulators-changed",a)}});this._outlineVisualElement=a.visualElement instanceof S.OutlineVisualElement?a.visualElement:null;h.isSome(this._outlineVisualElement)&&this._manipulatorHandles.add([this._outlineVisualElement.events.on("attachment-origin-changed",
function(){b._graphicState.isDraped||b._updateMoveManipulationPosition()}),this._graphicState.watch("isDraped",function(){return b._updateMoveManipulationPosition()})]);this._manipulatorHandles.add(a)};e.prototype._createPerVertexManipulator=function(a,b){var c=this;void 0===b&&(b=y.getGraphicEffectiveElevationInfo(this.graphic));if(h.isNone(this._vertexManipulatorGeometry)||h.isNone(this._vertexManipulatorOutlineGeometry)){var k=f.settings.reshapeManipulators.vertex,d=k.size/2,e=d+k.collisionPadding;
this._vertexManipulatorGeometry=new t(u.createSphereGeometry(d/e,16,16),"reshape-manipulator");d=(d+k.outlineSize)/e;this._vertexManipulatorOutlineGeometry=new t(u.createSphereGeometry(d,16,16),"reshape-manipulator-outline")}if(h.isNone(this._edgeManipulatorGeometry)||h.isNone(this._edgeManipulatorOutlineGeometry))k=f.settings.reshapeManipulators.edge,d=k.size/2,e=d+k.collisionPadding,this._edgeManipulatorGeometry=new t(u.createSphereGeometry(d/e,16,16),"reshape-manipulator"),d=(d+k.outlineSize)/
e,this._edgeManipulatorOutlineGeometry=new t(u.createSphereGeometry(d,16,16),"reshape-manipulator-outline");d=new M.Manipulator3D({view:this.view,renderObjects:[{geometry:this._vertexManipulatorGeometry,material:this._vertexManipulatorMaterial,stateMask:n.Vertex|4},{geometry:this._vertexManipulatorOutlineGeometry,material:this._vertexManipulatorOutlineMaterial,stateMask:n.Vertex|5},{geometry:this._vertexManipulatorOutlineGeometry,material:this._vertexManipulatorHoverOutlineMaterial,stateMask:n.Vertex|
6},{geometry:this._edgeManipulatorGeometry,material:this._vertexManipulatorMaterial,stateMask:n.Edge|6},{geometry:this._vertexManipulatorOutlineGeometry,material:this._vertexManipulatorHoverOutlineMaterial,stateMask:n.Edge|6},{geometry:this._edgeManipulatorGeometry,material:this._edgeManipulatorMaterial,stateMask:n.Edge|5},{geometry:this._edgeManipulatorOutlineGeometry,material:this._edgeManipulatorOutlineMaterial,stateMask:n.Edge|5},{geometry:this._vertexManipulatorGeometry,material:this._selectedManipulatorMaterial,
stateMask:8},{geometry:this._vertexManipulatorOutlineGeometry,material:this._selectedManipulatorOutlineMaterial,stateMask:9},{geometry:this._vertexManipulatorOutlineGeometry,material:this._selectedManipulatorHoverOutlineMaterial,stateMask:10}],elevationInfo:b,focusMultiplier:1,touchMultiplier:1,available:!(!this.graphic.visible||!this.graphic.layer.visible)});this._setTypeSpecificManipulatorSettings(d,a,b);var g="edge"===a.type?{manipulator:d,handle:a,locationUpdateHandle:null,type:"edge",selectedIndex:0}:
{manipulator:d,handle:a,type:"vertex",selectedIndex:0};this._manipulatorInfos.push(g);this.manipulators.add(d);this._updateManipulatorPosition(g);"edge"===g.type&&(a=this._getManipulatorInfoFromHandle(g.handle.left).manipulator.events.on("location-update",function(){return c._updateManipulatorPosition(g)}),b=this._getManipulatorInfoFromHandle(g.handle.right).manipulator.events.on("location-update",function(){return c._updateManipulatorPosition(g)}),g.locationUpdateHandle=K.handlesGroup([a,b]),this._manipulatorHandles.add(g.locationUpdateHandle,
d));this._manipulatorHandles.add(this._watchAndUpdateGrabState(d,!0),d);a=A.createManipulatorDragEventPipeline(d,function(a,b,d){b.next(function(a){return c._trackNumDragging(a)}).next(function(a){"edge"===g.handle.type&&c._splitEdgeManipulator(g);return a}).next(N.screenToMapXYForGraphicAtLocation(c.view,c.graphic,a.elevationAlignedLocation,a.location.spatialReference)).next(A.addMapDelta()).next(function(a){"vertex"===g.type?c._perVertexManipulatorDragAction(g,a):console.error("drag operation on non-vertex manipulator not allowed")});
d.next(c._cancelDragOperation())});this._manipulatorHandles.add(a,d);this._manipulatorHandles.add([d.events.on("immediate-click",function(a){return c._manipulatorClickCallback(a,g)}),d.events.on("select-changed",function(){g.selectedIndex=++c._selectedIndex;c._updateMoveManipulationPosition()})]);this.emit("manipulators-changed");return d};e.prototype._trackNumDragging=function(a){switch(a.action){case "start":this._numDragging++;break;case "end":this._numDragging--}return a};e.prototype._cancelDragOperation=
function(){var a=this,b=h.isSome(this._reshapeHelper)?this._reshapeHelper.geometry.clone():null;return function(){a._numDragging--;a.inputGeometry=b;a.outputGeometry=b;switch(a._reshapeEventState){case 1:a.emit("move",{type:"move",dx:0,dy:0,mover:a.graphic});break;case 2:a.emit("reshape",{type:"reshape",mover:a.graphic})}a.destroyed||a._updateEventState(0)}};e.prototype._setTypeSpecificManipulatorSettings=function(a,b,c){switch(b.type){case "vertex":a.state=n.Vertex;a.selectable=!0;a.cursor="move";
a.collisionPriority=2;a.radius=f.settings.reshapeManipulators.vertex.size/2+f.settings.reshapeManipulators.vertex.collisionPadding;a.elevationInfo=c;break;case "edge":a.state=n.Edge;a.selectable=!1;a.cursor="copy";a.collisionPriority=-1;a.radius=f.settings.reshapeManipulators.edge.size/2+f.settings.reshapeManipulators.edge.collisionPadding;a.elevationInfo={mode:"absolute-height",offset:0};break;default:I.neverReached(b)}};e.prototype._watchAndUpdateGrabState=function(a,b){var c=this;return a.events.on("grab-changed",
function(e){if("start"===e.action)b&&c._updateSelection(a),c._numGrabbing++;else if(c._numGrabbing--,c._updateEventState(0),c.destroyed)return;c._moveManipulation.interactive=!c._numGrabbing})};e.prototype._clearSelection=function(){for(var a=0,b=this._manipulatorInfos;a<b.length;a++){var c=b[a];c.manipulator.grabbing||(c.manipulator.selected=!1)}};e.prototype._updateSelection=function(a){a.grabbing&&!a.selected&&a.selectable&&(this._clearSelection(),a.selected=!0,this.emit("manipulators-changed"))};
e.prototype._removeManipulator=function(a){a&&(this._manipulatorHandles.remove(a.manipulator),this._manipulatorInfos.splice(this._manipulatorInfos.indexOf(a),1),this.manipulators.remove(a.manipulator),this.emit("manipulators-changed"))};e.prototype._getManipulatorInfoFromHandle=function(a){if(a)for(var b=0,c=this._manipulatorInfos;b<c.length;b++){var e=c[b];if(a===e.handle)return e}return null};e.prototype._updateManipulatorPosition=function(a){if(a){var b=h.unwrap(this._reshapeHelper);if("vertex"===
a.handle.type)a.manipulator.location=b.data.coordinateHelper.toPoint(a.handle.pos,v),a.manipulator.grabbing&&h.isSome(this._vertexLaserLineVisualElement)&&(this._vertexLaserLineVisualElement.visualElement.intersectsWorldUpAtLocation=a.manipulator.renderLocation);else if("edge"===a.handle.type){var c=this._getManipulatorInfoFromHandle(a.handle.left).manipulator.elevationAlignedLocation,e=this._getManipulatorInfoFromHandle(a.handle.right).manipulator.elevationAlignedLocation;a.manipulator.elevationAlignedLocation=
D.makeDehydratedPoint(c.x+.5*(e.x-c.x),c.y+.5*(e.y-c.y),c.hasZ&&e.hasZ?c.z+.5*(e.z-c.z):void 0,b.geometry.spatialReference)}}};e.prototype._splitEdgeManipulator=function(a){var b=h.unwrap(this._reshapeHelper),c=h.unwrap(b.splitEdge(a.handle,.5).createdVertex);a.locationUpdateHandle.remove();a.locationUpdateHandle=void 0;a.handle=c;a.type="vertex";var e=y.getGraphicEffectiveElevationInfo(this.graphic);this._setTypeSpecificManipulatorSettings(a.manipulator,a.handle,e);c.left&&this._createPerVertexManipulator(c.left);
c.right&&this._createPerVertexManipulator(c.right);this.outputGeometry=b.geometry;this._updateManipulatorPosition(a);this._updateSelection(a.manipulator);a=b.data.coordinateHelper.toArray(a.handle.pos);b=b.data.components.indexOf(c.component);this.emit("vertex-add",{type:"vertex-add",vertices:[{coordinates:a,componentIndex:b,vertexIndex:h.unwrap(c.index)}],added:a})};e.prototype._updateMoveManipulationPosition=function(){var a=this,b=U.sv3d.get();x.vec3.set(b,0,0,0);for(var c=0,e=!1,d=null,l=null,
g=0,f=this._manipulatorInfos;g<f.length;g++){var m=f[g];if("vertex"===m.handle.type)if(m.manipulator.selected)if(c++,x.vec3.add(b,b,m.manipulator.renderLocation),h.isNone(d)||m.selectedIndex>d.selectedIndex)l=d,d=m;else{if(h.isNone(l)||m.selectedIndex>l.selectedIndex)l=m}else e=!0}this._moveManipulation.xyAxisManipulation.orthogonalAvailable=!0;this._moveManipulation.xyAxisManipulation.available=!0;0!==c?(g=0,h.isSome(d)&&(f=d.handle.pos,m=h.isSome(l)?l.handle.pos:d.handle.left&&d.handle.left.left?
d.handle.left.left.pos:null,d=!h.isSome(l)&&d.handle.right&&d.handle.right.right?d.handle.right.right.pos:null,m&&d?this._moveManipulation.xyAxisManipulation.available=!1:m?g=Math.atan2(f[1]-m[1],f[0]-m[0])+Math.PI/2:d&&(g=Math.atan2(d[1]-f[1],d[0]-f[0])+Math.PI/2)),this._moveManipulation.xyAxisManipulation.orthogonalAvailable=1!==c,this._moveManipulation.angle=g,this._moveManipulation.radius=P.DISC_RADIUS_SMALL):(this._moveManipulation.angleDeferred=function(){return Q.primaryShapeOrientation(h.unwrap(a.graphic.geometry))},
this._moveManipulation.radius=z.MoveManipulation.radiusForSymbol(this.graphic.symbol));0!==c&&e?(x.vec3.scale(b,b,1/c),v.spatialReference=h.unwrap(this._reshapeHelper).geometry.spatialReference,this.view.renderCoordsHelper.fromRenderCoords(b,v),this._moveManipulation.elevationAlignedLocation=v):h.isSome(this._outlineVisualElement)&&!this._graphicState.isDraped&&h.isSome(this._outlineVisualElement.attachmentOrigin)?this._moveManipulation.elevationAlignedLocation=this._outlineVisualElement.attachmentOrigin:
p.placeAtGraphic(this.view,this._moveManipulation,this.graphic)};e.prototype._removeVertices=function(a){for(var b=[],c=h.unwrap(this._reshapeHelper),e=0;e<a.length;e++){var d=a[e];"vertex"===d.handle.type&&c.canRemoveVertex()&&(b.push(d.handle),this._removeManipulator(d),this._removeManipulator(this._getManipulatorInfoFromHandle(d.handle.left)),this._removeManipulator(this._getManipulatorInfoFromHandle(d.handle.right)),(d=h.unwrap(c.removeVertices([d.handle]).removedVertices[0].createdEdge))&&this._createPerVertexManipulator(d))}if(0<
b.length&&(a=b.map(function(a){var b=c.data.components.indexOf(a.component);return{coordinates:c.data.coordinateHelper.toArray(a.pos),componentIndex:b,vertexIndex:h.unwrap(a.index)}}),this.outputGeometry=c.geometry,b=this._updateEventState(2),!this.destroyed&&(this.emit("vertex-remove",{type:"vertex-remove",removed:a.map(function(a){return a.coordinates}),vertices:a}),!this.destroyed))){if(b&&(this._updateEventState(0),this.destroyed))return;this._updateMoveManipulationPosition()}};e.prototype._manipulatorClickCallback=
function(a,b){a.shiftKey||this._clearSelection();"vertex"===b.handle.type&&(b.manipulator.selected=!b.manipulator.selected);"vertex"===b.handle.type&&2===a.button&&this._removeVertices([b]);"edge"===b.handle.type&&0===a.button&&this._splitEdgeManipulator(b);a.stopPropagation()};q.__decorate([r.property({constructOnly:!0})],e.prototype,"tool",void 0);q.__decorate([r.property()],e.prototype,"inputGeometry",null);q.__decorate([r.property()],e.prototype,"outputGeometry",void 0);return e=q.__decorate([r.subclass("esri.views.3d.interactive.editingTools.graphicReshape3D.ReshapeOperation")],
e)}(J.EventedAccessor);w.ReshapeOperation=B;var v=D.makeDehydratedPoint(0,0,null,null),n;(function(f){f.Vertex=16;f.Edge=32})(n||(n={}));var H=function(f){function e(a,b){a=f.call(this,a,b)||this;a.type=b;a._geometry=null;return a}q.__extends(e,f);Object.defineProperty(e.prototype,"geometry",{get:function(){if(this._dirty){switch(this.type){case "polyline":this._geometry=this.data.toPolyline();break;case "polygon":this._geometry=this.data.toPolygon()}this._dirty=!1}return this._geometry},enumerable:!0,
configurable:!0});return e}(F.EditGeometryHelper);w.ReshapeGeometryHelper=H});