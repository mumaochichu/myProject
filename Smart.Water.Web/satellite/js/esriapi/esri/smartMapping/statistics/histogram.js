// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../core/Error ../../core/maybe ../../layers/support/fieldUtils ./support/utils ../support/utils".split(" "),function(B,C,e,c,y,q,r,h){function z(b){return e.__awaiter(this,void 0,void 0,function(){var l,f,g,d,a,t,u,m,k,n,v,w,x;return e.__generator(this,function(p){switch(p.label){case 0:if(!(b&&b.layer&&(b.field||b.valueExpression||b.sqlExpression)))throw new c("histogram:missing-parameters","'layer' and 'field', 'valueExpression' or 'sqlExpression' parameters are required");
if(b.valueExpression&&!b.sqlExpression&&!b.view)throw new c("histogram:missing-parameters","View is required when 'valueExpression' is specified");l=[0,2,1,3,4];f=b.layer;g=e.__rest(b,["layer"]);d=h.createLayerAdapter(f,l);a=e.__assign({layerAdapter:d},g);a.normalizationType=h.getNormalizationType(a);if(!d)throw new c("histogram:invalid-parameters","'layer' must be one of these types: "+h.getLayerTypeLabels(l).join(", "));t=y.isSome(a.signal)?{signal:a.signal}:null;return[4,d.load(t)];case 1:return p.sent(),
u=a.valueExpression||a.sqlExpression,k=(m=a.field)?d.getField(m):null,n=!a.classificationMethod||"equal-interval"===a.classificationMethod,[4,h.getFieldsList({field:m,normalizationField:a.normalizationField,valueExpression:a.valueExpression})];case 2:v=p.sent();if(w=r.verifyBasicFieldValidity(d,v,"histogram:invalid-parameters"))throw w;if(k){if(x=r.verifyFieldType(d,k,"histogram:invalid-parameters",A))throw x;if(q.isDateField(k)){if(a.normalizationType)throw new c("histogram:invalid-parameters","Normalization is not allowed for date fields");
if(!n)throw new c("histogram:invalid-parameters","'classificationMethod' other than 'equal-interval' is not allowed for date fields");}}else if(u){if(a.normalizationType)throw new c("histogram:invalid-parameters","Normalization is not allowed when 'valueExpression' or 'sqlExpression' is specified");if(!n)throw new c("histogram:invalid-parameters","'classificationMethod' other than 'equal-interval' is not allowed when 'valueExpression' or 'sqlExpression' is specified");}return[2,a]}})})}var A=e.__spreadArrays(["date"],
q.numericTypes);return function(b){return e.__awaiter(this,void 0,void 0,function(){var c,f,g;return e.__generator(this,function(d){switch(d.label){case 0:return[4,z(b)];case 1:return c=d.sent(),f=c.layerAdapter,g=e.__rest(c,["layerAdapter"]),[2,f.histogram(g)]}})})}});