// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","tslib"],function(d,a,e){Object.defineProperty(a,"__esModule",{value:!0});a.AutoDisposableMixin=function(b){return function(b){function a(){var a=null!==b&&b.apply(this,arguments)||this;a._isDisposed=!1;return a}e.__extends(a,b);a.prototype.dispose=function(){for(var b=this.__proto__.__managedDisposables__||[],a=b.length-1;0<=a;a--){var c=b[a];this[c]&&"function"===typeof this[c].dispose&&this[c].dispose();this[c]=null}this._isDisposed=!0};Object.defineProperty(a.prototype,
"isDisposed",{get:function(){return this._isDisposed},enumerable:!0,configurable:!0});return a}(b)};d=function(b){function a(){return null!==b&&b.apply(this,arguments)||this}e.__extends(a,b);return a}(a.AutoDisposableMixin(function(){return function(){}}()));a.AutoDisposable=d;a.autoDispose=function(){return function(a,c){a.hasOwnProperty("__managedDisposables__")||(a.__managedDisposables__=a.__managedDisposables__?a.__managedDisposables__.slice():[]);a.__managedDisposables__.push(c)}}});