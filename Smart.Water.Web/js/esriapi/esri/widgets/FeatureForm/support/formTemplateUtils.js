// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../FieldConfig","../FieldGroupConfig"],function(m,g,k,l){function h(f,c,d,e){void 0===e&&(e=!0);return f.map(function(a){if("field"===a.type){var b=a.input;a=new k({description:a.description,domain:a.domain,editable:a.editable,hint:a.hint,label:a.label,name:a.fieldName,requiredExpression:c[a.requiredExpression]||null,visibilityExpression:c[a.visibilityExpression]||null});b&&("text-area"===b.type||"text-box"===b.type?(a.editorType=b.type,a.minLength=b.minLength,a.maxLength=
b.maxLength):d.push({type:"unsupported-input-type",details:b}));return a}if("group"===a.type){if(!e)return d.push({type:"nested-group",details:a}),null;b=c[a.visibilityExpression]||null;return new l({description:a.description,state:a.initialState,fieldConfig:h(a.elements,c,d,!1),label:a.label,visibilityExpression:b})}d.push({type:"unsupported-element-type",details:a});return null}).filter(function(a){return!!a})}Object.defineProperty(g,"__esModule",{value:!0});g.fieldConfigsFromFormTemplate=function(f){var c,
d={},e=[];null===(c=f.expressionInfos)||void 0===c?void 0:c.map(function(a){return d[a.name]=a.expression});return{config:h(f.elements,d,e),encounteredUnsupportedTypes:e}}});