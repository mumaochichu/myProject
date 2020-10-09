//>>built
define("dojo dijit dojox dijit/_editor/_Plugin dijit/form/ToggleButton dojo/_base/connect dojo/_base/declare dojo/i18n dojo/i18n!dojox/editor/plugins/nls/Blockquote".split(" "),function(l,t,w,v){var r=l.declare("dojox.editor.plugins.Blockquote",v,{iconClassPrefix:"dijitAdditionalEditorIcon",_initButton:function(){this._nlsResources=l.i18n.getLocalization("dojox.editor.plugins","Blockquote");this.button=new t.form.ToggleButton({label:this._nlsResources.blockquote,showLabel:!1,iconClass:this.iconClassPrefix+
" "+this.iconClassPrefix+"Blockquote",tabIndex:"-1",onClick:l.hitch(this,"_toggleQuote")})},setEditor:function(c){this.editor=c;this._initButton();this.connect(this.editor,"onNormalizedDisplayChanged","updateState");c.customUndo=!0},_toggleQuote:function(c){try{var a=this.editor;a.focus();var g=this.button.get("checked"),e=t.range.getSelection(a.window),h,m,b,k;e&&0<e.rangeCount&&(h=e.getRangeAt(0));if(h){a.beginEditing();if(g){var d,p;if(h.startContainer===h.endContainer){if(this._isRootInline(h.startContainer)){for(b=
h.startContainer;b&&b.parentNode!==a.editNode;)b=b.parentNode;for(;b&&b.previousSibling&&(this._isTextElement(b)||1===b.nodeType&&this._isInlineFormat(this._getTagName(b)));)b=b.previousSibling;b&&1===b.nodeType&&!this._isInlineFormat(this._getTagName(b))&&(b=b.nextSibling);if(b)for(d=a.document.createElement("blockquote"),l.place(d,b,"after"),d.appendChild(b),k=d.nextSibling;k&&(this._isTextElement(k)||1===k.nodeType&&this._isInlineFormat(this._getTagName(k)));)d.appendChild(k),k=d.nextSibling}else{for(var n=
h.startContainer;(this._isTextElement(n)||this._isInlineFormat(this._getTagName(n))||"li"===this._getTagName(n))&&n!==a.editNode&&n!==a.document.body;)n=n.parentNode;n!==a.editNode&&n!==n.ownerDocument.documentElement&&(d=a.document.createElement("blockquote"),l.place(d,n,"after"),d.appendChild(n))}d&&(a._sCall("selectElementChildren",[d]),a._sCall("collapse",[!0]))}else{var f;b=h.startContainer;for(k=h.endContainer;b&&this._isTextElement(b)&&b.parentNode!==a.editNode;)b=b.parentNode;for(f=b;f.nextSibling&&
a._sCall("inSelection",[f]);)f=f.nextSibling;k=f;if(k===a.editNode||k===a.document.body){d=a.document.createElement("blockquote");l.place(d,b,"after");p=this._getTagName(b);if(this._isTextElement(b)||this._isInlineFormat(p))for(a=b;a&&(this._isTextElement(a)||1===a.nodeType&&this._isInlineFormat(this._getTagName(a)));)d.appendChild(a),a=d.nextSibling;else d.appendChild(b);return}k=k.nextSibling;for(f=b;f&&f!==k;){if(1===f.nodeType){if(p=this._getTagName(f),"br"!==p){if(!window.getSelection&&"p"===
p&&this._isEmpty(f)){f=f.nextSibling;continue}this._isInlineFormat(p)?d||(d=a.document.createElement("blockquote"),l.place(d,f,"after")):(d&&this._isEmpty(d)&&d.parentNode.removeChild(d),d=a.document.createElement("blockquote"),l.place(d,f,"after"));d.appendChild(f);f=d}}else this._isTextElement(f)&&(d||(d=a.document.createElement("blockquote"),l.place(d,f,"after")),d.appendChild(f),f=d);f=f.nextSibling}d&&(this._isEmpty(d)?d.parentNode.removeChild(d):(a._sCall("selectElementChildren",[d]),a._sCall("collapse",
[!0])),d=null)}}else if(d=!1,h.startContainer===h.endContainer){for(m=h.endContainer;m&&m!==a.editNode&&m!==a.document.body;){if("blockquote"===(m.tagName?m.tagName.toLowerCase():"")){d=!0;break}m=m.parentNode}if(d){for(var u;m.firstChild;)u=m.firstChild,l.place(u,m,"before");m.parentNode.removeChild(m);u&&(a._sCall("selectElementChildren",[u]),a._sCall("collapse",[!0]))}}else{b=h.startContainer;for(k=h.endContainer;b&&this._isTextElement(b)&&b.parentNode!==a.editNode;)b=b.parentNode;for(h=[];b&&
b.nextSibling&&a._sCall("inSelection",[b]);)b.parentNode&&"blockquote"===this._getTagName(b.parentNode)&&(b=b.parentNode),h.push(b),b=b.nextSibling;for(var r=this._findBlockQuotes(h);r.length;){var q=r.pop();if(q.parentNode){for(;q.firstChild;)l.place(q.firstChild,q,"before");q.parentNode.removeChild(q)}}}a.endEditing()}a.onNormalizedDisplayChanged()}catch(x){}},updateState:function(){var c=this.editor,a=this.get("disabled");if(c&&c.isLoaded&&this.button&&(this.button.set("disabled",a),!a)){var g,
a=!1,e=t.range.getSelection(c.window);e&&0<e.rangeCount&&(e=e.getRangeAt(0))&&(g=e.endContainer);for(;g&&g!==c.editNode&&g!==c.document;){if("blockquote"===(g.tagName?g.tagName.toLowerCase():"")){a=!0;break}g=g.parentNode}this.button.set("checked",a)}},_findBlockQuotes:function(c){var a=[];if(c){var g;for(g=0;g<c.length;g++){var e=c[g];1===e.nodeType&&("blockquote"===this._getTagName(e)&&a.push(e),e.childNodes&&0<e.childNodes.length&&(a=a.concat(this._findBlockQuotes(e.childNodes))))}}return a},_getTagName:function(c){var a=
"";c&&1===c.nodeType&&(a=c.tagName?c.tagName.toLowerCase():"");return a},_isRootInline:function(c){var a=this.editor;if(this._isTextElement(c)&&c.parentNode===a.editNode||1===c.nodeType&&this._isInlineFormat(c)&&c.parentNode===a.editNode)return!0;if(this._isTextElement(c)&&this._isInlineFormat(this._getTagName(c.parentNode))){for(c=c.parentNode;c&&c!==a.editNode&&this._isInlineFormat(this._getTagName(c));)c=c.parentNode;if(c===a.editNode)return!0}return!1},_isTextElement:function(c){return c&&3===
c.nodeType||4===c.nodeType?!0:!1},_isEmpty:function(c){if(c.childNodes){var a=!0,g;for(g=0;g<c.childNodes.length;g++){var e=c.childNodes[g];if(1===e.nodeType){if("p"!==this._getTagName(e)||l.trim(e.innerHTML)){a=!1;break}}else if(this._isTextElement(e)){if((e=l.trim(e.nodeValue))&&"\x26nbsp;"!==e&&"\u00a0"!==e){a=!1;break}}else{a=!1;break}}return a}return!0},_isInlineFormat:function(c){switch(c){case "a":case "b":case "strong":case "s":case "strike":case "i":case "u":case "em":case "sup":case "sub":case "span":case "font":case "big":case "cite":case "q":case "img":case "small":return!0;
default:return!1}}});l.subscribe(t._scopeName+".Editor.getPlugin",null,function(c){c.plugin||"blockquote"!==c.args.name.toLowerCase()||(c.plugin=new r({}))});return r});