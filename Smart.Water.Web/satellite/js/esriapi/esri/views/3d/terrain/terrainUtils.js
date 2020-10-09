// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports ../../../layers/ElevationLayer ../../../layers/TileLayer ../../../layers/VectorTileLayer ../../2d/engine/vectorTiles/VectorTile ../support/StreamDataLoader ./RasterTile ./terrainUtilsPlanar ./terrainUtilsSpherical ./TileTexture".split(" "),function(D,b,r,t,u,v,w,x,y,z,A){function h(a){return a&&"esri.views.3d.layers.ImageryTileLayerView3D"===a.declaredClass}function l(a){return a&&"esri.views.3d.layers.TileLayerView3D"===a.declaredClass}function m(a){return a&&"esri.views.3d.layers.VectorTileLayerView3D"===
a.declaredClass}function n(a){return a&&"esri.views.3d.layers.WMTSLayerView3D"===a.declaredClass}function p(a){return a&&"esri.views.3d.layers.ElevationLayerView3D"===a.declaredClass}function k(a,b,c,d){return q["local"===d||"planar"===d?"planar":"spherical"].checkIfTileInfoSupportedForViewSR(a,c,b)}Object.defineProperty(b,"__esModule",{value:!0});var q={planar:y,spherical:z};b.weakAssert=function(a,b){a||console.warn("Terrain: "+b)};var B=80/180*Math.PI,C=110/180*Math.PI;b.autoUpdateSkirtsVisibility=
function(a,b,c,d){var e=q[a.manifold],f=e.isInsideExtent(a,b);f?c=a.getElevation(b[0],b[1],b[1],c):(c=a.elevationBounds,c=.5*(c.min+c.max));c=b[2]-c;d=Math.abs(c)<d?0:0>c?-1:1;f||(e.isInsideExtent(a,b,1.2)?(b=e.tiltToExtentEdge(a,b),b>B&&b<C&&(d=0)):d=0);a.skirtScale=d};b.getLayerWithExtentRange=function(a){return h(a)?{fullExtent:a.fullExtent,minScale:a.layer.minScale,maxScale:a.layer.maxScale,tilemapCache:null}:a.layer};b.isVectorTileLayer=function(a){return a&&a instanceof u};b.isImageryTileLayerView=
h;b.isTileLayerView=l;b.isVectorTileLayerView=m;b.isWMTSLayerView=n;b.isElevationLayerView=p;b.isSurfaceLayerView=function(a){return a&&(l(a)||h(a)||p(a)||m(a)||n(a))};b.isImageryTileRenderInfo=function(a){return a&&a.sourceLayerInfo&&a.sourceLayerInfo.data instanceof x.default};b.isVectorTileRenderInfo=function(a){return a&&a.sourceLayerInfo&&a.sourceLayerInfo.data instanceof v.VectorTile};b.isTextureTileRenderInfo=function(a){return a&&a.sourceLayerInfo&&a.sourceLayerInfo.data instanceof A.TileTexture};
b.isRasterTileRenderInfo=function(a){a=a&&a.sourceLayerInfo&&a.sourceLayerInfo.data;return a instanceof HTMLImageElement||a instanceof w.ImageWithType||a instanceof HTMLCanvasElement||a instanceof ImageData};b.useFetchTileForLayer=function(a){return a.fetchTile&&!(a.fetchTile===t.prototype.fetchTile||a.fetchTile===r.prototype.fetchTile)};b.checkIfTileInfoSupportedForView=k;b.getTiledLayerInfo=function(a,g,c){var d,e;if("wmts"===a.type){if(a=a.activeLayer){var f=a.tileMatrixSet;if(f)d=f.tileInfo,e=
f.fullExtent;else if(a=a.tileMatrixSets)if(a=a.find(function(a){return null==k(a.tileInfo,a.fullExtent,g,c)}))return{tileInfo:a.tileInfo,fullExtent:a.fullExtent}}}else e="imagery-tile"===a.type?a.getCompatibleFullExtent(g):a.fullExtent,d="vector-tile"!==a.type||b.test.force512VTL?"imagery-tile"===a.type?a.getCompatibleTileInfo(g,e):a.tileInfo:a.compatibleTileInfo256;return d&&e&&null==k(d,e,g,c)?{tileInfo:d,fullExtent:e}:{tileInfo:null,fullExtent:null}};b.test={force512VTL:!1}});