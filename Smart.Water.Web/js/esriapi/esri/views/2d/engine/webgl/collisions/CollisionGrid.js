// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../definitions"],function(d,e,f){Object.defineProperty(e,"__esModule",{value:!0});d=function(){function c(a,b){void 0===b&&(b=2);this._bucketSize=a;this._rowsLength=f.TILE_SIZE/a;this._colsLength=f.TILE_SIZE/a;this._elementsPerBucket=b;this._grid=this._initGrid()}c.prototype.checkOverlap=function(a,b){a=Math.floor(a/this._bucketSize);b=Math.floor(b/this._bucketSize);return 0>a||a>=this._rowsLength||0>b||b>=this._colsLength?!0:this._grid[b*this._colsLength+a]>=this._elementsPerBucket};
c.prototype.markUsed=function(a,b){this._grid[Math.floor(b/this._bucketSize)*this._colsLength+Math.floor(a/this._bucketSize)]+=1};c.prototype.reset=function(){this._grid=this._initGrid()};c.prototype._initGrid=function(){return new Uint8Array(this._rowsLength*this._colsLength)};return c}();e.CollisionGrid=d});