// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../../core/promiseUtils"],function(p,d,h){Object.defineProperty(d,"__esModule",{value:!0});d.executeForEachAsync=function(e,d,a){var b,m=null!==(b=null===a||void 0===a?void 0:a.batchSize)&&void 0!==b?b:100,f=h.createResolver(),c=0,l=function(){for(var b=Date.now(),g=!1,k=0;!g&&500>k;){try{for(a&&h.throwIfAborted(a);c<Math.min(c+m,e.length);c++)d(e[c])}catch(n){f.reject(n)}k=Date.now()-b;g=c>=e.length}g?f.resolve():setTimeout(l,0)};l();return f.promise}});