// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports ../../../../../core/lang ../../../../../core/screenUtils ../../../../../core/libs/gl-matrix-2/mat4 ../../../../../core/libs/gl-matrix-2/vec2 ../../../../../core/libs/gl-matrix-2/vec3 ../../../../../core/libs/gl-matrix-2/vec3f64".split(" "),function(z,d,k,e,l,f,g,m){function h(a,c,b){var d=b._stage.getCamera();b.renderCoordsHelper.toRenderCoords(a,n);d.projectPoint(n,p);e.renderArrayToScreen(b,p,c)}Object.defineProperty(d,"__esModule",{value:!0});var q=m.vec3f64.create();d.copyParameter=
function(a,c){a=k.mixin({},a);c=k.clone(c);k.mixin(a,c);return a};d.resizeArray=function(a,c,b,d){for(;a.length<c;)a.push(b());if(d)for(;a.length>c;)b=a.pop(),d(b);else a.length=c};d.scaleTranslateMatrix=function(a,c,b){l.mat4.identity(b);l.mat4.translate(b,b,c);g.vec3.set(q,a,a,a);l.mat4.scale(b,b,q)};d.midpoint=function(a,c){g.vec3.set(c,0,0,0);if(0<a.length){for(var b=0;b<a.length;++b)g.vec3.add(c,c,a[b]);g.vec3.scale(c,c,1/a.length)}};d.screenSpaceTangent=function(a,c,b,d){d.projectPoint(a,r);
d.projectPoint(c,t);f.vec2.subtract(b,x,y);f.vec2.normalize(b,b)};d.projectPoint=h;d.pointToPointScreenDistance=function(a,c,b){h(a,u,b);h(c,v,b);return f.vec2.distance(u,v)};d.pointToScreenPositionDistance=function(a,c,b){h(a,w,b);return f.vec2.distance(w,c)};var n=m.vec3f64.create(),p=e.createRenderScreenPointArray3(),r=e.createRenderScreenPointArray3(),y=r,t=e.createRenderScreenPointArray3(),x=t,w=e.createScreenPointArray(),u=e.createScreenPointArray(),v=e.createScreenPointArray()});