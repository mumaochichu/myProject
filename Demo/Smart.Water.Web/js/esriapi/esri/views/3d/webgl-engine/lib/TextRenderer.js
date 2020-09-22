// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","../../../../core/maybe","./TextRenderParameters"],function(p,k,r,t){function q(b,a,e){b.canvas||(b.canvas=document.createElement("canvas"));b.canvas.width=a;b.canvas.height=e;return b.canvas}Object.defineProperty(k,"__esModule",{value:!0});p=function(){function b(a,e,c){void 0===c&&(c=2048);this.text=a;this.maxSize=c;this._displayWidth=this._renderPixelRatio=null;this.parameters=e instanceof t.default?e:new t.default(e);this.key=this.parameters.key+"--"+a;this.textLines=
a.split(/\r?\n/);this.lineHeight=this.computeLineHeight()}Object.defineProperty(b.prototype,"displayWidth",{get:function(){r.isNone(this._displayWidth)&&(this._displayWidth=this.computeTextWidth());return this._displayWidth},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"displayHeight",{get:function(){return this.lineHeight*this.textLines.length},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"renderedWidth",{get:function(){return Math.round(this.displayWidth*
this.renderPixelRatio)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"renderedHeight",{get:function(){return Math.round(this.displayHeight*this.renderPixelRatio)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"renderedLineHeight",{get:function(){return Math.round(this.lineHeight*this.renderPixelRatio)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"renderedFontSize",{get:function(){return this.parameters.definition.size*this.renderPixelRatio},
enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"renderedHaloSize",{get:function(){return this.parameters.haloSize*this.renderPixelRatio},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"renderPixelRatio",{get:function(){if(r.isNone(this._renderPixelRatio)){var a=this.parameters.definition.pixelRatio;this._renderPixelRatio=0<this.maxSize?Math.min(a,Math.min(this.maxSize/(this.displayWidth*a),this.maxSize/(this.displayHeight*a))):a}return this._renderPixelRatio},
enumerable:!0,configurable:!0});b.prototype.render=function(a,e,c){void 0===e&&(e=0);void 0===c&&(c=0);var b=this.renderedLineHeight,g=this.renderedHaloSize,d=a.textAlign,f=this.renderedWidth,d=("center"===d?.5*f:"right"===d?f:0)+g,f=g+v;a.save();0<g&&this.renderHalo(a,d,f,e,c);this.setFontProperties(a,this.renderedFontSize);c+=f;e+=d;g=0;for(d=this.textLines;g<d.length;g++)f=d[g],a.globalCompositeOperation="destination-out",a.fillStyle="rgb(0, 0, 0)",a.fillText(f,e,c),a.globalCompositeOperation=
"source-over",a.fillStyle=this.parameters.fillStyle,a.fillText(f,e,c),c+=b;a.restore()};b.prototype.renderHalo=function(a,e,c,b,g){var d=this.renderedWidth,f=this.renderedHeight,u=q(w,Math.max(d,l),Math.max(f,l)),h=u.getContext("2d");h.clearRect(0,0,d,f);this.setFontProperties(h,this.renderedFontSize);h.fillStyle=this.parameters.haloStyle;h.strokeStyle=this.parameters.haloStyle;var m=3>this.renderedHaloSize;h.lineJoin=m?"miter":"round";m?this.renderHaloEmulated(h,e,c):this.renderHaloNative(h,e,c);
a.globalAlpha=this.parameters.definition.halo.color[3];a.drawImage(u,0,0,d,f,b,g,d,f);a.globalAlpha=1};b.prototype.renderHaloEmulated=function(a,e,c){for(var b=this.renderedLineHeight,g=this.renderedHaloSize,d=0,f=this.textLines;d<f.length;d++){for(var k=f[d],h=0,m=x;h<m.length;h++){var l=m[h];a.fillText(k,e+g*l[0],c+g*l[1])}c+=b}};b.prototype.renderHaloNative=function(a,b,c){for(var e=this.renderedLineHeight,g=this.renderedHaloSize,d=0,f=this.textLines;d<f.length;d++){for(var l=f[d],h=2*g,m=0;5>
m;m++)a.lineWidth=(.6+.1*m)*h,a.strokeText(l,b,c);c+=e}};b.prototype.setFontProperties=function(a,b){var c=this.parameters.definition.font;a.font=c.style+" "+c.weight+" "+b+"px "+c.family+", sans-serif";a.textAlign="left";a.textBaseline="top"};b.prototype.computeTextWidth=function(){var a=q(w,l,l).getContext("2d");this.setFontProperties(a,this.parameters.definition.size);for(var b=0,c=0,k=this.textLines;c<k.length;c++)b=Math.max(b,a.measureText(k[c]).width);c=this.parameters.definition.font;if("italic"===
c.style||"oblique"===c.style||"string"===typeof c.weight&&("bold"===c.weight||"bolder"===c.weight)||"number"===typeof c.weight&&600<c.weight)b+=.3*a.measureText("A").width;b+=2*this.parameters.haloSize;return Math.round(b)};b.prototype.computeLineHeight=function(){return Math.ceil(1.275*this.parameters.definition.size+2*this.parameters.haloSize)+v};return b}();k.TextRenderer=p;for(var v=1,x=[],n=0;360>n;n+=22.5)x.push([Math.cos(Math.PI*n/180),Math.sin(Math.PI*n/180)]);k.getTextHelperCanvas=q;var w=
{canvas:null},l=512;k.default=p});