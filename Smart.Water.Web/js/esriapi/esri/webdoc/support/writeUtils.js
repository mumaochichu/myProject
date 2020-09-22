// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports ../../core/Error ../../core/lang ../../core/maybe ../../core/object ../../core/accessorSupport/extensions/serializableProperty/writer".split(" "),function(q,f,m,n,l,p,e){function k(a){return!("feature"!==a.type||a.url||!a.source||"memory"!==a.source.type)}Object.defineProperty(f,"__esModule",{value:!0});var g=new Set;"bing-maps open-street-map tile unknown unsupported vector-tile web-tile".split(" ").forEach(function(a){return g.add(a)});var h=new Set;"feature group tile unknown unsupported vector-tile web-tile".split(" ").forEach(function(a){return h.add(a)});
f.enableRestrictedWriting=function(a){g.delete(a);h.delete(a)};f.disableRestrictedWriting=function(a){g.add(a);h.add(a)};f.getLayerJSON=function(a,d,b){if(!("write"in a&&a.write))return b&&b.messages&&b.messages.push(new m("layer:unsupported","Layers ("+a.title+", "+a.id+") of type '"+a.declaredClass+"' cannot be persisted",{layer:a})),null;var c;b.restrictedWebMapWriting?(c="basemap"===b.layerContainerType?g:"operational-layers"===b.layerContainerType?h:null,c=l.isSome(c)?c.has(a.type)&&!k(a):!0):
c=!0;if(c)return d={},a.write(d,b)?d:null;if(l.isSome(d)){b=d=n.clone(d);if(k(a)){if(c=(c=p.getDeepValue("featureCollection.layers",b))&&c[0]&&c[0].layerDefinition)"maxScale"in a&&(c.maxScale=e.numberToJSON(a.maxScale)),"minScale"in a&&(c.minScale=e.numberToJSON(a.minScale))}else"group"!==a.type&&("maxScale"in a&&(b.maxScale=e.numberToJSON(a.maxScale)),"minScale"in a&&(b.minScale=e.numberToJSON(a.minScale)));"blendMode"in a&&(b.blendMode=a.blendMode,"normal"===b.blendMode&&delete b.blendMode);b.opacity=
e.numberToJSON(a.opacity);b.title=a.title||"Layer";b.visibility=a.visible;if("legendEnabled"in a&&"wmts"!==a.type)if(k(a)){if(b=b.featureCollection)b.showLegend=a.legendEnabled}else b.showLegend=a.legendEnabled}return d}});