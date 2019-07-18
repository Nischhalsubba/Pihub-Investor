/*! Tablesaw - v3.1.2 - 2019-03-19
* https://github.com/filamentgroup/tablesaw
* Copyright (c) 2019 Filament Group; Licensed MIT */
/*! Shoestring - v2.0.0 - 2017-02-14
* http://github.com/filamentgroup/shoestring/
* Copyright (c) 2017 Scott Jehl, Filament Group, Inc; Licensed MIT & GPLv2 */
!function(t){"function"==typeof define&&define.amd?
// AMD. Register as an anonymous module.
define(["shoestring"],t):"object"==typeof module&&module.exports?
// Node/CommonJS
module.exports=t():
// Browser globals
t()}(function(){var i="undefined"!=typeof window?window:this,l=i.document;
/**
	 * The shoestring object constructor.
	 *
	 * @param {string,object} prim The selector to find or element to wrap.
	 * @param {object} sec The context in which to match the `prim` selector.
	 * @returns shoestring
	 * @this window
	 */
function o(t,e){var n,a=typeof t;
// return an empty shoestring object
if(!t)return new r([]);
// ready calls
if(t.call)return o.ready(t);
// handle re-wrapping shoestring objects
if(t.constructor===r&&!e)return t;
// if string starting with <, make html
if("string"!=a||0!==t.indexOf("<"))
// if string, it's a selector, use qsa
return"string"==a?e?o(e).find(t):(n=l.querySelectorAll(t),new r(n,t)):
// array like objects or node lists
"[object Array]"===Object.prototype.toString.call(a)||i.NodeList&&t instanceof i.NodeList?new r(t,t):
// if it's an array, use all the elements
t.constructor===Array?new r(t,t):new r([t],t);var s=l.createElement("div");
// TODO depends on children (circular)
return s.innerHTML=t,o(s).children().each(function(){s.removeChild(this)})}var r=function(t,e){this.length=0,this.selector=e,o.merge(this,t)};
// TODO only required for tests
r.prototype.reverse=[].reverse,
// For adding element set methods
o.fn=r.prototype,o.Shoestring=r,
// For extending objects
// TODO move to separate module when we use prototypes
o.extend=function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},
// taken directly from jQuery
o.merge=function(t,e){var n,a,s;for(n=+e.length,a=0,s=t.length;a<n;a++)t[s++]=e[a];return t.length=s,t},
/**
	 * Iterates over `shoestring` collections.
	 *
	 * @param {function} callback The callback to be invoked on each element and index
	 * @return shoestring
	 * @this shoestring
	 */
(
// expose
i.shoestring=o).fn.each=function(t){return o.each(this,t)},o.each=function(t,e){for(var n=0,a=t.length;n<a&&!1!==e.call(t[n],n,t[n]);n++);return t},
/**
	 * Check for array membership.
	 *
	 * @param {object} needle The thing to find.
	 * @param {object} haystack The thing to find the needle in.
	 * @return {boolean}
	 * @this window
	 */
o.inArray=function(t,e){for(var n=-1,a=0,s=e.length;a<s;a++)e.hasOwnProperty(a)&&e[a]===t&&(n=a);return n},
/**
	 * Bind callbacks to be run when the DOM is "ready".
	 *
	 * @param {function} fn The callback to be run
	 * @return shoestring
	 * @this shoestring
	 */
o.ready=function(t){return e&&t?t.call(l):t?n.push(t):a(),[l]};
// Empty and exec the ready queue
var c,h,u,e=!(
// TODO necessary?
o.fn.ready=function(t){return o.ready(t),this}),n=[],a=function(){if(!e){for(;n.length;)n.shift().call(l);e=!0}};
// If DOM is already ready at exec time, depends on the browser.
// From: https://github.com/mobify/mobifyjs/blob/526841be5509e28fc949038021799e4223479f8d/src/capture.js#L128
function d(t,e){var n=!1;return t.each(function(){for(var t=0;t<e.length;)this===e[t]&&(n=!0),t++}),n}
/**
	 * Get data attached to the first element or set data values on all elements in the current set.
	 *
	 * @param {string} name The data attribute name.
	 * @param {any} value The value assigned to the data attribute.
	 * @return {any|shoestring}
	 * @this shoestring
	 */function f(t,e){return i.getComputedStyle(t,null).getPropertyValue(e)}(l.attachEvent?"complete"===l.readyState:"loading"!==l.readyState)?a():(l.addEventListener("DOMContentLoaded",a,!1),l.addEventListener("readystatechange",a,!1),i.addEventListener("load",a,!1))
/**
	 * Checks the current set of elements against the selector, if one matches return `true`.
	 *
	 * @param {string} selector The selector to check.
	 * @return {boolean}
	 * @this {shoestring}
	 */,o.fn.is=function(a){var t,s=!1,i=this;
// assume a dom element
return"string"!=typeof a?d(this,
// array-like, ie shoestring objects or element arrays
a.length&&a[0]?a:[a]):((t=this.parent()).length||(t=o(l)),t.each(function(t,e){var n;n=e.querySelectorAll(a),s=d(i,n)}),s)},o.fn.data=function(t,e){return void 0===t?this[0]?this[0].shoestringData||{}:void 0:void 0!==e?this.each(function(){this.shoestringData||(this.shoestringData={}),this.shoestringData[t]=e}):this[0]&&this[0].shoestringData?this[0].shoestringData[t]:void 0},
/**
	 * Remove data associated with `name` or all the data, for each element in the current set.
	 *
	 * @param {string} name The data attribute name.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.removeData=function(t){return this.each(function(){void 0!==t&&this.shoestringData?(this.shoestringData[t]=void 0,delete this.shoestringData[t]):this[0].shoestringData={}})},
/**
	 * Add a class to each DOM element in the set of elements.
	 *
	 * @param {string} className The name of the class to be added.
	 * @return shoestring
	 * @this shoestring
	 */
(
/**
	 * An alias for the `shoestring` constructor.
	 */
i.$=o).fn.addClass=function(t){var n=t.replace(/^\s+|\s+$/g,"").split(" ");return this.each(function(){for(var t=0,e=n.length;t<e;t++)void 0===this.className||""!==this.className&&this.className.match(new RegExp("(^|\\s)"+n[t]+"($|\\s)"))||(this.className+=" "+n[t])})},
/**
	 * Add elements matching the selector to the current set.
	 *
	 * @param {string} selector The selector for the elements to add from the DOM
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.add=function(t){var e=[];return this.each(function(){e.push(this)}),o(t).each(function(){e.push(this)}),o(e)},
/**
	 * Insert an element or HTML string as the last child of each element in the set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.append=function(a){return"string"!=typeof a&&void 0===a.nodeType||(a=o(a)),this.each(function(t){for(var e=0,n=a.length;e<n;e++)this.appendChild(0<t?a[e].cloneNode(!0):a[e])})},
/**
	 * Insert the current set as the last child of the elements matching the selector.
	 *
	 * @param {string} selector The selector after which to append the current set.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.appendTo=function(t){return this.each(function(){o(t).append(this)})},
/**
	 * Get the value of the first element of the set or set the value of all the elements in the set.
	 *
	 * @param {string} name The attribute name.
	 * @param {string} value The new value for the attribute.
	 * @return {shoestring|string|undefined}
	 * @this {shoestring}
	 */
o.fn.attr=function(e,n){var a="string"==typeof e;return void 0===n&&a?this[0]?this[0].getAttribute(e):void 0:this.each(function(){if(a)this.setAttribute(e,n);else for(var t in e)e.hasOwnProperty(t)&&this.setAttribute(t,e[t])})},
/**
	 * Insert an element or HTML string before each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML or HTMLElement to insert.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.before=function(a){return"string"!=typeof a&&void 0===a.nodeType||(a=o(a)),this.each(function(t){for(var e=0,n=a.length;e<n;e++)this.parentNode.insertBefore(0<t?a[e].cloneNode(!0):a[e],this)})},
/**
	 * Get the children of the current collection.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.children=function(){var t,e,n=[];return this.each(function(){for(t=this.children,e=-1;e++<t.length-1;)-1===o.inArray(t[e],n)&&n.push(t[e])}),o(n)},
/**
	 * Find an element matching the selector in the set of the current element and its parents.
	 *
	 * @param {string} selector The selector used to identify the target element.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.closest=function(e){var n=[];return e&&this.each(function(){var t;if(o(t=this).is(e))n.push(this);else for(;t.parentElement;){if(o(t.parentElement).is(e)){n.push(t.parentElement);break}t=t.parentElement}}),o(n)},c=o.cssExceptions={float:["cssFloat"]},h=["","-webkit-","-ms-","-moz-","-o-","-khtml-"],
/**
		 * Private function for getting the computed style of an element.
		 *
		 * **NOTE** Please use the [css](../css.js.html) method instead.
		 *
		 * @method _getStyle
		 * @param {HTMLElement} element The element we want the style property for.
		 * @param {string} property The css property we want the style for.
		 */
o._getStyle=function(t,e){var n,a,s,i;if(c[e])for(s=0,i=c[e].length;s<i;s++)if(a=f(t,c[e][s]))return a;for(s=0,i=h.length;s<i;s++)if(
// VendorprefixKeyName || key-name
a=f(t,n=(h[s]+e).replace(/\-([A-Za-z])/g,function(t,e){return e.toUpperCase()})),n!==e&&(a=a||f(t,e)),h[s]&&(
// -vendorprefix-key-name
a=a||f(t,h[s]+e)),a)return a},u=o.cssExceptions,
/**
		 * Private function for setting the style of an element.
		 *
		 * **NOTE** Please use the [css](../css.js.html) method instead.
		 *
		 * @method _setStyle
		 * @param {HTMLElement} element The element we want to style.
		 * @param {string} property The property being used to style the element.
		 * @param {string} value The css value for the style property.
		 */
o._setStyle=function(t,e,n){var a=
// IE8 uses marginRight instead of margin-right
function(t){return t.replace(/\-([A-Za-z])/g,function(t,e){return e.toUpperCase()})}(e);if(t.style[e]=n,a!==e&&(t.style[a]=n),u[e])for(var s=0,i=u[e].length;s<i;s++)t.style[u[e][s]]=n},
/**
	 * Get the compute style property of the first element or set the value of a style property
	 * on all elements in the set.
	 *
	 * @method _setStyle
	 * @param {string} property The property being used to style the element.
	 * @param {string|undefined} value The css value for the style property.
	 * @return {string|shoestring}
	 * @this shoestring
	 */
o.fn.css=function(e,t){if(this[0])return"object"==typeof e?this.each(function(){for(var t in e)e.hasOwnProperty(t)&&o._setStyle(this,t,e[t])}):
// assignment else retrieve first
void 0!==t?this.each(function(){o._setStyle(this,e,t)}):o._getStyle(this[0],e)},
/**
	 * Returns the indexed element wrapped in a new `shoestring` object.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.eq=function(t){return this[t]?o(this[t]):o([])},
/**
	 * Filter out the current set if they do *not* match the passed selector or
	 * the supplied callback returns false
	 *
	 * @param {string,function} selector The selector or boolean return value callback used to filter the elements.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.filter=function(a){var s=[];return this.each(function(t){var e;if("function"==typeof a)!1!==a.call(this,t)&&s.push(this);else{if(this.parentNode)e=o(a,this.parentNode);else{var n=o(l.createDocumentFragment());n[0].appendChild(this),e=o(a,n)}-1<o.inArray(this,e)&&s.push(this)}}),o(s)},
/**
	 * Find descendant elements of the current collection.
	 *
	 * @param {string} selector The selector used to find the children
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.find=function(n){var a,s=[];return this.each(function(){for(var t=0,e=(a=this.querySelectorAll(n)).length;t<e;t++)s=s.concat(a[t])}),o(s)},
/**
	 * Returns the first element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.first=function(){return this.eq(0)},
/**
	 * Returns the raw DOM node at the passed index.
	 *
	 * @param {integer} index The index of the element to wrap and return.
	 * @return {HTMLElement|undefined|array}
	 * @this shoestring
	 */
o.fn.get=function(t){
// return an array of elements if index is undefined
if(void 0!==t)return this[t];for(var e=[],n=0;n<this.length;n++)e.push(this[n]);return e};function t(t,e){var n,a,s;for(n=a=0;n<t.length;n++){if(e(s=t.item?t.item(n):t[n]))return a;
// ignore text nodes, etc
// NOTE may need to be more permissive
1===s.nodeType&&a++}return-1}
/**
		 * Find the index in the current set for the passed selector.
		 * Without a selector it returns the index of the first node within the array of its siblings.
		 *
		 * @param {string|undefined} selector The selector used to search for the index.
		 * @return {integer}
		 * @this {shoestring}
		 */
/**
	 * Gets or sets the `innerHTML` from all the elements in the set.
	 *
	 * @param {string|undefined} html The html to assign
	 * @return {string|shoestring}
	 * @this shoestring
	 */
o.fn.html=function(t){if(void 0!==t)return function(t){if("string"==typeof t||"number"==typeof t)return this.each(function(){this.innerHTML=""+t});var e="";if(void 0!==t.length)for(var n=0,a=t.length;n<a;n++)e+=t[n].outerHTML;else e=t.outerHTML;return this.each(function(){this.innerHTML=e})}.call(this,t);// get
var e="";return this.each(function(){e+=this.innerHTML}),e},o.fn.index=function(e){var n;
// no arg? check the children, otherwise check each element that matches
return n=this,void 0===e?t((this[0]&&this[0].parentNode||l.documentElement).childNodes,function(t){return n[0]===t}):t(n,function(t){return t===o(e,t.parentNode)[0]})},
/**
	 * Insert the current set before the elements matching the selector.
	 *
	 * @param {string} selector The selector before which to insert the current set.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.insertBefore=function(t){return this.each(function(){o(t).before(this)})},
/**
	 * Returns the last element of the set wrapped in a new `shoestring` object.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.last=function(){return this.eq(this.length-1)},
/**
	 * Returns a `shoestring` object with the set of siblings of each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.next=function(){var s=[];
// TODO need to implement map
return this.each(function(){var t,e,n;
// get the child nodes for this member of the set
t=o(this.parentNode)[0].childNodes;for(var a=0;a<t.length;a++){
// found the item we needed (found) which means current item value is
// the next node in the list, as long as it's viable grab it
// NOTE may need to be more permissive
if(e=t.item(a),n&&1===e.nodeType){s.push(e);break}
// find the current item and mark it as found
e===this&&(n=!0)}}),o(s)},
/**
	 * Removes elements from the current set.
	 *
	 * @param {string} selector The selector to use when removing the elements.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.not=function(e){var n=[];return this.each(function(){var t=o(e,this.parentNode);-1===o.inArray(this,t)&&n.push(this)}),o(n)},
/**
	 * Returns the set of first parents for each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.parent=function(){var t,e=[];return this.each(function(){
// no parent node, assume top level
// jQuery parent: return the document object for <html> or the parent node if it exists
// if there is a parent and it's not a document fragment
(t=this===l.documentElement?l:this.parentNode)&&11!==t.nodeType&&e.push(t)}),o(e)},
/**
	 * Add an HTML string or element before the children of each element in the current set.
	 *
	 * @param {string|HTMLElement} fragment The HTML string or element to add.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.prepend=function(s){return"string"!=typeof s&&void 0===s.nodeType||(s=o(s)),this.each(function(t){for(var e=0,n=s.length;e<n;e++){var a=0<t?s[e].cloneNode(!0):s[e];this.firstChild?this.insertBefore(a,this.firstChild):this.appendChild(a)}})},
/**
	 * Returns a `shoestring` object with the set of *one* siblingx before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.prev=function(){var s=[];
// TODO need to implement map
return this.each(function(){for(var t,e,n,a=(
// get the child nodes for this member of the set
t=o(this.parentNode)[0].childNodes).length-1;0<=a;a--){
// found the item we needed (found) which means current item value is
// the next node in the list, as long as it's viable grab it
// NOTE may need to be more permissive
if(e=t.item(a),n&&1===e.nodeType){s.push(e);break}
// find the current item and mark it as found
e===this&&(n=!0)}}),o(s)},
/**
	 * Returns a `shoestring` object with the set of *all* siblings before each element in the original set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.prevAll=function(){var e=[];return this.each(function(){for(var t=o(this).prev();t.length;)e.push(t[0]),t=t.prev()}),o(e)},
/**
	 * Remove an attribute from each element in the current set.
	 *
	 * @param {string} name The name of the attribute.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.removeAttr=function(t){return this.each(function(){this.removeAttribute(t)})},
/**
	 * Remove a class from each DOM element in the set of elements.
	 *
	 * @param {string} className The name of the class to be removed.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.removeClass=function(t){var s=t.replace(/^\s+|\s+$/g,"").split(" ");return this.each(function(){for(var t,e,n=0,a=s.length;n<a;n++)void 0!==this.className&&(e=new RegExp("(^|\\s)"+s[n]+"($|\\s)","gmi"),t=this.className.replace(e," "),this.className=t.replace(/^\s+|\s+$/g,""))})},
/**
	 * Remove the current set of elements from the DOM.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.remove=function(){return this.each(function(){this.parentNode&&this.parentNode.removeChild(this)})},
/**
	 * Replace each element in the current set with that argument HTML string or HTMLElement.
	 *
	 * @param {string|HTMLElement} fragment The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.replaceWith=function(i){"string"==typeof i&&(i=o(i));var r=[];return 1<i.length&&(i=i.reverse()),this.each(function(t){var e,n=this.cloneNode(!0);
// If there is no parentNode, this is pointless, drop it.
if(r.push(n),this.parentNode)if(1===i.length)e=0<t?i[0].cloneNode(!0):i[0],this.parentNode.replaceChild(e,this);else{for(var a=0,s=i.length;a<s;a++)e=0<t?i[a].cloneNode(!0):i[a],this.parentNode.insertBefore(e,this.nextSibling);this.parentNode.removeChild(this)}}),o(r)},
/**
	 * Get all of the sibling elements for each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.siblings=function(){if(!this.length)return o([]);for(var t=[],e=this[0].parentNode.firstChild;1===e.nodeType&&e!==this[0]&&t.push(e),e=e.nextSibling;);return o(t)};var p=function(t){var e,n="",a=0,s=t.nodeType;if(s){if(1===s||9===s||11===s){
// Use textContent for elements
// innerText usage removed for consistency of new lines (jQuery #11153)
if("string"==typeof t.textContent)return t.textContent;
// Traverse its children
for(t=t.firstChild;t;t=t.nextSibling)n+=p(t)}else if(3===s||4===s)return t.nodeValue;
// Do not include comment or processing instruction nodes
}else
// If no nodeType, this is expected to be an array
for(;e=t[a++];)
// Do not traverse comment nodes
n+=p(e);return n};
/**
	 * Recursively retrieve the text content of the each element in the current set.
	 *
	 * @return shoestring
	 * @this shoestring
	 */function g(t,e,n){var a=this.shoestringData.events[t];if(a&&a.length){var s,i,r=[];for(s=0,i=a.length;s<i;s++)e&&e!==a[s].namespace||void 0!==n&&n!==a[s].originalCallback||(this.removeEventListener(t,a[s].callback,!1),r.push(s));for(s=0,i=r.length;s<i;s++)this.shoestringData.events[t].splice(s,1)}}function b(t,e){for(var n in this.shoestringData.events)g.call(this,n,t,e)}return o.fn.text=function(){return p(this)},
/**
	 * Get the value of the first element or set the value of all elements in the current set.
	 *
	 * @param {string} value The value to set.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.val=function(r){var t;return void 0!==r?this.each(function(){if("SELECT"===this.tagName){var t,e,n,a=this.options,s=[],i=a.length;for(s[0]=r;i--;)((e=a[i]).selected=0<=o.inArray(e.value,s))&&(t=!0,n=i);
// force browsers to behave consistently when non-matching value is set
this.selectedIndex=t?n:-1}else this.value=r}):"SELECT"===(t=this[0]).tagName?t.selectedIndex<0?"":t.options[t.selectedIndex].value:t.value},
/**
	 * Private function for setting/getting the offset property for height/width.
	 *
	 * **NOTE** Please use the [width](width.js.html) or [height](height.js.html) methods instead.
	 *
	 * @param {shoestring} set The set of elements.
	 * @param {string} name The string "height" or "width".
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this window
	 */
o._dimension=function(t,e,n){var a;return void 0===n?(a=e.replace(/^[a-z]/,function(t){return t.toUpperCase()}),t[0]["offset"+a]):(
// support integer values as pixels
n="string"==typeof n?n:n+"px",t.each(function(){this.style[e]=n}))},
/**
	 * Gets the width value of the first element or sets the width for the whole set.
	 *
	 * @param {float|undefined} value The value to assign.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.width=function(t){return o._dimension(this,"width",t)},
/**
	 * Wraps the child elements in the provided HTML.
	 *
	 * @param {string} html The wrapping HTML.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.wrapInner=function(e){return this.each(function(){var t=this.innerHTML;this.innerHTML="",o(this).append(o(e).html(t))})},
/**
	 * Bind a callback to an event for the currrent set of elements.
	 *
	 * @param {string} evt The event(s) to watch for.
	 * @param {object,function} data Data to be included with each event or the callback.
	 * @param {function} originalCallback Callback to be invoked when data is define.d.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.bind=function(t,r,f){"function"==typeof r&&(f=r,r=null);var p=t.split(" ");
// NOTE the `triggeredElement` is purely for custom events from IE
function g(t,e,n){var a;if(!t._namespace||t._namespace===e){t.data=r,t.namespace=t._namespace;function s(){return!0}t.isDefaultPrevented=function(){return!1};var i=t.preventDefault;
// thanks https://github.com/jonathantneal/EventListener
return t.target=n||t.target||t.srcElement,t.preventDefault=i?function(){t.isDefaultPrevented=s,i.call(t)}:function(){t.isDefaultPrevented=s,t.returnValue=!1},t.stopPropagation=t.stopPropagation||function(){t.cancelBubble=!0},!1===(a=f.apply(this,[t].concat(t._args)))&&(t.preventDefault(),t.stopPropagation()),a}}return this.each(function(){for(var t,e,n,a,s,i,r,o=this,l=0,c=p.length;l<c;l++){var h=p[l].split("."),u=h[0],d=0<h.length?h[1]:null;t=function(t){return o.ssEventTrigger&&(t._namespace=o.ssEventTrigger._namespace,t._args=o.ssEventTrigger._args,o.ssEventTrigger=null),g.call(o,t,d)},null,r=u,(i=this).shoestringData||(i.shoestringData={}),i.shoestringData.events||(i.shoestringData.events={}),i.shoestringData.loop||(i.shoestringData.loop={}),i.shoestringData.events[r]||(i.shoestringData.events[r]=[]),this.addEventListener(u,t,!1),e=this,n=u,s=void 0,(s={}).isCustomEvent=(a={callfunc:t,isCustomEvent:!1,customEventLoop:null,originalCallback:f,namespace:d}).isCustomEvent,s.callback=a.callfunc,s.originalCallback=a.originalCallback,s.namespace=a.namespace,e.shoestringData.events[n].push(s),a.customEventLoop&&(e.shoestringData.loop[n]=a.customEventLoop)}})},o.fn.on=o.fn.bind,
/**
	 * Unbind a previous bound callback for an event.
	 *
	 * @param {string} event The event(s) the callback was bound to..
	 * @param {function} callback Callback to unbind.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.unbind=function(t,i){var r=t?t.split(" "):[];return this.each(function(){if(this.shoestringData&&this.shoestringData.events)if(r.length)for(var t,e,n,a=0,s=r.length;a<s;a++)e=(t=r[a].split("."))[0],n=0<t.length?t[1]:null,e?g.call(this,e,n,i):b.call(this,n,i);else b.call(this)})},o.fn.off=o.fn.unbind,
/**
	 * Bind a callback to an event for the currrent set of elements, unbind after one occurence.
	 *
	 * @param {string} event The event(s) to watch for.
	 * @param {function} callback Callback to invoke on the event.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.one=function(t,i){var r=t.split(" ");return this.each(function(){for(var t,a={},e=o(this),n=0,s=r.length;n<s;n++)t=r[n],a[t]=function(t){var e=o(this);for(var n in a)e.unbind(n,a[n]);return i.apply(this,[t].concat(t._args))},e.bind(t,a[t])})},
/**
	 * Trigger an event on the first element in the set, no bubbling, no defaults.
	 *
	 * @param {string} event The event(s) to trigger.
	 * @param {object} args Arguments to append to callback invocations.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.triggerHandler=function(t,e){var n,a=t.split(" ")[0],s=this[0];
// See this.fireEvent( 'on' + evts[ i ], document.createEventObject() ); instead of click() etc in trigger.
if(l.createEvent&&s.shoestringData&&s.shoestringData.events&&s.shoestringData.events[a]){var i=s.shoestringData.events[a];for(var r in i)i.hasOwnProperty(r)&&((t=l.createEvent("Event")).initEvent(a,!0,!0),(t._args=e).unshift(t),n=i[r].originalCallback.apply(t.target,e))}return n},
/**
	 * Trigger an event on each of the DOM elements in the current set.
	 *
	 * @param {string} event The event(s) to trigger.
	 * @param {object} args Arguments to append to callback invocations.
	 * @return shoestring
	 * @this shoestring
	 */
o.fn.trigger=function(t,r){var o=t.split(" ");return this.each(function(){for(var t,e,n,a=0,s=o.length;a<s;a++){if(e=(t=o[a].split("."))[0],n=0<t.length?t[1]:null,"click"===e&&"INPUT"===this.tagName&&"checkbox"===this.type&&this.click)return this.click(),!1;if(l.createEvent){var i=l.createEvent("Event");i.initEvent(e,!0,!0),i._args=r,i._namespace=n,this.dispatchEvent(i)}}})},o}),function(e,n){"function"==typeof define&&define.amd?define(["shoestring"],function(t){return e.Tablesaw=n(t,e)}):"object"==typeof exports?module.exports=n(require("shoestring"),e):e.Tablesaw=n(shoestring,e)}("undefined"!=typeof window?window:this,function(D,S){"use strict";var A=S.document,e=/complete|loaded/.test(A.readyState);
// Account for Tablesaw being loaded either before or after the DOMContentLoaded event is fired.
A.addEventListener("DOMContentLoaded",function(){e=!0});var t,a,s,n,i,r,o,l,g,u,h,d,p,b,v,f,c,M,L,H,P,B,I,w,m,C,R={i18n:{modeStack:"Stack",modeSwipe:"Swipe",modeToggle:"Toggle",modeSwitchColumnsAbbreviated:"Cols",modeSwitchColumns:"Columns",columnToggleButton:"Columns",columnToggleError:"No eligible columns.",sort:"Sort",swipePreviousColumn:"Previous column",swipeNextColumn:"Next column"},
// cut the mustard
mustard:"head"in A&&(// IE9+, Firefox 4+, Safari 5.1+, Mobile Safari 4.1+, Opera 11.5+, Android 2.3+
!S.blackberry||S.WebKitPoint)&&// only WebKit Blackberry (OS 6+)
!S.operamini,$:D,_init:function(t){R.$(t||A).trigger("enhance.tablesaw")},init:function(t){
// Account for Tablesaw being loaded either before or after the DOMContentLoaded event is fired.
(e=e||/complete|loaded/.test(A.readyState))?R._init(t):"addEventListener"in A&&
// Use raw DOMContentLoaded instead of shoestring (may have issues in Android 2.3, exhibited by stack table)
A.addEventListener("DOMContentLoaded",function(){R._init(t)})}};function y(t,e){this.tablesaw=e,this.$table=D(t),this.labelless=this.$table.is("["+i+"]"),this.hideempty=this.$table.is("["+r+"]"),this.$table.data(n,this)}function T(t){this.$table=D(t),this.$table.length&&(this.tablesaw=this.$table.data("tablesaw"),this.attributes={btnTarget:"data-tablesaw-columntoggle-btn-target",set:"data-tablesaw-columntoggle-set"},this.classes={columnToggleTable:"tablesaw-columntoggle",columnBtnContain:"tablesaw-columntoggle-btnwrap tablesaw-advance",columnBtn:"tablesaw-columntoggle-btn tablesaw-nav-btn down",popup:"tablesaw-columntoggle-popup",priorityPrefix:"tablesaw-priority-"},this.set=[],this.$headers=this.tablesaw._getPrimaryHeaderCells(),this.$table.data(g,this))}function $(t){var e=[];return D(t.childNodes).each(function(){var t=D(this);t.is("input, select")?e.push(t.val()):t.is(".tablesaw-cell-label")||e.push((t.text()||"").replace(/^\s+|\s+$/g,""))}),e.join("")}function k(c,u){var d=u.data("tablesaw"),t=D("<div class='tablesaw-advance'></div>"),n=D("<a href='#' class='btn tablesaw-nav-btn tablesaw-btn btn-micro left'>"+R.i18n.swipePreviousColumn+"</a>").appendTo(t),a=D("<a href='#' class='btn tablesaw-nav-btn tablesaw-btn btn-micro right'>"+R.i18n.swipeNextColumn+"</a>").appendTo(t),f=c._getPrimaryHeaderCells(),p=f.not('[data-tablesaw-priority="persist"]'),l=[],g=[],b=D(A.head||"head"),v=u.attr("id");if(!f.length)throw new Error("tablesaw swipe: no header cells found.");function e(){u.css({width:"1px"}),
// remove any hidden columns
u.find("."+H).removeClass(H),l=[],g=[],
// Calculate initial widths
f.each(function(){var t=this.offsetWidth;l.push(t),C(this)||g.push(t)}),
// reset props
u.css({width:""})}function w(t){d._$getCells(t).removeClass(H)}function m(t){d._$getCells(t).addClass(H)}function C(t){return D(t).is('[data-tablesaw-priority="persist"]')}function h(){u.removeClass(L),D("#"+v+"-persist").remove()}function y(){var a,s=[];return p.each(function(t){var e=D(this),n="none"===e.css("display")||e.is("."+H);if(n||a){if(n&&a)return s[1]=t,!1}else a=!0,s[0]=t}),s}function T(){var t=y();return[t[1]-1,t[0]-1]}function $(t){return-1<t[1]&&t[1]<p.length}function k(){if(function(){var t=u.attr("data-tablesaw-swipe-media");return!t||"matchMedia"in S&&S.matchMedia(t).matches}()){var n=u.parent().width(),a=[],s=0,i=[],r=f.length;f.each(function(t){var e=D(this).is('[data-tablesaw-priority="persist"]');a.push(e),s+=l[t],i.push(s),
// is persistent or is hidden
(e||n<s)&&r--});
// We need at least one column to swipe.
var e=0===r;f.each(function(t){i[t]>n&&m(this)});var o=!0;f.each(function(t){if(a[t])
// for visual box-shadow
return function(t){d._$getCells(t).addClass(P)}(this),void(o&&(d._$getCells(this).css("width",i[t]+"px"),o=!1));(i[t]<=n||e)&&(e=!1,w(this),d.updateColspanCells(H,this,!0))}),h(),u.trigger("tablesawcolumns")}}function x(){N(!0)}function _(){N(!1)}function N(t){var e;if($(e=t?y():T())){isNaN(e[0])&&(e[0]=t?0:p.length-1);var n,a=function(){var t,n="#"+v+".tablesaw-swipe ",a=[],s=u.width(),i=s,r=[];if(
// save persistent column widths (as long as they take up less than 75% of table width)
f.each(function(t){var e;C(this)&&(e=this.offsetWidth,i-=e,e<.75*s&&(r.push(t+"-"+e),a.push(n+" ."+P+":nth-child("+(t+1)+") { width: "+e+"px; }")))}),t=r.join("_"),a.length){u.addClass(L);var e=D("#"+v+"-persist");
// If style element not yet added OR if the widths have changed
e.length&&e.data("tablesaw-hash")===t||(
// Remove existing
e.remove(),D("<style>"+a.join("\n")+"</style>").attr("id",v+"-persist").data("tablesaw-hash",t).appendTo(b))}return i}(),s=e[0],i=e[1],r=p.get(s),o=!1,l=!1;m(r),d.updateColspanCells(H,r,!0);for(var c=s+(t?1:-1);0<=c&&c<g.length;){a-=g[c];var h=p.eq(c);h.is(".tablesaw-swipe-cellhidden")?0<a&&(l=o=!0,w(n=h.get(0)),d.updateColspanCells(H,n,!1)):l=!0,t?c++:c--}l?!o&&$(t?y():T())&&
// if our one new column was hidden but no new columns were shown, let’s navigate again automatically.
N(t):(
// if no columns are showing, at least show the first one we were aiming for.
w(n=p.get(i)),d.updateColspanCells(H,n,!1)),u.trigger("tablesawcolumns")}}function E(t,e){return(t.touches||t.originalEvent.touches)[0][e]}u.addClass("tablesaw-swipe"),e(),t.appendTo(d.$toolbar),v||(v="tableswipe-"+Math.round(1e4*Math.random()),u.attr("id",v)),n.add(a).on("click",function(t){D(t.target).closest(a).length?x():_(),t.preventDefault()}),u.is("["+I+"]")||u.on("touchstart.swipetoggle",function(t){var s,i,r=E(t,"pageX"),o=E(t,"pageY"),l=S.pageYOffset;D(S).off(R.events.resize,k),D(this).on("touchmove.swipetoggle",function(t){s=E(t,"pageX"),i=E(t,"pageY")}).on("touchend.swipetoggle",function(){var t=c.getConfig({swipeHorizontalThreshold:30,swipeVerticalThreshold:30}),e=t.swipe?t.swipe.verticalThreshold:t.swipeVerticalThreshold,n=t.swipe?t.swipe.horizontalThreshold:t.swipeHorizontalThreshold,a=Math.abs(S.pageYOffset-l)>=e;
// This config code is a little awkward because shoestring doesn’t support deep $.extend
// Trying to work around when devs only override one of (not both) horizontalThreshold or
// verticalThreshold in their TablesawConfig.
// @TODO major version bump: remove cfg.swipe, move to just use the swipePrefix keys
Math.abs(i-o)>=e||a||(s-r<-1*n&&x(),n<s-r&&_()),S.setTimeout(function(){D(S).on(R.events.resize,k)},300),D(this).off("touchmove.swipetoggle touchend.swipetoggle")})}),u.on("tablesawcolumns.swipetoggle",function(){var t=$(T()),e=$(y());n[t?"removeClass":"addClass"](M),a[e?"removeClass":"addClass"](M),d.$toolbar[t||e?"removeClass":"addClass"](B)}).on("tablesawnext.swipetoggle",function(){x()}).on("tablesawprev.swipetoggle",function(){_()}).on(R.events.destroy+".swipetoggle",function(){var t=D(this);t.removeClass("tablesaw-swipe"),d.$toolbar.find(".tablesaw-advance").remove(),D(S).off(R.events.resize,k),t.off(".swipetoggle")}).on(R.events.refresh,function(){h(),e(),k()}),k(),D(S).on(R.events.resize,k)}
// on tablecreate, init
function x(t){this.tablesaw=t,this.$table=t.$table,this.attr="data-tablesaw-checkall",this.checkAllSelector="["+this.attr+"]",this.forceCheckedSelector="["+this.attr+"-checked]",this.forceUncheckedSelector="["+this.attr+"-unchecked]",this.checkboxSelector='input[type="checkbox"]',this.$triggers=null,this.$checkboxes=null,this.$table.data(C)||(this.$table.data(C,this),this.init())}return D(A).on("enhance.tablesaw",function(){
// Extend i18n config, if one exists.
"undefined"!=typeof TablesawConfig&&TablesawConfig.i18n&&(R.i18n=D.extend(R.i18n,TablesawConfig.i18n||{})),R.i18n.modes=[R.i18n.modeStack,R.i18n.modeSwipe,R.i18n.modeToggle]}),R.mustard&&D(A.documentElement).addClass("tablesaw-enhanced"),function(){var n="tablesaw",a="tablesaw-bar",e={create:"tablesawcreate",destroy:"tablesawdestroy",refresh:"tablesawrefresh",resize:"tablesawresize"},s={};R.events=e;function t(t){if(!t)throw new Error("Tablesaw requires an element.");this.table=t,this.$table=D(t),
// only one <thead> and <tfoot> are allowed, per the specification
this.$thead=this.$table.children().filter("thead").eq(0),
// multiple <tbody> are allowed, per the specification
this.$tbody=this.$table.children().filter("tbody"),this.mode=this.$table.attr("data-tablesaw-mode")||"stack",this.$toolbar=null,this.attributes={subrow:"data-tablesaw-subrow",ignorerow:"data-tablesaw-ignorerow"},this.init()}t.prototype.init=function(){if(!this.$thead.length)throw new Error("tablesaw: a <thead> is required, but none was found.");if(!this.$thead.find("th").length)throw new Error("tablesaw: no header cells found. Are you using <th> inside of <thead>?");
// assign an id if there is none
this.$table.attr("id")||this.$table.attr("id",n+"-"+Math.round(1e4*Math.random())),this.createToolbar(),this._initCells(),this.$table.data(n,this),this.$table.trigger(e.create,[this])},t.prototype.getConfig=function(t){
// shoestring extend doesn’t support arbitrary args
var e=D.extend(s,t||{});return D.extend(e,"undefined"!=typeof TablesawConfig?TablesawConfig:{})},t.prototype._getPrimaryHeaderRow=function(){return this._getHeaderRows().eq(0)},t.prototype._getHeaderRows=function(){return this.$thead.children().filter("tr").filter(function(){return!D(this).is("[data-tablesaw-ignorerow]")})},t.prototype._getRowIndex=function(t){return t.prevAll().length},t.prototype._getHeaderRowIndeces=function(){var t=this,e=[];return this._getHeaderRows().each(function(){e.push(t._getRowIndex(D(this)))}),e},t.prototype._getPrimaryHeaderCells=function(t){return(t||this._getPrimaryHeaderRow()).find("th")},t.prototype._$getCells=function(t){var a=this;return D(t).add(t.cells).filter(function(){var t=D(this),e=t.parent(),n=t.is("[colspan]");
// no subrows or ignored rows (keep cells in ignored rows that do not have a colspan)
return!(e.is("["+a.attributes.subrow+"]")||e.is("["+a.attributes.ignorerow+"]")&&n)})},t.prototype._getVisibleColspan=function(){var e=0;return this._getPrimaryHeaderCells().each(function(){var t=D(this);"none"!==t.css("display")&&(e+=parseInt(t.attr("colspan"),10)||1)}),e},t.prototype.getColspanForCell=function(t){var e=this._getVisibleColspan(),n=0;
// console.log( $cell[ 0 ], visibleColspan, visibleSiblingColumns );
return t.closest("tr").data("tablesaw-rowspanned")&&n++,t.siblings().each(function(){var t=D(this),e=parseInt(t.attr("colspan"),10)||1;"none"!==t.css("display")&&(n+=e)}),e-n},t.prototype.isCellInColumn=function(t,e){return D(t).add(t.cells).filter(function(){return this===e}).length},t.prototype.updateColspanCells=function(a,s,i){var r=this,t=r._getPrimaryHeaderRow();
// find persistent column rowspans
this.$table.find("[rowspan][data-tablesaw-priority]").each(function(){var t=D(this);if("persist"===t.attr("data-tablesaw-priority")){var e=t.closest("tr"),n=parseInt(t.attr("rowspan"),10);1<n&&((e=e.next()).data("tablesaw-rowspanned",!0),n--)}}),this.$table.find("[colspan],[data-tablesaw-maxcolspan]").filter(function(){
// is not in primary header row
return D(this).closest("tr")[0]!==t[0]}).each(function(){var t=D(this);if(void 0===i||r.isCellInColumn(s,this)){var e=r.getColspanForCell(t);a&&void 0!==i&&
// console.log( colspan === 0 ? "addClass" : "removeClass", $cell );
t[0===e?"addClass":"removeClass"](a);
// cache original colspan
var n=parseInt(t.attr("data-tablesaw-maxcolspan"),10);n?n<e&&(e=n):t.attr("data-tablesaw-maxcolspan",t.attr("colspan")),
// console.log( this, "setting colspan to ", colspan );
t.attr("colspan",e)}})},t.prototype._findPrimaryHeadersForCell=function(t){for(var e=this._getPrimaryHeaderRow(),n=this._getRowIndex(e),a=[],s=0;s<this.headerMapping.length;s++)if(s!==n)for(var i=0;i<this.headerMapping[s].length;i++)this.headerMapping[s][i]===t&&a.push(this.headerMapping[n][i]);return a},
// used by init cells
t.prototype.getRows=function(){var t=this;return this.$table.find("tr").filter(function(){return D(this).closest("table").is(t.$table)})},
// used by sortable
t.prototype.getBodyRows=function(t){return(t?D(t):this.$tbody).children().filter("tr")},t.prototype.getHeaderCellIndex=function(t){for(var e=this.headerMapping[0],n=0;n<e.length;n++)if(e[n]===t)return n;return-1},t.prototype._initCells=function(){
// re-establish original colspans
this.$table.find("[data-tablesaw-maxcolspan]").each(function(){var t=D(this);t.attr("colspan",t.attr("data-tablesaw-maxcolspan"))});var t=this.getRows(),r=[];t.each(function(t){r[t]=[]}),t.each(function(s){var i=0;D(this).children().each(function(){
// set in a previous rowspan
for(var t=parseInt(this.getAttribute("data-tablesaw-maxcolspan")||this.getAttribute("colspan"),10),e=parseInt(this.getAttribute("rowspan"),10);r[s][i];)i++;
// TODO? both colspan and rowspan
if(r[s][i]=this,t)for(var n=0;n<t-1;n++)i++,r[s][i]=this;if(e)for(var a=1;a<e;a++)r[s+a][i]=this;i++})});for(var e=this._getHeaderRowIndeces(),n=0;n<r[0].length;n++)for(var a=0,s=e.length;a<s;a++){var i,o=r[e[a]][n],l=e[a];for(o.cells||(o.cells=[]);l<r.length;)o!==(i=r[l][n])&&o.cells.push(i),l++}this.headerMapping=r},t.prototype.refresh=function(){this._initCells(),this.$table.trigger(e.refresh,[this])},t.prototype._getToolbarAnchor=function(){var t=this.$table.parent();return t.is(".tablesaw-overflow")?t:this.$table},t.prototype._getToolbar=function(t){return(t=t||this._getToolbarAnchor()).prev().filter("."+a)},t.prototype.createToolbar=function(){
// Insert the toolbar
// TODO move this into a separate component
var t=this._getToolbarAnchor(),e=this._getToolbar(t);e.length||(e=D("<div>").addClass(a).insertBefore(t)),this.$toolbar=e,this.mode&&this.$toolbar.addClass("tablesaw-mode-"+this.mode)},t.prototype.destroy=function(){
// Don’t remove the toolbar, just erase the classes on it.
// Some of the table features are not yet destroy-friendly.
this._getToolbar().each(function(){this.className=this.className.replace(/\btablesaw-mode\-\w*\b/gi,"")});var t=this.$table.attr("id");D(A).off("."+t),D(S).off("."+t),
// other plugins
this.$table.trigger(e.destroy,[this]),this.$table.removeData(n)},
// Collection method.
D.fn[n]=function(){return this.each(function(){D(this).data(n)||new t(this)})};var i=D(A);i.on("enhance.tablesaw",function(t){
// Cut the mustard
if(R.mustard){var e=D(t.target);e.parent().length&&(e=e.parent()),e.find("table").filter("[data-tablesaw],[data-tablesaw-mode],[data-tablesaw-sortable]")[n]()}});
// Avoid a resize during scroll:
// Some Mobile devices trigger a resize during scroll (sometimes when
// doing elastic stretch at the end of the document or from the
// location bar hide)
var r,o,l=!1;i.on("scroll.tablesaw",function(){l=!0,S.clearTimeout(r),r=S.setTimeout(function(){l=!1},300)}),D(S).on("resize",function(){l||(S.clearTimeout(o),o=S.setTimeout(function(){i.trigger(e.resize)},150))}),R.Table=t}(),a="tablesaw-cell-label",s="tablesaw-cell-content",n=t="tablesaw-stack",i="data-tablesaw-no-labels",r="data-tablesaw-hide-empty",y.prototype.init=function(){if(this.$table.addClass(t),!this.labelless){var n=this;this.$table.find("th, td").filter(function(){return!D(this).closest("thead").length}).filter(function(){return!(D(this).is("["+i+"]")||D(this).closest("tr").is("["+i+"]")||n.hideempty&&!D(this).html())}).each(function(){var r=D(A.createElement("b")).addClass(a),t=D(this);D(n.tablesaw._findPrimaryHeadersForCell(this)).each(function(t){var e=D(this.cloneNode(!0)),n=e.find(".tablesaw-sortable-btn");
// TODO decouple from sortable better
// Changed from .text() in https://github.com/filamentgroup/tablesaw/commit/b9c12a8f893ec192830ec3ba2d75f062642f935b
// to preserve structural html in headers, like <a>
e.find(".tablesaw-sortable-arrow").remove();
// TODO decouple from checkall better
var a=e.find("[data-tablesaw-checkall]");if(a.closest("label").remove(),a.length)r=D([]);else{0<t&&r.append(A.createTextNode(", "));for(var s,i=n.length?n[0]:e[0];s=i.firstChild;)r[0].appendChild(s)}}),r.length&&!t.find("."+s).length&&t.wrapInner("<span class='"+s+"'></span>");
// Update if already exists.
var e=t.find("."+a);e.length?
// only if changed
e.replaceWith(r):(t.prepend(A.createTextNode(" ")),t.prepend(r))})}},y.prototype.destroy=function(){this.$table.removeClass(t),this.$table.find("."+a).remove(),this.$table.find("."+s).each(function(){D(this).replaceWith(D(this.childNodes))})},
// on tablecreate, init
D(A).on(R.events.create,function(t,e){"stack"===e.mode&&new y(e.table,e).init()}).on(R.events.refresh,function(t,e){"stack"===e.mode&&D(e.table).data(n).init()}).on(R.events.destroy,function(t,e){"stack"===e.mode&&D(e.table).data(n).destroy()}),R.Stack=y,o="tablesawbtn",l={_create:function(){return D(this).each(function(){D(this).trigger("beforecreate."+o)[o]("_init").trigger("create."+o)})},_init:function(){var t=D(this),e=this.getElementsByTagName("select")[0];return e&&
// TODO next major version: remove .btn-select
D(this).addClass("btn-select tablesaw-btn-select")[o]("_select",e),t},_select:function(t){function e(t,e){var n,a,s=D(e).find("option"),i=A.createElement("span"),r=!1;if(i.setAttribute("aria-hidden","true"),i.innerHTML="&#160;",s.each(function(){this.selected&&(i.innerHTML=this.text)}),a=t.childNodes,0<s.length){for(var o=0,l=a.length;o<l;o++)(n=a[o])&&"SPAN"===n.nodeName.toUpperCase()&&(t.replaceChild(i,n),r=!0);r||t.insertBefore(i,t.firstChild)}}e(this,t),
// todo should this be tablesawrefresh?
D(this).on("change refresh",function(){e(this,t)})}},
// Collection method.
D.fn[o]=function(t,e,n,a){return this.each(function(){
// if it's a method
return t&&"string"==typeof t?D.fn[o].prototype[t].call(this,e,n,a):
// don't re-init
D(this).data(o+"active")?D(this):(D(this).data(o+"active",!0),void D.fn[o].prototype._create.call(this))})},
// add methods
D.extend(D.fn[o].prototype,l),g="tablesaw-coltoggle",
// Column Toggle Sets (one column chooser can control multiple tables)
T.prototype.initSet=function(){var t=this.$table.attr(this.attributes.set);if(t){
// Should not include the current table
var e=this.$table[0];this.set=D("table["+this.attributes.set+"='"+t+"']").filter(function(){return this!==e}).get()}},T.prototype.init=function(){if(this.$table.length){var e,t,n,a,s,i,r=this,o=this.tablesaw.getConfig({getColumnToggleLabelTemplate:function(t){return"<label><input type='checkbox' checked>"+t+"</label>"}});this.$table.addClass(this.classes.columnToggleTable),t=(e=this.$table.attr("id"))+"-popup",i=D("<div class='"+this.classes.columnBtnContain+"'></div>"),
// TODO next major version: remove .btn
n=D("<a href='#"+t+"' class='btn tablesaw-btn btn-micro "+this.classes.columnBtn+"' data-popup-link><span>"+R.i18n.columnToggleButton+"</span></a>"),a=D("<div class='"+this.classes.popup+"' id='"+t+"'></div>"),s=D("<div class='tablesaw-btn-group'></div>"),this.$popup=a;var l=!1;this.$headers.each(function(){var t=D(this),e=t.attr("data-tablesaw-priority"),n=r.tablesaw._$getCells(this);e&&"persist"!==e&&(n.addClass(r.classes.priorityPrefix+e),D(o.getColumnToggleLabelTemplate(t.text())).appendTo(s).find('input[type="checkbox"]').data("tablesaw-header",this),l=!0)}),l||s.append("<label>"+R.i18n.columnToggleError+"</label>"),s.appendTo(a),
// bind change event listeners to inputs - TODO: move to a private method?
s.find('input[type="checkbox"]').on("change",function(e){var n;f(e.target),r.set.length&&(D(r.$popup).find("input[type='checkbox']").each(function(t){if(this===e.target)return n=t,!1}),D(r.set).each(function(){var t=D(this).data(g).$popup.find("input[type='checkbox']").get(n);t&&(t.checked=e.target.checked,f(t))}))}),n.appendTo(i);
// Use a different target than the toolbar
var c,h=D(this.$table.attr(this.attributes.btnTarget));i.appendTo(h.length?h:this.tablesaw.$toolbar),n.on("click.tablesaw",function(t){t.preventDefault(),i.is(".visible")?p():(i.addClass("visible"),n.removeClass("down").addClass("up"),D(A).off("click."+e,p),S.clearTimeout(c),c=S.setTimeout(function(){D(A).on("click."+e,p)},15))}),a.appendTo(i),this.$menu=s;
// Fix for iOS not rendering shadows correctly when using `-webkit-overflow-scrolling`
var u,d=this.$table.closest(".tablesaw-overflow");d.css("-webkit-overflow-scrolling")&&d.on("scroll",function(){var t=D(this);S.clearTimeout(u),u=S.setTimeout(function(){t.css("-webkit-overflow-scrolling","auto"),S.setTimeout(function(){t.css("-webkit-overflow-scrolling","touch")},0)},100)}),D(S).on(R.events.resize+"."+e,function(){r.refreshToggle()}),this.initSet(),this.refreshToggle()}function f(t){var e=t.checked,n=r.getHeaderFromCheckbox(t),a=r.tablesaw._$getCells(n);a[e?"removeClass":"addClass"]("tablesaw-toggle-cellhidden"),a[e?"addClass":"removeClass"]("tablesaw-toggle-cellvisible"),r.updateColspanCells(n,e),r.$table.trigger("tablesawcolumns")}function p(t){
// Click came from inside the popup, ignore.
t&&D(t.target).closest("."+r.classes.popup).length||(D(A).off("click."+e),n.removeClass("up").addClass("down"),i.removeClass("visible"))}},T.prototype.getHeaderFromCheckbox=function(t){return D(t).data("tablesaw-header")},T.prototype.refreshToggle=function(){var e=this;this.$menu.find("input").each(function(){var t=e.getHeaderFromCheckbox(this);this.checked="table-cell"===e.tablesaw._$getCells(t).eq(0).css("display")}),this.updateColspanCells()},T.prototype.updateColspanCells=function(t,e){this.tablesaw.updateColspanCells("tablesaw-toggle-cellhidden",t,e)},T.prototype.destroy=function(){this.$table.removeClass(this.classes.columnToggleTable),this.$table.find("th, td").each(function(){D(this).removeClass("tablesaw-toggle-cellhidden").removeClass("tablesaw-toggle-cellvisible"),this.className=this.className.replace(/\bui\-table\-priority\-\d\b/g,"")})},
// on tablecreate, init
D(A).on(R.events.create,function(t,e){"columntoggle"===e.mode&&new T(e.table).init()}),D(A).on(R.events.destroy,function(t,e){"columntoggle"===e.mode&&D(e.table).data(g).destroy()}),D(A).on(R.events.refresh,function(t,e){"columntoggle"===e.mode&&D(e.table).data(g).refreshToggle()}),R.ColumnToggle=T,h="data-tablesaw-sortable-col",d="data-tablesaw-sortable-default-col",p="data-tablesaw-sortable-numeric",b="data-tablesaw-subrow",v="data-tablesaw-ignorerow",f={head:(u="tablesaw-sortable")+"-head",ascend:u+"-ascending",descend:u+"-descending",switcher:u+"-switch",tableToolbar:"tablesaw-bar-section",sortButton:u+"-btn"},c={_create:function(t){return D(this).each(function(){if(D(this).data(u+"-init"))return!1;D(this).data(u+"-init",!0).trigger("beforecreate."+u)[u]("_init",t).trigger("create."+u)})},_init:function(){var s,i,t,e,a,n,r=D(this),l=r.data("tablesaw");function c(t){D.each(t,function(t,e){var n=D(e);n.removeAttr(d),n.removeClass(f.ascend),n.removeClass(f.descend)})}r.addClass(u),s=r.children().filter("thead").find("th["+h+"]"),t=s,D.each(t,function(t,e){D(e).addClass(f.head)}),e=s,a=function(t){if(!D(t.target).is("a[href]")){t.stopPropagation();var e=D(t.target).closest("["+h+"]"),n=t.data.col,a=s.index(e[0]);c(e.closest("thead").find("th").filter(function(){return this!==e[0]})),e.is("."+f.descend)||!e.is("."+f.ascend)?(r[u]("sortBy",n,!0),a+="_asc"):(r[u]("sortBy",n),a+="_desc"),i&&i.find("select").val(a).trigger("refresh"),t.preventDefault()}},D.each(e,function(t,e){var n=D("<button class='"+f.sortButton+"'/>");n.on("click",{col:e},a),D(e).wrapInner(n).find("button").append("<span class='tablesaw-sortable-arrow'>")}),n=s,D.each(n,function(t,e){var n=D(e);n.is("["+d+"]")&&(n.is("."+f.descend)||n.addClass(f.ascend))}),r.is("[data-tablesaw-sortable-switch]")&&function(n){i=D("<div>").addClass(f.switcher).addClass(f.tableToolbar);var o=["<label>"+R.i18n.sort+":"];
// TODO next major version: remove .btn
o.push('<span class="btn tablesaw-btn"><select>'),n.each(function(t){var e=D(this),n=e.is("["+d+"]"),a=e.is("."+f.descend),s=e.is("["+p+"]"),i=0;D(this.cells.slice(0,5)).each(function(){isNaN(parseInt($(this),10))||i++});var r=5===i;s||e.attr(p,r?"":"false"),o.push("<option"+(n&&!a?" selected":"")+' value="'+t+'_asc">'+e.text()+" "+(r?"&#x2191;":"(A-Z)")+"</option>"),o.push("<option"+(n&&a?" selected":"")+' value="'+t+'_desc">'+e.text()+" "+(r?"&#x2193;":"(Z-A)")+"</option>")}),o.push("</select></span></label>"),i.html(o.join(""));var t=l.$toolbar.children().eq(0);t.length?i.insertBefore(t):i.appendTo(l.$toolbar),i.find(".tablesaw-btn").tablesawbtn(),i.find("select").on("change",function(){var t=D(this).val().split("_"),e=n.eq(t[0]);c(e.siblings()),r[u]("sortBy",e.get(0),"asc"===t[1])})}(s)},sortRows:function(t,e,n,a,s){var i,r,o,l,c,h,u,d=(r=a.cells,o=s,l=[],D.each(r,function(t,e){for(var n=e.parentNode,a=D(n),s=[],i=a.next();i.is("["+b+"]");)s.push(i[0]),i=i.next();var r=n.parentNode;
// current row is a subrow
a.is("["+b+"]")||r===o&&l.push({element:e,cell:$(e),row:n,subrows:s.length?s:null,ignored:a.is("["+v+"]")})}),l),f=D(a).data("tablesaw-sort");return i=!(!f||"function"!=typeof f)&&f(n)||(c=n,h=D(a).is("["+p+"]")&&!D(a).is("["+p+'="false"]'),u=/[^\-\+\d\.]/g,c?function(t,e){return t.ignored||e.ignored?0:h?parseFloat(t.cell.replace(u,""))-parseFloat(e.cell.replace(u,"")):t.cell.toLowerCase()>e.cell.toLowerCase()?1:-1}:function(t,e){return t.ignored||e.ignored?0:h?parseFloat(e.cell.replace(u,""))-parseFloat(t.cell.replace(u,"")):t.cell.toLowerCase()<e.cell.toLowerCase()?1:-1}),function(t){var e,n,a=[];for(e=0,n=t.length;e<n;e++)a.push(t[e].row),t[e].subrows&&a.push(t[e].subrows);return a}(d.sort(i))},makeColDefault:function(t,e){var n=D(t);n.attr(d,"true"),e?(n.removeClass(f.descend),n.addClass(f.ascend)):(n.removeClass(f.ascend),n.addClass(f.descend))},sortBy:function(r,o){var l,c=D(this),h=c.data("tablesaw");h.$tbody.each(function(){var t,e,n,a=D(this),s=h.getBodyRows(this),i=h.headerMapping[0];
// find the column number that we’re sorting
for(e=0,n=i.length;e<n;e++)if(i[e]===r){l=e;break}
// replace Table rows
for(e=0,n=(t=c[u]("sortRows",s,l,o,r,this)).length;e<n;e++)a.append(t[e])}),c[u]("makeColDefault",r,o),c.trigger("tablesaw-sorted")}},
// Collection method.
D.fn[u]=function(t){var e,n=Array.prototype.slice.call(arguments,1);
// if it's a method
return t&&"string"==typeof t?void 0!==(e=D.fn[u].prototype[t].apply(this[0],n))?e:D(this):(
// check init
D(this).data(u+"-active")||(D(this).data(u+"-active",!0),D.fn[u].prototype._create.call(this,t)),D(this))},
// add methods
D.extend(D.fn[u].prototype,c),D(A).on(R.events.create,function(t,e){e.$table.is("table[data-tablesaw-sortable]")&&e.$table[u]()}),M="disabled",L="tablesaw-fix-persist",H="tablesaw-swipe-cellhidden",P="tablesaw-swipe-cellpersist",B="tablesaw-all-cols-visible",I="data-tablesaw-no-touch",D(A).on(R.events.create,function(t,e){"swipe"===e.mode&&k(e,e.$table)}),w={attr:{init:"data-tablesaw-minimap"},show:function(t){var e=t.getAttribute(w.attr.init);return""===e||!!(e&&"matchMedia"in S)&&S.matchMedia(e).matches}},
// on tablecreate, init
D(A).on(R.events.create,function(t,e){"swipe"!==e.mode&&"columntoggle"!==e.mode||!e.$table.is("[ "+w.attr.init+"]")||function(t){var e=t.data("tablesaw"),n=D('<div class="tablesaw-advance minimap">'),a=D('<ul class="tablesaw-advance-dots">').appendTo(n),s="tablesaw-advance-dots-hide";function i(){if(w.show(t[0])){n.css("display","block");
// show/hide dots
var e=a.find("li").removeClass(s);t.find("thead th").each(function(t){"none"===D(this).css("display")&&e.eq(t).addClass(s)})}else n.css("display","none")}
// run on init and resize
// populate dots
t.data("tablesaw")._getPrimaryHeaderCells().each(function(){a.append("<li><i></i></li>")}),n.appendTo(e.$toolbar),i(),D(S).on(R.events.resize,i),t.on("tablesawcolumns.minimap",function(){i()}).on(R.events.destroy+".minimap",function(){var t=D(this);e.$toolbar.find(".tablesaw-advance").remove(),D(S).off(R.events.resize,i),t.off(".minimap")})}(e.$table)}),
// TODO OOP this better
R.MiniMap=w,m={selectors:{init:"table[data-tablesaw-mode-switch]"},attributes:{excludeMode:"data-tablesaw-mode-exclude"},classes:{main:"tablesaw-modeswitch",toolbar:"tablesaw-bar-section"},modes:["stack","swipe","columntoggle"],init:function(e){var t,n=D(e),a=n.data("tablesaw"),s=n.attr(m.attributes.excludeMode),i=a.$toolbar,r=D("<div>").addClass(m.classes.main+" "+m.classes.toolbar),o=['<label><span class="abbreviated">'+R.i18n.modeSwitchColumnsAbbreviated+'</span><span class="longform">'+R.i18n.modeSwitchColumns+"</span>:"],l=n.attr("data-tablesaw-mode");
// TODO next major version: remove .btn
o.push('<span class="btn tablesaw-btn"><select>');for(var c=0,h=m.modes.length;c<h;c++)s&&s.toLowerCase()===m.modes[c]||(t=l===m.modes[c],o.push("<option"+(t?" selected":"")+' value="'+m.modes[c]+'">'+R.i18n.modes[c]+"</option>"));o.push("</select></span></label>"),r.html(o.join(""));var u=i.find(".tablesaw-advance").eq(0);u.length?r.insertBefore(u):r.appendTo(i),r.find(".tablesaw-btn").tablesawbtn(),r.find("select").on("change",function(t){return m.onModeChange.call(e,t,D(this).val())})},onModeChange:function(t,e){var n=D(this),a=n.data("tablesaw");a.$toolbar.find("."+m.classes.main).remove(),a.destroy(),n.attr("data-tablesaw-mode",e),n.tablesaw()}},D(A).on(R.events.create,function(t,e){e.$table.is(m.selectors.init)&&m.init(e.table)}),C="tablesawCheckAll",x.prototype._filterCells=function(t){return t.filter(function(){return!D(this).closest("tr").is("[data-tablesaw-subrow],[data-tablesaw-ignorerow]")}).find(this.checkboxSelector).not(this.checkAllSelector)},
// With buttons you can use a scoping selector like: data-tablesaw-checkall="#my-scoped-id input[type='checkbox']"
x.prototype.getCheckboxesForButton=function(t){return this._filterCells(D(D(t).attr(this.attr)))},x.prototype.getCheckboxesForCheckbox=function(t){return this._filterCells(D(D(t).closest("th")[0].cells))},x.prototype.init=function(){var t=this;this.$table.find(this.checkAllSelector).each(function(){D(this).is(t.checkboxSelector)?t.addCheckboxEvents(this):t.addButtonEvents(this)})},x.prototype.addButtonEvents=function(t){var s=this;
// Update body checkboxes when header checkbox is changed
D(t).on("click",function(t){t.preventDefault();var e,n=s.getCheckboxesForButton(this),a=!0;n.each(function(){this.checked||(a=!1)}),e=!!D(this).is(s.forceCheckedSelector)||!D(this).is(s.forceUncheckedSelector)&&!a,n.each(function(){this.checked=e,D(this).trigger("change."+C)})})},x.prototype.addCheckboxEvents=function(n){var e=this;
// Update body checkboxes when header checkbox is changed
D(n).on("change",function(){var t=this.checked;e.getCheckboxesForCheckbox(this).each(function(){this.checked=t})});var a=e.getCheckboxesForCheckbox(n);
// Update header checkbox when body checkboxes are changed
a.on("change."+C,function(){var t=0;a.each(function(){this.checked&&t++});var e=t===a.length;n.checked=e,
// only indeterminate if some are selected (not all and not none)
n.indeterminate=0!==t&&!e})},
// on tablecreate, init
D(A).on(R.events.create,function(t,e){new x(e)}),R.CheckAll=x,R});