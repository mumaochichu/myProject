// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports ../../Logger ../ensureType ../get ../metadata ../set".split(" "),function(t,g,m,e,l,k,n){function p(a){var b=0,c=a;if(e.isLongFormType(a))return e.ensureLongFormType(a);for(;Array.isArray(c)&&1===c.length&&"string"!==typeof c[0]&&"number"!==typeof c[0];)c=c[0],b++;return e.isOneOf(c)?0===b?e.ensureOneOf(c):e.ensureNArrayTyped(e.ensureOneOf(c),b):1===b?e.ensureArray(c):1<b?e.ensureNArray(c,b):a.from?a.from:e.default(a)}function q(a,b){return function(c){c=+a(c);null!=b.step&&
(c=Math.round(c/b.step)*b.step);null!=b.min&&(c=Math.max(b.min,c));null!=b.max&&(c=Math.min(b.max,c));return c}}Object.defineProperty(g,"__esModule",{value:!0});var r=m.getLogger("esri.core.accessorSupport.decorators.property");g.property=function(a){void 0===a&&(a={});return function(b,c,f){if(b===Function.prototype)throw Error("Inappropriate use of @property() on a static field: "+b.name+"."+c+". Accessor does not support static properties.");var d=k.getOwnPropertyMetadata(b,c);f&&(f.get||f.set?
(d.get=f.get||d.get,d.set=f.set||d.set):"value"in f&&("value"in a&&r.warn('@property() will redefine the value of "'+c+'" on "'+b.constructor.name+'" already defined in the metadata',a),d.value=a.value=f.value));"readOnly"in a&&(d.readOnly=a.readOnly);if(b=a.aliasOf){var h="string"===typeof b?b:b.source;b="string"===typeof b?null:!0===b.overridable;var g;d.dependsOn=[h];d.get=function(){var a=l.default(this,h);if("function"===typeof a){g||(g=h.split(".").slice(0,-1).join("."));var b=l.default(this,
g);b&&(a=a.bind(b))}return a};d.readOnly||(d.set=b?function(a){void 0!==a?this._override(c,a):this._clearOverride(c)}:function(a){n.default(this,h,a)})}b=a.type;f=a.types;d.cast||(b?d.cast=p(b):f&&(Array.isArray(f)?d.cast=e.ensureArrayTyped(e.ensureOneOfType(f[0])):d.cast=e.ensureOneOfType(f)));a.range&&(d.cast=q(d.cast,a.range));k.mergeProperty(d,a)}};g.propertyJSONMeta=function(a,b,c){a=k.getOwnPropertyMetadata(a,c);a.json||(a.json={});a=a.json;void 0!==b&&(a.origins||(a.origins={}),a.origins[b]||
(a.origins[b]={}),a=a.origins[b]);return a}});