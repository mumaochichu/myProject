// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../TimeExtent ../../core/Accessor ../../core/accessorSupport/decorators ../../geometry/Extent ../../geometry/SpatialReference ./LayerTimeOptions ./layerUtils".split(" "),function(q,r,b,k,l,c,m,n,p,h){return function(e){function d(a){a=e.call(this,a)||this;a.extent=null;a.width=null;a.height=null;a.dpi=null;a.format=null;a.imageSpatialReference=null;a.layerDefinitions=[];a.layerOption=null;a.layerIds=null;a.transparent=!0;a.timeExtent=null;a.layerTimeOptions=null;return a}
b.__extends(d,e);d.prototype.toJSON=function(){var a=this.extent,a=a&&a.clone()._normalize(!0),d;if(this.timeExtent){var b=this.timeExtent.toJSON(),c=b.start,b=b.end;if(null!=c||null!=b)d=c===b?""+c:(null==c?"null":c)+","+(null==b?"null":b)}var c=this.layerOption,b=a?a.spatialReference.wkid||JSON.stringify(a.spatialReference.toJSON()):null,f=this.imageSpatialReference,g={dpi:this.dpi,format:this.format,transparent:this.transparent,size:null!==this.width&&null!==this.height?this.width+","+this.height:
null,bbox:a?a.xmin+","+a.ymin+","+a.xmax+","+a.ymax:null,bboxSR:b,layers:c?c+":"+this.layerIds.join(","):null,layerDefs:h.serializeLayerDefinitions(this.layerDefinitions),layerTimeOptions:h.serializeTimeOptions(this.layerTimeOptions),imageSR:f?f.wkid||JSON.stringify(f.toJSON()):b,time:d},e={};Object.keys(g).filter(function(a){return null!==g[a]}).forEach(function(a){return e[a]=g[a]});return e};b.__decorate([c.property({type:m})],d.prototype,"extent",void 0);b.__decorate([c.property()],d.prototype,
"width",void 0);b.__decorate([c.property()],d.prototype,"height",void 0);b.__decorate([c.property()],d.prototype,"dpi",void 0);b.__decorate([c.property()],d.prototype,"format",void 0);b.__decorate([c.property({type:n})],d.prototype,"imageSpatialReference",void 0);b.__decorate([c.property()],d.prototype,"layerDefinitions",void 0);b.__decorate([c.property()],d.prototype,"layerOption",void 0);b.__decorate([c.property()],d.prototype,"layerIds",void 0);b.__decorate([c.property()],d.prototype,"transparent",
void 0);b.__decorate([c.property({type:k})],d.prototype,"timeExtent",void 0);b.__decorate([c.property({type:[p]})],d.prototype,"layerTimeOptions",void 0);return d=b.__decorate([c.subclass("esri.layers.support.ImageParameters")],d)}(l)});