// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../core/screenUtils ../engine ../engine/webgl/alignmentUtils ../engine/webgl/definitions ../engine/webgl/util/BidiText".split(" "),function(u,c,b,d,q,e,f,r){Object.defineProperty(c,"__esModule",{value:!0});c.getTextBounds=function(a,c,t){return b.__awaiter(this,void 0,void 0,function(){var g,h,k,l,m,n,p;return b.__generator(this,function(b){switch(b.label){case 0:return g=e.getXAnchorDirection("center"),h=e.getYAnchorDirection("middle"),k=c.textureManager.rasterizeItem(a.toJSON(),
null,t),l=r.bidiText(a.text),m=l[1],[4,k];case 1:return n=b.sent().glyphMosaicItems,p=q.shapeGlyphs(n,m,{angle:a.angle||0,xOffset:d.pt2px(a.xoffset||0),yOffset:d.pt2px(a.yoffset||0),lineHeight:f.MAGIC_LABEL_LINE_HEIGHT*Math.max(.25,Math.min(a.lineHeight,4)),maxLineWidth:Math.max(32,Math.min(d.pt2px(a.lineWidth),512)),decoration:a.font.decoration,scale:Math.min(Math.round(d.pt2px(a.font.size)),127)/f.GLYPH_SIZE,hAlign:g,vAlign:h,isCIM:!1}),[2,p.boundsT]}})})}});