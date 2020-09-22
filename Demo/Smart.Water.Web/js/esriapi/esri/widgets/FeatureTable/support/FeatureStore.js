// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../Graphic ../../../core/Accessor ../../../core/arrayUtils ../../../core/arrayUtils ../../../core/Collection ../../../core/Error ../../../core/lang ../../../core/Logger ../../../core/promiseUtils ../../../core/accessorSupport/decorators ../../../tasks/support/AttachmentQuery ../../../tasks/support/Query".split(" "),function(E,F,c,x,y,q,z,r,t,A,B,g,e,C,v){function m(c,a,b){D.error(new t(c,a,b))}var D=B.getLogger("esri.widgets.FeatureTable.support.FeatureStore");
return function(w){function a(b){b=w.call(this,b)||this;b._loaded=!1;b._loadError=!1;b._loading=!1;b._editOperationQueue=[];b._queryOperationQueue=[];b.attachmentsEnabled=!1;b.count=0;b.failures=new r;b.itemCache=new r;b.relatedRecordsEnabled=!1;return b}c.__extends(a,w);a.prototype.destroy=function(){this.layer=null;this.itemCache&&this.itemCache.destroy();this.failures&&this.failures.destroy();this._set("itemCache",null)};Object.defineProperty(a.prototype,"layer",{get:function(){return this._get("layer")||
null},set:function(b){this._reset();this._set("layer",b);this.notifyChange("state")},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"orderByFields",{get:function(){return this._get("orderByFields")||[]},set:function(b){z.equals(b,this.orderByFields)||(this.itemCache.removeAll(),this._set("orderByFields",b))},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"querying",{get:function(){return 0<this._queryOperationQueue.length},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,
"state",{get:function(){var b=this._loaded,d=this._loading;return this._loadError?"error":!this.layer||this.get("layer.loadError")?"disabled":d?"loading":"loaded"===this.get("layer.loadStatus")&&b?"loaded":"ready"},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"syncing",{get:function(){return 0<this._editOperationQueue.length},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"where",{get:function(){return this._get("where")||null},set:function(b){this._reset();
this._set("where",b);this.notifyChange("state")},enumerable:!0,configurable:!0});a.prototype.load=function(){return c.__awaiter(this,void 0,void 0,function(){var b,d;return c.__generator(this,function(a){switch(a.label){case 0:this._reset();b=this.layer;if(!b)return[2,g.resolve()];this._loading=!0;this.notifyChange("state");a.label=1;case 1:return a.trys.push([1,4,,5]),[4,b.when()];case 2:return a.sent(),[4,this._setCount()];case 3:return a.sent(),this._loading=!1,this._loaded=!0,this.notifyChange("state"),
[3,5];case 4:throw d=a.sent(),this._reset(),this._loadError=!0,this.notifyChange("state"),m("store:load-error","An error ocurred.",{error:d}),d;case 5:return[2]}})})};a.prototype.addItems=function(b){return c.__awaiter(this,void 0,void 0,function(){return c.__generator(this,function(b){return[2]})})};a.prototype.fetchItems=function(b){return c.__awaiter(this,void 0,void 0,function(){var d,a,f,p,e,k,n,l;return c.__generator(this,function(c){switch(c.label){case 0:d=b.page;a=b.pageSize;f=d*a;p=f+a;
e=this;k=e.layer;n=e.state;if(!k||"loaded"!==n)return[2,g.resolve([])];this.notifyChange("querying");return[4,this._query({start:f,num:p})];case 1:return l=c.sent(),this.notifyChange("state"),[2,l]}})})};a.prototype.query=function(b){return c.__awaiter(this,void 0,void 0,function(){var a,h,f,p;return c.__generator(this,function(d){switch(d.label){case 0:a=this;h=a.layer;f=a.state;if(!h||"loaded"!==f)return[2,[]];this.notifyChange("querying");return[4,this._query(b)];case 1:return p=d.sent(),this.notifyChange("state"),
[2,p]}})})};a.prototype.removeItemAt=function(b){return c.__awaiter(this,void 0,void 0,function(){return c.__generator(this,function(b){return[2]})})};a.prototype.reset=function(){return c.__awaiter(this,void 0,void 0,function(){return c.__generator(this,function(b){this._reset();return[2]})})};a.prototype.updateItem=function(b){return c.__awaiter(this,void 0,void 0,function(){return c.__generator(this,function(a){return[2,this._update(b)]})})};a.prototype.getItemByObjectId=function(b){var a=this.layer.objectIdField;
return this.itemCache.find(function(d){return d.feature.attributes[a]===b})};a.prototype.getLocalItemAt=function(b){return this.itemCache.getItemAt(b)};a.prototype.getItemAt=function(b){return g.resolve(this.itemCache.getItemAt(b))};a.prototype.getObjectIdIndex=function(b){var a=this.layer.objectIdField;return this.itemCache.findIndex(function(d){return d.feature.attributes[a]===b})};a.prototype._reset=function(){this.itemCache.removeAll();this.failures.removeAll();this._editOperationQueue=[];this._queryOperationQueue=
[];this._loadError=this._loaded=this._loading=!1;this._set("count",0);this.notifyChange("querying");this.notifyChange("syncing");this.notifyChange("state")};a.prototype._getIdsFromFeatures=function(b){var a=this;return b.map(function(b){return b.attributes[a.layer.objectIdField]})};a.prototype._toFeatureData=function(b,a){var d=this.layer.objectIdField;return b.map(function(b){var c=b.attributes[d];return{objectId:c,feature:b,attachments:a?a[c]:null,relatedRecords:null}})};a.prototype._update=function(b){return c.__awaiter(this,
void 0,void 0,function(){var a,h,f,e,g,k,n,l,m,u,r=this;return c.__generator(this,function(d){switch(d.label){case 0:a=this.layer;h=a.capabilities.operations;if(!h.supportsUpdate)throw new t("store:update-error","Update is not supported.");f=b.index;e=b.name;g=b.value;return[4,this.getItemAt(f)];case 1:k=d.sent();if(!k||!k.feature)throw new t("store:update-error","Feature with provided 'objectId' not found.");n=k.feature;l=A.clone(n.attributes);l[e]=g;m=new x({attributes:l});u=a.applyEdits({updateFeatures:[m]}).then(function(b){var a=
b.updateFeatureResults,d=q.find(a,function(b){return!!b.error});if(d)throw d.error;-1<r._editOperationQueue.indexOf(function(){return u})&&a&&a.length&&(n.attributes=l);return b});return[2,this._queueEditOperation(function(){return u})]}})})};a.prototype._query=function(b){var a=this;return!0===b.refresh?(this.itemCache.removeAll(),this._setCount().then(function(){return a._queryFeatureData(b)})):this._queryFeatureData(b)};a.prototype._queryFeatureData=function(b){return c.__awaiter(this,void 0,void 0,
function(){var a=this;return c.__generator(this,function(d){return[2,this._queueQueryOperation(function(){return c.__awaiter(a,void 0,void 0,function(){var a,d,h;return c.__generator(this,function(c){switch(c.label){case 0:return[4,this._queryFeatures(b)];case 1:return a=c.sent().features,d=this._getIdsFromFeatures(a),[4,this._queryAttachments(d)];case 2:return h=c.sent(),[2,this._toFeatureData(a,h)||[]]}})})})]})})};a.prototype._setCount=function(){var b=this;return this._queryCount().then(function(a){b._set("count",
a)})};a.prototype._queryCount=function(){return this.layer.queryFeatureCount(new v({returnGeometry:!1,where:this._getWhere()}))};a.prototype._queryFeatures=function(b){var a=this.layer,c=a.capabilities,f=c.query,e=f.supportsCacheHint,f=f.supportsOrderBy;if(!c.operations.supportsQuery)return g.reject(new t("store:query-error","Layer does not support query operation."));c=this.orderByFields;b=new v({returnGeometry:!1,outFields:["*"],start:b.start,num:b.num,where:this._getWhere()});f&&(b.orderByFields=
c);e&&(b.cacheHint=!0);return a.queryFeatures(b)};a.prototype._queryAttachments=function(b){var a=this.layer,c=this.where,f=a.capabilities,e=f.data.supportsAttachment,f=f.operations.supportsQueryAttachments;return this.attachmentsEnabled&&e&&f?a.queryAttachments(new C({objectIds:b,where:c})):g.resolve(null)};a.prototype._queueQueryOperation=function(a){var b=this;this._queryOperationQueue.push(a);this.notifyChange("querying");return a().then(function(c){return-1<b._queryOperationQueue.indexOf(a)?
(b.itemCache.addMany(c),c):[]}).catch(function(c){m("store:query-error","An error ocurred.",{error:c});var d={error:c,retry:function(){b.failures.remove(d);b._queueQueryOperation(a)},cancel:function(){return b.failures.remove(d)}};b.failures.add(d);return[]}).then(function(c){q.remove(b._queryOperationQueue,a);b.notifyChange("querying");return c})};a.prototype._queueEditOperation=function(a){var b=this;this._editOperationQueue.push(a);this.notifyChange("syncing");return a().then(function(){q.remove(b._editOperationQueue,
a);b.notifyChange("syncing")}).catch(function(c){m("store:edit-error","An error ocurred.",{error:c});var d={error:c,retry:function(){b.failures.remove(d);b._queueEditOperation(a)},cancel:function(){return b.failures.remove(d)}};b.failures.add(d);q.remove(b._editOperationQueue,a);b.notifyChange("syncing");throw c;})};a.prototype._getWhere=function(){return this.where||this.layer.definitionExpression||"1\x3d1"};c.__decorate([e.property()],a.prototype,"attachmentsEnabled",void 0);c.__decorate([e.property({readOnly:!0})],
a.prototype,"count",void 0);c.__decorate([e.property({readOnly:!0})],a.prototype,"failures",void 0);c.__decorate([e.property({readOnly:!0})],a.prototype,"itemCache",void 0);c.__decorate([e.property()],a.prototype,"layer",null);c.__decorate([e.property()],a.prototype,"orderByFields",null);c.__decorate([e.property({readOnly:!0})],a.prototype,"querying",null);c.__decorate([e.property()],a.prototype,"relatedRecordsEnabled",void 0);c.__decorate([e.property({readOnly:!0,dependsOn:["layer","layer.loadError",
"layer.loadStatus"]})],a.prototype,"state",null);c.__decorate([e.property({readOnly:!0})],a.prototype,"syncing",null);c.__decorate([e.property()],a.prototype,"where",null);return a=c.__decorate([e.subclass("esri.widgets.FeatureTable.support.FeatureStore")],a)}(y)});