// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../core/Error ../../core/promiseUtils ../schema ./utils @dojo/framework/shim/Promise".split(" "),function(D,r,f,y,v,q,u){function E(b,a){if(a.properties){if("layerType"in a.properties)return a.properties.layerType.enum[0];if("type"in a.properties)return a.properties.type.enum[0]}switch(b){case "multipoint_geometry_schema.json":return"multipoint";case "point_geometry_schema.json":return"point";case "polyline_geometry_schema.json":return"polyline";case "polygon_geometry_schema.json":return"polygon";
case "extent_schema.json":return"extent"}}function z(b){return"array"===b.type?z(b.items)+"[]":b.type}function F(b){var a={count:b.length,refsCount:0,typesCount:0,distinctTypes:[],type:null},c=new Set,d;for(d in b){var e=b[d];e.$ref?a.refsCount++:e.type&&(a.typesCount++,c.add(z(e)))}c.forEach(function(b){return a.distinctTypes.push(b)});a.distinctTypes.sort();a.refsCount===a.count?a.type="refs":2===a.count&&0<a.refsCount&&1===a.distinctTypes.length&&"null"===a.distinctTypes[0]?a.type="refsAndNull":
a.typesCount===a.count?(a.type="types",a.distinctTypes=a.distinctTypes):a.type="mix";return a}function w(b,a,c,d,e){return f.__awaiter(this,void 0,void 0,function(){var h,g,k,l,m;return f.__generator(this,function(f){switch(f.label){case 0:e.schemaStack.push(b);h=E(b,c);d=d?d.replace("\x3c?TYPE?\x3e",h?"\x3c"+h+"\x3e":""):null;if("array"!==c.type&&"properties"in c)return[3,2];(g=e.currentClass?null:{type:b,name:b,id:b+"--"+a,typeValue:a,properties:[]})&&e.push(null,g);return[4,t(c,d,e)];case 1:return f.sent(),
e.schemaStack.pop(),[2,g];case 2:e.hasFilteredProperties?(f=e.filteredPropertiesArray.join("/"),k=b+"--"+a+"--"+f):k=b+"--"+a;if((l="drawingInfo_schema.json"!==b&&e.seen.get(k))&&d)return e.addProperty({name:d,type:l}),e.schemaStack.pop(),[2,l];m={type:b,name:b,id:k,typeValue:a,properties:[]};d&&e.addProperty({name:d,type:m});e.push(d,m);return[4,t(c,"",e)];case 3:return f.sent(),e.schemaStack.pop(),[2,e.pop()]}})})}function A(b,a,c){return f.__awaiter(this,void 0,void 0,function(){var d,e,h,g,k,
l,m;return f.__generator(this,function(p){switch(p.label){case 0:return[4,c.requestSchema(b.$ref)];case 1:d=p.sent();var n=d.schema;e="layerDefinition"===n.title?null:(n=n.properties&&n.properties.type)&&n.enum?n.enum:null;if(!e)return[3,6];h=0;g=e;p.label=2;case 2:if(!(h<g.length))return[3,5];k=g[h];l=f.__assign({},d.schema);l.properties=f.__assign(f.__assign({},l.properties),{type:{type:"string",enum:[k]}});m=-1===a.indexOf("\x3c?TYPE?\x3e")?a+"\x3c?TYPE?\x3e":a;return[4,w(d.schemaId,k,l,m,c)];
case 3:p.sent(),p.label=4;case 4:return h++,[3,2];case 5:return[2,void 0];case 6:return[4,w(d.schemaId,null,d.schema,a,c)];case 7:return p.sent(),[2]}})})}function G(b,a){if(!x(b))return!1;b=b.stack.map(function(a){return a.klass.type}).join("/");return/.*pointCloudLayer_schema\.json\/layerDefinition_schema\.json\/drawingInfo_schema\.json$/.test(b)&&"renderer"===a}function H(b,a){if(!x(b))return!1;b=b.stack.map(function(a){return a.klass.type}).join("/");return/.*imageServiceLayer_schema\.json\/layerDefinition_schema\.json\/drawingInfo_schema\.json$/.test(b)&&
"renderer"===a}function x(b){return b.currentClass&&"drawingInfo_schema.json"===b.currentClass.name}function I(b,a,c){if(x(c)){var d=G(c,a),e=H(c,a);return b.filter(function(a){if(/uniqueValueFromStyleRenderer_schema\.json$/.test(a.$ref))return!1;var b=/pointCloud.*Renderer/.test(a.$ref);a=/raster.*Renderer/.test(a.$ref);return d===b&&a===e})}a:{switch(c.schemaStack[c.schemaStack.length-1]){case "operationalLayers_schema.json":case "elevationLayers_schema.json":case "baseMapLayer_schema.json":a=!0;
break a}a=!1}if(a){var h=["kmlLayer","rasterDataElevationLayer","rasterDataLayer"];return b.filter(function(a){return!h.some(function(b){return a.$ref===b+"_schema.json"})})}return b}function J(b,a,c){return f.__awaiter(this,void 0,void 0,function(){return f.__generator(this,function(d){switch(d.label){case 0:return[4,t(b.items,a+"[]",c)];case 1:return d.sent(),[2]}})})}function K(b,a,c){return f.__awaiter(this,void 0,void 0,function(){var d,e,h,g,k,l=this;return f.__generator(this,function(m){switch(m.label){case 0:d=
function(d){return f.__generator(this,function(e){switch(e.label){case 0:return[4,c.withFilter(d,function(){return f.__awaiter(l,void 0,void 0,function(){var e;return f.__generator(this,function(h){switch(h.label){case 0:return e=a?a+"."+d:d,[4,t(b.properties[d],e,c)];case 1:return h.sent(),[2]}})})})];case 1:return e.sent(),[2]}})};e=[];for(h in b.properties)e.push(h);g=0;m.label=1;case 1:if(!(g<e.length))return[3,4];k=e[g];return[5,d(k)];case 2:m.sent(),m.label=3;case 3:return g++,[3,1];case 4:return[2]}})})}
function B(b,a,c){void 0===a&&(a="");void 0===c&&(c=new Set);for(var d=0;d<b.length;d++){var e=b[d];if("properties"in e)for(var h in e.properties){var g=e.properties[h],f=a?a+"."+h:h,l=Object.keys(g);if(0===l.length||1===l.length&&"$ref"===l[0])c.add(f);else if(1===l.length&&"allOf"===l[0])c.add(f),B(g.allOf,f,c);else throw Error("unexpected allOf filter construct: "+JSON.stringify(g));}}return c}function L(b,a,c){return f.__awaiter(this,void 0,void 0,function(){var d,e,h,g,k;return f.__generator(this,
function(f){switch(f.label){case 0:d=null;e=0;for(h=b.allOf;e<h.length;e++)if(g=h[e],"$ref"in g){if(d)throw Error("Cannot process more than 1 ref in an allOf construct");d=g}else if(!("properties"in g))throw Error("allOf construct only allows simple top-level property filters");k=B(b.allOf);return[4,c.addFilter(k,function(){return A(d,a,c)})];case 1:return f.sent(),[2]}})})}function M(b,a,c){return f.__awaiter(this,void 0,void 0,function(){var d,e,h,g,k,l,m,p,n,q,r;return f.__generator(this,function(f){switch(f.label){case 0:d=
F(b.oneOf);if("refs"!==d.type&&"refsAndNull"!==d.type)return[3,6];e=I(b.oneOf,a,c);h=0;g=e;f.label=1;case 1:if(!(h<g.length))return[3,5];k=g[h];return"null"!==k.type?[3,2]:[3,4];case 2:return l=""+(a||"")+(1!==e.length?"\x3c?TYPE?\x3e":""),[4,t(k,l,c)];case 3:f.sent(),f.label=4;case 4:return h++,[3,1];case 5:return[2];case 6:if("types"===d.type)return c.addProperty({name:a,type:u.sorted(d.distinctTypes).join("|")}),[2];m=[];for(p in b.oneOf)m.push(p);n=0;f.label=7;case 7:if(!(n<m.length))return[3,
10];q=m[n];r=".oneOf["+q+"]";return[4,t(b.oneOf[q],""+a+r,c)];case 8:f.sent(),f.label=9;case 9:return n++,[3,7];case 10:return[2]}})})}function N(b,a,c){return f.__awaiter(this,void 0,void 0,function(){return f.__generator(this,function(d){switch(d.label){case 0:return[4,A(b,a,c)];case 1:return d.sent(),[2]}})})}function O(b,a,c){return f.__awaiter(this,void 0,void 0,function(){var d,e;return f.__generator(this,function(f){d="unknown";b.type&&(d=Array.isArray(b.type)?u.sorted(b.type).join("|"):b.type.replace(/ /g,
"").split(",").join("|"));e={name:a,type:d,default:b.default};b.enum&&(e.enum=u.sorted(b.enum).map(function(a){return"string"===typeof a?'"'+a+'"':""+a}).join("|"));c.addProperty(e);return[2]})})}function t(b,a,c){return f.__awaiter(this,void 0,void 0,function(){return f.__generator(this,function(d){return"array"===b.type?[2,J(b,a,c)]:"properties"in b?[2,K(b,a,c)]:"allOf"in b?[2,L(b,a,c)]:"oneOf"in b?[2,M(b,a,c)]:"$ref"in b?[2,N(b,a,c)]:[2,O(b,a,c)]})})}function C(b){return 0===b.indexOf("#/definitions/")?
b.slice(14):b}Object.defineProperty(r,"__esModule",{value:!0});r.scan=function(b,a){return f.__awaiter(this,void 0,void 0,function(){var c;return f.__generator(this,function(d){switch(d.label){case 0:return[4,P.create(b,a)];case 1:return c=d.sent(),[2,w((b||"webScene")+"_schema.json",null,c.schemaRoot,null,c)]}})})};var P=function(b){function a(a,d,e){var c=b.call(this)||this;c.definitions=a;c.schemaRoot=d;c.requestSchema=e;c.filteredProperties=null;c.schemaStack=[];c.requestSchema.bind(c);return c}
f.__extends(a,b);Object.defineProperty(a.prototype,"hasFilteredProperties",{get:function(){return this.filteredProperties&&0<this.filteredProperties.size},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"filteredPropertiesArray",{get:function(){var a=[];this.filteredProperties.forEach(function(b){return a.push(b)});return a},enumerable:!0,configurable:!0});a.prototype.withFilter=function(a,b){return f.__awaiter(this,void 0,void 0,function(){var c,d,g=this;return f.__generator(this,
function(e){switch(e.label){case 0:if(!this.hasFilteredProperties)return[2,b()];if(!this.filteredProperties.has(a))return[2];c=this.filteredProperties;this.filteredProperties=null;d=function(a){g.filteredProperties||(g.filteredProperties=new Set);g.filteredProperties.add(a)};c.forEach(function(b){b=b.split(".",2);1<b.length&&b[0]===a&&d(b[1])});return[4,b()];case 1:return e.sent(),this.filteredProperties=c,[2]}})})};a.prototype.addFilter=function(a,b){return f.__awaiter(this,void 0,void 0,function(){var c,
d,g,k=this;return f.__generator(this,function(e){switch(e.label){case 0:return c=this.filteredProperties,this.filteredProperties=null,d=function(a){k.filteredProperties||(k.filteredProperties=new Set);k.filteredProperties.add(a)},c&&c.forEach(d),a&&a.forEach(d),[4,b()];case 1:return g=e.sent(),this.filteredProperties=c,[2,g]}})})};a.create=function(b,d){return f.__awaiter(this,void 0,void 0,function(){return f.__generator(this,function(c){return d&&d.useRemoteSchema?[2,a.createRemote(b,d.baseUrl)]:
[2,a.createLocal(b)]})})};a.createLocal=function(b){return new a(q.json.definitions,b?q.json.definitions[b+"_schema.json"]:q.json,a.getLocalSchemaRequest())};a.createRemote=function(b,d){return f.__awaiter(this,void 0,void 0,function(){var c,h,g;return f.__generator(this,function(e){switch(e.label){case 0:return[4,a.getRemoteSchemaRequest(d)];case 1:return c=e.sent(),h=new a({},null,c),[4,h.requestSchema((b||"webscene")+"_schema.json")];case 2:return g=e.sent().schema,[2,new a(h.definitions,g,c)]}})})};
a.getLocalSchemaRequest=function(){return function(a){a=C(a);var b=this.definitions[a];return b?v.resolve({schemaId:a,schema:b}):v.reject(new y("flatspec-spec:invalid-local-schema","Schema reference is not a local reference"))}};a.getRemoteSchemaRequest=function(b){return f.__awaiter(this,void 0,void 0,function(){var c,e;return f.__generator(this,function(d){switch(d.label){case 0:if(!b)return[2,v.reject(new y("flatspec-spec:missing-base-url","The base url of the remote schema directory must be specified when using a remote schema"))];
c=a.getLocalSchemaRequest();return[4,new Promise(function(a,b){D(["../../request"],a,b)})];case 1:return e=d.sent(),[2,function(a){var d=this;return c.call(this,a).catch(function(){return e(b+"/"+a,{responseType:"json"}).then(function(b){d.definitions[C(a)]=b.data;return{schemaId:a,schema:b.data}})})}]}})})};return a}(u.ScanContext);r.schemaDefinitions=Object.keys(q.json.definitions).map(function(b){return b.replace(/_schema\.json$/,"")})});