// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../../../core/Logger ../../../../../../core/maybe ../../../../../../core/screenUtils ../../../../../../core/libs/gl-matrix-2/mat2d ../../../../../../core/libs/gl-matrix-2/mat2df32 ../../../../../../core/libs/gl-matrix-2/vec2 ../../../../../../core/libs/gl-matrix-2/vec2f32 ../../../../../../symbols/cim/placements/CIMMarkerPlacementHelper ../../enums ../../number ../../WGLDisplayRecord ./util".split(" "),function(E,n,v,w,x,y,r,z,g,t,A,B,p,C,q){Object.defineProperty(n,
"__esModule",{value:!0});var D=w.getLogger("esri.views.2d.engine.webgl.WGLMarkerTemplateBase"),u=3.14159265359/180;n.default=function(n){return function(n){function h(){for(var b=[],a=0;a<arguments.length;a++)b[a]=arguments[a];b=n.apply(this,b)||this;b.angle=0;b.xOffset=0;b.yOffset=0;b.width=0;b.height=0;b.boundsType="square";b._anchorX=0;b._anchorY=0;b._computedWidth=0;b._computedHeight=0;b.geometryType=B.WGLGeometryType.MARKER;return b}v.__extends(h,n);h.prototype.writeMeshWithGeometry=function(b,
a,c,e,l,d){c=a.indexVector;var m=a.get("geometry"),f=new C(e,this.geometryType,this._materialKey);a=a.getVector("geometry").vertexCount;b.push(f);f.vertexFrom=a;f.indexFrom=c.length;this._markerPlacement?this._writePlacedMarkers(f,m,c,a,e,l,d):q.isPoint(d)?(b=d.x,d=d.y,this._writeVertices(f,m,e,this._getPos(b,d)),this._writeIndices(f,c,a)):q.isPolyline(d)?this._writeMany(f,c,m,a,e,d.paths[0]):q.isPolygon(d)?(d=l.centroid)?(b=d.x,d=d.y,this._writeVertices(f,m,e,this._getPos(b,d)),this._writeIndices(f,
c,a)):D.error("Tried to render polygon geometries as markers, but found no centroid!"):q.isMultipoint(d)&&this._writeMany(f,c,m,a,e,d.points)};h.prototype._applyTransformation=function(b,a,c){void 0===c&&(c=0);r.mat2d.identity(b);r.mat2d.translate(b,b,t.vec2f32.fromValues(this.xOffset,-this.yOffset));0!==this.angle+c&&r.mat2d.rotate(b,b,u*(this.angle+c));c=this._computedWidth;var e=this._computedHeight,l=(this._anchorX-.5)*c,d=(this._anchorY-.5)*e;g.vec2.set(a,l,d);g.vec2.transformMat2d(a,a,b);this._offsetUpperLeft=
p.i1616to32(16*a[0],16*a[1]);g.vec2.set(a,l+c,d);g.vec2.transformMat2d(a,a,b);this._offsetUpperRight=p.i1616to32(16*a[0],16*a[1]);g.vec2.set(a,l,d+e);g.vec2.transformMat2d(a,a,b);this._offsetBottomLeft=p.i1616to32(16*a[0],16*a[1]);g.vec2.set(a,l+c,d+e);g.vec2.transformMat2d(a,a,b);this._offsetBottomRight=p.i1616to32(16*a[0],16*a[1])};h.prototype._writePlacedMarkers=function(b,a,c,e,l,d,m){if(d=A.CIMMarkerPlacementHelper.getPlacement(m,x.unwrap(this._markerPlacement),y.pt2px(1))){m=t.vec2f32.create();
for(var f=z.mat2df32.create(),h=0,k=d.next();null!=k;)-128<=k.tx&&640>=k.tx&&-128<=k.ty&&640>=k.ty&&(this._applyTransformation(f,m,k.getAngle()/u),this._writeVertices(b,a,l,this._getPos(k.tx,k.ty)),this._writeIndices(b,c,e+h),h+=4),k=d.next()}};h.prototype._getPos=function(b,a){return p.i1616to32(Math.round(8*b),Math.round(8*a))};h.prototype._writeMany=function(b,a,c,e,h,d){for(var m=0,f=0,l=0,k=0;k<d.length;k++){var g=d[k],n=g[0],g=g[1],p=this._getPos(n+m,g+f);this._writeVertices(b,c,h,p);this._writeIndices(b,
a,e+l);m+=n;f+=g;l+=4}};h.prototype._writeVertices=function(b,a,c,e){a.push(e);a.push(this._offsetUpperLeft);a.push(this._texUpperLeft);a.push(this._bitestAndDistRatio);a.push(c);a.push(this._fillColor);a.push(this._outlineColor);a.push(this._sizeOutlineWidth);a.push(e);a.push(this._offsetUpperRight);a.push(this._texUpperRight);a.push(this._bitestAndDistRatio);a.push(c);a.push(this._fillColor);a.push(this._outlineColor);a.push(this._sizeOutlineWidth);a.push(e);a.push(this._offsetBottomLeft);a.push(this._texBottomLeft);
a.push(this._bitestAndDistRatio);a.push(c);a.push(this._fillColor);a.push(this._outlineColor);a.push(this._sizeOutlineWidth);a.push(e);a.push(this._offsetBottomRight);a.push(this._texBottomRight);a.push(this._bitestAndDistRatio);a.push(c);a.push(this._fillColor);a.push(this._outlineColor);a.push(this._sizeOutlineWidth);b.vertexCount+=4};h.prototype._writeIndices=function(b,a,c){a.push(c+0);a.push(c+1);a.push(c+2);a.push(c+1);a.push(c+3);a.push(c+2);b.indexCount+=6};return h}(n)}});