// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports"],function(v,d){function e(){var a=new Float32Array(16);a[0]=1;a[5]=1;a[10]=1;a[15]=1;return a}Object.defineProperty(d,"__esModule",{value:!0});d.create=e;d.clone=function(a){var b=new Float32Array(16);b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};d.fromValues=function(a,b,d,e,f,g,h,k,l,m,n,p,q,r,t,u){var c=new Float32Array(16);c[0]=a;c[1]=
b;c[2]=d;c[3]=e;c[4]=f;c[5]=g;c[6]=h;c[7]=k;c[8]=l;c[9]=m;c[10]=n;c[11]=p;c[12]=q;c[13]=r;c[14]=t;c[15]=u;return c};d.createView=function(a,b){return new Float32Array(a,b,16)};d.IDENTITY=e()});