// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../Color ../../core/accessorSupport/decorators ./SmartMappingSliderBase ./OpacitySlider/OpacitySliderViewModel ./../support/widget".split(" "),function(p,q,c,l,e,m,n,f){var h={trackFillColor:new l([0,121,193])};return function(k){function b(a,b){a=k.call(this,a,b)||this;a._bgFillId=null;a._rampFillId=null;a.label=void 0;a.messages=null;a.stops=null;a.style=c.__assign({},h);a.viewModel=new n;a.zoomOptions=null;a._rampFillId=a.id+"-ramp-fill";a._bgFillId=a.id+"-bg-fill";
return a}c.__extends(b,k);g=b;b.prototype.castStyle=function(a){return c.__assign(c.__assign({},h),a)};b.fromVisualVariableResult=function(a,b){var d=a.statistics;return new g({max:d.max,min:d.min,stops:a.visualVariable.stops,histogramConfig:{average:d.avg,standardDeviation:d.stddev,bins:b?b.bins:[]}})};b.prototype.updateFromVisualVariableResult=function(a,b){var d=a.statistics;this.set({max:d.max,min:d.min,stops:a.visualVariable.stops,histogramConfig:{average:d.avg,standardDeviation:d.stddev,bins:b?
b.bins:[]}})};b.prototype.render=function(){var a,b=this.label,d="disabled"===this.state,c=this.classes("esri-opacity-slider","esri-widget","esri-widget--panel",(a={},a["esri-disabled"]=d,a));return f.tsx("div",{"aria-label":b,class:c},d?null:this.renderContent(this.renderRamp(),"esri-opacity-slider__slider-container","esri-opacity-slider__histogram-container"))};b.prototype.renderRamp=function(){var a=this._bgFillId,b=this._rampFillId,c=this.zoomOptions,e=this.viewModel.getStopInfo(this.style.trackFillColor);
return f.tsx("div",{class:"esri-opacity-slider__ramp"},f.tsx("svg",{xmlns:"http://www.w3.org/2000/svg"},f.tsx("defs",null,this.renderRampFillDefinition(b,e),this.renderBackgroundFillDefinition(a)),f.tsx("rect",{x:"0",y:"0",fill:"url(#"+a+")",height:"100%",width:"100%"}),f.tsx("rect",{x:"0",y:"0",fill:"url(#"+b+")",height:"100%",width:"100%"})),c?this.renderZoomCaps():null)};var g;c.__decorate([e.property({aliasOf:{source:"messages.widgetLabel",overridable:!0}})],b.prototype,"label",void 0);c.__decorate([e.property(),
f.renderable(),f.messageBundle("esri/widgets/smartMapping/OpacitySlider/t9n/OpacitySlider")],b.prototype,"messages",void 0);c.__decorate([e.aliasOf("viewModel.stops")],b.prototype,"stops",void 0);c.__decorate([e.property(),f.renderable()],b.prototype,"style",void 0);c.__decorate([e.cast("style")],b.prototype,"castStyle",null);c.__decorate([e.property(),f.renderable("viewModel.hasTimeData viewModel.inputFormatFunction viewModel.inputParseFunction viewModel.labelFormatFunction viewModel.max viewModel.min viewModel.stops viewModel.values viewModel.zoomOptions".split(" "))],
b.prototype,"viewModel",void 0);c.__decorate([e.aliasOf("viewModel.zoomOptions")],b.prototype,"zoomOptions",void 0);return b=g=c.__decorate([e.subclass("esri.widgets.smartMapping.OpacitySlider")],b)}(m.SmartMappingSliderBase)});