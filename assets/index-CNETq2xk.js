const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PublishedView-DbKmrlyZ.js","./DocsPanel-CBpdBFal.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();function Wu(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Hu={exports:{}},ri={},Uu={exports:{}},X={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Oo=Symbol.for("react.element"),Ch=Symbol.for("react.portal"),jh=Symbol.for("react.fragment"),Th=Symbol.for("react.strict_mode"),Mh=Symbol.for("react.profiler"),bh=Symbol.for("react.provider"),Nh=Symbol.for("react.context"),Ph=Symbol.for("react.forward_ref"),Ah=Symbol.for("react.suspense"),zh=Symbol.for("react.memo"),Lh=Symbol.for("react.lazy"),gc=Symbol.iterator;function Ih(e){return e===null||typeof e!="object"?null:(e=gc&&e[gc]||e["@@iterator"],typeof e=="function"?e:null)}var Ku={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Zu=Object.assign,Gu={};function $r(e,t,n){this.props=e,this.context=t,this.refs=Gu,this.updater=n||Ku}$r.prototype.isReactComponent={};$r.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};$r.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Qu(){}Qu.prototype=$r.prototype;function rl(e,t,n){this.props=e,this.context=t,this.refs=Gu,this.updater=n||Ku}var ol=rl.prototype=new Qu;ol.constructor=rl;Zu(ol,$r.prototype);ol.isPureReactComponent=!0;var yc=Array.isArray,Yu=Object.prototype.hasOwnProperty,sl={current:null},Xu={key:!0,ref:!0,__self:!0,__source:!0};function qu(e,t,n){var r,o={},s=null,i=null;if(t!=null)for(r in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(s=""+t.key),t)Yu.call(t,r)&&!Xu.hasOwnProperty(r)&&(o[r]=t[r]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var a=Array(l),d=0;d<l;d++)a[d]=arguments[d+2];o.children=a}if(e&&e.defaultProps)for(r in l=e.defaultProps,l)o[r]===void 0&&(o[r]=l[r]);return{$$typeof:Oo,type:e,key:s,ref:i,props:o,_owner:sl.current}}function Dh(e,t){return{$$typeof:Oo,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function il(e){return typeof e=="object"&&e!==null&&e.$$typeof===Oo}function _h(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var vc=/\/+/g;function Si(e,t){return typeof e=="object"&&e!==null&&e.key!=null?_h(""+e.key):t.toString(36)}function ms(e,t,n,r,o){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(s){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case Oo:case Ch:i=!0}}if(i)return i=e,o=o(i),e=r===""?"."+Si(i,0):r,yc(o)?(n="",e!=null&&(n=e.replace(vc,"$&/")+"/"),ms(o,t,n,"",function(d){return d})):o!=null&&(il(o)&&(o=Dh(o,n+(!o.key||i&&i.key===o.key?"":(""+o.key).replace(vc,"$&/")+"/")+e)),t.push(o)),1;if(i=0,r=r===""?".":r+":",yc(e))for(var l=0;l<e.length;l++){s=e[l];var a=r+Si(s,l);i+=ms(s,t,n,a,o)}else if(a=Ih(e),typeof a=="function")for(e=a.call(e),l=0;!(s=e.next()).done;)s=s.value,a=r+Si(s,l++),i+=ms(s,t,n,a,o);else if(s==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function Yo(e,t,n){if(e==null)return e;var r=[],o=0;return ms(e,r,"","",function(s){return t.call(n,s,o++)}),r}function Rh(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var qe={current:null},gs={transition:null},Oh={ReactCurrentDispatcher:qe,ReactCurrentBatchConfig:gs,ReactCurrentOwner:sl};function Ju(){throw Error("act(...) is not supported in production builds of React.")}X.Children={map:Yo,forEach:function(e,t,n){Yo(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Yo(e,function(){t++}),t},toArray:function(e){return Yo(e,function(t){return t})||[]},only:function(e){if(!il(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};X.Component=$r;X.Fragment=jh;X.Profiler=Mh;X.PureComponent=rl;X.StrictMode=Th;X.Suspense=Ah;X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Oh;X.act=Ju;X.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Zu({},e.props),o=e.key,s=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(s=t.ref,i=sl.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(a in t)Yu.call(t,a)&&!Xu.hasOwnProperty(a)&&(r[a]=t[a]===void 0&&l!==void 0?l[a]:t[a])}var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){l=Array(a);for(var d=0;d<a;d++)l[d]=arguments[d+2];r.children=l}return{$$typeof:Oo,type:e.type,key:o,ref:s,props:r,_owner:i}};X.createContext=function(e){return e={$$typeof:Nh,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:bh,_context:e},e.Consumer=e};X.createElement=qu;X.createFactory=function(e){var t=qu.bind(null,e);return t.type=e,t};X.createRef=function(){return{current:null}};X.forwardRef=function(e){return{$$typeof:Ph,render:e}};X.isValidElement=il;X.lazy=function(e){return{$$typeof:Lh,_payload:{_status:-1,_result:e},_init:Rh}};X.memo=function(e,t){return{$$typeof:zh,type:e,compare:t===void 0?null:t}};X.startTransition=function(e){var t=gs.transition;gs.transition={};try{e()}finally{gs.transition=t}};X.unstable_act=Ju;X.useCallback=function(e,t){return qe.current.useCallback(e,t)};X.useContext=function(e){return qe.current.useContext(e)};X.useDebugValue=function(){};X.useDeferredValue=function(e){return qe.current.useDeferredValue(e)};X.useEffect=function(e,t){return qe.current.useEffect(e,t)};X.useId=function(){return qe.current.useId()};X.useImperativeHandle=function(e,t,n){return qe.current.useImperativeHandle(e,t,n)};X.useInsertionEffect=function(e,t){return qe.current.useInsertionEffect(e,t)};X.useLayoutEffect=function(e,t){return qe.current.useLayoutEffect(e,t)};X.useMemo=function(e,t){return qe.current.useMemo(e,t)};X.useReducer=function(e,t,n){return qe.current.useReducer(e,t,n)};X.useRef=function(e){return qe.current.useRef(e)};X.useState=function(e){return qe.current.useState(e)};X.useSyncExternalStore=function(e,t,n){return qe.current.useSyncExternalStore(e,t,n)};X.useTransition=function(){return qe.current.useTransition()};X.version="18.3.1";Uu.exports=X;var N=Uu.exports;const Cy=Wu(N);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $h=N,Fh=Symbol.for("react.element"),Bh=Symbol.for("react.fragment"),Vh=Object.prototype.hasOwnProperty,Wh=$h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Hh={key:!0,ref:!0,__self:!0,__source:!0};function ed(e,t,n){var r,o={},s=null,i=null;n!==void 0&&(s=""+n),t.key!==void 0&&(s=""+t.key),t.ref!==void 0&&(i=t.ref);for(r in t)Vh.call(t,r)&&!Hh.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)o[r]===void 0&&(o[r]=t[r]);return{$$typeof:Fh,type:e,key:s,ref:i,props:o,_owner:Wh.current}}ri.Fragment=Bh;ri.jsx=ed;ri.jsxs=ed;Hu.exports=ri;var c=Hu.exports,td={exports:{}},gt={},nd={exports:{}},rd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(I,W){var K=I.length;I.push(W);e:for(;0<K;){var ae=K-1>>>1,se=I[ae];if(0<o(se,W))I[ae]=W,I[K]=se,K=ae;else break e}}function n(I){return I.length===0?null:I[0]}function r(I){if(I.length===0)return null;var W=I[0],K=I.pop();if(K!==W){I[0]=K;e:for(var ae=0,se=I.length,dn=se>>>1;ae<dn;){var et=2*(ae+1)-1,Tt=I[et],tt=et+1,he=I[tt];if(0>o(Tt,K))tt<se&&0>o(he,Tt)?(I[ae]=he,I[tt]=K,ae=tt):(I[ae]=Tt,I[et]=K,ae=et);else if(tt<se&&0>o(he,K))I[ae]=he,I[tt]=K,ae=tt;else break e}}return W}function o(I,W){var K=I.sortIndex-W.sortIndex;return K!==0?K:I.id-W.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var i=Date,l=i.now();e.unstable_now=function(){return i.now()-l}}var a=[],d=[],f=1,m=null,h=3,k=!1,g=!1,x=!1,P=typeof setTimeout=="function"?setTimeout:null,y=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function v(I){for(var W=n(d);W!==null;){if(W.callback===null)r(d);else if(W.startTime<=I)r(d),W.sortIndex=W.expirationTime,t(a,W);else break;W=n(d)}}function C(I){if(x=!1,v(I),!g)if(n(a)!==null)g=!0,Fe(z);else{var W=n(d);W!==null&&ct(C,W.startTime-I)}}function z(I,W){g=!1,x&&(x=!1,y(B),B=-1),k=!0;var K=h;try{for(v(W),m=n(a);m!==null&&(!(m.expirationTime>W)||I&&!Ge());){var ae=m.callback;if(typeof ae=="function"){m.callback=null,h=m.priorityLevel;var se=ae(m.expirationTime<=W);W=e.unstable_now(),typeof se=="function"?m.callback=se:m===n(a)&&r(a),v(W)}else r(a);m=n(a)}if(m!==null)var dn=!0;else{var et=n(d);et!==null&&ct(C,et.startTime-W),dn=!1}return dn}finally{m=null,h=K,k=!1}}var D=!1,L=null,B=-1,ce=5,U=-1;function Ge(){return!(e.unstable_now()-U<ce)}function lt(){if(L!==null){var I=e.unstable_now();U=I;var W=!0;try{W=L(!0,I)}finally{W?Me():(D=!1,L=null)}}else D=!1}var Me;if(typeof u=="function")Me=function(){u(lt)};else if(typeof MessageChannel<"u"){var Ut=new MessageChannel,ue=Ut.port2;Ut.port1.onmessage=lt,Me=function(){ue.postMessage(null)}}else Me=function(){P(lt,0)};function Fe(I){L=I,D||(D=!0,Me())}function ct(I,W){B=P(function(){I(e.unstable_now())},W)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(I){I.callback=null},e.unstable_continueExecution=function(){g||k||(g=!0,Fe(z))},e.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ce=0<I?Math.floor(1e3/I):5},e.unstable_getCurrentPriorityLevel=function(){return h},e.unstable_getFirstCallbackNode=function(){return n(a)},e.unstable_next=function(I){switch(h){case 1:case 2:case 3:var W=3;break;default:W=h}var K=h;h=W;try{return I()}finally{h=K}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(I,W){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var K=h;h=I;try{return W()}finally{h=K}},e.unstable_scheduleCallback=function(I,W,K){var ae=e.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?ae+K:ae):K=ae,I){case 1:var se=-1;break;case 2:se=250;break;case 5:se=1073741823;break;case 4:se=1e4;break;default:se=5e3}return se=K+se,I={id:f++,callback:W,priorityLevel:I,startTime:K,expirationTime:se,sortIndex:-1},K>ae?(I.sortIndex=K,t(d,I),n(a)===null&&I===n(d)&&(x?(y(B),B=-1):x=!0,ct(C,K-ae))):(I.sortIndex=se,t(a,I),g||k||(g=!0,Fe(z))),I},e.unstable_shouldYield=Ge,e.unstable_wrapCallback=function(I){var W=h;return function(){var K=h;h=W;try{return I.apply(this,arguments)}finally{h=K}}}})(rd);nd.exports=rd;var Uh=nd.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Kh=N,mt=Uh;function M(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var od=new Set,yo={};function tr(e,t){zr(e,t),zr(e+"Capture",t)}function zr(e,t){for(yo[e]=t,e=0;e<t.length;e++)od.add(t[e])}var on=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ra=Object.prototype.hasOwnProperty,Zh=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,wc={},xc={};function Gh(e){return ra.call(xc,e)?!0:ra.call(wc,e)?!1:Zh.test(e)?xc[e]=!0:(wc[e]=!0,!1)}function Qh(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Yh(e,t,n,r){if(t===null||typeof t>"u"||Qh(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Je(e,t,n,r,o,s,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=s,this.removeEmptyString=i}var $e={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){$e[e]=new Je(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];$e[t]=new Je(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){$e[e]=new Je(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){$e[e]=new Je(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){$e[e]=new Je(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){$e[e]=new Je(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){$e[e]=new Je(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){$e[e]=new Je(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){$e[e]=new Je(e,5,!1,e.toLowerCase(),null,!1,!1)});var al=/[\-:]([a-z])/g;function ll(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(al,ll);$e[t]=new Je(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(al,ll);$e[t]=new Je(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(al,ll);$e[t]=new Je(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){$e[e]=new Je(e,1,!1,e.toLowerCase(),null,!1,!1)});$e.xlinkHref=new Je("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){$e[e]=new Je(e,1,!1,e.toLowerCase(),null,!0,!0)});function cl(e,t,n,r){var o=$e.hasOwnProperty(t)?$e[t]:null;(o!==null?o.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Yh(t,n,o,r)&&(n=null),r||o===null?Gh(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,r=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var un=Kh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Xo=Symbol.for("react.element"),lr=Symbol.for("react.portal"),cr=Symbol.for("react.fragment"),ul=Symbol.for("react.strict_mode"),oa=Symbol.for("react.profiler"),sd=Symbol.for("react.provider"),id=Symbol.for("react.context"),dl=Symbol.for("react.forward_ref"),sa=Symbol.for("react.suspense"),ia=Symbol.for("react.suspense_list"),fl=Symbol.for("react.memo"),yn=Symbol.for("react.lazy"),ad=Symbol.for("react.offscreen"),kc=Symbol.iterator;function Gr(e){return e===null||typeof e!="object"?null:(e=kc&&e[kc]||e["@@iterator"],typeof e=="function"?e:null)}var Se=Object.assign,Ei;function ro(e){if(Ei===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ei=t&&t[1]||""}return`
`+Ei+e}var Ci=!1;function ji(e,t){if(!e||Ci)return"";Ci=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var r=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){r=d}e.call(t.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var o=d.stack.split(`
`),s=r.stack.split(`
`),i=o.length-1,l=s.length-1;1<=i&&0<=l&&o[i]!==s[l];)l--;for(;1<=i&&0<=l;i--,l--)if(o[i]!==s[l]){if(i!==1||l!==1)do if(i--,l--,0>l||o[i]!==s[l]){var a=`
`+o[i].replace(" at new "," at ");return e.displayName&&a.includes("<anonymous>")&&(a=a.replace("<anonymous>",e.displayName)),a}while(1<=i&&0<=l);break}}}finally{Ci=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?ro(e):""}function Xh(e){switch(e.tag){case 5:return ro(e.type);case 16:return ro("Lazy");case 13:return ro("Suspense");case 19:return ro("SuspenseList");case 0:case 2:case 15:return e=ji(e.type,!1),e;case 11:return e=ji(e.type.render,!1),e;case 1:return e=ji(e.type,!0),e;default:return""}}function aa(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case cr:return"Fragment";case lr:return"Portal";case oa:return"Profiler";case ul:return"StrictMode";case sa:return"Suspense";case ia:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case id:return(e.displayName||"Context")+".Consumer";case sd:return(e._context.displayName||"Context")+".Provider";case dl:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case fl:return t=e.displayName||null,t!==null?t:aa(e.type)||"Memo";case yn:t=e._payload,e=e._init;try{return aa(e(t))}catch{}}return null}function qh(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return aa(t);case 8:return t===ul?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function zn(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ld(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Jh(e){var t=ld(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,s=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(i){r=""+i,s.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function qo(e){e._valueTracker||(e._valueTracker=Jh(e))}function cd(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=ld(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Ns(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function la(e,t){var n=t.checked;return Se({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Sc(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=zn(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ud(e,t){t=t.checked,t!=null&&cl(e,"checked",t,!1)}function ca(e,t){ud(e,t);var n=zn(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?ua(e,t.type,n):t.hasOwnProperty("defaultValue")&&ua(e,t.type,zn(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ec(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function ua(e,t,n){(t!=="number"||Ns(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var oo=Array.isArray;function Cr(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+zn(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,r&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function da(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(M(91));return Se({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Cc(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(M(92));if(oo(n)){if(1<n.length)throw Error(M(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:zn(n)}}function dd(e,t){var n=zn(t.value),r=zn(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function jc(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function fd(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function fa(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?fd(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Jo,hd=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Jo=Jo||document.createElement("div"),Jo.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Jo.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function vo(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var ao={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ep=["Webkit","ms","Moz","O"];Object.keys(ao).forEach(function(e){ep.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),ao[t]=ao[e]})});function pd(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||ao.hasOwnProperty(e)&&ao[e]?(""+t).trim():t+"px"}function md(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,o=pd(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}var tp=Se({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ha(e,t){if(t){if(tp[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(M(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(M(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(M(61))}if(t.style!=null&&typeof t.style!="object")throw Error(M(62))}}function pa(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ma=null;function hl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ga=null,jr=null,Tr=null;function Tc(e){if(e=Bo(e)){if(typeof ga!="function")throw Error(M(280));var t=e.stateNode;t&&(t=li(t),ga(e.stateNode,e.type,t))}}function gd(e){jr?Tr?Tr.push(e):Tr=[e]:jr=e}function yd(){if(jr){var e=jr,t=Tr;if(Tr=jr=null,Tc(e),t)for(e=0;e<t.length;e++)Tc(t[e])}}function vd(e,t){return e(t)}function wd(){}var Ti=!1;function xd(e,t,n){if(Ti)return e(t,n);Ti=!0;try{return vd(e,t,n)}finally{Ti=!1,(jr!==null||Tr!==null)&&(wd(),yd())}}function wo(e,t){var n=e.stateNode;if(n===null)return null;var r=li(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(M(231,t,typeof n));return n}var ya=!1;if(on)try{var Qr={};Object.defineProperty(Qr,"passive",{get:function(){ya=!0}}),window.addEventListener("test",Qr,Qr),window.removeEventListener("test",Qr,Qr)}catch{ya=!1}function np(e,t,n,r,o,s,i,l,a){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(f){this.onError(f)}}var lo=!1,Ps=null,As=!1,va=null,rp={onError:function(e){lo=!0,Ps=e}};function op(e,t,n,r,o,s,i,l,a){lo=!1,Ps=null,np.apply(rp,arguments)}function sp(e,t,n,r,o,s,i,l,a){if(op.apply(this,arguments),lo){if(lo){var d=Ps;lo=!1,Ps=null}else throw Error(M(198));As||(As=!0,va=d)}}function nr(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function kd(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Mc(e){if(nr(e)!==e)throw Error(M(188))}function ip(e){var t=e.alternate;if(!t){if(t=nr(e),t===null)throw Error(M(188));return t!==e?null:e}for(var n=e,r=t;;){var o=n.return;if(o===null)break;var s=o.alternate;if(s===null){if(r=o.return,r!==null){n=r;continue}break}if(o.child===s.child){for(s=o.child;s;){if(s===n)return Mc(o),e;if(s===r)return Mc(o),t;s=s.sibling}throw Error(M(188))}if(n.return!==r.return)n=o,r=s;else{for(var i=!1,l=o.child;l;){if(l===n){i=!0,n=o,r=s;break}if(l===r){i=!0,r=o,n=s;break}l=l.sibling}if(!i){for(l=s.child;l;){if(l===n){i=!0,n=s,r=o;break}if(l===r){i=!0,r=s,n=o;break}l=l.sibling}if(!i)throw Error(M(189))}}if(n.alternate!==r)throw Error(M(190))}if(n.tag!==3)throw Error(M(188));return n.stateNode.current===n?e:t}function Sd(e){return e=ip(e),e!==null?Ed(e):null}function Ed(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ed(e);if(t!==null)return t;e=e.sibling}return null}var Cd=mt.unstable_scheduleCallback,bc=mt.unstable_cancelCallback,ap=mt.unstable_shouldYield,lp=mt.unstable_requestPaint,je=mt.unstable_now,cp=mt.unstable_getCurrentPriorityLevel,pl=mt.unstable_ImmediatePriority,jd=mt.unstable_UserBlockingPriority,zs=mt.unstable_NormalPriority,up=mt.unstable_LowPriority,Td=mt.unstable_IdlePriority,oi=null,Wt=null;function dp(e){if(Wt&&typeof Wt.onCommitFiberRoot=="function")try{Wt.onCommitFiberRoot(oi,e,void 0,(e.current.flags&128)===128)}catch{}}var It=Math.clz32?Math.clz32:pp,fp=Math.log,hp=Math.LN2;function pp(e){return e>>>=0,e===0?32:31-(fp(e)/hp|0)|0}var es=64,ts=4194304;function so(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Ls(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,o=e.suspendedLanes,s=e.pingedLanes,i=n&268435455;if(i!==0){var l=i&~o;l!==0?r=so(l):(s&=i,s!==0&&(r=so(s)))}else i=n&~o,i!==0?r=so(i):s!==0&&(r=so(s));if(r===0)return 0;if(t!==0&&t!==r&&!(t&o)&&(o=r&-r,s=t&-t,o>=s||o===16&&(s&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-It(t),o=1<<n,r|=e[n],t&=~o;return r}function mp(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function gp(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,o=e.expirationTimes,s=e.pendingLanes;0<s;){var i=31-It(s),l=1<<i,a=o[i];a===-1?(!(l&n)||l&r)&&(o[i]=mp(l,t)):a<=t&&(e.expiredLanes|=l),s&=~l}}function wa(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Md(){var e=es;return es<<=1,!(es&4194240)&&(es=64),e}function Mi(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function $o(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-It(t),e[t]=n}function yp(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-It(n),s=1<<o;t[o]=0,r[o]=-1,e[o]=-1,n&=~s}}function ml(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-It(n),o=1<<r;o&t|e[r]&t&&(e[r]|=t),n&=~o}}var ie=0;function bd(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Nd,gl,Pd,Ad,zd,xa=!1,ns=[],Cn=null,jn=null,Tn=null,xo=new Map,ko=new Map,wn=[],vp="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Nc(e,t){switch(e){case"focusin":case"focusout":Cn=null;break;case"dragenter":case"dragleave":jn=null;break;case"mouseover":case"mouseout":Tn=null;break;case"pointerover":case"pointerout":xo.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ko.delete(t.pointerId)}}function Yr(e,t,n,r,o,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[o]},t!==null&&(t=Bo(t),t!==null&&gl(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function wp(e,t,n,r,o){switch(t){case"focusin":return Cn=Yr(Cn,e,t,n,r,o),!0;case"dragenter":return jn=Yr(jn,e,t,n,r,o),!0;case"mouseover":return Tn=Yr(Tn,e,t,n,r,o),!0;case"pointerover":var s=o.pointerId;return xo.set(s,Yr(xo.get(s)||null,e,t,n,r,o)),!0;case"gotpointercapture":return s=o.pointerId,ko.set(s,Yr(ko.get(s)||null,e,t,n,r,o)),!0}return!1}function Ld(e){var t=Vn(e.target);if(t!==null){var n=nr(t);if(n!==null){if(t=n.tag,t===13){if(t=kd(n),t!==null){e.blockedOn=t,zd(e.priority,function(){Pd(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ys(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=ka(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);ma=r,n.target.dispatchEvent(r),ma=null}else return t=Bo(n),t!==null&&gl(t),e.blockedOn=n,!1;t.shift()}return!0}function Pc(e,t,n){ys(e)&&n.delete(t)}function xp(){xa=!1,Cn!==null&&ys(Cn)&&(Cn=null),jn!==null&&ys(jn)&&(jn=null),Tn!==null&&ys(Tn)&&(Tn=null),xo.forEach(Pc),ko.forEach(Pc)}function Xr(e,t){e.blockedOn===t&&(e.blockedOn=null,xa||(xa=!0,mt.unstable_scheduleCallback(mt.unstable_NormalPriority,xp)))}function So(e){function t(o){return Xr(o,e)}if(0<ns.length){Xr(ns[0],e);for(var n=1;n<ns.length;n++){var r=ns[n];r.blockedOn===e&&(r.blockedOn=null)}}for(Cn!==null&&Xr(Cn,e),jn!==null&&Xr(jn,e),Tn!==null&&Xr(Tn,e),xo.forEach(t),ko.forEach(t),n=0;n<wn.length;n++)r=wn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<wn.length&&(n=wn[0],n.blockedOn===null);)Ld(n),n.blockedOn===null&&wn.shift()}var Mr=un.ReactCurrentBatchConfig,Is=!0;function kp(e,t,n,r){var o=ie,s=Mr.transition;Mr.transition=null;try{ie=1,yl(e,t,n,r)}finally{ie=o,Mr.transition=s}}function Sp(e,t,n,r){var o=ie,s=Mr.transition;Mr.transition=null;try{ie=4,yl(e,t,n,r)}finally{ie=o,Mr.transition=s}}function yl(e,t,n,r){if(Is){var o=ka(e,t,n,r);if(o===null)Ri(e,t,r,Ds,n),Nc(e,r);else if(wp(o,e,t,n,r))r.stopPropagation();else if(Nc(e,r),t&4&&-1<vp.indexOf(e)){for(;o!==null;){var s=Bo(o);if(s!==null&&Nd(s),s=ka(e,t,n,r),s===null&&Ri(e,t,r,Ds,n),s===o)break;o=s}o!==null&&r.stopPropagation()}else Ri(e,t,r,null,n)}}var Ds=null;function ka(e,t,n,r){if(Ds=null,e=hl(r),e=Vn(e),e!==null)if(t=nr(e),t===null)e=null;else if(n=t.tag,n===13){if(e=kd(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Ds=e,null}function Id(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(cp()){case pl:return 1;case jd:return 4;case zs:case up:return 16;case Td:return 536870912;default:return 16}default:return 16}}var kn=null,vl=null,vs=null;function Dd(){if(vs)return vs;var e,t=vl,n=t.length,r,o="value"in kn?kn.value:kn.textContent,s=o.length;for(e=0;e<n&&t[e]===o[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===o[s-r];r++);return vs=o.slice(e,1<r?1-r:void 0)}function ws(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function rs(){return!0}function Ac(){return!1}function yt(e){function t(n,r,o,s,i){this._reactName=n,this._targetInst=o,this.type=r,this.nativeEvent=s,this.target=i,this.currentTarget=null;for(var l in e)e.hasOwnProperty(l)&&(n=e[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?rs:Ac,this.isPropagationStopped=Ac,this}return Se(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=rs)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=rs)},persist:function(){},isPersistent:rs}),t}var Fr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},wl=yt(Fr),Fo=Se({},Fr,{view:0,detail:0}),Ep=yt(Fo),bi,Ni,qr,si=Se({},Fo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:xl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==qr&&(qr&&e.type==="mousemove"?(bi=e.screenX-qr.screenX,Ni=e.screenY-qr.screenY):Ni=bi=0,qr=e),bi)},movementY:function(e){return"movementY"in e?e.movementY:Ni}}),zc=yt(si),Cp=Se({},si,{dataTransfer:0}),jp=yt(Cp),Tp=Se({},Fo,{relatedTarget:0}),Pi=yt(Tp),Mp=Se({},Fr,{animationName:0,elapsedTime:0,pseudoElement:0}),bp=yt(Mp),Np=Se({},Fr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Pp=yt(Np),Ap=Se({},Fr,{data:0}),Lc=yt(Ap),zp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Lp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ip={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Dp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Ip[e])?!!t[e]:!1}function xl(){return Dp}var _p=Se({},Fo,{key:function(e){if(e.key){var t=zp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ws(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Lp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:xl,charCode:function(e){return e.type==="keypress"?ws(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ws(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Rp=yt(_p),Op=Se({},si,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ic=yt(Op),$p=Se({},Fo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:xl}),Fp=yt($p),Bp=Se({},Fr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Vp=yt(Bp),Wp=Se({},si,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Hp=yt(Wp),Up=[9,13,27,32],kl=on&&"CompositionEvent"in window,co=null;on&&"documentMode"in document&&(co=document.documentMode);var Kp=on&&"TextEvent"in window&&!co,_d=on&&(!kl||co&&8<co&&11>=co),Dc=" ",_c=!1;function Rd(e,t){switch(e){case"keyup":return Up.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Od(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var ur=!1;function Zp(e,t){switch(e){case"compositionend":return Od(t);case"keypress":return t.which!==32?null:(_c=!0,Dc);case"textInput":return e=t.data,e===Dc&&_c?null:e;default:return null}}function Gp(e,t){if(ur)return e==="compositionend"||!kl&&Rd(e,t)?(e=Dd(),vs=vl=kn=null,ur=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return _d&&t.locale!=="ko"?null:t.data;default:return null}}var Qp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Rc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Qp[e.type]:t==="textarea"}function $d(e,t,n,r){gd(r),t=_s(t,"onChange"),0<t.length&&(n=new wl("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var uo=null,Eo=null;function Yp(e){Yd(e,0)}function ii(e){var t=hr(e);if(cd(t))return e}function Xp(e,t){if(e==="change")return t}var Fd=!1;if(on){var Ai;if(on){var zi="oninput"in document;if(!zi){var Oc=document.createElement("div");Oc.setAttribute("oninput","return;"),zi=typeof Oc.oninput=="function"}Ai=zi}else Ai=!1;Fd=Ai&&(!document.documentMode||9<document.documentMode)}function $c(){uo&&(uo.detachEvent("onpropertychange",Bd),Eo=uo=null)}function Bd(e){if(e.propertyName==="value"&&ii(Eo)){var t=[];$d(t,Eo,e,hl(e)),xd(Yp,t)}}function qp(e,t,n){e==="focusin"?($c(),uo=t,Eo=n,uo.attachEvent("onpropertychange",Bd)):e==="focusout"&&$c()}function Jp(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ii(Eo)}function em(e,t){if(e==="click")return ii(t)}function tm(e,t){if(e==="input"||e==="change")return ii(t)}function nm(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Rt=typeof Object.is=="function"?Object.is:nm;function Co(e,t){if(Rt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var o=n[r];if(!ra.call(t,o)||!Rt(e[o],t[o]))return!1}return!0}function Fc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Bc(e,t){var n=Fc(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Fc(n)}}function Vd(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Vd(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Wd(){for(var e=window,t=Ns();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Ns(e.document)}return t}function Sl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function rm(e){var t=Wd(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Vd(n.ownerDocument.documentElement,n)){if(r!==null&&Sl(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,s=Math.min(r.start,o);r=r.end===void 0?s:Math.min(r.end,o),!e.extend&&s>r&&(o=r,r=s,s=o),o=Bc(n,s);var i=Bc(n,r);o&&i&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),s>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var om=on&&"documentMode"in document&&11>=document.documentMode,dr=null,Sa=null,fo=null,Ea=!1;function Vc(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ea||dr==null||dr!==Ns(r)||(r=dr,"selectionStart"in r&&Sl(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),fo&&Co(fo,r)||(fo=r,r=_s(Sa,"onSelect"),0<r.length&&(t=new wl("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=dr)))}function os(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var fr={animationend:os("Animation","AnimationEnd"),animationiteration:os("Animation","AnimationIteration"),animationstart:os("Animation","AnimationStart"),transitionend:os("Transition","TransitionEnd")},Li={},Hd={};on&&(Hd=document.createElement("div").style,"AnimationEvent"in window||(delete fr.animationend.animation,delete fr.animationiteration.animation,delete fr.animationstart.animation),"TransitionEvent"in window||delete fr.transitionend.transition);function ai(e){if(Li[e])return Li[e];if(!fr[e])return e;var t=fr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Hd)return Li[e]=t[n];return e}var Ud=ai("animationend"),Kd=ai("animationiteration"),Zd=ai("animationstart"),Gd=ai("transitionend"),Qd=new Map,Wc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Dn(e,t){Qd.set(e,t),tr(t,[e])}for(var Ii=0;Ii<Wc.length;Ii++){var Di=Wc[Ii],sm=Di.toLowerCase(),im=Di[0].toUpperCase()+Di.slice(1);Dn(sm,"on"+im)}Dn(Ud,"onAnimationEnd");Dn(Kd,"onAnimationIteration");Dn(Zd,"onAnimationStart");Dn("dblclick","onDoubleClick");Dn("focusin","onFocus");Dn("focusout","onBlur");Dn(Gd,"onTransitionEnd");zr("onMouseEnter",["mouseout","mouseover"]);zr("onMouseLeave",["mouseout","mouseover"]);zr("onPointerEnter",["pointerout","pointerover"]);zr("onPointerLeave",["pointerout","pointerover"]);tr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));tr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));tr("onBeforeInput",["compositionend","keypress","textInput","paste"]);tr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));tr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));tr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var io="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),am=new Set("cancel close invalid load scroll toggle".split(" ").concat(io));function Hc(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,sp(r,t,void 0,e),e.currentTarget=null}function Yd(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],o=r.event;r=r.listeners;e:{var s=void 0;if(t)for(var i=r.length-1;0<=i;i--){var l=r[i],a=l.instance,d=l.currentTarget;if(l=l.listener,a!==s&&o.isPropagationStopped())break e;Hc(o,l,d),s=a}else for(i=0;i<r.length;i++){if(l=r[i],a=l.instance,d=l.currentTarget,l=l.listener,a!==s&&o.isPropagationStopped())break e;Hc(o,l,d),s=a}}}if(As)throw e=va,As=!1,va=null,e}function me(e,t){var n=t[ba];n===void 0&&(n=t[ba]=new Set);var r=e+"__bubble";n.has(r)||(Xd(t,e,2,!1),n.add(r))}function _i(e,t,n){var r=0;t&&(r|=4),Xd(n,e,r,t)}var ss="_reactListening"+Math.random().toString(36).slice(2);function jo(e){if(!e[ss]){e[ss]=!0,od.forEach(function(n){n!=="selectionchange"&&(am.has(n)||_i(n,!1,e),_i(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ss]||(t[ss]=!0,_i("selectionchange",!1,t))}}function Xd(e,t,n,r){switch(Id(t)){case 1:var o=kp;break;case 4:o=Sp;break;default:o=yl}n=o.bind(null,t,n,e),o=void 0,!ya||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),r?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function Ri(e,t,n,r,o){var s=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var l=r.stateNode.containerInfo;if(l===o||l.nodeType===8&&l.parentNode===o)break;if(i===4)for(i=r.return;i!==null;){var a=i.tag;if((a===3||a===4)&&(a=i.stateNode.containerInfo,a===o||a.nodeType===8&&a.parentNode===o))return;i=i.return}for(;l!==null;){if(i=Vn(l),i===null)return;if(a=i.tag,a===5||a===6){r=s=i;continue e}l=l.parentNode}}r=r.return}xd(function(){var d=s,f=hl(n),m=[];e:{var h=Qd.get(e);if(h!==void 0){var k=wl,g=e;switch(e){case"keypress":if(ws(n)===0)break e;case"keydown":case"keyup":k=Rp;break;case"focusin":g="focus",k=Pi;break;case"focusout":g="blur",k=Pi;break;case"beforeblur":case"afterblur":k=Pi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=zc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=jp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=Fp;break;case Ud:case Kd:case Zd:k=bp;break;case Gd:k=Vp;break;case"scroll":k=Ep;break;case"wheel":k=Hp;break;case"copy":case"cut":case"paste":k=Pp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=Ic}var x=(t&4)!==0,P=!x&&e==="scroll",y=x?h!==null?h+"Capture":null:h;x=[];for(var u=d,v;u!==null;){v=u;var C=v.stateNode;if(v.tag===5&&C!==null&&(v=C,y!==null&&(C=wo(u,y),C!=null&&x.push(To(u,C,v)))),P)break;u=u.return}0<x.length&&(h=new k(h,g,null,n,f),m.push({event:h,listeners:x}))}}if(!(t&7)){e:{if(h=e==="mouseover"||e==="pointerover",k=e==="mouseout"||e==="pointerout",h&&n!==ma&&(g=n.relatedTarget||n.fromElement)&&(Vn(g)||g[sn]))break e;if((k||h)&&(h=f.window===f?f:(h=f.ownerDocument)?h.defaultView||h.parentWindow:window,k?(g=n.relatedTarget||n.toElement,k=d,g=g?Vn(g):null,g!==null&&(P=nr(g),g!==P||g.tag!==5&&g.tag!==6)&&(g=null)):(k=null,g=d),k!==g)){if(x=zc,C="onMouseLeave",y="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(x=Ic,C="onPointerLeave",y="onPointerEnter",u="pointer"),P=k==null?h:hr(k),v=g==null?h:hr(g),h=new x(C,u+"leave",k,n,f),h.target=P,h.relatedTarget=v,C=null,Vn(f)===d&&(x=new x(y,u+"enter",g,n,f),x.target=v,x.relatedTarget=P,C=x),P=C,k&&g)t:{for(x=k,y=g,u=0,v=x;v;v=ar(v))u++;for(v=0,C=y;C;C=ar(C))v++;for(;0<u-v;)x=ar(x),u--;for(;0<v-u;)y=ar(y),v--;for(;u--;){if(x===y||y!==null&&x===y.alternate)break t;x=ar(x),y=ar(y)}x=null}else x=null;k!==null&&Uc(m,h,k,x,!1),g!==null&&P!==null&&Uc(m,P,g,x,!0)}}e:{if(h=d?hr(d):window,k=h.nodeName&&h.nodeName.toLowerCase(),k==="select"||k==="input"&&h.type==="file")var z=Xp;else if(Rc(h))if(Fd)z=tm;else{z=Jp;var D=qp}else(k=h.nodeName)&&k.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(z=em);if(z&&(z=z(e,d))){$d(m,z,n,f);break e}D&&D(e,h,d),e==="focusout"&&(D=h._wrapperState)&&D.controlled&&h.type==="number"&&ua(h,"number",h.value)}switch(D=d?hr(d):window,e){case"focusin":(Rc(D)||D.contentEditable==="true")&&(dr=D,Sa=d,fo=null);break;case"focusout":fo=Sa=dr=null;break;case"mousedown":Ea=!0;break;case"contextmenu":case"mouseup":case"dragend":Ea=!1,Vc(m,n,f);break;case"selectionchange":if(om)break;case"keydown":case"keyup":Vc(m,n,f)}var L;if(kl)e:{switch(e){case"compositionstart":var B="onCompositionStart";break e;case"compositionend":B="onCompositionEnd";break e;case"compositionupdate":B="onCompositionUpdate";break e}B=void 0}else ur?Rd(e,n)&&(B="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(B="onCompositionStart");B&&(_d&&n.locale!=="ko"&&(ur||B!=="onCompositionStart"?B==="onCompositionEnd"&&ur&&(L=Dd()):(kn=f,vl="value"in kn?kn.value:kn.textContent,ur=!0)),D=_s(d,B),0<D.length&&(B=new Lc(B,e,null,n,f),m.push({event:B,listeners:D}),L?B.data=L:(L=Od(n),L!==null&&(B.data=L)))),(L=Kp?Zp(e,n):Gp(e,n))&&(d=_s(d,"onBeforeInput"),0<d.length&&(f=new Lc("onBeforeInput","beforeinput",null,n,f),m.push({event:f,listeners:d}),f.data=L))}Yd(m,t)})}function To(e,t,n){return{instance:e,listener:t,currentTarget:n}}function _s(e,t){for(var n=t+"Capture",r=[];e!==null;){var o=e,s=o.stateNode;o.tag===5&&s!==null&&(o=s,s=wo(e,n),s!=null&&r.unshift(To(e,s,o)),s=wo(e,t),s!=null&&r.push(To(e,s,o))),e=e.return}return r}function ar(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Uc(e,t,n,r,o){for(var s=t._reactName,i=[];n!==null&&n!==r;){var l=n,a=l.alternate,d=l.stateNode;if(a!==null&&a===r)break;l.tag===5&&d!==null&&(l=d,o?(a=wo(n,s),a!=null&&i.unshift(To(n,a,l))):o||(a=wo(n,s),a!=null&&i.push(To(n,a,l)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var lm=/\r\n?/g,cm=/\u0000|\uFFFD/g;function Kc(e){return(typeof e=="string"?e:""+e).replace(lm,`
`).replace(cm,"")}function is(e,t,n){if(t=Kc(t),Kc(e)!==t&&n)throw Error(M(425))}function Rs(){}var Ca=null,ja=null;function Ta(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ma=typeof setTimeout=="function"?setTimeout:void 0,um=typeof clearTimeout=="function"?clearTimeout:void 0,Zc=typeof Promise=="function"?Promise:void 0,dm=typeof queueMicrotask=="function"?queueMicrotask:typeof Zc<"u"?function(e){return Zc.resolve(null).then(e).catch(fm)}:Ma;function fm(e){setTimeout(function(){throw e})}function Oi(e,t){var n=t,r=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(r===0){e.removeChild(o),So(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=o}while(n);So(t)}function Mn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Gc(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Br=Math.random().toString(36).slice(2),Bt="__reactFiber$"+Br,Mo="__reactProps$"+Br,sn="__reactContainer$"+Br,ba="__reactEvents$"+Br,hm="__reactListeners$"+Br,pm="__reactHandles$"+Br;function Vn(e){var t=e[Bt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[sn]||n[Bt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Gc(e);e!==null;){if(n=e[Bt])return n;e=Gc(e)}return t}e=n,n=e.parentNode}return null}function Bo(e){return e=e[Bt]||e[sn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function hr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(M(33))}function li(e){return e[Mo]||null}var Na=[],pr=-1;function _n(e){return{current:e}}function ge(e){0>pr||(e.current=Na[pr],Na[pr]=null,pr--)}function fe(e,t){pr++,Na[pr]=e.current,e.current=t}var Ln={},Ze=_n(Ln),st=_n(!1),Qn=Ln;function Lr(e,t){var n=e.type.contextTypes;if(!n)return Ln;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o={},s;for(s in n)o[s]=t[s];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function it(e){return e=e.childContextTypes,e!=null}function Os(){ge(st),ge(Ze)}function Qc(e,t,n){if(Ze.current!==Ln)throw Error(M(168));fe(Ze,t),fe(st,n)}function qd(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var o in r)if(!(o in t))throw Error(M(108,qh(e)||"Unknown",o));return Se({},n,r)}function $s(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Ln,Qn=Ze.current,fe(Ze,e),fe(st,st.current),!0}function Yc(e,t,n){var r=e.stateNode;if(!r)throw Error(M(169));n?(e=qd(e,t,Qn),r.__reactInternalMemoizedMergedChildContext=e,ge(st),ge(Ze),fe(Ze,e)):ge(st),fe(st,n)}var en=null,ci=!1,$i=!1;function Jd(e){en===null?en=[e]:en.push(e)}function mm(e){ci=!0,Jd(e)}function Rn(){if(!$i&&en!==null){$i=!0;var e=0,t=ie;try{var n=en;for(ie=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}en=null,ci=!1}catch(o){throw en!==null&&(en=en.slice(e+1)),Cd(pl,Rn),o}finally{ie=t,$i=!1}}return null}var mr=[],gr=0,Fs=null,Bs=0,vt=[],wt=0,Yn=null,tn=1,nn="";function On(e,t){mr[gr++]=Bs,mr[gr++]=Fs,Fs=e,Bs=t}function ef(e,t,n){vt[wt++]=tn,vt[wt++]=nn,vt[wt++]=Yn,Yn=e;var r=tn;e=nn;var o=32-It(r)-1;r&=~(1<<o),n+=1;var s=32-It(t)+o;if(30<s){var i=o-o%5;s=(r&(1<<i)-1).toString(32),r>>=i,o-=i,tn=1<<32-It(t)+o|n<<o|r,nn=s+e}else tn=1<<s|n<<o|r,nn=e}function El(e){e.return!==null&&(On(e,1),ef(e,1,0))}function Cl(e){for(;e===Fs;)Fs=mr[--gr],mr[gr]=null,Bs=mr[--gr],mr[gr]=null;for(;e===Yn;)Yn=vt[--wt],vt[wt]=null,nn=vt[--wt],vt[wt]=null,tn=vt[--wt],vt[wt]=null}var pt=null,ht=null,ye=!1,zt=null;function tf(e,t){var n=kt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Xc(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,pt=e,ht=Mn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,pt=e,ht=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Yn!==null?{id:tn,overflow:nn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=kt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,pt=e,ht=null,!0):!1;default:return!1}}function Pa(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Aa(e){if(ye){var t=ht;if(t){var n=t;if(!Xc(e,t)){if(Pa(e))throw Error(M(418));t=Mn(n.nextSibling);var r=pt;t&&Xc(e,t)?tf(r,n):(e.flags=e.flags&-4097|2,ye=!1,pt=e)}}else{if(Pa(e))throw Error(M(418));e.flags=e.flags&-4097|2,ye=!1,pt=e}}}function qc(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;pt=e}function as(e){if(e!==pt)return!1;if(!ye)return qc(e),ye=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ta(e.type,e.memoizedProps)),t&&(t=ht)){if(Pa(e))throw nf(),Error(M(418));for(;t;)tf(e,t),t=Mn(t.nextSibling)}if(qc(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(M(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ht=Mn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ht=null}}else ht=pt?Mn(e.stateNode.nextSibling):null;return!0}function nf(){for(var e=ht;e;)e=Mn(e.nextSibling)}function Ir(){ht=pt=null,ye=!1}function jl(e){zt===null?zt=[e]:zt.push(e)}var gm=un.ReactCurrentBatchConfig;function Jr(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(M(309));var r=n.stateNode}if(!r)throw Error(M(147,e));var o=r,s=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===s?t.ref:(t=function(i){var l=o.refs;i===null?delete l[s]:l[s]=i},t._stringRef=s,t)}if(typeof e!="string")throw Error(M(284));if(!n._owner)throw Error(M(290,e))}return e}function ls(e,t){throw e=Object.prototype.toString.call(t),Error(M(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Jc(e){var t=e._init;return t(e._payload)}function rf(e){function t(y,u){if(e){var v=y.deletions;v===null?(y.deletions=[u],y.flags|=16):v.push(u)}}function n(y,u){if(!e)return null;for(;u!==null;)t(y,u),u=u.sibling;return null}function r(y,u){for(y=new Map;u!==null;)u.key!==null?y.set(u.key,u):y.set(u.index,u),u=u.sibling;return y}function o(y,u){return y=An(y,u),y.index=0,y.sibling=null,y}function s(y,u,v){return y.index=v,e?(v=y.alternate,v!==null?(v=v.index,v<u?(y.flags|=2,u):v):(y.flags|=2,u)):(y.flags|=1048576,u)}function i(y){return e&&y.alternate===null&&(y.flags|=2),y}function l(y,u,v,C){return u===null||u.tag!==6?(u=Ki(v,y.mode,C),u.return=y,u):(u=o(u,v),u.return=y,u)}function a(y,u,v,C){var z=v.type;return z===cr?f(y,u,v.props.children,C,v.key):u!==null&&(u.elementType===z||typeof z=="object"&&z!==null&&z.$$typeof===yn&&Jc(z)===u.type)?(C=o(u,v.props),C.ref=Jr(y,u,v),C.return=y,C):(C=Ts(v.type,v.key,v.props,null,y.mode,C),C.ref=Jr(y,u,v),C.return=y,C)}function d(y,u,v,C){return u===null||u.tag!==4||u.stateNode.containerInfo!==v.containerInfo||u.stateNode.implementation!==v.implementation?(u=Zi(v,y.mode,C),u.return=y,u):(u=o(u,v.children||[]),u.return=y,u)}function f(y,u,v,C,z){return u===null||u.tag!==7?(u=Gn(v,y.mode,C,z),u.return=y,u):(u=o(u,v),u.return=y,u)}function m(y,u,v){if(typeof u=="string"&&u!==""||typeof u=="number")return u=Ki(""+u,y.mode,v),u.return=y,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case Xo:return v=Ts(u.type,u.key,u.props,null,y.mode,v),v.ref=Jr(y,null,u),v.return=y,v;case lr:return u=Zi(u,y.mode,v),u.return=y,u;case yn:var C=u._init;return m(y,C(u._payload),v)}if(oo(u)||Gr(u))return u=Gn(u,y.mode,v,null),u.return=y,u;ls(y,u)}return null}function h(y,u,v,C){var z=u!==null?u.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return z!==null?null:l(y,u,""+v,C);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Xo:return v.key===z?a(y,u,v,C):null;case lr:return v.key===z?d(y,u,v,C):null;case yn:return z=v._init,h(y,u,z(v._payload),C)}if(oo(v)||Gr(v))return z!==null?null:f(y,u,v,C,null);ls(y,v)}return null}function k(y,u,v,C,z){if(typeof C=="string"&&C!==""||typeof C=="number")return y=y.get(v)||null,l(u,y,""+C,z);if(typeof C=="object"&&C!==null){switch(C.$$typeof){case Xo:return y=y.get(C.key===null?v:C.key)||null,a(u,y,C,z);case lr:return y=y.get(C.key===null?v:C.key)||null,d(u,y,C,z);case yn:var D=C._init;return k(y,u,v,D(C._payload),z)}if(oo(C)||Gr(C))return y=y.get(v)||null,f(u,y,C,z,null);ls(u,C)}return null}function g(y,u,v,C){for(var z=null,D=null,L=u,B=u=0,ce=null;L!==null&&B<v.length;B++){L.index>B?(ce=L,L=null):ce=L.sibling;var U=h(y,L,v[B],C);if(U===null){L===null&&(L=ce);break}e&&L&&U.alternate===null&&t(y,L),u=s(U,u,B),D===null?z=U:D.sibling=U,D=U,L=ce}if(B===v.length)return n(y,L),ye&&On(y,B),z;if(L===null){for(;B<v.length;B++)L=m(y,v[B],C),L!==null&&(u=s(L,u,B),D===null?z=L:D.sibling=L,D=L);return ye&&On(y,B),z}for(L=r(y,L);B<v.length;B++)ce=k(L,y,B,v[B],C),ce!==null&&(e&&ce.alternate!==null&&L.delete(ce.key===null?B:ce.key),u=s(ce,u,B),D===null?z=ce:D.sibling=ce,D=ce);return e&&L.forEach(function(Ge){return t(y,Ge)}),ye&&On(y,B),z}function x(y,u,v,C){var z=Gr(v);if(typeof z!="function")throw Error(M(150));if(v=z.call(v),v==null)throw Error(M(151));for(var D=z=null,L=u,B=u=0,ce=null,U=v.next();L!==null&&!U.done;B++,U=v.next()){L.index>B?(ce=L,L=null):ce=L.sibling;var Ge=h(y,L,U.value,C);if(Ge===null){L===null&&(L=ce);break}e&&L&&Ge.alternate===null&&t(y,L),u=s(Ge,u,B),D===null?z=Ge:D.sibling=Ge,D=Ge,L=ce}if(U.done)return n(y,L),ye&&On(y,B),z;if(L===null){for(;!U.done;B++,U=v.next())U=m(y,U.value,C),U!==null&&(u=s(U,u,B),D===null?z=U:D.sibling=U,D=U);return ye&&On(y,B),z}for(L=r(y,L);!U.done;B++,U=v.next())U=k(L,y,B,U.value,C),U!==null&&(e&&U.alternate!==null&&L.delete(U.key===null?B:U.key),u=s(U,u,B),D===null?z=U:D.sibling=U,D=U);return e&&L.forEach(function(lt){return t(y,lt)}),ye&&On(y,B),z}function P(y,u,v,C){if(typeof v=="object"&&v!==null&&v.type===cr&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case Xo:e:{for(var z=v.key,D=u;D!==null;){if(D.key===z){if(z=v.type,z===cr){if(D.tag===7){n(y,D.sibling),u=o(D,v.props.children),u.return=y,y=u;break e}}else if(D.elementType===z||typeof z=="object"&&z!==null&&z.$$typeof===yn&&Jc(z)===D.type){n(y,D.sibling),u=o(D,v.props),u.ref=Jr(y,D,v),u.return=y,y=u;break e}n(y,D);break}else t(y,D);D=D.sibling}v.type===cr?(u=Gn(v.props.children,y.mode,C,v.key),u.return=y,y=u):(C=Ts(v.type,v.key,v.props,null,y.mode,C),C.ref=Jr(y,u,v),C.return=y,y=C)}return i(y);case lr:e:{for(D=v.key;u!==null;){if(u.key===D)if(u.tag===4&&u.stateNode.containerInfo===v.containerInfo&&u.stateNode.implementation===v.implementation){n(y,u.sibling),u=o(u,v.children||[]),u.return=y,y=u;break e}else{n(y,u);break}else t(y,u);u=u.sibling}u=Zi(v,y.mode,C),u.return=y,y=u}return i(y);case yn:return D=v._init,P(y,u,D(v._payload),C)}if(oo(v))return g(y,u,v,C);if(Gr(v))return x(y,u,v,C);ls(y,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,u!==null&&u.tag===6?(n(y,u.sibling),u=o(u,v),u.return=y,y=u):(n(y,u),u=Ki(v,y.mode,C),u.return=y,y=u),i(y)):n(y,u)}return P}var Dr=rf(!0),of=rf(!1),Vs=_n(null),Ws=null,yr=null,Tl=null;function Ml(){Tl=yr=Ws=null}function bl(e){var t=Vs.current;ge(Vs),e._currentValue=t}function za(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function br(e,t){Ws=e,Tl=yr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(ot=!0),e.firstContext=null)}function Ct(e){var t=e._currentValue;if(Tl!==e)if(e={context:e,memoizedValue:t,next:null},yr===null){if(Ws===null)throw Error(M(308));yr=e,Ws.dependencies={lanes:0,firstContext:e}}else yr=yr.next=e;return t}var Wn=null;function Nl(e){Wn===null?Wn=[e]:Wn.push(e)}function sf(e,t,n,r){var o=t.interleaved;return o===null?(n.next=n,Nl(t)):(n.next=o.next,o.next=n),t.interleaved=n,an(e,r)}function an(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var vn=!1;function Pl(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function af(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function rn(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function bn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,ee&2){var o=r.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),r.pending=t,an(e,n)}return o=r.interleaved,o===null?(t.next=t,Nl(r)):(t.next=o.next,o.next=t),r.interleaved=t,an(e,n)}function xs(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ml(e,n)}}function eu(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var o=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?o=s=i:s=s.next=i,n=n.next}while(n!==null);s===null?o=s=t:s=s.next=t}else o=s=t;n={baseState:r.baseState,firstBaseUpdate:o,lastBaseUpdate:s,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Hs(e,t,n,r){var o=e.updateQueue;vn=!1;var s=o.firstBaseUpdate,i=o.lastBaseUpdate,l=o.shared.pending;if(l!==null){o.shared.pending=null;var a=l,d=a.next;a.next=null,i===null?s=d:i.next=d,i=a;var f=e.alternate;f!==null&&(f=f.updateQueue,l=f.lastBaseUpdate,l!==i&&(l===null?f.firstBaseUpdate=d:l.next=d,f.lastBaseUpdate=a))}if(s!==null){var m=o.baseState;i=0,f=d=a=null,l=s;do{var h=l.lane,k=l.eventTime;if((r&h)===h){f!==null&&(f=f.next={eventTime:k,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var g=e,x=l;switch(h=t,k=n,x.tag){case 1:if(g=x.payload,typeof g=="function"){m=g.call(k,m,h);break e}m=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=x.payload,h=typeof g=="function"?g.call(k,m,h):g,h==null)break e;m=Se({},m,h);break e;case 2:vn=!0}}l.callback!==null&&l.lane!==0&&(e.flags|=64,h=o.effects,h===null?o.effects=[l]:h.push(l))}else k={eventTime:k,lane:h,tag:l.tag,payload:l.payload,callback:l.callback,next:null},f===null?(d=f=k,a=m):f=f.next=k,i|=h;if(l=l.next,l===null){if(l=o.shared.pending,l===null)break;h=l,l=h.next,h.next=null,o.lastBaseUpdate=h,o.shared.pending=null}}while(!0);if(f===null&&(a=m),o.baseState=a,o.firstBaseUpdate=d,o.lastBaseUpdate=f,t=o.shared.interleaved,t!==null){o=t;do i|=o.lane,o=o.next;while(o!==t)}else s===null&&(o.shared.lanes=0);qn|=i,e.lanes=i,e.memoizedState=m}}function tu(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],o=r.callback;if(o!==null){if(r.callback=null,r=n,typeof o!="function")throw Error(M(191,o));o.call(r)}}}var Vo={},Ht=_n(Vo),bo=_n(Vo),No=_n(Vo);function Hn(e){if(e===Vo)throw Error(M(174));return e}function Al(e,t){switch(fe(No,t),fe(bo,e),fe(Ht,Vo),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:fa(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=fa(t,e)}ge(Ht),fe(Ht,t)}function _r(){ge(Ht),ge(bo),ge(No)}function lf(e){Hn(No.current);var t=Hn(Ht.current),n=fa(t,e.type);t!==n&&(fe(bo,e),fe(Ht,n))}function zl(e){bo.current===e&&(ge(Ht),ge(bo))}var xe=_n(0);function Us(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Fi=[];function Ll(){for(var e=0;e<Fi.length;e++)Fi[e]._workInProgressVersionPrimary=null;Fi.length=0}var ks=un.ReactCurrentDispatcher,Bi=un.ReactCurrentBatchConfig,Xn=0,ke=null,Ne=null,Le=null,Ks=!1,ho=!1,Po=0,ym=0;function We(){throw Error(M(321))}function Il(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Rt(e[n],t[n]))return!1;return!0}function Dl(e,t,n,r,o,s){if(Xn=s,ke=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ks.current=e===null||e.memoizedState===null?km:Sm,e=n(r,o),ho){s=0;do{if(ho=!1,Po=0,25<=s)throw Error(M(301));s+=1,Le=Ne=null,t.updateQueue=null,ks.current=Em,e=n(r,o)}while(ho)}if(ks.current=Zs,t=Ne!==null&&Ne.next!==null,Xn=0,Le=Ne=ke=null,Ks=!1,t)throw Error(M(300));return e}function _l(){var e=Po!==0;return Po=0,e}function Ft(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Le===null?ke.memoizedState=Le=e:Le=Le.next=e,Le}function jt(){if(Ne===null){var e=ke.alternate;e=e!==null?e.memoizedState:null}else e=Ne.next;var t=Le===null?ke.memoizedState:Le.next;if(t!==null)Le=t,Ne=e;else{if(e===null)throw Error(M(310));Ne=e,e={memoizedState:Ne.memoizedState,baseState:Ne.baseState,baseQueue:Ne.baseQueue,queue:Ne.queue,next:null},Le===null?ke.memoizedState=Le=e:Le=Le.next=e}return Le}function Ao(e,t){return typeof t=="function"?t(e):t}function Vi(e){var t=jt(),n=t.queue;if(n===null)throw Error(M(311));n.lastRenderedReducer=e;var r=Ne,o=r.baseQueue,s=n.pending;if(s!==null){if(o!==null){var i=o.next;o.next=s.next,s.next=i}r.baseQueue=o=s,n.pending=null}if(o!==null){s=o.next,r=r.baseState;var l=i=null,a=null,d=s;do{var f=d.lane;if((Xn&f)===f)a!==null&&(a=a.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var m={lane:f,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};a===null?(l=a=m,i=r):a=a.next=m,ke.lanes|=f,qn|=f}d=d.next}while(d!==null&&d!==s);a===null?i=r:a.next=l,Rt(r,t.memoizedState)||(ot=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=a,n.lastRenderedState=r}if(e=n.interleaved,e!==null){o=e;do s=o.lane,ke.lanes|=s,qn|=s,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Wi(e){var t=jt(),n=t.queue;if(n===null)throw Error(M(311));n.lastRenderedReducer=e;var r=n.dispatch,o=n.pending,s=t.memoizedState;if(o!==null){n.pending=null;var i=o=o.next;do s=e(s,i.action),i=i.next;while(i!==o);Rt(s,t.memoizedState)||(ot=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,r]}function cf(){}function uf(e,t){var n=ke,r=jt(),o=t(),s=!Rt(r.memoizedState,o);if(s&&(r.memoizedState=o,ot=!0),r=r.queue,Rl(hf.bind(null,n,r,e),[e]),r.getSnapshot!==t||s||Le!==null&&Le.memoizedState.tag&1){if(n.flags|=2048,zo(9,ff.bind(null,n,r,o,t),void 0,null),Ie===null)throw Error(M(349));Xn&30||df(n,t,o)}return o}function df(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ke.updateQueue,t===null?(t={lastEffect:null,stores:null},ke.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ff(e,t,n,r){t.value=n,t.getSnapshot=r,pf(t)&&mf(e)}function hf(e,t,n){return n(function(){pf(t)&&mf(e)})}function pf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Rt(e,n)}catch{return!0}}function mf(e){var t=an(e,1);t!==null&&Dt(t,e,1,-1)}function nu(e){var t=Ft();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ao,lastRenderedState:e},t.queue=e,e=e.dispatch=xm.bind(null,ke,e),[t.memoizedState,e]}function zo(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=ke.updateQueue,t===null?(t={lastEffect:null,stores:null},ke.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function gf(){return jt().memoizedState}function Ss(e,t,n,r){var o=Ft();ke.flags|=e,o.memoizedState=zo(1|t,n,void 0,r===void 0?null:r)}function ui(e,t,n,r){var o=jt();r=r===void 0?null:r;var s=void 0;if(Ne!==null){var i=Ne.memoizedState;if(s=i.destroy,r!==null&&Il(r,i.deps)){o.memoizedState=zo(t,n,s,r);return}}ke.flags|=e,o.memoizedState=zo(1|t,n,s,r)}function ru(e,t){return Ss(8390656,8,e,t)}function Rl(e,t){return ui(2048,8,e,t)}function yf(e,t){return ui(4,2,e,t)}function vf(e,t){return ui(4,4,e,t)}function wf(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function xf(e,t,n){return n=n!=null?n.concat([e]):null,ui(4,4,wf.bind(null,t,e),n)}function Ol(){}function kf(e,t){var n=jt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Il(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Sf(e,t){var n=jt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Il(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Ef(e,t,n){return Xn&21?(Rt(n,t)||(n=Md(),ke.lanes|=n,qn|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,ot=!0),e.memoizedState=n)}function vm(e,t){var n=ie;ie=n!==0&&4>n?n:4,e(!0);var r=Bi.transition;Bi.transition={};try{e(!1),t()}finally{ie=n,Bi.transition=r}}function Cf(){return jt().memoizedState}function wm(e,t,n){var r=Pn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},jf(e))Tf(t,n);else if(n=sf(e,t,n,r),n!==null){var o=Xe();Dt(n,e,r,o),Mf(n,t,r)}}function xm(e,t,n){var r=Pn(e),o={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(jf(e))Tf(t,o);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var i=t.lastRenderedState,l=s(i,n);if(o.hasEagerState=!0,o.eagerState=l,Rt(l,i)){var a=t.interleaved;a===null?(o.next=o,Nl(t)):(o.next=a.next,a.next=o),t.interleaved=o;return}}catch{}finally{}n=sf(e,t,o,r),n!==null&&(o=Xe(),Dt(n,e,r,o),Mf(n,t,r))}}function jf(e){var t=e.alternate;return e===ke||t!==null&&t===ke}function Tf(e,t){ho=Ks=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Mf(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ml(e,n)}}var Zs={readContext:Ct,useCallback:We,useContext:We,useEffect:We,useImperativeHandle:We,useInsertionEffect:We,useLayoutEffect:We,useMemo:We,useReducer:We,useRef:We,useState:We,useDebugValue:We,useDeferredValue:We,useTransition:We,useMutableSource:We,useSyncExternalStore:We,useId:We,unstable_isNewReconciler:!1},km={readContext:Ct,useCallback:function(e,t){return Ft().memoizedState=[e,t===void 0?null:t],e},useContext:Ct,useEffect:ru,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Ss(4194308,4,wf.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ss(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ss(4,2,e,t)},useMemo:function(e,t){var n=Ft();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ft();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=wm.bind(null,ke,e),[r.memoizedState,e]},useRef:function(e){var t=Ft();return e={current:e},t.memoizedState=e},useState:nu,useDebugValue:Ol,useDeferredValue:function(e){return Ft().memoizedState=e},useTransition:function(){var e=nu(!1),t=e[0];return e=vm.bind(null,e[1]),Ft().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=ke,o=Ft();if(ye){if(n===void 0)throw Error(M(407));n=n()}else{if(n=t(),Ie===null)throw Error(M(349));Xn&30||df(r,t,n)}o.memoizedState=n;var s={value:n,getSnapshot:t};return o.queue=s,ru(hf.bind(null,r,s,e),[e]),r.flags|=2048,zo(9,ff.bind(null,r,s,n,t),void 0,null),n},useId:function(){var e=Ft(),t=Ie.identifierPrefix;if(ye){var n=nn,r=tn;n=(r&~(1<<32-It(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Po++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=ym++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Sm={readContext:Ct,useCallback:kf,useContext:Ct,useEffect:Rl,useImperativeHandle:xf,useInsertionEffect:yf,useLayoutEffect:vf,useMemo:Sf,useReducer:Vi,useRef:gf,useState:function(){return Vi(Ao)},useDebugValue:Ol,useDeferredValue:function(e){var t=jt();return Ef(t,Ne.memoizedState,e)},useTransition:function(){var e=Vi(Ao)[0],t=jt().memoizedState;return[e,t]},useMutableSource:cf,useSyncExternalStore:uf,useId:Cf,unstable_isNewReconciler:!1},Em={readContext:Ct,useCallback:kf,useContext:Ct,useEffect:Rl,useImperativeHandle:xf,useInsertionEffect:yf,useLayoutEffect:vf,useMemo:Sf,useReducer:Wi,useRef:gf,useState:function(){return Wi(Ao)},useDebugValue:Ol,useDeferredValue:function(e){var t=jt();return Ne===null?t.memoizedState=e:Ef(t,Ne.memoizedState,e)},useTransition:function(){var e=Wi(Ao)[0],t=jt().memoizedState;return[e,t]},useMutableSource:cf,useSyncExternalStore:uf,useId:Cf,unstable_isNewReconciler:!1};function Nt(e,t){if(e&&e.defaultProps){t=Se({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function La(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:Se({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var di={isMounted:function(e){return(e=e._reactInternals)?nr(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Xe(),o=Pn(e),s=rn(r,o);s.payload=t,n!=null&&(s.callback=n),t=bn(e,s,o),t!==null&&(Dt(t,e,o,r),xs(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Xe(),o=Pn(e),s=rn(r,o);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=bn(e,s,o),t!==null&&(Dt(t,e,o,r),xs(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Xe(),r=Pn(e),o=rn(n,r);o.tag=2,t!=null&&(o.callback=t),t=bn(e,o,r),t!==null&&(Dt(t,e,r,n),xs(t,e,r))}};function ou(e,t,n,r,o,s,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,s,i):t.prototype&&t.prototype.isPureReactComponent?!Co(n,r)||!Co(o,s):!0}function bf(e,t,n){var r=!1,o=Ln,s=t.contextType;return typeof s=="object"&&s!==null?s=Ct(s):(o=it(t)?Qn:Ze.current,r=t.contextTypes,s=(r=r!=null)?Lr(e,o):Ln),t=new t(n,s),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=di,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=s),t}function su(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&di.enqueueReplaceState(t,t.state,null)}function Ia(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs={},Pl(e);var s=t.contextType;typeof s=="object"&&s!==null?o.context=Ct(s):(s=it(t)?Qn:Ze.current,o.context=Lr(e,s)),o.state=e.memoizedState,s=t.getDerivedStateFromProps,typeof s=="function"&&(La(e,t,s,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&di.enqueueReplaceState(o,o.state,null),Hs(e,n,o,r),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function Rr(e,t){try{var n="",r=t;do n+=Xh(r),r=r.return;while(r);var o=n}catch(s){o=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:t,stack:o,digest:null}}function Hi(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Da(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Cm=typeof WeakMap=="function"?WeakMap:Map;function Nf(e,t,n){n=rn(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Qs||(Qs=!0,Ua=r),Da(e,t)},n}function Pf(e,t,n){n=rn(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var o=t.value;n.payload=function(){return r(o)},n.callback=function(){Da(e,t)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Da(e,t),typeof r!="function"&&(Nn===null?Nn=new Set([this]):Nn.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function iu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Cm;var o=new Set;r.set(t,o)}else o=r.get(t),o===void 0&&(o=new Set,r.set(t,o));o.has(n)||(o.add(n),e=Om.bind(null,e,t,n),t.then(e,e))}function au(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function lu(e,t,n,r,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=rn(-1,1),t.tag=2,bn(n,t,1))),n.lanes|=1),e)}var jm=un.ReactCurrentOwner,ot=!1;function Ye(e,t,n,r){t.child=e===null?of(t,null,n,r):Dr(t,e.child,n,r)}function cu(e,t,n,r,o){n=n.render;var s=t.ref;return br(t,o),r=Dl(e,t,n,r,s,o),n=_l(),e!==null&&!ot?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,ln(e,t,o)):(ye&&n&&El(t),t.flags|=1,Ye(e,t,r,o),t.child)}function uu(e,t,n,r,o){if(e===null){var s=n.type;return typeof s=="function"&&!Kl(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=s,Af(e,t,s,r,o)):(e=Ts(n.type,null,r,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!(e.lanes&o)){var i=s.memoizedProps;if(n=n.compare,n=n!==null?n:Co,n(i,r)&&e.ref===t.ref)return ln(e,t,o)}return t.flags|=1,e=An(s,r),e.ref=t.ref,e.return=t,t.child=e}function Af(e,t,n,r,o){if(e!==null){var s=e.memoizedProps;if(Co(s,r)&&e.ref===t.ref)if(ot=!1,t.pendingProps=r=s,(e.lanes&o)!==0)e.flags&131072&&(ot=!0);else return t.lanes=e.lanes,ln(e,t,o)}return _a(e,t,n,r,o)}function zf(e,t,n){var r=t.pendingProps,o=r.children,s=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},fe(wr,ft),ft|=n;else{if(!(n&1073741824))return e=s!==null?s.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,fe(wr,ft),ft|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,fe(wr,ft),ft|=r}else s!==null?(r=s.baseLanes|n,t.memoizedState=null):r=n,fe(wr,ft),ft|=r;return Ye(e,t,o,n),t.child}function Lf(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function _a(e,t,n,r,o){var s=it(n)?Qn:Ze.current;return s=Lr(t,s),br(t,o),n=Dl(e,t,n,r,s,o),r=_l(),e!==null&&!ot?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,ln(e,t,o)):(ye&&r&&El(t),t.flags|=1,Ye(e,t,n,o),t.child)}function du(e,t,n,r,o){if(it(n)){var s=!0;$s(t)}else s=!1;if(br(t,o),t.stateNode===null)Es(e,t),bf(t,n,r),Ia(t,n,r,o),r=!0;else if(e===null){var i=t.stateNode,l=t.memoizedProps;i.props=l;var a=i.context,d=n.contextType;typeof d=="object"&&d!==null?d=Ct(d):(d=it(n)?Qn:Ze.current,d=Lr(t,d));var f=n.getDerivedStateFromProps,m=typeof f=="function"||typeof i.getSnapshotBeforeUpdate=="function";m||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(l!==r||a!==d)&&su(t,i,r,d),vn=!1;var h=t.memoizedState;i.state=h,Hs(t,r,i,o),a=t.memoizedState,l!==r||h!==a||st.current||vn?(typeof f=="function"&&(La(t,n,f,r),a=t.memoizedState),(l=vn||ou(t,n,l,r,h,a,d))?(m||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=a),i.props=r,i.state=a,i.context=d,r=l):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,af(e,t),l=t.memoizedProps,d=t.type===t.elementType?l:Nt(t.type,l),i.props=d,m=t.pendingProps,h=i.context,a=n.contextType,typeof a=="object"&&a!==null?a=Ct(a):(a=it(n)?Qn:Ze.current,a=Lr(t,a));var k=n.getDerivedStateFromProps;(f=typeof k=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(l!==m||h!==a)&&su(t,i,r,a),vn=!1,h=t.memoizedState,i.state=h,Hs(t,r,i,o);var g=t.memoizedState;l!==m||h!==g||st.current||vn?(typeof k=="function"&&(La(t,n,k,r),g=t.memoizedState),(d=vn||ou(t,n,d,r,h,g,a)||!1)?(f||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,g,a),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,g,a)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||l===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=g),i.props=r,i.state=g,i.context=a,r=d):(typeof i.componentDidUpdate!="function"||l===e.memoizedProps&&h===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&h===e.memoizedState||(t.flags|=1024),r=!1)}return Ra(e,t,n,r,s,o)}function Ra(e,t,n,r,o,s){Lf(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return o&&Yc(t,n,!1),ln(e,t,s);r=t.stateNode,jm.current=t;var l=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=Dr(t,e.child,null,s),t.child=Dr(t,null,l,s)):Ye(e,t,l,s),t.memoizedState=r.state,o&&Yc(t,n,!0),t.child}function If(e){var t=e.stateNode;t.pendingContext?Qc(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Qc(e,t.context,!1),Al(e,t.containerInfo)}function fu(e,t,n,r,o){return Ir(),jl(o),t.flags|=256,Ye(e,t,n,r),t.child}var Oa={dehydrated:null,treeContext:null,retryLane:0};function $a(e){return{baseLanes:e,cachePool:null,transitions:null}}function Df(e,t,n){var r=t.pendingProps,o=xe.current,s=!1,i=(t.flags&128)!==0,l;if((l=i)||(l=e!==null&&e.memoizedState===null?!1:(o&2)!==0),l?(s=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),fe(xe,o&1),e===null)return Aa(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(i=r.children,e=r.fallback,s?(r=t.mode,s=t.child,i={mode:"hidden",children:i},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=i):s=pi(i,r,0,null),e=Gn(e,r,n,null),s.return=t,e.return=t,s.sibling=e,t.child=s,t.child.memoizedState=$a(n),t.memoizedState=Oa,e):$l(t,i));if(o=e.memoizedState,o!==null&&(l=o.dehydrated,l!==null))return Tm(e,t,i,r,l,o,n);if(s){s=r.fallback,i=t.mode,o=e.child,l=o.sibling;var a={mode:"hidden",children:r.children};return!(i&1)&&t.child!==o?(r=t.child,r.childLanes=0,r.pendingProps=a,t.deletions=null):(r=An(o,a),r.subtreeFlags=o.subtreeFlags&14680064),l!==null?s=An(l,s):(s=Gn(s,i,n,null),s.flags|=2),s.return=t,r.return=t,r.sibling=s,t.child=r,r=s,s=t.child,i=e.child.memoizedState,i=i===null?$a(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},s.memoizedState=i,s.childLanes=e.childLanes&~n,t.memoizedState=Oa,r}return s=e.child,e=s.sibling,r=An(s,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function $l(e,t){return t=pi({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function cs(e,t,n,r){return r!==null&&jl(r),Dr(t,e.child,null,n),e=$l(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Tm(e,t,n,r,o,s,i){if(n)return t.flags&256?(t.flags&=-257,r=Hi(Error(M(422))),cs(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(s=r.fallback,o=t.mode,r=pi({mode:"visible",children:r.children},o,0,null),s=Gn(s,o,i,null),s.flags|=2,r.return=t,s.return=t,r.sibling=s,t.child=r,t.mode&1&&Dr(t,e.child,null,i),t.child.memoizedState=$a(i),t.memoizedState=Oa,s);if(!(t.mode&1))return cs(e,t,i,null);if(o.data==="$!"){if(r=o.nextSibling&&o.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error(M(419)),r=Hi(s,r,void 0),cs(e,t,i,r)}if(l=(i&e.childLanes)!==0,ot||l){if(r=Ie,r!==null){switch(i&-i){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(r.suspendedLanes|i)?0:o,o!==0&&o!==s.retryLane&&(s.retryLane=o,an(e,o),Dt(r,e,o,-1))}return Ul(),r=Hi(Error(M(421))),cs(e,t,i,r)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=$m.bind(null,e),o._reactRetry=t,null):(e=s.treeContext,ht=Mn(o.nextSibling),pt=t,ye=!0,zt=null,e!==null&&(vt[wt++]=tn,vt[wt++]=nn,vt[wt++]=Yn,tn=e.id,nn=e.overflow,Yn=t),t=$l(t,r.children),t.flags|=4096,t)}function hu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),za(e.return,t,n)}function Ui(e,t,n,r,o){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:o}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=o)}function _f(e,t,n){var r=t.pendingProps,o=r.revealOrder,s=r.tail;if(Ye(e,t,r.children,n),r=xe.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&hu(e,n,t);else if(e.tag===19)hu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(fe(xe,r),!(t.mode&1))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&Us(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Ui(t,!1,o,n,s);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&Us(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}Ui(t,!0,n,null,s);break;case"together":Ui(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Es(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function ln(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),qn|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(M(153));if(t.child!==null){for(e=t.child,n=An(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=An(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Mm(e,t,n){switch(t.tag){case 3:If(t),Ir();break;case 5:lf(t);break;case 1:it(t.type)&&$s(t);break;case 4:Al(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,o=t.memoizedProps.value;fe(Vs,r._currentValue),r._currentValue=o;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(fe(xe,xe.current&1),t.flags|=128,null):n&t.child.childLanes?Df(e,t,n):(fe(xe,xe.current&1),e=ln(e,t,n),e!==null?e.sibling:null);fe(xe,xe.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return _f(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),fe(xe,xe.current),r)break;return null;case 22:case 23:return t.lanes=0,zf(e,t,n)}return ln(e,t,n)}var Rf,Fa,Of,$f;Rf=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Fa=function(){};Of=function(e,t,n,r){var o=e.memoizedProps;if(o!==r){e=t.stateNode,Hn(Ht.current);var s=null;switch(n){case"input":o=la(e,o),r=la(e,r),s=[];break;case"select":o=Se({},o,{value:void 0}),r=Se({},r,{value:void 0}),s=[];break;case"textarea":o=da(e,o),r=da(e,r),s=[];break;default:typeof o.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Rs)}ha(n,r);var i;n=null;for(d in o)if(!r.hasOwnProperty(d)&&o.hasOwnProperty(d)&&o[d]!=null)if(d==="style"){var l=o[d];for(i in l)l.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(yo.hasOwnProperty(d)?s||(s=[]):(s=s||[]).push(d,null));for(d in r){var a=r[d];if(l=o!=null?o[d]:void 0,r.hasOwnProperty(d)&&a!==l&&(a!=null||l!=null))if(d==="style")if(l){for(i in l)!l.hasOwnProperty(i)||a&&a.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in a)a.hasOwnProperty(i)&&l[i]!==a[i]&&(n||(n={}),n[i]=a[i])}else n||(s||(s=[]),s.push(d,n)),n=a;else d==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,l=l?l.__html:void 0,a!=null&&l!==a&&(s=s||[]).push(d,a)):d==="children"?typeof a!="string"&&typeof a!="number"||(s=s||[]).push(d,""+a):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(yo.hasOwnProperty(d)?(a!=null&&d==="onScroll"&&me("scroll",e),s||l===a||(s=[])):(s=s||[]).push(d,a))}n&&(s=s||[]).push("style",n);var d=s;(t.updateQueue=d)&&(t.flags|=4)}};$f=function(e,t,n,r){n!==r&&(t.flags|=4)};function eo(e,t){if(!ye)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function He(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags&14680064,r|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags,r|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function bm(e,t,n){var r=t.pendingProps;switch(Cl(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return He(t),null;case 1:return it(t.type)&&Os(),He(t),null;case 3:return r=t.stateNode,_r(),ge(st),ge(Ze),Ll(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(as(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,zt!==null&&(Ga(zt),zt=null))),Fa(e,t),He(t),null;case 5:zl(t);var o=Hn(No.current);if(n=t.type,e!==null&&t.stateNode!=null)Of(e,t,n,r,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(M(166));return He(t),null}if(e=Hn(Ht.current),as(t)){r=t.stateNode,n=t.type;var s=t.memoizedProps;switch(r[Bt]=t,r[Mo]=s,e=(t.mode&1)!==0,n){case"dialog":me("cancel",r),me("close",r);break;case"iframe":case"object":case"embed":me("load",r);break;case"video":case"audio":for(o=0;o<io.length;o++)me(io[o],r);break;case"source":me("error",r);break;case"img":case"image":case"link":me("error",r),me("load",r);break;case"details":me("toggle",r);break;case"input":Sc(r,s),me("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},me("invalid",r);break;case"textarea":Cc(r,s),me("invalid",r)}ha(n,s),o=null;for(var i in s)if(s.hasOwnProperty(i)){var l=s[i];i==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&is(r.textContent,l,e),o=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&is(r.textContent,l,e),o=["children",""+l]):yo.hasOwnProperty(i)&&l!=null&&i==="onScroll"&&me("scroll",r)}switch(n){case"input":qo(r),Ec(r,s,!0);break;case"textarea":qo(r),jc(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Rs)}r=o,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=fd(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[Bt]=t,e[Mo]=r,Rf(e,t,!1,!1),t.stateNode=e;e:{switch(i=pa(n,r),n){case"dialog":me("cancel",e),me("close",e),o=r;break;case"iframe":case"object":case"embed":me("load",e),o=r;break;case"video":case"audio":for(o=0;o<io.length;o++)me(io[o],e);o=r;break;case"source":me("error",e),o=r;break;case"img":case"image":case"link":me("error",e),me("load",e),o=r;break;case"details":me("toggle",e),o=r;break;case"input":Sc(e,r),o=la(e,r),me("invalid",e);break;case"option":o=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},o=Se({},r,{value:void 0}),me("invalid",e);break;case"textarea":Cc(e,r),o=da(e,r),me("invalid",e);break;default:o=r}ha(n,o),l=o;for(s in l)if(l.hasOwnProperty(s)){var a=l[s];s==="style"?md(e,a):s==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,a!=null&&hd(e,a)):s==="children"?typeof a=="string"?(n!=="textarea"||a!=="")&&vo(e,a):typeof a=="number"&&vo(e,""+a):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(yo.hasOwnProperty(s)?a!=null&&s==="onScroll"&&me("scroll",e):a!=null&&cl(e,s,a,i))}switch(n){case"input":qo(e),Ec(e,r,!1);break;case"textarea":qo(e),jc(e);break;case"option":r.value!=null&&e.setAttribute("value",""+zn(r.value));break;case"select":e.multiple=!!r.multiple,s=r.value,s!=null?Cr(e,!!r.multiple,s,!1):r.defaultValue!=null&&Cr(e,!!r.multiple,r.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=Rs)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return He(t),null;case 6:if(e&&t.stateNode!=null)$f(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(M(166));if(n=Hn(No.current),Hn(Ht.current),as(t)){if(r=t.stateNode,n=t.memoizedProps,r[Bt]=t,(s=r.nodeValue!==n)&&(e=pt,e!==null))switch(e.tag){case 3:is(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&is(r.nodeValue,n,(e.mode&1)!==0)}s&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Bt]=t,t.stateNode=r}return He(t),null;case 13:if(ge(xe),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ye&&ht!==null&&t.mode&1&&!(t.flags&128))nf(),Ir(),t.flags|=98560,s=!1;else if(s=as(t),r!==null&&r.dehydrated!==null){if(e===null){if(!s)throw Error(M(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(M(317));s[Bt]=t}else Ir(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;He(t),s=!1}else zt!==null&&(Ga(zt),zt=null),s=!0;if(!s)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||xe.current&1?Pe===0&&(Pe=3):Ul())),t.updateQueue!==null&&(t.flags|=4),He(t),null);case 4:return _r(),Fa(e,t),e===null&&jo(t.stateNode.containerInfo),He(t),null;case 10:return bl(t.type._context),He(t),null;case 17:return it(t.type)&&Os(),He(t),null;case 19:if(ge(xe),s=t.memoizedState,s===null)return He(t),null;if(r=(t.flags&128)!==0,i=s.rendering,i===null)if(r)eo(s,!1);else{if(Pe!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(i=Us(e),i!==null){for(t.flags|=128,eo(s,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)s=n,e=r,s.flags&=14680066,i=s.alternate,i===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=i.childLanes,s.lanes=i.lanes,s.child=i.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=i.memoizedProps,s.memoizedState=i.memoizedState,s.updateQueue=i.updateQueue,s.type=i.type,e=i.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return fe(xe,xe.current&1|2),t.child}e=e.sibling}s.tail!==null&&je()>Or&&(t.flags|=128,r=!0,eo(s,!1),t.lanes=4194304)}else{if(!r)if(e=Us(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),eo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!i.alternate&&!ye)return He(t),null}else 2*je()-s.renderingStartTime>Or&&n!==1073741824&&(t.flags|=128,r=!0,eo(s,!1),t.lanes=4194304);s.isBackwards?(i.sibling=t.child,t.child=i):(n=s.last,n!==null?n.sibling=i:t.child=i,s.last=i)}return s.tail!==null?(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=je(),t.sibling=null,n=xe.current,fe(xe,r?n&1|2:n&1),t):(He(t),null);case 22:case 23:return Hl(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?ft&1073741824&&(He(t),t.subtreeFlags&6&&(t.flags|=8192)):He(t),null;case 24:return null;case 25:return null}throw Error(M(156,t.tag))}function Nm(e,t){switch(Cl(t),t.tag){case 1:return it(t.type)&&Os(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return _r(),ge(st),ge(Ze),Ll(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return zl(t),null;case 13:if(ge(xe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(M(340));Ir()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ge(xe),null;case 4:return _r(),null;case 10:return bl(t.type._context),null;case 22:case 23:return Hl(),null;case 24:return null;default:return null}}var us=!1,Ke=!1,Pm=typeof WeakSet=="function"?WeakSet:Set,O=null;function vr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ee(e,t,r)}else n.current=null}function Ba(e,t,n){try{n()}catch(r){Ee(e,t,r)}}var pu=!1;function Am(e,t){if(Ca=Is,e=Wd(),Sl(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var o=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var i=0,l=-1,a=-1,d=0,f=0,m=e,h=null;t:for(;;){for(var k;m!==n||o!==0&&m.nodeType!==3||(l=i+o),m!==s||r!==0&&m.nodeType!==3||(a=i+r),m.nodeType===3&&(i+=m.nodeValue.length),(k=m.firstChild)!==null;)h=m,m=k;for(;;){if(m===e)break t;if(h===n&&++d===o&&(l=i),h===s&&++f===r&&(a=i),(k=m.nextSibling)!==null)break;m=h,h=m.parentNode}m=k}n=l===-1||a===-1?null:{start:l,end:a}}else n=null}n=n||{start:0,end:0}}else n=null;for(ja={focusedElem:e,selectionRange:n},Is=!1,O=t;O!==null;)if(t=O,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,O=e;else for(;O!==null;){t=O;try{var g=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var x=g.memoizedProps,P=g.memoizedState,y=t.stateNode,u=y.getSnapshotBeforeUpdate(t.elementType===t.type?x:Nt(t.type,x),P);y.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var v=t.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(M(163))}}catch(C){Ee(t,t.return,C)}if(e=t.sibling,e!==null){e.return=t.return,O=e;break}O=t.return}return g=pu,pu=!1,g}function po(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&e)===e){var s=o.destroy;o.destroy=void 0,s!==void 0&&Ba(t,n,s)}o=o.next}while(o!==r)}}function fi(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Va(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Ff(e){var t=e.alternate;t!==null&&(e.alternate=null,Ff(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Bt],delete t[Mo],delete t[ba],delete t[hm],delete t[pm])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Bf(e){return e.tag===5||e.tag===3||e.tag===4}function mu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Bf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Wa(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Rs));else if(r!==4&&(e=e.child,e!==null))for(Wa(e,t,n),e=e.sibling;e!==null;)Wa(e,t,n),e=e.sibling}function Ha(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Ha(e,t,n),e=e.sibling;e!==null;)Ha(e,t,n),e=e.sibling}var _e=null,At=!1;function mn(e,t,n){for(n=n.child;n!==null;)Vf(e,t,n),n=n.sibling}function Vf(e,t,n){if(Wt&&typeof Wt.onCommitFiberUnmount=="function")try{Wt.onCommitFiberUnmount(oi,n)}catch{}switch(n.tag){case 5:Ke||vr(n,t);case 6:var r=_e,o=At;_e=null,mn(e,t,n),_e=r,At=o,_e!==null&&(At?(e=_e,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):_e.removeChild(n.stateNode));break;case 18:_e!==null&&(At?(e=_e,n=n.stateNode,e.nodeType===8?Oi(e.parentNode,n):e.nodeType===1&&Oi(e,n),So(e)):Oi(_e,n.stateNode));break;case 4:r=_e,o=At,_e=n.stateNode.containerInfo,At=!0,mn(e,t,n),_e=r,At=o;break;case 0:case 11:case 14:case 15:if(!Ke&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){o=r=r.next;do{var s=o,i=s.destroy;s=s.tag,i!==void 0&&(s&2||s&4)&&Ba(n,t,i),o=o.next}while(o!==r)}mn(e,t,n);break;case 1:if(!Ke&&(vr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){Ee(n,t,l)}mn(e,t,n);break;case 21:mn(e,t,n);break;case 22:n.mode&1?(Ke=(r=Ke)||n.memoizedState!==null,mn(e,t,n),Ke=r):mn(e,t,n);break;default:mn(e,t,n)}}function gu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Pm),t.forEach(function(r){var o=Fm.bind(null,e,r);n.has(r)||(n.add(r),r.then(o,o))})}}function bt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var o=n[r];try{var s=e,i=t,l=i;e:for(;l!==null;){switch(l.tag){case 5:_e=l.stateNode,At=!1;break e;case 3:_e=l.stateNode.containerInfo,At=!0;break e;case 4:_e=l.stateNode.containerInfo,At=!0;break e}l=l.return}if(_e===null)throw Error(M(160));Vf(s,i,o),_e=null,At=!1;var a=o.alternate;a!==null&&(a.return=null),o.return=null}catch(d){Ee(o,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Wf(t,e),t=t.sibling}function Wf(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(bt(t,e),$t(e),r&4){try{po(3,e,e.return),fi(3,e)}catch(x){Ee(e,e.return,x)}try{po(5,e,e.return)}catch(x){Ee(e,e.return,x)}}break;case 1:bt(t,e),$t(e),r&512&&n!==null&&vr(n,n.return);break;case 5:if(bt(t,e),$t(e),r&512&&n!==null&&vr(n,n.return),e.flags&32){var o=e.stateNode;try{vo(o,"")}catch(x){Ee(e,e.return,x)}}if(r&4&&(o=e.stateNode,o!=null)){var s=e.memoizedProps,i=n!==null?n.memoizedProps:s,l=e.type,a=e.updateQueue;if(e.updateQueue=null,a!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&ud(o,s),pa(l,i);var d=pa(l,s);for(i=0;i<a.length;i+=2){var f=a[i],m=a[i+1];f==="style"?md(o,m):f==="dangerouslySetInnerHTML"?hd(o,m):f==="children"?vo(o,m):cl(o,f,m,d)}switch(l){case"input":ca(o,s);break;case"textarea":dd(o,s);break;case"select":var h=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!s.multiple;var k=s.value;k!=null?Cr(o,!!s.multiple,k,!1):h!==!!s.multiple&&(s.defaultValue!=null?Cr(o,!!s.multiple,s.defaultValue,!0):Cr(o,!!s.multiple,s.multiple?[]:"",!1))}o[Mo]=s}catch(x){Ee(e,e.return,x)}}break;case 6:if(bt(t,e),$t(e),r&4){if(e.stateNode===null)throw Error(M(162));o=e.stateNode,s=e.memoizedProps;try{o.nodeValue=s}catch(x){Ee(e,e.return,x)}}break;case 3:if(bt(t,e),$t(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{So(t.containerInfo)}catch(x){Ee(e,e.return,x)}break;case 4:bt(t,e),$t(e);break;case 13:bt(t,e),$t(e),o=e.child,o.flags&8192&&(s=o.memoizedState!==null,o.stateNode.isHidden=s,!s||o.alternate!==null&&o.alternate.memoizedState!==null||(Vl=je())),r&4&&gu(e);break;case 22:if(f=n!==null&&n.memoizedState!==null,e.mode&1?(Ke=(d=Ke)||f,bt(t,e),Ke=d):bt(t,e),$t(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!f&&e.mode&1)for(O=e,f=e.child;f!==null;){for(m=O=f;O!==null;){switch(h=O,k=h.child,h.tag){case 0:case 11:case 14:case 15:po(4,h,h.return);break;case 1:vr(h,h.return);var g=h.stateNode;if(typeof g.componentWillUnmount=="function"){r=h,n=h.return;try{t=r,g.props=t.memoizedProps,g.state=t.memoizedState,g.componentWillUnmount()}catch(x){Ee(r,n,x)}}break;case 5:vr(h,h.return);break;case 22:if(h.memoizedState!==null){vu(m);continue}}k!==null?(k.return=h,O=k):vu(m)}f=f.sibling}e:for(f=null,m=e;;){if(m.tag===5){if(f===null){f=m;try{o=m.stateNode,d?(s=o.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=m.stateNode,a=m.memoizedProps.style,i=a!=null&&a.hasOwnProperty("display")?a.display:null,l.style.display=pd("display",i))}catch(x){Ee(e,e.return,x)}}}else if(m.tag===6){if(f===null)try{m.stateNode.nodeValue=d?"":m.memoizedProps}catch(x){Ee(e,e.return,x)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;f===m&&(f=null),m=m.return}f===m&&(f=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:bt(t,e),$t(e),r&4&&gu(e);break;case 21:break;default:bt(t,e),$t(e)}}function $t(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Bf(n)){var r=n;break e}n=n.return}throw Error(M(160))}switch(r.tag){case 5:var o=r.stateNode;r.flags&32&&(vo(o,""),r.flags&=-33);var s=mu(e);Ha(e,s,o);break;case 3:case 4:var i=r.stateNode.containerInfo,l=mu(e);Wa(e,l,i);break;default:throw Error(M(161))}}catch(a){Ee(e,e.return,a)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function zm(e,t,n){O=e,Hf(e)}function Hf(e,t,n){for(var r=(e.mode&1)!==0;O!==null;){var o=O,s=o.child;if(o.tag===22&&r){var i=o.memoizedState!==null||us;if(!i){var l=o.alternate,a=l!==null&&l.memoizedState!==null||Ke;l=us;var d=Ke;if(us=i,(Ke=a)&&!d)for(O=o;O!==null;)i=O,a=i.child,i.tag===22&&i.memoizedState!==null?wu(o):a!==null?(a.return=i,O=a):wu(o);for(;s!==null;)O=s,Hf(s),s=s.sibling;O=o,us=l,Ke=d}yu(e)}else o.subtreeFlags&8772&&s!==null?(s.return=o,O=s):yu(e)}}function yu(e){for(;O!==null;){var t=O;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Ke||fi(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Ke)if(n===null)r.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:Nt(t.type,n.memoizedProps);r.componentDidUpdate(o,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=t.updateQueue;s!==null&&tu(t,s,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}tu(t,i,n)}break;case 5:var l=t.stateNode;if(n===null&&t.flags&4){n=l;var a=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":a.autoFocus&&n.focus();break;case"img":a.src&&(n.src=a.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var f=d.memoizedState;if(f!==null){var m=f.dehydrated;m!==null&&So(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(M(163))}Ke||t.flags&512&&Va(t)}catch(h){Ee(t,t.return,h)}}if(t===e){O=null;break}if(n=t.sibling,n!==null){n.return=t.return,O=n;break}O=t.return}}function vu(e){for(;O!==null;){var t=O;if(t===e){O=null;break}var n=t.sibling;if(n!==null){n.return=t.return,O=n;break}O=t.return}}function wu(e){for(;O!==null;){var t=O;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{fi(4,t)}catch(a){Ee(t,n,a)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var o=t.return;try{r.componentDidMount()}catch(a){Ee(t,o,a)}}var s=t.return;try{Va(t)}catch(a){Ee(t,s,a)}break;case 5:var i=t.return;try{Va(t)}catch(a){Ee(t,i,a)}}}catch(a){Ee(t,t.return,a)}if(t===e){O=null;break}var l=t.sibling;if(l!==null){l.return=t.return,O=l;break}O=t.return}}var Lm=Math.ceil,Gs=un.ReactCurrentDispatcher,Fl=un.ReactCurrentOwner,Et=un.ReactCurrentBatchConfig,ee=0,Ie=null,Te=null,Oe=0,ft=0,wr=_n(0),Pe=0,Lo=null,qn=0,hi=0,Bl=0,mo=null,rt=null,Vl=0,Or=1/0,Jt=null,Qs=!1,Ua=null,Nn=null,ds=!1,Sn=null,Ys=0,go=0,Ka=null,Cs=-1,js=0;function Xe(){return ee&6?je():Cs!==-1?Cs:Cs=je()}function Pn(e){return e.mode&1?ee&2&&Oe!==0?Oe&-Oe:gm.transition!==null?(js===0&&(js=Md()),js):(e=ie,e!==0||(e=window.event,e=e===void 0?16:Id(e.type)),e):1}function Dt(e,t,n,r){if(50<go)throw go=0,Ka=null,Error(M(185));$o(e,n,r),(!(ee&2)||e!==Ie)&&(e===Ie&&(!(ee&2)&&(hi|=n),Pe===4&&xn(e,Oe)),at(e,r),n===1&&ee===0&&!(t.mode&1)&&(Or=je()+500,ci&&Rn()))}function at(e,t){var n=e.callbackNode;gp(e,t);var r=Ls(e,e===Ie?Oe:0);if(r===0)n!==null&&bc(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&bc(n),t===1)e.tag===0?mm(xu.bind(null,e)):Jd(xu.bind(null,e)),dm(function(){!(ee&6)&&Rn()}),n=null;else{switch(bd(r)){case 1:n=pl;break;case 4:n=jd;break;case 16:n=zs;break;case 536870912:n=Td;break;default:n=zs}n=qf(n,Uf.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Uf(e,t){if(Cs=-1,js=0,ee&6)throw Error(M(327));var n=e.callbackNode;if(Nr()&&e.callbackNode!==n)return null;var r=Ls(e,e===Ie?Oe:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=Xs(e,r);else{t=r;var o=ee;ee|=2;var s=Zf();(Ie!==e||Oe!==t)&&(Jt=null,Or=je()+500,Zn(e,t));do try{_m();break}catch(l){Kf(e,l)}while(!0);Ml(),Gs.current=s,ee=o,Te!==null?t=0:(Ie=null,Oe=0,t=Pe)}if(t!==0){if(t===2&&(o=wa(e),o!==0&&(r=o,t=Za(e,o))),t===1)throw n=Lo,Zn(e,0),xn(e,r),at(e,je()),n;if(t===6)xn(e,r);else{if(o=e.current.alternate,!(r&30)&&!Im(o)&&(t=Xs(e,r),t===2&&(s=wa(e),s!==0&&(r=s,t=Za(e,s))),t===1))throw n=Lo,Zn(e,0),xn(e,r),at(e,je()),n;switch(e.finishedWork=o,e.finishedLanes=r,t){case 0:case 1:throw Error(M(345));case 2:$n(e,rt,Jt);break;case 3:if(xn(e,r),(r&130023424)===r&&(t=Vl+500-je(),10<t)){if(Ls(e,0)!==0)break;if(o=e.suspendedLanes,(o&r)!==r){Xe(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Ma($n.bind(null,e,rt,Jt),t);break}$n(e,rt,Jt);break;case 4:if(xn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,o=-1;0<r;){var i=31-It(r);s=1<<i,i=t[i],i>o&&(o=i),r&=~s}if(r=o,r=je()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Lm(r/1960))-r,10<r){e.timeoutHandle=Ma($n.bind(null,e,rt,Jt),r);break}$n(e,rt,Jt);break;case 5:$n(e,rt,Jt);break;default:throw Error(M(329))}}}return at(e,je()),e.callbackNode===n?Uf.bind(null,e):null}function Za(e,t){var n=mo;return e.current.memoizedState.isDehydrated&&(Zn(e,t).flags|=256),e=Xs(e,t),e!==2&&(t=rt,rt=n,t!==null&&Ga(t)),e}function Ga(e){rt===null?rt=e:rt.push.apply(rt,e)}function Im(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var o=n[r],s=o.getSnapshot;o=o.value;try{if(!Rt(s(),o))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function xn(e,t){for(t&=~Bl,t&=~hi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-It(t),r=1<<n;e[n]=-1,t&=~r}}function xu(e){if(ee&6)throw Error(M(327));Nr();var t=Ls(e,0);if(!(t&1))return at(e,je()),null;var n=Xs(e,t);if(e.tag!==0&&n===2){var r=wa(e);r!==0&&(t=r,n=Za(e,r))}if(n===1)throw n=Lo,Zn(e,0),xn(e,t),at(e,je()),n;if(n===6)throw Error(M(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,$n(e,rt,Jt),at(e,je()),null}function Wl(e,t){var n=ee;ee|=1;try{return e(t)}finally{ee=n,ee===0&&(Or=je()+500,ci&&Rn())}}function Jn(e){Sn!==null&&Sn.tag===0&&!(ee&6)&&Nr();var t=ee;ee|=1;var n=Et.transition,r=ie;try{if(Et.transition=null,ie=1,e)return e()}finally{ie=r,Et.transition=n,ee=t,!(ee&6)&&Rn()}}function Hl(){ft=wr.current,ge(wr)}function Zn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,um(n)),Te!==null)for(n=Te.return;n!==null;){var r=n;switch(Cl(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Os();break;case 3:_r(),ge(st),ge(Ze),Ll();break;case 5:zl(r);break;case 4:_r();break;case 13:ge(xe);break;case 19:ge(xe);break;case 10:bl(r.type._context);break;case 22:case 23:Hl()}n=n.return}if(Ie=e,Te=e=An(e.current,null),Oe=ft=t,Pe=0,Lo=null,Bl=hi=qn=0,rt=mo=null,Wn!==null){for(t=0;t<Wn.length;t++)if(n=Wn[t],r=n.interleaved,r!==null){n.interleaved=null;var o=r.next,s=n.pending;if(s!==null){var i=s.next;s.next=o,r.next=i}n.pending=r}Wn=null}return e}function Kf(e,t){do{var n=Te;try{if(Ml(),ks.current=Zs,Ks){for(var r=ke.memoizedState;r!==null;){var o=r.queue;o!==null&&(o.pending=null),r=r.next}Ks=!1}if(Xn=0,Le=Ne=ke=null,ho=!1,Po=0,Fl.current=null,n===null||n.return===null){Pe=1,Lo=t,Te=null;break}e:{var s=e,i=n.return,l=n,a=t;if(t=Oe,l.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){var d=a,f=l,m=f.tag;if(!(f.mode&1)&&(m===0||m===11||m===15)){var h=f.alternate;h?(f.updateQueue=h.updateQueue,f.memoizedState=h.memoizedState,f.lanes=h.lanes):(f.updateQueue=null,f.memoizedState=null)}var k=au(i);if(k!==null){k.flags&=-257,lu(k,i,l,s,t),k.mode&1&&iu(s,d,t),t=k,a=d;var g=t.updateQueue;if(g===null){var x=new Set;x.add(a),t.updateQueue=x}else g.add(a);break e}else{if(!(t&1)){iu(s,d,t),Ul();break e}a=Error(M(426))}}else if(ye&&l.mode&1){var P=au(i);if(P!==null){!(P.flags&65536)&&(P.flags|=256),lu(P,i,l,s,t),jl(Rr(a,l));break e}}s=a=Rr(a,l),Pe!==4&&(Pe=2),mo===null?mo=[s]:mo.push(s),s=i;do{switch(s.tag){case 3:s.flags|=65536,t&=-t,s.lanes|=t;var y=Nf(s,a,t);eu(s,y);break e;case 1:l=a;var u=s.type,v=s.stateNode;if(!(s.flags&128)&&(typeof u.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(Nn===null||!Nn.has(v)))){s.flags|=65536,t&=-t,s.lanes|=t;var C=Pf(s,l,t);eu(s,C);break e}}s=s.return}while(s!==null)}Qf(n)}catch(z){t=z,Te===n&&n!==null&&(Te=n=n.return);continue}break}while(!0)}function Zf(){var e=Gs.current;return Gs.current=Zs,e===null?Zs:e}function Ul(){(Pe===0||Pe===3||Pe===2)&&(Pe=4),Ie===null||!(qn&268435455)&&!(hi&268435455)||xn(Ie,Oe)}function Xs(e,t){var n=ee;ee|=2;var r=Zf();(Ie!==e||Oe!==t)&&(Jt=null,Zn(e,t));do try{Dm();break}catch(o){Kf(e,o)}while(!0);if(Ml(),ee=n,Gs.current=r,Te!==null)throw Error(M(261));return Ie=null,Oe=0,Pe}function Dm(){for(;Te!==null;)Gf(Te)}function _m(){for(;Te!==null&&!ap();)Gf(Te)}function Gf(e){var t=Xf(e.alternate,e,ft);e.memoizedProps=e.pendingProps,t===null?Qf(e):Te=t,Fl.current=null}function Qf(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Nm(n,t),n!==null){n.flags&=32767,Te=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Pe=6,Te=null;return}}else if(n=bm(n,t,ft),n!==null){Te=n;return}if(t=t.sibling,t!==null){Te=t;return}Te=t=e}while(t!==null);Pe===0&&(Pe=5)}function $n(e,t,n){var r=ie,o=Et.transition;try{Et.transition=null,ie=1,Rm(e,t,n,r)}finally{Et.transition=o,ie=r}return null}function Rm(e,t,n,r){do Nr();while(Sn!==null);if(ee&6)throw Error(M(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(M(177));e.callbackNode=null,e.callbackPriority=0;var s=n.lanes|n.childLanes;if(yp(e,s),e===Ie&&(Te=Ie=null,Oe=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ds||(ds=!0,qf(zs,function(){return Nr(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Et.transition,Et.transition=null;var i=ie;ie=1;var l=ee;ee|=4,Fl.current=null,Am(e,n),Wf(n,e),rm(ja),Is=!!Ca,ja=Ca=null,e.current=n,zm(n),lp(),ee=l,ie=i,Et.transition=s}else e.current=n;if(ds&&(ds=!1,Sn=e,Ys=o),s=e.pendingLanes,s===0&&(Nn=null),dp(n.stateNode),at(e,je()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],r(o.value,{componentStack:o.stack,digest:o.digest});if(Qs)throw Qs=!1,e=Ua,Ua=null,e;return Ys&1&&e.tag!==0&&Nr(),s=e.pendingLanes,s&1?e===Ka?go++:(go=0,Ka=e):go=0,Rn(),null}function Nr(){if(Sn!==null){var e=bd(Ys),t=Et.transition,n=ie;try{if(Et.transition=null,ie=16>e?16:e,Sn===null)var r=!1;else{if(e=Sn,Sn=null,Ys=0,ee&6)throw Error(M(331));var o=ee;for(ee|=4,O=e.current;O!==null;){var s=O,i=s.child;if(O.flags&16){var l=s.deletions;if(l!==null){for(var a=0;a<l.length;a++){var d=l[a];for(O=d;O!==null;){var f=O;switch(f.tag){case 0:case 11:case 15:po(8,f,s)}var m=f.child;if(m!==null)m.return=f,O=m;else for(;O!==null;){f=O;var h=f.sibling,k=f.return;if(Ff(f),f===d){O=null;break}if(h!==null){h.return=k,O=h;break}O=k}}}var g=s.alternate;if(g!==null){var x=g.child;if(x!==null){g.child=null;do{var P=x.sibling;x.sibling=null,x=P}while(x!==null)}}O=s}}if(s.subtreeFlags&2064&&i!==null)i.return=s,O=i;else e:for(;O!==null;){if(s=O,s.flags&2048)switch(s.tag){case 0:case 11:case 15:po(9,s,s.return)}var y=s.sibling;if(y!==null){y.return=s.return,O=y;break e}O=s.return}}var u=e.current;for(O=u;O!==null;){i=O;var v=i.child;if(i.subtreeFlags&2064&&v!==null)v.return=i,O=v;else e:for(i=u;O!==null;){if(l=O,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:fi(9,l)}}catch(z){Ee(l,l.return,z)}if(l===i){O=null;break e}var C=l.sibling;if(C!==null){C.return=l.return,O=C;break e}O=l.return}}if(ee=o,Rn(),Wt&&typeof Wt.onPostCommitFiberRoot=="function")try{Wt.onPostCommitFiberRoot(oi,e)}catch{}r=!0}return r}finally{ie=n,Et.transition=t}}return!1}function ku(e,t,n){t=Rr(n,t),t=Nf(e,t,1),e=bn(e,t,1),t=Xe(),e!==null&&($o(e,1,t),at(e,t))}function Ee(e,t,n){if(e.tag===3)ku(e,e,n);else for(;t!==null;){if(t.tag===3){ku(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Nn===null||!Nn.has(r))){e=Rr(n,e),e=Pf(t,e,1),t=bn(t,e,1),e=Xe(),t!==null&&($o(t,1,e),at(t,e));break}}t=t.return}}function Om(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Xe(),e.pingedLanes|=e.suspendedLanes&n,Ie===e&&(Oe&n)===n&&(Pe===4||Pe===3&&(Oe&130023424)===Oe&&500>je()-Vl?Zn(e,0):Bl|=n),at(e,t)}function Yf(e,t){t===0&&(e.mode&1?(t=ts,ts<<=1,!(ts&130023424)&&(ts=4194304)):t=1);var n=Xe();e=an(e,t),e!==null&&($o(e,t,n),at(e,n))}function $m(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Yf(e,n)}function Fm(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(M(314))}r!==null&&r.delete(t),Yf(e,n)}var Xf;Xf=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||st.current)ot=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return ot=!1,Mm(e,t,n);ot=!!(e.flags&131072)}else ot=!1,ye&&t.flags&1048576&&ef(t,Bs,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Es(e,t),e=t.pendingProps;var o=Lr(t,Ze.current);br(t,n),o=Dl(null,t,r,e,o,n);var s=_l();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,it(r)?(s=!0,$s(t)):s=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,Pl(t),o.updater=di,t.stateNode=o,o._reactInternals=t,Ia(t,r,e,n),t=Ra(null,t,r,!0,s,n)):(t.tag=0,ye&&s&&El(t),Ye(null,t,o,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Es(e,t),e=t.pendingProps,o=r._init,r=o(r._payload),t.type=r,o=t.tag=Vm(r),e=Nt(r,e),o){case 0:t=_a(null,t,r,e,n);break e;case 1:t=du(null,t,r,e,n);break e;case 11:t=cu(null,t,r,e,n);break e;case 14:t=uu(null,t,r,Nt(r.type,e),n);break e}throw Error(M(306,r,""))}return t;case 0:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Nt(r,o),_a(e,t,r,o,n);case 1:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Nt(r,o),du(e,t,r,o,n);case 3:e:{if(If(t),e===null)throw Error(M(387));r=t.pendingProps,s=t.memoizedState,o=s.element,af(e,t),Hs(t,r,null,n);var i=t.memoizedState;if(r=i.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){o=Rr(Error(M(423)),t),t=fu(e,t,r,n,o);break e}else if(r!==o){o=Rr(Error(M(424)),t),t=fu(e,t,r,n,o);break e}else for(ht=Mn(t.stateNode.containerInfo.firstChild),pt=t,ye=!0,zt=null,n=of(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ir(),r===o){t=ln(e,t,n);break e}Ye(e,t,r,n)}t=t.child}return t;case 5:return lf(t),e===null&&Aa(t),r=t.type,o=t.pendingProps,s=e!==null?e.memoizedProps:null,i=o.children,Ta(r,o)?i=null:s!==null&&Ta(r,s)&&(t.flags|=32),Lf(e,t),Ye(e,t,i,n),t.child;case 6:return e===null&&Aa(t),null;case 13:return Df(e,t,n);case 4:return Al(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Dr(t,null,r,n):Ye(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Nt(r,o),cu(e,t,r,o,n);case 7:return Ye(e,t,t.pendingProps,n),t.child;case 8:return Ye(e,t,t.pendingProps.children,n),t.child;case 12:return Ye(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,s=t.memoizedProps,i=o.value,fe(Vs,r._currentValue),r._currentValue=i,s!==null)if(Rt(s.value,i)){if(s.children===o.children&&!st.current){t=ln(e,t,n);break e}}else for(s=t.child,s!==null&&(s.return=t);s!==null;){var l=s.dependencies;if(l!==null){i=s.child;for(var a=l.firstContext;a!==null;){if(a.context===r){if(s.tag===1){a=rn(-1,n&-n),a.tag=2;var d=s.updateQueue;if(d!==null){d=d.shared;var f=d.pending;f===null?a.next=a:(a.next=f.next,f.next=a),d.pending=a}}s.lanes|=n,a=s.alternate,a!==null&&(a.lanes|=n),za(s.return,n,t),l.lanes|=n;break}a=a.next}}else if(s.tag===10)i=s.type===t.type?null:s.child;else if(s.tag===18){if(i=s.return,i===null)throw Error(M(341));i.lanes|=n,l=i.alternate,l!==null&&(l.lanes|=n),za(i,n,t),i=s.sibling}else i=s.child;if(i!==null)i.return=s;else for(i=s;i!==null;){if(i===t){i=null;break}if(s=i.sibling,s!==null){s.return=i.return,i=s;break}i=i.return}s=i}Ye(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=t.pendingProps.children,br(t,n),o=Ct(o),r=r(o),t.flags|=1,Ye(e,t,r,n),t.child;case 14:return r=t.type,o=Nt(r,t.pendingProps),o=Nt(r.type,o),uu(e,t,r,o,n);case 15:return Af(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:Nt(r,o),Es(e,t),t.tag=1,it(r)?(e=!0,$s(t)):e=!1,br(t,n),bf(t,r,o),Ia(t,r,o,n),Ra(null,t,r,!0,e,n);case 19:return _f(e,t,n);case 22:return zf(e,t,n)}throw Error(M(156,t.tag))};function qf(e,t){return Cd(e,t)}function Bm(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function kt(e,t,n,r){return new Bm(e,t,n,r)}function Kl(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Vm(e){if(typeof e=="function")return Kl(e)?1:0;if(e!=null){if(e=e.$$typeof,e===dl)return 11;if(e===fl)return 14}return 2}function An(e,t){var n=e.alternate;return n===null?(n=kt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ts(e,t,n,r,o,s){var i=2;if(r=e,typeof e=="function")Kl(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case cr:return Gn(n.children,o,s,t);case ul:i=8,o|=8;break;case oa:return e=kt(12,n,t,o|2),e.elementType=oa,e.lanes=s,e;case sa:return e=kt(13,n,t,o),e.elementType=sa,e.lanes=s,e;case ia:return e=kt(19,n,t,o),e.elementType=ia,e.lanes=s,e;case ad:return pi(n,o,s,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case sd:i=10;break e;case id:i=9;break e;case dl:i=11;break e;case fl:i=14;break e;case yn:i=16,r=null;break e}throw Error(M(130,e==null?e:typeof e,""))}return t=kt(i,n,t,o),t.elementType=e,t.type=r,t.lanes=s,t}function Gn(e,t,n,r){return e=kt(7,e,r,t),e.lanes=n,e}function pi(e,t,n,r){return e=kt(22,e,r,t),e.elementType=ad,e.lanes=n,e.stateNode={isHidden:!1},e}function Ki(e,t,n){return e=kt(6,e,null,t),e.lanes=n,e}function Zi(e,t,n){return t=kt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Wm(e,t,n,r,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Mi(0),this.expirationTimes=Mi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Mi(0),this.identifierPrefix=r,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function Zl(e,t,n,r,o,s,i,l,a){return e=new Wm(e,t,n,l,a),t===1?(t=1,s===!0&&(t|=8)):t=0,s=kt(3,null,null,t),e.current=s,s.stateNode=e,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Pl(s),e}function Hm(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:lr,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Jf(e){if(!e)return Ln;e=e._reactInternals;e:{if(nr(e)!==e||e.tag!==1)throw Error(M(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(it(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(M(171))}if(e.tag===1){var n=e.type;if(it(n))return qd(e,n,t)}return t}function eh(e,t,n,r,o,s,i,l,a){return e=Zl(n,r,!0,e,o,s,i,l,a),e.context=Jf(null),n=e.current,r=Xe(),o=Pn(n),s=rn(r,o),s.callback=t??null,bn(n,s,o),e.current.lanes=o,$o(e,o,r),at(e,r),e}function mi(e,t,n,r){var o=t.current,s=Xe(),i=Pn(o);return n=Jf(n),t.context===null?t.context=n:t.pendingContext=n,t=rn(s,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=bn(o,t,i),e!==null&&(Dt(e,o,i,s),xs(e,o,i)),i}function qs(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Su(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Gl(e,t){Su(e,t),(e=e.alternate)&&Su(e,t)}function Um(){return null}var th=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ql(e){this._internalRoot=e}gi.prototype.render=Ql.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(M(409));mi(e,t,null,null)};gi.prototype.unmount=Ql.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Jn(function(){mi(null,e,null,null)}),t[sn]=null}};function gi(e){this._internalRoot=e}gi.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ad();e={blockedOn:null,target:e,priority:t};for(var n=0;n<wn.length&&t!==0&&t<wn[n].priority;n++);wn.splice(n,0,e),n===0&&Ld(e)}};function Yl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function yi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Eu(){}function Km(e,t,n,r,o){if(o){if(typeof r=="function"){var s=r;r=function(){var d=qs(i);s.call(d)}}var i=eh(t,r,e,0,null,!1,!1,"",Eu);return e._reactRootContainer=i,e[sn]=i.current,jo(e.nodeType===8?e.parentNode:e),Jn(),i}for(;o=e.lastChild;)e.removeChild(o);if(typeof r=="function"){var l=r;r=function(){var d=qs(a);l.call(d)}}var a=Zl(e,0,!1,null,null,!1,!1,"",Eu);return e._reactRootContainer=a,e[sn]=a.current,jo(e.nodeType===8?e.parentNode:e),Jn(function(){mi(t,a,n,r)}),a}function vi(e,t,n,r,o){var s=n._reactRootContainer;if(s){var i=s;if(typeof o=="function"){var l=o;o=function(){var a=qs(i);l.call(a)}}mi(t,i,e,o)}else i=Km(n,t,e,o,r);return qs(i)}Nd=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=so(t.pendingLanes);n!==0&&(ml(t,n|1),at(t,je()),!(ee&6)&&(Or=je()+500,Rn()))}break;case 13:Jn(function(){var r=an(e,1);if(r!==null){var o=Xe();Dt(r,e,1,o)}}),Gl(e,1)}};gl=function(e){if(e.tag===13){var t=an(e,134217728);if(t!==null){var n=Xe();Dt(t,e,134217728,n)}Gl(e,134217728)}};Pd=function(e){if(e.tag===13){var t=Pn(e),n=an(e,t);if(n!==null){var r=Xe();Dt(n,e,t,r)}Gl(e,t)}};Ad=function(){return ie};zd=function(e,t){var n=ie;try{return ie=e,t()}finally{ie=n}};ga=function(e,t,n){switch(t){case"input":if(ca(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=li(r);if(!o)throw Error(M(90));cd(r),ca(r,o)}}}break;case"textarea":dd(e,n);break;case"select":t=n.value,t!=null&&Cr(e,!!n.multiple,t,!1)}};vd=Wl;wd=Jn;var Zm={usingClientEntryPoint:!1,Events:[Bo,hr,li,gd,yd,Wl]},to={findFiberByHostInstance:Vn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Gm={bundleType:to.bundleType,version:to.version,rendererPackageName:to.rendererPackageName,rendererConfig:to.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:un.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Sd(e),e===null?null:e.stateNode},findFiberByHostInstance:to.findFiberByHostInstance||Um,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var fs=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!fs.isDisabled&&fs.supportsFiber)try{oi=fs.inject(Gm),Wt=fs}catch{}}gt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Zm;gt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Yl(t))throw Error(M(200));return Hm(e,t,null,n)};gt.createRoot=function(e,t){if(!Yl(e))throw Error(M(299));var n=!1,r="",o=th;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=Zl(e,1,!1,null,null,n,!1,r,o),e[sn]=t.current,jo(e.nodeType===8?e.parentNode:e),new Ql(t)};gt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(M(188)):(e=Object.keys(e).join(","),Error(M(268,e)));return e=Sd(t),e=e===null?null:e.stateNode,e};gt.flushSync=function(e){return Jn(e)};gt.hydrate=function(e,t,n){if(!yi(t))throw Error(M(200));return vi(null,e,t,!0,n)};gt.hydrateRoot=function(e,t,n){if(!Yl(e))throw Error(M(405));var r=n!=null&&n.hydratedSources||null,o=!1,s="",i=th;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=eh(t,null,e,1,n??null,o,!1,s,i),e[sn]=t.current,jo(e),r)for(e=0;e<r.length;e++)n=r[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new gi(t)};gt.render=function(e,t,n){if(!yi(t))throw Error(M(200));return vi(null,e,t,!1,n)};gt.unmountComponentAtNode=function(e){if(!yi(e))throw Error(M(40));return e._reactRootContainer?(Jn(function(){vi(null,null,e,!1,function(){e._reactRootContainer=null,e[sn]=null})}),!0):!1};gt.unstable_batchedUpdates=Wl;gt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!yi(n))throw Error(M(200));if(e==null||e._reactInternals===void 0)throw Error(M(38));return vi(e,t,n,!1,r)};gt.version="18.3.1-next-f1338f8080-20240426";function nh(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(nh)}catch(e){console.error(e)}}nh(),td.exports=gt;var rh=td.exports;const jy=Wu(rh);var oh,Cu=rh;oh=Cu.createRoot,Cu.hydrateRoot;const Qm="modulepreload",Ym=function(e,t){return new URL(e,t).href},ju={},sh=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){const i=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),a=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));o=Promise.allSettled(n.map(d=>{if(d=Ym(d,r),d in ju)return;ju[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!r)for(let g=i.length-1;g>=0;g--){const x=i[g];if(x.href===d&&(!f||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const k=document.createElement("link");if(k.rel=f?"stylesheet":Qm,f||(k.as="script"),k.crossOrigin="",k.href=d,a&&k.setAttribute("nonce",a),document.head.appendChild(k),f)return new Promise((g,x)=>{k.addEventListener("load",g),k.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(i){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=i,window.dispatchEvent(l),!l.defaultPrevented)throw i}return o.then(i=>{for(const l of i||[])l.status==="rejected"&&s(l.reason);return t().catch(s)})},Ce=32,Tu=.82,Xm=Math.cos(Math.PI/6),qm=.5,Jm=new Set(["area","circleArea","text"]);function Vt(e){return Jm.has(e.kind)?!0:e.kind==="image"?e.imageStyle==="flat":!1}function Xl(e,t,n){switch(n){case 1:return{x:-t,y:e};case 2:return{x:-e,y:-t};case 3:return{x:t,y:-e};default:return{x:e,y:t}}}class Io{constructor(t,n){this.mode=t,this.rotation=n}project(t,n,r=0){if(this.mode==="2d")return{x:t*Ce,y:n*Ce};const o=Xl(t,n,this.rotation);return{x:(o.x-o.y)*Ce*Xm,y:(o.x+o.y)*Ce*qm-r*Ce*Tu}}groundMatrix(t=0){const n=this.project(0,0,t),r=this.project(1,0,t),o=this.project(0,1,t);return[r.x-n.x,r.y-n.y,o.x-n.x,o.y-n.y,n.x,n.y]}unproject(t,n,r=0){const[o,s,i,l,a,d]=this.groundMatrix(r),f=o*l-s*i,m=t-a,h=n-d;return{x:(l*m-i*h)/f,y:(-s*m+o*h)/f}}get heightScale(){return this.mode==="2d"?0:Ce*Tu}}function eg(e){const t=e.project(0,0),n=[{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}];let r=0,o=-1/0,s=-1/0;return n.forEach((i,l)=>{const a=e.project(i.x,i.y),d=a.x-t.x,f=a.y-t.y;(d>o+1e-6||Math.abs(d-o)<=1e-6&&f>s)&&(r=l,o=d,s=f)}),r}function tg(e){const t=e.project(0,0),n=e.project(1,0),r=n.x-t.x,o=n.y-t.y;return r<-1e-6||Math.abs(r)<=1e-6&&o<0?2:0}function ng(e){return`matrix(${e.map(t=>+t.toFixed(5)).join(" ")})`}function Mu(e,t,n=0){const r=e.x+e.w/2,o=e.y+e.d/2,s=[];for(let i=0;i<t;i++){const l=n+i/t*Math.PI*2;s.push({x:r+Math.cos(l)*e.w/2,y:o+Math.sin(l)*e.d/2})}return s}function Do(e){return[{x:e.x,y:e.y},{x:e.x+e.w,y:e.y},{x:e.x+e.w,y:e.y+e.d},{x:e.x,y:e.y+e.d}]}function Re(e){switch(e.kind){case"cylinder":case"cone":case"circleArea":case"sphere":return Mu(e,40);case"hexagon":return Mu(e,6);default:return Do(e)}}function Gi(e){let t=0;for(let n=0;n<e.length;n++){const r=e[n],o=e[(n+1)%e.length];t+=r.x*o.y-o.x*r.y}return t/2}function bu(e,t,n,r){const o=Xl(t,n,e.rotation),s=Math.hypot(o.x,o.y,r)||1,l=.74+.12*((o.y-o.x)/Math.SQRT2/s);return l+(1-l)*Math.max(0,r/s)*.75}function rg(e,t){const n=Re(e),r=e.z,o=e.z+Math.max(0,e.h),s=e.x+e.w/2,i=e.y+e.d/2,l=n.map(f=>t.project(f.x,f.y,o)),a=Math.sign(Gi(l))||1,d=[];if(e.kind==="pyramid"||e.kind==="cone"){const f=t.project(s,i,o),m=n.map(h=>t.project(h.x,h.y,r));t.mode==="2d"&&d.push({points:m,light:.9});for(let h=0;h<n.length;h++){const k=(h+1)%n.length,g=[m[h],m[k],f],x=Gi(g);if(Math.sign(x)!==a||Math.abs(x)<.01)continue;const P=n[k].x-n[h].x;let u=n[k].y-n[h].y,v=-P;const C=(n[h].x+n[k].x)/2-s,z=(n[h].y+n[k].y)/2-i;u*C+v*z<0&&(u=-u,v=-v);const D=Math.hypot(C,z)||1,L=Math.hypot(u,v)||1,B=D/Math.max(.01,o-r);d.push({points:g,light:bu(t,u/L,v/L,B)})}return d}for(let f=0;f<n.length;f++){const m=(f+1)%n.length,h=[t.project(n[f].x,n[f].y,r),t.project(n[m].x,n[m].y,r),t.project(n[m].x,n[m].y,o),t.project(n[f].x,n[f].y,o)],k=Gi(h);if(Math.sign(k)!==a||Math.abs(k)<.01)continue;const g=n[m].x-n[f].x;let P=n[m].y-n[f].y,y=-g;P*((n[f].x+n[m].x)/2-s)+y*((n[f].y+n[m].y)/2-i)<0&&(P=-P,y=-y),d.push({points:h,light:bu(t,P,y,0)})}return d.push({points:l,light:1}),d}function ih(e){const t=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim());if(!t)return null;let n=t[1];return n.length===3&&(n=n.split("").map(r=>r+r).join("")),[parseInt(n.slice(0,2),16),parseInt(n.slice(2,4),16),parseInt(n.slice(4,6),16)]}function In(e,t){const n=ih(e);return n?`#${n.map(o=>{const s=t<=1?o*t:o+(255-o)*(t-1);return Math.max(0,Math.min(255,Math.round(s)))}).map(o=>o.toString(16).padStart(2,"0")).join("")}`:e}function og(e){const t=ih(e);if(!t)return"#1f2937";const[n,r,o]=t;return .299*n+.587*r+.114*o>160?"#1f2937":"#ffffff"}function sg(e,t){const n=Do(e).map(s=>Xl(s.x,s.y,t)),r=n.map(s=>s.x),o=n.map(s=>s.y);return{minX:Math.min(...r),maxX:Math.max(...r),minY:Math.min(...o),maxY:Math.max(...o),minZ:e.z,maxZ:e.z+(Vt(e)?0:Math.max(.01,e.h))}}const Fn=1e-6;function ig(e,t){return e.maxX<=t.minX+Fn?!0:t.maxX<=e.minX+Fn?!1:e.maxY<=t.minY+Fn?!0:t.maxY<=e.minY+Fn?!1:e.maxZ<=t.minZ+Fn?!0:t.maxZ<=e.minZ+Fn?!1:null}function ag(e,t){if(t.mode==="2d")return e.map((f,m)=>({n:f,i:m})).sort((f,m)=>f.n.z+f.n.h-(m.n.z+m.n.h)||f.i-m.i).map(f=>f.n);const n=e.map(f=>sg(f,t.rotation)),r=e.length,o=e.map(()=>[]),s=new Array(r).fill(0);for(let f=0;f<r;f++)for(let m=f+1;m<r;m++){const h=ig(n[f],n[m]);if(h===null)continue;const[k,g]=h?[f,m]:[m,f];o[k].push(g),s[g]++}const i=f=>(n[f].minX+n[f].maxX+n[f].minY+n[f].maxY)/2+n[f].minZ*.01,l=[...Array(r).keys()].filter(f=>s[f]===0),a=[],d=new Array(r).fill(!1);for(;a.length<r;){if(l.length===0){let m=-1;for(let h=0;h<r;h++)!d[h]&&(m<0||i(h)<i(m))&&(m=h);l.push(m),s[m]=0}l.sort((m,h)=>i(m)-i(h));const f=l.shift();if(!d[f]){d[f]=!0,a.push(f);for(const m of o[f])--s[m]===0&&!d[m]&&l.push(m)}}return a.map(f=>e[f])}function Ae(e){return{x:e.x+e.w/2,y:e.y+e.d/2}}function Nu(e,t,n,r=.15){const o=n.x-r,s=n.x+n.w+r,i=n.y-r,l=n.y+n.d+r,a=t.x-e.x,d=t.y-e.y;let f=0,m=1;const h=(k,g)=>{if(Math.abs(k)<Fn)return g>=0;const x=g/k;return k<0?f=Math.max(f,x):m=Math.min(m,x),!0};return h(-a,e.x-o)&&h(a,s-e.x)&&h(-d,e.y-i)&&h(d,l-e.y)&&f<=m?{x:e.x+a*f,y:e.y+d*f}:t}function Pt(e,t){return t>0?Math.round(e/t)*t:e}function Lt(e){return e.map(t=>`${+t.x.toFixed(2)},${+t.y.toFixed(2)}`).join(" ")}let Qi=0;function xr(e="n"){return Qi=(Qi+1)%1e6,`${e}_${Date.now().toString(36)}${Qi.toString(36)}${Math.random().toString(36).slice(2,6)}`}const cn=e=>e.kind==="area"||e.kind==="circleArea",Bn=1e-6;function Pu(e,t){if(e.kind==="circleArea"){const n=(t.x-(e.x+e.w/2))/(e.w/2),r=(t.y-(e.y+e.d/2))/(e.d/2);return n*n+r*r<=1+Bn}return t.x>=e.x-Bn&&t.x<=e.x+e.w+Bn&&t.y>=e.y-Bn&&t.y<=e.y+e.d+Bn}function lg(e,t){return e.id===t.id||!cn(e)||e.z>t.z+Bn?!1:cn(t)?e.w*e.d<=t.w*t.d+Bn?!1:Do(t).every(n=>Pu(e,n)):Pu(e,Ae(t))}function En(e,t,n){let r;for(const o of t)n!=null&&n.has(o.id)||!lg(o,e)||(!r||o.w*o.d<r.w*r.d)&&(r=o);return r}function ql(e){const t=new Map;for(const n of e){const r=En(n,e);r&&t.set(n.id,r.id)}return t}function kr(e,t,n=ql(t)){const r=new Map;for(const[i,l]of n)r.has(l)||r.set(l,[]),r.get(l).push(i);const o=new Set,s=[...e];for(;s.length;)for(const i of r.get(s.pop())??[])o.has(i)||(o.add(i),s.push(i));return o}function cg(e,t=ql(e)){const n=new Map,r=o=>{const s=n.get(o);if(s!==void 0)return s;const i=t.get(o),l=i?r(i)+1:0;return n.set(o,l),l};return e.forEach(o=>r(o.id)),n}function Au(e,t=1){const n=Math.floor((Math.min(...e.map(i=>i.x))-t)*2)/2,r=Math.floor((Math.min(...e.map(i=>i.y))-t)*2)/2,o=Math.ceil((Math.max(...e.map(i=>i.x+i.w))+t)*2)/2,s=Math.ceil((Math.max(...e.map(i=>i.y+i.d))+t)*2)/2;return{x:n,y:r,w:o-n,d:s-r}}const ah=[{kind:"block",name:"Block",defaults:{w:2,d:2,h:1,color:"#4f8cf7"}},{kind:"cylinder",name:"Cylinder",defaults:{w:2,d:2,h:1.5,color:"#3fb27f"}},{kind:"hexagon",name:"Hexagon",defaults:{w:2,d:2,h:1,color:"#f2a93b"}},{kind:"pyramid",name:"Pyramid",defaults:{w:2,d:2,h:1.5,color:"#e5534b"}},{kind:"cone",name:"Cone",defaults:{w:2,d:2,h:2,color:"#a371f7"}},{kind:"sphere",name:"Sphere",defaults:{w:2,d:2,h:2,color:"#39c5cf"}},{kind:"area",name:"Area",defaults:{w:6,d:4,h:0,color:"#4f8cf7",opacity:.18}},{kind:"circleArea",name:"Circle area",defaults:{w:4,d:4,h:0,color:"#3fb27f",opacity:.2}},{kind:"text",name:"Text",defaults:{w:4,d:1,h:0,color:"#1f2937",text:"Text",fontSize:.7}}],ug=["#4f8cf7","#3fb27f","#f2a93b","#e5534b","#a371f7","#39c5cf","#ed7100","#c925d1","#7aa116","#dd344c","#8c4fff","#232f3e","#64748b","#ffffff"];function Ms(e,t,n,r={}){var l;const o=((l=ah.find(a=>a.kind===e))==null?void 0:l.defaults)??{},s=r.w??o.w??2,i=r.d??o.d??2;return{id:xr("n"),kind:e,h:1,z:0,color:"#4f8cf7",...o,...r,w:s,d:i,x:Math.round(t-s/2),y:Math.round(n-i/2)}}function dg(e,t,n,r){return Ms("image",n,r,{w:2,d:2,h:.35,src:e,label:t,color:"#ffffff",imageStyle:"tile"})}function fg(e,t,n={}){return{id:xr("e"),from:e,to:t,color:"#475569",width:2,routing:"orthogonal",rounded:!0,lineStyle:"solid",endMarker:"arrow",...n}}const hg=["color","width","routing","rounded","lineStyle","startMarker","endMarker","animation","animationDirection","animationSpeed","animationColor"];function pg(e){const{dashed:t,arrowStart:n,arrowEnd:r,...o}=e;return{...o,lineStyle:e.lineStyle??(t?"dashed":"solid"),startMarker:e.startMarker??(n?"arrow":"none"),endMarker:e.endMarker??(r?"arrow":"none")}}const Qa=()=>({version:1,nodes:[],edges:[]});function mg(e){const t=e;if(!t||!Array.isArray(t.nodes)||!Array.isArray(t.edges))throw new Error("Not an IsoDraw diagram: expected { nodes: [], edges: [] }");const n=new Set(t.nodes.map(r=>r.id));return{version:1,nodes:t.nodes.map(r=>({...r,z:r.z??0,h:r.h??0})),edges:t.edges.filter(r=>n.has(r.from)&&n.has(r.to)).map(pg),...typeof t.doc=="string"?{doc:t.doc}:{},...t.view==="2d"||t.view==="3d"?{view:t.view}:{}}}const Pr={block:"Block",cylinder:"Cylinder",hexagon:"Hexagon",pyramid:"Pyramid",cone:"Cone",sphere:"Sphere",area:"Area",circleArea:"Circle area",text:"Text",image:"Image"},Ya="isodraw:",xt=e=>!!e&&e.trim().length>0,gg=(e,t)=>e.kind===t.kind&&(e.kind==="diagram"||e.id===t.id),Ar=e=>e.kind==="diagram"?"diagram":`${e.kind}/${e.id}`;function yg(e){if(!e.startsWith(Ya))return null;const t=e.slice(Ya.length);if(t==="diagram")return{kind:"diagram"};const n=/^(node|edge)\/(.+)$/.exec(t);return n?{kind:n[1],id:decodeURIComponent(n[2])}:null}function _o(e){var t,n,r;return((t=e.label)==null?void 0:t.trim())||(e.kind==="text"?(r=(n=e.text)==null?void 0:n.split(`
`)[0])==null?void 0:r.trim():"")||Pr[e.kind]}function Jl(e,t){var s;const n=t.find(i=>i.id===e.from),r=t.find(i=>i.id===e.to),o=`${n?_o(n):"?"} → ${r?_o(r):"?"}`;return(s=e.label)!=null&&s.trim()?`${e.label.trim()} (${o})`:o}function Ty(e,t){if(e.kind==="diagram")return"Diagram";if(e.kind==="node"){const r=t.nodes.find(o=>o.id===e.id);return r?_o(r):"Missing item"}const n=t.edges.find(r=>r.id===e.id);return n?Jl(n,t.nodes):"Missing connection"}function My(e,t){return e.kind==="diagram"?!0:e.kind==="node"?t.nodes.some(n=>n.id===e.id):t.edges.some(n=>n.id===e.id)}function by(e,t){var n,r;return e.kind==="diagram"?t.doc??"":e.kind==="node"?((n=t.nodes.find(o=>o.id===e.id))==null?void 0:n.doc)??"":((r=t.edges.find(o=>o.id===e.id))==null?void 0:r.doc)??""}function vg(e,t,n){const r=xt(n)?n:void 0;return t.kind==="diagram"?{...e,doc:r}:t.kind==="node"?{...e,nodes:e.nodes.map(o=>o.id===t.id?{...o,doc:r}:o)}:{...e,edges:e.edges.map(o=>o.id===t.id?{...o,doc:r}:o)}}function Ny(e,t){const n=[{kind:"diagram"}];if(e.kind!=="node")return n;const r=t.nodes.find(i=>i.id===e.id),o=[];let s=r&&En(r,t.nodes);for(;s;)o.unshift({kind:"node",id:s.id}),s=En(s,t.nodes);return[...n,...o]}function Py(e){return[...e.nodes.map(t=>({target:{kind:"node",id:t.id},title:_o(t),kind:Pr[t.kind]})),...e.edges.map(t=>({target:{kind:"edge",id:t.id},title:Jl(t,e.nodes),kind:"Connection"}))]}const Yi=e=>Ar(e).replace("/","-");function wg(e,t="Architecture"){const n=ql(e.nodes),r=new Map;for(const m of e.nodes){const h=n.get(m.id);r.has(h)||r.set(h,[]),r.get(h).push(m)}const o=m=>xt(m.doc)||(r.get(m.id)??[]).some(o),s=new Set([...e.nodes.filter(o).map(m=>Ar({kind:"node",id:m.id})),...e.edges.filter(m=>xt(m.doc)).map(m=>Ar({kind:"edge",id:m.id}))]),i=m=>m.replace(/\[@((?:\\.|[^\]])*)\]\(isodraw:([^)]+)\)/g,(h,k,g)=>{const x=yg(Ya+g);return x&&s.has(Ar(x))?`[@${k}](#${Yi(x)})`:`**@${k}**`}),l=(m,h)=>{const k=[...m.matchAll(/^(#{1,6})\s/gm)].map(x=>x[1].length);if(!k.length)return m;const g=Math.max(0,h+1-Math.min(...k));return m.replace(/^(#{1,6})(?=\s)/gm,x=>"#".repeat(Math.min(6,x.length+g)))},a=[`# ${t}`,""];xt(e.doc)&&a.push(i(l(e.doc.trim(),1)),"");const d=(m,h)=>{const k=[...m.filter(cn),...m.filter(g=>!cn(g))];for(const g of k){if(!o(g))continue;const x={kind:"node",id:g.id};a.push(`<a id="${Yi(x)}"></a>`,"",`${"#".repeat(Math.min(6,h))} ${_o(g)}`,""),a.push(`_${Pr[g.kind]}_`,""),xt(g.doc)&&a.push(i(l(g.doc.trim(),h)),""),d(r.get(g.id)??[],h+1)}};d(r.get(void 0)??[],2);const f=e.edges.filter(m=>xt(m.doc));if(f.length){a.push("## Connections","");for(const m of f){const h={kind:"edge",id:m.id};a.push(`<a id="${Yi(h)}"></a>`,"",`### ${Jl(m,e.nodes)}`,"",i(l(m.doc.trim(),3)),"")}}return`${a.join(`
`).replace(/\n{3,}/g,`

`).trim()}
`}function Ay(e,t){const n=new Set([t,...kr([t],e.nodes)]);return{version:1,...e.view?{view:e.view}:{},nodes:e.nodes.filter(r=>n.has(r.id)),edges:e.edges.filter(r=>n.has(r.from)&&n.has(r.to))}}const ec=N.createContext("light"),zu="(prefers-color-scheme: dark)";function tc(e){const t=N.useContext(ec),[n,r]=N.useState(()=>{var o;return typeof window<"u"&&!!((o=window.matchMedia)!=null&&o.call(window,zu).matches)});return N.useEffect(()=>{if(e!=="system"||!window.matchMedia)return;const o=window.matchMedia(zu),s=()=>r(o.matches);return s(),o.addEventListener("change",s),()=>o.removeEventListener("change",s)},[e]),e==="system"?n?"dark":"light":e??t}const xg={light:"#f4f7fb",dark:"#0b1220"},Ro={light:{text:"#1f2937",halo:"#ffffff",chip:"#ffffff"},dark:{text:"#e2e8f0",halo:"#0b1220",chip:"#1e293b"}};function kg(e){const t=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim());if(!t)return null;const n=t[1].length===3?[...t[1]].map(r=>r+r).join(""):t[1];return[0,2,4].map(r=>parseInt(n.slice(r,r+2),16)/255)}const Sg=e=>Math.round(Math.min(1,Math.max(0,e))*255).toString(16).padStart(2,"0");function hs(e,t){if(t==="light")return e;const n=kg(e);if(!n)return e;const r=Math.max(...n),o=Math.min(...n),s=(r+o)/2;if(s>=.5||r-o>.2)return e;const i=1-2*s;return`#${n.map(l=>Sg(l+i)).join("")}`}function Eg(e,t){return t==="light"?e:{...e,nodes:e.nodes.map(n=>({...n,...n.kind==="text"?{color:hs(n.color,t)}:{},...n.labelColor?{labelColor:hs(n.labelColor,t)}:{}})),edges:e.edges.map(n=>({...n,color:hs(n.color,t),...n.animationColor?{animationColor:hs(n.animationColor,t)}:{}}))}}const wi=()=>N.useContext(ec),Js={n:{x:0,y:-1},e:{x:1,y:0},s:{x:0,y:1},w:{x:-1,y:0}},lh=["n","e","s","w"],Cg=.12,er=.6,_t=1e-6,Lu=new Set(["cylinder","cone","circleArea","sphere"]),ei=(e,t,n)=>Math.min(n,Math.max(t,e)),Xa=e=>Math.abs(e.x)>Math.abs(e.y)?"x":"y",jg=(e,t)=>Math.abs(e.x-t.x)<_t||Math.abs(e.y-t.y)<_t,St=(e,t,n=1)=>({x:e.x+t.x*n,y:e.y+t.y*n}),ch=e=>e.lineStyle??(e.dashed?"dashed":"solid"),uh=e=>e.startMarker??(e.arrowStart?"arrow":"none"),dh=e=>e.endMarker??(e.arrowEnd?"arrow":"none");function Sr(e,t,n=Cg){const r=ei(t.t,0,1),o=e.x+e.w/2,s=e.y+e.d/2;let i;if(t.side==="n"||t.side==="s"){const l=e.x+r*e.w;let a=t.side==="n"?e.y:e.y+e.d;if(Lu.has(e.kind)){const d=(l-o)/(e.w/2);a=s+(t.side==="n"?-1:1)*(e.d/2)*Math.sqrt(Math.max(0,1-d*d))}i={x:l,y:a}}else{const l=e.y+r*e.d;let a=t.side==="w"?e.x:e.x+e.w;if(Lu.has(e.kind)){const d=(l-s)/(e.d/2);a=o+(t.side==="w"?-1:1)*(e.w/2)*Math.sqrt(Math.max(0,1-d*d))}i={x:a,y:l}}return St(i,Js[t.side],n)}function ti(e,t,n){return ei(t==="e"||t==="w"?(n-e.y)/e.d:(n-e.x)/e.w,0,1)}function Tg(e,t){const n={n:Math.abs(t.y-e.y),s:Math.abs(t.y-(e.y+e.d)),w:Math.abs(t.x-e.x),e:Math.abs(t.x-(e.x+e.w))},r=lh.reduce((s,i)=>n[i]<n[s]?i:s,"n"),o=Pt(r==="e"||r==="w"?t.y:t.x,.25);return{side:r,t:ti(e,r,o)}}function qa(e,t){const n=Ae(e),r=(t.x-n.x)/Math.max(e.w,_t),o=(t.y-n.y)/Math.max(e.d,_t),s=Math.abs(r)>=Math.abs(o)?r>0?"e":"w":o>0?"s":"n",i=s==="e"||s==="w"?t.y:t.x,l=ti(e,s,i);return{side:s,t:l>0&&l<1?l:.5}}function Mg(e,t){const n=Ae(e),r=Ae(t),o=r.x-n.x,s=r.y-n.y,i=Math.max(t.x-(e.x+e.w),e.x-(t.x+t.w)),l=Math.max(t.y-(e.y+e.d),e.y-(t.y+t.d));return(i>0||l>0?i>=l:Math.abs(o)>=Math.abs(s))?[{side:o>0?"e":"w",t:.5},{side:o>0?"w":"e",t:.5}]:[{side:s>0?"s":"n",t:.5},{side:s>0?"n":"s",t:.5}]}function ni(e){const t=[];for(const n of e){const r=t[t.length-1];r&&Math.abs(r.x-n.x)<_t&&Math.abs(r.y-n.y)<_t||t.push(n)}for(let n=1;n<t.length-1;){const r=t[n-1],o=t[n],s=t[n+1],i=(o.x-r.x)*(s.y-o.y)-(o.y-r.y)*(s.x-o.x);Math.abs(i)<_t?t.splice(n,1):n++}return t}function fh(e,t,n){const r=[e[0]];let o=t;for(let s=1;s<e.length;s++){const i=r[r.length-1],l=e[s];if(!jg(i,l)){const d=s===e.length-1&&n;let f;d?f=n==="x"?{x:i.x,y:l.y}:{x:l.x,y:i.y}:f=o==="x"?{x:l.x,y:i.y}:{x:i.x,y:l.y},r.push(f)}const a=r[r.length-1];Math.abs(l.x-a.x)>_t?o="x":Math.abs(l.y-a.y)>_t&&(o="y"),r.push(l)}return r}function bg(e,t,n,r){const o=St(e,t,er),s=St(n,r,er),i=t.x!==0,l=r.x!==0;if(i&&l){if(t.x===-r.x){if((s.x-o.x)*t.x>=0){const m=(o.x+s.x)/2;return[e,o,{x:m,y:o.y},{x:m,y:s.y},s,n]}const f=(o.y+s.y)/2;return[e,o,{x:o.x,y:f},{x:s.x,y:f},s,n]}const d=t.x>0?Math.max(o.x,s.x):Math.min(o.x,s.x);return[e,{x:d,y:e.y},{x:d,y:n.y},n]}if(!i&&!l){if(t.y===-r.y){if((s.y-o.y)*t.y>=0){const m=(o.y+s.y)/2;return[e,o,{x:o.x,y:m},{x:s.x,y:m},s,n]}const f=(o.x+s.x)/2;return[e,o,{x:f,y:o.y},{x:f,y:s.y},s,n]}const d=t.y>0?Math.max(o.y,s.y):Math.min(o.y,s.y);return[e,{x:e.x,y:d},{x:n.x,y:d},n]}return i?(s.x-o.x)*t.x>=0&&(s.y-o.y)*-r.y>=0?[e,o,{x:s.x,y:o.y},s,n]:[e,o,{x:o.x,y:s.y},s,n]:(s.y-o.y)*t.y>=0&&(s.x-o.x)*-r.x>=0?[e,o,{x:o.x,y:s.y},s,n]:[e,o,{x:s.x,y:o.y},s,n]}function Ng(e,t,n,r,o){if(!o.length)return ni(bg(e,t,n,r));const s=St(e,t,er),i=St(n,r,er),l=fh([e,s,...o,i],Xa(t),Xa(r));return l.push(n),ni(l)}function Pg(e,t,n){if(t===n)return e.map(()=>t);const r=e.slice(1).map((i,l)=>Math.hypot(i.x-e[l].x,i.y-e[l].y)),o=r.reduce((i,l)=>i+l,0)||1;let s=0;return e.map((i,l)=>(l>0&&(s+=r[l-1]),t+(n-t)*(s/o)))}function Ja(e,t,n){const r=e.waypoints??[],o=Mg(t,n),s=e.fromAnchor??(r.length?qa(t,r[0]):o[0]),i=e.toAnchor??(r.length?qa(n,r[r.length-1]):o[1]),l=Js[s.side],a=Js[i.side];let d;if(e.routing==="orthogonal")d=Ng(Sr(t,s),l,Sr(n,i),a,r);else if(e.routing==="straight"&&!e.fromAnchor&&!e.toAnchor){const f=Ae(t),m=Ae(n),h=r[0]??m,k=r[r.length-1]??f;d=[Nu(h,f,t),...r,Nu(k,m,n)]}else d=[Sr(t,s),...r,Sr(n,i)];return{pts:d,zs:Pg(d,t.z,n.z),from:s,to:i,aDir:l,bDir:a}}function hh(e,t,n,r){const o=(l,a)=>{const d=r.project(l.x,l.y,a);return`${d.x.toFixed(2)},${d.y.toFixed(2)}`},{pts:s,zs:i}=e;if(t==="curved"){if(s.length===2){const[a,d]=s,f=ei(Math.hypot(d.x-a.x,d.y-a.y)*.45,.8,5),m=(i[0]+i[1])/2;return`M${o(a,i[0])} C${o(St(a,e.aDir,f),m)} ${o(St(d,e.bDir,f),m)} ${o(d,i[1])}`}let l=`M${o(s[0],i[0])}`;for(let a=0;a<s.length-1;a++){const d=s[a-1]??St(s[0],e.aDir,-1),f=s[a],m=s[a+1],h=s[a+2]??St(s[s.length-1],e.bDir,-1),k={x:f.x+(m.x-d.x)/6,y:f.y+(m.y-d.y)/6},g={x:m.x-(h.x-f.x)/6,y:m.y-(h.y-f.y)/6};l+=` C${o(k,i[a])} ${o(g,i[a+1])} ${o(m,i[a+1])}`}return l}if(t==="orthogonal"&&n&&s.length>2){let l=`M${o(s[0],i[0])}`;for(let a=1;a<s.length-1;a++){const d=s[a-1],f=s[a],m=s[a+1],h=Math.hypot(f.x-d.x,f.y-d.y),k=Math.hypot(m.x-f.x,m.y-f.y),g=Math.min(.4,h/2,k/2),x={x:f.x-(f.x-d.x)/(h||1)*g,y:f.y-(f.y-d.y)/(h||1)*g},P={x:f.x+(m.x-f.x)/(k||1)*g,y:f.y+(m.y-f.y)/(k||1)*g};l+=` L${o(x,i[a])} Q${o(f,i[a])} ${o(P,i[a])}`}return`${l} L${o(s[s.length-1],i[i.length-1])}`}return`M${s.map((l,a)=>o(l,i[a])).join(" L")}`}function el(e,t){if(e.length<3)return e;const n=e[0],r=e[e.length-1],o=Math.hypot(r.x-n.x,r.y-n.y)||_t;let s=0,i=0;for(let l=1;l<e.length-1;l++){const a=e[l],d=Math.abs((r.x-n.x)*(n.y-a.y)-(n.x-a.x)*(r.y-n.y))/o;d>s&&(s=d,i=l)}return s<=t?[n,r]:[...el(e.slice(0,i+1),t).slice(0,-1),...el(e.slice(i),t)]}function Iu(e,t,n=.25){return t.x>=e.x-n&&t.x<=e.x+e.w+n&&t.y>=e.y-n&&t.y<=e.y+e.d+n}function Du(e,t,n,r){const o=e.slice();for(;o.length&&Iu(t,o[0]);)o.shift();if(r)for(;o.length&&Iu(r,o[o.length-1]);)o.pop();const s=n?{fromAnchor:{side:n,t:.5}}:{};if(o.length<2)return{...s,waypoints:[]};const i=[],l=el(o,.45);for(let g=1;g<l.length;g++){const x=l[g-1],P=l[g],y=P.x-x.x,u=P.y-x.y,v=Math.hypot(y,u);if(v<.35)continue;const C=Math.abs(y)>=Math.abs(u)?"x":"y",z=C==="x"?(x.y+P.y)/2:(x.x+P.x)/2,D=C==="x"?y:u,L=i[i.length-1];L&&L.axis===C?(L.level=(L.level*L.len+z*v)/(L.len+v),L.len+=v,L.net+=D):i.push({axis:C,net:D,level:z,len:v})}for(const g of i)g.level=Pt(g.level,.5);if(i.length<2)return{...s,waypoints:[]};const a=i[0],d=n??(a.axis==="x"?a.net>0?"e":"w":a.net>0?"s":"n"),f=d==="e"||d==="w"?"x":"y",m={side:d,t:a.axis===f?ti(t,d,a.level):.5},h=[];for(let g=0;g<i.length-1;g++){const x=i[g],P=i[g+1];h.push(x.axis==="x"?{x:P.level,y:x.level}:{x:x.level,y:P.level})}let k;if(r){const g=i[i.length-1],x=g.axis==="x"?g.net>0?"w":"e":g.net>0?"n":"s";k={side:x,t:ti(r,x,g.level)}}return{fromAnchor:m,toAnchor:k,waypoints:h}}function Ag(e,t,n){const r=t.fromAnchor??qa(e,t.waypoints[0]??n),o=Sr(e,r),s=Js[r.side];return ni(fh([o,St(o,s,er),...t.waypoints,n],Xa(s),null))}function ph(e){let t=0;for(let n=1;n<e.length;n++)t+=Math.hypot(e[n].x-e[n-1].x,e[n].y-e[n-1].y);return t}function zg(e,t,n,r,o){let s=e.pts.map(g=>({...g}));const i=Math.abs(s[r].y-s[r+1].y)<_t,l=g=>{i?g.y=o:g.x=o},a=(g,x)=>{if(!(x.side==="e"||x.side==="w"?i:!i))return null;const y=i?g.y:g.x,u=i?g.d:g.w;return o>=y&&o<=y+u?{side:x.side,t:(o-y)/u}:null};let d=e.from,f=e.to;const m=s.length-2,h=r===0,k=r===m;if(!h&&!k)l(s[r]),l(s[r+1]);else{const g=h?a(t,d):null,x=k?a(n,f):null;if(h&&!k&&l(s[1]),k&&!h&&l(s[m]),h)if(g)d=g,l(s[0]);else{const P=St(s[0],e.aDir,er),y={...P};l(y),s=[s[0],P,y,...s.slice(1)]}if(k){const P=s.length-1;if(x)f=x,l(s[P]);else{const y=St(s[P],e.bDir,er),u={...y};l(u),s=[...s.slice(0,P),u,y,s[P]]}}}return{fromAnchor:d,toAnchor:f,waypoints:ni(s).slice(1,-1)}}const Lg=new Set(["cylinder","cone"]),Ig=new Set(["block","cylinder","hexagon"]),Dg=1/Ce;function nc(e,t,n){const r=n==="flip"?tg(t):eg(t),o=Ae(e),s=r%2===1;return{transform:`rotate(${r*90} ${o.x*Ce} ${o.y*Ce})`,cx:o.x,cy:o.y,w:s?e.d:e.w,d:s?e.w:e.d}}function rc({proj:e,z:t,children:n}){return c.jsx("g",{transform:ng(e.groundMatrix(t)),children:c.jsx("g",{transform:`scale(${Dg})`,children:n})})}function mh({node:e,proj:t}){const n=Lg.has(e.kind);return c.jsx(c.Fragment,{children:rg(e,t).map((r,o)=>{const s=In(e.color,r.light);return c.jsx("polygon",{points:Lt(r.points),fill:s,stroke:n?s:In(e.color,r.light*.72),strokeWidth:n?.6:1,strokeLinejoin:"round"},o)})})}function _g({node:e,proj:t}){const n=e.imageStyle??"tile",r=n==="tile"?Math.min(e.w,e.d)*.12:0;if(n==="standing"&&t.mode==="3d"){const i=Ae(e),l=t.project(i.x,i.y,e.z),a=Math.min(e.w,e.d)*Ce;return c.jsxs(c.Fragment,{children:[c.jsx("ellipse",{cx:l.x,cy:l.y,rx:a*.42,ry:a*.2,fill:"#000",opacity:.12}),c.jsx("image",{href:e.src,x:l.x-a/2,y:l.y-a*1.02,width:a,height:a,preserveAspectRatio:"xMidYMid meet"})]})}const o=n==="tile"?e.z+e.h:e.z,s=nc(e,t,"turn");return c.jsxs(c.Fragment,{children:[n==="tile"&&c.jsx(mh,{node:{...e,kind:"block"},proj:t}),c.jsx(rc,{proj:t,z:o,children:c.jsx("image",{href:e.src,transform:s.transform,x:(s.cx-s.w/2+r)*Ce,y:(s.cy-s.d/2+r)*Ce,width:(s.w-2*r)*Ce,height:(s.d-2*r)*Ce,preserveAspectRatio:"xMidYMid meet"})})]})}function Rg({node:e,proj:t,gradId:n}){const r=Ae(e),o=Math.min(e.w,e.d)/2,s=t.project(r.x,r.y,e.z+o);return c.jsxs(c.Fragment,{children:[c.jsx("defs",{children:c.jsxs("radialGradient",{id:n,cx:"38%",cy:"32%",r:"70%",children:[c.jsx("stop",{offset:"0%",stopColor:In(e.color,1.45)}),c.jsx("stop",{offset:"55%",stopColor:e.color}),c.jsx("stop",{offset:"100%",stopColor:In(e.color,.6)})]})}),c.jsx("polygon",{points:Lt(Re(e).map(i=>t.project(i.x,i.y,e.z))),fill:"#000",opacity:.1}),c.jsx("circle",{cx:s.x,cy:s.y,r:o*Ce,fill:`url(#${n})`})]})}function Og({node:e,proj:t}){const n=Ae(e),r=(e.fontSize??.7)*Ce,o=(e.text??"").split(`
`);return c.jsx(rc,{proj:t,z:e.z,children:c.jsx("text",{transform:nc(e,t,"flip").transform,x:n.x*Ce,y:n.y*Ce-(o.length-1)*r*1.2/2,fontSize:r,fill:e.color,textAnchor:"middle",dominantBaseline:"central",fontWeight:600,style:{userSelect:"none"},children:o.map((s,i)=>c.jsx("tspan",{x:n.x*Ce,dy:i===0?0:r*1.2,children:s||" "},i))})})}function gh(e,t){const n=Ae(e);if(e.kind==="image"&&e.imageStyle==="standing"&&t.mode==="3d"){const s=t.project(n.x,n.y,e.z);return{x:s.x,y:s.y+16}}const r=Re(e).map(s=>t.project(s.x,s.y,e.z)),o=Math.max(...r.map(s=>s.y));return{x:t.project(n.x,n.y,e.z).x,y:o+15}}function $g({node:e,proj:t}){const n=wi();if(!e.label||e.kind==="text")return null;if(e.kind==="area"){const o=nc(e,t,"flip");return c.jsx(rc,{proj:t,z:e.z,children:c.jsx("text",{transform:o.transform,x:(o.cx-o.w/2+.3)*Ce,y:(o.cy-o.d/2+.3)*Ce,fontSize:13,fontWeight:700,dominantBaseline:"hanging",fill:e.labelColor??In(e.color,n==="dark"?1.5:.6),style:{userSelect:"none"},pointerEvents:"none",children:e.label})})}const r=gh(e,t);if(t.mode==="2d"&&Ig.has(e.kind)){const o=t.project(Ae(e).x,Ae(e).y);return c.jsx("text",{x:o.x,y:o.y,fontSize:12,fontWeight:600,textAnchor:"middle",dominantBaseline:"central",fill:e.labelColor??og(e.color),style:{userSelect:"none"},pointerEvents:"none",children:e.label})}return c.jsx("text",{x:r.x,y:r.y,fontSize:12,fontWeight:600,textAnchor:"middle",fill:e.labelColor??Ro[n].text,stroke:Ro[n].halo,strokeWidth:3,strokeLinejoin:"round",paintOrder:"stroke",style:{userSelect:"none"},pointerEvents:"none",children:e.label})}function tl({node:e,proj:t,idPrefix:n}){let r;switch(e.kind){case"area":case"circleArea":{const s=Re(e).map(i=>t.project(i.x,i.y,e.z));r=c.jsx("polygon",{points:Lt(s),fill:e.color,fillOpacity:e.opacity??.18,stroke:e.color,strokeWidth:1.5,strokeDasharray:e.dashed?"6 4":void 0,strokeLinejoin:"round"});break}case"text":r=c.jsx(Og,{node:e,proj:t});break;case"sphere":r=c.jsx(Rg,{node:e,proj:t,gradId:`${n}-sph-${e.id}`});break;case"image":r=c.jsx(_g,{node:e,proj:t});break;default:r=c.jsx(mh,{node:e,proj:t})}const o=e.kind==="area"||e.kind==="circleArea";return c.jsx("g",{"data-node-id":e.id,opacity:o?void 0:e.opacity??1,children:r})}function yh(e){let t=ph(e)/2;for(let n=1;n<e.length;n++){const r=Math.hypot(e[n].x-e[n-1].x,e[n].y-e[n-1].y);if(t<=r&&r>0){const o=t/r;return{x:e[n-1].x+(e[n].x-e[n-1].x)*o,y:e[n-1].y+(e[n].y-e[n-1].y)*o}}t-=r}return e[0]}function Fg(e){const t=[...e].sort((o,s)=>o.x-s.x||o.y-s.y);if(t.length<3)return t;const n=(o,s,i)=>(s.x-o.x)*(i.y-o.y)-(s.y-o.y)*(i.x-o.x),r=o=>{const s=[];for(const i of o){for(;s.length>=2&&n(s[s.length-2],s[s.length-1],i)<=0;)s.pop();s.push(i)}return s.pop(),s};return[...r(t),...r([...t].reverse())]}function vh({target:e,diagram:t,proj:n}){const r={stroke:"#2563eb",strokeLinejoin:"round",pointerEvents:"none",vectorEffect:"non-scaling-stroke"};if(e.kind==="node"){const o=t.nodes.find(a=>a.id===e.id);if(!o)return null;const s=Vt(o),i=Re(o).map(a=>n.project(a.x,a.y,o.z)),l=s?i:Fg([...i,...Re(o).map(a=>n.project(a.x,a.y,o.z+o.h))]);return c.jsx("polygon",{className:"isd-target-highlight",points:Lt(l),fill:"rgba(37,99,235,0.14)",strokeWidth:2.5,...r})}if(e.kind==="edge"){const o=t.edges.find(a=>a.id===e.id),s=o&&t.nodes.find(a=>a.id===o.from),i=o&&t.nodes.find(a=>a.id===o.to);if(!o||!s||!i)return null;const{d:l}=Un(o,s,i,n);return c.jsxs("g",{className:"isd-target-highlight",children:[c.jsx("path",{d:l,fill:"none",strokeOpacity:.3,strokeWidth:10,strokeLinecap:"round",...r}),c.jsx("path",{d:l,fill:"none",strokeWidth:2.5,strokeLinecap:"round",...r})]})}return null}function Un(e,t,n,r){const o=Ja(e,t,n),s=o.pts.map((l,a)=>r.project(l.x,l.y,o.zs[a])),i=hh(o,e.routing,e.rounded??!1,r);return{r:o,screen:s,d:i,length:ph(s)}}function _u({id:e,kind:t,color:n}){if(t==="none")return null;const r={id:e,viewBox:"0 0 10 10",markerWidth:5,markerHeight:5,orient:"auto-start-reverse"};switch(t){case"open":return c.jsx("marker",{...r,refX:"8.5",refY:"5",children:c.jsx("path",{d:"M1.5,1.5 L8.5,5 L1.5,8.5",fill:"none",stroke:n,strokeWidth:1.6,strokeLinecap:"round",strokeLinejoin:"round"})});case"circle":return c.jsx("marker",{...r,refX:"5",refY:"5",children:c.jsx("circle",{cx:"5",cy:"5",r:"3.6",fill:n})});case"diamond":return c.jsx("marker",{...r,refX:"9",refY:"5",children:c.jsx("path",{d:"M1,5 L5,1.5 L9,5 L5,8.5 z",fill:n})});default:return c.jsx("marker",{...r,refX:"8",refY:"5",children:c.jsx("path",{d:"M0,0 L10,5 L0,10 z",fill:n})})}}function Bg(e,t){if(e==="dashed")return`${t*3} ${t*2.5}`;if(e==="dotted")return`0.01 ${t*2.2}`}const Vg=`
@keyframes isd-dash { from { stroke-dashoffset: var(--isd-from); } to { stroke-dashoffset: var(--isd-to); } }
@keyframes isd-glow { 0%, 100% { stroke-opacity: 0.04; } 50% { stroke-opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) { .isd-anim { animation: none !important; } }
`;function Er(e,t,n){return{animation:`isd-dash ${n.toFixed(2)}s linear infinite`,"--isd-from":`${e.toFixed(2)}px`,"--isd-to":`${t.toFixed(2)}px`}}function Wg({edge:e,d:t,length:n}){const r=wi(),o=e.animation??"none",s=e.width,i=Math.max(.1,e.animationSpeed??1),l=80*i,a=e.animationDirection??"forward",d=e.animationColor??In(e.color,1.55),f=Math.max(1,n);if(o==="packets"){const m=Math.max(1,Math.min(6,Math.round(f/130))),h=f/m,k=Math.max(.6/m,h/l),g=s+1.6,x=a==="both"?["forward","reverse"]:[a==="reverse"?"reverse":"forward"];return c.jsx("g",{pointerEvents:"none",children:x.map(P=>{const y=P==="reverse"&&a==="both"?h/2:0,u=P==="reverse"?Er(y-h,y,k):Er(y,y-h,k),v=P==="reverse"&&a==="both"?In(e.color,.7):d,C=`0.01 ${(h-.01).toFixed(2)}`;return c.jsxs("g",{children:[c.jsx("path",{className:"isd-anim",d:t,fill:"none",stroke:Ro[r].halo,strokeWidth:2*g+2.4,strokeLinecap:"round",strokeDasharray:C,style:u}),c.jsx("path",{className:"isd-anim",d:t,fill:"none",stroke:v,strokeWidth:2*g,strokeLinecap:"round",strokeDasharray:C,style:u})]},P)})})}if(o==="pulse"){const m=Math.min(70,Math.max(16,f*.25)),h=Math.max(.6,(f+m)/l),k=a==="both"?["forward","reverse"]:[a==="reverse"?"reverse":"forward"];return c.jsx("g",{pointerEvents:"none",children:k.map(g=>c.jsx("path",{className:"isd-anim",d:t,fill:"none",stroke:d,strokeWidth:s+2.5,strokeLinecap:"round",strokeDasharray:`${m} ${f+m}`,style:g==="forward"?Er(m,-f,h):Er(-f,m,h)},g))})}return o==="glow"?c.jsx("path",{className:"isd-anim",d:t,fill:"none",stroke:e.color,strokeOpacity:.04,strokeWidth:s+8,strokeLinecap:"round",strokeLinejoin:"round",pointerEvents:"none",style:{animation:`isd-glow ${(2/i).toFixed(2)}s ease-in-out infinite`}}):null}function Hg({edge:e,a:t,b:n,proj:r,idPrefix:o,selected:s,animate:i=!0}){const{d:l,length:a}=Un(e,t,n,r),d=`${o}-ms-${e.id}`,f=`${o}-me-${e.id}`,m=uh(e),h=dh(e),k=ch(e),g=e.width,x=i&&e.animation==="flow";let P=Bg(k,g);e.animation==="flow"&&!P&&(P=`${g*3} ${g*2.5}`);const y=P?P.split(" ").reduce((C,z)=>C+parseFloat(z),0):0,u=Math.max(.1,e.animationSpeed??1),v=e.animationDirection==="reverse";return c.jsxs("g",{"data-edge-id":e.id,children:[c.jsxs("defs",{children:[c.jsx(_u,{id:d,kind:m,color:e.color}),c.jsx(_u,{id:f,kind:h,color:e.color})]}),c.jsx("path",{d:l,stroke:"transparent",strokeWidth:14,fill:"none"}),s&&c.jsx("path",{d:l,stroke:"#2563eb",strokeOpacity:.3,strokeWidth:g+6,fill:"none",strokeLinejoin:"round",strokeLinecap:"round","data-noexport":""}),e.animation==="flow"&&k==="solid"&&c.jsx("path",{d:l,stroke:e.color,strokeOpacity:.25,strokeWidth:g,fill:"none",strokeLinejoin:"round",strokeLinecap:"round"}),c.jsx("path",{d:l,stroke:e.color,strokeWidth:g,fill:"none",strokeLinejoin:"round",strokeLinecap:"round",strokeDasharray:P,markerEnd:h!=="none"?`url(#${f})`:void 0,markerStart:m!=="none"?`url(#${d})`:void 0,className:x?"isd-anim":void 0,style:x?v?Er(0,y,Math.max(.15,y/(40*u))):Er(y,0,Math.max(.15,y/(40*u))):void 0}),i&&c.jsx(Wg,{edge:e,d:l,length:a})]})}function Ug({edge:e,a:t,b:n,proj:r}){const o=wi();if(!e.label)return null;const s=yh(Un(e,t,n,r).screen),i=e.label.length*6.6+12;return c.jsxs("g",{"data-edge-id":e.id,children:[c.jsx("rect",{x:s.x-i/2,y:s.y-9,width:i,height:18,rx:9,fill:Ro[o].chip,stroke:e.color,strokeWidth:1}),c.jsx("text",{x:s.x,y:s.y,fontSize:11,fontWeight:600,textAnchor:"middle",dominantBaseline:"central",fill:Ro[o].text,children:e.label})]})}function wh({diagram:e,proj:t,idPrefix:n,selectedEdges:r,animate:o=!0}){const s=wi(),i=N.useMemo(()=>Eg(e,s),[e,s]),l=[],a=[];for(const g of i.nodes)(Vt(g)?l:a).push(g);const d=cg(i.nodes),f=new Map(i.nodes.map((g,x)=>[g.id,x]));l.sort((g,x)=>g.z-x.z||d.get(g.id)-d.get(x.id)||f.get(g.id)-f.get(x.id));const m=new Map(i.nodes.map(g=>[g.id,g])),h=ag(a,t),k=o&&i.edges.some(g=>g.animation&&g.animation!=="none");return c.jsxs(c.Fragment,{children:[k&&c.jsx("style",{children:Vg}),l.map(g=>c.jsx(N.Fragment,{children:c.jsx(tl,{node:g,proj:t,idPrefix:n})},g.id)),i.edges.map(g=>{const x=m.get(g.from),P=m.get(g.to);return!x||!P?null:c.jsx(Hg,{edge:g,a:x,b:P,proj:t,idPrefix:n,selected:r==null?void 0:r.has(g.id),animate:o},g.id)}),h.map(g=>c.jsx(tl,{node:g,proj:t,idPrefix:n},g.id)),i.nodes.map(g=>c.jsx($g,{node:g,proj:t},`l-${g.id}`)),i.edges.map(g=>{const x=m.get(g.from),P=m.get(g.to);return x&&P?c.jsx(Ug,{edge:g,a:x,b:P,proj:t},`l-${g.id}`):null})]})}function Kg({node:e,size:t=44}){const n=new Io("3d",0),r=Re(e).flatMap(m=>[n.project(m.x,m.y,e.z),n.project(m.x,m.y,e.z+e.h)]),o=r.map(m=>m.x),s=r.map(m=>m.y),i=Math.min(...o),l=Math.min(...s),a=Math.max(...o)-i,d=Math.max(...s)-l,f=Math.max(a,d)*.12;return c.jsx("svg",{width:t,height:t,viewBox:`${i-f} ${l-f} ${a+2*f} ${d+2*f}`,"aria-hidden":!0,children:c.jsx(tl,{node:e,proj:n,idPrefix:"pv"})})}function Zg(e,t,n=28){const r=[];for(const a of e.nodes){const d=a.z+(Vt(a)?0:a.kind==="sphere"?Math.min(a.w,a.d):a.h);for(const f of Re(a))r.push(t.project(f.x,f.y,a.z),t.project(f.x,f.y,d));if(a.label&&a.kind!=="text"&&a.kind!=="area"&&r.push(gh(a,t)),a.kind==="image"&&a.imageStyle==="standing"){const f=t.project(Ae(a).x,Ae(a).y,a.z);r.push({x:f.x,y:f.y-Math.min(a.w,a.d)*Ce*1.05})}}if(!r.length)return{x:-100,y:-60,w:200,h:120};const o=r.map(a=>a.x),s=r.map(a=>a.y),i=Math.min(...o)-n,l=Math.min(...s)-n;return{x:i,y:l,w:Math.max(...o)+n-i,h:Math.max(...s)+n-l}}function zy({diagram:e,view:t,rotation:n=0,highlight:r,focus:o,onNodeClick:s,animate:i=!0,maxHeight:l,className:a,label:d}){const f=N.useId().replace(/:/g,""),m=new Io(t??e.view??"3d",n),h=Zg(e,m),k=r?e.nodes.find(x=>x.id===r):void 0,g=x=>{var y;const P=(y=x.target.closest("[data-node-id]"))==null?void 0:y.getAttribute("data-node-id");P&&s&&s(P)};return c.jsxs("svg",{className:a,viewBox:`${h.x} ${h.y} ${h.w} ${h.h}`,width:"100%",preserveAspectRatio:"xMidYMid meet",role:"img","aria-label":d??"Architecture diagram",style:{display:"block",maxHeight:l,cursor:s?"pointer":void 0,fontFamily:"inherit"},onClick:g,children:[c.jsx(wh,{diagram:e,proj:m,idPrefix:f,animate:i}),k&&c.jsx("polygon",{points:Lt(Re(k).map(x=>m.project(x.x,x.y,k.z))),fill:"rgba(37,99,235,0.1)",stroke:"#2563eb",strokeWidth:2,strokeDasharray:"6 4",pointerEvents:"none"}),o&&c.jsx(vh,{target:o,diagram:e,proj:m})]})}const nl="application/x-isodraw";function dt(e,t){var r;const n=(r=e==null?void 0:e.closest)==null?void 0:r.call(e,`[${t}]`);return n?n.getAttribute(t):null}const Ue="var(--isd-accent, #2563eb)";function Gg(e){var sr;const{diagram:t,view:n,rotation:r,camera:o,onCameraChange:s,selection:i,onSelectionChange:l,tool:a="select",readOnly:d,showGrid:f=!0,animate:m=!0,snapStep:h=.5}=e,k=N.useId().replace(/:/g,""),g=N.useMemo(()=>new Io(n,r),[n,r]),x=N.useRef(null),[P,y]=N.useState({w:800,h:600}),[u,v]=N.useState(null),[C,z]=N.useState(null),[D,L]=N.useState(null),[B,ce]=N.useState(!1),U=N.useRef(e);U.current=e;const Ge=w=>{x.current=w;const E=e.svgRef;typeof E=="function"?E(w):E&&(E.current=w)};N.useEffect(()=>{const w=x.current;if(!w)return;const E=new ResizeObserver(()=>{const j=w.getBoundingClientRect();y({w:j.width,h:j.height})});return E.observe(w),()=>E.disconnect()},[]),N.useEffect(()=>{const w=j=>{var _,$;j.code==="Space"&&!(($=(_=j.target)==null?void 0:_.closest)!=null&&$.call(_,'input,textarea,select,[contenteditable="true"]'))&&(ce(!0),j.preventDefault())},E=j=>j.code==="Space"&&ce(!1);return window.addEventListener("keydown",w),window.addEventListener("keyup",E),()=>{window.removeEventListener("keydown",w),window.removeEventListener("keyup",E)}},[]),N.useEffect(()=>{const w=x.current;if(!w)return;const E=j=>{j.preventDefault();const _=U.current.camera;if(!(j.ctrlKey||j.metaKey||j.deltaX===0&&(j.deltaMode!==0||Math.abs(j.deltaY)>=50))){U.current.onCameraChange({..._,x:_.x-j.deltaX,y:_.y-j.deltaY});return}const b=w.getBoundingClientRect(),F=j.clientX-b.left,Z=j.clientY-b.top,J=Math.exp(-j.deltaY*(j.ctrlKey?.01:.0015)),Be=Math.min(4,Math.max(.15,_.zoom*J)),Y=Be/_.zoom;U.current.onCameraChange({zoom:Be,x:F-(F-_.x)*Y,y:Z-(Z-_.y)*Y})};return w.addEventListener("wheel",E,{passive:!1}),()=>w.removeEventListener("wheel",E)},[]);const lt=(w,E)=>{const j=x.current.getBoundingClientRect();return{x:(w-j.left-o.x)/o.zoom,y:(E-j.top-o.y)/o.zoom}},Me=(w,E,j=0)=>{const _=lt(w,E);return g.unproject(_.x,_.y,j)},Ut=(w,E)=>dt(document.elementFromPoint(w,E),"data-node-id"),ue=N.useMemo(()=>new Map(t.nodes.map(w=>[w.id,w])),[t.nodes]),Fe=N.useMemo(()=>new Map(t.edges.map(w=>[w.id,w])),[t.edges]),ct=w=>{var E;(E=e.onChange)==null||E.call(e,{...t,nodes:t.nodes.map(w)})},I=(w,E)=>{var j;(j=e.onChange)==null||j.call(e,{...t,edges:t.edges.map(_=>_.id===w?{..._,...E}:_)})},W=w=>{const E=ue.get(w.from),j=ue.get(w.to);return E&&j?[E,j]:null},K=(w,E)=>{var Z;const j=Fe.get(i.edges[0]),_=j&&W(j);if(!j||!_)return!1;const[$,b]=w.split(":"),F=Number(b);if($==="edge-from"||$==="edge-to")v({type:"edgeEnd",edgeId:j.id,end:$==="edge-from"?"from":"to",cursor:lt(E.clientX,E.clientY),target:null});else if($==="seg"){const J=Ja(j,_[0],_[1]);v({type:"segment",edgeId:j.id,index:F,start:Me(E.clientX,E.clientY,J.zs[F]),base:J,began:!1})}else if($==="wp")v({type:"waypoint",edgeId:j.id,index:F,began:!1});else if($==="wpadd"){const J=Ja(j,_[0],_[1]),Be={x:(J.pts[F].x+J.pts[F+1].x)/2,y:(J.pts[F].y+J.pts[F+1].y)/2},Y=[...j.waypoints??[]];Y.splice(F,0,Be),(Z=e.onBeginChange)==null||Z.call(e),I(j.id,{waypoints:Y}),v({type:"waypoint",edgeId:j.id,index:F,began:!0})}else return!1;return!0},ae=w=>{var b,F,Z,J,Be,Y;if(w.button===2)return;try{(F=(b=x.current)==null?void 0:b.setPointerCapture)==null||F.call(b,w.pointerId)}catch{}if((J=(Z=x.current)==null?void 0:Z.focus)==null||J.call(Z),w.button===1||B){v({type:"pan",sx:w.clientX,sy:w.clientY,cam:o,moved:!0});return}const E=dt(w.target,"data-handle"),j=dt(w.target,"data-node-id"),_=dt(w.target,"data-edge-id"),$=dt(w.target,"data-doc-badge");if($){const[R,H]=$.split(":");l(R==="node"?{nodes:[H],edges:[]}:{nodes:[],edges:[H]}),(Be=e.onOpenDocs)==null||Be.call(e,{kind:R,id:H});return}if(E&&!d){if(K(E,w))return;if(E.startsWith("conn-")){const[H,ne]=E.slice(5).split(":"),te=ue.get(ne);if(!te)return;const pe=Me(w.clientX,w.clientY,te.z);v({type:"connect",from:te.id,fromSide:H,trail:[pe],cursor:pe,target:null});return}const R=ue.get(i.nodes[0]);if(!R)return;if(E==="height")v({type:"height",id:R.id,sy:w.clientY,h0:R.h,began:!1});else{const ne=Do(R)[(Number(E)+2)%4];v({type:"resize",id:R.id,fixed:ne,began:!1})}return}if(j&&a==="connect"&&!d){const R=ue.get(j),H=Me(w.clientX,w.clientY,R.z);v({type:"connect",from:j,trail:[H],cursor:H,target:null});return}if(j){let R=i.nodes;if(w.shiftKey||w.metaKey?R=R.includes(j)?R.filter(re=>re!==j):[...R,j]:R.includes(j)||(R=[j]),l({nodes:R,edges:[]}),d)return;const H=R.filter(re=>{const oe=ue.get(re);return oe&&cn(oe)&&!oe.locked}),ne=new Set([...R,...kr(H,t.nodes)]),te=new Map;for(const re of ne){const oe=ue.get(re);oe&&!oe.locked&&te.set(re,{x:oe.x,y:oe.y})}const pe=new Map;for(const re of t.edges)(Y=re.waypoints)!=null&&Y.length&&te.has(re.from)&&te.has(re.to)&&pe.set(re.id,re.waypoints);te.has(j)&&v({type:"move",start:Me(w.clientX,w.clientY),primary:j,origins:te,edgeOrigins:pe,moved:!1});return}if(_){l({nodes:[],edges:w.shiftKey?[...i.edges,_]:[_]});return}if(w.shiftKey){const R=lt(w.clientX,w.clientY);v({type:"marquee",start:R,cur:R,additive:i.nodes});return}v({type:"pan",sx:w.clientX,sy:w.clientY,cam:o,moved:!1})},se=w=>{var j,_,$,b,F,Z,J,Be,Y;if(!u){a==="connect"&&!((j=dt(w.target,"data-handle"))!=null&&j.startsWith("conn-"))&&z(dt(w.target,"data-node-id"));const R=dt(w.target,"data-node-id"),H=dt(w.target,"data-edge-id");L(dt(w.target,"data-doc-badge")??(R?`node:${R}`:H?`edge:${H}`:null));return}const E=w.altKey;switch(u.type){case"pan":{const R=w.clientX-u.sx,H=w.clientY-u.sy;if(!u.moved&&Math.hypot(R,H)<3)return;u.moved||v({...u,moved:!0}),s({...u.cam,x:u.cam.x+R,y:u.cam.y+H});break}case"move":{const R=Me(w.clientX,w.clientY),H=R.x-u.start.x,ne=R.y-u.start.y;if(!u.moved){if(Math.hypot(H,ne)<.15)return;(_=e.onBeginChange)==null||_.call(e)}const te=u.origins.get(u.primary),pe=E?H:Pt(te.x+H,h)-te.x,re=E?ne:Pt(te.y+ne,h)-te.y,oe=t.nodes.map(Mt=>{const pn=u.origins.get(Mt.id);return pn?{...Mt,x:pn.x+pe,y:pn.y+re}:Mt}),Ve=u.edgeOrigins.size?t.edges.map(Mt=>{const pn=u.edgeOrigins.get(Mt.id);return pn?{...Mt,waypoints:pn.map(Ko=>({x:Ko.x+pe,y:Ko.y+re}))}:Mt}):t.edges,ut=oe.find(Mt=>Mt.id===u.primary),Ur=($=En(ut,oe,new Set(u.origins.keys())))==null?void 0:$.id;(Ur!==u.dropTarget||!u.moved)&&v({...u,moved:!0,dropTarget:Ur}),(b=e.onChange)==null||b.call(e,{...t,nodes:oe,edges:Ve});break}case"resize":{const R=ue.get(u.id);if(!R)return;const H=Me(w.clientX,w.clientY,R.z),ne=E?H.x:Pt(H.x,h),te=E?H.y:Pt(H.y,h),pe=.5,re=Math.max(pe,Math.abs(ne-u.fixed.x)),oe=Math.max(pe,Math.abs(te-u.fixed.y));u.began||((F=e.onBeginChange)==null||F.call(e),v({...u,began:!0})),ct(Ve=>Ve.id===u.id?{...Ve,x:ne<u.fixed.x?u.fixed.x-re:u.fixed.x,y:te<u.fixed.y?u.fixed.y-oe:u.fixed.y,w:re,d:oe}:Ve);break}case"height":{const R=(u.sy-w.clientY)/(g.heightScale*o.zoom),H=Math.max(.1,E?u.h0+R:Pt(u.h0+R,.25));u.began||((Z=e.onBeginChange)==null||Z.call(e),v({...u,began:!0})),ct(ne=>ne.id===u.id?{...ne,h:H}:ne);break}case"connect":{const R=ue.get(u.from),H=Me(w.clientX,w.clientY,R.z),ne=u.trail[u.trail.length-1],te=Math.hypot(H.x-ne.x,H.y-ne.y)>.1?[...u.trail,H]:u.trail;v({...u,trail:te,cursor:H,target:Ut(w.clientX,w.clientY)});break}case"edgeEnd":v({...u,cursor:lt(w.clientX,w.clientY),target:Ut(w.clientX,w.clientY)});break;case"segment":{const{base:R}=u,H=R.pts[u.index],ne=R.pts[u.index+1],te=Math.abs(H.y-ne.y)<1e-6,pe=Me(w.clientX,w.clientY,R.zs[u.index]),re=te?H.y+(pe.y-u.start.y):H.x+(pe.x-u.start.x),oe=E?re:Pt(re,.25);if(Math.abs(oe-(te?H.y:H.x))<1e-6&&!u.began)return;const Ve=Fe.get(u.edgeId),ut=Ve&&W(Ve);if(!ut)return;u.began||((J=e.onBeginChange)==null||J.call(e),v({...u,began:!0})),I(u.edgeId,zg(R,ut[0],ut[1],u.index,oe));break}case"waypoint":{const R=Fe.get(u.edgeId);if(!(R!=null&&R.waypoints))return;const H=((Be=ue.get(R.from))==null?void 0:Be.z)??0,ne=Me(w.clientX,w.clientY,H),te=E?ne:{x:Pt(ne.x,.25),y:Pt(ne.y,.25)};u.began||((Y=e.onBeginChange)==null||Y.call(e),v({...u,began:!0})),I(R.id,{waypoints:R.waypoints.map((pe,re)=>re===u.index?te:pe)});break}case"marquee":{const R=lt(w.clientX,w.clientY);v({...u,cur:R});const H=Math.min(u.start.x,R.x),ne=Math.max(u.start.x,R.x),te=Math.min(u.start.y,R.y),pe=Math.max(u.start.y,R.y),re=t.nodes.filter(oe=>{const Ve=Ae(oe),ut=g.project(Ve.x,Ve.y,oe.z+(Vt(oe)?0:oe.h/2));return ut.x>=H&&ut.x<=ne&&ut.y>=te&&ut.y<=pe}).map(oe=>oe.id);l({nodes:[...new Set([...u.additive,...re])],edges:[]});break}}},dn=w=>{var E,j;if((u==null?void 0:u.type)==="pan"&&!u.moved&&l({nodes:[],edges:[]}),(u==null?void 0:u.type)==="connect"){const _=Ut(w.clientX,w.clientY),$=ue.get(u.from),b=_?ue.get(_):void 0;$&&b&&b.id!==$.id&&((E=e.onConnect)==null||E.call(e,$.id,b.id,Du(u.trail,$,u.fromSide,b)))}if((u==null?void 0:u.type)==="edgeEnd"){const _=Fe.get(u.edgeId),$=Ut(w.clientX,w.clientY),b=$?ue.get($):void 0,F=_&&(u.end==="from"?_.to:_.from);if(_&&b&&b.id!==F){const Z=Tg(b,Me(w.clientX,w.clientY,b.z)),J=b.id===(u.end==="from"?_.from:_.to);(j=e.onBeginChange)==null||j.call(e),I(_.id,{...u.end==="from"?{from:b.id,fromAnchor:Z}:{to:b.id,toAnchor:Z},...J?{}:{waypoints:void 0}})}}v(null)},et=w=>{var $,b,F;const E=dt(w.target,"data-handle");if(!E){const Z=dt(w.target,"data-node-id"),J=dt(w.target,"data-edge-id");Z?($=e.onOpenDocs)==null||$.call(e,{kind:"node",id:Z}):J&&((b=e.onOpenDocs)==null||b.call(e,{kind:"edge",id:J}));return}const j=Fe.get(i.edges[0]);if(!E.startsWith("wp:")||!(j!=null&&j.waypoints)||d)return;const _=Number(E.split(":")[1]);(F=e.onBeginChange)==null||F.call(e),I(j.id,{waypoints:j.waypoints.filter((Z,J)=>J!==_)})},Tt=N.useMemo(()=>{if(!f)return null;const w=[[0,0],[P.w,0],[0,P.h],[P.w,P.h]].map(([Y,R])=>g.unproject((Y-o.x)/o.zoom,(R-o.y)/o.zoom)),E=Math.floor(Math.min(...w.map(Y=>Y.x)))-1,j=Math.ceil(Math.max(...w.map(Y=>Y.x)))+1,_=Math.floor(Math.min(...w.map(Y=>Y.y)))-1,$=Math.ceil(Math.max(...w.map(Y=>Y.y)))+1,b=Math.max(j-E,$-_),F=b>400?10:b>160?5:1;let Z="",J="";const Be=(Y,R,H,ne)=>{const te=g.project(Y,R),pe=g.project(H,ne);return`M${te.x.toFixed(1)},${te.y.toFixed(1)}L${pe.x.toFixed(1)},${pe.y.toFixed(1)}`};for(let Y=Math.floor(E/F)*F;Y<=j;Y+=F){const R=Be(Y,_,Y,$);Y%(F*5)===0?J+=R:Z+=R}for(let Y=Math.floor(_/F)*F;Y<=$;Y+=F){const R=Be(E,Y,j,Y);Y%(F*5)===0?J+=R:Z+=R}return c.jsxs("g",{"data-noexport":"",pointerEvents:"none",children:[c.jsx("path",{d:Z,stroke:"var(--isd-grid, #dde3ec)",strokeWidth:1,vectorEffect:"non-scaling-stroke",fill:"none"}),c.jsx("path",{d:J,stroke:"var(--isd-grid-major, #c8d1de)",strokeWidth:1,vectorEffect:"non-scaling-stroke",fill:"none"})]})},[f,P,o,g]),tt=N.useMemo(()=>new Set(i.edges),[i.edges]),he=5/o.zoom,Kt=i.nodes.map(w=>{const E=ue.get(w);if(!E)return null;const j=Re(E).map(b=>g.project(b.x,b.y,E.z)),$=!Vt(E)&&g.mode==="3d"&&E.kind!=="sphere"?Re(E).map(b=>g.project(b.x,b.y,E.z+E.h)):null;return c.jsxs("g",{children:[c.jsx("polygon",{points:Lt(j),fill:"none",stroke:Ue,strokeWidth:1.5,strokeDasharray:"5 3",vectorEffect:"non-scaling-stroke"}),$&&E.kind!=="pyramid"&&E.kind!=="cone"&&c.jsx("polygon",{points:Lt($),fill:"none",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke"})]},w)}),fn=w=>lh.map(E=>{const j=Sr(w,{side:E,t:.5},.45),_=g.project(j.x,j.y,w.z);return c.jsx("circle",{"data-handle":`conn-${E}:${w.id}`,cx:_.x,cy:_.y,r:he*.9,fill:"#fff",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"crosshair"},children:c.jsx("title",{children:"Drag to connect"})},E)});let Wo=null;const nt=i.nodes.length===1?ue.get(i.nodes[0]):void 0;if(nt&&!d&&a==="select"&&!u){const w=Do(nt).map(b=>g.project(b.x,b.y,nt.z));let E=0;w.forEach((b,F)=>{(b.y>w[E].y+.01||Math.abs(b.y-w[E].y)<.01&&b.x>w[E].x)&&(E=F)});const j=Ae(nt),_=g.mode==="3d"&&!Vt(nt)&&nt.kind!=="sphere"&&nt.kind!=="image",$=g.project(j.x,j.y,nt.z+nt.h);Wo=c.jsxs("g",{children:[fn(nt),!nt.locked&&c.jsx("rect",{"data-handle":String(E),x:w[E].x-he,y:w[E].y-he,width:he*2,height:he*2,fill:"#fff",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"nwse-resize"}}),_&&!nt.locked&&c.jsx("circle",{"data-handle":"height",cx:$.x,cy:$.y-14/o.zoom,r:he,fill:Ue,stroke:"#fff",strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"ns-resize"},children:c.jsx("title",{children:"Drag to change height"})})]})}let Ho=null;const Zt=i.edges.length===1&&!i.nodes.length?Fe.get(i.edges[0]):void 0,Gt=Zt&&W(Zt);if(Zt&&Gt&&!d&&a==="select"&&(u==null?void 0:u.type)!=="edgeEnd"){const{r:w,screen:E}=Un(Zt,Gt[0],Gt[1],g),j=[];if(Zt.routing==="orthogonal")w.pts.slice(0,-1).forEach(($,b)=>{const F=w.pts[b+1];if(Math.hypot(F.x-$.x,F.y-$.y)<.6)return;const Z={x:(E[b].x+E[b+1].x)/2,y:(E[b].y+E[b+1].y)/2},J=Math.abs($.y-F.y)<1e-6;j.push(c.jsx("rect",{"data-handle":`seg:${b}`,x:Z.x-he*1.1,y:Z.y-he*1.1,width:he*2.2,height:he*2.2,rx:he*.6,fill:"#fff",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"move"},children:c.jsx("title",{children:`Drag to move this ${J?"east-west":"north-south"} segment`})},`seg${b}`))});else{const $=((sr=Zt.waypoints)==null?void 0:sr.length)??0;for(let b=0;b<E.length-1;b++){const F={x:(E[b].x+E[b+1].x)/2,y:(E[b].y+E[b+1].y)/2};j.push(c.jsx("circle",{"data-handle":`wpadd:${b}`,cx:F.x,cy:F.y,r:he*.75,fill:Ue,fillOpacity:.35,stroke:"#fff",strokeWidth:1,vectorEffect:"non-scaling-stroke",style:{cursor:"copy"},children:c.jsx("title",{children:"Drag to add a bend"})},`add${b}`))}for(let b=0;b<$;b++){const F=E[b+1];j.push(c.jsx("circle",{"data-handle":`wp:${b}`,cx:F.x,cy:F.y,r:he,fill:"#fff",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"move"},children:c.jsx("title",{children:"Drag to move, double-click to remove"})},`wp${b}`))}}const _=($,b)=>c.jsx("circle",{"data-handle":$,cx:b.x,cy:b.y,r:he,fill:Ue,stroke:"#fff",strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"grab"},children:c.jsx("title",{children:"Drag onto a node side to re-attach"})},$);j.push(_("edge-from",E[0]),_("edge-to",E[E.length-1])),Ho=c.jsx("g",{children:j})}let hn=null;if((u==null?void 0:u.type)==="connect"){const w=ue.get(u.from),E=u.target&&u.target!==u.from?ue.get(u.target):void 0;if(w){const j=Du(u.trail,w,u.fromSide,E??null),_=e.newEdgeStyle??{},$=_.routing??"orthogonal";let b;if(E)b=Un({from:w.id,to:E.id,routing:$,rounded:_.rounded,...j},w,E,g).d;else{const F=Ag(w,j,u.cursor),Z={x:0,y:0};b=hh({pts:F,zs:F.map(()=>w.z),aDir:Z,bDir:Z},"orthogonal",_.rounded??!0,g)}hn=c.jsxs("g",{pointerEvents:"none",children:[E&&c.jsx("polygon",{points:Lt(Re(E).map(F=>g.project(F.x,F.y,E.z))),fill:"rgba(37,99,235,0.12)",stroke:Ue,strokeWidth:2,vectorEffect:"non-scaling-stroke"}),c.jsx("path",{d:b,fill:"none",stroke:Ue,strokeWidth:2.5,strokeDasharray:"7 5",strokeLinejoin:"round",strokeLinecap:"round",vectorEffect:"non-scaling-stroke",markerEnd:`url(#${k}-preview-arrow)`})]})}}else if((u==null?void 0:u.type)==="edgeEnd"){const w=Fe.get(u.edgeId),E=w&&W(w);if(w&&E){const{screen:j}=Un(w,E[0],E[1],g),_=u.end==="from"?j[j.length-1]:j[0],$=u.target?ue.get(u.target):void 0;hn=c.jsxs("g",{pointerEvents:"none",children:[$&&c.jsx("polygon",{points:Lt(Re($).map(b=>g.project(b.x,b.y,$.z))),fill:"rgba(37,99,235,0.12)",stroke:Ue,strokeWidth:2,vectorEffect:"non-scaling-stroke"}),c.jsx("line",{x1:_.x,y1:_.y,x2:u.cursor.x,y2:u.cursor.y,stroke:Ue,strokeWidth:2,strokeDasharray:"6 4",vectorEffect:"non-scaling-stroke"})]})}}else(u==null?void 0:u.type)==="marquee"&&(hn=c.jsx("rect",{x:Math.min(u.start.x,u.cur.x),y:Math.min(u.start.y,u.cur.y),width:Math.abs(u.cur.x-u.start.x),height:Math.abs(u.cur.y-u.start.y),fill:"rgba(37,99,235,0.08)",stroke:Ue,strokeWidth:1,vectorEffect:"non-scaling-stroke",pointerEvents:"none"}));const Qt=14/o.zoom,rr=e.showDocBadges??"hover",Yt=new Set([...D?[D]:[],...i.nodes.map(w=>`node:${w}`),...i.edges.map(w=>`edge:${w}`)]),Vr=w=>rr==="always"||rr==="hover"&&Yt.has(w),Wr=(w,E,j)=>Vr(w)?c.jsxs("g",{className:"isd-doc-badge","data-doc-badge":w,transform:`translate(${E.x} ${E.y}) scale(${1/o.zoom})`,children:[c.jsx("title",{children:`Open docs: ${j}`}),c.jsx("rect",{x:-7,y:-7,width:14,height:14,rx:3.5}),c.jsx("path",{d:"M-3.5,-3 H3.5 M-3.5,0 H3.5 M-3.5,3 H1"})]},w):null,De=rr==="never"?null:[...t.nodes.filter(w=>xt(w.doc)).map(w=>{const E=Vt(w)||w.kind==="sphere",j=E?w.z:w.z+w.h,_=Re(w).map(b=>g.project(b.x,b.y,j));let $;if(E){const b=g.project(Ae(w).x,Ae(w).y,j),F=_.reduce((Z,J)=>J.y<Z.y?J:Z);$={x:F.x+(b.x-F.x)*.12,y:F.y+(b.y-F.y)*.12+Qt}}else{const b=_.reduce((F,Z)=>Z.x>F.x?Z:F);$={x:b.x+Qt*.2,y:b.y-Qt*.9}}return Wr(`node:${w.id}`,$,w.label||w.kind)}),...t.edges.filter(w=>xt(w.doc)).map(w=>{const E=W(w);if(!E)return null;const j=yh(Un(w,E[0],E[1],g).screen),_=w.label?(w.label.length*6.6+12)/2+12:0;return Wr(`edge:${w.id}`,{x:j.x+_,y:j.y-(w.label?0:Qt*.9)},w.label||"connection")})],or=C&&a==="connect"&&!u?ue.get(C):void 0,Hr=(u==null?void 0:u.type)==="pan"?u.moved?"grabbing":void 0:(u==null?void 0:u.type)==="move"?u.moved?"move":void 0:(u==null?void 0:u.type)==="connect"||(u==null?void 0:u.type)==="edgeEnd"?"crosshair":(u==null?void 0:u.type)==="segment"||(u==null?void 0:u.type)==="waypoint"?"move":void 0,Uo=Hr??(B?"grab":a==="connect"?"crosshair":"default");return c.jsxs("svg",{ref:Ge,className:Hr?"isd-canvas isd-canvas-dragging":"isd-canvas",tabIndex:0,style:{cursor:Uo,touchAction:"none"},onPointerDown:ae,onPointerMove:se,onPointerUp:dn,onPointerCancel:()=>v(null),onPointerLeave:()=>L(null),onDoubleClick:et,onContextMenu:w=>w.preventDefault(),onDragOver:w=>{w.dataTransfer.types.includes(nl)&&(w.preventDefault(),w.dataTransfer.dropEffect="copy")},onDrop:w=>{var j;const E=w.dataTransfer.getData(nl);E&&(w.preventDefault(),(j=e.onDropPayload)==null||j.call(e,E,Me(w.clientX,w.clientY)))},children:[c.jsx("defs",{"data-noexport":"",children:c.jsx("marker",{id:`${k}-preview-arrow`,viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"4",markerHeight:"4",orient:"auto-start-reverse",children:c.jsx("path",{d:"M0,0 L10,5 L0,10 z",fill:"#2563eb"})})}),c.jsxs("g",{"data-camera":"",transform:`translate(${o.x} ${o.y}) scale(${o.zoom})`,children:[Tt,c.jsx("g",{"data-scene":"",children:c.jsx(wh,{diagram:t,proj:g,idPrefix:k,selectedEdges:tt,animate:m})}),c.jsxs("g",{"data-noexport":"",children:[e.focus&&c.jsx(vh,{target:e.focus,diagram:t,proj:g}),or&&c.jsxs("g",{children:[c.jsx("polygon",{points:Lt(Re(or).map(w=>g.project(w.x,w.y,or.z))),fill:"rgba(37,99,235,0.12)",stroke:Ue,strokeWidth:2,vectorEffect:"non-scaling-stroke",pointerEvents:"none"}),fn(or)]}),(u==null?void 0:u.type)==="move"&&u.dropTarget&&ue.get(u.dropTarget)&&c.jsx("polygon",{points:Lt(Re(ue.get(u.dropTarget)).map(w=>g.project(w.x,w.y,ue.get(u.dropTarget).z))),fill:"rgba(37,99,235,0.08)",stroke:Ue,strokeWidth:2.5,strokeDasharray:"8 5",vectorEffect:"non-scaling-stroke",pointerEvents:"none"}),c.jsx("g",{pointerEvents:"none",children:Kt}),De,Wo,Ho,hn]})]})]})}const Xi="http://www.w3.org/2000/svg";async function Qg(e){if(e.startsWith("data:"))return e;const t=await fetch(e,{mode:"cors"});if(!t.ok)throw new Error(`Failed to fetch ${e}`);const n=await t.blob();return new Promise((r,o)=>{const s=new FileReader;s.onload=()=>r(s.result),s.onerror=()=>o(s.error),s.readAsDataURL(n)})}async function xh(e,t={}){const n=e.querySelector("[data-scene]");if(!n)throw new Error("No scene found in SVG");const r=t.padding??24,o=n.getBBox(),s=n.cloneNode(!0);s.querySelectorAll("[data-noexport]").forEach(d=>d.remove()),s.querySelectorAll("[data-node-id],[data-edge-id]").forEach(d=>{d.removeAttribute("style")}),await Promise.all([...s.querySelectorAll("image")].map(async d=>{const f=d.getAttribute("href");if(f)try{d.setAttribute("href",await Qg(f))}catch{}}));const i=document.createElementNS(Xi,"svg"),l=Math.ceil(o.width+r*2),a=Math.ceil(o.height+r*2);if(i.setAttribute("xmlns",Xi),i.setAttribute("viewBox",`${o.x-r} ${o.y-r} ${l} ${a}`),i.setAttribute("width",String(l)),i.setAttribute("height",String(a)),i.setAttribute("font-family","Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"),t.background){const d=document.createElementNS(Xi,"rect");d.setAttribute("x",String(o.x-r)),d.setAttribute("y",String(o.y-r)),d.setAttribute("width",String(l)),d.setAttribute("height",String(a)),d.setAttribute("fill",t.background),i.appendChild(d)}return i.appendChild(s),new XMLSerializer().serializeToString(i)}async function Yg(e,t={}){const n=await xh(e,{background:t.background??"#ffffff"}),r=t.scale??2,o=URL.createObjectURL(new Blob([n],{type:"image/svg+xml"}));try{const s=new Image;s.src=o,await s.decode();const i=document.createElement("canvas");i.width=Math.ceil(s.width*r),i.height=Math.ceil(s.height*r);const l=i.getContext("2d");return l.scale(r,r),l.drawImage(s,0,0),await new Promise((a,d)=>i.toBlob(f=>f?a(f):d(new Error("PNG encoding failed")),"image/png"))}finally{URL.revokeObjectURL(o)}}function Xg(e){return JSON.stringify(e,null,2)}function ps(e,t,n="application/octet-stream"){const r=typeof e=="string"?new Blob([e],{type:n}):e,o=URL.createObjectURL(r),s=document.createElement("a");s.href=o,s.download=t,s.click(),setTimeout(()=>URL.revokeObjectURL(o),1e3)}function qg(e){return new Promise((t,n)=>{const r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(r.error),r.readAsDataURL(e)})}const Ru="aws-icons",Jg="3.3.0",ey={"architecture-service":"Services",resource:"Resources","architecture-group":"Groups",category:"Categories"};function ty(e){return e.replace(/\.svg$/i,"").replace(/^(Amazon|AWS)(?=[A-Z0-9])/,"$1 ").replace(/([a-z])([A-Z])/g,"$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g,"$1 $2").replace(/\s+/g," ").replace(/\b(Io T|Cloud (?:Front|Watch|Formation|Trail|Shell|Search|Map|HSM)|Dynamo DB|Elasti Cache|Sage Maker|Open Search|Event Bridge|Code (?:Build|Commit|Deploy|Pipeline|Guru|Catalyst|Whisperer)|Doc DB)\b/g,t=>t.replace(" ","")).trim()}async function ny(e={}){const t=e.version??Jg,n=e.folders??["architecture-service","resource","architecture-group","category"],r=await fetch(`https://data.jsdelivr.com/v1/packages/npm/${Ru}@${t}?structure=flat`,{signal:e.signal});if(!r.ok)throw new Error(`Could not list AWS icons (${r.status})`);const o=await r.json(),s=[];for(const l of o.files){const a=/^\/icons\/([^/]+)\/([^/]+\.svg)$/.exec(l.name);!a||!n.includes(a[1])||s.push({id:`aws:${a[1]}/${a[2]}`,name:ty(a[2]),src:`https://cdn.jsdelivr.net/npm/${Ru}@${t}${l.name}`,category:ey[a[1]]??a[1]})}return s.sort((l,a)=>n.indexOf(i(l))-n.indexOf(i(a))||l.name.localeCompare(a.name)),{id:"aws",name:"AWS",icons:s};function i(l){var a;return((a=/^aws:([^/]+)/.exec(l.id))==null?void 0:a[1])??""}}const ry={cube:c.jsx("path",{d:"M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L18.7 8 12 11.7 5.3 8 12 4.3ZM5 9.7l6 3.3v6.6l-6-3.3V9.7Zm8 9.9V13l6-3.3v6.6l-6 3.3Z"}),square:c.jsx("path",{d:"M4 4h16v16H4V4Zm2 2v12h12V6H6Z"}),rotl:c.jsx("path",{d:"M7.1 7.1A7 7 0 1 1 5 12H3a9 9 0 1 0 2.6-6.4L3 3v6h6L7.1 7.1Z"}),rotr:c.jsx("path",{d:"M16.9 7.1A7 7 0 1 0 19 12h2a9 9 0 1 1-2.6-6.4L21 3v6h-6l1.9-1.9Z"}),pointer:c.jsx("path",{d:"m5 3 14 7-6 2-2 6L5 3Z"}),link:c.jsx("path",{d:"M3 17h6v-2H5V9h4V7H3v10Zm12-10v2h4v6h-4v2h6V7h-6ZM8 11h8v2H8v-2Z"}),undo:c.jsx("path",{d:"M9 7V3L2 10l7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11Z"}),redo:c.jsx("path",{d:"M15 7V3l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11Z"}),plus:c.jsx("path",{d:"M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"}),minus:c.jsx("path",{d:"M5 11h14v2H5z"}),fit:c.jsx("path",{d:"M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z"}),download:c.jsx("path",{d:"M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16l-5.7-5.7 1.4-1.4 3.3 3.3V3ZM4 18h16v2H4v-2Z"}),upload:c.jsx("path",{d:"M11 16h2V6.8l3.3 3.3 1.4-1.4L12 3 6.3 8.7l1.4 1.4L11 6.8V16Zm-7 2h16v2H4v-2Z"}),trash:c.jsx("path",{d:"M9 3h6l1 2h4v2H4V5h4l1-2ZM6 9h12l-1 12H7L6 9Z"}),copy:c.jsx("path",{d:"M8 3h11v13h-2V5H8V3ZM4 7h11v14H4V7Zm2 2v10h7V9H6Z"}),grid:c.jsx("path",{d:"M3 3h18v18H3V3Zm2 2v4h4V5H5Zm6 0v4h4V5h-4Zm6 0v4h2V5h-2ZM5 11v4h4v-4H5Zm6 0v4h4v-4h-4Zm6 0v4h2v-4h-2ZM5 17v2h4v-2H5Zm6 0v2h4v-2h-4Zm6 0v2h2v-2h-2Z"}),panelL:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v12h4V6H5Zm6 0v12h8V6h-8Z"}),panelR:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v12h8V6H5Zm10 0v12h4V6h-4Z"}),close:c.jsx("path",{d:"m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z"}),group:c.jsx("path",{d:"M3 3h6v2H5v4H3V3Zm12 0h6v6h-2V5h-4V3ZM3 15h2v4h4v2H3v-6Zm16 0h2v6h-6v-2h4v-4ZM8 8h8v8H8V8Z"}),doc:c.jsx("path",{d:"M6 2h9l5 5v15H6V2Zm2 2v16h10V8h-4V4H8Zm2 7h6v2h-6v-2Zm0 4h6v2h-6v-2Z"}),play:c.jsx("path",{d:"M8 5v14l11-7L8 5Z"}),pause:c.jsx("path",{d:"M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"}),image:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v9.6l4-4 4 4 2-2 4 4V6H5Zm10 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"})};function Qe({name:e,size:t=16}){return c.jsx("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":!0,children:ry[e]})}function ze({icon:e,label:t,active:n,disabled:r,onClick:o,children:s}){return c.jsxs("button",{type:"button",className:`isd-btn${n?" is-active":""}`,title:t,"aria-label":t,"aria-pressed":n,disabled:r,onClick:o,children:[e&&c.jsx(Qe,{name:e}),s&&c.jsx("span",{className:"isd-btn-label",children:s})]})}function ve({label:e,children:t}){return c.jsxs("label",{className:"isd-field",children:[c.jsx("span",{children:e}),t]})}function gn({value:e,onChange:t,step:n=.5,min:r,max:o}){return c.jsx("input",{type:"number",className:"isd-input",value:Number.isFinite(e)?+e.toFixed(3):0,step:n,min:r,max:o,onChange:s=>{const i=parseFloat(s.target.value);Number.isFinite(i)&&t(r!==void 0?Math.max(r,i):i)}})}const oy=N.lazy(()=>sh(()=>import("./DocsPanel-CBpdBFal.js"),[],import.meta.url)),sy=1e3,no={nodes:[],edges:[]};function iy(e){var pc;const{readOnly:t,awsIcons:n=!0}=e,r=tc(e.theme),[o,s]=N.useState(()=>({d:e.value??e.defaultValue??Qa(),past:[],future:[]})),i=o.d,l=i.view??e.defaultView??"3d",[a,d]=N.useState(0),[f,m]=N.useState({x:0,y:0,zoom:1}),[h,k]=N.useState(no),[g,x]=N.useState("select"),[P,y]=N.useState(!0),[u,v]=N.useState(!0),[C,z]=N.useState({}),[D,L]=N.useState("shapes"),[B,ce]=N.useState(""),[U,Ge]=N.useState(null),[lt,Me]=N.useState(null),[Ut,ue]=N.useState(e.userIcons??[]),[Fe,ct]=N.useState(null),[I,W]=N.useState(!1),K=N.useRef(null),ae=N.useRef(null),[se,dn]=N.useState(!1),[et,Tt]=N.useState(!0),[tt,he]=N.useState(!0),[Kt,fn]=N.useState(!1),[Wo,nt]=N.useState(null),[Ho,Zt]=N.useState({kind:"diagram"}),Gt=N.useRef(null),hn=N.useRef(null),Qt=N.useRef(null),rr=N.useRef(null),Yt=N.useMemo(()=>new Io(l,a),[l,a]),Vr=e.userIcons??Ut,Wr=p=>{var S;ue(p),(S=e.onUserIconsChange)==null||S.call(e,p)};N.useEffect(()=>{e.value&&e.value!==rr.current&&e.value!==o.d&&s(p=>({d:e.value,past:[...p.past,p.d].slice(-200),future:[]}))},[e.value]),N.useEffect(()=>{var p;o.d!==e.value&&(rr.current=o.d,(p=e.onChange)==null||p.call(e,o.d))},[o.d]),N.useEffect(()=>{if(!n)return;const p=new AbortController;return ny({signal:p.signal}).then(Ge).catch(S=>!p.signal.aborted&&Me(String(S.message??S))),()=>p.abort()},[n]),N.useEffect(()=>{if(!Fe)return;const p=setTimeout(()=>ct(null),2200);return()=>clearTimeout(p)},[Fe]);const De=N.useCallback((p,S="push",T)=>{s(A=>{var Q;const V=typeof p=="function"?p(A.d):p;if(V===A.d)return A;const G=Date.now(),be=T&&((Q=Qt.current)==null?void 0:Q.key)===T&&G-Qt.current.t<1200;return Qt.current=T?{key:T,t:G}:null,S==="replace"||be?{...A,d:V}:{d:V,past:[...A.past,A.d].slice(-200),future:[]}})},[]),or=N.useCallback(()=>{Qt.current=null,s(p=>({d:p.d,past:[...p.past,p.d].slice(-200),future:[]}))},[]),Hr=(p,S)=>p.view===S.view?p:{...p,view:S.view},Uo=()=>s(p=>p.past.length?{d:Hr(p.past[p.past.length-1],p.d),past:p.past.slice(0,-1),future:[p.d,...p.future]}:p),sr=()=>s(p=>p.future.length?{d:Hr(p.future[0],p.d),past:[...p.past,p.d],future:p.future.slice(1)}:p);N.useLayoutEffect(()=>{const p=K.current;if(!p)return;const S=A=>dn(V=>{const G=A<sy;return G!==V&&(Tt(!G),he(!G)),G});S(p.getBoundingClientRect().width);const T=new ResizeObserver(([A])=>S(A.contentRect.width));return T.observe(p),()=>T.disconnect()},[]),N.useEffect(()=>{se&&!Kt&&!t&&(h.nodes.length||h.edges.length)&&he(!0)},[se,h]);const w=h.nodes.length===1&&!h.edges.length?{kind:"node",id:h.nodes[0]}:h.edges.length===1&&!h.nodes.length?{kind:"edge",id:h.edges[0]}:!h.nodes.length&&!h.edges.length?{kind:"diagram"}:null;N.useEffect(()=>{if(w&&(Zt(p=>gg(p,w)?p:w),t&&w.kind!=="diagram")){const p=w.kind==="node"?i.nodes.find(S=>S.id===w.id):i.edges.find(S=>S.id===w.id);xt(p==null?void 0:p.doc)&&fn(!0)}},[w&&Ar(w)]);const E=p=>{p&&(Zt(p),k(p.kind==="diagram"?no:p.kind==="node"?{nodes:[p.id],edges:[]}:{nodes:[],edges:[p.id]})),fn(!0),se&&(he(!1),Tt(!1))},j=p=>{if(E(p),p.kind==="diagram")return;let S=null;if(p.kind==="node"){const G=i.nodes.find(be=>be.id===p.id);G&&(S=Yt.project(G.x+G.w/2,G.y+G.d/2,G.z))}else{const G=i.edges.find(le=>le.id===p.id),be=G&&i.nodes.find(le=>le.id===G.from),Q=G&&i.nodes.find(le=>le.id===G.to);if(be&&Q){const le=Yt.project(be.x+be.w/2,be.y+be.d/2,be.z),Ot=Yt.project(Q.x+Q.w/2,Q.y+Q.d/2,Q.z);S={x:(le.x+Ot.x)/2,y:(le.y+Ot.y)/2}}}if(!S)return;const{w:T,h:A}=$(),V=se?T:Math.max(T/2,T-440);m(G=>({...G,x:V/2-S.x*G.zoom,y:A/2-S.y*G.zoom}))},_=(p,S)=>De(T=>vg(T,p,S),"push",`doc:${Ar(p)}`),$=()=>{var S;const p=(S=ae.current)==null?void 0:S.getBoundingClientRect();return{w:(p==null?void 0:p.width)??800,h:(p==null?void 0:p.height)??600}},b=N.useCallback((p,S)=>{const{w:T,h:A}=$(),V=p.nodes.flatMap(qt=>Re(qt).flatMap(Qo=>[S.project(Qo.x,Qo.y,qt.z),S.project(Qo.x,Qo.y,qt.z+(Vt(qt)?0:qt.h))]));if(!V.length){m({x:T/2,y:A/3,zoom:1});return}const G=V.map(qt=>qt.x),be=V.map(qt=>qt.y),Q=Math.min(...G),le=Math.max(...G),Ot=Math.min(...be),mc=Math.max(...be)+24,ki=Math.min(1.6,Math.max(.2,Math.min(T*.85/(le-Q||1),A*.85/(mc-Ot||1))));m({zoom:ki,x:T/2-(Q+le)/2*ki,y:A/2-(Ot+mc)/2*ki})},[]);N.useEffect(()=>{const p=ae.current;if(!p)return;const S=new ResizeObserver(([T])=>{T.contentRect.width<10||T.contentRect.height<10||(S.disconnect(),b(o.d,Yt))});return S.observe(p),()=>S.disconnect()},[]);const F=(p=Yt,S=f)=>{const{w:T,h:A}=$();return p.unproject((T/2-S.x)/S.zoom,(A/2-S.y)/S.zoom)},Z=(p,S)=>{const T=F(),V=new Io(p,S).project(T.x,T.y),{w:G,h:be}=$();m({...f,x:G/2-V.x*f.zoom,y:be/2-V.y*f.zoom}),p!==l&&s(Q=>({...Q,d:{...Q.d,view:p}})),d(S)},J=p=>{const{w:S,h:T}=$(),A=Math.min(4,Math.max(.15,f.zoom*p)),V=A/f.zoom;m({zoom:A,x:S/2-(S/2-f.x)*V,y:T/2-(T/2-f.y)*V})},Be=p=>{De(S=>({...S,nodes:[...S.nodes,p]})),k({nodes:[p.id],edges:[]}),x("select")},Y=(p,S)=>{t||(se&&Tt(!1),p.type==="shape"&&p.kind&&Be(Ms(p.kind,S.x,S.y)),p.type==="icon"&&p.src&&Be(dg(p.src,p.name??"",S.x,S.y)))},R=(p,S,T)=>De(A=>({...A,nodes:A.nodes.map(V=>V.id===p?{...V,...S}:V)}),"push",T&&`${p}:${T}`),H=(p,S)=>De(T=>({...T,nodes:T.nodes.map(A=>p.includes(A.id)?{...A,...S}:A)})),ne=(p,S,T)=>{const A=Object.fromEntries(Object.entries(S).filter(([V])=>hg.includes(V)));Object.keys(A).length&&z(V=>({...V,...A})),te(p,S,T)},te=(p,S,T)=>De(A=>({...A,edges:A.edges.map(V=>V.id===p?{...V,...S}:V)}),"push",T&&`${p}:${T}`),pe=p=>new Set([...p,...kr(p,i.nodes)]),re=()=>{if(!h.nodes.length&&!h.edges.length)return;const p=pe(h.nodes),S=new Set(h.edges);De(T=>({...T,nodes:T.nodes.filter(A=>!p.has(A.id)),edges:T.edges.filter(A=>!S.has(A.id)&&!p.has(A.from)&&!p.has(A.to))})),k(no)},oe=()=>{const p=pe(h.nodes);hn.current={nodes:i.nodes.filter(S=>p.has(S.id)),edges:i.edges.filter(S=>p.has(S.from)&&p.has(S.to))}},Ve=(p=1)=>{const S=hn.current;if(!(S!=null&&S.nodes.length))return;const T=new Map,A=S.nodes.map(Q=>{const le=xr("n");return T.set(Q.id,le),{...Q,id:le,x:Q.x+p,y:Q.y+p}}),V=S.edges.map(Q=>{var le;return{...Q,id:xr("e"),from:T.get(Q.from),to:T.get(Q.to),waypoints:(le=Q.waypoints)==null?void 0:le.map(Ot=>({x:Ot.x+p,y:Ot.y+p}))}});De(Q=>({...Q,nodes:[...Q.nodes,...A],edges:[...Q.edges,...V]}));const G=new Set(A.map(Q=>Q.id)),be=kr(G,A);k({nodes:A.filter(Q=>!be.has(Q.id)).map(Q=>Q.id),edges:[]}),hn.current={nodes:A,edges:V}},ut=()=>{const p=i.nodes.filter(V=>h.nodes.includes(V.id));if(!p.length)return;const S=Au(p),T=En({...p[0],...S,kind:"area"},i.nodes,new Set(p.map(V=>V.id))),A={...Ms("area",0,0,{z:Math.min(...p.map(V=>V.z)),color:"#64748b",opacity:.08,dashed:!0,label:"Group"}),...S};De(V=>({...V,nodes:[A,...V.nodes]})),k({nodes:[A.id],edges:[]}),ct(T?`Grouped inside ${T.label||"area"}`:"Grouped")},Ur=()=>{const p=i.nodes.filter(A=>h.nodes.includes(A.id)&&cn(A));if(!p.length)return;const S=new Set(p.map(A=>A.id)),T=i.nodes.filter(A=>!S.has(A.id)&&p.some(V=>{var G;return((G=En(A,i.nodes))==null?void 0:G.id)===V.id}));De(A=>({...A,nodes:A.nodes.filter(V=>!S.has(V.id))})),k({nodes:T.map(A=>A.id),edges:[]})},Mt=p=>{const S=i.nodes.find(V=>V.id===p),T=kr([p],i.nodes),A=i.nodes.filter(V=>T.has(V.id));S&&A.length&&R(p,Au(A))},pn=p=>{const S=new Set(h.nodes);De(T=>{const A=T.nodes.filter(G=>S.has(G.id)),V=T.nodes.filter(G=>!S.has(G.id));return{...T,nodes:p==="front"?[...V,...A]:[...A,...V]}})},Ko=p=>{if(p.target.closest('input,textarea,select,[contenteditable="true"]'))return;const S=p.metaKey||p.ctrlKey,T=p.key.toLowerCase();if(S&&T==="z")p.preventDefault(),p.shiftKey?sr():Uo();else if(S&&T==="y")p.preventDefault(),sr();else if(T==="d"&&!S)Kt?fn(!1):E();else if(S&&T==="a")p.preventDefault(),k({nodes:i.nodes.map(A=>A.id),edges:[]});else{if(t)return;if(T==="delete"||T==="backspace")p.preventDefault(),re();else if(S&&T==="c")oe();else if(S&&T==="x")oe(),re();else if(S&&T==="v")Ve();else if(S&&T==="g")p.preventDefault(),p.shiftKey?Ur():ut();else if(S&&T==="d")p.preventDefault(),oe(),Ve();else if(T==="escape")k(no),x("select");else if(T==="v"&&!S)x("select");else if(T==="c"&&!S)x("connect");else if(T==="tab")p.preventDefault(),Z(l==="3d"?"2d":"3d",a);else if(T==="r"&&l==="3d")Z(l,(a+(p.shiftKey?3:1))%4);else if(T.startsWith("arrow")&&h.nodes.length){p.preventDefault();const A=p.shiftKey?1:.5,G={arrowleft:{x:-1,y:0},arrowright:{x:1,y:0},arrowup:{x:0,y:-1},arrowdown:{x:0,y:1}}[T],be=pe(h.nodes.filter(Q=>{var le;return!((le=i.nodes.find(Ot=>Ot.id===Q))!=null&&le.locked)}));De(Q=>({...Q,nodes:Q.nodes.map(le=>be.has(le.id)&&!le.locked?{...le,x:le.x+G.x*A,y:le.y+G.y*A}:le)}),"push","nudge")}}},lc=N.useRef(null),xi=N.useRef(null),Kr=async p=>{W(!1);try{p==="docs"&&ps(wg(i),"architecture.md","text/markdown"),p==="json"&&ps(Xg(i),"diagram.json","application/json");const S=r==="dark"?xg.dark:void 0;p==="svg"&&Gt.current&&ps(await xh(Gt.current,{background:S}),"diagram.svg","image/svg+xml"),p==="png"&&Gt.current&&ps(await Yg(Gt.current,{background:S}),"diagram.png")}catch(S){ct(`Export failed: ${S.message}`)}},cc=async p=>{try{const S=mg(JSON.parse(await p.text()));De(S),k(no),b(S,Yt),ct(`Imported ${S.nodes.length} nodes`)}catch(S){ct(S.message)}},uc=async p=>{const S=[];for(const T of Array.from(p))T.type.startsWith("image/")&&S.push({id:xr("img"),name:T.name.replace(/\.[^.]+$/,""),src:await qg(T),category:"Imported"});S.length&&(Wr([...Vr,...S]),L("mine"),ct(`Imported ${S.length} image${S.length>1?"s":""}`))},dc=()=>{var T;const p=window.prompt("Image URL (PNG, SVG, JPG…)");if(!p)return;const S=((T=p.split("/").pop())==null?void 0:T.replace(/\.[^.]+$/,""))||"Image";Wr([...Vr,{id:xr("img"),name:S,src:p,category:"Imported"}]),L("mine")},fc=[...U?[U]:[],...e.iconLibraries??[],{id:"mine",name:"My images",icons:Vr}],ir=fc.find(p=>p.id===D),Zo=B.trim().toLowerCase(),Go=ir?ir.icons.filter(p=>{var S;return!Zo||p.name.toLowerCase().includes(Zo)||((S=p.category)==null?void 0:S.toLowerCase().includes(Zo))}):[],Eh=N.useMemo(()=>{const p=new Map;for(const S of Go.slice(0,400)){const T=S.category??"";p.has(T)||p.set(T,[]),p.get(T).push(S)}return[...p.entries()]},[ir,Zo]),hc=p=>S=>{S.dataTransfer.setData(nl,JSON.stringify(p)),S.dataTransfer.effectAllowed="copy"},Xt=h.nodes.length===1?i.nodes.find(p=>p.id===h.nodes[0]):void 0,Zr=h.edges.length===1&&!h.nodes.length?i.edges.find(p=>p.id===h.edges[0]):void 0;return c.jsx(ec.Provider,{value:r,children:c.jsxs("div",{ref:K,"data-theme":r,className:`isd-root${se?" is-compact":""} ${e.className??""}`,style:e.style,onKeyDown:Ko,onDragOver:p=>p.dataTransfer.types.includes("Files")&&p.preventDefault(),onDrop:p=>{if(p.dataTransfer.files.length&&!t){p.preventDefault();const S=Array.from(p.dataTransfer.files),T=S.find(A=>A.name.endsWith(".json"));T?cc(T):uc(S)}},children:[c.jsxs("div",{className:"isd-toolbar-wrap",children:[c.jsxs("div",{className:"isd-toolbar",children:[!t&&c.jsx("div",{className:"isd-group",children:c.jsx(ze,{icon:"panelL",label:et?"Hide shapes & icons":"Show shapes & icons",active:et,onClick:()=>Tt(!et)})}),c.jsxs("div",{className:"isd-group",children:[c.jsx(ze,{icon:"cube",label:"2.5D view (Tab)",active:l==="3d",onClick:()=>Z("3d",a),children:"2.5D"}),c.jsx(ze,{icon:"square",label:"Flat view (Tab)",active:l==="2d",onClick:()=>Z("2d",a),children:"2D"})]}),c.jsxs("div",{className:"isd-group",children:[c.jsx(ze,{icon:"rotl",label:"Rotate left (Shift+R)",disabled:l==="2d",onClick:()=>Z(l,(a+3)%4)}),c.jsx(ze,{icon:"rotr",label:"Rotate right (R)",disabled:l==="2d",onClick:()=>Z(l,(a+1)%4)})]}),!t&&c.jsxs("div",{className:"isd-group",children:[c.jsx(ze,{icon:"pointer",label:"Select (V)",active:g==="select",onClick:()=>x("select")}),c.jsx(ze,{icon:"link",label:"Connect (C): drag from one node to another",active:g==="connect",onClick:()=>x("connect")})]}),!t&&c.jsxs("div",{className:"isd-group",children:[c.jsx(ze,{icon:"undo",label:"Undo (⌘Z)",disabled:!o.past.length,onClick:Uo}),c.jsx(ze,{icon:"redo",label:"Redo (⇧⌘Z)",disabled:!o.future.length,onClick:sr})]}),c.jsxs("div",{className:"isd-group isd-hide-compact",children:[c.jsx(ze,{icon:"minus",label:"Zoom out",onClick:()=>J(1/1.25)}),c.jsxs("span",{className:"isd-zoom",children:[Math.round(f.zoom*100),"%"]}),c.jsx(ze,{icon:"plus",label:"Zoom in",onClick:()=>J(1.25)})]}),c.jsxs("div",{className:"isd-group",children:[c.jsx(ze,{icon:"fit",label:"Fit to content",onClick:()=>b(i,Yt)}),c.jsx(ze,{icon:"grid",label:"Toggle grid",active:P,onClick:()=>y(!P)}),c.jsx(ze,{icon:u?"pause":"play",label:u?"Pause connection animations":"Play connection animations",onClick:()=>v(!u)})]}),c.jsx("div",{className:"isd-spacer"}),!t&&c.jsx("div",{className:"isd-group",children:c.jsx(ze,{icon:"upload",label:"Open diagram (.json)",onClick:()=>{var p;return(p=lc.current)==null?void 0:p.click()},children:"Open"})}),c.jsx("div",{className:"isd-group",children:c.jsx(ze,{icon:"doc",label:Kt?"Hide docs (D)":"Show docs (D)",active:Kt,onClick:()=>Kt?fn(!1):E(),children:"Docs"})}),c.jsx("div",{className:"isd-group",children:c.jsx(ze,{icon:"download",label:"Export",active:I,onClick:()=>W(!I),children:"Export"})}),!t&&c.jsx("div",{className:"isd-group",children:c.jsx(ze,{icon:"panelR",label:tt?"Hide inspector":"Show inspector",active:tt,onClick:()=>he(!tt)})}),c.jsx("input",{ref:lc,type:"file",accept:".json,application/json",hidden:!0,onChange:p=>{var T;const S=(T=p.target.files)==null?void 0:T[0];S&&cc(S),p.target.value=""}}),c.jsx("input",{ref:xi,type:"file",accept:"image/*",multiple:!0,hidden:!0,onChange:p=>{p.target.files&&uc(p.target.files),p.target.value=""}})]}),I&&c.jsxs("div",{className:"isd-menu",onMouseLeave:()=>W(!1),children:[c.jsx("button",{type:"button",onClick:()=>Kr("png"),children:"PNG image"}),c.jsx("button",{type:"button",onClick:()=>Kr("svg"),children:"SVG vector"}),c.jsx("button",{type:"button",onClick:()=>Kr("json"),children:"Diagram JSON"}),c.jsx("button",{type:"button",onClick:()=>Kr("docs"),children:"Docs (Markdown)"})]})]}),c.jsxs("div",{className:"isd-body",children:[!t&&et&&c.jsxs("aside",{className:"isd-palette",children:[se&&c.jsx("button",{type:"button",className:"isd-drawer-close","aria-label":"Close panel",onClick:()=>Tt(!1),children:c.jsx(Qe,{name:"close"})}),c.jsxs("div",{className:"isd-tabs",role:"tablist",children:[[{id:"shapes",name:"Shapes"},...fc].map(p=>c.jsx("button",{type:"button",role:"tab","aria-selected":D===p.id,className:D===p.id?"is-active":"",onClick:()=>L(p.id),children:p.name},p.id)),n&&!U&&c.jsx("span",{className:"isd-tab-note",children:lt?"AWS icons unavailable":"Loading AWS…"})]}),D==="shapes"?c.jsxs("div",{className:"isd-palette-scroll",children:[c.jsx("div",{className:"isd-shape-grid",children:ah.map(p=>c.jsxs("button",{type:"button",className:"isd-tile",draggable:!0,onDragStart:hc({type:"shape",kind:p.kind}),onClick:()=>Y({type:"shape",kind:p.kind},F()),title:`${p.name} — click or drag onto canvas`,children:[c.jsx(Kg,{node:Ms(p.kind,0,0,{id:`pv-${p.kind}`,text:"Aa",fontSize:1.4})}),c.jsx("span",{children:p.name})]},p.kind))}),c.jsx("div",{className:"isd-section-title",children:"Images & logos"}),c.jsxs("div",{className:"isd-import-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{var p;return(p=xi.current)==null?void 0:p.click()},children:[c.jsx(Qe,{name:"upload"})," Upload"]}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:dc,children:[c.jsx(Qe,{name:"link"})," From URL"]})]}),c.jsx("p",{className:"isd-hint",children:"Tip: drop image files anywhere on the editor to import them."})]}):c.jsxs(c.Fragment,{children:[c.jsx("div",{className:"isd-search",children:c.jsx("input",{className:"isd-input",placeholder:`Search ${(ir==null?void 0:ir.name)??""}…`,value:B,onChange:p=>ce(p.target.value)})}),c.jsxs("div",{className:"isd-palette-scroll",children:[D==="mine"&&c.jsxs("div",{className:"isd-import-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{var p;return(p=xi.current)==null?void 0:p.click()},children:[c.jsx(Qe,{name:"upload"})," Upload"]}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:dc,children:[c.jsx(Qe,{name:"link"})," From URL"]})]}),Eh.map(([p,S])=>c.jsxs("div",{children:[p&&c.jsx("div",{className:"isd-section-title",children:p}),c.jsx("div",{className:"isd-icon-grid",children:S.map(T=>c.jsxs("button",{type:"button",className:"isd-icon-tile",title:T.name,draggable:!0,onDragStart:hc({type:"icon",src:T.src,name:T.name}),onClick:()=>Y({type:"icon",src:T.src,name:T.name},F()),children:[c.jsx("img",{src:T.src,alt:"",loading:"lazy",draggable:!1}),c.jsx("span",{children:T.name.replace(/^(Amazon|AWS) /,"")})]},T.id))})]},p)),Go.length>400&&c.jsxs("p",{className:"isd-hint",children:["Showing 400 of ",Go.length,". Refine your search."]}),!Go.length&&c.jsx("p",{className:"isd-hint",children:D==="mine"?"No images yet. Upload PNG/SVG logos to use them as nodes.":"No matches."})]})]})]}),c.jsxs("div",{className:"isd-stage",ref:ae,children:[c.jsx(Gg,{svgRef:Gt,diagram:i,view:l,rotation:a,camera:f,onCameraChange:m,selection:h,onSelectionChange:k,tool:g,readOnly:t,showGrid:P,animate:u,onOpenDocs:E,focus:Kt?Wo:null,showDocBadges:e.docBadges,newEdgeStyle:{routing:"orthogonal",rounded:!0,...C},onBeginChange:or,onChange:p=>De(p,"replace"),onConnect:(p,S,T)=>{const A=fg(p,S,{...C,...T});De(V=>({...V,edges:[...V.edges,A]})),k({nodes:[],edges:[A.id]})},onDropPayload:(p,S)=>{try{Y(JSON.parse(p),S)}catch{}}}),c.jsxs("div",{className:"isd-status",children:[l==="3d"?`2.5D · ${["N","E","S","W"][a]}`:"Flat"," · ",i.nodes.length," nodes · ",i.edges.length," connections"]}),Fe&&c.jsx("div",{className:"isd-toast",children:Fe}),Kt&&c.jsx(N.Suspense,{fallback:c.jsx("aside",{className:"isd-docs isd-docs-loading",children:"Loading editor…"}),children:c.jsx(oy,{target:Ho,diagram:i,readOnly:t,onChange:_,onNavigate:j,onMentionHover:nt,onClose:()=>fn(!1),onExport:()=>void Kr("docs")})})]}),!t&&tt&&c.jsxs("aside",{className:"isd-inspector",children:[se&&c.jsx("button",{type:"button",className:"isd-drawer-close","aria-label":"Close inspector",onClick:()=>he(!1),children:c.jsx(Qe,{name:"close"})}),Xt?c.jsx(ay,{node:Xt,onOpenDocs:()=>E({kind:"node",id:Xt.id}),parent:En(Xt,i.nodes),contents:cn(Xt)?kr([Xt.id],i.nodes).size:0,onSelectNodes:p=>k({nodes:p,edges:[]}),onSelectContents:()=>k({nodes:i.nodes.filter(p=>{var S;return((S=En(p,i.nodes))==null?void 0:S.id)===Xt.id}).map(p=>p.id),edges:[]}),onFitContents:()=>Mt(Xt.id),onUngroup:Ur,onChange:(p,S)=>R(Xt.id,p,S),onDelete:re,onDuplicate:()=>{oe(),Ve()},onReorder:pn}):Zr?c.jsx(cy,{edge:Zr,onOpenDocs:()=>E({kind:"edge",id:Zr.id}),onChange:(p,S)=>ne(Zr.id,p,S),onRoute:p=>te(Zr.id,p),onDelete:re}):h.nodes.length>1?c.jsxs("div",{className:"isd-panel",children:[c.jsxs("h3",{children:[h.nodes.length," nodes selected"]}),c.jsx(ve,{label:"Color",children:c.jsx(sc,{value:"",onChange:p=>H(h.nodes,{color:p})})}),c.jsx(ve,{label:"Elevation",children:c.jsx(gn,{value:((pc=i.nodes.find(p=>p.id===h.nodes[0]))==null?void 0:pc.z)??0,onChange:p=>H(h.nodes,{z:p})})}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:ut,title:"Wrap the selection in a new area (⌘G)",children:[c.jsx(Qe,{name:"group"})," Group into area"]}),c.jsxs("div",{className:"isd-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{oe(),Ve()},children:[c.jsx(Qe,{name:"copy"})," Duplicate"]}),c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:re,children:[c.jsx(Qe,{name:"trash"})," Delete"]})]})]}):c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:"Diagram"}),c.jsx("p",{className:"isd-hint",children:"Click a shape or icon to add it, or drag it onto the canvas. Select a node to edit it."}),c.jsx(oc,{has:xt(i.doc),label:"diagram overview",onClick:()=>E({kind:"diagram"})}),c.jsxs("dl",{className:"isd-keys",children:[c.jsx("dt",{children:"Drag empty space"}),c.jsx("dd",{children:"Pan"}),c.jsx("dt",{children:"Scroll / pinch"}),c.jsx("dd",{children:"Zoom"}),c.jsx("dt",{children:"Shift + drag"}),c.jsx("dd",{children:"Box select"}),c.jsx("dt",{children:"C / V"}),c.jsx("dd",{children:"Connect / Select tool"}),c.jsx("dt",{children:"Tab"}),c.jsx("dd",{children:"Toggle 2D / 2.5D"}),c.jsx("dt",{children:"R / Shift+R"}),c.jsx("dd",{children:"Rotate view"}),c.jsx("dt",{children:"Arrows"}),c.jsx("dd",{children:"Nudge"}),c.jsx("dt",{children:"Alt + drag"}),c.jsx("dd",{children:"Move without snapping"}),c.jsx("dt",{children:"⌘D / ⌘C / ⌘V"}),c.jsx("dd",{children:"Duplicate / copy / paste"}),c.jsx("dt",{children:"⌘G / ⇧⌘G"}),c.jsx("dd",{children:"Group into area / ungroup"}),c.jsx("dt",{children:"D / double-click"}),c.jsx("dd",{children:"Open docs"}),c.jsx("dt",{children:"⌘Z / ⇧⌘Z"}),c.jsx("dd",{children:"Undo / redo"})]}),i.nodes.length>0&&c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:()=>{window.confirm("Clear the whole diagram?")&&De(Qa())},children:[c.jsx(Qe,{name:"trash"})," Clear diagram"]})]})]})]})]})})}function oc({has:e,label:t,onClick:n}){return c.jsxs("button",{type:"button",className:`isd-btn isd-docs-btn${e?" has-doc":""}`,onClick:n,title:"Open the docs panel (D)",children:[c.jsx(Qe,{name:"doc"})," ",e?`Open ${t}`:`Add ${t}`]})}function sc({value:e,onChange:t}){return c.jsxs("div",{className:"isd-swatches",children:[ug.map(n=>c.jsx("button",{type:"button",className:`isd-swatch${n.toLowerCase()===e.toLowerCase()?" is-active":""}`,style:{background:n},title:n,onClick:()=>t(n)},n)),c.jsx("input",{type:"color",className:"isd-color",value:/^#[0-9a-f]{6}$/i.test(e)?e:"#4f8cf7",onChange:n=>t(n.target.value),title:"Custom color"})]})}function ay({node:e,onOpenDocs:t,parent:n,contents:r,onChange:o,onDelete:s,onDuplicate:i,onReorder:l,onSelectNodes:a,onSelectContents:d,onFitContents:f,onUngroup:m}){const h=Vt(e),k=e.kind==="area"||e.kind==="circleArea",g=["block","cylinder","hexagon","pyramid","cone","sphere"];return c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:Pr[e.kind]}),c.jsx(oc,{has:xt(e.doc),label:cn(e)?"area docs":"docs",onClick:t}),n&&c.jsxs("button",{type:"button",className:"isd-breadcrumb",onClick:()=>a([n.id]),title:"Select the containing area",children:["Inside ",c.jsx("strong",{children:n.label||Pr[n.kind]})]}),cn(e)&&c.jsxs("div",{className:"isd-container-box",children:[c.jsx("span",{children:r?`Contains ${r} item${r===1?"":"s"} — they move with this area.`:"Drop shapes inside to group them with this area."}),r>0&&c.jsxs("div",{className:"isd-container-actions",children:[c.jsx("button",{type:"button",className:"isd-btn is-wide",onClick:d,children:"Select contents"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:f,title:"Resize to wrap the contents",children:"Fit to contents"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:m,title:"Remove the area, keep its contents (⇧⌘G)",children:"Ungroup"})]})]}),e.kind==="text"?c.jsx(ve,{label:"Text",children:c.jsx("textarea",{className:"isd-input",rows:3,value:e.text??"",onChange:x=>o({text:x.target.value},"text")})}):c.jsx(ve,{label:"Label",children:c.jsx("input",{className:"isd-input",value:e.label??"",placeholder:"Add a label",onChange:x=>o({label:x.target.value},"label")})}),g.includes(e.kind)&&c.jsx(ve,{label:"Shape",children:c.jsx("select",{className:"isd-input",value:e.kind,onChange:x=>o({kind:x.target.value}),children:g.map(x=>c.jsx("option",{value:x,children:Pr[x]},x))})}),e.kind!=="image"||e.imageStyle==="tile"?c.jsx(ve,{label:e.kind==="image"?"Tile color":"Color",children:c.jsx(sc,{value:e.color,onChange:x=>o({color:x})})}):null,e.kind==="image"&&c.jsxs(c.Fragment,{children:[c.jsx(ve,{label:"Style",children:c.jsxs("select",{className:"isd-input",value:e.imageStyle??"tile",onChange:x=>o({imageStyle:x.target.value}),children:[c.jsx("option",{value:"tile",children:"Tile (icon on a block)"}),c.jsx("option",{value:"flat",children:"Flat (on the ground)"}),c.jsx("option",{value:"standing",children:"Standing (billboard)"})]})}),c.jsx("div",{className:"isd-image-preview",children:c.jsx("img",{src:e.src,alt:""})})]}),c.jsxs("div",{className:"isd-grid2",children:[c.jsx(ve,{label:"X",children:c.jsx(gn,{value:e.x,onChange:x=>o({x},"x")})}),c.jsx(ve,{label:"Y",children:c.jsx(gn,{value:e.y,onChange:x=>o({y:x},"y")})}),c.jsx(ve,{label:"Width",children:c.jsx(gn,{value:e.w,min:.5,onChange:x=>o({w:x},"w")})}),c.jsx(ve,{label:"Depth",children:c.jsx(gn,{value:e.d,min:.5,onChange:x=>o({d:x},"d")})}),!h&&e.kind!=="sphere"&&c.jsx(ve,{label:"Height",children:c.jsx(gn,{value:e.h,min:.1,step:.25,onChange:x=>o({h:x},"h")})}),c.jsx(ve,{label:"Elevation",children:c.jsx(gn,{value:e.z,step:.25,onChange:x=>o({z:x},"z")})})]}),e.kind==="text"&&c.jsx(ve,{label:"Font size",children:c.jsx(gn,{value:e.fontSize??.7,min:.2,step:.1,onChange:x=>o({fontSize:x},"fs")})}),c.jsx(ve,{label:k?"Fill opacity":"Opacity",children:c.jsx("input",{type:"range",min:0,max:1,step:.05,value:e.opacity??(k?.18:1),onChange:x=>o({opacity:parseFloat(x.target.value)},"opacity")})}),k&&c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.dashed,onChange:x=>o({dashed:x.target.checked})})," Dashed border"]}),e.kind!=="text"&&c.jsx(ve,{label:"Label color",children:c.jsx("input",{type:"color",className:"isd-color",value:e.labelColor??"#1f2937",onChange:x=>o({labelColor:x.target.value},"lc")})}),c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.locked,onChange:x=>o({locked:x.target.checked})})," Lock position"]}),c.jsxs("div",{className:"isd-row",children:[c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>l("back"),title:"Draw first among flat items",children:"To back"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>l("front"),children:"To front"})]}),c.jsxs("div",{className:"isd-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:i,children:[c.jsx(Qe,{name:"copy"})," Duplicate"]}),c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:s,title:r?"Deletes the area and everything inside it":void 0,children:[c.jsx(Qe,{name:"trash"})," ",r?"Delete all":"Delete"]})]})]})}function qi({value:e,options:t,onChange:n}){return c.jsx("div",{className:"isd-segmented",role:"radiogroup",children:t.map(([r,o])=>c.jsx("button",{type:"button",role:"radio","aria-checked":e===r,className:e===r?"is-active":"",onClick:()=>n(r),children:o},r))})}const Ou=[["none","None"],["arrow","Arrow"],["open","Open arrow"],["circle","Circle"],["diamond","Diamond"]],ly=[["none","None"],["flow","Flow (marching dashes)"],["packets","Data packets"],["pulse","Pulse (travelling)"],["glow","Glow (breathing)"]];function cy({edge:e,onOpenDocs:t,onChange:n,onRoute:r,onDelete:o}){var l;const s=e.animation??"none",i=!!(e.fromAnchor||e.toAnchor||(l=e.waypoints)!=null&&l.length);return c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:"Connection"}),c.jsx(oc,{has:xt(e.doc),label:"docs",onClick:t}),c.jsx(ve,{label:"Label",children:c.jsx("input",{className:"isd-input",value:e.label??"",placeholder:"e.g. HTTPS",onChange:a=>n({label:a.target.value},"label")})}),c.jsx(ve,{label:"Color",children:c.jsx(sc,{value:e.color,onChange:a=>n({color:a})})}),c.jsx("div",{className:"isd-section-title",children:"Path"}),c.jsx(qi,{value:e.routing,options:[["orthogonal","Right-angle"],["straight","Straight"],["curved","Curved"]],onChange:a=>n({routing:a})}),e.routing==="orthogonal"&&c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.rounded,onChange:a=>n({rounded:a.target.checked})})," Rounded corners"]}),c.jsx("p",{className:"isd-hint",children:e.routing==="orthogonal"?"Drag the square handles to move segments. Drag an end dot onto any side of a node to re-attach it.":"Drag the small dots to add bends; double-click a bend to remove it. Drag an end dot to re-attach."}),c.jsxs("div",{className:"isd-row",children:[c.jsx("button",{type:"button",className:"isd-btn",disabled:!i,onClick:()=>r({fromAnchor:void 0,toAnchor:void 0,waypoints:void 0}),children:"Reset route"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>{var a;return r({from:e.to,to:e.from,fromAnchor:e.toAnchor,toAnchor:e.fromAnchor,waypoints:(a=e.waypoints)==null?void 0:a.slice().reverse()})},children:"Reverse"})]}),c.jsx("div",{className:"isd-section-title",children:"Line"}),c.jsx(qi,{value:ch(e),options:[["solid","Solid"],["dashed","Dashed"],["dotted","Dotted"]],onChange:a=>n({lineStyle:a,dashed:void 0})}),c.jsx(ve,{label:"Width",children:c.jsx("input",{type:"range",min:1,max:8,step:.5,value:e.width,onChange:a=>n({width:parseFloat(a.target.value)},"w")})}),c.jsxs("div",{className:"isd-grid2",children:[c.jsx(ve,{label:"Start",children:c.jsx("select",{className:"isd-input",value:uh(e),onChange:a=>n({startMarker:a.target.value,arrowStart:void 0}),children:Ou.map(([a,d])=>c.jsx("option",{value:a,children:d},a))})}),c.jsx(ve,{label:"End",children:c.jsx("select",{className:"isd-input",value:dh(e),onChange:a=>n({endMarker:a.target.value,arrowEnd:void 0}),children:Ou.map(([a,d])=>c.jsx("option",{value:a,children:d},a))})})]}),c.jsx("div",{className:"isd-section-title",children:"Animation"}),c.jsx("select",{className:"isd-input",value:s,onChange:a=>n({animation:a.target.value}),children:ly.map(([a,d])=>c.jsx("option",{value:a,children:d},a))}),s!=="none"&&c.jsxs(c.Fragment,{children:[s!=="glow"&&c.jsx(qi,{value:e.animationDirection??"forward",options:s==="flow"?[["forward","Forward"],["reverse","Reverse"]]:[["forward","Forward"],["reverse","Reverse"],["both","Both ways"]],onChange:a=>n({animationDirection:a})}),c.jsx(ve,{label:`Speed · ${(e.animationSpeed??1).toFixed(2).replace(/\.?0+$/,"")}×`,children:c.jsx("input",{type:"range",min:.25,max:3,step:.25,value:e.animationSpeed??1,onChange:a=>n({animationSpeed:parseFloat(a.target.value)},"speed")})}),s!=="flow"&&s!=="glow"&&c.jsx(ve,{label:"Highlight color",children:c.jsx("input",{type:"color",className:"isd-color",value:e.animationColor??In(e.color,1.55),onChange:a=>n({animationColor:a.target.value},"ac")})})]}),c.jsx("div",{className:"isd-row",children:c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:o,children:[c.jsx(Qe,{name:"trash"})," Delete"]})})]})}const uy=N.lazy(()=>sh(()=>import("./PublishedView-DbKmrlyZ.js"),__vite__mapDeps([0,1]),import.meta.url));function dy(e){const t=tc(e.theme);return c.jsx(N.Suspense,{fallback:c.jsx("div",{className:"isd-pub isd-pub-loading","data-theme":t,children:"Loading…"}),children:c.jsx(uy,{...e,resolvedTheme:t})})}function bs(e,t,n={}){const r=new Map,o=t.split(/^<!-- (diagram|(?:node|edge):[\w-]+) -->$/m);for(let s=1;s<o.length;s+=2){const i=o[s+1].replace(/<!-- embed:([\w-]+) -->/g,(l,a)=>{const d=n[a];if(!d)throw new Error(`Unknown embed "${a}"`);return"```isodraw\n"+JSON.stringify(d)+"\n```"});r.set(o[s],i.trim())}return{...e,doc:r.get("diagram")??e.doc,nodes:e.nodes.map(s=>r.has(`node:${s.id}`)?{...s,doc:r.get(`node:${s.id}`)}:s),edges:e.edges.map(s=>r.has(`edge:${s.id}`)?{...s,doc:r.get(`edge:${s.id}`)}:s)}}const fy=`<!-- diagram -->
## Overview

**Northwind Market** is an online grocery shop. Its services run on one [@EKS cluster](isodraw:node/eks), with a namespace per team, so each team deploys on its own schedule while sharing the platform.

A shopper's request goes through [@Route 53](isodraw:node/dns) and the [@Ingress ALB](isodraw:node/alb) to [@storefront](isodraw:node/storefront). That then calls [@cart](isodraw:node/cart) and [@orders](isodraw:node/orders-svc) over the [@Istio](isodraw:node/mesh) mesh. State lives outside the cluster, in [@Aurora](isodraw:node/aurora) and [@Redis](isodraw:node/redis).

## Ownership

| Namespace | Team | Services | On-call |
| --- | --- | --- | --- |
| [@namespace: web](isodraw:node/ns-web) | Storefront | storefront, cart | #storefront-oncall |
| [@namespace: orders](isodraw:node/ns-orders) | Checkout | orders, payments | #checkout-oncall |
| [@namespace: platform](isodraw:node/ns-platform) | Platform | Prometheus, Argo CD, Istio | #platform-oncall |

## How a change ships

1. A merge to \`main\` builds an image and pushes it to [@ECR](isodraw:node/ecr), tagged with the commit SHA.
2. CI updates the image tag in the \`deploy\` repo.
3. [@Argo CD](isodraw:node/argocd) syncs the change, and [@Istio](isodraw:node/mesh) shifts traffic to the new version: 5%, then 25%, then 100%, checking error rates between steps.

<!-- node:users -->
Shoppers on the website and the mobile apps.

| Metric | Value |
| --- | --- |
| Weekly active shoppers | 340k |
| Peak traffic | Sunday 6–9 pm, about 1,800 requests/s |
| Orders per day | 22k |

<!-- node:dns -->
DNS for \`shop.example.com\`, with a failover record that keeps a static "we'll be right back" page available if the cluster is down.

| Setting | Value |
| --- | --- |
| Service | Amazon Route 53 |
| Primary record | Alias \`shop.example.com\` → the [@Ingress ALB](isodraw:node/alb) |
| Failover record | Alias to a CloudFront distribution serving the maintenance page |
| Health check | \`GET https://shop.example.com/healthz\` every 10 s from 3 regions |
| TTL | 60 s |

## Error cases

- **Health check failing:** after 3 failures (about 30 s), Route 53 answers with the failover record. Shoppers see the maintenance page instead of errors.
- **Records changed by hand:** don't. Records are managed by ExternalDNS from the Ingress, so manual changes are overwritten.

<!-- node:alb -->
The internet-facing load balancer for the cluster. The AWS Load Balancer Controller creates it from the \`web\` namespace's Ingress.

| Setting | Value |
| --- | --- |
| Service | Elastic Load Balancing (Application Load Balancer) |
| TLS | ACM certificate for \`shop.example.com\`; TLS 1.2+ policy |
| WAF | AWS managed common rules, a bot control rule set and a rate limit |
| Targets | Pod IPs directly (\`target-type: ip\`), no node ports |

## Ingress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: storefront
  namespace: web
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-path: /healthz
spec:
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service: { name: storefront, port: { number: 3000 } }
\`\`\`

## Error cases

| Status | Cause |
| --- | --- |
| \`502\` | A pod was killed while handling a request. Pods have a \`preStop\` sleep of 15 s so the ALB stops sending them traffic first |
| \`503\` | No healthy storefront pods; usually a bad deploy that Argo CD is rolling back |
| \`403\` | Blocked by WAF; check the WAF logs for the matched rule |

<!-- node:eks -->
The production Kubernetes cluster that runs every Northwind service.

| Setting | Value |
| --- | --- |
| Service | Amazon EKS, Kubernetes 1.33 |
| Nodes | Karpenter-managed Graviton instances (\`m7g\`, \`c7g\`) across 3 AZs; spot for stateless pods |
| Networking | VPC CNI with prefix delegation; network policies on |
| Access | IAM roles for service accounts on every workload; no node-level IAM permissions |
| Add-ons | AWS Load Balancer Controller, ExternalDNS, cert-manager, Karpenter |

## Upgrades

- [x] Move from Cluster Autoscaler to Karpenter
- [x] IRSA for every service account
- [ ] Upgrade to Kubernetes 1.34 before the end of the quarter
- [ ] Move to EKS Pod Identity

## Error cases

- **Spot interruption:** Karpenter gets a 2-minute warning, starts a replacement node and drains the old one. Pod disruption budgets keep at least 2 replicas of each service running.
- **Pods \`Pending\`:** Karpenter couldn't find a matching instance type (often an anti-affinity rule that's too strict). Check \`kubectl describe pod\`.
- **Node \`NotReady\`:** Karpenter replaces nodes that stay unhealthy for 10 minutes.

<!-- node:ns-web -->
The Storefront team's namespace: [@storefront](isodraw:node/storefront) and [@cart](isodraw:node/cart). Deploys go out on every merge to \`main\`, many times a day.

| Quota | Limit |
| --- | --- |
| CPU requests | 40 cores |
| Memory requests | 80 GiB |
| Pods | 150 |

<!-- node:ns-orders -->
The Checkout team's namespace: [@orders](isodraw:node/orders-svc) and [@payments](isodraw:node/payments). Changes need a review from the Checkout team, and deploys are frozen on Sunday evenings, the busiest time.

Network policy: only [@storefront](isodraw:node/storefront) may call \`orders\`, and only \`orders\` may call \`payments\`.

<!-- node:ns-platform -->
Shared tooling run by the Platform team: [@Prometheus](isodraw:node/prometheus), [@Argo CD](isodraw:node/argocd) and [@Istio](isodraw:node/mesh). Other teams can read resources here but can't change them.

<!-- node:storefront -->
The shop's web frontend: product pages, search, the basket and the checkout screens, rendered on the server.

| Setting | Value |
| --- | --- |
| Stack | Next.js 15 (Node.js 22), port 3000 |
| Replicas | 6 to 30, scaled by CPU (60% target) |
| Resources | 500m CPU and 1 GiB memory per pod |
| Calls | [@cart](isodraw:node/cart) over HTTP; [@orders](isodraw:node/orders-svc) over gRPC |

## Example: product page data

\`GET /api/products/sku-88213\` returns:

\`\`\`json
{
  "sku": "sku-88213",
  "name": "Organic Bananas (6 pack)",
  "priceCents": 299,
  "inStock": true,
  "badges": ["organic", "local"]
}
\`\`\`

## Error cases

| Case | What the shopper sees |
| --- | --- |
| Cart service unavailable | The page loads with an empty basket and a "basket temporarily unavailable" banner |
| Orders service slow (over 2 s) | Checkout shows "Still working…", then a retry button |
| Unhandled exception | A friendly \`500\` page with a reference ID matching the logs |

<!-- node:cart -->
Holds each shopper's basket. It is stateless itself and keeps baskets in [@Redis](isodraw:node/redis).

| Setting | Value |
| --- | --- |
| Stack | Go 1.23, port 8080 |
| Replicas | 3 to 12 |
| Storage | Redis hash \`cart:{shopperId}\`, expiring 30 days after the last change |

## API

| Method | Path | Body |
| --- | --- | --- |
| \`GET\` | \`/carts/{shopperId}\` | |
| \`PUT\` | \`/carts/{shopperId}/items/{sku}\` | \`{ "qty": 2 }\` |
| \`DELETE\` | \`/carts/{shopperId}/items/{sku}\` | |

Response:

\`\`\`json
{
  "shopperId": "shp_5521",
  "items": [{ "sku": "sku-88213", "qty": 2, "priceCents": 299 }],
  "subtotalCents": 598,
  "updatedAt": "2026-10-29T18:02:44Z"
}
\`\`\`

## Error cases

- **Quantity over 99:** \`400 invalid_quantity\`.
- **Redis timeout (over 100 ms):** \`503\`. The storefront shows the basket as unavailable rather than empty, so shoppers don't think they lost it.

<!-- node:orders-svc -->
Turns a basket into an order: it checks stock, reserves a delivery slot, takes payment and records the order.

| Setting | Value |
| --- | --- |
| Stack | Java 21, Spring Boot 3.4, gRPC on port 9090 |
| Replicas | 4 to 16 |
| Database | \`orders\` schema in [@Aurora](isodraw:node/aurora) |

## Service levels

| Method | Target |
| --- | --- |
| \`PlaceOrder\` | 99.9% under 300 ms |
| \`GetOrder\` | 99.9% under 100 ms |

## \`PlaceOrder\`

\`\`\`protobuf
rpc PlaceOrder(PlaceOrderRequest) returns (Order);

message PlaceOrderRequest {
  string shopper_id = 1;
  string cart_version = 2;      // fails if the basket changed since checkout opened
  string delivery_slot_id = 3;
  string payment_method_id = 4;
  string idempotency_key = 5;
}
\`\`\`

Steps: reserve stock and the delivery slot in one transaction, then call [@payments](isodraw:node/payments), then mark the order \`confirmed\`. If payment fails, the reservation is released.

## Error cases

| gRPC status | Reason | Storefront shows |
| --- | --- | --- |
| \`FAILED_PRECONDITION\` | \`cart_changed\` | "Your basket changed. Please review it." |
| \`RESOURCE_EXHAUSTED\` | \`slot_full\` | Other delivery slots to choose from |
| \`ABORTED\` | \`payment_declined\` | The card's decline reason |
| \`UNAVAILABLE\` | Aurora failover or overload | Retried automatically, then "Try again" |
| \`ALREADY_EXISTS\` | Same idempotency key | The original order (not an error to the shopper) |

<!-- node:payments -->
The only service that talks to the card processor. It is PCI-scoped and isolated from everything else.

| Setting | Value |
| --- | --- |
| Stack | Kotlin, Ktor, gRPC on port 9090 |
| Nodes | Dedicated node group with a taint; no other pods share these nodes |
| Network | Only [@orders](isodraw:node/orders-svc) may call it; outbound only to the processor's IP ranges |
| Secrets | Processor API key from Secrets Manager, rotated every 90 days |

> Never log card data. The service only ever sees processor tokens like \`pm_1Q2w3E\`, never card numbers.

## Charge request (to the processor)

\`\`\`json
{
  "amount": 4812,
  "currency": "usd",
  "payment_method": "pm_1Q2w3E",
  "idempotency_key": "ord_77120-charge",
  "capture": true
}
\`\`\`

## Error cases

| Processor response | Returned to orders |
| --- | --- |
| \`card_declined\` / \`insufficient_funds\` | \`ABORTED\`, with the decline reason |
| \`authentication_required\` (3-D Secure) | \`FAILED_PRECONDITION\`, with a URL for the shopper to confirm |
| Timeout after 8 s | \`UNAVAILABLE\`; the retry reuses the idempotency key, so the card can't be charged twice |

<!-- node:prometheus -->
Collects metrics from every pod and fires alerts.

| Setting | Value |
| --- | --- |
| Stack | kube-prometheus-stack (Prometheus, Alertmanager, Grafana) |
| Scraping | Every pod with the \`prometheus.io/scrape: "true"\` annotation, every 30 s |
| Retention | 15 days in the cluster; long-term copies go to Amazon Managed Service for Prometheus |

## Key alerts

| Alert | Expression | Severity |
| --- | --- | --- |
| \`HighErrorRate\` | 5xx above 2% of requests for 5 min | Page |
| \`OrdersLatency\` | \`PlaceOrder\` p99 above 300 ms for 10 min | Page |
| \`PodCrashLooping\` | Restarts above 3 in 15 min | Ticket |
| \`CertExpiringSoon\` | Certificate expires within 14 days | Ticket |

<!-- node:argocd -->
The GitOps controller: it makes the cluster match what's in the \`deploy\` repo.

| Setting | Value |
| --- | --- |
| Stack | Argo CD 2.13 with Argo Rollouts |
| Source | \`github.com/northwind/deploy\`, one folder per namespace |
| Sync | Automatic, with pruning and self-heal on |
| Images | Pulled from [@ECR](isodraw:node/ecr) |

## Rollouts

Every service uses a canary rollout: 5% of traffic for 5 minutes, then 25% for 10 minutes, then 100%. Between steps, Argo Rollouts checks the error rate in Prometheus and rolls back automatically if it's above 1%.

## Error cases

- **\`OutOfSync\` that won't clear:** someone changed a resource by hand with \`kubectl\`. Self-heal reverts it; make the change in Git instead.
- **\`Degraded\`:** the new pods failed their health checks. The rollout stops and traffic stays on the old version.
- **Image pull errors:** the tag doesn't exist in ECR, usually because CI pushed to a different repository.

<!-- node:mesh -->
The service mesh that secures and controls traffic between pods.

| Setting | Value |
| --- | --- |
| Stack | Istio 1.24, sidecar mode |
| Security | Strict mTLS between all pods; identity from service accounts |
| Traffic | Retries, timeouts and the weighted routing used by canary rollouts |

## Default policy for calls to \`orders\`

\`\`\`yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: orders
  namespace: orders
spec:
  hosts: [orders.orders.svc.cluster.local]
  http:
    - timeout: 2s
      retries:
        attempts: 2
        perTryTimeout: 800ms
        retryOn: unavailable,reset
      route:
        - destination: { host: orders, subset: stable }
          weight: 100
\`\`\`

## Error cases

- **\`503 UF\` or \`URX\` in sidecar logs:** the upstream refused the connection, or retries ran out. Check the target's pods.
- **Calls fail with TLS errors right after a deploy:** the new pod started before its sidecar was ready. Pods use \`holdApplicationUntilProxyStarts: true\` to prevent this.

<!-- node:ecr -->
The container registry for every Northwind service.

| Setting | Value |
| --- | --- |
| Service | Amazon ECR, one repository per service |
| Tags | Immutable; images are tagged with the git commit SHA |
| Scanning | Enhanced scanning (Inspector) on push and continuously |
| Lifecycle | Keep the last 50 images per repository |

A critical vulnerability found on push fails the CI pipeline before the image can be deployed.

<!-- node:aurora -->
The relational database for services that need transactions, mainly [@orders](isodraw:node/orders-svc).

| Setting | Value |
| --- | --- |
| Service | Amazon Aurora PostgreSQL 16 |
| Instances | 1 writer and 2 readers (\`db.r7g.2xlarge\`) |
| Isolation | One schema and one database user per service; no cross-schema joins |
| Backups | Continuous, with 14 days of point-in-time recovery |
| Connections | Through RDS Proxy, so pod restarts don't create connection storms |

## Error cases

| Event | Effect | Handling |
| --- | --- | --- |
| Writer failover | 20–30 s of failed writes | RDS Proxy holds connections; orders returns \`UNAVAILABLE\` and the storefront retries |
| Long-running query | Locks held, checkout slows | \`statement_timeout = 3s\` for service users |
| Schema migration | Locks a table | Migrations run as a pre-sync Argo CD job and must be backward compatible |

<!-- node:redis -->
In-memory store for shopper baskets and sessions.

| Setting | Value |
| --- | --- |
| Service | Amazon ElastiCache for Redis 7, cluster mode on |
| Shards | 3 shards, each with 1 replica, across AZs |
| Persistence | Daily snapshot, kept for 3 days |
| Eviction | \`volatile-lru\`: only keys with a TTL can be evicted |

## Keys

| Key | Type | TTL |
| --- | --- | --- |
| \`cart:{shopperId}\` | Hash of SKU → quantity | 30 days |
| \`session:{id}\` | String (JSON) | 24 hours |

## Error cases

- **Shard failover:** the replica takes over in under 30 s. [@cart](isodraw:node/cart) returns \`503\` meanwhile.
- **Memory full:** session keys are evicted first. Baskets are big enough that an alarm fires at 75% memory, well before that point.

<!-- edge:e1 -->
Shoppers resolve \`shop.example.com\` with Route 53, then connect over HTTPS. Browsers and the apps cache the answer for 60 seconds.

<!-- edge:e2 -->
Route 53 alias record to the ALB's DNS name. Alias records have no extra lookup cost and follow the ALB's IP changes automatically.

<!-- edge:e3 -->
The ALB forwards HTTPS traffic to storefront pods on port 3000, adding \`X-Forwarded-For\` and \`X-Amzn-Trace-Id\`. The trace ID is passed along to every downstream call.

<!-- edge:e4 -->
HTTP/1.1 over the mesh (mTLS) to \`cart.web.svc.cluster.local:8080\`, with a 500 ms timeout and one retry on connection errors.

<!-- edge:e5 -->
Over the mesh with mTLS. Retries twice on \`UNAVAILABLE\`, with a 2 s overall deadline.

Example call metadata:

\`\`\`text
:path        /northwind.orders.v1.Orders/PlaceOrder
x-shopper-id shp_5521
x-request-id 9c1e0a77-…
grpc-timeout 2S
\`\`\`

<!-- edge:e6 -->
gRPC \`Charge\` call over the mesh. The timeout is 8 s, the processor's own limit, and retries are **off** in the mesh: retrying a charge is left to orders, which reuses the idempotency key.

<!-- edge:e7 -->
JDBC through RDS Proxy (\`orders-proxy.proxy-…rds.amazonaws.com:5432\`) with IAM authentication. HikariCP pool of 10 per pod. Reads that can be slightly stale use the reader endpoint.

<!-- edge:e8 -->
Cluster-mode Redis client with TLS, a 100 ms command timeout and connection pooling. Basket updates use \`HINCRBY\` so two tabs updating at once don't overwrite each other.

<!-- edge:e9 -->
Kubernetes pulls images from ECR using the node's credentials. The image tag in each manifest is the commit SHA, so a sync always deploys exactly the image that was tested.
`,hy=`<!-- diagram -->
## Overview

The order API for **Brewbox**, a coffee subscription and one-off order shop. The mobile app places orders through this API, and everything after checkout (receipts, emails, the fulfilment partner) runs asynchronously.

How one order flows:

1. The [@Mobile app](isodraw:node/client) signs the user in with [@Cognito](isodraw:node/cognito) and calls [@API Gateway](isodraw:node/apigw) with the token.
2. [@orders-api](isodraw:node/orders) validates the order, stores it in [@Orders table](isodraw:node/ddb) and puts an \`OrderPlaced\` event on [@order-events](isodraw:node/sqs). The customer gets \`201 Created\` straight away.
3. [@notify](isodraw:node/notify) picks up the event, writes a PDF receipt to [@Receipts](isodraw:node/receipts) and publishes to [@order-updates](isodraw:node/sns), which emails the customer and calls the fulfilment partner's webhook.

## Design choices

- **No servers to run.** Every part is managed and scales to zero overnight.
- **Checkout never waits on email.** Slow or failing downstream work happens after the response, and retries from the queue.
- **Safe retries.** \`POST /orders\` takes an \`Idempotency-Key\`, so a retry after a timeout can't charge twice.

## Targets

| Metric | Target |
| --- | --- |
| \`POST /orders\` latency (p99) | 250 ms |
| Receipt emailed after order | Within 60 s for 99% of orders |
| Monthly cost at 50k orders | Under $150 |

<!-- node:client -->
Brewbox's iOS and Android apps (React Native). Customers browse coffees, manage subscriptions and place orders.

## Auth

The app signs in through the [@Cognito](isodraw:node/cognito) hosted UI (authorization code flow with PKCE) and keeps the tokens in the device keychain. Every API call sends the access token:

\`\`\`http
Authorization: Bearer eyJraWQiOiJ…
\`\`\`

When a call returns \`401\`, the app refreshes the token once and retries. If the refresh fails, the user is sent back to sign in.

## Retries

| Response | App behavior |
| --- | --- |
| Network error or \`5xx\` on \`POST /orders\` | Retry up to 3 times with the **same** \`Idempotency-Key\` (1 s, 2 s, 4 s) |
| \`429\` | Wait for \`Retry-After\`, then retry |
| \`4xx\` (other) | Show the error message; don't retry |

<!-- node:cognito -->
The user directory for Brewbox customers. It handles sign-up, sign-in and tokens.

| Setting | Value |
| --- | --- |
| Service | Amazon Cognito user pool \`brewbox-prod\` |
| Sign-in | Email and password, or Sign in with Apple and Google |
| MFA | Optional TOTP |
| Tokens | Access and ID tokens last 1 hour; refresh tokens 30 days |
| Groups | \`customers\`, \`support\` (can read any order) |

## Token claims the API uses

\`\`\`json
{
  "sub": "8d3c5f2e-91b0-4a7e-b3f6-0c2d9e1a4b77",
  "cognito:groups": ["customers"],
  "scope": "orders/write orders/read",
  "exp": 1793318400
}
\`\`\`

[@API Gateway](isodraw:node/apigw) checks the signature, expiry and audience. [@orders-api](isodraw:node/orders) uses \`sub\` as the customer ID.

## Error cases

- **Account not confirmed:** sign-in fails with \`UserNotConfirmedException\`; the app offers to resend the code.
- **Too many failed sign-ins:** Cognito temporarily blocks the account. The app shows "Try again in a few minutes".
- **Signing keys rotated:** the API reloads Cognito's public keys automatically; nothing to do.

<!-- node:apigw -->
The public HTTPS entry point for the API. It checks tokens, applies throttling and invokes the Lambda function.

| Setting | Value |
| --- | --- |
| Service | Amazon API Gateway (HTTP API) |
| Domain | \`api.brewbox.example.com\` |
| Authorizer | JWT, issuer: the [@Cognito](isodraw:node/cognito) user pool |
| Throttling | 200 requests/s steady, 500 burst |
| CORS | \`https://brewbox.example.com\` only |

## Routes

| Route | Target | Auth | Scope |
| --- | --- | --- | --- |
| \`POST /orders\` | [@orders-api](isodraw:node/orders) | JWT | \`orders/write\` |
| \`GET /orders/{id}\` | [@orders-api](isodraw:node/orders) | JWT | \`orders/read\` |
| \`GET /orders\` | [@orders-api](isodraw:node/orders) | JWT | \`orders/read\` |
| \`GET /health\` | Mock integration | None | |

## Error cases

These come from API Gateway itself, before the function runs:

| Status | Body | Cause |
| --- | --- | --- |
| \`401\` | \`{"message":"Unauthorized"}\` | Missing, expired or badly signed token |
| \`403\` | \`{"message":"Forbidden"}\` | Token lacks the route's scope |
| \`429\` | \`{"message":"Too Many Requests"}\` | Over the throttling limit |
| \`503\` | \`{"message":"Service Unavailable"}\` | Lambda throttled (no concurrency left) |
| \`504\` | \`{"message":"Endpoint request timed out"}\` | The function took longer than 29 s |

<!-- node:backend -->
Everything Brewbox runs after the API layer: the two functions, the table, the queue, the topic and the receipts bucket. It's all deployed as one AWS SAM stack, \`brewbox-orders\`, from the \`orders\` repo.

<!-- node:orders -->
The Lambda function behind every \`/orders\` route. It validates orders, writes them to DynamoDB and announces them on the queue.

| Setting | Value |
| --- | --- |
| Service | AWS Lambda |
| Runtime | Node.js 22, arm64, 512 MB |
| Timeout | 10 s |
| Concurrency | Reserved: 100 |
| Permissions | \`dynamodb:PutItem\` and \`GetItem\` on the table, \`sqs:SendMessage\` on the queue |

## Request and response

\`\`\`http
POST /orders
Idempotency-Key: 0b7e6c1a-2f44-4d1e-9a51-6cbe8f3d2a90

{
  "items": [
    { "sku": "ETH-YIRG-250", "qty": 2 },
    { "sku": "COL-HUILA-1KG", "qty": 1 }
  ],
  "shippingAddressId": "adr_19",
  "paymentMethodId": "pm_card_visa_4242"
}
\`\`\`

\`201 Created\`:

\`\`\`json
{
  "id": "ord_2026_000123",
  "status": "placed",
  "totalCents": 6400,
  "currency": "USD",
  "createdAt": "2026-10-29T16:20:05Z"
}
\`\`\`

## Inside the function

Each request goes through these steps. An order that fails validation returns \`400\` before anything is written.

<!-- embed:ordersInternals -->

\`\`\`ts
export const handler = async (event) => {
  const key = event.headers['idempotency-key'];
  const seen = await idempotency.get(key);
  if (seen) return seen.response;

  const order = validate(JSON.parse(event.body), event.requestContext.authorizer.jwt.claims.sub);
  await table.put(order, { condition: 'attribute_not_exists(SK)' });
  await queue.send({ type: 'OrderPlaced', orderId: order.id, customerId: order.customerId, totalCents: order.totalCents });

  return idempotency.save(key, { statusCode: 201, body: JSON.stringify(order) });
};
\`\`\`

## Error cases

| Status | Code | When |
| --- | --- | --- |
| \`400\` | \`invalid_order\` | Unknown SKU, quantity outside 1–20, or an empty basket |
| \`402\` | \`payment_declined\` | The card was declined; the body includes the decline reason |
| \`409\` | \`idempotency_conflict\` | Same \`Idempotency-Key\` sent with a different body |
| \`422\` | \`out_of_stock\` | One or more items sold out; the body lists them |
| \`500\` | \`internal_error\` | A bug. The function logs the stack trace and the request ID |
| \`503\` | \`try_again\` | DynamoDB or SQS throttled the call after 3 SDK retries |

If the queue send fails after the order is saved, the function still returns \`201\`. A sweeper job finds orders without an event and sends it later, so nothing is lost.

## To do

- [x] Idempotency keys on \`POST /orders\`
- [x] Structured JSON logs with the request ID
- [ ] Move validation into a shared Lambda layer
- [ ] Turn on SnapStart once it's available for Node.js

<!-- node:ddb -->
The table holding every Brewbox order.

| Setting | Value |
| --- | --- |
| Service | Amazon DynamoDB, table \`orders-prod\` |
| Capacity | On-demand |
| Recovery | Point-in-time recovery (35 days) |
| Streams | Off; events go through [@order-events](isodraw:node/sqs) instead |

## Keys and indexes

| Key | Example | Notes |
| --- | --- | --- |
| Partition key \`PK\` | \`CUST#8d3c5f2e…\` | One partition per customer |
| Sort key \`SK\` | \`ORDER#2026-10-29T16:20:05Z#ord_2026_000123\` | Sorts a customer's orders by time |
| GSI \`byStatus\` | \`status\`, \`createdAt\` | Support dashboard: "all orders stuck in \`placed\`" |

## Example item

\`\`\`json
{
  "PK": "CUST#8d3c5f2e-91b0-4a7e-b3f6-0c2d9e1a4b77",
  "SK": "ORDER#2026-10-29T16:20:05Z#ord_2026_000123",
  "status": "placed",
  "items": [{ "sku": "ETH-YIRG-250", "qty": 2, "unitCents": 1800 }],
  "totalCents": 6400,
  "ttl": null
}
\`\`\`

## Error cases

- **\`ConditionalCheckFailedException\`:** the order ID already exists. This should only happen on a replay; the function treats it as a duplicate.
- **\`ProvisionedThroughputExceededException\`:** rare in on-demand mode, but possible when traffic doubles in seconds. The SDK retries with backoff, then the API returns \`503\`.
- **Hot partition:** one customer placing thousands of orders (a reseller). Not seen yet; the fix would be to add a suffix to their partition key.

<!-- node:sqs -->
The queue that separates checkout from everything that happens afterwards.

| Setting | Value |
| --- | --- |
| Service | Amazon SQS standard queue \`order-events\` |
| Visibility timeout | 60 s (six times the consumer's timeout) |
| Retention | 4 days |
| Dead-letter queue | \`order-events-dlq\` after 5 failed receives |
| Encryption | SSE-SQS |

## Message

\`\`\`json
{
  "type": "OrderPlaced",
  "version": 1,
  "orderId": "ord_2026_000123",
  "customerId": "8d3c5f2e-91b0-4a7e-b3f6-0c2d9e1a4b77",
  "totalCents": 6400,
  "occurredAt": "2026-10-29T16:20:05Z"
}
\`\`\`

## Error cases

- **Duplicates:** standard queues deliver at least once, so the same message can arrive twice. [@notify](isodraw:node/notify) skips any order it has already sent a receipt for.
- **Out of order:** messages can arrive in any order. Each message describes one order, so order doesn't matter.
- **Messages in the DLQ:** an alarm posts to #orders-alerts. After the bug is fixed, redrive the DLQ back to the main queue from the console.

<!-- node:notify -->
The Lambda function that handles everything after an order is placed: the PDF receipt, the customer email and the fulfilment hand-off.

| Setting | Value |
| --- | --- |
| Service | AWS Lambda, Node.js 22, 1024 MB (PDF rendering) |
| Trigger | [@order-events](isodraw:node/sqs), batches of up to 10 |
| Timeout | 10 s |
| Partial batch failures | On, so one bad message doesn't retry the whole batch |

## What it does for each message

1. Loads the order from [@Orders table](isodraw:node/ddb).
2. Renders a PDF receipt and uploads it to [@Receipts](isodraw:node/receipts) as \`receipts/2026/10/ord_2026_000123.pdf\`.
3. Publishes an \`OrderConfirmed\` message to [@order-updates](isodraw:node/sns), with a presigned link to the receipt (valid for 7 days).

## Error cases

| Failure | Result |
| --- | --- |
| Order not found (deleted, or a stale event) | Logged and dropped; not retried |
| S3 or SNS call fails | That message is reported as failed and comes back after 60 s |
| The same message fails 5 times | It moves to the DLQ and the alarm fires |

<!-- node:receipts -->
The bucket holding PDF receipts. Customers can download them from the app at any time, and finance needs them for 7 years.

| Setting | Value |
| --- | --- |
| Service | Amazon S3, bucket \`brewbox-receipts-prod\` |
| Access | Private; customers only get presigned links |
| Lifecycle | Move to Glacier Instant Retrieval after 90 days; delete after 7 years |
| Object Lock | Governance mode, 7 years (receipts can't be altered) |

If a customer asks for a receipt after their link expires, the app calls \`GET /orders/{id}\`, which returns a fresh link.

<!-- node:sns -->
The topic that tells the outside world about each order.

| Setting | Value |
| --- | --- |
| Service | Amazon SNS topic \`order-updates\` |
| Subscriptions | Email Lambda (customer emails through SES); HTTPS webhook to the fulfilment partner |
| Delivery retries | HTTPS: 3 immediate, then backoff for up to 1 hour |

## Webhook payload sent to the fulfilment partner

\`\`\`json
{
  "event": "order.confirmed",
  "orderId": "ord_2026_000123",
  "shipTo": { "name": "Ada L.", "postalCode": "94110", "country": "US" },
  "items": [{ "sku": "ETH-YIRG-250", "qty": 2 }],
  "signature": "t=1793291234,v1=5f2b…"
}
\`\`\`

The partner verifies \`signature\` with a shared secret before accepting the order.

## Error cases

- **Partner webhook down:** SNS keeps retrying for an hour, then sends the message to a dead-letter queue. Support re-sends it from the admin tool.
- **Email bounces:** SES marks the address. The app asks the customer to update their email the next time they open it.

<!-- node:logs -->
Logs, metrics, traces and alarms for the whole order flow.

| Setting | Value |
| --- | --- |
| Service | Amazon CloudWatch (Logs, Metrics, Alarms) and X-Ray |
| Log retention | 30 days, then exported to S3 |
| Log format | JSON, one line per request, including \`requestId\`, \`orderId\` and \`durationMs\` |

## Alarms

| Alarm | Threshold | Goes to |
| --- | --- | --- |
| \`orders-api\` errors | More than 1% for 5 minutes | Page on-call |
| \`orders-api\` p99 latency | Above 250 ms for 15 minutes | #orders-alerts |
| DLQ depth | Any message | #orders-alerts |
| API Gateway \`5xx\` | More than 0.5% for 5 minutes | Page on-call |

A useful Logs Insights query for a customer complaint:

\`\`\`sql
fields @timestamp, status, durationMs, error.code
| filter orderId = "ord_2026_000123"
| sort @timestamp asc
\`\`\`

<!-- edge:e1 -->
App to API over HTTPS (TLS 1.2+). Each call carries \`Authorization: Bearer <access token>\`; order creation also sends \`Idempotency-Key\`. Responses are JSON, compressed with gzip.

<!-- edge:e2 -->
API Gateway checks each token against Cognito's public signing keys (JWKS). It only fetches the keys, not each token, so Cognito sees almost no traffic from this. Validated tokens are cached for 5 minutes.

<!-- edge:e3 -->
API Gateway invokes the function synchronously with a payload format 2.0 event. The integration times out after 29 s, though the function's own timeout of 10 s is hit first.

<!-- edge:e4 -->
\`PutItem\` with \`ConditionExpression: attribute_not_exists(SK)\`, so a replay can't overwrite an existing order. Typical latency is 5–8 ms.

<!-- edge:e5 -->
\`SendMessage\` with the \`OrderPlaced\` event as the body, and the \`orderId\` as a message attribute for filtering:

\`\`\`json
{ "type": "OrderPlaced", "version": 1, "orderId": "ord_2026_000123", "totalCents": 6400 }
\`\`\`

If this call fails after the order is saved, the sweeper job sends it later (see [@orders-api](isodraw:node/orders)).

<!-- edge:e6 -->
Lambda polls the queue and invokes [@notify](isodraw:node/notify) with up to 10 messages, waiting at most 5 s to fill a batch. Failed messages are reported back individually (\`batchItemFailures\`), so only they are retried.

<!-- edge:e7 -->
\`PutObject\` with \`ContentType: application/pdf\` and server-side encryption. The key is \`receipts/{yyyy}/{mm}/{orderId}.pdf\`, so writing the same receipt twice just overwrites it with identical content.

<!-- edge:e8 -->
\`Publish\` with an \`eventType\` message attribute (\`order.confirmed\`). Subscriptions use filter policies, so the email Lambda and the partner webhook each receive only the events they handle.

<!-- edge:e9 -->
Every function writes structured JSON logs to its own log group (\`/aws/lambda/orders-api\`), plus X-Ray traces covering the API Gateway, Lambda and DynamoDB calls.
`,py=`<!-- diagram -->
## Overview

**Linewatch** is a predictive maintenance pipeline for a bottling plant. Sensors on each production line report vibration and temperature every 2 seconds. Linewatch spots machines drifting toward failure early enough to schedule repairs, instead of stopping a line unexpectedly.

Data takes two paths after [@enrich](isodraw:node/enrich):

- **Hot path:** the latest events go to [@OpenSearch](isodraw:node/search), which drives the plant-floor dashboards and anomaly alerts within seconds.
- **Cold path:** every event goes through [@Firehose](isodraw:node/firehose) into the [@Data lake](isodraw:node/lake), where analysts use [@Athena](isodraw:node/athena) to study trends and train models.

## Volumes

| Metric | Typical | Peak (all lines running) |
| --- | --- | --- |
| Events per second | 4,000 | 15,000 |
| Data per day (raw JSON) | 120 GB | 400 GB |
| Sensor to dashboard | 3 s | 8 s |

## Event lifecycle

| Stage | Where | Kept for |
| --- | --- | --- |
| Buffered | [@Kinesis](isodraw:node/kinesis) | 24 hours |
| Searchable | [@OpenSearch](isodraw:node/search) | 7 days |
| Raw archive | [@raw](isodraw:node/raw) | 30 days |
| Analytics | [@curated](isodraw:node/curated) | 3 years |

<!-- node:floor -->
The three bottling lines at the Riverside plant. Each line has a sensor gateway that collects readings from about 40 sensors and publishes them over MQTT.

| Line | Products | Shifts |
| --- | --- | --- |
| [@Line 1](isodraw:node/s1) | 330 ml glass | 24/7 |
| [@Line 2](isodraw:node/s2) | 500 ml PET | 2 shifts |
| [@Line 3](isodraw:node/s3) | 1 l PET | 2 shifts |

The plant network reaches AWS through a site-to-site VPN. If the VPN drops, the gateways buffer up to 6 hours of readings locally and send them once it's back.

<!-- node:s1 -->
The sensor gateway on Line 1 (glass bottles), the busiest line, which runs around the clock.

| Setting | Value |
| --- | --- |
| Hardware | Industrial gateway running AWS IoT Greengrass |
| Thing name | \`riverside-line1-gw\` |
| Sensors | 42 (filler, capper and labeller motors, conveyor bearings) |
| Publish rate | Every 2 s, one message per sensor |
| Topic | \`factory/riverside/line1/telemetry\` |

## Message

\`\`\`json
{
  "sensorId": "l1-filler-motor-03",
  "ts": "2026-10-29T16:20:05.120Z",
  "vibration_mm_s": 4.7,
  "temp_c": 61.2,
  "rpm": 1480,
  "seq": 908112
}
\`\`\`

\`seq\` increases with every message, so a gap shows that readings were dropped.

## Error cases

- **Certificate expired:** IoT Core refuses the connection and the gateway buffers locally. An alarm fires 30 days before any certificate expires.
- **Clock drift:** the gateway syncs time over NTP. Readings more than 5 minutes in the future are rejected by [@enrich](isodraw:node/enrich).
- **Sensor unplugged:** that sensor's messages stop. The dashboard marks it grey after 30 seconds of silence.

<!-- node:s2 -->
The sensor gateway on Line 2 (500 ml PET bottles), thing \`riverside-line2-gw\`. It has 38 sensors and publishes to \`factory/riverside/line2/telemetry\`. The message format and error handling are the same as [@Line 1](isodraw:node/s1).

<!-- node:s3 -->
The sensor gateway on Line 3 (1 l PET bottles), thing \`riverside-line3-gw\`. It has 36 sensors and publishes to \`factory/riverside/line3/telemetry\`. The message format and error handling are the same as [@Line 1](isodraw:node/s1).

<!-- node:iot -->
The MQTT broker the gateways connect to. It authenticates each device and forwards every reading into the pipeline.

| Setting | Value |
| --- | --- |
| Service | AWS IoT Core |
| Protocol | MQTT 3.1.1 over TLS, port 8883 |
| Auth | One X.509 certificate per gateway; certificates rotate yearly |
| Policy | Each gateway can publish only to its own line's topic |

## Rules

| Rule | SQL | Action |
| --- | --- | --- |
| \`telemetry_to_stream\` | \`SELECT *, topic(3) AS line FROM 'factory/+/+/telemetry'\` | Put into [@Kinesis](isodraw:node/kinesis), partition key \`\${sensorId}\` |
| \`telemetry_archive\` | \`SELECT * FROM 'factory/+/+/telemetry'\` | Write to [@raw](isodraw:node/raw) through a small Firehose stream |

## Error cases

- **Rule action fails** (for example, Kinesis throttling): the rule's error action writes the message to an S3 error bucket, and an alarm fires when anything lands there.
- **Gateway rejected:** an unknown certificate or a publish to another line's topic is denied and logged in CloudWatch.
- **Message over 128 KB:** rejected by IoT Core. Gateways send one reading per message, so messages are around 200 bytes.

<!-- node:kinesis -->
The stream that buffers every reading, so the downstream consumers can fall behind or restart without losing data.

| Setting | Value |
| --- | --- |
| Service | Amazon Kinesis Data Streams, \`linewatch-telemetry\` |
| Capacity | On-demand mode (currently 8 shards) |
| Partition key | \`sensorId\`, so each sensor's readings stay in order |
| Retention | 24 hours |
| Encryption | KMS |

## Error cases

| Symptom | Cause | What to do |
| --- | --- | --- |
| \`ProvisionedThroughputExceededException\` on writes | One shard is hot (too many sensors hashed together) | On-demand mode splits shards automatically; IoT Core retries in the meantime |
| \`IteratorAge\` growing | [@enrich](isodraw:node/enrich) is falling behind | Check enrich errors and duration; raise its parallelization factor |
| Data older than 24 h is gone | A consumer was down for over a day | Replay from [@raw](isodraw:node/raw) |

<!-- node:enrich -->
The Lambda function that turns raw sensor readings into useful events: it adds machine details, converts units and flags anomalies.

| Setting | Value |
| --- | --- |
| Service | AWS Lambda, Python 3.12, 1024 MB |
| Trigger | [@Kinesis](isodraw:node/kinesis), batches of 500, parallelization factor 4 |
| Timeout | 60 s |
| On failure | Splits the batch in half and retries; after 3 tries, the batch's location goes to an SQS failure queue |

## Steps

1. Look up the machine, line and service history for \`sensorId\` in the asset registry (cached in memory for 10 minutes).
2. Convert units to SI and drop readings with impossible values (for example, below absolute zero).
3. Compare the reading to the machine's rolling 7-day baseline. Mark \`anomaly: true\` if it's more than 3 standard deviations away for 5 readings in a row.

## Output event

\`\`\`json
{
  "sensorId": "l1-filler-motor-03",
  "ts": "2026-10-29T16:20:05.120Z",
  "line": "line1",
  "machine": { "id": "filler-03", "model": "KHS Innofill", "lastServiced": "2026-08-14" },
  "vibration_mm_s": 4.7,
  "temp_k": 334.35,
  "rpm": 1480,
  "anomaly": true,
  "anomalyScore": 3.4
}
\`\`\`

## Error cases

| Case | Handling |
| --- | --- |
| Unknown \`sensorId\` | Passed through with \`machine: null\`; counted in the \`UnknownSensor\` metric |
| Bad reading (impossible value) | Dropped and counted in \`RejectedReading\` |
| Asset registry unavailable | Uses the cached copy; if there's none, passes through with \`machine: null\` |
| OpenSearch or Firehose write fails | The batch fails and Kinesis retries it, so writes must tolerate duplicates |

<!-- node:search -->
The search cluster behind the live plant-floor dashboards. It holds the last 7 days of enriched events.

| Setting | Value |
| --- | --- |
| Service | Amazon OpenSearch Service 2.17 |
| Cluster | 3 × \`r7g.large.search\` data nodes, 3 dedicated masters, across 3 AZs |
| Indexes | One per day (\`telemetry-2026.10.29\`); deleted after 7 days by an ISM policy |
| Dashboards | OpenSearch Dashboards, refreshing every 5 s |

## Alerting

A monitor runs every minute:

\`\`\`json
{
  "query": { "bool": { "filter": [
    { "term": { "anomaly": true } },
    { "range": { "ts": { "gte": "now-5m" } } }
  ] } },
  "trigger": "count by machine.id > 10",
  "action": "notify #riverside-maintenance"
}
\`\`\`

## Error cases

- **Cluster status yellow:** a replica shard isn't allocated, usually during a node replacement. Dashboards keep working.
- **Cluster status red:** a primary shard is missing and writes to that index fail. [@enrich](isodraw:node/enrich) retries; page the platform team.
- **\`429 es_rejected_execution_exception\`:** the write queue is full. Writes back off and retry. If it keeps happening, the cluster needs more nodes.

<!-- node:firehose -->
Batches enriched events into Parquet files in the data lake.

| Setting | Value |
| --- | --- |
| Service | Amazon Data Firehose, stream \`linewatch-curated\` |
| Buffer | 5 minutes or 128 MB, whichever comes first |
| Format | JSON converted to Parquet using the [@Glue crawler](isodraw:node/glue)'s table schema |
| Partitioning | \`dt=YYYY-MM-DD/line=lineN/\` (dynamic partitioning) |
| Errors | Records that fail to convert go to \`s3://…/errors/\` |

## Error cases

- **Schema mismatch:** a new field from [@enrich](isodraw:node/enrich) that isn't in the table schema is dropped from the Parquet output. Update the schema before deploying the change.
- **S3 unavailable:** Firehose retries for up to 24 hours before giving up on a batch.

<!-- node:lake -->
Linewatch's long-term store: S3 buckets catalogued by AWS Glue and governed by Lake Formation.

| Zone | Bucket | Format | Retention | Who can read |
| --- | --- | --- | --- | --- |
| Raw | [@raw](isodraw:node/raw) | JSON, as received | 30 days | Data engineers |
| Curated | [@curated](isodraw:node/curated) | Parquet, partitioned | 3 years | Analysts, ML pipelines |

Access is granted per table and column in Lake Formation, not with bucket policies.

<!-- node:raw -->
Readings exactly as the gateways sent them, kept for 30 days so the pipeline can be replayed after a bug.

| Setting | Value |
| --- | --- |
| Bucket | \`linewatch-raw-prod\` |
| Layout | \`yyyy/mm/dd/hh/\` gzipped JSON lines |
| Lifecycle | Delete after 30 days |

**Replay:** a script reads a time range from this bucket and puts the readings back into [@Kinesis](isodraw:node/kinesis). They then flow through enrich again, with a \`replayed: true\` flag.

<!-- node:curated -->
The analytics source of truth: every enriched event as Parquet, partitioned by day and line.

| Setting | Value |
| --- | --- |
| Bucket | \`linewatch-curated-prod\` |
| Layout | \`telemetry/dt=2026-10-29/line=line1/part-0001.parquet\` |
| Size | About 12 GB per day after compression |
| Lifecycle | Infrequent Access after 90 days; delete after 3 years |

A nightly compaction job merges the many small files from each day into files of about 512 MB, which makes queries faster and cheaper.

<!-- node:glue -->
Keeps the \`linewatch.telemetry\` table definition in the Glue Data Catalog in step with the files in [@curated](isodraw:node/curated).

| Setting | Value |
| --- | --- |
| Service | AWS Glue crawler |
| Schedule | Every hour |
| Schema changes | New columns are added; removed or changed columns are only logged |

## Error cases

- **Crawler creates a second table** (for example \`telemetry_abc123\`): the files under a path didn't match. Usually a stray CSV someone uploaded. Delete the file and the extra table.
- **New partitions not visible in Athena:** the crawler hasn't run yet. Run \`MSCK REPAIR TABLE telemetry\` or wait for the next hour.

<!-- node:athena -->
SQL over the data lake for analysts and the weekly maintenance report.

| Setting | Value |
| --- | --- |
| Service | Amazon Athena (engine version 3) |
| Workgroup | \`linewatch-analysts\`; 10 GB scan limit per query |
| Results | \`s3://linewatch-athena-results/\`, deleted after 7 days |

## Example: average temperature by line today

\`\`\`sql
SELECT line,
       avg(temp_k - 273.15) AS avg_temp_c,
       count_if(anomaly)    AS anomalies
FROM linewatch.telemetry
WHERE dt = cast(current_date AS varchar)
GROUP BY line
ORDER BY anomalies DESC;
\`\`\`

Always filter on \`dt\`. Without it, a query scans all 3 years of data and hits the 10 GB limit.

## Error cases

- **\`Query exhausted resources\`:** usually a join without partition filters. Narrow the date range.
- **\`HIVE_PARTITION_SCHEMA_MISMATCH\`:** a column's type changed between days. Fix the type in the catalog, or cast the column in the query.

<!-- node:analysts -->
The reliability engineers and data scientists who study long-term trends, tune anomaly thresholds and train the failure-prediction model. They use [@Athena](isodraw:node/athena) from the console, from notebooks, and through a Tableau connection.

<!-- edge:e1 -->
MQTT \`PUBLISH\` at QoS 1 to \`factory/riverside/line1/telemetry\`, over TLS with the gateway's certificate. QoS 1 means IoT Core acknowledges each message, and the gateway resends anything that isn't acknowledged.

<!-- edge:e2 -->
Same as Line 1: MQTT at QoS 1 to \`factory/riverside/line2/telemetry\`.

<!-- edge:e3 -->
Same as Line 1: MQTT at QoS 1 to \`factory/riverside/line3/telemetry\`.

<!-- edge:e4 -->
The \`telemetry_to_stream\` rule calls \`PutRecord\` for each message, partitioned by \`sensorId\`. The rule adds a \`line\` field taken from the topic.

<!-- edge:e5 -->
An event source mapping reads from the stream: batches of up to 500 records or 1 second of waiting, 4 concurrent batches per shard. Records with the same \`sensorId\` are always processed in order.

<!-- edge:e6 -->
Bulk index requests to the daily index, using \`sensorId + seq\` as the document ID. A retried batch overwrites the same documents instead of creating duplicates.

Only the fields the dashboards need are sent, which keeps the cluster small:

\`\`\`json
{ "index": { "_index": "telemetry-2026.10.29", "_id": "l1-filler-motor-03:908112" } }
{ "ts": "2026-10-29T16:20:05.120Z", "line": "line1", "machine.id": "filler-03", "vibration_mm_s": 4.7, "temp_k": 334.35, "anomaly": true }
\`\`\`

<!-- edge:e7 -->
\`PutRecordBatch\` with the full enriched event, up to 500 records per call. Firehose may store a retried record twice; the nightly compaction removes duplicates by \`sensorId\` and \`seq\`.

<!-- edge:e8 -->
Firehose writes a Parquet file to \`curated\` at most every 5 minutes for each \`dt\`/\`line\` partition.

<!-- edge:e9 -->
The \`telemetry_archive\` rule copies every message, unchanged, to the raw zone. This copy doesn't depend on Kinesis or enrich, so it still works when they break, and the pipeline can be replayed from it.

<!-- edge:e10 -->
The crawler lists new objects under \`telemetry/\` every hour and updates the table's partitions and columns.

<!-- edge:e11 -->
Athena reads table and partition definitions from the Glue Data Catalog when it plans each query.

<!-- edge:e12 -->
Analysts send SQL through the console, JDBC (Tableau) or \`boto3\` in notebooks, and get results back as CSV in the results bucket.
`,my=`<!-- diagram -->
## Overview

**Tablebook** is a restaurant reservations web app: diners search for open tables and book them, and restaurants manage their floor plans and bookings. This diagram is the production stack in \`us-east-1\`.

A request takes one of two paths:

1. Static files (JavaScript, CSS, images) come from [@CloudFront](isodraw:node/cf), which caches them from [@S3 assets](isodraw:node/s3).
2. API calls under \`/api/*\` pass through CloudFront to the [@ALB](isodraw:node/alb), which spreads them across three Django servers. Those servers read and write [@RDS primary](isodraw:node/rds) and cache hot reads in [@ElastiCache](isodraw:node/cache).

## Service levels

| Endpoint | Availability | Latency (p99) |
| --- | --- | --- |
| Search tables | 99.9% | 400 ms |
| Create reservation | 99.95% | 600 ms |
| Static assets | 99.99% | 100 ms |

## Environments

| Environment | URL | Notes |
| --- | --- | --- |
| Production | \`tablebook.example.com\` | This diagram |
| Staging | \`staging.tablebook.example.com\` | Same layout, one web server, smaller database |
| Local | \`localhost:8000\` | Docker Compose with Postgres and Redis |

> Every component has its own page with its configuration, payloads and the errors it can produce. Open one from the contents, or hover a mention to find it on the diagram.

<!-- node:vpc -->
The production network for Tablebook: one VPC across three availability zones, split into public, app and data subnets.

| Setting | Value |
| --- | --- |
| Region | \`us-east-1\` (a, b, c) |
| CIDR | \`10.0.0.0/16\` |
| NAT | One NAT gateway per AZ |
| Flow logs | Rejected traffic only, to CloudWatch Logs (30 days) |
| Endpoints | Gateway endpoint for S3; interface endpoints for Secrets Manager and SSM |

## Traffic rules

Only the [@ALB](isodraw:node/alb) is reachable from the internet. Each tier accepts traffic only from the tier in front of it:

| Security group | Allows in | From |
| --- | --- | --- |
| \`sg-alb\` | 443 | CloudFront managed prefix list |
| \`sg-web\` | 8000 | \`sg-alb\` |
| \`sg-db\` | 5432 | \`sg-web\` |
| \`sg-cache\` | 6379 | \`sg-web\` |

## Failure cases

- **One AZ goes down:** each tier has capacity in the other two AZs. The ALB stops routing to the unhealthy zone within about 30 seconds.
- **A NAT gateway fails:** only outbound calls from that AZ's web server break (for example, sending email). Inbound requests keep working.

<!-- node:pub -->
Subnets for internet-facing resources: the [@ALB](isodraw:node/alb) and the NAT gateways.

| AZ | CIDR |
| --- | --- |
| us-east-1a | \`10.0.0.0/24\` |
| us-east-1b | \`10.0.1.0/24\` |
| us-east-1c | \`10.0.2.0/24\` |

Nothing else may run here. A Config rule flags any EC2 instance launched in these subnets.

<!-- node:app -->
Private subnets for the web tier: [@web-1](isodraw:node/ec2a), [@web-2](isodraw:node/ec2b) and [@web-3](isodraw:node/ec2c).

| AZ | CIDR |
| --- | --- |
| us-east-1a | \`10.0.10.0/23\` |
| us-east-1b | \`10.0.12.0/23\` |
| us-east-1c | \`10.0.14.0/23\` |

They have outbound internet through the NAT gateways (payment provider, email API) but no inbound route from the internet.

<!-- node:data -->
Isolated subnets for state: [@RDS primary](isodraw:node/rds), [@RDS replica](isodraw:node/rds2) and [@ElastiCache](isodraw:node/cache).

There is no route to the internet at all, not even through NAT. Engine updates come through AWS, and backups go to S3 through the gateway endpoint.

<!-- node:users -->
Diners and restaurant staff using Tablebook in a browser.

| Audience | Share of traffic | Peak |
| --- | --- | --- |
| Diners (search and book) | 85% | Friday 5–7 pm local time |
| Restaurant staff (dashboard) | 15% | Weekdays 10–11 am |

Everyone reaches the app at \`tablebook.example.com\` over HTTPS through [@CloudFront](isodraw:node/cf). Nothing talks to the load balancer directly.

<!-- node:cf -->
The CDN in front of everything: it serves cached static files and passes API calls through to the load balancer.

| Setting | Value |
| --- | --- |
| Service | Amazon CloudFront |
| Domain | \`tablebook.example.com\` (ACM certificate) |
| Price class | 100 (North America and Europe) |
| Protocols | HTTP/2 and HTTP/3; TLS 1.2 minimum |
| WAF | AWS managed common rules plus a rate limit of 2,000 requests per 5 minutes per IP |

## Behaviors

| Path | Origin | Caching |
| --- | --- | --- |
| \`/static/*\` | [@S3 assets](isodraw:node/s3) | 1 year (file names are content-hashed) |
| \`/api/*\` | [@ALB](isodraw:node/alb) | Not cached; all headers, cookies and query strings forwarded |
| \`/*\` | [@S3 assets](isodraw:node/s3) | 60 seconds (\`index.html\`) |

## Error cases

| What the user sees | Cause | Handling |
| --- | --- | --- |
| \`403\` | Blocked by WAF (rate limit or bad request) | Branded "Too many requests" page |
| \`502\` | Origin TLS handshake failed or the origin closed the connection | Custom error page; alarm if above 1% for 5 minutes |
| \`504\` | Origin took longer than 30 seconds | Custom error page; API clients retry idempotent calls |

## Deploying

The frontend build uploads to S3, then invalidates \`/index.html\` only. Every other file has a new hashed name, so it never needs invalidating.

<!-- node:s3 -->
The bucket holding Tablebook's frontend: the single-page app's HTML, JavaScript, CSS, fonts and images.

| Setting | Value |
| --- | --- |
| Bucket | \`tablebook-prod-assets\` |
| Access | Private; only [@CloudFront](isodraw:node/cf) can read it (origin access control) |
| Versioning | On, with old versions expiring after 30 days |
| Encryption | SSE-S3 |

## Layout

\`\`\`text
index.html                   Cache-Control: max-age=60
static/js/app.3f9c1e.js      Cache-Control: max-age=31536000, immutable
static/css/app.81aa02.css
static/img/…
\`\`\`

## Error cases

- **\`403 AccessDenied\` through CloudFront:** almost always a missing object. S3 returns 403 instead of 404 for a missing key when the caller can't list the bucket. Check the deploy uploaded the hashed file that \`index.html\` points to.
- **Bad deploy:** roll back by restoring the previous \`index.html\` version. The old hashed files are still in the bucket.

<!-- node:alb -->
The public Application Load Balancer. It terminates TLS for API traffic and spreads requests across the web servers.

| Setting | Value |
| --- | --- |
| Service | Elastic Load Balancing (Application Load Balancer) |
| Scheme | Internet-facing, in the public subnets of all three AZs |
| Idle timeout | 60 seconds |
| Deletion protection | On |

## Listeners

| Listener | Action |
| --- | --- |
| 443 HTTPS | Forward to target group \`web\` if the \`X-Origin-Verify\` header matches; otherwise \`403\` |
| 80 HTTP | Redirect to 443 |

The \`X-Origin-Verify\` header is a secret that [@CloudFront](isodraw:node/cf) adds, so requests that skip the CDN are rejected.

## Target group \`web\`

| Setting | Value |
| --- | --- |
| Targets | [@web-1](isodraw:node/ec2a), [@web-2](isodraw:node/ec2b), [@web-3](isodraw:node/ec2c) on port 8000 |
| Health check | \`GET /healthz\` every 10 s; 2 passes healthy, 3 failures unhealthy |
| Deregistration delay | 30 s |
| Algorithm | Least outstanding requests |

## Error cases

| Status | Meaning | Usual cause |
| --- | --- | --- |
| \`502\` | A target closed the connection or sent a bad response | gunicorn worker killed (out of memory) mid-request |
| \`503\` | No healthy targets | Bad deploy failing \`/healthz\` on every instance |
| \`504\` | A target didn't answer within 60 s | Slow database query; see [@RDS primary](isodraw:node/rds) |

<!-- node:ec2a -->
Web server in **us-east-1a**, identical to [@web-2](isodraw:node/ec2b). Its page has the full details: the API, payloads and error handling.

<!-- node:ec2b -->
One of three identical Django web servers that run the Tablebook API. They sit behind the [@ALB](isodraw:node/alb), one per AZ.

| Setting | Value |
| --- | --- |
| Service | Amazon EC2 in an Auto Scaling group |
| Instance | \`m7g.large\` (Graviton), Amazon Linux 2023 |
| Runtime | Python 3.12, Django 5.1, gunicorn (9 workers) on port 8000 |
| Scaling | Min 3, max 9; scales out when CPU is above 55% |
| Config | Environment from SSM Parameter Store; secrets from Secrets Manager |

## API

| Method | Path | What it does |
| --- | --- | --- |
| \`GET\` | \`/api/restaurants/{id}/availability?date=&party=\` | Open slots for a day (cached) |
| \`POST\` | \`/api/reservations\` | Book a slot |
| \`DELETE\` | \`/api/reservations/{id}\` | Cancel a booking |
| \`GET\` | \`/healthz\` | Checks the process can reach the database and cache |

## Example: book a table

Request:

\`\`\`http
POST /api/reservations
Authorization: Bearer eyJhbGciOi…
Idempotency-Key: 6f1c2a9e-4b1d-4c55-9a0e-2f4b6a7d8e10
Content-Type: application/json

{
  "restaurantId": "rst_1042",
  "slot": "2026-11-06T19:30:00-05:00",
  "partySize": 4,
  "notes": "Window seat if possible"
}
\`\`\`

Response \`201 Created\`:

\`\`\`json
{
  "id": "res_8Kq2Zp",
  "status": "confirmed",
  "restaurantId": "rst_1042",
  "slot": "2026-11-06T19:30:00-05:00",
  "partySize": 4,
  "confirmationCode": "TB-4F7Q"
}
\`\`\`

The booking runs in one database transaction that locks the slot row (\`SELECT … FOR UPDATE\`), so two diners can't book the last table at the same moment.

## Error cases

| Status | Code | When |
| --- | --- | --- |
| \`400\` | \`invalid_request\` | Missing fields, party size outside 1–20, or a slot in the past |
| \`401\` | \`unauthenticated\` | Missing or expired session token |
| \`409\` | \`slot_unavailable\` | Someone else took the slot; the response lists the nearest open times |
| \`409\` | \`duplicate_request\` | Same \`Idempotency-Key\` with a different body |
| \`429\` | \`rate_limited\` | More than 10 bookings per minute from one account |
| \`503\` | \`dependency_unavailable\` | Database unreachable; the client should retry with backoff |

Errors share one shape:

\`\`\`json
{ "error": { "code": "slot_unavailable", "message": "That time was just booked.", "alternatives": ["19:00", "20:15"] } }
\`\`\`

## To do

- [x] IMDSv2 only
- [x] Graceful shutdown: drain in-flight requests before the instance is replaced
- [ ] Move to Graviton 4 (\`m8g\`)
- [ ] Containerize and move to ECS

<!-- node:ec2c -->
Web server in **us-east-1c**, identical to [@web-2](isodraw:node/ec2b). This is also the instance that runs the nightly \`send_reminders\` cron job, which emails diners the day before their booking. The job takes a database advisory lock, so it can't run twice.

<!-- node:rds -->
The main PostgreSQL database and Tablebook's source of truth. All writes go here.

| Setting | Value |
| --- | --- |
| Service | Amazon RDS for PostgreSQL 16 |
| Instance | \`db.r7g.xlarge\`, Multi-AZ (synchronous standby in another AZ) |
| Storage | 500 GB gp3, autoscaling to 1 TB |
| Backups | Daily snapshots kept 14 days, plus point-in-time recovery |
| Parameters | \`max_connections=400\`, \`statement_timeout=5s\` for the app role |

## Main tables

| Table | Rows | Notes |
| --- | --- | --- |
| \`restaurants\` | 12k | Profile, opening hours, floor plan |
| \`slots\` | 40M | One row per bookable table and time; partitioned by month |
| \`reservations\` | 18M | Unique on \`(slot_id)\` where status is confirmed |
| \`users\` | 2.1M | Diners and staff, with a role column |

## Error cases

| Symptom | Cause | What happens |
| --- | --- | --- |
| Connections drop for 30–60 s | Multi-AZ failover (maintenance or instance failure) | The DNS name moves to the standby; Django reconnects and retries the request once |
| \`too many connections\` | A web server's connection pool leaking | Alarm at 80% of \`max_connections\`; restart the instance |
| \`canceling statement due to statement timeout\` | Slow query above 5 s | The API returns \`503\`; the query is logged for review |
| \`deadlock detected\` | Two bookings locking slots in a different order | The booking is retried up to 3 times |

> Restores go to a new instance. Never restore over production; repoint the app once the data has been checked.

<!-- node:rds2 -->
A read-only copy of [@RDS primary](isodraw:node/rds) for reporting and the restaurant dashboard's heavy queries.

| Setting | Value |
| --- | --- |
| Service | RDS read replica (same engine and instance size) |
| Replication | Asynchronous; usually less than 1 second behind |
| Used by | Monthly reports and the "busy times" charts |

## Error cases

- **Replica lag above 30 s:** the app stops sending reads here and uses the primary until lag recovers. Fresh data matters more than the extra load.
- **Replica unavailable:** reports pause and show "Data is being refreshed". Bookings are unaffected because they never read from the replica.

<!-- node:cache -->
Redis cache for hot reads (mostly availability) and for rate-limit counters.

| Setting | Value |
| --- | --- |
| Service | Amazon ElastiCache for Redis 7 (cluster mode off) |
| Nodes | \`cache.r7g.large\`, one primary and one replica in another AZ |
| Eviction | \`allkeys-lru\` |
| Encryption | In transit (TLS) and at rest |

## Keys

| Key | Value | TTL |
| --- | --- | --- |
| \`avail:{restaurantId}:{date}:{party}\` | JSON list of open slots | 30 s |
| \`restaurant:{id}\` | Restaurant profile | 10 min |
| \`rl:{userId}:{minute}\` | Request counter | 60 s |

Example availability value:

\`\`\`json
{ "date": "2026-11-06", "party": 4, "slots": ["17:30", "19:00", "20:15"], "generatedAt": "2026-11-05T14:02:11Z" }
\`\`\`

A new booking deletes that restaurant's \`avail:*\` keys for the day, so the next search recomputes them.

## Error cases

- **Cache unavailable:** reads fall through to the database. The client has a 50 ms timeout, so a slow Redis can't slow the API down much. Rate limiting fails open.
- **Many requests miss the same key at once:** only one request recomputes the value. The others wait up to 200 ms for it, using a short \`SET NX\` lock.

<!-- edge:e1 -->
Browsers to [@CloudFront](isodraw:node/cf) over HTTPS (HTTP/2 or HTTP/3). The session token is in a \`Secure\`, \`HttpOnly\`, \`SameSite=Lax\` cookie; API calls also send it as a \`Bearer\` header.

<!-- edge:e2 -->
CloudFront forwards \`/api/*\` to the [@ALB](isodraw:node/alb) over HTTPS.

- Adds \`X-Origin-Verify: <secret>\`, so the ALB can reject requests that skip the CDN. The secret is rotated monthly.
- Origin timeouts: 5 s to connect, 30 s to respond.
- Forwards all headers, cookies and query strings. Nothing under \`/api/*\` is cached.

<!-- edge:e3 -->
CloudFront reads from [@S3 assets](isodraw:node/s3) using origin access control, with requests signed by SigV4. The bucket policy only allows this distribution's ARN.

<!-- edge:e4 -->
ALB to [@web-1](isodraw:node/ec2a) over plain HTTP on port 8000, inside the VPC. The ALB adds \`X-Forwarded-For\`, \`X-Forwarded-Proto\` and \`X-Amzn-Trace-Id\`. Django trusts these only from the ALB's subnets.

<!-- edge:e5 -->
Same as the other web server connections: HTTP on port 8000, with health checks on \`/healthz\` every 10 seconds.

<!-- edge:e6 -->
Same as the other web server connections. When web-3 is being replaced during a deploy, the ALB drains it for 30 seconds before the instance stops.

<!-- edge:e7 -->
Django to PostgreSQL with \`psycopg\` 3 over TLS.

| Setting | Value |
| --- | --- |
| Pool | 20 connections per instance (\`CONN_MAX_AGE=60\`) |
| Connect timeout | 3 s |
| Statement timeout | 5 s for the app role |

Example of the booking transaction:

\`\`\`sql
BEGIN;
SELECT id FROM slots
 WHERE id = $1 AND status = 'open'
   FOR UPDATE;
INSERT INTO reservations (slot_id, user_id, party_size, status)
VALUES ($1, $2, 4, 'confirmed');
UPDATE slots SET status = 'booked' WHERE id = $1;
COMMIT;
\`\`\`

<!-- edge:e8 -->
Asynchronous streaming replication. Typical lag is under a second; reporting queries read from the replica.

An alarm fires when \`ReplicaLag\` stays above 30 seconds for 5 minutes. Above that the app stops reading from the replica (see [@RDS replica](isodraw:node/rds2)).

<!-- edge:e9 -->
Web servers to Redis over TLS on port 6379, with a 50 ms command timeout. Reads use \`GET\` and \`MGET\`; booking writes delete keys with \`UNLINK\`, so a delete never blocks.
`,Ji="https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons/architecture-service",gy={version:1,nodes:[{id:"title",kind:"text",x:0,y:-4,w:16,d:2,h:0,z:0,color:"#0f172a",text:"Three-tier web app",fontSize:1.1},{id:"vpc",kind:"area",x:4,y:-1,w:17,d:13,h:0,z:0,color:"#8c4fff",opacity:.08,dashed:!0,label:"VPC 10.0.0.0/16",labelColor:"#6d28d9"},{id:"pub",kind:"area",x:5,y:0,w:4,d:11,h:0,z:0,color:"#7aa116",opacity:.14,label:"Public subnet"},{id:"app",kind:"area",x:10,y:0,w:5,d:11,h:0,z:0,color:"#4f8cf7",opacity:.14,label:"App subnet"},{id:"data",kind:"area",x:16,y:0,w:4,d:11,h:0,z:0,color:"#ed7100",opacity:.14,label:"Data subnet"},{id:"users",kind:"image",x:-4,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"standing",src:"https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons/resource/Users.svg",label:"Users"},{id:"cf",kind:"image",x:0,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${Ji}/AmazonCloudFront.svg`,label:"CloudFront"},{id:"s3",kind:"image",x:0,y:8,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${Ji}/AmazonSimpleStorageService.svg`,label:"S3 assets"},{id:"alb",kind:"image",x:6,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${Ji}/ElasticLoadBalancing.svg`,label:"ALB"},{id:"ec2a",kind:"block",x:11,y:1.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-1"},{id:"ec2b",kind:"block",x:11,y:4.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-2"},{id:"ec2c",kind:"block",x:11,y:7.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-3"},{id:"rds",kind:"cylinder",x:17,y:2,w:2,d:2,h:1.75,z:0,color:"#3b48cc",label:"RDS primary"},{id:"rds2",kind:"cylinder",x:17,y:6,w:2,d:2,h:1.75,z:0,color:"#6b77e5",label:"RDS replica"},{id:"cache",kind:"hexagon",x:17,y:9,w:2,d:1.5,h:.75,z:0,color:"#dd344c",label:"ElastiCache"}],edges:[{id:"e1",from:"users",to:"cf",color:"#475569",width:2,routing:"curved",endMarker:"arrow",label:"HTTPS",animation:"packets",animationDirection:"both"},{id:"e2",from:"cf",to:"alb",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"flow"},{id:"e3",from:"cf",to:"s3",color:"#7aa116",width:2,routing:"orthogonal",rounded:!0,lineStyle:"dashed",endMarker:"open"},{id:"e4",from:"alb",to:"ec2a",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e5",from:"alb",to:"ec2b",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e6",from:"alb",to:"ec2c",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e7",from:"ec2b",to:"rds",color:"#3b48cc",width:2,routing:"orthogonal",rounded:!0,startMarker:"circle",endMarker:"arrow",animation:"pulse"},{id:"e8",from:"rds",to:"rds2",color:"#3b48cc",width:2,routing:"straight",lineStyle:"dotted",endMarker:"arrow",label:"replication",animation:"flow",animationSpeed:.5},{id:"e9",from:"ec2c",to:"cache",color:"#dd344c",width:2,routing:"orthogonal",rounded:!0,startMarker:"diamond",endMarker:"arrow",animation:"glow"}]},kh=bs(gy,my),Sh="https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons",we=e=>`${Sh}/architecture-service/${e}.svg`,ic=e=>`${Sh}/resource/${e}.svg`;function de(e,t,n,r,o,s={}){return{id:e,kind:"image",label:t,src:n,x:r,y:o,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",...s}}function Kn(e,t,n,r,o,s,i,l={}){return{id:e,kind:"area",label:t,color:n,x:r,y:o,w:s,d:i,h:0,z:0,opacity:.12,...l}}function ac(e,t,n,r,o){return{id:e,kind:"text",text:t,x:n,y:r,w:o,d:2,h:0,z:0,color:"#0f172a",fontSize:1.1}}function q(e,t,n,r={}){return{id:e,from:t,to:n,color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",...r}}const yy={version:1,nodes:[{id:"in",kind:"block",label:"API event",x:0,y:0,w:2,d:2,h:.5,z:0,color:"#8c4fff"},{id:"validate",kind:"hexagon",label:"validate()",x:4,y:0,w:2,d:2,h:.75,z:0,color:"#f2a93b"},{id:"idem",kind:"cylinder",label:"idempotency cache",x:4,y:4,w:2,d:2,h:1,z:0,color:"#64748b"},{id:"put",kind:"block",label:"table.put()",x:8,y:0,w:2,d:2,h:.75,z:0,color:"#3b48cc"},{id:"send",kind:"block",label:"queue.send()",x:12,y:0,w:2,d:2,h:.75,z:0,color:"#dd344c"},{id:"out",kind:"pyramid",label:"201 Created",x:12,y:4,w:2,d:2,h:1,z:0,color:"#3fb27f"}],edges:[q("i1","in","validate",{animation:"packets"}),q("i2","validate","idem",{lineStyle:"dashed",label:"seen?",startMarker:"arrow"}),q("i3","validate","put",{animation:"packets"}),q("i4","put","send",{animation:"packets"}),q("i5","send","out",{color:"#3fb27f"})]},vy={version:1,nodes:[ac("title","Serverless order API",-2,-5,14),de("client","Mobile app",ic("Mobileclient"),-5,3,{imageStyle:"standing"}),de("cognito","Cognito",we("AmazonCognito"),0,-2.5),de("apigw","API Gateway",we("AmazonAPIGateway"),0,3),Kn("backend","Serverless backend","#ed7100",4,-2.5,17.5,14,{dashed:!0,opacity:.06}),de("orders","orders-api",we("AWSLambda"),6,3),de("ddb","Orders table",we("AmazonDynamoDB"),12.5,-1),de("sqs","order-events",we("AmazonSimpleQueueService"),12.5,3),de("notify","notify",we("AWSLambda"),17.5,3),de("receipts","Receipts",we("AmazonSimpleStorageService"),17.5,-1),de("sns","order-updates",we("AmazonSimpleNotificationService"),17.5,7.5),de("logs","CloudWatch",we("AmazonCloudWatch"),6,7.5)],edges:[q("e1","client","apigw",{routing:"curved",label:"HTTPS",animation:"packets",animationDirection:"both"}),q("e2","apigw","cognito",{lineStyle:"dashed",color:"#c925d1",endMarker:"open",label:"verify JWT"}),q("e3","apigw","orders",{animation:"flow"}),q("e4","orders","ddb",{color:"#3b48cc",animation:"packets",label:"PutItem"}),q("e5","orders","sqs",{color:"#dd344c",animation:"packets",label:"OrderPlaced"}),q("e6","sqs","notify",{color:"#dd344c",animation:"flow"}),q("e7","notify","receipts",{lineStyle:"dashed",color:"#7aa116"}),q("e8","notify","sns",{color:"#dd344c"}),q("e9","orders","logs",{lineStyle:"dotted",color:"#94a3b8",endMarker:"none",label:"logs"})]},ea=(e,t,n)=>({id:e,kind:"block",label:t,x:-7,y:n,w:1.5,d:1.5,h:.75,z:0,color:"#7aa116"}),wy={version:1,nodes:[ac("title","Streaming IoT pipeline",-2,-5,16),Kn("floor","Factory floor","#7aa116",-8.5,-1,4.5,8.5),ea("s1","Line 1",0),ea("s2","Line 2",2.5),ea("s3","Line 3",5),de("iot","IoT Core",we("AWSIoTCore"),-1.5,2),de("kinesis","Kinesis",we("AmazonKinesisDataStreams"),3,2),de("enrich","enrich",we("AWSLambda"),7.5,2),de("search","OpenSearch",we("AmazonOpenSearchService"),12.5,2),de("firehose","Firehose",we("AmazonDataFirehose"),7.5,7),Kn("lake","Data lake","#3fb27f",-2,10,12.5,7.5),de("raw","raw",we("AmazonSimpleStorageService"),-.5,11.5),de("curated","curated",we("AmazonSimpleStorageService"),6.5,11.5),de("glue","Glue crawler",we("AWSGlue"),3,14.5),de("athena","Athena",we("AmazonAthena"),13.5,14.5),de("analysts","Analysts",ic("Users"),18,14.5,{imageStyle:"standing"})],edges:[q("e1","s1","iot",{color:"#7aa116",animation:"packets",label:"MQTT"}),q("e2","s2","iot",{color:"#7aa116",animation:"packets"}),q("e3","s3","iot",{color:"#7aa116",animation:"packets"}),q("e4","iot","kinesis",{animation:"packets",animationSpeed:1.5}),q("e5","kinesis","enrich",{animation:"packets",animationSpeed:1.5}),q("e6","enrich","search",{color:"#3b48cc",animation:"pulse",label:"hot path"}),q("e7","enrich","firehose",{animation:"flow",label:"cold path"}),q("e8","firehose","curated",{color:"#3fb27f",animation:"flow"}),q("e9","iot","raw",{lineStyle:"dashed",color:"#94a3b8",routing:"curved",label:"archive"}),q("e10","glue","curated",{lineStyle:"dotted",color:"#8c4fff",endMarker:"open"}),q("e11","athena","glue",{lineStyle:"dotted",color:"#8c4fff",label:"catalog"}),q("e12","analysts","athena",{routing:"straight",animation:"packets",animationDirection:"both"})]},ta=(e,t,n,r,o)=>({id:e,kind:"block",label:t,x:n,y:r,w:2.5,d:2,h:1,z:0,color:o}),xy={version:1,nodes:[ac("title","Kubernetes microservices",2,-7,18),de("users","Shoppers",ic("Users"),-6,4,{imageStyle:"standing"}),de("dns","Route 53",we("AmazonRoute53"),-2,4),de("alb","Ingress ALB",we("ElasticLoadBalancing"),1.5,4),Kn("eks","EKS cluster","#ed7100",4.5,-3,20,16,{dashed:!0,opacity:.05}),Kn("ns-web","namespace: web","#4f8cf7",5.5,-2,8,7),Kn("ns-orders","namespace: orders","#dd344c",14.5,-2,9,7),Kn("ns-platform","namespace: platform","#64748b",5.5,6,18,6),ta("storefront","storefront",6.5,-.5,"#4f8cf7"),ta("cart","cart",10,2,"#4f8cf7"),ta("orders-svc","orders",15.5,-.5,"#dd344c"),{id:"payments",kind:"hexagon",label:"payments",x:20,y:1.5,w:2.5,d:2,h:1,z:0,color:"#c925d1"},{id:"prometheus",kind:"pyramid",label:"Prometheus",x:7,y:7.5,w:2.5,d:2.5,h:1.75,z:0,color:"#e5534b"},{id:"argocd",kind:"cone",label:"Argo CD",x:12,y:7.5,w:2.5,d:2.5,h:2,z:0,color:"#f2a93b"},{id:"mesh",kind:"cylinder",label:"Istio",x:17,y:7.5,w:2.5,d:2.5,h:1.25,z:0,color:"#39c5cf"},de("ecr","ECR",we("AmazonElasticContainerRegistry"),12.25,14.5),de("aurora","Aurora",we("AmazonAurora"),27,0),de("redis","Redis",we("AmazonElastiCache"),27,5)],edges:[q("e1","users","dns",{routing:"straight",animation:"packets",animationDirection:"both"}),q("e2","dns","alb",{animation:"flow"}),q("e3","alb","storefront",{animation:"packets",label:"HTTPS"}),q("e4","storefront","cart",{color:"#4f8cf7",animation:"flow"}),q("e5","storefront","orders-svc",{color:"#dd344c",animation:"packets",label:"gRPC"}),q("e6","orders-svc","payments",{color:"#c925d1",animation:"pulse"}),q("e7","orders-svc","aurora",{color:"#3b48cc",label:"SQL"}),q("e8","cart","redis",{color:"#dd344c",routing:"curved"}),q("e9","argocd","ecr",{lineStyle:"dashed",color:"#94a3b8",label:"pull images"})]},$u=[{id:"three-tier",name:"Three-tier web app",diagram:kh},{id:"serverless",name:"Serverless order API",diagram:bs(vy,hy,{ordersInternals:yy})},{id:"streaming",name:"Streaming IoT pipeline",diagram:bs(wy,py)},{id:"kubernetes",name:"Kubernetes microservices",diagram:bs(xy,fy)}],Fu="isodraw-demo:diagram",Bu="isodraw-demo:icons",Vu="isodraw-demo:theme";function na(e,t){try{const n=localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}const ky=()=>c.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round","aria-hidden":!0,children:[c.jsx("circle",{cx:"12",cy:"12",r:"4"}),c.jsx("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"})]}),Sy=()=>c.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:c.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})});function Ey(){const[e,t]=N.useState(()=>na(Fu,kh)),[n,r]=N.useState(()=>na(Bu,[])),[o,s]=N.useState(0),[i,l]=N.useState(()=>window.location.hash.startsWith("#/")?"published":"edit"),[a,d]=N.useState(()=>na(Vu,"system")),f=tc(a);N.useEffect(()=>{document.documentElement.dataset.theme=f},[f]),N.useEffect(()=>{try{localStorage.setItem(Vu,JSON.stringify(a))}catch{}},[a]),N.useEffect(()=>{try{localStorage.setItem(Fu,JSON.stringify(e))}catch{}},[e]),N.useEffect(()=>{try{localStorage.setItem(Bu,JSON.stringify(n))}catch{}},[n]);const m=h=>{t(h),s(k=>k+1)};return c.jsxs("div",{className:"demo",children:[c.jsxs("header",{className:"demo-header",children:[c.jsxs("div",{className:"demo-brand",children:[c.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24","aria-hidden":!0,children:[c.jsx("path",{d:"M12 2 3 7l9 5 9-5-9-5Z",fill:"#60a5fa"}),c.jsx("path",{d:"M3 7v10l9 5V12L3 7Z",fill:"#2563eb"}),c.jsx("path",{d:"M21 7v10l-9 5V12l9-5Z",fill:"#1d4ed8"})]}),c.jsx("strong",{children:"IsoDraw"}),c.jsx("span",{children:"Cloudcraft-style diagrams for React"})]}),c.jsxs("div",{className:"demo-actions",children:[c.jsx("div",{className:"demo-modes",role:"radiogroup","aria-label":"Mode",children:[["edit","Edit","Draw and document"],["view","View","Browse the diagram and its docs without editing"],["published","Published","Docs-site view: a page per component"]].map(([h,k,g])=>c.jsx("button",{type:"button",role:"radio","aria-checked":i===h,className:i===h?"is-on":"",title:g,onClick:()=>{l(h),h!=="published"&&window.location.hash&&history.replaceState(null,"",window.location.pathname)},children:k},h))}),c.jsxs("label",{className:"demo-select",title:"Load an example diagram (replaces the current one)",children:[c.jsx("span",{children:"Examples"}),c.jsxs("select",{value:"","aria-label":"Load an example diagram",onChange:h=>{const k=$u.find(g=>g.id===h.target.value);k&&m(k.diagram)},children:[c.jsx("option",{value:"",disabled:!0,children:"Load example…"}),$u.map(h=>c.jsx("option",{value:h.id,children:h.name},h.id))]})]}),c.jsx("button",{type:"button",onClick:()=>m(Qa()),children:"New blank"})]}),c.jsx("button",{type:"button",className:"demo-theme",onClick:()=>d(f==="dark"?"light":"dark"),"aria-label":f==="dark"?"Switch to light theme":"Switch to dark theme",title:f==="dark"?"Switch to light theme":"Switch to dark theme",children:f==="dark"?c.jsx(ky,{}):c.jsx(Sy,{})})]}),c.jsx("main",{className:"demo-main",children:i==="published"?c.jsx(dy,{diagram:e,useHash:!0,theme:a}):c.jsx(iy,{value:e,onChange:t,userIcons:n,onUserIconsChange:r,readOnly:i==="view",theme:a},o)})]})}oh(document.getElementById("root")).render(c.jsx(N.StrictMode,{children:c.jsx(Ey,{})}));export{Qe as I,Pr as K,Ya as M,Cy as R,zy as S,ec as T,Ay as a,dh as b,En as c,rh as d,Jl as e,jy as f,Wu as g,xt as h,cn as i,c as j,Ny as k,ch as l,Py as m,_o as n,by as o,ql as p,Ar as q,N as r,uh as s,Ty as t,My as u,Qa as v,yg as w,mg as x,wi as y,iy as z};
