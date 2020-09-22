// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../core/arrayUtils","../../../core/screenUtils","../../support/utils"],function(q,e,m,f,n){function g(a,b){return a.r===b.r&&a.g===b.g&&a.b===b.b}function h(a){var b=a.width,d=a.height,c=a.pixelSizeAt(a.toMap(f.createScreenPoint(.5*b,.5*d),{exclude:[]}));0>=c&&(c=a.pixelSizeAt(a.toMap(f.createScreenPoint(.5*b,.95*d),{exclude:[]})),0>=c&&(b=a.camera.position.clone(),b.z=0,c=2*a.pixelSizeAt(b)));return c}Object.defineProperty(e,"__esModule",{value:!0});var k="streets gray topo terrain national-geographic oceans osm gray-vector streets-vector topo-vector streets-relief-vector streets-navigation-vector".split(" "),
l=["satellite","hybrid","dark-gray","dark-gray-vector","streets-night-vector"],p=[].concat(k).concat(l);e.hasIdenticalColors=function(a,b){var d=0;if(a.length===b.length){var c=a.every(function(a,c){return g(a,b[c])});c?d=1:(c=a.slice(0).reverse().every(function(a,c){return g(a,b[c])}))&&(d=-1)}return d};e.getPixelSize=h;e.toWorldScale=function(a,b){return Math.ceil(h(b)*f.pt2px(f.toPt(a)))};e.getStorageType=function(a){return"multipoint"===a?"point":"mesh"===a?"polygon":a};e.getBasemapTheme=function(a){a=
n.getBasemapId(a,p,!1);if(!a)return null;if(-1<k.indexOf(a))return"light";if(-1<l.indexOf(a))return"dark"};e.getTagsFromSchemes=function(a){if(!a)return[];var b=new Set,d=[a.primaryScheme];a.secondarySchemes&&d.push.apply(d,a.secondarySchemes);for(a=0;a<d.length;a++){var c=d[a];c&&"tags"in c&&c.tags&&c.tags.forEach(function(a){return b.add(a)})}return m.keysOfSet(b)}});