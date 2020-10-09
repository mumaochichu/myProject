// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define("require exports tslib ../../../../core/events ../../../../core/HandleOwner ../../../../core/maybe ../../../../core/watchUtils ../../../../core/accessorSupport/decorators ../../../Widget ./ButtonMenuViewModel ../../../support/Popover ../../../support/widget".split(" "),function(u,v,e,l,m,n,p,f,q,r,t,d){return function(h){function c(a,b){a=h.call(this,a,b)||this;a._menuContentNode=null;a._popover=null;a._rootNode=null;a.iconClass=null;a.items=null;a.label=null;a.open=!1;a.viewModel=new r;return a}
e.__extends(c,h);c.prototype.initialize=function(){var a=this;this.when(function(){a._popover=new t({owner:a,placement:d.isRTL()?"bottom-start":"bottom-end",renderContentFunction:a.renderMenuContent,anchorElement:a._rootNode});a.handles.add([p.watch(a,"open",function(b){return a._popover.set("open",b)})])});document.addEventListener("click",function(b){return a._handleOutsideClick(b)})};c.prototype.destroy=function(){var a=this,b;null===(b=this._popover)||void 0===b?void 0:b.destroy();this._popover=
null;document.removeEventListener("click",function(b){return a._handleOutsideClick(b)})};c.prototype._handleOutsideClick=function(a){var b,c;this.open&&this._rootNode&&this._menuContentNode&&(a=a.target,(null===(b=this._menuContentNode)||void 0===b?0:b.contains(a))||(null===(c=this._rootNode)||void 0===c?0:c.contains(a))||(this.open=!1))};c.prototype.render=function(){return d.tsx("div",{afterCreate:this._afterRootNodeCreate,bind:this,"data-node-ref":"_rootNode",class:this.classes("esri-button-menu",
"esri-widget"),key:"menu"},this.renderMenuButton())};c.prototype.renderMenuButton=function(){var a=this.id,b=this.label,c=this.open,e=this.classes(["esri-button-menu__button",this.iconClass||"esri-icon-menu",c?"esri-button-menu__button--selected":null]);return d.tsx("button",{"aria-pressed":c.toString(),"aria-controls":a+"-menu","aria-expanded":c,"aria-haspopup":"true","aria-label":b,bind:this,class:e,id:a+"-button",title:b,selected:c,onclick:this._toggleOpen,tabIndex:0})};c.prototype.renderMenuContent=
function(){var a,b=this.id;return d.tsx("div",{afterCreate:this._afterMenuContentNodeCreate,bind:this,class:"esri-button-menu__content","data-node-ref":"_menuContentNode",key:"esri-button-menu-content",hidden:!this.open},d.tsx("ul",{"aria-labelledby":b+"-button",bind:this,class:"esri-button-menu__item-wrapper",id:b+"-menu",role:"menu"},(null===(a=this.items)||void 0===a?void 0:a.length)&&this.renderItems()))};c.prototype.renderItems=function(){var a=this,b;return null===(b=this.items)||void 0===b?
void 0:b.map(function(b,c){return a.renderItem(b,c)})};c.prototype.renderItem=function(a,b,c){var e=this,f,g=n.isSome(c)?this.id+"-menu-item-"+b+"-"+c:this.id+"-menu-item-"+b,k=g+"-label",h=this.classes("esri-button-menu__item",a.selectionEnabled?"esri-button-menu__item--selectable":null,a.selectionEnabled&&a.selected?"esri-button-menu__item--selected":null);return d.tsx("li",{afterCreate:this._afterMenuItemCreate,bind:this,class:h,"data-item-index":b,"data-item-subIndex":c,for:g,key:g,onkeydown:function(b){return e._handleMenuItemKeydown(b,
a)},role:"menuitem",tabindex:"-1"},d.tsx("input",{checked:a.selected,class:"esri-button-menu__checkbox",id:g,name:g,tabindex:"-1",type:"checkbox"}),d.tsx("label",{bind:this,class:this.classes("esri-button-menu__button","esri-button-menu__item-label"),for:g,id:k,onclick:function(b){return e._handleMenuItemInteraction(b,a)}},d.tsx("span",{class:this.classes("esri-button-menu__icon",a.iconClass),"aria-hidden":!0}),d.tsx("span",{class:"esri-button-menu__item-label-content"},a.label)),d.tsx("ul",{"aria-labelledby":k,
class:"esri-button-menu__embedded-content-wrapper",id:this.id+"-submenu",role:"menu"},null===(f=null===a||void 0===a?void 0:a.items)||void 0===f?void 0:f.map(function(a,c){return e.renderItem(a,b,c)})))};c.prototype._afterRootNodeCreate=function(a){var b;this._rootNode=a;null===(b=this._popover)||void 0===b?void 0:b.set("anchorElement",function(){return a})};c.prototype._handleMenuItemInteraction=function(a,b){b.selected=!b.selected;b.open=!(!b.selected||!b.items);b.autoCloseMenu&&this.set("open",
!1);b.clickFunction&&b.clickFunction({event:a,item:b})};c.prototype._handleMenuItemKeydown=function(a,b){var c=l.eventKey(a);"Enter"!==c&&" "!==c||this._handleMenuItemInteraction(a,b);"Escape"===c&&(this.open=!1,a.preventDefault(),a.stopPropagation())};c.prototype._afterMenuContentNodeCreate=function(a){this._menuContentNode=a;a.focus()};c.prototype._toggleOpen=function(){this.open=!this.open};c.prototype._afterMenuItemCreate=function(a){0===a["data-item-index"]&&a.focus()};e.__decorate([f.property(),
d.renderable()],c.prototype,"iconClass",void 0);e.__decorate([f.aliasOf("viewModel.items")],c.prototype,"items",void 0);e.__decorate([f.property(),d.renderable()],c.prototype,"label",void 0);e.__decorate([f.aliasOf("viewModel.open")],c.prototype,"open",void 0);e.__decorate([f.property(),d.renderable(["viewModel.items","viewModel.open"])],c.prototype,"viewModel",void 0);return c=e.__decorate([f.subclass("esri.widgets.FeatureTable.Grid.support.ButtonMenu")],c)}(m.HandleOwnerMixin(q))});