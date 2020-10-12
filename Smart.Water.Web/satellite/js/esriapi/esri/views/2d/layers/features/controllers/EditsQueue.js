// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../../core/Accessor ../../../../../core/promiseUtils ../../../../../core/accessorSupport/decorators @dojo/framework/shim/Promise".split(" "),function(e,m,c,D,f,k){Object.defineProperty(m,"__esModule",{value:!0});e=function(e){function a(b){b=e.call(this,b)||this;b._queue=[];b._onGoingRequest=null;b._abortController=f.createAbortController();return b}c.__extends(a,e);a.prototype.destroy=function(){this.clear()};Object.defineProperty(a.prototype,"updating",{get:function(){return!this.destroyed&&
(0<this._queue.length||null!=this._onGoingRequest)},enumerable:!0,configurable:!0});a.prototype.clear=function(){if(this.destroyed)throw Error("instance is already destroyed");for(var b=this._queue.pop();b;)b.resolver.reject(f.createAbortError()),b=this._queue.pop();this._queue.length=0;this._abortController.abort();this._abortController=f.createAbortController()};a.prototype.push=function(b){return c.__awaiter(this,void 0,void 0,function(){var a,g=this;return c.__generator(this,function(c){if(this.destroyed)throw Error("instance is already destroyed");
a=f.createResolver();this._queue.push({event:b,resolver:a});this.notifyChange("updating");Promise.resolve().then(function(){g._processNext()});return[2,a.promise]})})};a.prototype._processNext=function(){return c.__awaiter(this,void 0,void 0,function(){var b,a,g,h,e,f,k,m,A,B,n,r,t,d,l,p,u,v,q,w,x,y,z,C=this;return c.__generator(this,function(c){switch(c.label){case 0:if(this._onGoingRequest)return[2];b=[];a=new Set;g=new Set;h=new Set;for(e=this._queue.shift();e;){f=e.event;k=f.addedFeatures;m=f.deletedFeatures;
A=f.updatedFeatures;B=e.resolver;b.push(B);n=0;for(r=k;n<r.length;n++)t=r[n],d=t.objectId,l=t.error,l||(a.add(d),g.add(d),h.delete(d));p=0;for(u=A;p<u.length;p++)v=u[p],d=v.objectId,l=v.error,l||(g.add(d),h.delete(d));q=0;for(w=m;q<w.length;q++)x=w[q],d=x.objectId,l=x.error,l||(a.has(d)?a.delete(d):h.add(d),g.delete(d));e=this._queue.shift()}if(!g.size&&!h.size)return this.notifyChange("updating"),b.forEach(function(a){return a()}),[2];y=[];z=[];g.size&&g.forEach(function(a){y.push(a)});h.size&&h.forEach(function(a){z.push(a)});
this._onGoingRequest=Promise.resolve().then(function(){return C.processEdits(y,z,{signal:C._abortController.signal})}).catch(function(){});this.notifyChange("updating");return[4,this._onGoingRequest];case 1:return c.sent(),this._onGoingRequest=null,this.notifyChange("updating"),b.forEach(function(a){return a()}),0<this._queue.length&&this._processNext(),[2]}})})};c.__decorate([k.property({constructOnly:!0})],a.prototype,"processEdits",void 0);c.__decorate([k.property({readOnly:!0})],a.prototype,"updating",
null);return a=c.__decorate([k.subclass("esri.views.2d.layers.features.controllers.EditsQueue")],a)}(D);m.EditsQueue=e});