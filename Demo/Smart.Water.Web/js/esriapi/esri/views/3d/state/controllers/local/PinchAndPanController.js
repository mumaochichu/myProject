// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../../core/mathUtils ../../../../../core/screenUtils ../../../../../core/accessorSupport/decorators ../../../../../core/libs/gl-matrix-2/vec3 ../../../../../core/libs/gl-matrix-2/vec3f64 ../../../camera/constraintUtils ../../../input/util ../InteractiveController ../momentum/PanPlanarMomentumController ../momentum/RotationMomentumController ../momentum/ZoomPlanarMomentumController ../../utils/navigationUtils ../../../support/geometryUtils ../../../webgl-engine/lib/Camera ../../../../navigation/PanPlanarMomentumEstimator ../../../../navigation/RotationMomentumEstimator ../../../../navigation/ZoomMomentumEstimator".split(" "),
function(u,k,t,y,q,v,n,l,p,w,z,A,B,C,m,b,D,E,F,G){Object.defineProperty(k,"__esModule",{value:!0});var r;(function(b){b[b.Vertical=0]="Vertical";b[b.Horizontal=1]="Horizontal"})(r=k.PanMode||(k.PanMode={}));var x=l.vec3f64.fromValues(0,0,1),H=16/180*Math.PI;u=function(k){function g(a){a=k.call(this,a)||this;a.view=null;a.rotationValueSmooth=new w.ExponentialFalloff(.05);a.scalingValueSmooth=new w.ExponentialFalloff(.05);a.planeHorizontal=b.plane.create();a.planeVertical=b.plane.create();a.rotationMomentumEstimator=
new F.RotationMomentumEstimator;a.panMomentumEstimator=new E.PanPlanarMomentumEstimator(300,12,.9);a.zoomMomentumEstimator=new G.ZoomMomentumEstimator;a.beginCenter=l.vec3f64.create();a.tmpPoints=[];a.beginCenterScreen=q.createScreenPointArray();a.tmpCentroid3d=l.vec3f64.create();a.tmpCentroid2d=q.createScreenPointArray();a.tmp2d=q.createScreenPointArray();a.constraintOptions={selection:15,interactionType:0,interactionFactor:0,interactionStartCamera:new D.default,interactionDirection:null,tiltMode:0};
return a}t.__extends(g,k);Object.defineProperty(g.prototype,"intersectionHelper",{get:function(){return this.view.sceneIntersectionHelper},enumerable:!0,configurable:!0});g.prototype.begin=function(a){if(this.active){var d=this.view.navigation.momentumEnabled;this.zoomMomentumEstimator.enabled=d;this.rotationMomentumEstimator.enabled=d;this.panMomentumEstimator.enabled=d;this.beginRadius=a.radius;this.pointerCount=a.pointers.size;this.beginAngle=a.angle;this.rotationValueSmooth.reset();this.scalingValueSmooth.reset();
q.screenPointObjectToArray(a.center,this.beginCenterScreen);b.plane.fromNormalAndOffset(x,0,this.planeHorizontal);d=l.vec3f64.create();this.intersectionHelper.intersectScreenFreePointFallback(this.beginCenterScreen,d);var h=l.vec3f64.create();n.vec3.negate(h,this.beginCamera.viewForward);var c=l.vec3f64.create();n.vec3.copy(c,x);var e=n.vec3.dot(h,c);this.panMode=y.asinClamped(0>e?-e:e)>=H?r.Horizontal:r.Vertical;b.plane.setOffsetFromPoint(this.planeHorizontal,d,this.planeHorizontal);this.beginCamera.aboveGround||
b.plane.negate(this.planeHorizontal,this.planeHorizontal);this.panMode===r.Vertical?(n.vec3.scale(c,c,e),n.vec3.subtract(this.planeVertical,h,c),n.vec3.normalize(this.planeVertical,this.planeVertical),b.plane.setOffsetFromPoint(this.planeVertical,d,this.planeVertical),this.computePlanePoints(a.pointers,this.planeVertical,this.beginCamera,this.tmpPoints)):this.computePlanePoints(a.pointers,this.planeHorizontal,this.beginCamera,this.tmpPoints);m.centroid(this.tmpPoints,this.beginCenter);this.constraintOptions.interactionStartCamera.copyFrom(this.beginCamera)}};
g.prototype.update=function(a){if(this.active){this.currentCamera.copyFrom(this.beginCamera);var d=1<a.pointers.size,h=this.panMode===r.Horizontal?this.planeHorizontal:this.planeVertical,c=this.beginCenter;if(d){var e=this.beginRadius/a.radius,f=.001875*Math.min(Math.max(a.radius,40),120);this.scalingValueSmooth.gain=f;this.scalingValueSmooth.update(e);m.applyZoomToPoint(this.currentCamera,c,this.scalingValueSmooth.value,this.view.state.constraints.minimumPoiDistance);this.zoomMomentumEstimator.add(this.scalingValueSmooth.value,
.001*a.timestamp);this.constraintOptions.interactionType=1;this.constraintOptions.interactionFactor=p.pixelDistanceToInteractionFactor(Math.abs(a.radius-this.beginRadius));p.applyAll(this.view,this.currentCamera,this.constraintOptions)}this.computePlanePoints(a.pointers,h,this.currentCamera,this.tmpPoints);m.centroid(this.tmpPoints,this.tmpCentroid3d);q.screenPointObjectToArray(a.center,this.tmpCentroid2d);m.applyPanPlanar(this.currentCamera,c,this.tmpCentroid3d);this.panMomentumEstimator.add(this.tmpCentroid2d,
this.tmpCentroid3d,.001*a.timestamp);this.constraintOptions.interactionType=4;this.constraintOptions.interactionFactor=p.pixelDistanceToInteractionFactor(this.beginCenterScreen,this.tmpCentroid2d);p.applyAll(this.view,this.currentCamera,this.constraintOptions);d&&(d=this.planeHorizontal,h=this.rotationValueSmooth.value,e=m.normalizeRotationDelta(a.angle-h),f=.00125*Math.min(Math.max(a.radius,40),120),this.rotationValueSmooth.gain=f,this.rotationValueSmooth.update(h+e),f=this.rotationValueSmooth.value-
this.beginAngle,this.rotationMomentumEstimator.add(f,.001*a.timestamp),m.applyRotation(this.currentCamera,c,b.axisAngle.wrapAxisAngle(d,f)),this.constraintOptions.interactionType=2,this.constraintOptions.interactionFactor=p.pixelDistanceToInteractionFactor(Math.abs(a.radius*f)),p.applyAll(this.view,this.currentCamera,this.constraintOptions));this.currentCamera.markViewDirty()}};g.prototype.end=function(a){a.pointers.size===this.pointerCount&&this.update(a);this.finishController();return(a=this.zoomMomentumEstimator.evaluateMomentum())?
new C.ZoomPlanarMomentumController({view:this.view,momentum:a,zoomCenter:this.beginCenter}):(a=this.rotationMomentumEstimator.evaluateMomentum())?new B.RotationMomentumController({view:this.view,momentum:a,center:this.beginCenter,axis:b.plane.normal(this.planeHorizontal)}):(a=this.panMomentumEstimator.evaluateMomentum())?new A.PanPlanarMomentumController({view:this.view,momentum:a}):null};g.prototype.computePlanePoints=function(a,d,b,c){c.length=a.size;var e=this.tmp2d,f=0;a.forEach(function(a){e[0]=
a.x;e[1]=a.y;void 0===c[f]&&(c[f]=l.vec3f64.create());m.intersectPlaneFromScreenPoint(d,b,e,c[f]);f+=1});return c};t.__decorate([v.property({constructOnly:!0})],g.prototype,"view",void 0);return g=t.__decorate([v.subclass("esri.views.3d.state.controllers.local.PinchAndPanController")],g)}(z.InteractiveController);k.PinchAndPanController=u});