// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../PopupTemplate ../../core/Error ../../core/promiseUtils ../../intl/messages ../../popup/ExpressionInfo ../../popup/FieldInfo ./support/utils ../statistics/support/predominanceUtils".split(" "),function(D,q,b,p,w,x,y,r,t,n,u){function z(k){return b.__awaiter(this,void 0,void 0,function(){var f,c,a;return b.__generator(this,function(d){switch(d.label){case 0:return f=k.layer,c=k.renderer,[4,f.load()];case 1:d.sent();a=c||f.renderer;if("dot-density"!==a.type)throw new w("dot-density-popup:invalid-parameters",
"renderer.type must be 'dot-density'");return[2,{layer:f,renderer:a}]}})})}function A(k,f){return b.__awaiter(this,void 0,void 0,function(){var c,a,d,g,e;return b.__generator(this,function(h){switch(h.label){case 0:return[4,n.getFieldAndExpressionInfos({renderer:k,layer:f})];case 1:return c=h.sent(),a=c.fieldInfos,d=c.expressionInfos,g=p.bind,e={},[4,n.getContentFromFieldInfos(f,{fieldInfos:a,expressionInfos:d})];case 2:return[2,new (g.apply(p,[void 0,(e.content=h.sent(),e.expressionInfos=d,e.fieldInfos=
a,e)]))]}})})}function B(k,f,c){return b.__awaiter(this,void 0,void 0,function(){var a,d,g,e,h,l,m;return b.__generator(this,function(b){switch(b.label){case 0:return[4,n.getFieldAndExpressionInfos({renderer:k,layer:f})];case 1:return g=b.sent(),e=g.fieldInfos,h=g.expressionInfos,l=e.filter(function(a){return-1===a.fieldName.indexOf(n.expressionFieldPrefix)}),a=new t({fieldName:"expression/dot-density-categories-list"}),d=new r({name:"dot-density-categories-list",title:c.listOfCategories,expression:u.getArcadeForOrderedFields(l,
h)}),m=new p({expressionInfos:[d],fieldInfos:[a],title:c.competingFields,content:"{"+a.fieldName+"}"}),[2,{name:"dot-density-categories-list",title:c.orderedListOfValues,value:m}]}})})}function C(k,f,c){return b.__awaiter(this,void 0,void 0,function(){var a,d,g,e,h,l,m;return b.__generator(this,function(v){switch(v.label){case 0:return[4,n.getFieldAndExpressionInfos({renderer:k,layer:f})];case 1:return g=v.sent(),e=g.fieldInfos,h=g.expressionInfos,l=e.filter(function(a){return-1===a.fieldName.indexOf(n.expressionFieldPrefix)}),
a=new t({fieldName:"expression/dot-density-category"}),d=new r({name:"dot-density-category",title:c.predominantCategory,expression:u.getArcadeForPredominantCategoryAlias(l,h)}),m=new p({expressionInfos:b.__spreadArrays([d],h),fieldInfos:b.__spreadArrays([a],e),content:[{type:"text",text:'\x3cdiv\x3e\x3cb\x3e\x3cfont size\x3d"3"\x3e{'+a.fieldName+"}\x3c/font\x3e\x3c/b\x3e\x3c/div\x3e"},{type:"media",mediaInfos:{type:"pie-chart",title:c.competingFields,value:{fields:e.map(function(a){return a.fieldName})}}}]}),
[2,{name:"dot-density-category-chart",title:c.predominantCategoryWithChart,value:m}]}})})}Object.defineProperty(q,"__esModule",{value:!0});q.getTemplates=function(k){return b.__awaiter(this,void 0,void 0,function(){var f,c,a,d,g,e,h,l,m;return b.__generator(this,function(b){switch(b.label){case 0:return[4,x.all([z(k),y.loadMessageBundle("esri/smartMapping/t9n/smartMapping")])];case 1:return f=b.sent(),c=f[0],a=c.renderer,d=c.layer,g=f[1],h={name:"dot-density",title:g.dotDensity},[4,A(a,d)];case 2:return e=
(h.value=b.sent(),h),[4,B(a,d,g)];case 3:return m=[b.sent()],[4,C(a,d,g)];case 4:return l=m.concat([b.sent()]),[2,{primaryTemplate:e,secondaryTemplates:l}]}})})}});