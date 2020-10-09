// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../CIMCursor ../CurveHelper ../GeometryWalker".split(" "),function(f,g,k,l,m,h){Object.defineProperty(g,"__esModule",{value:!0});f=function(){function c(){}c.local=function(){null===c.instance&&(c.instance=new c);return c.instance};c.prototype.execute=function(c,a,b){return new n(c,a,b)};c.instance=null;return c}();g.EffectDashes=f;var n=function(c){function e(a,b,d){a=c.call(this,a,!0,!0)||this;a._walker=new h.GeometryWalker;a._walker.updateTolerance(d);a._endings=b.lineDashEnding;
a._customDashPos=void 0!==b.offsetAlongLine?b.offsetAlongLine*d:0;a._offsetAtEnd=void 0!==b.customEndingOffset?b.customEndingOffset*d:0;a._pattern=new h.DashPattern;a._pattern.init(b.dashTemplate,!0);a._pattern.scale(d);return a}k.__extends(e,c);e.prototype.processPath=function(a){if(0===this._pattern.length())return this.iteratePath=!1,{paths:[a]};if(!this.iteratePath){var b=!0;switch(this._endings){default:this._pattern.extPtGap=0;break;case "FullPattern":this.isClosed||(this._pattern.extPtGap=
.5*this._pattern.firstValue());break;case "FullGap":this.isClosed||(this._pattern.extPtGap=.5*this._pattern.lastValue());break;case "NoConstraint":this.isClosed||(b=!1);break;case "Custom":this.isClosed||(this._pattern.extPtGap=.5*this._offsetAtEnd)}var c=this._walker.calculatePathLength(a);if(this._pattern.isEmpty()||c<.1*this._pattern.length()||!this._walker.init(a,this._pattern,b))return{paths:[a]}}if(this.iteratePath)a=this._pattern.nextValue();else{b=void 0;switch(this._endings){default:b=.5*
this._pattern.firstValue();break;case "HalfGap":b=.5*-this._pattern.lastValue();break;case "FullGap":b=-this._pattern.lastValue();break;case "FullPattern":b=0;break;case "NoConstraint":case "Custom":b=-this._customDashPos}a=b/this._pattern.length();a-=Math.floor(a);b=a*this._pattern.length();this._pattern.reset();a=this._pattern.nextValue();for(c=!1;b>=a;)b-=a,a=this._pattern.nextValue(),c=!c;a-=b;c?(this._walker.nextPosition(a),a=this._pattern.nextValue()):this.isClosed&&(this._firstCurve=this._walker.nextCurve(a),
a=this._pattern.nextValue(),this._walker.nextPosition(a),a=this._pattern.nextValue())}(b=this._walker.nextCurve(a))?this._walker.isPathEnd()?(this.iteratePath=!1,this._firstCurve&&(this._firstCurve.splice(0,1),m.PathHelper.mergePath(b,this._firstCurve),this._firstCurve=null)):(a=this._pattern.nextValue(),!this._walker.nextPosition(a)||this._walker.isPathEnd()?(this.iteratePath=!1,this._firstCurve&&(b=this._firstCurve,this._firstCurve=null)):this.iteratePath=!0):(this.iteratePath=!1,b=this._firstCurve,
this._firstCurve=null);return{paths:[b]}};return e}(l.PathGeometryCursor)});