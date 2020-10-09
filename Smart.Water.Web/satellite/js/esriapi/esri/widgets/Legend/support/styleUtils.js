// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../intl"],function(f,c,e){Object.defineProperty(c,"__esModule",{value:!0});c.attachToNode=function(b){b.appendChild(this)};c.getTitle=function(b,a,c){if(a){if("string"===typeof a)return a;if("value"in a||"unit"in a)return e.substitute(b.dotValue,a);if("colorName"in a||"bandName"in a)return b[a.colorName]+": "+(b[a.bandName]||a.bandName);if("showCount"in a)return a.showCount?b.clusterCountTitle:null;var d=null;c?d=a.ratioPercentTotal?"showRatioPercentTotal":a.ratioPercent?
"showRatioPercent":a.ratio?"showRatio":a.normField?"showNormField":a.field?"showField":null:c||(d=a.normField?"showNormField":a.normByPct?"showNormPct":a.field?"showField":null);return d?e.substitute("showField"===d?"{field}":b[d],{field:a.field,normField:a.normField}):null}};c.isRendererTitle=function(b,a){return!a};c.isImageryStretchedLegend=function(b,a){return!!(a&&"Stretched"===a&&10.3<=b.version&&"esri.layers.ImageryLayer"===b.declaredClass)}});