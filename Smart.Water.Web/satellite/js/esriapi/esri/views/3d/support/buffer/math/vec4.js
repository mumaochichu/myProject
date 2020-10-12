// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","./common"],function(H,d,E){Object.defineProperty(d,"__esModule",{value:!0});d.transformMat4=function(b,c,a){if(b.count!==c.count)E.logger.error("source and destination buffers need to have the same number of elements");else{var F=b.count,e=a[0],f=a[1],g=a[2],h=a[3],k=a[4],d=a[5],C=a[6],D=a[7],p=a[8],q=a[9],r=a[10],t=a[11],m=a[12],u=a[13],v=a[14];a=a[15];var n=b.typedBuffer;b=b.typedBufferStride;var w=c.typedBuffer;c=c.typedBufferStride;for(var x=0;x<F;x++){var y=x*b,l=
x*c,z=w[l],A=w[l+1],B=w[l+2],l=w[l+3];n[y]=e*z+k*A+p*B+m*l;n[y+1]=f*z+d*A+q*B+u*l;n[y+2]=g*z+C*A+r*B+v*l;n[y+3]=h*z+D*A+t*B+a*l}}};d.transformMat3=function(b,c,a){if(b.count!==c.count)E.logger.error("source and destination buffers need to have the same number of elements");else{var d=b.count,e=a[0],f=a[1],g=a[2],h=a[3],k=a[4],G=a[5],C=a[6],D=a[7];a=a[8];var p=b.typedBuffer;b=b.typedBufferStride;var q=c.typedBuffer;c=c.typedBufferStride;for(var r=0;r<d;r++){var t=r*b,m=r*c,u=q[m],v=q[m+1],n=q[m+2],
m=q[m+3];p[t]=e*u+h*v+C*n;p[t+1]=f*u+k*v+D*n;p[t+2]=g*u+G*v+a*n;p[t+3]=m}}};d.scale=function(b,c,a){var d=Math.min(b.count,c.count),e=b.typedBuffer;b=b.typedBufferStride;var f=c.typedBuffer;c=c.typedBufferStride;for(var g=0;g<d;g++){var h=g*b,k=g*c;e[h]=a*f[k];e[h+1]=a*f[k+1];e[h+2]=a*f[k+2];e[h+3]=a*f[k+3]}};d.shiftRight=function(b,c,a){var d=Math.min(b.count,c.count),e=b.typedBuffer;b=b.typedBufferStride;var f=c.typedBuffer;c=c.typedBufferStride;for(var g=0;g<d;g++){var h=g*b,k=g*c;e[h]=f[k]>>a;
e[h+1]=f[k+1]>>a;e[h+2]=f[k+2]>>a;e[h+3]=f[k+3]>>a}}});