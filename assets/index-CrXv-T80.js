const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PublishedView-BYGwmeuV.js","./DocsPanel-D7tFykSl.js"])))=>i.map(i=>d[i]);
(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();function _u(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Du={exports:{}},ei={},Ru={exports:{}},X={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Do=Symbol.for("react.element"),gh=Symbol.for("react.portal"),yh=Symbol.for("react.fragment"),vh=Symbol.for("react.strict_mode"),wh=Symbol.for("react.profiler"),xh=Symbol.for("react.provider"),kh=Symbol.for("react.context"),Sh=Symbol.for("react.forward_ref"),Eh=Symbol.for("react.suspense"),Ch=Symbol.for("react.memo"),jh=Symbol.for("react.lazy"),cc=Symbol.iterator;function Th(e){return e===null||typeof e!="object"?null:(e=cc&&e[cc]||e["@@iterator"],typeof e=="function"?e:null)}var Ou={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},$u=Object.assign,Fu={};function Rr(e,n,t){this.props=e,this.context=n,this.refs=Fu,this.updater=t||Ou}Rr.prototype.isReactComponent={};Rr.prototype.setState=function(e,n){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,n,"setState")};Rr.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Bu(){}Bu.prototype=Rr.prototype;function Ja(e,n,t){this.props=e,this.context=n,this.refs=Fu,this.updater=t||Ou}var el=Ja.prototype=new Bu;el.constructor=Ja;$u(el,Rr.prototype);el.isPureReactComponent=!0;var uc=Array.isArray,Vu=Object.prototype.hasOwnProperty,nl={current:null},Wu={key:!0,ref:!0,__self:!0,__source:!0};function Uu(e,n,t){var r,o={},s=null,i=null;if(n!=null)for(r in n.ref!==void 0&&(i=n.ref),n.key!==void 0&&(s=""+n.key),n)Vu.call(n,r)&&!Wu.hasOwnProperty(r)&&(o[r]=n[r]);var a=arguments.length-2;if(a===1)o.children=t;else if(1<a){for(var l=Array(a),d=0;d<a;d++)l[d]=arguments[d+2];o.children=l}if(e&&e.defaultProps)for(r in a=e.defaultProps,a)o[r]===void 0&&(o[r]=a[r]);return{$$typeof:Do,type:e,key:s,ref:i,props:o,_owner:nl.current}}function Mh(e,n){return{$$typeof:Do,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}function tl(e){return typeof e=="object"&&e!==null&&e.$$typeof===Do}function Ph(e){var n={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(t){return n[t]})}var dc=/\/+/g;function wi(e,n){return typeof e=="object"&&e!==null&&e.key!=null?Ph(""+e.key):n.toString(36)}function fs(e,n,t,r,o){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(s){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case Do:case gh:i=!0}}if(i)return i=e,o=o(i),e=r===""?"."+wi(i,0):r,uc(o)?(t="",e!=null&&(t=e.replace(dc,"$&/")+"/"),fs(o,n,t,"",function(d){return d})):o!=null&&(tl(o)&&(o=Mh(o,t+(!o.key||i&&i.key===o.key?"":(""+o.key).replace(dc,"$&/")+"/")+e)),n.push(o)),1;if(i=0,r=r===""?".":r+":",uc(e))for(var a=0;a<e.length;a++){s=e[a];var l=r+wi(s,a);i+=fs(s,n,t,l,o)}else if(l=Th(e),typeof l=="function")for(e=l.call(e),a=0;!(s=e.next()).done;)s=s.value,l=r+wi(s,a++),i+=fs(s,n,t,l,o);else if(s==="object")throw n=String(e),Error("Objects are not valid as a React child (found: "+(n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n)+"). If you meant to render a collection of children, use an array instead.");return i}function Go(e,n,t){if(e==null)return e;var r=[],o=0;return fs(e,r,"","",function(s){return n.call(t,s,o++)}),r}function Nh(e){if(e._status===-1){var n=e._result;n=n(),n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var Je={current:null},hs={transition:null},bh={ReactCurrentDispatcher:Je,ReactCurrentBatchConfig:hs,ReactCurrentOwner:nl};function Hu(){throw Error("act(...) is not supported in production builds of React.")}X.Children={map:Go,forEach:function(e,n,t){Go(e,function(){n.apply(this,arguments)},t)},count:function(e){var n=0;return Go(e,function(){n++}),n},toArray:function(e){return Go(e,function(n){return n})||[]},only:function(e){if(!tl(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};X.Component=Rr;X.Fragment=yh;X.Profiler=wh;X.PureComponent=Ja;X.StrictMode=vh;X.Suspense=Eh;X.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=bh;X.act=Hu;X.cloneElement=function(e,n,t){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=$u({},e.props),o=e.key,s=e.ref,i=e._owner;if(n!=null){if(n.ref!==void 0&&(s=n.ref,i=nl.current),n.key!==void 0&&(o=""+n.key),e.type&&e.type.defaultProps)var a=e.type.defaultProps;for(l in n)Vu.call(n,l)&&!Wu.hasOwnProperty(l)&&(r[l]=n[l]===void 0&&a!==void 0?a[l]:n[l])}var l=arguments.length-2;if(l===1)r.children=t;else if(1<l){a=Array(l);for(var d=0;d<l;d++)a[d]=arguments[d+2];r.children=a}return{$$typeof:Do,type:e.type,key:o,ref:s,props:r,_owner:i}};X.createContext=function(e){return e={$$typeof:kh,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:xh,_context:e},e.Consumer=e};X.createElement=Uu;X.createFactory=function(e){var n=Uu.bind(null,e);return n.type=e,n};X.createRef=function(){return{current:null}};X.forwardRef=function(e){return{$$typeof:Sh,render:e}};X.isValidElement=tl;X.lazy=function(e){return{$$typeof:jh,_payload:{_status:-1,_result:e},_init:Nh}};X.memo=function(e,n){return{$$typeof:Ch,type:e,compare:n===void 0?null:n}};X.startTransition=function(e){var n=hs.transition;hs.transition={};try{e()}finally{hs.transition=n}};X.unstable_act=Hu;X.useCallback=function(e,n){return Je.current.useCallback(e,n)};X.useContext=function(e){return Je.current.useContext(e)};X.useDebugValue=function(){};X.useDeferredValue=function(e){return Je.current.useDeferredValue(e)};X.useEffect=function(e,n){return Je.current.useEffect(e,n)};X.useId=function(){return Je.current.useId()};X.useImperativeHandle=function(e,n,t){return Je.current.useImperativeHandle(e,n,t)};X.useInsertionEffect=function(e,n){return Je.current.useInsertionEffect(e,n)};X.useLayoutEffect=function(e,n){return Je.current.useLayoutEffect(e,n)};X.useMemo=function(e,n){return Je.current.useMemo(e,n)};X.useReducer=function(e,n,t){return Je.current.useReducer(e,n,t)};X.useRef=function(e){return Je.current.useRef(e)};X.useState=function(e){return Je.current.useState(e)};X.useSyncExternalStore=function(e,n,t){return Je.current.useSyncExternalStore(e,n,t)};X.useTransition=function(){return Je.current.useTransition()};X.version="18.3.1";Ru.exports=X;var I=Ru.exports;const uy=_u(I);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ah=I,zh=Symbol.for("react.element"),Lh=Symbol.for("react.fragment"),Ih=Object.prototype.hasOwnProperty,_h=Ah.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Dh={key:!0,ref:!0,__self:!0,__source:!0};function Ku(e,n,t){var r,o={},s=null,i=null;t!==void 0&&(s=""+t),n.key!==void 0&&(s=""+n.key),n.ref!==void 0&&(i=n.ref);for(r in n)Ih.call(n,r)&&!Dh.hasOwnProperty(r)&&(o[r]=n[r]);if(e&&e.defaultProps)for(r in n=e.defaultProps,n)o[r]===void 0&&(o[r]=n[r]);return{$$typeof:zh,type:e,key:s,ref:i,props:o,_owner:_h.current}}ei.Fragment=Lh;ei.jsx=Ku;ei.jsxs=Ku;Du.exports=ei;var c=Du.exports,Zu={exports:{}},gn={},Gu={exports:{}},Qu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function n(L,W){var H=L.length;L.push(W);e:for(;0<H;){var te=H-1>>>1,Se=L[te];if(0<o(Se,W))L[te]=W,L[H]=Se,H=te;else break e}}function t(L){return L.length===0?null:L[0]}function r(L){if(L.length===0)return null;var W=L[0],H=L.pop();if(H!==W){L[0]=H;e:for(var te=0,Se=L.length,Pn=Se>>>1;te<Pn;){var Ge=2*(te+1)-1,Vn=L[Ge],Qe=Ge+1,ce=L[Qe];if(0>o(Vn,H))Qe<Se&&0>o(ce,Vn)?(L[te]=ce,L[Qe]=H,te=Qe):(L[te]=Vn,L[Ge]=H,te=Ge);else if(Qe<Se&&0>o(ce,H))L[te]=ce,L[Qe]=H,te=Qe;else break e}}return W}function o(L,W){var H=L.sortIndex-W.sortIndex;return H!==0?H:L.id-W.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var i=Date,a=i.now();e.unstable_now=function(){return i.now()-a}}var l=[],d=[],h=1,f=null,m=3,k=!1,v=!1,x=!1,_=typeof setTimeout=="function"?setTimeout:null,g=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(L){for(var W=t(d);W!==null;){if(W.callback===null)r(d);else if(W.startTime<=L)r(d),W.sortIndex=W.expirationTime,n(l,W);else break;W=t(d)}}function C(L){if(x=!1,y(L),!v)if(t(l)!==null)v=!0,ze(N);else{var W=t(d);W!==null&&Bn(C,W.startTime-L)}}function N(L,W){v=!1,x&&(x=!1,g(F),F=-1),k=!0;var H=m;try{for(y(W),f=t(l);f!==null&&(!(f.expirationTime>W)||L&&!Ze());){var te=f.callback;if(typeof te=="function"){f.callback=null,m=f.priorityLevel;var Se=te(f.expirationTime<=W);W=e.unstable_now(),typeof Se=="function"?f.callback=Se:f===t(l)&&r(l),y(W)}else r(l);f=t(l)}if(f!==null)var Pn=!0;else{var Ge=t(d);Ge!==null&&Bn(C,Ge.startTime-W),Pn=!1}return Pn}finally{f=null,m=H,k=!1}}var R=!1,z=null,F=-1,le=5,K=-1;function Ze(){return!(e.unstable_now()-K<le)}function cn(){if(z!==null){var L=e.unstable_now();K=L;var W=!0;try{W=z(!0,L)}finally{W?Me():(R=!1,z=null)}}else R=!1}var Me;if(typeof u=="function")Me=function(){u(cn)};else if(typeof MessageChannel<"u"){var Yn=new MessageChannel,ie=Yn.port2;Yn.port1.onmessage=cn,Me=function(){ie.postMessage(null)}}else Me=function(){_(cn,0)};function ze(L){z=L,R||(R=!0,Me())}function Bn(L,W){F=_(function(){L(e.unstable_now())},W)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(L){L.callback=null},e.unstable_continueExecution=function(){v||k||(v=!0,ze(N))},e.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):le=0<L?Math.floor(1e3/L):5},e.unstable_getCurrentPriorityLevel=function(){return m},e.unstable_getFirstCallbackNode=function(){return t(l)},e.unstable_next=function(L){switch(m){case 1:case 2:case 3:var W=3;break;default:W=m}var H=m;m=W;try{return L()}finally{m=H}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(L,W){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var H=m;m=L;try{return W()}finally{m=H}},e.unstable_scheduleCallback=function(L,W,H){var te=e.unstable_now();switch(typeof H=="object"&&H!==null?(H=H.delay,H=typeof H=="number"&&0<H?te+H:te):H=te,L){case 1:var Se=-1;break;case 2:Se=250;break;case 5:Se=1073741823;break;case 4:Se=1e4;break;default:Se=5e3}return Se=H+Se,L={id:h++,callback:W,priorityLevel:L,startTime:H,expirationTime:Se,sortIndex:-1},H>te?(L.sortIndex=H,n(d,L),t(l)===null&&L===t(d)&&(x?(g(F),F=-1):x=!0,Bn(C,H-te))):(L.sortIndex=Se,n(l,L),v||k||(v=!0,ze(N))),L},e.unstable_shouldYield=Ze,e.unstable_wrapCallback=function(L){var W=m;return function(){var H=m;m=W;try{return L.apply(this,arguments)}finally{m=H}}}})(Qu);Gu.exports=Qu;var Rh=Gu.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Oh=I,mn=Rh;function M(e){for(var n="https://reactjs.org/docs/error-decoder.html?invariant="+e,t=1;t<arguments.length;t++)n+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Yu=new Set,go={};function tr(e,n){br(e,n),br(e+"Capture",n)}function br(e,n){for(go[e]=n,e=0;e<n.length;e++)Yu.add(n[e])}var st=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ji=Object.prototype.hasOwnProperty,$h=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,fc={},hc={};function Fh(e){return Ji.call(hc,e)?!0:Ji.call(fc,e)?!1:$h.test(e)?hc[e]=!0:(fc[e]=!0,!1)}function Bh(e,n,t,r){if(t!==null&&t.type===0)return!1;switch(typeof n){case"function":case"symbol":return!0;case"boolean":return r?!1:t!==null?!t.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Vh(e,n,t,r){if(n===null||typeof n>"u"||Bh(e,n,t,r))return!0;if(r)return!1;if(t!==null)switch(t.type){case 3:return!n;case 4:return n===!1;case 5:return isNaN(n);case 6:return isNaN(n)||1>n}return!1}function en(e,n,t,r,o,s,i){this.acceptsBooleans=n===2||n===3||n===4,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=t,this.propertyName=e,this.type=n,this.sanitizeURL=s,this.removeEmptyString=i}var Be={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Be[e]=new en(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var n=e[0];Be[n]=new en(n,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){Be[e]=new en(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){Be[e]=new en(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Be[e]=new en(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){Be[e]=new en(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){Be[e]=new en(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){Be[e]=new en(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){Be[e]=new en(e,5,!1,e.toLowerCase(),null,!1,!1)});var rl=/[\-:]([a-z])/g;function ol(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var n=e.replace(rl,ol);Be[n]=new en(n,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var n=e.replace(rl,ol);Be[n]=new en(n,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var n=e.replace(rl,ol);Be[n]=new en(n,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){Be[e]=new en(e,1,!1,e.toLowerCase(),null,!1,!1)});Be.xlinkHref=new en("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){Be[e]=new en(e,1,!1,e.toLowerCase(),null,!0,!0)});function sl(e,n,t,r){var o=Be.hasOwnProperty(n)?Be[n]:null;(o!==null?o.type!==0:r||!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(Vh(n,t,o,r)&&(t=null),r||o===null?Fh(n)&&(t===null?e.removeAttribute(n):e.setAttribute(n,""+t)):o.mustUseProperty?e[o.propertyName]=t===null?o.type===3?!1:"":t:(n=o.attributeName,r=o.attributeNamespace,t===null?e.removeAttribute(n):(o=o.type,t=o===3||o===4&&t===!0?"":""+t,r?e.setAttributeNS(r,n,t):e.setAttribute(n,t))))}var ut=Oh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Qo=Symbol.for("react.element"),ir=Symbol.for("react.portal"),ar=Symbol.for("react.fragment"),il=Symbol.for("react.strict_mode"),ea=Symbol.for("react.profiler"),Xu=Symbol.for("react.provider"),qu=Symbol.for("react.context"),al=Symbol.for("react.forward_ref"),na=Symbol.for("react.suspense"),ta=Symbol.for("react.suspense_list"),ll=Symbol.for("react.memo"),pt=Symbol.for("react.lazy"),Ju=Symbol.for("react.offscreen"),pc=Symbol.iterator;function Zr(e){return e===null||typeof e!="object"?null:(e=pc&&e[pc]||e["@@iterator"],typeof e=="function"?e:null)}var ke=Object.assign,xi;function to(e){if(xi===void 0)try{throw Error()}catch(t){var n=t.stack.trim().match(/\n( *(at )?)/);xi=n&&n[1]||""}return`
`+xi+e}var ki=!1;function Si(e,n){if(!e||ki)return"";ki=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(n)if(n=function(){throw Error()},Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(n,[])}catch(d){var r=d}Reflect.construct(e,[],n)}else{try{n.call()}catch(d){r=d}e.call(n.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var o=d.stack.split(`
`),s=r.stack.split(`
`),i=o.length-1,a=s.length-1;1<=i&&0<=a&&o[i]!==s[a];)a--;for(;1<=i&&0<=a;i--,a--)if(o[i]!==s[a]){if(i!==1||a!==1)do if(i--,a--,0>a||o[i]!==s[a]){var l=`
`+o[i].replace(" at new "," at ");return e.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",e.displayName)),l}while(1<=i&&0<=a);break}}}finally{ki=!1,Error.prepareStackTrace=t}return(e=e?e.displayName||e.name:"")?to(e):""}function Wh(e){switch(e.tag){case 5:return to(e.type);case 16:return to("Lazy");case 13:return to("Suspense");case 19:return to("SuspenseList");case 0:case 2:case 15:return e=Si(e.type,!1),e;case 11:return e=Si(e.type.render,!1),e;case 1:return e=Si(e.type,!0),e;default:return""}}function ra(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ar:return"Fragment";case ir:return"Portal";case ea:return"Profiler";case il:return"StrictMode";case na:return"Suspense";case ta:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case qu:return(e.displayName||"Context")+".Consumer";case Xu:return(e._context.displayName||"Context")+".Provider";case al:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ll:return n=e.displayName||null,n!==null?n:ra(e.type)||"Memo";case pt:n=e._payload,e=e._init;try{return ra(e(n))}catch{}}return null}function Uh(e){var n=e.type;switch(e.tag){case 24:return"Cache";case 9:return(n.displayName||"Context")+".Consumer";case 10:return(n._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=n.render,e=e.displayName||e.name||"",n.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return n;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ra(n);case 8:return n===il?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n}return null}function Nt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ed(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Hh(e){var n=ed(e)?"checked":"value",t=Object.getOwnPropertyDescriptor(e.constructor.prototype,n),r=""+e[n];if(!e.hasOwnProperty(n)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var o=t.get,s=t.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return o.call(this)},set:function(i){r=""+i,s.call(this,i)}}),Object.defineProperty(e,n,{enumerable:t.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function Yo(e){e._valueTracker||(e._valueTracker=Hh(e))}function nd(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var t=n.getValue(),r="";return e&&(r=ed(e)?e.checked?"true":"false":e.value),e=r,e!==t?(n.setValue(e),!0):!1}function Ts(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function oa(e,n){var t=n.checked;return ke({},n,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??e._wrapperState.initialChecked})}function mc(e,n){var t=n.defaultValue==null?"":n.defaultValue,r=n.checked!=null?n.checked:n.defaultChecked;t=Nt(n.value!=null?n.value:t),e._wrapperState={initialChecked:r,initialValue:t,controlled:n.type==="checkbox"||n.type==="radio"?n.checked!=null:n.value!=null}}function td(e,n){n=n.checked,n!=null&&sl(e,"checked",n,!1)}function sa(e,n){td(e,n);var t=Nt(n.value),r=n.type;if(t!=null)r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+t):e.value!==""+t&&(e.value=""+t);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}n.hasOwnProperty("value")?ia(e,n.type,t):n.hasOwnProperty("defaultValue")&&ia(e,n.type,Nt(n.defaultValue)),n.checked==null&&n.defaultChecked!=null&&(e.defaultChecked=!!n.defaultChecked)}function gc(e,n,t){if(n.hasOwnProperty("value")||n.hasOwnProperty("defaultValue")){var r=n.type;if(!(r!=="submit"&&r!=="reset"||n.value!==void 0&&n.value!==null))return;n=""+e._wrapperState.initialValue,t||n===e.value||(e.value=n),e.defaultValue=n}t=e.name,t!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,t!==""&&(e.name=t)}function ia(e,n,t){(n!=="number"||Ts(e.ownerDocument)!==e)&&(t==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+t&&(e.defaultValue=""+t))}var ro=Array.isArray;function Sr(e,n,t,r){if(e=e.options,n){n={};for(var o=0;o<t.length;o++)n["$"+t[o]]=!0;for(t=0;t<e.length;t++)o=n.hasOwnProperty("$"+e[t].value),e[t].selected!==o&&(e[t].selected=o),o&&r&&(e[t].defaultSelected=!0)}else{for(t=""+Nt(t),n=null,o=0;o<e.length;o++){if(e[o].value===t){e[o].selected=!0,r&&(e[o].defaultSelected=!0);return}n!==null||e[o].disabled||(n=e[o])}n!==null&&(n.selected=!0)}}function aa(e,n){if(n.dangerouslySetInnerHTML!=null)throw Error(M(91));return ke({},n,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function yc(e,n){var t=n.value;if(t==null){if(t=n.children,n=n.defaultValue,t!=null){if(n!=null)throw Error(M(92));if(ro(t)){if(1<t.length)throw Error(M(93));t=t[0]}n=t}n==null&&(n=""),t=n}e._wrapperState={initialValue:Nt(t)}}function rd(e,n){var t=Nt(n.value),r=Nt(n.defaultValue);t!=null&&(t=""+t,t!==e.value&&(e.value=t),n.defaultValue==null&&e.defaultValue!==t&&(e.defaultValue=t)),r!=null&&(e.defaultValue=""+r)}function vc(e){var n=e.textContent;n===e._wrapperState.initialValue&&n!==""&&n!==null&&(e.value=n)}function od(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function la(e,n){return e==null||e==="http://www.w3.org/1999/xhtml"?od(n):e==="http://www.w3.org/2000/svg"&&n==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Xo,sd=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(n,t,r,o){MSApp.execUnsafeLocalFunction(function(){return e(n,t,r,o)})}:e}(function(e,n){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=n;else{for(Xo=Xo||document.createElement("div"),Xo.innerHTML="<svg>"+n.valueOf().toString()+"</svg>",n=Xo.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;n.firstChild;)e.appendChild(n.firstChild)}});function yo(e,n){if(n){var t=e.firstChild;if(t&&t===e.lastChild&&t.nodeType===3){t.nodeValue=n;return}}e.textContent=n}var io={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Kh=["Webkit","ms","Moz","O"];Object.keys(io).forEach(function(e){Kh.forEach(function(n){n=n+e.charAt(0).toUpperCase()+e.substring(1),io[n]=io[e]})});function id(e,n,t){return n==null||typeof n=="boolean"||n===""?"":t||typeof n!="number"||n===0||io.hasOwnProperty(e)&&io[e]?(""+n).trim():n+"px"}function ad(e,n){e=e.style;for(var t in n)if(n.hasOwnProperty(t)){var r=t.indexOf("--")===0,o=id(t,n[t],r);t==="float"&&(t="cssFloat"),r?e.setProperty(t,o):e[t]=o}}var Zh=ke({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ca(e,n){if(n){if(Zh[e]&&(n.children!=null||n.dangerouslySetInnerHTML!=null))throw Error(M(137,e));if(n.dangerouslySetInnerHTML!=null){if(n.children!=null)throw Error(M(60));if(typeof n.dangerouslySetInnerHTML!="object"||!("__html"in n.dangerouslySetInnerHTML))throw Error(M(61))}if(n.style!=null&&typeof n.style!="object")throw Error(M(62))}}function ua(e,n){if(e.indexOf("-")===-1)return typeof n.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var da=null;function cl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var fa=null,Er=null,Cr=null;function wc(e){if(e=$o(e)){if(typeof fa!="function")throw Error(M(280));var n=e.stateNode;n&&(n=si(n),fa(e.stateNode,e.type,n))}}function ld(e){Er?Cr?Cr.push(e):Cr=[e]:Er=e}function cd(){if(Er){var e=Er,n=Cr;if(Cr=Er=null,wc(e),n)for(e=0;e<n.length;e++)wc(n[e])}}function ud(e,n){return e(n)}function dd(){}var Ei=!1;function fd(e,n,t){if(Ei)return e(n,t);Ei=!0;try{return ud(e,n,t)}finally{Ei=!1,(Er!==null||Cr!==null)&&(dd(),cd())}}function vo(e,n){var t=e.stateNode;if(t===null)return null;var r=si(t);if(r===null)return null;t=r[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(t&&typeof t!="function")throw Error(M(231,n,typeof t));return t}var ha=!1;if(st)try{var Gr={};Object.defineProperty(Gr,"passive",{get:function(){ha=!0}}),window.addEventListener("test",Gr,Gr),window.removeEventListener("test",Gr,Gr)}catch{ha=!1}function Gh(e,n,t,r,o,s,i,a,l){var d=Array.prototype.slice.call(arguments,3);try{n.apply(t,d)}catch(h){this.onError(h)}}var ao=!1,Ms=null,Ps=!1,pa=null,Qh={onError:function(e){ao=!0,Ms=e}};function Yh(e,n,t,r,o,s,i,a,l){ao=!1,Ms=null,Gh.apply(Qh,arguments)}function Xh(e,n,t,r,o,s,i,a,l){if(Yh.apply(this,arguments),ao){if(ao){var d=Ms;ao=!1,Ms=null}else throw Error(M(198));Ps||(Ps=!0,pa=d)}}function rr(e){var n=e,t=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,n.flags&4098&&(t=n.return),e=n.return;while(e)}return n.tag===3?t:null}function hd(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function xc(e){if(rr(e)!==e)throw Error(M(188))}function qh(e){var n=e.alternate;if(!n){if(n=rr(e),n===null)throw Error(M(188));return n!==e?null:e}for(var t=e,r=n;;){var o=t.return;if(o===null)break;var s=o.alternate;if(s===null){if(r=o.return,r!==null){t=r;continue}break}if(o.child===s.child){for(s=o.child;s;){if(s===t)return xc(o),e;if(s===r)return xc(o),n;s=s.sibling}throw Error(M(188))}if(t.return!==r.return)t=o,r=s;else{for(var i=!1,a=o.child;a;){if(a===t){i=!0,t=o,r=s;break}if(a===r){i=!0,r=o,t=s;break}a=a.sibling}if(!i){for(a=s.child;a;){if(a===t){i=!0,t=s,r=o;break}if(a===r){i=!0,r=s,t=o;break}a=a.sibling}if(!i)throw Error(M(189))}}if(t.alternate!==r)throw Error(M(190))}if(t.tag!==3)throw Error(M(188));return t.stateNode.current===t?e:n}function pd(e){return e=qh(e),e!==null?md(e):null}function md(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var n=md(e);if(n!==null)return n;e=e.sibling}return null}var gd=mn.unstable_scheduleCallback,kc=mn.unstable_cancelCallback,Jh=mn.unstable_shouldYield,ep=mn.unstable_requestPaint,je=mn.unstable_now,np=mn.unstable_getCurrentPriorityLevel,ul=mn.unstable_ImmediatePriority,yd=mn.unstable_UserBlockingPriority,Ns=mn.unstable_NormalPriority,tp=mn.unstable_LowPriority,vd=mn.unstable_IdlePriority,ni=null,Gn=null;function rp(e){if(Gn&&typeof Gn.onCommitFiberRoot=="function")try{Gn.onCommitFiberRoot(ni,e,void 0,(e.current.flags&128)===128)}catch{}}var Rn=Math.clz32?Math.clz32:ip,op=Math.log,sp=Math.LN2;function ip(e){return e>>>=0,e===0?32:31-(op(e)/sp|0)|0}var qo=64,Jo=4194304;function oo(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function bs(e,n){var t=e.pendingLanes;if(t===0)return 0;var r=0,o=e.suspendedLanes,s=e.pingedLanes,i=t&268435455;if(i!==0){var a=i&~o;a!==0?r=oo(a):(s&=i,s!==0&&(r=oo(s)))}else i=t&~o,i!==0?r=oo(i):s!==0&&(r=oo(s));if(r===0)return 0;if(n!==0&&n!==r&&!(n&o)&&(o=r&-r,s=n&-n,o>=s||o===16&&(s&4194240)!==0))return n;if(r&4&&(r|=t&16),n=e.entangledLanes,n!==0)for(e=e.entanglements,n&=r;0<n;)t=31-Rn(n),o=1<<t,r|=e[t],n&=~o;return r}function ap(e,n){switch(e){case 1:case 2:case 4:return n+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function lp(e,n){for(var t=e.suspendedLanes,r=e.pingedLanes,o=e.expirationTimes,s=e.pendingLanes;0<s;){var i=31-Rn(s),a=1<<i,l=o[i];l===-1?(!(a&t)||a&r)&&(o[i]=ap(a,n)):l<=n&&(e.expiredLanes|=a),s&=~a}}function ma(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function wd(){var e=qo;return qo<<=1,!(qo&4194240)&&(qo=64),e}function Ci(e){for(var n=[],t=0;31>t;t++)n.push(e);return n}function Ro(e,n,t){e.pendingLanes|=n,n!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,n=31-Rn(n),e[n]=t}function cp(e,n){var t=e.pendingLanes&~n;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=n,e.mutableReadLanes&=n,e.entangledLanes&=n,n=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<t;){var o=31-Rn(t),s=1<<o;n[o]=0,r[o]=-1,e[o]=-1,t&=~s}}function dl(e,n){var t=e.entangledLanes|=n;for(e=e.entanglements;t;){var r=31-Rn(t),o=1<<r;o&n|e[r]&n&&(e[r]|=n),t&=~o}}var ae=0;function xd(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var kd,fl,Sd,Ed,Cd,ga=!1,es=[],kt=null,St=null,Et=null,wo=new Map,xo=new Map,gt=[],up="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Sc(e,n){switch(e){case"focusin":case"focusout":kt=null;break;case"dragenter":case"dragleave":St=null;break;case"mouseover":case"mouseout":Et=null;break;case"pointerover":case"pointerout":wo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":xo.delete(n.pointerId)}}function Qr(e,n,t,r,o,s){return e===null||e.nativeEvent!==s?(e={blockedOn:n,domEventName:t,eventSystemFlags:r,nativeEvent:s,targetContainers:[o]},n!==null&&(n=$o(n),n!==null&&fl(n)),e):(e.eventSystemFlags|=r,n=e.targetContainers,o!==null&&n.indexOf(o)===-1&&n.push(o),e)}function dp(e,n,t,r,o){switch(n){case"focusin":return kt=Qr(kt,e,n,t,r,o),!0;case"dragenter":return St=Qr(St,e,n,t,r,o),!0;case"mouseover":return Et=Qr(Et,e,n,t,r,o),!0;case"pointerover":var s=o.pointerId;return wo.set(s,Qr(wo.get(s)||null,e,n,t,r,o)),!0;case"gotpointercapture":return s=o.pointerId,xo.set(s,Qr(xo.get(s)||null,e,n,t,r,o)),!0}return!1}function jd(e){var n=Wt(e.target);if(n!==null){var t=rr(n);if(t!==null){if(n=t.tag,n===13){if(n=hd(t),n!==null){e.blockedOn=n,Cd(e.priority,function(){Sd(t)});return}}else if(n===3&&t.stateNode.current.memoizedState.isDehydrated){e.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ps(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var t=ya(e.domEventName,e.eventSystemFlags,n[0],e.nativeEvent);if(t===null){t=e.nativeEvent;var r=new t.constructor(t.type,t);da=r,t.target.dispatchEvent(r),da=null}else return n=$o(t),n!==null&&fl(n),e.blockedOn=t,!1;n.shift()}return!0}function Ec(e,n,t){ps(e)&&t.delete(n)}function fp(){ga=!1,kt!==null&&ps(kt)&&(kt=null),St!==null&&ps(St)&&(St=null),Et!==null&&ps(Et)&&(Et=null),wo.forEach(Ec),xo.forEach(Ec)}function Yr(e,n){e.blockedOn===n&&(e.blockedOn=null,ga||(ga=!0,mn.unstable_scheduleCallback(mn.unstable_NormalPriority,fp)))}function ko(e){function n(o){return Yr(o,e)}if(0<es.length){Yr(es[0],e);for(var t=1;t<es.length;t++){var r=es[t];r.blockedOn===e&&(r.blockedOn=null)}}for(kt!==null&&Yr(kt,e),St!==null&&Yr(St,e),Et!==null&&Yr(Et,e),wo.forEach(n),xo.forEach(n),t=0;t<gt.length;t++)r=gt[t],r.blockedOn===e&&(r.blockedOn=null);for(;0<gt.length&&(t=gt[0],t.blockedOn===null);)jd(t),t.blockedOn===null&&gt.shift()}var jr=ut.ReactCurrentBatchConfig,As=!0;function hp(e,n,t,r){var o=ae,s=jr.transition;jr.transition=null;try{ae=1,hl(e,n,t,r)}finally{ae=o,jr.transition=s}}function pp(e,n,t,r){var o=ae,s=jr.transition;jr.transition=null;try{ae=4,hl(e,n,t,r)}finally{ae=o,jr.transition=s}}function hl(e,n,t,r){if(As){var o=ya(e,n,t,r);if(o===null)Ii(e,n,r,zs,t),Sc(e,r);else if(dp(o,e,n,t,r))r.stopPropagation();else if(Sc(e,r),n&4&&-1<up.indexOf(e)){for(;o!==null;){var s=$o(o);if(s!==null&&kd(s),s=ya(e,n,t,r),s===null&&Ii(e,n,r,zs,t),s===o)break;o=s}o!==null&&r.stopPropagation()}else Ii(e,n,r,null,t)}}var zs=null;function ya(e,n,t,r){if(zs=null,e=cl(r),e=Wt(e),e!==null)if(n=rr(e),n===null)e=null;else if(t=n.tag,t===13){if(e=hd(n),e!==null)return e;e=null}else if(t===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null);return zs=e,null}function Td(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(np()){case ul:return 1;case yd:return 4;case Ns:case tp:return 16;case vd:return 536870912;default:return 16}default:return 16}}var vt=null,pl=null,ms=null;function Md(){if(ms)return ms;var e,n=pl,t=n.length,r,o="value"in vt?vt.value:vt.textContent,s=o.length;for(e=0;e<t&&n[e]===o[e];e++);var i=t-e;for(r=1;r<=i&&n[t-r]===o[s-r];r++);return ms=o.slice(e,1<r?1-r:void 0)}function gs(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function ns(){return!0}function Cc(){return!1}function yn(e){function n(t,r,o,s,i){this._reactName=t,this._targetInst=o,this.type=r,this.nativeEvent=s,this.target=i,this.currentTarget=null;for(var a in e)e.hasOwnProperty(a)&&(t=e[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ns:Cc,this.isPropagationStopped=Cc,this}return ke(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=ns)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=ns)},persist:function(){},isPersistent:ns}),n}var Or={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ml=yn(Or),Oo=ke({},Or,{view:0,detail:0}),mp=yn(Oo),ji,Ti,Xr,ti=ke({},Oo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:gl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Xr&&(Xr&&e.type==="mousemove"?(ji=e.screenX-Xr.screenX,Ti=e.screenY-Xr.screenY):Ti=ji=0,Xr=e),ji)},movementY:function(e){return"movementY"in e?e.movementY:Ti}}),jc=yn(ti),gp=ke({},ti,{dataTransfer:0}),yp=yn(gp),vp=ke({},Oo,{relatedTarget:0}),Mi=yn(vp),wp=ke({},Or,{animationName:0,elapsedTime:0,pseudoElement:0}),xp=yn(wp),kp=ke({},Or,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Sp=yn(kp),Ep=ke({},Or,{data:0}),Tc=yn(Ep),Cp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},jp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Tp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Mp(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=Tp[e])?!!n[e]:!1}function gl(){return Mp}var Pp=ke({},Oo,{key:function(e){if(e.key){var n=Cp[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=gs(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?jp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:gl,charCode:function(e){return e.type==="keypress"?gs(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?gs(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Np=yn(Pp),bp=ke({},ti,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Mc=yn(bp),Ap=ke({},Oo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:gl}),zp=yn(Ap),Lp=ke({},Or,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ip=yn(Lp),_p=ke({},ti,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Dp=yn(_p),Rp=[9,13,27,32],yl=st&&"CompositionEvent"in window,lo=null;st&&"documentMode"in document&&(lo=document.documentMode);var Op=st&&"TextEvent"in window&&!lo,Pd=st&&(!yl||lo&&8<lo&&11>=lo),Pc=" ",Nc=!1;function Nd(e,n){switch(e){case"keyup":return Rp.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function bd(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var lr=!1;function $p(e,n){switch(e){case"compositionend":return bd(n);case"keypress":return n.which!==32?null:(Nc=!0,Pc);case"textInput":return e=n.data,e===Pc&&Nc?null:e;default:return null}}function Fp(e,n){if(lr)return e==="compositionend"||!yl&&Nd(e,n)?(e=Md(),ms=pl=vt=null,lr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Pd&&n.locale!=="ko"?null:n.data;default:return null}}var Bp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function bc(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!Bp[e.type]:n==="textarea"}function Ad(e,n,t,r){ld(r),n=Ls(n,"onChange"),0<n.length&&(t=new ml("onChange","change",null,t,r),e.push({event:t,listeners:n}))}var co=null,So=null;function Vp(e){Vd(e,0)}function ri(e){var n=dr(e);if(nd(n))return e}function Wp(e,n){if(e==="change")return n}var zd=!1;if(st){var Pi;if(st){var Ni="oninput"in document;if(!Ni){var Ac=document.createElement("div");Ac.setAttribute("oninput","return;"),Ni=typeof Ac.oninput=="function"}Pi=Ni}else Pi=!1;zd=Pi&&(!document.documentMode||9<document.documentMode)}function zc(){co&&(co.detachEvent("onpropertychange",Ld),So=co=null)}function Ld(e){if(e.propertyName==="value"&&ri(So)){var n=[];Ad(n,So,e,cl(e)),fd(Vp,n)}}function Up(e,n,t){e==="focusin"?(zc(),co=n,So=t,co.attachEvent("onpropertychange",Ld)):e==="focusout"&&zc()}function Hp(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ri(So)}function Kp(e,n){if(e==="click")return ri(n)}function Zp(e,n){if(e==="input"||e==="change")return ri(n)}function Gp(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var Fn=typeof Object.is=="function"?Object.is:Gp;function Eo(e,n){if(Fn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var t=Object.keys(e),r=Object.keys(n);if(t.length!==r.length)return!1;for(r=0;r<t.length;r++){var o=t[r];if(!Ji.call(n,o)||!Fn(e[o],n[o]))return!1}return!0}function Lc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ic(e,n){var t=Lc(e);e=0;for(var r;t;){if(t.nodeType===3){if(r=e+t.textContent.length,e<=n&&r>=n)return{node:t,offset:n-e};e=r}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Lc(t)}}function Id(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?Id(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function _d(){for(var e=window,n=Ts();n instanceof e.HTMLIFrameElement;){try{var t=typeof n.contentWindow.location.href=="string"}catch{t=!1}if(t)e=n.contentWindow;else break;n=Ts(e.document)}return n}function vl(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}function Qp(e){var n=_d(),t=e.focusedElem,r=e.selectionRange;if(n!==t&&t&&t.ownerDocument&&Id(t.ownerDocument.documentElement,t)){if(r!==null&&vl(t)){if(n=r.start,e=r.end,e===void 0&&(e=n),"selectionStart"in t)t.selectionStart=n,t.selectionEnd=Math.min(e,t.value.length);else if(e=(n=t.ownerDocument||document)&&n.defaultView||window,e.getSelection){e=e.getSelection();var o=t.textContent.length,s=Math.min(r.start,o);r=r.end===void 0?s:Math.min(r.end,o),!e.extend&&s>r&&(o=r,r=s,s=o),o=Ic(t,s);var i=Ic(t,r);o&&i&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(n=n.createRange(),n.setStart(o.node,o.offset),e.removeAllRanges(),s>r?(e.addRange(n),e.extend(i.node,i.offset)):(n.setEnd(i.node,i.offset),e.addRange(n)))}}for(n=[],e=t;e=e.parentNode;)e.nodeType===1&&n.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<n.length;t++)e=n[t],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Yp=st&&"documentMode"in document&&11>=document.documentMode,cr=null,va=null,uo=null,wa=!1;function _c(e,n,t){var r=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;wa||cr==null||cr!==Ts(r)||(r=cr,"selectionStart"in r&&vl(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),uo&&Eo(uo,r)||(uo=r,r=Ls(va,"onSelect"),0<r.length&&(n=new ml("onSelect","select",null,n,t),e.push({event:n,listeners:r}),n.target=cr)))}function ts(e,n){var t={};return t[e.toLowerCase()]=n.toLowerCase(),t["Webkit"+e]="webkit"+n,t["Moz"+e]="moz"+n,t}var ur={animationend:ts("Animation","AnimationEnd"),animationiteration:ts("Animation","AnimationIteration"),animationstart:ts("Animation","AnimationStart"),transitionend:ts("Transition","TransitionEnd")},bi={},Dd={};st&&(Dd=document.createElement("div").style,"AnimationEvent"in window||(delete ur.animationend.animation,delete ur.animationiteration.animation,delete ur.animationstart.animation),"TransitionEvent"in window||delete ur.transitionend.transition);function oi(e){if(bi[e])return bi[e];if(!ur[e])return e;var n=ur[e],t;for(t in n)if(n.hasOwnProperty(t)&&t in Dd)return bi[e]=n[t];return e}var Rd=oi("animationend"),Od=oi("animationiteration"),$d=oi("animationstart"),Fd=oi("transitionend"),Bd=new Map,Dc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function zt(e,n){Bd.set(e,n),tr(n,[e])}for(var Ai=0;Ai<Dc.length;Ai++){var zi=Dc[Ai],Xp=zi.toLowerCase(),qp=zi[0].toUpperCase()+zi.slice(1);zt(Xp,"on"+qp)}zt(Rd,"onAnimationEnd");zt(Od,"onAnimationIteration");zt($d,"onAnimationStart");zt("dblclick","onDoubleClick");zt("focusin","onFocus");zt("focusout","onBlur");zt(Fd,"onTransitionEnd");br("onMouseEnter",["mouseout","mouseover"]);br("onMouseLeave",["mouseout","mouseover"]);br("onPointerEnter",["pointerout","pointerover"]);br("onPointerLeave",["pointerout","pointerover"]);tr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));tr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));tr("onBeforeInput",["compositionend","keypress","textInput","paste"]);tr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));tr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));tr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var so="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Jp=new Set("cancel close invalid load scroll toggle".split(" ").concat(so));function Rc(e,n,t){var r=e.type||"unknown-event";e.currentTarget=t,Xh(r,n,void 0,e),e.currentTarget=null}function Vd(e,n){n=(n&4)!==0;for(var t=0;t<e.length;t++){var r=e[t],o=r.event;r=r.listeners;e:{var s=void 0;if(n)for(var i=r.length-1;0<=i;i--){var a=r[i],l=a.instance,d=a.currentTarget;if(a=a.listener,l!==s&&o.isPropagationStopped())break e;Rc(o,a,d),s=l}else for(i=0;i<r.length;i++){if(a=r[i],l=a.instance,d=a.currentTarget,a=a.listener,l!==s&&o.isPropagationStopped())break e;Rc(o,a,d),s=l}}}if(Ps)throw e=pa,Ps=!1,pa=null,e}function pe(e,n){var t=n[Ca];t===void 0&&(t=n[Ca]=new Set);var r=e+"__bubble";t.has(r)||(Wd(n,e,2,!1),t.add(r))}function Li(e,n,t){var r=0;n&&(r|=4),Wd(t,e,r,n)}var rs="_reactListening"+Math.random().toString(36).slice(2);function Co(e){if(!e[rs]){e[rs]=!0,Yu.forEach(function(t){t!=="selectionchange"&&(Jp.has(t)||Li(t,!1,e),Li(t,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[rs]||(n[rs]=!0,Li("selectionchange",!1,n))}}function Wd(e,n,t,r){switch(Td(n)){case 1:var o=hp;break;case 4:o=pp;break;default:o=hl}t=o.bind(null,n,t,e),o=void 0,!ha||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(o=!0),r?o!==void 0?e.addEventListener(n,t,{capture:!0,passive:o}):e.addEventListener(n,t,!0):o!==void 0?e.addEventListener(n,t,{passive:o}):e.addEventListener(n,t,!1)}function Ii(e,n,t,r,o){var s=r;if(!(n&1)&&!(n&2)&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var a=r.stateNode.containerInfo;if(a===o||a.nodeType===8&&a.parentNode===o)break;if(i===4)for(i=r.return;i!==null;){var l=i.tag;if((l===3||l===4)&&(l=i.stateNode.containerInfo,l===o||l.nodeType===8&&l.parentNode===o))return;i=i.return}for(;a!==null;){if(i=Wt(a),i===null)return;if(l=i.tag,l===5||l===6){r=s=i;continue e}a=a.parentNode}}r=r.return}fd(function(){var d=s,h=cl(t),f=[];e:{var m=Bd.get(e);if(m!==void 0){var k=ml,v=e;switch(e){case"keypress":if(gs(t)===0)break e;case"keydown":case"keyup":k=Np;break;case"focusin":v="focus",k=Mi;break;case"focusout":v="blur",k=Mi;break;case"beforeblur":case"afterblur":k=Mi;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=jc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=yp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=zp;break;case Rd:case Od:case $d:k=xp;break;case Fd:k=Ip;break;case"scroll":k=mp;break;case"wheel":k=Dp;break;case"copy":case"cut":case"paste":k=Sp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=Mc}var x=(n&4)!==0,_=!x&&e==="scroll",g=x?m!==null?m+"Capture":null:m;x=[];for(var u=d,y;u!==null;){y=u;var C=y.stateNode;if(y.tag===5&&C!==null&&(y=C,g!==null&&(C=vo(u,g),C!=null&&x.push(jo(u,C,y)))),_)break;u=u.return}0<x.length&&(m=new k(m,v,null,t,h),f.push({event:m,listeners:x}))}}if(!(n&7)){e:{if(m=e==="mouseover"||e==="pointerover",k=e==="mouseout"||e==="pointerout",m&&t!==da&&(v=t.relatedTarget||t.fromElement)&&(Wt(v)||v[it]))break e;if((k||m)&&(m=h.window===h?h:(m=h.ownerDocument)?m.defaultView||m.parentWindow:window,k?(v=t.relatedTarget||t.toElement,k=d,v=v?Wt(v):null,v!==null&&(_=rr(v),v!==_||v.tag!==5&&v.tag!==6)&&(v=null)):(k=null,v=d),k!==v)){if(x=jc,C="onMouseLeave",g="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(x=Mc,C="onPointerLeave",g="onPointerEnter",u="pointer"),_=k==null?m:dr(k),y=v==null?m:dr(v),m=new x(C,u+"leave",k,t,h),m.target=_,m.relatedTarget=y,C=null,Wt(h)===d&&(x=new x(g,u+"enter",v,t,h),x.target=y,x.relatedTarget=_,C=x),_=C,k&&v)n:{for(x=k,g=v,u=0,y=x;y;y=sr(y))u++;for(y=0,C=g;C;C=sr(C))y++;for(;0<u-y;)x=sr(x),u--;for(;0<y-u;)g=sr(g),y--;for(;u--;){if(x===g||g!==null&&x===g.alternate)break n;x=sr(x),g=sr(g)}x=null}else x=null;k!==null&&Oc(f,m,k,x,!1),v!==null&&_!==null&&Oc(f,_,v,x,!0)}}e:{if(m=d?dr(d):window,k=m.nodeName&&m.nodeName.toLowerCase(),k==="select"||k==="input"&&m.type==="file")var N=Wp;else if(bc(m))if(zd)N=Zp;else{N=Hp;var R=Up}else(k=m.nodeName)&&k.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(N=Kp);if(N&&(N=N(e,d))){Ad(f,N,t,h);break e}R&&R(e,m,d),e==="focusout"&&(R=m._wrapperState)&&R.controlled&&m.type==="number"&&ia(m,"number",m.value)}switch(R=d?dr(d):window,e){case"focusin":(bc(R)||R.contentEditable==="true")&&(cr=R,va=d,uo=null);break;case"focusout":uo=va=cr=null;break;case"mousedown":wa=!0;break;case"contextmenu":case"mouseup":case"dragend":wa=!1,_c(f,t,h);break;case"selectionchange":if(Yp)break;case"keydown":case"keyup":_c(f,t,h)}var z;if(yl)e:{switch(e){case"compositionstart":var F="onCompositionStart";break e;case"compositionend":F="onCompositionEnd";break e;case"compositionupdate":F="onCompositionUpdate";break e}F=void 0}else lr?Nd(e,t)&&(F="onCompositionEnd"):e==="keydown"&&t.keyCode===229&&(F="onCompositionStart");F&&(Pd&&t.locale!=="ko"&&(lr||F!=="onCompositionStart"?F==="onCompositionEnd"&&lr&&(z=Md()):(vt=h,pl="value"in vt?vt.value:vt.textContent,lr=!0)),R=Ls(d,F),0<R.length&&(F=new Tc(F,e,null,t,h),f.push({event:F,listeners:R}),z?F.data=z:(z=bd(t),z!==null&&(F.data=z)))),(z=Op?$p(e,t):Fp(e,t))&&(d=Ls(d,"onBeforeInput"),0<d.length&&(h=new Tc("onBeforeInput","beforeinput",null,t,h),f.push({event:h,listeners:d}),h.data=z))}Vd(f,n)})}function jo(e,n,t){return{instance:e,listener:n,currentTarget:t}}function Ls(e,n){for(var t=n+"Capture",r=[];e!==null;){var o=e,s=o.stateNode;o.tag===5&&s!==null&&(o=s,s=vo(e,t),s!=null&&r.unshift(jo(e,s,o)),s=vo(e,n),s!=null&&r.push(jo(e,s,o))),e=e.return}return r}function sr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Oc(e,n,t,r,o){for(var s=n._reactName,i=[];t!==null&&t!==r;){var a=t,l=a.alternate,d=a.stateNode;if(l!==null&&l===r)break;a.tag===5&&d!==null&&(a=d,o?(l=vo(t,s),l!=null&&i.unshift(jo(t,l,a))):o||(l=vo(t,s),l!=null&&i.push(jo(t,l,a)))),t=t.return}i.length!==0&&e.push({event:n,listeners:i})}var em=/\r\n?/g,nm=/\u0000|\uFFFD/g;function $c(e){return(typeof e=="string"?e:""+e).replace(em,`
`).replace(nm,"")}function os(e,n,t){if(n=$c(n),$c(e)!==n&&t)throw Error(M(425))}function Is(){}var xa=null,ka=null;function Sa(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Ea=typeof setTimeout=="function"?setTimeout:void 0,tm=typeof clearTimeout=="function"?clearTimeout:void 0,Fc=typeof Promise=="function"?Promise:void 0,rm=typeof queueMicrotask=="function"?queueMicrotask:typeof Fc<"u"?function(e){return Fc.resolve(null).then(e).catch(om)}:Ea;function om(e){setTimeout(function(){throw e})}function _i(e,n){var t=n,r=0;do{var o=t.nextSibling;if(e.removeChild(t),o&&o.nodeType===8)if(t=o.data,t==="/$"){if(r===0){e.removeChild(o),ko(n);return}r--}else t!=="$"&&t!=="$?"&&t!=="$!"||r++;t=o}while(t);ko(n)}function Ct(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?")break;if(n==="/$")return null}}return e}function Bc(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="$"||t==="$!"||t==="$?"){if(n===0)return e;n--}else t==="/$"&&n++}e=e.previousSibling}return null}var $r=Math.random().toString(36).slice(2),Kn="__reactFiber$"+$r,To="__reactProps$"+$r,it="__reactContainer$"+$r,Ca="__reactEvents$"+$r,sm="__reactListeners$"+$r,im="__reactHandles$"+$r;function Wt(e){var n=e[Kn];if(n)return n;for(var t=e.parentNode;t;){if(n=t[it]||t[Kn]){if(t=n.alternate,n.child!==null||t!==null&&t.child!==null)for(e=Bc(e);e!==null;){if(t=e[Kn])return t;e=Bc(e)}return n}e=t,t=e.parentNode}return null}function $o(e){return e=e[Kn]||e[it],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function dr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(M(33))}function si(e){return e[To]||null}var ja=[],fr=-1;function Lt(e){return{current:e}}function me(e){0>fr||(e.current=ja[fr],ja[fr]=null,fr--)}function he(e,n){fr++,ja[fr]=e.current,e.current=n}var bt={},Ke=Lt(bt),sn=Lt(!1),Yt=bt;function Ar(e,n){var t=e.type.contextTypes;if(!t)return bt;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===n)return r.__reactInternalMemoizedMaskedChildContext;var o={},s;for(s in t)o[s]=n[s];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=n,e.__reactInternalMemoizedMaskedChildContext=o),o}function an(e){return e=e.childContextTypes,e!=null}function _s(){me(sn),me(Ke)}function Vc(e,n,t){if(Ke.current!==bt)throw Error(M(168));he(Ke,n),he(sn,t)}function Ud(e,n,t){var r=e.stateNode;if(n=n.childContextTypes,typeof r.getChildContext!="function")return t;r=r.getChildContext();for(var o in r)if(!(o in n))throw Error(M(108,Uh(e)||"Unknown",o));return ke({},t,r)}function Ds(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||bt,Yt=Ke.current,he(Ke,e),he(sn,sn.current),!0}function Wc(e,n,t){var r=e.stateNode;if(!r)throw Error(M(169));t?(e=Ud(e,n,Yt),r.__reactInternalMemoizedMergedChildContext=e,me(sn),me(Ke),he(Ke,e)):me(sn),he(sn,t)}var nt=null,ii=!1,Di=!1;function Hd(e){nt===null?nt=[e]:nt.push(e)}function am(e){ii=!0,Hd(e)}function It(){if(!Di&&nt!==null){Di=!0;var e=0,n=ae;try{var t=nt;for(ae=1;e<t.length;e++){var r=t[e];do r=r(!0);while(r!==null)}nt=null,ii=!1}catch(o){throw nt!==null&&(nt=nt.slice(e+1)),gd(ul,It),o}finally{ae=n,Di=!1}}return null}var hr=[],pr=0,Rs=null,Os=0,xn=[],kn=0,Xt=null,tt=1,rt="";function $t(e,n){hr[pr++]=Os,hr[pr++]=Rs,Rs=e,Os=n}function Kd(e,n,t){xn[kn++]=tt,xn[kn++]=rt,xn[kn++]=Xt,Xt=e;var r=tt;e=rt;var o=32-Rn(r)-1;r&=~(1<<o),t+=1;var s=32-Rn(n)+o;if(30<s){var i=o-o%5;s=(r&(1<<i)-1).toString(32),r>>=i,o-=i,tt=1<<32-Rn(n)+o|t<<o|r,rt=s+e}else tt=1<<s|t<<o|r,rt=e}function wl(e){e.return!==null&&($t(e,1),Kd(e,1,0))}function xl(e){for(;e===Rs;)Rs=hr[--pr],hr[pr]=null,Os=hr[--pr],hr[pr]=null;for(;e===Xt;)Xt=xn[--kn],xn[kn]=null,rt=xn[--kn],xn[kn]=null,tt=xn[--kn],xn[kn]=null}var pn=null,hn=null,ge=!1,_n=null;function Zd(e,n){var t=En(5,null,null,0);t.elementType="DELETED",t.stateNode=n,t.return=e,n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)}function Uc(e,n){switch(e.tag){case 5:var t=e.type;return n=n.nodeType!==1||t.toLowerCase()!==n.nodeName.toLowerCase()?null:n,n!==null?(e.stateNode=n,pn=e,hn=Ct(n.firstChild),!0):!1;case 6:return n=e.pendingProps===""||n.nodeType!==3?null:n,n!==null?(e.stateNode=n,pn=e,hn=null,!0):!1;case 13:return n=n.nodeType!==8?null:n,n!==null?(t=Xt!==null?{id:tt,overflow:rt}:null,e.memoizedState={dehydrated:n,treeContext:t,retryLane:1073741824},t=En(18,null,null,0),t.stateNode=n,t.return=e,e.child=t,pn=e,hn=null,!0):!1;default:return!1}}function Ta(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ma(e){if(ge){var n=hn;if(n){var t=n;if(!Uc(e,n)){if(Ta(e))throw Error(M(418));n=Ct(t.nextSibling);var r=pn;n&&Uc(e,n)?Zd(r,t):(e.flags=e.flags&-4097|2,ge=!1,pn=e)}}else{if(Ta(e))throw Error(M(418));e.flags=e.flags&-4097|2,ge=!1,pn=e}}}function Hc(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;pn=e}function ss(e){if(e!==pn)return!1;if(!ge)return Hc(e),ge=!0,!1;var n;if((n=e.tag!==3)&&!(n=e.tag!==5)&&(n=e.type,n=n!=="head"&&n!=="body"&&!Sa(e.type,e.memoizedProps)),n&&(n=hn)){if(Ta(e))throw Gd(),Error(M(418));for(;n;)Zd(e,n),n=Ct(n.nextSibling)}if(Hc(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(M(317));e:{for(e=e.nextSibling,n=0;e;){if(e.nodeType===8){var t=e.data;if(t==="/$"){if(n===0){hn=Ct(e.nextSibling);break e}n--}else t!=="$"&&t!=="$!"&&t!=="$?"||n++}e=e.nextSibling}hn=null}}else hn=pn?Ct(e.stateNode.nextSibling):null;return!0}function Gd(){for(var e=hn;e;)e=Ct(e.nextSibling)}function zr(){hn=pn=null,ge=!1}function kl(e){_n===null?_n=[e]:_n.push(e)}var lm=ut.ReactCurrentBatchConfig;function qr(e,n,t){if(e=t.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(M(309));var r=t.stateNode}if(!r)throw Error(M(147,e));var o=r,s=""+e;return n!==null&&n.ref!==null&&typeof n.ref=="function"&&n.ref._stringRef===s?n.ref:(n=function(i){var a=o.refs;i===null?delete a[s]:a[s]=i},n._stringRef=s,n)}if(typeof e!="string")throw Error(M(284));if(!t._owner)throw Error(M(290,e))}return e}function is(e,n){throw e=Object.prototype.toString.call(n),Error(M(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e))}function Kc(e){var n=e._init;return n(e._payload)}function Qd(e){function n(g,u){if(e){var y=g.deletions;y===null?(g.deletions=[u],g.flags|=16):y.push(u)}}function t(g,u){if(!e)return null;for(;u!==null;)n(g,u),u=u.sibling;return null}function r(g,u){for(g=new Map;u!==null;)u.key!==null?g.set(u.key,u):g.set(u.index,u),u=u.sibling;return g}function o(g,u){return g=Pt(g,u),g.index=0,g.sibling=null,g}function s(g,u,y){return g.index=y,e?(y=g.alternate,y!==null?(y=y.index,y<u?(g.flags|=2,u):y):(g.flags|=2,u)):(g.flags|=1048576,u)}function i(g){return e&&g.alternate===null&&(g.flags|=2),g}function a(g,u,y,C){return u===null||u.tag!==6?(u=Wi(y,g.mode,C),u.return=g,u):(u=o(u,y),u.return=g,u)}function l(g,u,y,C){var N=y.type;return N===ar?h(g,u,y.props.children,C,y.key):u!==null&&(u.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===pt&&Kc(N)===u.type)?(C=o(u,y.props),C.ref=qr(g,u,y),C.return=g,C):(C=Es(y.type,y.key,y.props,null,g.mode,C),C.ref=qr(g,u,y),C.return=g,C)}function d(g,u,y,C){return u===null||u.tag!==4||u.stateNode.containerInfo!==y.containerInfo||u.stateNode.implementation!==y.implementation?(u=Ui(y,g.mode,C),u.return=g,u):(u=o(u,y.children||[]),u.return=g,u)}function h(g,u,y,C,N){return u===null||u.tag!==7?(u=Qt(y,g.mode,C,N),u.return=g,u):(u=o(u,y),u.return=g,u)}function f(g,u,y){if(typeof u=="string"&&u!==""||typeof u=="number")return u=Wi(""+u,g.mode,y),u.return=g,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case Qo:return y=Es(u.type,u.key,u.props,null,g.mode,y),y.ref=qr(g,null,u),y.return=g,y;case ir:return u=Ui(u,g.mode,y),u.return=g,u;case pt:var C=u._init;return f(g,C(u._payload),y)}if(ro(u)||Zr(u))return u=Qt(u,g.mode,y,null),u.return=g,u;is(g,u)}return null}function m(g,u,y,C){var N=u!==null?u.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return N!==null?null:a(g,u,""+y,C);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Qo:return y.key===N?l(g,u,y,C):null;case ir:return y.key===N?d(g,u,y,C):null;case pt:return N=y._init,m(g,u,N(y._payload),C)}if(ro(y)||Zr(y))return N!==null?null:h(g,u,y,C,null);is(g,y)}return null}function k(g,u,y,C,N){if(typeof C=="string"&&C!==""||typeof C=="number")return g=g.get(y)||null,a(u,g,""+C,N);if(typeof C=="object"&&C!==null){switch(C.$$typeof){case Qo:return g=g.get(C.key===null?y:C.key)||null,l(u,g,C,N);case ir:return g=g.get(C.key===null?y:C.key)||null,d(u,g,C,N);case pt:var R=C._init;return k(g,u,y,R(C._payload),N)}if(ro(C)||Zr(C))return g=g.get(y)||null,h(u,g,C,N,null);is(u,C)}return null}function v(g,u,y,C){for(var N=null,R=null,z=u,F=u=0,le=null;z!==null&&F<y.length;F++){z.index>F?(le=z,z=null):le=z.sibling;var K=m(g,z,y[F],C);if(K===null){z===null&&(z=le);break}e&&z&&K.alternate===null&&n(g,z),u=s(K,u,F),R===null?N=K:R.sibling=K,R=K,z=le}if(F===y.length)return t(g,z),ge&&$t(g,F),N;if(z===null){for(;F<y.length;F++)z=f(g,y[F],C),z!==null&&(u=s(z,u,F),R===null?N=z:R.sibling=z,R=z);return ge&&$t(g,F),N}for(z=r(g,z);F<y.length;F++)le=k(z,g,F,y[F],C),le!==null&&(e&&le.alternate!==null&&z.delete(le.key===null?F:le.key),u=s(le,u,F),R===null?N=le:R.sibling=le,R=le);return e&&z.forEach(function(Ze){return n(g,Ze)}),ge&&$t(g,F),N}function x(g,u,y,C){var N=Zr(y);if(typeof N!="function")throw Error(M(150));if(y=N.call(y),y==null)throw Error(M(151));for(var R=N=null,z=u,F=u=0,le=null,K=y.next();z!==null&&!K.done;F++,K=y.next()){z.index>F?(le=z,z=null):le=z.sibling;var Ze=m(g,z,K.value,C);if(Ze===null){z===null&&(z=le);break}e&&z&&Ze.alternate===null&&n(g,z),u=s(Ze,u,F),R===null?N=Ze:R.sibling=Ze,R=Ze,z=le}if(K.done)return t(g,z),ge&&$t(g,F),N;if(z===null){for(;!K.done;F++,K=y.next())K=f(g,K.value,C),K!==null&&(u=s(K,u,F),R===null?N=K:R.sibling=K,R=K);return ge&&$t(g,F),N}for(z=r(g,z);!K.done;F++,K=y.next())K=k(z,g,F,K.value,C),K!==null&&(e&&K.alternate!==null&&z.delete(K.key===null?F:K.key),u=s(K,u,F),R===null?N=K:R.sibling=K,R=K);return e&&z.forEach(function(cn){return n(g,cn)}),ge&&$t(g,F),N}function _(g,u,y,C){if(typeof y=="object"&&y!==null&&y.type===ar&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case Qo:e:{for(var N=y.key,R=u;R!==null;){if(R.key===N){if(N=y.type,N===ar){if(R.tag===7){t(g,R.sibling),u=o(R,y.props.children),u.return=g,g=u;break e}}else if(R.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===pt&&Kc(N)===R.type){t(g,R.sibling),u=o(R,y.props),u.ref=qr(g,R,y),u.return=g,g=u;break e}t(g,R);break}else n(g,R);R=R.sibling}y.type===ar?(u=Qt(y.props.children,g.mode,C,y.key),u.return=g,g=u):(C=Es(y.type,y.key,y.props,null,g.mode,C),C.ref=qr(g,u,y),C.return=g,g=C)}return i(g);case ir:e:{for(R=y.key;u!==null;){if(u.key===R)if(u.tag===4&&u.stateNode.containerInfo===y.containerInfo&&u.stateNode.implementation===y.implementation){t(g,u.sibling),u=o(u,y.children||[]),u.return=g,g=u;break e}else{t(g,u);break}else n(g,u);u=u.sibling}u=Ui(y,g.mode,C),u.return=g,g=u}return i(g);case pt:return R=y._init,_(g,u,R(y._payload),C)}if(ro(y))return v(g,u,y,C);if(Zr(y))return x(g,u,y,C);is(g,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,u!==null&&u.tag===6?(t(g,u.sibling),u=o(u,y),u.return=g,g=u):(t(g,u),u=Wi(y,g.mode,C),u.return=g,g=u),i(g)):t(g,u)}return _}var Lr=Qd(!0),Yd=Qd(!1),$s=Lt(null),Fs=null,mr=null,Sl=null;function El(){Sl=mr=Fs=null}function Cl(e){var n=$s.current;me($s),e._currentValue=n}function Pa(e,n,t){for(;e!==null;){var r=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,r!==null&&(r.childLanes|=n)):r!==null&&(r.childLanes&n)!==n&&(r.childLanes|=n),e===t)break;e=e.return}}function Tr(e,n){Fs=e,Sl=mr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&n&&(on=!0),e.firstContext=null)}function Tn(e){var n=e._currentValue;if(Sl!==e)if(e={context:e,memoizedValue:n,next:null},mr===null){if(Fs===null)throw Error(M(308));mr=e,Fs.dependencies={lanes:0,firstContext:e}}else mr=mr.next=e;return n}var Ut=null;function jl(e){Ut===null?Ut=[e]:Ut.push(e)}function Xd(e,n,t,r){var o=n.interleaved;return o===null?(t.next=t,jl(n)):(t.next=o.next,o.next=t),n.interleaved=t,at(e,r)}function at(e,n){e.lanes|=n;var t=e.alternate;for(t!==null&&(t.lanes|=n),t=e,e=e.return;e!==null;)e.childLanes|=n,t=e.alternate,t!==null&&(t.childLanes|=n),t=e,e=e.return;return t.tag===3?t.stateNode:null}var mt=!1;function Tl(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function qd(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function ot(e,n){return{eventTime:e,lane:n,tag:0,payload:null,callback:null,next:null}}function jt(e,n,t){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,ne&2){var o=r.pending;return o===null?n.next=n:(n.next=o.next,o.next=n),r.pending=n,at(e,t)}return o=r.interleaved,o===null?(n.next=n,jl(r)):(n.next=o.next,o.next=n),r.interleaved=n,at(e,t)}function ys(e,n,t){if(n=n.updateQueue,n!==null&&(n=n.shared,(t&4194240)!==0)){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,dl(e,t)}}function Zc(e,n){var t=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,t===r)){var o=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var i={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?o=s=i:s=s.next=i,t=t.next}while(t!==null);s===null?o=s=n:s=s.next=n}else o=s=n;t={baseState:r.baseState,firstBaseUpdate:o,lastBaseUpdate:s,shared:r.shared,effects:r.effects},e.updateQueue=t;return}e=t.lastBaseUpdate,e===null?t.firstBaseUpdate=n:e.next=n,t.lastBaseUpdate=n}function Bs(e,n,t,r){var o=e.updateQueue;mt=!1;var s=o.firstBaseUpdate,i=o.lastBaseUpdate,a=o.shared.pending;if(a!==null){o.shared.pending=null;var l=a,d=l.next;l.next=null,i===null?s=d:i.next=d,i=l;var h=e.alternate;h!==null&&(h=h.updateQueue,a=h.lastBaseUpdate,a!==i&&(a===null?h.firstBaseUpdate=d:a.next=d,h.lastBaseUpdate=l))}if(s!==null){var f=o.baseState;i=0,h=d=l=null,a=s;do{var m=a.lane,k=a.eventTime;if((r&m)===m){h!==null&&(h=h.next={eventTime:k,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=e,x=a;switch(m=n,k=t,x.tag){case 1:if(v=x.payload,typeof v=="function"){f=v.call(k,f,m);break e}f=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=x.payload,m=typeof v=="function"?v.call(k,f,m):v,m==null)break e;f=ke({},f,m);break e;case 2:mt=!0}}a.callback!==null&&a.lane!==0&&(e.flags|=64,m=o.effects,m===null?o.effects=[a]:m.push(a))}else k={eventTime:k,lane:m,tag:a.tag,payload:a.payload,callback:a.callback,next:null},h===null?(d=h=k,l=f):h=h.next=k,i|=m;if(a=a.next,a===null){if(a=o.shared.pending,a===null)break;m=a,a=m.next,m.next=null,o.lastBaseUpdate=m,o.shared.pending=null}}while(!0);if(h===null&&(l=f),o.baseState=l,o.firstBaseUpdate=d,o.lastBaseUpdate=h,n=o.shared.interleaved,n!==null){o=n;do i|=o.lane,o=o.next;while(o!==n)}else s===null&&(o.shared.lanes=0);Jt|=i,e.lanes=i,e.memoizedState=f}}function Gc(e,n,t){if(e=n.effects,n.effects=null,e!==null)for(n=0;n<e.length;n++){var r=e[n],o=r.callback;if(o!==null){if(r.callback=null,r=t,typeof o!="function")throw Error(M(191,o));o.call(r)}}}var Fo={},Qn=Lt(Fo),Mo=Lt(Fo),Po=Lt(Fo);function Ht(e){if(e===Fo)throw Error(M(174));return e}function Ml(e,n){switch(he(Po,n),he(Mo,e),he(Qn,Fo),e=n.nodeType,e){case 9:case 11:n=(n=n.documentElement)?n.namespaceURI:la(null,"");break;default:e=e===8?n.parentNode:n,n=e.namespaceURI||null,e=e.tagName,n=la(n,e)}me(Qn),he(Qn,n)}function Ir(){me(Qn),me(Mo),me(Po)}function Jd(e){Ht(Po.current);var n=Ht(Qn.current),t=la(n,e.type);n!==t&&(he(Mo,e),he(Qn,t))}function Pl(e){Mo.current===e&&(me(Qn),me(Mo))}var we=Lt(0);function Vs(e){for(var n=e;n!==null;){if(n.tag===13){var t=n.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if(n.flags&128)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Ri=[];function Nl(){for(var e=0;e<Ri.length;e++)Ri[e]._workInProgressVersionPrimary=null;Ri.length=0}var vs=ut.ReactCurrentDispatcher,Oi=ut.ReactCurrentBatchConfig,qt=0,xe=null,Ne=null,_e=null,Ws=!1,fo=!1,No=0,cm=0;function Ve(){throw Error(M(321))}function bl(e,n){if(n===null)return!1;for(var t=0;t<n.length&&t<e.length;t++)if(!Fn(e[t],n[t]))return!1;return!0}function Al(e,n,t,r,o,s){if(qt=s,xe=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,vs.current=e===null||e.memoizedState===null?hm:pm,e=t(r,o),fo){s=0;do{if(fo=!1,No=0,25<=s)throw Error(M(301));s+=1,_e=Ne=null,n.updateQueue=null,vs.current=mm,e=t(r,o)}while(fo)}if(vs.current=Us,n=Ne!==null&&Ne.next!==null,qt=0,_e=Ne=xe=null,Ws=!1,n)throw Error(M(300));return e}function zl(){var e=No!==0;return No=0,e}function Hn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return _e===null?xe.memoizedState=_e=e:_e=_e.next=e,_e}function Mn(){if(Ne===null){var e=xe.alternate;e=e!==null?e.memoizedState:null}else e=Ne.next;var n=_e===null?xe.memoizedState:_e.next;if(n!==null)_e=n,Ne=e;else{if(e===null)throw Error(M(310));Ne=e,e={memoizedState:Ne.memoizedState,baseState:Ne.baseState,baseQueue:Ne.baseQueue,queue:Ne.queue,next:null},_e===null?xe.memoizedState=_e=e:_e=_e.next=e}return _e}function bo(e,n){return typeof n=="function"?n(e):n}function $i(e){var n=Mn(),t=n.queue;if(t===null)throw Error(M(311));t.lastRenderedReducer=e;var r=Ne,o=r.baseQueue,s=t.pending;if(s!==null){if(o!==null){var i=o.next;o.next=s.next,s.next=i}r.baseQueue=o=s,t.pending=null}if(o!==null){s=o.next,r=r.baseState;var a=i=null,l=null,d=s;do{var h=d.lane;if((qt&h)===h)l!==null&&(l=l.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var f={lane:h,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};l===null?(a=l=f,i=r):l=l.next=f,xe.lanes|=h,Jt|=h}d=d.next}while(d!==null&&d!==s);l===null?i=r:l.next=a,Fn(r,n.memoizedState)||(on=!0),n.memoizedState=r,n.baseState=i,n.baseQueue=l,t.lastRenderedState=r}if(e=t.interleaved,e!==null){o=e;do s=o.lane,xe.lanes|=s,Jt|=s,o=o.next;while(o!==e)}else o===null&&(t.lanes=0);return[n.memoizedState,t.dispatch]}function Fi(e){var n=Mn(),t=n.queue;if(t===null)throw Error(M(311));t.lastRenderedReducer=e;var r=t.dispatch,o=t.pending,s=n.memoizedState;if(o!==null){t.pending=null;var i=o=o.next;do s=e(s,i.action),i=i.next;while(i!==o);Fn(s,n.memoizedState)||(on=!0),n.memoizedState=s,n.baseQueue===null&&(n.baseState=s),t.lastRenderedState=s}return[s,r]}function ef(){}function nf(e,n){var t=xe,r=Mn(),o=n(),s=!Fn(r.memoizedState,o);if(s&&(r.memoizedState=o,on=!0),r=r.queue,Ll(of.bind(null,t,r,e),[e]),r.getSnapshot!==n||s||_e!==null&&_e.memoizedState.tag&1){if(t.flags|=2048,Ao(9,rf.bind(null,t,r,o,n),void 0,null),De===null)throw Error(M(349));qt&30||tf(t,n,o)}return o}function tf(e,n,t){e.flags|=16384,e={getSnapshot:n,value:t},n=xe.updateQueue,n===null?(n={lastEffect:null,stores:null},xe.updateQueue=n,n.stores=[e]):(t=n.stores,t===null?n.stores=[e]:t.push(e))}function rf(e,n,t,r){n.value=t,n.getSnapshot=r,sf(n)&&af(e)}function of(e,n,t){return t(function(){sf(n)&&af(e)})}function sf(e){var n=e.getSnapshot;e=e.value;try{var t=n();return!Fn(e,t)}catch{return!0}}function af(e){var n=at(e,1);n!==null&&On(n,e,1,-1)}function Qc(e){var n=Hn();return typeof e=="function"&&(e=e()),n.memoizedState=n.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:bo,lastRenderedState:e},n.queue=e,e=e.dispatch=fm.bind(null,xe,e),[n.memoizedState,e]}function Ao(e,n,t,r){return e={tag:e,create:n,destroy:t,deps:r,next:null},n=xe.updateQueue,n===null?(n={lastEffect:null,stores:null},xe.updateQueue=n,n.lastEffect=e.next=e):(t=n.lastEffect,t===null?n.lastEffect=e.next=e:(r=t.next,t.next=e,e.next=r,n.lastEffect=e)),e}function lf(){return Mn().memoizedState}function ws(e,n,t,r){var o=Hn();xe.flags|=e,o.memoizedState=Ao(1|n,t,void 0,r===void 0?null:r)}function ai(e,n,t,r){var o=Mn();r=r===void 0?null:r;var s=void 0;if(Ne!==null){var i=Ne.memoizedState;if(s=i.destroy,r!==null&&bl(r,i.deps)){o.memoizedState=Ao(n,t,s,r);return}}xe.flags|=e,o.memoizedState=Ao(1|n,t,s,r)}function Yc(e,n){return ws(8390656,8,e,n)}function Ll(e,n){return ai(2048,8,e,n)}function cf(e,n){return ai(4,2,e,n)}function uf(e,n){return ai(4,4,e,n)}function df(e,n){if(typeof n=="function")return e=e(),n(e),function(){n(null)};if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function ff(e,n,t){return t=t!=null?t.concat([e]):null,ai(4,4,df.bind(null,n,e),t)}function Il(){}function hf(e,n){var t=Mn();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&bl(n,r[1])?r[0]:(t.memoizedState=[e,n],e)}function pf(e,n){var t=Mn();n=n===void 0?null:n;var r=t.memoizedState;return r!==null&&n!==null&&bl(n,r[1])?r[0]:(e=e(),t.memoizedState=[e,n],e)}function mf(e,n,t){return qt&21?(Fn(t,n)||(t=wd(),xe.lanes|=t,Jt|=t,e.baseState=!0),n):(e.baseState&&(e.baseState=!1,on=!0),e.memoizedState=t)}function um(e,n){var t=ae;ae=t!==0&&4>t?t:4,e(!0);var r=Oi.transition;Oi.transition={};try{e(!1),n()}finally{ae=t,Oi.transition=r}}function gf(){return Mn().memoizedState}function dm(e,n,t){var r=Mt(e);if(t={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null},yf(e))vf(n,t);else if(t=Xd(e,n,t,r),t!==null){var o=qe();On(t,e,r,o),wf(t,n,r)}}function fm(e,n,t){var r=Mt(e),o={lane:r,action:t,hasEagerState:!1,eagerState:null,next:null};if(yf(e))vf(n,o);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=n.lastRenderedReducer,s!==null))try{var i=n.lastRenderedState,a=s(i,t);if(o.hasEagerState=!0,o.eagerState=a,Fn(a,i)){var l=n.interleaved;l===null?(o.next=o,jl(n)):(o.next=l.next,l.next=o),n.interleaved=o;return}}catch{}finally{}t=Xd(e,n,o,r),t!==null&&(o=qe(),On(t,e,r,o),wf(t,n,r))}}function yf(e){var n=e.alternate;return e===xe||n!==null&&n===xe}function vf(e,n){fo=Ws=!0;var t=e.pending;t===null?n.next=n:(n.next=t.next,t.next=n),e.pending=n}function wf(e,n,t){if(t&4194240){var r=n.lanes;r&=e.pendingLanes,t|=r,n.lanes=t,dl(e,t)}}var Us={readContext:Tn,useCallback:Ve,useContext:Ve,useEffect:Ve,useImperativeHandle:Ve,useInsertionEffect:Ve,useLayoutEffect:Ve,useMemo:Ve,useReducer:Ve,useRef:Ve,useState:Ve,useDebugValue:Ve,useDeferredValue:Ve,useTransition:Ve,useMutableSource:Ve,useSyncExternalStore:Ve,useId:Ve,unstable_isNewReconciler:!1},hm={readContext:Tn,useCallback:function(e,n){return Hn().memoizedState=[e,n===void 0?null:n],e},useContext:Tn,useEffect:Yc,useImperativeHandle:function(e,n,t){return t=t!=null?t.concat([e]):null,ws(4194308,4,df.bind(null,n,e),t)},useLayoutEffect:function(e,n){return ws(4194308,4,e,n)},useInsertionEffect:function(e,n){return ws(4,2,e,n)},useMemo:function(e,n){var t=Hn();return n=n===void 0?null:n,e=e(),t.memoizedState=[e,n],e},useReducer:function(e,n,t){var r=Hn();return n=t!==void 0?t(n):n,r.memoizedState=r.baseState=n,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:n},r.queue=e,e=e.dispatch=dm.bind(null,xe,e),[r.memoizedState,e]},useRef:function(e){var n=Hn();return e={current:e},n.memoizedState=e},useState:Qc,useDebugValue:Il,useDeferredValue:function(e){return Hn().memoizedState=e},useTransition:function(){var e=Qc(!1),n=e[0];return e=um.bind(null,e[1]),Hn().memoizedState=e,[n,e]},useMutableSource:function(){},useSyncExternalStore:function(e,n,t){var r=xe,o=Hn();if(ge){if(t===void 0)throw Error(M(407));t=t()}else{if(t=n(),De===null)throw Error(M(349));qt&30||tf(r,n,t)}o.memoizedState=t;var s={value:t,getSnapshot:n};return o.queue=s,Yc(of.bind(null,r,s,e),[e]),r.flags|=2048,Ao(9,rf.bind(null,r,s,t,n),void 0,null),t},useId:function(){var e=Hn(),n=De.identifierPrefix;if(ge){var t=rt,r=tt;t=(r&~(1<<32-Rn(r)-1)).toString(32)+t,n=":"+n+"R"+t,t=No++,0<t&&(n+="H"+t.toString(32)),n+=":"}else t=cm++,n=":"+n+"r"+t.toString(32)+":";return e.memoizedState=n},unstable_isNewReconciler:!1},pm={readContext:Tn,useCallback:hf,useContext:Tn,useEffect:Ll,useImperativeHandle:ff,useInsertionEffect:cf,useLayoutEffect:uf,useMemo:pf,useReducer:$i,useRef:lf,useState:function(){return $i(bo)},useDebugValue:Il,useDeferredValue:function(e){var n=Mn();return mf(n,Ne.memoizedState,e)},useTransition:function(){var e=$i(bo)[0],n=Mn().memoizedState;return[e,n]},useMutableSource:ef,useSyncExternalStore:nf,useId:gf,unstable_isNewReconciler:!1},mm={readContext:Tn,useCallback:hf,useContext:Tn,useEffect:Ll,useImperativeHandle:ff,useInsertionEffect:cf,useLayoutEffect:uf,useMemo:pf,useReducer:Fi,useRef:lf,useState:function(){return Fi(bo)},useDebugValue:Il,useDeferredValue:function(e){var n=Mn();return Ne===null?n.memoizedState=e:mf(n,Ne.memoizedState,e)},useTransition:function(){var e=Fi(bo)[0],n=Mn().memoizedState;return[e,n]},useMutableSource:ef,useSyncExternalStore:nf,useId:gf,unstable_isNewReconciler:!1};function zn(e,n){if(e&&e.defaultProps){n=ke({},n),e=e.defaultProps;for(var t in e)n[t]===void 0&&(n[t]=e[t]);return n}return n}function Na(e,n,t,r){n=e.memoizedState,t=t(r,n),t=t==null?n:ke({},n,t),e.memoizedState=t,e.lanes===0&&(e.updateQueue.baseState=t)}var li={isMounted:function(e){return(e=e._reactInternals)?rr(e)===e:!1},enqueueSetState:function(e,n,t){e=e._reactInternals;var r=qe(),o=Mt(e),s=ot(r,o);s.payload=n,t!=null&&(s.callback=t),n=jt(e,s,o),n!==null&&(On(n,e,o,r),ys(n,e,o))},enqueueReplaceState:function(e,n,t){e=e._reactInternals;var r=qe(),o=Mt(e),s=ot(r,o);s.tag=1,s.payload=n,t!=null&&(s.callback=t),n=jt(e,s,o),n!==null&&(On(n,e,o,r),ys(n,e,o))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var t=qe(),r=Mt(e),o=ot(t,r);o.tag=2,n!=null&&(o.callback=n),n=jt(e,o,r),n!==null&&(On(n,e,r,t),ys(n,e,r))}};function Xc(e,n,t,r,o,s,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,s,i):n.prototype&&n.prototype.isPureReactComponent?!Eo(t,r)||!Eo(o,s):!0}function xf(e,n,t){var r=!1,o=bt,s=n.contextType;return typeof s=="object"&&s!==null?s=Tn(s):(o=an(n)?Yt:Ke.current,r=n.contextTypes,s=(r=r!=null)?Ar(e,o):bt),n=new n(t,s),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=li,e.stateNode=n,n._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=s),n}function qc(e,n,t,r){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(t,r),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(t,r),n.state!==e&&li.enqueueReplaceState(n,n.state,null)}function ba(e,n,t,r){var o=e.stateNode;o.props=t,o.state=e.memoizedState,o.refs={},Tl(e);var s=n.contextType;typeof s=="object"&&s!==null?o.context=Tn(s):(s=an(n)?Yt:Ke.current,o.context=Ar(e,s)),o.state=e.memoizedState,s=n.getDerivedStateFromProps,typeof s=="function"&&(Na(e,n,s,t),o.state=e.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(n=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),n!==o.state&&li.enqueueReplaceState(o,o.state,null),Bs(e,t,o,r),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function _r(e,n){try{var t="",r=n;do t+=Wh(r),r=r.return;while(r);var o=t}catch(s){o=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:n,stack:o,digest:null}}function Bi(e,n,t){return{value:e,source:null,stack:t??null,digest:n??null}}function Aa(e,n){try{console.error(n.value)}catch(t){setTimeout(function(){throw t})}}var gm=typeof WeakMap=="function"?WeakMap:Map;function kf(e,n,t){t=ot(-1,t),t.tag=3,t.payload={element:null};var r=n.value;return t.callback=function(){Ks||(Ks=!0,Ba=r),Aa(e,n)},t}function Sf(e,n,t){t=ot(-1,t),t.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var o=n.value;t.payload=function(){return r(o)},t.callback=function(){Aa(e,n)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){Aa(e,n),typeof r!="function"&&(Tt===null?Tt=new Set([this]):Tt.add(this));var i=n.stack;this.componentDidCatch(n.value,{componentStack:i!==null?i:""})}),t}function Jc(e,n,t){var r=e.pingCache;if(r===null){r=e.pingCache=new gm;var o=new Set;r.set(n,o)}else o=r.get(n),o===void 0&&(o=new Set,r.set(n,o));o.has(t)||(o.add(t),e=bm.bind(null,e,n,t),n.then(e,e))}function eu(e){do{var n;if((n=e.tag===13)&&(n=e.memoizedState,n=n!==null?n.dehydrated!==null:!0),n)return e;e=e.return}while(e!==null);return null}function nu(e,n,t,r,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===n?e.flags|=65536:(e.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(n=ot(-1,1),n.tag=2,jt(t,n,1))),t.lanes|=1),e)}var ym=ut.ReactCurrentOwner,on=!1;function Xe(e,n,t,r){n.child=e===null?Yd(n,null,t,r):Lr(n,e.child,t,r)}function tu(e,n,t,r,o){t=t.render;var s=n.ref;return Tr(n,o),r=Al(e,n,t,r,s,o),t=zl(),e!==null&&!on?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~o,lt(e,n,o)):(ge&&t&&wl(n),n.flags|=1,Xe(e,n,r,o),n.child)}function ru(e,n,t,r,o){if(e===null){var s=t.type;return typeof s=="function"&&!Vl(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(n.tag=15,n.type=s,Ef(e,n,s,r,o)):(e=Es(t.type,null,r,n,n.mode,o),e.ref=n.ref,e.return=n,n.child=e)}if(s=e.child,!(e.lanes&o)){var i=s.memoizedProps;if(t=t.compare,t=t!==null?t:Eo,t(i,r)&&e.ref===n.ref)return lt(e,n,o)}return n.flags|=1,e=Pt(s,r),e.ref=n.ref,e.return=n,n.child=e}function Ef(e,n,t,r,o){if(e!==null){var s=e.memoizedProps;if(Eo(s,r)&&e.ref===n.ref)if(on=!1,n.pendingProps=r=s,(e.lanes&o)!==0)e.flags&131072&&(on=!0);else return n.lanes=e.lanes,lt(e,n,o)}return za(e,n,t,r,o)}function Cf(e,n,t){var r=n.pendingProps,o=r.children,s=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(n.mode&1))n.memoizedState={baseLanes:0,cachePool:null,transitions:null},he(yr,fn),fn|=t;else{if(!(t&1073741824))return e=s!==null?s.baseLanes|t:t,n.lanes=n.childLanes=1073741824,n.memoizedState={baseLanes:e,cachePool:null,transitions:null},n.updateQueue=null,he(yr,fn),fn|=e,null;n.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:t,he(yr,fn),fn|=r}else s!==null?(r=s.baseLanes|t,n.memoizedState=null):r=t,he(yr,fn),fn|=r;return Xe(e,n,o,t),n.child}function jf(e,n){var t=n.ref;(e===null&&t!==null||e!==null&&e.ref!==t)&&(n.flags|=512,n.flags|=2097152)}function za(e,n,t,r,o){var s=an(t)?Yt:Ke.current;return s=Ar(n,s),Tr(n,o),t=Al(e,n,t,r,s,o),r=zl(),e!==null&&!on?(n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~o,lt(e,n,o)):(ge&&r&&wl(n),n.flags|=1,Xe(e,n,t,o),n.child)}function ou(e,n,t,r,o){if(an(t)){var s=!0;Ds(n)}else s=!1;if(Tr(n,o),n.stateNode===null)xs(e,n),xf(n,t,r),ba(n,t,r,o),r=!0;else if(e===null){var i=n.stateNode,a=n.memoizedProps;i.props=a;var l=i.context,d=t.contextType;typeof d=="object"&&d!==null?d=Tn(d):(d=an(t)?Yt:Ke.current,d=Ar(n,d));var h=t.getDerivedStateFromProps,f=typeof h=="function"||typeof i.getSnapshotBeforeUpdate=="function";f||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(a!==r||l!==d)&&qc(n,i,r,d),mt=!1;var m=n.memoizedState;i.state=m,Bs(n,r,i,o),l=n.memoizedState,a!==r||m!==l||sn.current||mt?(typeof h=="function"&&(Na(n,t,h,r),l=n.memoizedState),(a=mt||Xc(n,t,a,r,m,l,d))?(f||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(n.flags|=4194308)):(typeof i.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=r,n.memoizedState=l),i.props=r,i.state=l,i.context=d,r=a):(typeof i.componentDidMount=="function"&&(n.flags|=4194308),r=!1)}else{i=n.stateNode,qd(e,n),a=n.memoizedProps,d=n.type===n.elementType?a:zn(n.type,a),i.props=d,f=n.pendingProps,m=i.context,l=t.contextType,typeof l=="object"&&l!==null?l=Tn(l):(l=an(t)?Yt:Ke.current,l=Ar(n,l));var k=t.getDerivedStateFromProps;(h=typeof k=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(a!==f||m!==l)&&qc(n,i,r,l),mt=!1,m=n.memoizedState,i.state=m,Bs(n,r,i,o);var v=n.memoizedState;a!==f||m!==v||sn.current||mt?(typeof k=="function"&&(Na(n,t,k,r),v=n.memoizedState),(d=mt||Xc(n,t,d,r,m,v,l)||!1)?(h||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,v,l),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,v,l)),typeof i.componentDidUpdate=="function"&&(n.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof i.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(n.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(n.flags|=1024),n.memoizedProps=r,n.memoizedState=v),i.props=r,i.state=v,i.context=l,r=d):(typeof i.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(n.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(n.flags|=1024),r=!1)}return La(e,n,t,r,s,o)}function La(e,n,t,r,o,s){jf(e,n);var i=(n.flags&128)!==0;if(!r&&!i)return o&&Wc(n,t,!1),lt(e,n,s);r=n.stateNode,ym.current=n;var a=i&&typeof t.getDerivedStateFromError!="function"?null:r.render();return n.flags|=1,e!==null&&i?(n.child=Lr(n,e.child,null,s),n.child=Lr(n,null,a,s)):Xe(e,n,a,s),n.memoizedState=r.state,o&&Wc(n,t,!0),n.child}function Tf(e){var n=e.stateNode;n.pendingContext?Vc(e,n.pendingContext,n.pendingContext!==n.context):n.context&&Vc(e,n.context,!1),Ml(e,n.containerInfo)}function su(e,n,t,r,o){return zr(),kl(o),n.flags|=256,Xe(e,n,t,r),n.child}var Ia={dehydrated:null,treeContext:null,retryLane:0};function _a(e){return{baseLanes:e,cachePool:null,transitions:null}}function Mf(e,n,t){var r=n.pendingProps,o=we.current,s=!1,i=(n.flags&128)!==0,a;if((a=i)||(a=e!==null&&e.memoizedState===null?!1:(o&2)!==0),a?(s=!0,n.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),he(we,o&1),e===null)return Ma(n),e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(n.mode&1?e.data==="$!"?n.lanes=8:n.lanes=1073741824:n.lanes=1,null):(i=r.children,e=r.fallback,s?(r=n.mode,s=n.child,i={mode:"hidden",children:i},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=i):s=di(i,r,0,null),e=Qt(e,r,t,null),s.return=n,e.return=n,s.sibling=e,n.child=s,n.child.memoizedState=_a(t),n.memoizedState=Ia,e):_l(n,i));if(o=e.memoizedState,o!==null&&(a=o.dehydrated,a!==null))return vm(e,n,i,r,a,o,t);if(s){s=r.fallback,i=n.mode,o=e.child,a=o.sibling;var l={mode:"hidden",children:r.children};return!(i&1)&&n.child!==o?(r=n.child,r.childLanes=0,r.pendingProps=l,n.deletions=null):(r=Pt(o,l),r.subtreeFlags=o.subtreeFlags&14680064),a!==null?s=Pt(a,s):(s=Qt(s,i,t,null),s.flags|=2),s.return=n,r.return=n,r.sibling=s,n.child=r,r=s,s=n.child,i=e.child.memoizedState,i=i===null?_a(t):{baseLanes:i.baseLanes|t,cachePool:null,transitions:i.transitions},s.memoizedState=i,s.childLanes=e.childLanes&~t,n.memoizedState=Ia,r}return s=e.child,e=s.sibling,r=Pt(s,{mode:"visible",children:r.children}),!(n.mode&1)&&(r.lanes=t),r.return=n,r.sibling=null,e!==null&&(t=n.deletions,t===null?(n.deletions=[e],n.flags|=16):t.push(e)),n.child=r,n.memoizedState=null,r}function _l(e,n){return n=di({mode:"visible",children:n},e.mode,0,null),n.return=e,e.child=n}function as(e,n,t,r){return r!==null&&kl(r),Lr(n,e.child,null,t),e=_l(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function vm(e,n,t,r,o,s,i){if(t)return n.flags&256?(n.flags&=-257,r=Bi(Error(M(422))),as(e,n,i,r)):n.memoizedState!==null?(n.child=e.child,n.flags|=128,null):(s=r.fallback,o=n.mode,r=di({mode:"visible",children:r.children},o,0,null),s=Qt(s,o,i,null),s.flags|=2,r.return=n,s.return=n,r.sibling=s,n.child=r,n.mode&1&&Lr(n,e.child,null,i),n.child.memoizedState=_a(i),n.memoizedState=Ia,s);if(!(n.mode&1))return as(e,n,i,null);if(o.data==="$!"){if(r=o.nextSibling&&o.nextSibling.dataset,r)var a=r.dgst;return r=a,s=Error(M(419)),r=Bi(s,r,void 0),as(e,n,i,r)}if(a=(i&e.childLanes)!==0,on||a){if(r=De,r!==null){switch(i&-i){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(r.suspendedLanes|i)?0:o,o!==0&&o!==s.retryLane&&(s.retryLane=o,at(e,o),On(r,e,o,-1))}return Bl(),r=Bi(Error(M(421))),as(e,n,i,r)}return o.data==="$?"?(n.flags|=128,n.child=e.child,n=Am.bind(null,e),o._reactRetry=n,null):(e=s.treeContext,hn=Ct(o.nextSibling),pn=n,ge=!0,_n=null,e!==null&&(xn[kn++]=tt,xn[kn++]=rt,xn[kn++]=Xt,tt=e.id,rt=e.overflow,Xt=n),n=_l(n,r.children),n.flags|=4096,n)}function iu(e,n,t){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n),Pa(e.return,n,t)}function Vi(e,n,t,r,o){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:r,tail:t,tailMode:o}:(s.isBackwards=n,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=t,s.tailMode=o)}function Pf(e,n,t){var r=n.pendingProps,o=r.revealOrder,s=r.tail;if(Xe(e,n,r.children,t),r=we.current,r&2)r=r&1|2,n.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&iu(e,t,n);else if(e.tag===19)iu(e,t,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break e;for(;e.sibling===null;){if(e.return===null||e.return===n)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(he(we,r),!(n.mode&1))n.memoizedState=null;else switch(o){case"forwards":for(t=n.child,o=null;t!==null;)e=t.alternate,e!==null&&Vs(e)===null&&(o=t),t=t.sibling;t=o,t===null?(o=n.child,n.child=null):(o=t.sibling,t.sibling=null),Vi(n,!1,o,t,s);break;case"backwards":for(t=null,o=n.child,n.child=null;o!==null;){if(e=o.alternate,e!==null&&Vs(e)===null){n.child=o;break}e=o.sibling,o.sibling=t,t=o,o=e}Vi(n,!0,t,null,s);break;case"together":Vi(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function xs(e,n){!(n.mode&1)&&e!==null&&(e.alternate=null,n.alternate=null,n.flags|=2)}function lt(e,n,t){if(e!==null&&(n.dependencies=e.dependencies),Jt|=n.lanes,!(t&n.childLanes))return null;if(e!==null&&n.child!==e.child)throw Error(M(153));if(n.child!==null){for(e=n.child,t=Pt(e,e.pendingProps),n.child=t,t.return=n;e.sibling!==null;)e=e.sibling,t=t.sibling=Pt(e,e.pendingProps),t.return=n;t.sibling=null}return n.child}function wm(e,n,t){switch(n.tag){case 3:Tf(n),zr();break;case 5:Jd(n);break;case 1:an(n.type)&&Ds(n);break;case 4:Ml(n,n.stateNode.containerInfo);break;case 10:var r=n.type._context,o=n.memoizedProps.value;he($s,r._currentValue),r._currentValue=o;break;case 13:if(r=n.memoizedState,r!==null)return r.dehydrated!==null?(he(we,we.current&1),n.flags|=128,null):t&n.child.childLanes?Mf(e,n,t):(he(we,we.current&1),e=lt(e,n,t),e!==null?e.sibling:null);he(we,we.current&1);break;case 19:if(r=(t&n.childLanes)!==0,e.flags&128){if(r)return Pf(e,n,t);n.flags|=128}if(o=n.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),he(we,we.current),r)break;return null;case 22:case 23:return n.lanes=0,Cf(e,n,t)}return lt(e,n,t)}var Nf,Da,bf,Af;Nf=function(e,n){for(var t=n.child;t!==null;){if(t.tag===5||t.tag===6)e.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break;for(;t.sibling===null;){if(t.return===null||t.return===n)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};Da=function(){};bf=function(e,n,t,r){var o=e.memoizedProps;if(o!==r){e=n.stateNode,Ht(Qn.current);var s=null;switch(t){case"input":o=oa(e,o),r=oa(e,r),s=[];break;case"select":o=ke({},o,{value:void 0}),r=ke({},r,{value:void 0}),s=[];break;case"textarea":o=aa(e,o),r=aa(e,r),s=[];break;default:typeof o.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Is)}ca(t,r);var i;t=null;for(d in o)if(!r.hasOwnProperty(d)&&o.hasOwnProperty(d)&&o[d]!=null)if(d==="style"){var a=o[d];for(i in a)a.hasOwnProperty(i)&&(t||(t={}),t[i]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(go.hasOwnProperty(d)?s||(s=[]):(s=s||[]).push(d,null));for(d in r){var l=r[d];if(a=o!=null?o[d]:void 0,r.hasOwnProperty(d)&&l!==a&&(l!=null||a!=null))if(d==="style")if(a){for(i in a)!a.hasOwnProperty(i)||l&&l.hasOwnProperty(i)||(t||(t={}),t[i]="");for(i in l)l.hasOwnProperty(i)&&a[i]!==l[i]&&(t||(t={}),t[i]=l[i])}else t||(s||(s=[]),s.push(d,t)),t=l;else d==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(d,l)):d==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(d,""+l):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(go.hasOwnProperty(d)?(l!=null&&d==="onScroll"&&pe("scroll",e),s||a===l||(s=[])):(s=s||[]).push(d,l))}t&&(s=s||[]).push("style",t);var d=s;(n.updateQueue=d)&&(n.flags|=4)}};Af=function(e,n,t,r){t!==r&&(n.flags|=4)};function Jr(e,n){if(!ge)switch(e.tailMode){case"hidden":n=e.tail;for(var t=null;n!==null;)n.alternate!==null&&(t=n),n=n.sibling;t===null?e.tail=null:t.sibling=null;break;case"collapsed":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function We(e){var n=e.alternate!==null&&e.alternate.child===e.child,t=0,r=0;if(n)for(var o=e.child;o!==null;)t|=o.lanes|o.childLanes,r|=o.subtreeFlags&14680064,r|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)t|=o.lanes|o.childLanes,r|=o.subtreeFlags,r|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=r,e.childLanes=t,n}function xm(e,n,t){var r=n.pendingProps;switch(xl(n),n.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return We(n),null;case 1:return an(n.type)&&_s(),We(n),null;case 3:return r=n.stateNode,Ir(),me(sn),me(Ke),Nl(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(ss(n)?n.flags|=4:e===null||e.memoizedState.isDehydrated&&!(n.flags&256)||(n.flags|=1024,_n!==null&&(Ua(_n),_n=null))),Da(e,n),We(n),null;case 5:Pl(n);var o=Ht(Po.current);if(t=n.type,e!==null&&n.stateNode!=null)bf(e,n,t,r,o),e.ref!==n.ref&&(n.flags|=512,n.flags|=2097152);else{if(!r){if(n.stateNode===null)throw Error(M(166));return We(n),null}if(e=Ht(Qn.current),ss(n)){r=n.stateNode,t=n.type;var s=n.memoizedProps;switch(r[Kn]=n,r[To]=s,e=(n.mode&1)!==0,t){case"dialog":pe("cancel",r),pe("close",r);break;case"iframe":case"object":case"embed":pe("load",r);break;case"video":case"audio":for(o=0;o<so.length;o++)pe(so[o],r);break;case"source":pe("error",r);break;case"img":case"image":case"link":pe("error",r),pe("load",r);break;case"details":pe("toggle",r);break;case"input":mc(r,s),pe("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},pe("invalid",r);break;case"textarea":yc(r,s),pe("invalid",r)}ca(t,s),o=null;for(var i in s)if(s.hasOwnProperty(i)){var a=s[i];i==="children"?typeof a=="string"?r.textContent!==a&&(s.suppressHydrationWarning!==!0&&os(r.textContent,a,e),o=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&os(r.textContent,a,e),o=["children",""+a]):go.hasOwnProperty(i)&&a!=null&&i==="onScroll"&&pe("scroll",r)}switch(t){case"input":Yo(r),gc(r,s,!0);break;case"textarea":Yo(r),vc(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Is)}r=o,n.updateQueue=r,r!==null&&(n.flags|=4)}else{i=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=od(t)),e==="http://www.w3.org/1999/xhtml"?t==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(t,{is:r.is}):(e=i.createElement(t),t==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,t),e[Kn]=n,e[To]=r,Nf(e,n,!1,!1),n.stateNode=e;e:{switch(i=ua(t,r),t){case"dialog":pe("cancel",e),pe("close",e),o=r;break;case"iframe":case"object":case"embed":pe("load",e),o=r;break;case"video":case"audio":for(o=0;o<so.length;o++)pe(so[o],e);o=r;break;case"source":pe("error",e),o=r;break;case"img":case"image":case"link":pe("error",e),pe("load",e),o=r;break;case"details":pe("toggle",e),o=r;break;case"input":mc(e,r),o=oa(e,r),pe("invalid",e);break;case"option":o=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},o=ke({},r,{value:void 0}),pe("invalid",e);break;case"textarea":yc(e,r),o=aa(e,r),pe("invalid",e);break;default:o=r}ca(t,o),a=o;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?ad(e,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&sd(e,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&yo(e,l):typeof l=="number"&&yo(e,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(go.hasOwnProperty(s)?l!=null&&s==="onScroll"&&pe("scroll",e):l!=null&&sl(e,s,l,i))}switch(t){case"input":Yo(e),gc(e,r,!1);break;case"textarea":Yo(e),vc(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Nt(r.value));break;case"select":e.multiple=!!r.multiple,s=r.value,s!=null?Sr(e,!!r.multiple,s,!1):r.defaultValue!=null&&Sr(e,!!r.multiple,r.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=Is)}switch(t){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(n.flags|=4)}n.ref!==null&&(n.flags|=512,n.flags|=2097152)}return We(n),null;case 6:if(e&&n.stateNode!=null)Af(e,n,e.memoizedProps,r);else{if(typeof r!="string"&&n.stateNode===null)throw Error(M(166));if(t=Ht(Po.current),Ht(Qn.current),ss(n)){if(r=n.stateNode,t=n.memoizedProps,r[Kn]=n,(s=r.nodeValue!==t)&&(e=pn,e!==null))switch(e.tag){case 3:os(r.nodeValue,t,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&os(r.nodeValue,t,(e.mode&1)!==0)}s&&(n.flags|=4)}else r=(t.nodeType===9?t:t.ownerDocument).createTextNode(r),r[Kn]=n,n.stateNode=r}return We(n),null;case 13:if(me(we),r=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ge&&hn!==null&&n.mode&1&&!(n.flags&128))Gd(),zr(),n.flags|=98560,s=!1;else if(s=ss(n),r!==null&&r.dehydrated!==null){if(e===null){if(!s)throw Error(M(318));if(s=n.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(M(317));s[Kn]=n}else zr(),!(n.flags&128)&&(n.memoizedState=null),n.flags|=4;We(n),s=!1}else _n!==null&&(Ua(_n),_n=null),s=!0;if(!s)return n.flags&65536?n:null}return n.flags&128?(n.lanes=t,n):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(n.child.flags|=8192,n.mode&1&&(e===null||we.current&1?be===0&&(be=3):Bl())),n.updateQueue!==null&&(n.flags|=4),We(n),null);case 4:return Ir(),Da(e,n),e===null&&Co(n.stateNode.containerInfo),We(n),null;case 10:return Cl(n.type._context),We(n),null;case 17:return an(n.type)&&_s(),We(n),null;case 19:if(me(we),s=n.memoizedState,s===null)return We(n),null;if(r=(n.flags&128)!==0,i=s.rendering,i===null)if(r)Jr(s,!1);else{if(be!==0||e!==null&&e.flags&128)for(e=n.child;e!==null;){if(i=Vs(e),i!==null){for(n.flags|=128,Jr(s,!1),r=i.updateQueue,r!==null&&(n.updateQueue=r,n.flags|=4),n.subtreeFlags=0,r=t,t=n.child;t!==null;)s=t,e=r,s.flags&=14680066,i=s.alternate,i===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=i.childLanes,s.lanes=i.lanes,s.child=i.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=i.memoizedProps,s.memoizedState=i.memoizedState,s.updateQueue=i.updateQueue,s.type=i.type,e=i.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t=t.sibling;return he(we,we.current&1|2),n.child}e=e.sibling}s.tail!==null&&je()>Dr&&(n.flags|=128,r=!0,Jr(s,!1),n.lanes=4194304)}else{if(!r)if(e=Vs(i),e!==null){if(n.flags|=128,r=!0,t=e.updateQueue,t!==null&&(n.updateQueue=t,n.flags|=4),Jr(s,!0),s.tail===null&&s.tailMode==="hidden"&&!i.alternate&&!ge)return We(n),null}else 2*je()-s.renderingStartTime>Dr&&t!==1073741824&&(n.flags|=128,r=!0,Jr(s,!1),n.lanes=4194304);s.isBackwards?(i.sibling=n.child,n.child=i):(t=s.last,t!==null?t.sibling=i:n.child=i,s.last=i)}return s.tail!==null?(n=s.tail,s.rendering=n,s.tail=n.sibling,s.renderingStartTime=je(),n.sibling=null,t=we.current,he(we,r?t&1|2:t&1),n):(We(n),null);case 22:case 23:return Fl(),r=n.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(n.flags|=8192),r&&n.mode&1?fn&1073741824&&(We(n),n.subtreeFlags&6&&(n.flags|=8192)):We(n),null;case 24:return null;case 25:return null}throw Error(M(156,n.tag))}function km(e,n){switch(xl(n),n.tag){case 1:return an(n.type)&&_s(),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Ir(),me(sn),me(Ke),Nl(),e=n.flags,e&65536&&!(e&128)?(n.flags=e&-65537|128,n):null;case 5:return Pl(n),null;case 13:if(me(we),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(M(340));zr()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return me(we),null;case 4:return Ir(),null;case 10:return Cl(n.type._context),null;case 22:case 23:return Fl(),null;case 24:return null;default:return null}}var ls=!1,He=!1,Sm=typeof WeakSet=="function"?WeakSet:Set,O=null;function gr(e,n){var t=e.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(r){Ee(e,n,r)}else t.current=null}function Ra(e,n,t){try{t()}catch(r){Ee(e,n,r)}}var au=!1;function Em(e,n){if(xa=As,e=_d(),vl(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{t=(t=e.ownerDocument)&&t.defaultView||window;var r=t.getSelection&&t.getSelection();if(r&&r.rangeCount!==0){t=r.anchorNode;var o=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var i=0,a=-1,l=-1,d=0,h=0,f=e,m=null;n:for(;;){for(var k;f!==t||o!==0&&f.nodeType!==3||(a=i+o),f!==s||r!==0&&f.nodeType!==3||(l=i+r),f.nodeType===3&&(i+=f.nodeValue.length),(k=f.firstChild)!==null;)m=f,f=k;for(;;){if(f===e)break n;if(m===t&&++d===o&&(a=i),m===s&&++h===r&&(l=i),(k=f.nextSibling)!==null)break;f=m,m=f.parentNode}f=k}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(ka={focusedElem:e,selectionRange:t},As=!1,O=n;O!==null;)if(n=O,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,O=e;else for(;O!==null;){n=O;try{var v=n.alternate;if(n.flags&1024)switch(n.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var x=v.memoizedProps,_=v.memoizedState,g=n.stateNode,u=g.getSnapshotBeforeUpdate(n.elementType===n.type?x:zn(n.type,x),_);g.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var y=n.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(M(163))}}catch(C){Ee(n,n.return,C)}if(e=n.sibling,e!==null){e.return=n.return,O=e;break}O=n.return}return v=au,au=!1,v}function ho(e,n,t){var r=n.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&e)===e){var s=o.destroy;o.destroy=void 0,s!==void 0&&Ra(n,t,s)}o=o.next}while(o!==r)}}function ci(e,n){if(n=n.updateQueue,n=n!==null?n.lastEffect:null,n!==null){var t=n=n.next;do{if((t.tag&e)===e){var r=t.create;t.destroy=r()}t=t.next}while(t!==n)}}function Oa(e){var n=e.ref;if(n!==null){var t=e.stateNode;switch(e.tag){case 5:e=t;break;default:e=t}typeof n=="function"?n(e):n.current=e}}function zf(e){var n=e.alternate;n!==null&&(e.alternate=null,zf(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&(delete n[Kn],delete n[To],delete n[Ca],delete n[sm],delete n[im])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Lf(e){return e.tag===5||e.tag===3||e.tag===4}function lu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Lf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function $a(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.nodeType===8?t.parentNode.insertBefore(e,n):t.insertBefore(e,n):(t.nodeType===8?(n=t.parentNode,n.insertBefore(e,t)):(n=t,n.appendChild(e)),t=t._reactRootContainer,t!=null||n.onclick!==null||(n.onclick=Is));else if(r!==4&&(e=e.child,e!==null))for($a(e,n,t),e=e.sibling;e!==null;)$a(e,n,t),e=e.sibling}function Fa(e,n,t){var r=e.tag;if(r===5||r===6)e=e.stateNode,n?t.insertBefore(e,n):t.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Fa(e,n,t),e=e.sibling;e!==null;)Fa(e,n,t),e=e.sibling}var Oe=null,In=!1;function ft(e,n,t){for(t=t.child;t!==null;)If(e,n,t),t=t.sibling}function If(e,n,t){if(Gn&&typeof Gn.onCommitFiberUnmount=="function")try{Gn.onCommitFiberUnmount(ni,t)}catch{}switch(t.tag){case 5:He||gr(t,n);case 6:var r=Oe,o=In;Oe=null,ft(e,n,t),Oe=r,In=o,Oe!==null&&(In?(e=Oe,t=t.stateNode,e.nodeType===8?e.parentNode.removeChild(t):e.removeChild(t)):Oe.removeChild(t.stateNode));break;case 18:Oe!==null&&(In?(e=Oe,t=t.stateNode,e.nodeType===8?_i(e.parentNode,t):e.nodeType===1&&_i(e,t),ko(e)):_i(Oe,t.stateNode));break;case 4:r=Oe,o=In,Oe=t.stateNode.containerInfo,In=!0,ft(e,n,t),Oe=r,In=o;break;case 0:case 11:case 14:case 15:if(!He&&(r=t.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){o=r=r.next;do{var s=o,i=s.destroy;s=s.tag,i!==void 0&&(s&2||s&4)&&Ra(t,n,i),o=o.next}while(o!==r)}ft(e,n,t);break;case 1:if(!He&&(gr(t,n),r=t.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=t.memoizedProps,r.state=t.memoizedState,r.componentWillUnmount()}catch(a){Ee(t,n,a)}ft(e,n,t);break;case 21:ft(e,n,t);break;case 22:t.mode&1?(He=(r=He)||t.memoizedState!==null,ft(e,n,t),He=r):ft(e,n,t);break;default:ft(e,n,t)}}function cu(e){var n=e.updateQueue;if(n!==null){e.updateQueue=null;var t=e.stateNode;t===null&&(t=e.stateNode=new Sm),n.forEach(function(r){var o=zm.bind(null,e,r);t.has(r)||(t.add(r),r.then(o,o))})}}function An(e,n){var t=n.deletions;if(t!==null)for(var r=0;r<t.length;r++){var o=t[r];try{var s=e,i=n,a=i;e:for(;a!==null;){switch(a.tag){case 5:Oe=a.stateNode,In=!1;break e;case 3:Oe=a.stateNode.containerInfo,In=!0;break e;case 4:Oe=a.stateNode.containerInfo,In=!0;break e}a=a.return}if(Oe===null)throw Error(M(160));If(s,i,o),Oe=null,In=!1;var l=o.alternate;l!==null&&(l.return=null),o.return=null}catch(d){Ee(o,n,d)}}if(n.subtreeFlags&12854)for(n=n.child;n!==null;)_f(n,e),n=n.sibling}function _f(e,n){var t=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(An(n,e),Un(e),r&4){try{ho(3,e,e.return),ci(3,e)}catch(x){Ee(e,e.return,x)}try{ho(5,e,e.return)}catch(x){Ee(e,e.return,x)}}break;case 1:An(n,e),Un(e),r&512&&t!==null&&gr(t,t.return);break;case 5:if(An(n,e),Un(e),r&512&&t!==null&&gr(t,t.return),e.flags&32){var o=e.stateNode;try{yo(o,"")}catch(x){Ee(e,e.return,x)}}if(r&4&&(o=e.stateNode,o!=null)){var s=e.memoizedProps,i=t!==null?t.memoizedProps:s,a=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&td(o,s),ua(a,i);var d=ua(a,s);for(i=0;i<l.length;i+=2){var h=l[i],f=l[i+1];h==="style"?ad(o,f):h==="dangerouslySetInnerHTML"?sd(o,f):h==="children"?yo(o,f):sl(o,h,f,d)}switch(a){case"input":sa(o,s);break;case"textarea":rd(o,s);break;case"select":var m=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!s.multiple;var k=s.value;k!=null?Sr(o,!!s.multiple,k,!1):m!==!!s.multiple&&(s.defaultValue!=null?Sr(o,!!s.multiple,s.defaultValue,!0):Sr(o,!!s.multiple,s.multiple?[]:"",!1))}o[To]=s}catch(x){Ee(e,e.return,x)}}break;case 6:if(An(n,e),Un(e),r&4){if(e.stateNode===null)throw Error(M(162));o=e.stateNode,s=e.memoizedProps;try{o.nodeValue=s}catch(x){Ee(e,e.return,x)}}break;case 3:if(An(n,e),Un(e),r&4&&t!==null&&t.memoizedState.isDehydrated)try{ko(n.containerInfo)}catch(x){Ee(e,e.return,x)}break;case 4:An(n,e),Un(e);break;case 13:An(n,e),Un(e),o=e.child,o.flags&8192&&(s=o.memoizedState!==null,o.stateNode.isHidden=s,!s||o.alternate!==null&&o.alternate.memoizedState!==null||(Ol=je())),r&4&&cu(e);break;case 22:if(h=t!==null&&t.memoizedState!==null,e.mode&1?(He=(d=He)||h,An(n,e),He=d):An(n,e),Un(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!h&&e.mode&1)for(O=e,h=e.child;h!==null;){for(f=O=h;O!==null;){switch(m=O,k=m.child,m.tag){case 0:case 11:case 14:case 15:ho(4,m,m.return);break;case 1:gr(m,m.return);var v=m.stateNode;if(typeof v.componentWillUnmount=="function"){r=m,t=m.return;try{n=r,v.props=n.memoizedProps,v.state=n.memoizedState,v.componentWillUnmount()}catch(x){Ee(r,t,x)}}break;case 5:gr(m,m.return);break;case 22:if(m.memoizedState!==null){du(f);continue}}k!==null?(k.return=m,O=k):du(f)}h=h.sibling}e:for(h=null,f=e;;){if(f.tag===5){if(h===null){h=f;try{o=f.stateNode,d?(s=o.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=f.stateNode,l=f.memoizedProps.style,i=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=id("display",i))}catch(x){Ee(e,e.return,x)}}}else if(f.tag===6){if(h===null)try{f.stateNode.nodeValue=d?"":f.memoizedProps}catch(x){Ee(e,e.return,x)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===e)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===e)break e;for(;f.sibling===null;){if(f.return===null||f.return===e)break e;h===f&&(h=null),f=f.return}h===f&&(h=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:An(n,e),Un(e),r&4&&cu(e);break;case 21:break;default:An(n,e),Un(e)}}function Un(e){var n=e.flags;if(n&2){try{e:{for(var t=e.return;t!==null;){if(Lf(t)){var r=t;break e}t=t.return}throw Error(M(160))}switch(r.tag){case 5:var o=r.stateNode;r.flags&32&&(yo(o,""),r.flags&=-33);var s=lu(e);Fa(e,s,o);break;case 3:case 4:var i=r.stateNode.containerInfo,a=lu(e);$a(e,a,i);break;default:throw Error(M(161))}}catch(l){Ee(e,e.return,l)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function Cm(e,n,t){O=e,Df(e)}function Df(e,n,t){for(var r=(e.mode&1)!==0;O!==null;){var o=O,s=o.child;if(o.tag===22&&r){var i=o.memoizedState!==null||ls;if(!i){var a=o.alternate,l=a!==null&&a.memoizedState!==null||He;a=ls;var d=He;if(ls=i,(He=l)&&!d)for(O=o;O!==null;)i=O,l=i.child,i.tag===22&&i.memoizedState!==null?fu(o):l!==null?(l.return=i,O=l):fu(o);for(;s!==null;)O=s,Df(s),s=s.sibling;O=o,ls=a,He=d}uu(e)}else o.subtreeFlags&8772&&s!==null?(s.return=o,O=s):uu(e)}}function uu(e){for(;O!==null;){var n=O;if(n.flags&8772){var t=n.alternate;try{if(n.flags&8772)switch(n.tag){case 0:case 11:case 15:He||ci(5,n);break;case 1:var r=n.stateNode;if(n.flags&4&&!He)if(t===null)r.componentDidMount();else{var o=n.elementType===n.type?t.memoizedProps:zn(n.type,t.memoizedProps);r.componentDidUpdate(o,t.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=n.updateQueue;s!==null&&Gc(n,s,r);break;case 3:var i=n.updateQueue;if(i!==null){if(t=null,n.child!==null)switch(n.child.tag){case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}Gc(n,i,t)}break;case 5:var a=n.stateNode;if(t===null&&n.flags&4){t=a;var l=n.memoizedProps;switch(n.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(n.memoizedState===null){var d=n.alternate;if(d!==null){var h=d.memoizedState;if(h!==null){var f=h.dehydrated;f!==null&&ko(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(M(163))}He||n.flags&512&&Oa(n)}catch(m){Ee(n,n.return,m)}}if(n===e){O=null;break}if(t=n.sibling,t!==null){t.return=n.return,O=t;break}O=n.return}}function du(e){for(;O!==null;){var n=O;if(n===e){O=null;break}var t=n.sibling;if(t!==null){t.return=n.return,O=t;break}O=n.return}}function fu(e){for(;O!==null;){var n=O;try{switch(n.tag){case 0:case 11:case 15:var t=n.return;try{ci(4,n)}catch(l){Ee(n,t,l)}break;case 1:var r=n.stateNode;if(typeof r.componentDidMount=="function"){var o=n.return;try{r.componentDidMount()}catch(l){Ee(n,o,l)}}var s=n.return;try{Oa(n)}catch(l){Ee(n,s,l)}break;case 5:var i=n.return;try{Oa(n)}catch(l){Ee(n,i,l)}}}catch(l){Ee(n,n.return,l)}if(n===e){O=null;break}var a=n.sibling;if(a!==null){a.return=n.return,O=a;break}O=n.return}}var jm=Math.ceil,Hs=ut.ReactCurrentDispatcher,Dl=ut.ReactCurrentOwner,jn=ut.ReactCurrentBatchConfig,ne=0,De=null,Te=null,Fe=0,fn=0,yr=Lt(0),be=0,zo=null,Jt=0,ui=0,Rl=0,po=null,rn=null,Ol=0,Dr=1/0,et=null,Ks=!1,Ba=null,Tt=null,cs=!1,wt=null,Zs=0,mo=0,Va=null,ks=-1,Ss=0;function qe(){return ne&6?je():ks!==-1?ks:ks=je()}function Mt(e){return e.mode&1?ne&2&&Fe!==0?Fe&-Fe:lm.transition!==null?(Ss===0&&(Ss=wd()),Ss):(e=ae,e!==0||(e=window.event,e=e===void 0?16:Td(e.type)),e):1}function On(e,n,t,r){if(50<mo)throw mo=0,Va=null,Error(M(185));Ro(e,t,r),(!(ne&2)||e!==De)&&(e===De&&(!(ne&2)&&(ui|=t),be===4&&yt(e,Fe)),ln(e,r),t===1&&ne===0&&!(n.mode&1)&&(Dr=je()+500,ii&&It()))}function ln(e,n){var t=e.callbackNode;lp(e,n);var r=bs(e,e===De?Fe:0);if(r===0)t!==null&&kc(t),e.callbackNode=null,e.callbackPriority=0;else if(n=r&-r,e.callbackPriority!==n){if(t!=null&&kc(t),n===1)e.tag===0?am(hu.bind(null,e)):Hd(hu.bind(null,e)),rm(function(){!(ne&6)&&It()}),t=null;else{switch(xd(r)){case 1:t=ul;break;case 4:t=yd;break;case 16:t=Ns;break;case 536870912:t=vd;break;default:t=Ns}t=Uf(t,Rf.bind(null,e))}e.callbackPriority=n,e.callbackNode=t}}function Rf(e,n){if(ks=-1,Ss=0,ne&6)throw Error(M(327));var t=e.callbackNode;if(Mr()&&e.callbackNode!==t)return null;var r=bs(e,e===De?Fe:0);if(r===0)return null;if(r&30||r&e.expiredLanes||n)n=Gs(e,r);else{n=r;var o=ne;ne|=2;var s=$f();(De!==e||Fe!==n)&&(et=null,Dr=je()+500,Gt(e,n));do try{Pm();break}catch(a){Of(e,a)}while(!0);El(),Hs.current=s,ne=o,Te!==null?n=0:(De=null,Fe=0,n=be)}if(n!==0){if(n===2&&(o=ma(e),o!==0&&(r=o,n=Wa(e,o))),n===1)throw t=zo,Gt(e,0),yt(e,r),ln(e,je()),t;if(n===6)yt(e,r);else{if(o=e.current.alternate,!(r&30)&&!Tm(o)&&(n=Gs(e,r),n===2&&(s=ma(e),s!==0&&(r=s,n=Wa(e,s))),n===1))throw t=zo,Gt(e,0),yt(e,r),ln(e,je()),t;switch(e.finishedWork=o,e.finishedLanes=r,n){case 0:case 1:throw Error(M(345));case 2:Ft(e,rn,et);break;case 3:if(yt(e,r),(r&130023424)===r&&(n=Ol+500-je(),10<n)){if(bs(e,0)!==0)break;if(o=e.suspendedLanes,(o&r)!==r){qe(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Ea(Ft.bind(null,e,rn,et),n);break}Ft(e,rn,et);break;case 4:if(yt(e,r),(r&4194240)===r)break;for(n=e.eventTimes,o=-1;0<r;){var i=31-Rn(r);s=1<<i,i=n[i],i>o&&(o=i),r&=~s}if(r=o,r=je()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*jm(r/1960))-r,10<r){e.timeoutHandle=Ea(Ft.bind(null,e,rn,et),r);break}Ft(e,rn,et);break;case 5:Ft(e,rn,et);break;default:throw Error(M(329))}}}return ln(e,je()),e.callbackNode===t?Rf.bind(null,e):null}function Wa(e,n){var t=po;return e.current.memoizedState.isDehydrated&&(Gt(e,n).flags|=256),e=Gs(e,n),e!==2&&(n=rn,rn=t,n!==null&&Ua(n)),e}function Ua(e){rn===null?rn=e:rn.push.apply(rn,e)}function Tm(e){for(var n=e;;){if(n.flags&16384){var t=n.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var r=0;r<t.length;r++){var o=t[r],s=o.getSnapshot;o=o.value;try{if(!Fn(s(),o))return!1}catch{return!1}}}if(t=n.child,n.subtreeFlags&16384&&t!==null)t.return=n,n=t;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function yt(e,n){for(n&=~Rl,n&=~ui,e.suspendedLanes|=n,e.pingedLanes&=~n,e=e.expirationTimes;0<n;){var t=31-Rn(n),r=1<<t;e[t]=-1,n&=~r}}function hu(e){if(ne&6)throw Error(M(327));Mr();var n=bs(e,0);if(!(n&1))return ln(e,je()),null;var t=Gs(e,n);if(e.tag!==0&&t===2){var r=ma(e);r!==0&&(n=r,t=Wa(e,r))}if(t===1)throw t=zo,Gt(e,0),yt(e,n),ln(e,je()),t;if(t===6)throw Error(M(345));return e.finishedWork=e.current.alternate,e.finishedLanes=n,Ft(e,rn,et),ln(e,je()),null}function $l(e,n){var t=ne;ne|=1;try{return e(n)}finally{ne=t,ne===0&&(Dr=je()+500,ii&&It())}}function er(e){wt!==null&&wt.tag===0&&!(ne&6)&&Mr();var n=ne;ne|=1;var t=jn.transition,r=ae;try{if(jn.transition=null,ae=1,e)return e()}finally{ae=r,jn.transition=t,ne=n,!(ne&6)&&It()}}function Fl(){fn=yr.current,me(yr)}function Gt(e,n){e.finishedWork=null,e.finishedLanes=0;var t=e.timeoutHandle;if(t!==-1&&(e.timeoutHandle=-1,tm(t)),Te!==null)for(t=Te.return;t!==null;){var r=t;switch(xl(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&_s();break;case 3:Ir(),me(sn),me(Ke),Nl();break;case 5:Pl(r);break;case 4:Ir();break;case 13:me(we);break;case 19:me(we);break;case 10:Cl(r.type._context);break;case 22:case 23:Fl()}t=t.return}if(De=e,Te=e=Pt(e.current,null),Fe=fn=n,be=0,zo=null,Rl=ui=Jt=0,rn=po=null,Ut!==null){for(n=0;n<Ut.length;n++)if(t=Ut[n],r=t.interleaved,r!==null){t.interleaved=null;var o=r.next,s=t.pending;if(s!==null){var i=s.next;s.next=o,r.next=i}t.pending=r}Ut=null}return e}function Of(e,n){do{var t=Te;try{if(El(),vs.current=Us,Ws){for(var r=xe.memoizedState;r!==null;){var o=r.queue;o!==null&&(o.pending=null),r=r.next}Ws=!1}if(qt=0,_e=Ne=xe=null,fo=!1,No=0,Dl.current=null,t===null||t.return===null){be=1,zo=n,Te=null;break}e:{var s=e,i=t.return,a=t,l=n;if(n=Fe,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var d=l,h=a,f=h.tag;if(!(h.mode&1)&&(f===0||f===11||f===15)){var m=h.alternate;m?(h.updateQueue=m.updateQueue,h.memoizedState=m.memoizedState,h.lanes=m.lanes):(h.updateQueue=null,h.memoizedState=null)}var k=eu(i);if(k!==null){k.flags&=-257,nu(k,i,a,s,n),k.mode&1&&Jc(s,d,n),n=k,l=d;var v=n.updateQueue;if(v===null){var x=new Set;x.add(l),n.updateQueue=x}else v.add(l);break e}else{if(!(n&1)){Jc(s,d,n),Bl();break e}l=Error(M(426))}}else if(ge&&a.mode&1){var _=eu(i);if(_!==null){!(_.flags&65536)&&(_.flags|=256),nu(_,i,a,s,n),kl(_r(l,a));break e}}s=l=_r(l,a),be!==4&&(be=2),po===null?po=[s]:po.push(s),s=i;do{switch(s.tag){case 3:s.flags|=65536,n&=-n,s.lanes|=n;var g=kf(s,l,n);Zc(s,g);break e;case 1:a=l;var u=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof u.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(Tt===null||!Tt.has(y)))){s.flags|=65536,n&=-n,s.lanes|=n;var C=Sf(s,a,n);Zc(s,C);break e}}s=s.return}while(s!==null)}Bf(t)}catch(N){n=N,Te===t&&t!==null&&(Te=t=t.return);continue}break}while(!0)}function $f(){var e=Hs.current;return Hs.current=Us,e===null?Us:e}function Bl(){(be===0||be===3||be===2)&&(be=4),De===null||!(Jt&268435455)&&!(ui&268435455)||yt(De,Fe)}function Gs(e,n){var t=ne;ne|=2;var r=$f();(De!==e||Fe!==n)&&(et=null,Gt(e,n));do try{Mm();break}catch(o){Of(e,o)}while(!0);if(El(),ne=t,Hs.current=r,Te!==null)throw Error(M(261));return De=null,Fe=0,be}function Mm(){for(;Te!==null;)Ff(Te)}function Pm(){for(;Te!==null&&!Jh();)Ff(Te)}function Ff(e){var n=Wf(e.alternate,e,fn);e.memoizedProps=e.pendingProps,n===null?Bf(e):Te=n,Dl.current=null}function Bf(e){var n=e;do{var t=n.alternate;if(e=n.return,n.flags&32768){if(t=km(t,n),t!==null){t.flags&=32767,Te=t;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{be=6,Te=null;return}}else if(t=xm(t,n,fn),t!==null){Te=t;return}if(n=n.sibling,n!==null){Te=n;return}Te=n=e}while(n!==null);be===0&&(be=5)}function Ft(e,n,t){var r=ae,o=jn.transition;try{jn.transition=null,ae=1,Nm(e,n,t,r)}finally{jn.transition=o,ae=r}return null}function Nm(e,n,t,r){do Mr();while(wt!==null);if(ne&6)throw Error(M(327));t=e.finishedWork;var o=e.finishedLanes;if(t===null)return null;if(e.finishedWork=null,e.finishedLanes=0,t===e.current)throw Error(M(177));e.callbackNode=null,e.callbackPriority=0;var s=t.lanes|t.childLanes;if(cp(e,s),e===De&&(Te=De=null,Fe=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||cs||(cs=!0,Uf(Ns,function(){return Mr(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=jn.transition,jn.transition=null;var i=ae;ae=1;var a=ne;ne|=4,Dl.current=null,Em(e,t),_f(t,e),Qp(ka),As=!!xa,ka=xa=null,e.current=t,Cm(t),ep(),ne=a,ae=i,jn.transition=s}else e.current=t;if(cs&&(cs=!1,wt=e,Zs=o),s=e.pendingLanes,s===0&&(Tt=null),rp(t.stateNode),ln(e,je()),n!==null)for(r=e.onRecoverableError,t=0;t<n.length;t++)o=n[t],r(o.value,{componentStack:o.stack,digest:o.digest});if(Ks)throw Ks=!1,e=Ba,Ba=null,e;return Zs&1&&e.tag!==0&&Mr(),s=e.pendingLanes,s&1?e===Va?mo++:(mo=0,Va=e):mo=0,It(),null}function Mr(){if(wt!==null){var e=xd(Zs),n=jn.transition,t=ae;try{if(jn.transition=null,ae=16>e?16:e,wt===null)var r=!1;else{if(e=wt,wt=null,Zs=0,ne&6)throw Error(M(331));var o=ne;for(ne|=4,O=e.current;O!==null;){var s=O,i=s.child;if(O.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var d=a[l];for(O=d;O!==null;){var h=O;switch(h.tag){case 0:case 11:case 15:ho(8,h,s)}var f=h.child;if(f!==null)f.return=h,O=f;else for(;O!==null;){h=O;var m=h.sibling,k=h.return;if(zf(h),h===d){O=null;break}if(m!==null){m.return=k,O=m;break}O=k}}}var v=s.alternate;if(v!==null){var x=v.child;if(x!==null){v.child=null;do{var _=x.sibling;x.sibling=null,x=_}while(x!==null)}}O=s}}if(s.subtreeFlags&2064&&i!==null)i.return=s,O=i;else e:for(;O!==null;){if(s=O,s.flags&2048)switch(s.tag){case 0:case 11:case 15:ho(9,s,s.return)}var g=s.sibling;if(g!==null){g.return=s.return,O=g;break e}O=s.return}}var u=e.current;for(O=u;O!==null;){i=O;var y=i.child;if(i.subtreeFlags&2064&&y!==null)y.return=i,O=y;else e:for(i=u;O!==null;){if(a=O,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:ci(9,a)}}catch(N){Ee(a,a.return,N)}if(a===i){O=null;break e}var C=a.sibling;if(C!==null){C.return=a.return,O=C;break e}O=a.return}}if(ne=o,It(),Gn&&typeof Gn.onPostCommitFiberRoot=="function")try{Gn.onPostCommitFiberRoot(ni,e)}catch{}r=!0}return r}finally{ae=t,jn.transition=n}}return!1}function pu(e,n,t){n=_r(t,n),n=kf(e,n,1),e=jt(e,n,1),n=qe(),e!==null&&(Ro(e,1,n),ln(e,n))}function Ee(e,n,t){if(e.tag===3)pu(e,e,t);else for(;n!==null;){if(n.tag===3){pu(n,e,t);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Tt===null||!Tt.has(r))){e=_r(t,e),e=Sf(n,e,1),n=jt(n,e,1),e=qe(),n!==null&&(Ro(n,1,e),ln(n,e));break}}n=n.return}}function bm(e,n,t){var r=e.pingCache;r!==null&&r.delete(n),n=qe(),e.pingedLanes|=e.suspendedLanes&t,De===e&&(Fe&t)===t&&(be===4||be===3&&(Fe&130023424)===Fe&&500>je()-Ol?Gt(e,0):Rl|=t),ln(e,n)}function Vf(e,n){n===0&&(e.mode&1?(n=Jo,Jo<<=1,!(Jo&130023424)&&(Jo=4194304)):n=1);var t=qe();e=at(e,n),e!==null&&(Ro(e,n,t),ln(e,t))}function Am(e){var n=e.memoizedState,t=0;n!==null&&(t=n.retryLane),Vf(e,t)}function zm(e,n){var t=0;switch(e.tag){case 13:var r=e.stateNode,o=e.memoizedState;o!==null&&(t=o.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(M(314))}r!==null&&r.delete(n),Vf(e,t)}var Wf;Wf=function(e,n,t){if(e!==null)if(e.memoizedProps!==n.pendingProps||sn.current)on=!0;else{if(!(e.lanes&t)&&!(n.flags&128))return on=!1,wm(e,n,t);on=!!(e.flags&131072)}else on=!1,ge&&n.flags&1048576&&Kd(n,Os,n.index);switch(n.lanes=0,n.tag){case 2:var r=n.type;xs(e,n),e=n.pendingProps;var o=Ar(n,Ke.current);Tr(n,t),o=Al(null,n,r,e,o,t);var s=zl();return n.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(n.tag=1,n.memoizedState=null,n.updateQueue=null,an(r)?(s=!0,Ds(n)):s=!1,n.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,Tl(n),o.updater=li,n.stateNode=o,o._reactInternals=n,ba(n,r,e,t),n=La(null,n,r,!0,s,t)):(n.tag=0,ge&&s&&wl(n),Xe(null,n,o,t),n=n.child),n;case 16:r=n.elementType;e:{switch(xs(e,n),e=n.pendingProps,o=r._init,r=o(r._payload),n.type=r,o=n.tag=Im(r),e=zn(r,e),o){case 0:n=za(null,n,r,e,t);break e;case 1:n=ou(null,n,r,e,t);break e;case 11:n=tu(null,n,r,e,t);break e;case 14:n=ru(null,n,r,zn(r.type,e),t);break e}throw Error(M(306,r,""))}return n;case 0:return r=n.type,o=n.pendingProps,o=n.elementType===r?o:zn(r,o),za(e,n,r,o,t);case 1:return r=n.type,o=n.pendingProps,o=n.elementType===r?o:zn(r,o),ou(e,n,r,o,t);case 3:e:{if(Tf(n),e===null)throw Error(M(387));r=n.pendingProps,s=n.memoizedState,o=s.element,qd(e,n),Bs(n,r,null,t);var i=n.memoizedState;if(r=i.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},n.updateQueue.baseState=s,n.memoizedState=s,n.flags&256){o=_r(Error(M(423)),n),n=su(e,n,r,t,o);break e}else if(r!==o){o=_r(Error(M(424)),n),n=su(e,n,r,t,o);break e}else for(hn=Ct(n.stateNode.containerInfo.firstChild),pn=n,ge=!0,_n=null,t=Yd(n,null,r,t),n.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(zr(),r===o){n=lt(e,n,t);break e}Xe(e,n,r,t)}n=n.child}return n;case 5:return Jd(n),e===null&&Ma(n),r=n.type,o=n.pendingProps,s=e!==null?e.memoizedProps:null,i=o.children,Sa(r,o)?i=null:s!==null&&Sa(r,s)&&(n.flags|=32),jf(e,n),Xe(e,n,i,t),n.child;case 6:return e===null&&Ma(n),null;case 13:return Mf(e,n,t);case 4:return Ml(n,n.stateNode.containerInfo),r=n.pendingProps,e===null?n.child=Lr(n,null,r,t):Xe(e,n,r,t),n.child;case 11:return r=n.type,o=n.pendingProps,o=n.elementType===r?o:zn(r,o),tu(e,n,r,o,t);case 7:return Xe(e,n,n.pendingProps,t),n.child;case 8:return Xe(e,n,n.pendingProps.children,t),n.child;case 12:return Xe(e,n,n.pendingProps.children,t),n.child;case 10:e:{if(r=n.type._context,o=n.pendingProps,s=n.memoizedProps,i=o.value,he($s,r._currentValue),r._currentValue=i,s!==null)if(Fn(s.value,i)){if(s.children===o.children&&!sn.current){n=lt(e,n,t);break e}}else for(s=n.child,s!==null&&(s.return=n);s!==null;){var a=s.dependencies;if(a!==null){i=s.child;for(var l=a.firstContext;l!==null;){if(l.context===r){if(s.tag===1){l=ot(-1,t&-t),l.tag=2;var d=s.updateQueue;if(d!==null){d=d.shared;var h=d.pending;h===null?l.next=l:(l.next=h.next,h.next=l),d.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),Pa(s.return,t,n),a.lanes|=t;break}l=l.next}}else if(s.tag===10)i=s.type===n.type?null:s.child;else if(s.tag===18){if(i=s.return,i===null)throw Error(M(341));i.lanes|=t,a=i.alternate,a!==null&&(a.lanes|=t),Pa(i,t,n),i=s.sibling}else i=s.child;if(i!==null)i.return=s;else for(i=s;i!==null;){if(i===n){i=null;break}if(s=i.sibling,s!==null){s.return=i.return,i=s;break}i=i.return}s=i}Xe(e,n,o.children,t),n=n.child}return n;case 9:return o=n.type,r=n.pendingProps.children,Tr(n,t),o=Tn(o),r=r(o),n.flags|=1,Xe(e,n,r,t),n.child;case 14:return r=n.type,o=zn(r,n.pendingProps),o=zn(r.type,o),ru(e,n,r,o,t);case 15:return Ef(e,n,n.type,n.pendingProps,t);case 17:return r=n.type,o=n.pendingProps,o=n.elementType===r?o:zn(r,o),xs(e,n),n.tag=1,an(r)?(e=!0,Ds(n)):e=!1,Tr(n,t),xf(n,r,o),ba(n,r,o,t),La(null,n,r,!0,e,t);case 19:return Pf(e,n,t);case 22:return Cf(e,n,t)}throw Error(M(156,n.tag))};function Uf(e,n){return gd(e,n)}function Lm(e,n,t,r){this.tag=e,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function En(e,n,t,r){return new Lm(e,n,t,r)}function Vl(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Im(e){if(typeof e=="function")return Vl(e)?1:0;if(e!=null){if(e=e.$$typeof,e===al)return 11;if(e===ll)return 14}return 2}function Pt(e,n){var t=e.alternate;return t===null?(t=En(e.tag,n,e.key,e.mode),t.elementType=e.elementType,t.type=e.type,t.stateNode=e.stateNode,t.alternate=e,e.alternate=t):(t.pendingProps=n,t.type=e.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=e.flags&14680064,t.childLanes=e.childLanes,t.lanes=e.lanes,t.child=e.child,t.memoizedProps=e.memoizedProps,t.memoizedState=e.memoizedState,t.updateQueue=e.updateQueue,n=e.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},t.sibling=e.sibling,t.index=e.index,t.ref=e.ref,t}function Es(e,n,t,r,o,s){var i=2;if(r=e,typeof e=="function")Vl(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case ar:return Qt(t.children,o,s,n);case il:i=8,o|=8;break;case ea:return e=En(12,t,n,o|2),e.elementType=ea,e.lanes=s,e;case na:return e=En(13,t,n,o),e.elementType=na,e.lanes=s,e;case ta:return e=En(19,t,n,o),e.elementType=ta,e.lanes=s,e;case Ju:return di(t,o,s,n);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Xu:i=10;break e;case qu:i=9;break e;case al:i=11;break e;case ll:i=14;break e;case pt:i=16,r=null;break e}throw Error(M(130,e==null?e:typeof e,""))}return n=En(i,t,n,o),n.elementType=e,n.type=r,n.lanes=s,n}function Qt(e,n,t,r){return e=En(7,e,r,n),e.lanes=t,e}function di(e,n,t,r){return e=En(22,e,r,n),e.elementType=Ju,e.lanes=t,e.stateNode={isHidden:!1},e}function Wi(e,n,t){return e=En(6,e,null,n),e.lanes=t,e}function Ui(e,n,t){return n=En(4,e.children!==null?e.children:[],e.key,n),n.lanes=t,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}function _m(e,n,t,r,o){this.tag=n,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ci(0),this.expirationTimes=Ci(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ci(0),this.identifierPrefix=r,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function Wl(e,n,t,r,o,s,i,a,l){return e=new _m(e,n,t,a,l),n===1?(n=1,s===!0&&(n|=8)):n=0,s=En(3,null,null,n),e.current=s,s.stateNode=e,s.memoizedState={element:r,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},Tl(s),e}function Dm(e,n,t){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ir,key:r==null?null:""+r,children:e,containerInfo:n,implementation:t}}function Hf(e){if(!e)return bt;e=e._reactInternals;e:{if(rr(e)!==e||e.tag!==1)throw Error(M(170));var n=e;do{switch(n.tag){case 3:n=n.stateNode.context;break e;case 1:if(an(n.type)){n=n.stateNode.__reactInternalMemoizedMergedChildContext;break e}}n=n.return}while(n!==null);throw Error(M(171))}if(e.tag===1){var t=e.type;if(an(t))return Ud(e,t,n)}return n}function Kf(e,n,t,r,o,s,i,a,l){return e=Wl(t,r,!0,e,o,s,i,a,l),e.context=Hf(null),t=e.current,r=qe(),o=Mt(t),s=ot(r,o),s.callback=n??null,jt(t,s,o),e.current.lanes=o,Ro(e,o,r),ln(e,r),e}function fi(e,n,t,r){var o=n.current,s=qe(),i=Mt(o);return t=Hf(t),n.context===null?n.context=t:n.pendingContext=t,n=ot(s,i),n.payload={element:e},r=r===void 0?null:r,r!==null&&(n.callback=r),e=jt(o,n,i),e!==null&&(On(e,o,i,s),ys(e,o,i)),i}function Qs(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function mu(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var t=e.retryLane;e.retryLane=t!==0&&t<n?t:n}}function Ul(e,n){mu(e,n),(e=e.alternate)&&mu(e,n)}function Rm(){return null}var Zf=typeof reportError=="function"?reportError:function(e){console.error(e)};function Hl(e){this._internalRoot=e}hi.prototype.render=Hl.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(M(409));fi(e,n,null,null)};hi.prototype.unmount=Hl.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;er(function(){fi(null,e,null,null)}),n[it]=null}};function hi(e){this._internalRoot=e}hi.prototype.unstable_scheduleHydration=function(e){if(e){var n=Ed();e={blockedOn:null,target:e,priority:n};for(var t=0;t<gt.length&&n!==0&&n<gt[t].priority;t++);gt.splice(t,0,e),t===0&&jd(e)}};function Kl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function pi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function gu(){}function Om(e,n,t,r,o){if(o){if(typeof r=="function"){var s=r;r=function(){var d=Qs(i);s.call(d)}}var i=Kf(n,r,e,0,null,!1,!1,"",gu);return e._reactRootContainer=i,e[it]=i.current,Co(e.nodeType===8?e.parentNode:e),er(),i}for(;o=e.lastChild;)e.removeChild(o);if(typeof r=="function"){var a=r;r=function(){var d=Qs(l);a.call(d)}}var l=Wl(e,0,!1,null,null,!1,!1,"",gu);return e._reactRootContainer=l,e[it]=l.current,Co(e.nodeType===8?e.parentNode:e),er(function(){fi(n,l,t,r)}),l}function mi(e,n,t,r,o){var s=t._reactRootContainer;if(s){var i=s;if(typeof o=="function"){var a=o;o=function(){var l=Qs(i);a.call(l)}}fi(n,i,e,o)}else i=Om(t,n,e,o,r);return Qs(i)}kd=function(e){switch(e.tag){case 3:var n=e.stateNode;if(n.current.memoizedState.isDehydrated){var t=oo(n.pendingLanes);t!==0&&(dl(n,t|1),ln(n,je()),!(ne&6)&&(Dr=je()+500,It()))}break;case 13:er(function(){var r=at(e,1);if(r!==null){var o=qe();On(r,e,1,o)}}),Ul(e,1)}};fl=function(e){if(e.tag===13){var n=at(e,134217728);if(n!==null){var t=qe();On(n,e,134217728,t)}Ul(e,134217728)}};Sd=function(e){if(e.tag===13){var n=Mt(e),t=at(e,n);if(t!==null){var r=qe();On(t,e,n,r)}Ul(e,n)}};Ed=function(){return ae};Cd=function(e,n){var t=ae;try{return ae=e,n()}finally{ae=t}};fa=function(e,n,t){switch(n){case"input":if(sa(e,t),n=t.name,t.type==="radio"&&n!=null){for(t=e;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+n)+'][type="radio"]'),n=0;n<t.length;n++){var r=t[n];if(r!==e&&r.form===e.form){var o=si(r);if(!o)throw Error(M(90));nd(r),sa(r,o)}}}break;case"textarea":rd(e,t);break;case"select":n=t.value,n!=null&&Sr(e,!!t.multiple,n,!1)}};ud=$l;dd=er;var $m={usingClientEntryPoint:!1,Events:[$o,dr,si,ld,cd,$l]},eo={findFiberByHostInstance:Wt,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Fm={bundleType:eo.bundleType,version:eo.version,rendererPackageName:eo.rendererPackageName,rendererConfig:eo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ut.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=pd(e),e===null?null:e.stateNode},findFiberByHostInstance:eo.findFiberByHostInstance||Rm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var us=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!us.isDisabled&&us.supportsFiber)try{ni=us.inject(Fm),Gn=us}catch{}}gn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$m;gn.createPortal=function(e,n){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Kl(n))throw Error(M(200));return Dm(e,n,null,t)};gn.createRoot=function(e,n){if(!Kl(e))throw Error(M(299));var t=!1,r="",o=Zf;return n!=null&&(n.unstable_strictMode===!0&&(t=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),n=Wl(e,1,!1,null,null,t,!1,r,o),e[it]=n.current,Co(e.nodeType===8?e.parentNode:e),new Hl(n)};gn.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(M(188)):(e=Object.keys(e).join(","),Error(M(268,e)));return e=pd(n),e=e===null?null:e.stateNode,e};gn.flushSync=function(e){return er(e)};gn.hydrate=function(e,n,t){if(!pi(n))throw Error(M(200));return mi(null,e,n,!0,t)};gn.hydrateRoot=function(e,n,t){if(!Kl(e))throw Error(M(405));var r=t!=null&&t.hydratedSources||null,o=!1,s="",i=Zf;if(t!=null&&(t.unstable_strictMode===!0&&(o=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),n=Kf(n,null,e,1,t??null,o,!1,s,i),e[it]=n.current,Co(e),r)for(e=0;e<r.length;e++)t=r[e],o=t._getVersion,o=o(t._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[t,o]:n.mutableSourceEagerHydrationData.push(t,o);return new hi(n)};gn.render=function(e,n,t){if(!pi(n))throw Error(M(200));return mi(null,e,n,!1,t)};gn.unmountComponentAtNode=function(e){if(!pi(e))throw Error(M(40));return e._reactRootContainer?(er(function(){mi(null,null,e,!1,function(){e._reactRootContainer=null,e[it]=null})}),!0):!1};gn.unstable_batchedUpdates=$l;gn.unstable_renderSubtreeIntoContainer=function(e,n,t,r){if(!pi(t))throw Error(M(200));if(e==null||e._reactInternals===void 0)throw Error(M(38));return mi(e,n,t,!1,r)};gn.version="18.3.1-next-f1338f8080-20240426";function Gf(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Gf)}catch(e){console.error(e)}}Gf(),Zu.exports=gn;var Qf=Zu.exports;const dy=_u(Qf);var Yf,yu=Qf;Yf=yu.createRoot,yu.hydrateRoot;const Bm="modulepreload",Vm=function(e,n){return new URL(e,n).href},vu={},Xf=function(n,t,r){let o=Promise.resolve();if(t&&t.length>0){const i=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));o=Promise.allSettled(t.map(d=>{if(d=Vm(d,r),d in vu)return;vu[d]=!0;const h=d.endsWith(".css"),f=h?'[rel="stylesheet"]':"";if(!!r)for(let v=i.length-1;v>=0;v--){const x=i[v];if(x.href===d&&(!h||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${f}`))return;const k=document.createElement("link");if(k.rel=h?"stylesheet":Bm,h||(k.as="script"),k.crossOrigin="",k.href=d,l&&k.setAttribute("nonce",l),document.head.appendChild(k),h)return new Promise((v,x)=>{k.addEventListener("load",v),k.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(i){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=i,window.dispatchEvent(a),!a.defaultPrevented)throw i}return o.then(i=>{for(const a of i||[])a.status==="rejected"&&s(a.reason);return n().catch(s)})},Ce=32,wu=.82,Wm=Math.cos(Math.PI/6),Um=.5,Hm=new Set(["area","circleArea","text"]);function Zn(e){return Hm.has(e.kind)?!0:e.kind==="image"?e.imageStyle==="flat":!1}function Zl(e,n,t){switch(t){case 1:return{x:-n,y:e};case 2:return{x:-e,y:-n};case 3:return{x:n,y:-e};default:return{x:e,y:n}}}class Lo{constructor(n,t){this.mode=n,this.rotation=t}project(n,t,r=0){if(this.mode==="2d")return{x:n*Ce,y:t*Ce};const o=Zl(n,t,this.rotation);return{x:(o.x-o.y)*Ce*Wm,y:(o.x+o.y)*Ce*Um-r*Ce*wu}}groundMatrix(n=0){const t=this.project(0,0,n),r=this.project(1,0,n),o=this.project(0,1,n);return[r.x-t.x,r.y-t.y,o.x-t.x,o.y-t.y,t.x,t.y]}unproject(n,t,r=0){const[o,s,i,a,l,d]=this.groundMatrix(r),h=o*a-s*i,f=n-l,m=t-d;return{x:(a*f-i*m)/h,y:(-s*f+o*m)/h}}get heightScale(){return this.mode==="2d"?0:Ce*wu}}function Km(e){const n=e.project(0,0),t=[{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}];let r=0,o=-1/0,s=-1/0;return t.forEach((i,a)=>{const l=e.project(i.x,i.y),d=l.x-n.x,h=l.y-n.y;(d>o+1e-6||Math.abs(d-o)<=1e-6&&h>s)&&(r=a,o=d,s=h)}),r}function Zm(e){const n=e.project(0,0),t=e.project(1,0),r=t.x-n.x,o=t.y-n.y;return r<-1e-6||Math.abs(r)<=1e-6&&o<0?2:0}function Gm(e){return`matrix(${e.map(n=>+n.toFixed(5)).join(" ")})`}function xu(e,n,t=0){const r=e.x+e.w/2,o=e.y+e.d/2,s=[];for(let i=0;i<n;i++){const a=t+i/n*Math.PI*2;s.push({x:r+Math.cos(a)*e.w/2,y:o+Math.sin(a)*e.d/2})}return s}function Io(e){return[{x:e.x,y:e.y},{x:e.x+e.w,y:e.y},{x:e.x+e.w,y:e.y+e.d},{x:e.x,y:e.y+e.d}]}function $e(e){switch(e.kind){case"cylinder":case"cone":case"circleArea":case"sphere":return xu(e,40);case"hexagon":return xu(e,6);default:return Io(e)}}function Hi(e){let n=0;for(let t=0;t<e.length;t++){const r=e[t],o=e[(t+1)%e.length];n+=r.x*o.y-o.x*r.y}return n/2}function ku(e,n,t,r){const o=Zl(n,t,e.rotation),s=Math.hypot(o.x,o.y,r)||1,a=.74+.12*((o.y-o.x)/Math.SQRT2/s);return a+(1-a)*Math.max(0,r/s)*.75}function Qm(e,n){const t=$e(e),r=e.z,o=e.z+Math.max(0,e.h),s=e.x+e.w/2,i=e.y+e.d/2,a=t.map(h=>n.project(h.x,h.y,o)),l=Math.sign(Hi(a))||1,d=[];if(e.kind==="pyramid"||e.kind==="cone"){const h=n.project(s,i,o),f=t.map(m=>n.project(m.x,m.y,r));n.mode==="2d"&&d.push({points:f,light:.9});for(let m=0;m<t.length;m++){const k=(m+1)%t.length,v=[f[m],f[k],h],x=Hi(v);if(Math.sign(x)!==l||Math.abs(x)<.01)continue;const _=t[k].x-t[m].x;let u=t[k].y-t[m].y,y=-_;const C=(t[m].x+t[k].x)/2-s,N=(t[m].y+t[k].y)/2-i;u*C+y*N<0&&(u=-u,y=-y);const R=Math.hypot(C,N)||1,z=Math.hypot(u,y)||1,F=R/Math.max(.01,o-r);d.push({points:v,light:ku(n,u/z,y/z,F)})}return d}for(let h=0;h<t.length;h++){const f=(h+1)%t.length,m=[n.project(t[h].x,t[h].y,r),n.project(t[f].x,t[f].y,r),n.project(t[f].x,t[f].y,o),n.project(t[h].x,t[h].y,o)],k=Hi(m);if(Math.sign(k)!==l||Math.abs(k)<.01)continue;const v=t[f].x-t[h].x;let _=t[f].y-t[h].y,g=-v;_*((t[h].x+t[f].x)/2-s)+g*((t[h].y+t[f].y)/2-i)<0&&(_=-_,g=-g),d.push({points:m,light:ku(n,_,g,0)})}return d.push({points:a,light:1}),d}function qf(e){const n=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim());if(!n)return null;let t=n[1];return t.length===3&&(t=t.split("").map(r=>r+r).join("")),[parseInt(t.slice(0,2),16),parseInt(t.slice(2,4),16),parseInt(t.slice(4,6),16)]}function At(e,n){const t=qf(e);return t?`#${t.map(o=>{const s=n<=1?o*n:o+(255-o)*(n-1);return Math.max(0,Math.min(255,Math.round(s)))}).map(o=>o.toString(16).padStart(2,"0")).join("")}`:e}function Ym(e){const n=qf(e);if(!n)return"#1f2937";const[t,r,o]=n;return .299*t+.587*r+.114*o>160?"#1f2937":"#ffffff"}function Xm(e,n){const t=Io(e).map(s=>Zl(s.x,s.y,n)),r=t.map(s=>s.x),o=t.map(s=>s.y);return{minX:Math.min(...r),maxX:Math.max(...r),minY:Math.min(...o),maxY:Math.max(...o),minZ:e.z,maxZ:e.z+(Zn(e)?0:Math.max(.01,e.h))}}const Bt=1e-6;function qm(e,n){return e.maxX<=n.minX+Bt?!0:n.maxX<=e.minX+Bt?!1:e.maxY<=n.minY+Bt?!0:n.maxY<=e.minY+Bt?!1:e.maxZ<=n.minZ+Bt?!0:n.maxZ<=e.minZ+Bt?!1:null}function Jm(e,n){if(n.mode==="2d")return e.map((h,f)=>({n:h,i:f})).sort((h,f)=>h.n.z+h.n.h-(f.n.z+f.n.h)||h.i-f.i).map(h=>h.n);const t=e.map(h=>Xm(h,n.rotation)),r=e.length,o=e.map(()=>[]),s=new Array(r).fill(0);for(let h=0;h<r;h++)for(let f=h+1;f<r;f++){const m=qm(t[h],t[f]);if(m===null)continue;const[k,v]=m?[h,f]:[f,h];o[k].push(v),s[v]++}const i=h=>(t[h].minX+t[h].maxX+t[h].minY+t[h].maxY)/2+t[h].minZ*.01,a=[...Array(r).keys()].filter(h=>s[h]===0),l=[],d=new Array(r).fill(!1);for(;l.length<r;){if(a.length===0){let f=-1;for(let m=0;m<r;m++)!d[m]&&(f<0||i(m)<i(f))&&(f=m);a.push(f),s[f]=0}a.sort((f,m)=>i(f)-i(m));const h=a.shift();if(!d[h]){d[h]=!0,l.push(h);for(const f of o[h])--s[f]===0&&!d[f]&&a.push(f)}}return l.map(h=>e[h])}function Ae(e){return{x:e.x+e.w/2,y:e.y+e.d/2}}function Su(e,n,t,r=.15){const o=t.x-r,s=t.x+t.w+r,i=t.y-r,a=t.y+t.d+r,l=n.x-e.x,d=n.y-e.y;let h=0,f=1;const m=(k,v)=>{if(Math.abs(k)<Bt)return v>=0;const x=v/k;return k<0?h=Math.max(h,x):f=Math.min(f,x),!0};return m(-l,e.x-o)&&m(l,s-e.x)&&m(-d,e.y-i)&&m(d,a-e.y)&&h<=f?{x:e.x+l*h,y:e.y+d*h}:n}function Ln(e,n){return n>0?Math.round(e/n)*n:e}function Dn(e){return e.map(n=>`${+n.x.toFixed(2)},${+n.y.toFixed(2)}`).join(" ")}let Ki=0;function vr(e="n"){return Ki=(Ki+1)%1e6,`${e}_${Date.now().toString(36)}${Ki.toString(36)}${Math.random().toString(36).slice(2,6)}`}const ct=e=>e.kind==="area"||e.kind==="circleArea",Vt=1e-6;function Eu(e,n){if(e.kind==="circleArea"){const t=(n.x-(e.x+e.w/2))/(e.w/2),r=(n.y-(e.y+e.d/2))/(e.d/2);return t*t+r*r<=1+Vt}return n.x>=e.x-Vt&&n.x<=e.x+e.w+Vt&&n.y>=e.y-Vt&&n.y<=e.y+e.d+Vt}function eg(e,n){return e.id===n.id||!ct(e)||e.z>n.z+Vt?!1:ct(n)?e.w*e.d<=n.w*n.d+Vt?!1:Io(n).every(t=>Eu(e,t)):Eu(e,Ae(n))}function xt(e,n,t){let r;for(const o of n)t!=null&&t.has(o.id)||!eg(o,e)||(!r||o.w*o.d<r.w*r.d)&&(r=o);return r}function Gl(e){const n=new Map;for(const t of e){const r=xt(t,e);r&&n.set(t.id,r.id)}return n}function wr(e,n,t=Gl(n)){const r=new Map;for(const[i,a]of t)r.has(a)||r.set(a,[]),r.get(a).push(i);const o=new Set,s=[...e];for(;s.length;)for(const i of r.get(s.pop())??[])o.has(i)||(o.add(i),s.push(i));return o}function ng(e,n=Gl(e)){const t=new Map,r=o=>{const s=t.get(o);if(s!==void 0)return s;const i=n.get(o),a=i?r(i)+1:0;return t.set(o,a),a};return e.forEach(o=>r(o.id)),t}function Cu(e,n=1){const t=Math.floor((Math.min(...e.map(i=>i.x))-n)*2)/2,r=Math.floor((Math.min(...e.map(i=>i.y))-n)*2)/2,o=Math.ceil((Math.max(...e.map(i=>i.x+i.w))+n)*2)/2,s=Math.ceil((Math.max(...e.map(i=>i.y+i.d))+n)*2)/2;return{x:t,y:r,w:o-t,d:s-r}}const Jf=[{kind:"block",name:"Block",defaults:{w:2,d:2,h:1,color:"#4f8cf7"}},{kind:"cylinder",name:"Cylinder",defaults:{w:2,d:2,h:1.5,color:"#3fb27f"}},{kind:"hexagon",name:"Hexagon",defaults:{w:2,d:2,h:1,color:"#f2a93b"}},{kind:"pyramid",name:"Pyramid",defaults:{w:2,d:2,h:1.5,color:"#e5534b"}},{kind:"cone",name:"Cone",defaults:{w:2,d:2,h:2,color:"#a371f7"}},{kind:"sphere",name:"Sphere",defaults:{w:2,d:2,h:2,color:"#39c5cf"}},{kind:"area",name:"Area",defaults:{w:6,d:4,h:0,color:"#4f8cf7",opacity:.18}},{kind:"circleArea",name:"Circle area",defaults:{w:4,d:4,h:0,color:"#3fb27f",opacity:.2}},{kind:"text",name:"Text",defaults:{w:4,d:1,h:0,color:"#1f2937",text:"Text",fontSize:.7}}],tg=["#4f8cf7","#3fb27f","#f2a93b","#e5534b","#a371f7","#39c5cf","#ed7100","#c925d1","#7aa116","#dd344c","#8c4fff","#232f3e","#64748b","#ffffff"];function Cs(e,n,t,r={}){var a;const o=((a=Jf.find(l=>l.kind===e))==null?void 0:a.defaults)??{},s=r.w??o.w??2,i=r.d??o.d??2;return{id:vr("n"),kind:e,h:1,z:0,color:"#4f8cf7",...o,...r,w:s,d:i,x:Math.round(n-s/2),y:Math.round(t-i/2)}}function rg(e,n,t,r){return Cs("image",t,r,{w:2,d:2,h:.35,src:e,label:n,color:"#ffffff",imageStyle:"tile"})}function og(e,n,t={}){return{id:vr("e"),from:e,to:n,color:"#475569",width:2,routing:"orthogonal",rounded:!0,lineStyle:"solid",endMarker:"arrow",...t}}const sg=["color","width","routing","rounded","lineStyle","startMarker","endMarker","animation","animationDirection","animationSpeed","animationColor"];function ig(e){const{dashed:n,arrowStart:t,arrowEnd:r,...o}=e;return{...o,lineStyle:e.lineStyle??(n?"dashed":"solid"),startMarker:e.startMarker??(t?"arrow":"none"),endMarker:e.endMarker??(r?"arrow":"none")}}const Ha=()=>({version:1,nodes:[],edges:[]});function ag(e){const n=e;if(!n||!Array.isArray(n.nodes)||!Array.isArray(n.edges))throw new Error("Not an IsoDraw diagram: expected { nodes: [], edges: [] }");const t=new Set(n.nodes.map(r=>r.id));return{version:1,nodes:n.nodes.map(r=>({...r,z:r.z??0,h:r.h??0})),edges:n.edges.filter(r=>t.has(r.from)&&t.has(r.to)).map(ig),...typeof n.doc=="string"?{doc:n.doc}:{},...n.view==="2d"||n.view==="3d"?{view:n.view}:{}}}const Pr={block:"Block",cylinder:"Cylinder",hexagon:"Hexagon",pyramid:"Pyramid",cone:"Cone",sphere:"Sphere",area:"Area",circleArea:"Circle area",text:"Text",image:"Image"},Ka="isodraw:",Sn=e=>!!e&&e.trim().length>0,lg=(e,n)=>e.kind===n.kind&&(e.kind==="diagram"||e.id===n.id),Nr=e=>e.kind==="diagram"?"diagram":`${e.kind}/${e.id}`;function cg(e){if(!e.startsWith(Ka))return null;const n=e.slice(Ka.length);if(n==="diagram")return{kind:"diagram"};const t=/^(node|edge)\/(.+)$/.exec(n);return t?{kind:t[1],id:decodeURIComponent(t[2])}:null}function _o(e){var n,t,r;return((n=e.label)==null?void 0:n.trim())||(e.kind==="text"?(r=(t=e.text)==null?void 0:t.split(`
`)[0])==null?void 0:r.trim():"")||Pr[e.kind]}function Ql(e,n){var s;const t=n.find(i=>i.id===e.from),r=n.find(i=>i.id===e.to),o=`${t?_o(t):"?"} → ${r?_o(r):"?"}`;return(s=e.label)!=null&&s.trim()?`${e.label.trim()} (${o})`:o}function fy(e,n){if(e.kind==="diagram")return"Diagram";if(e.kind==="node"){const r=n.nodes.find(o=>o.id===e.id);return r?_o(r):"Missing item"}const t=n.edges.find(r=>r.id===e.id);return t?Ql(t,n.nodes):"Missing connection"}function hy(e,n){return e.kind==="diagram"?!0:e.kind==="node"?n.nodes.some(t=>t.id===e.id):n.edges.some(t=>t.id===e.id)}function py(e,n){var t,r;return e.kind==="diagram"?n.doc??"":e.kind==="node"?((t=n.nodes.find(o=>o.id===e.id))==null?void 0:t.doc)??"":((r=n.edges.find(o=>o.id===e.id))==null?void 0:r.doc)??""}function ug(e,n,t){const r=Sn(t)?t:void 0;return n.kind==="diagram"?{...e,doc:r}:n.kind==="node"?{...e,nodes:e.nodes.map(o=>o.id===n.id?{...o,doc:r}:o)}:{...e,edges:e.edges.map(o=>o.id===n.id?{...o,doc:r}:o)}}function my(e,n){const t=[{kind:"diagram"}];if(e.kind!=="node")return t;const r=n.nodes.find(i=>i.id===e.id),o=[];let s=r&&xt(r,n.nodes);for(;s;)o.unshift({kind:"node",id:s.id}),s=xt(s,n.nodes);return[...t,...o]}function gy(e){return[...e.nodes.map(n=>({target:{kind:"node",id:n.id},title:_o(n),kind:Pr[n.kind]})),...e.edges.map(n=>({target:{kind:"edge",id:n.id},title:Ql(n,e.nodes),kind:"Connection"}))]}const Zi=e=>Nr(e).replace("/","-");function dg(e,n="Architecture"){const t=Gl(e.nodes),r=new Map;for(const f of e.nodes){const m=t.get(f.id);r.has(m)||r.set(m,[]),r.get(m).push(f)}const o=f=>Sn(f.doc)||(r.get(f.id)??[]).some(o),s=new Set([...e.nodes.filter(o).map(f=>Nr({kind:"node",id:f.id})),...e.edges.filter(f=>Sn(f.doc)).map(f=>Nr({kind:"edge",id:f.id}))]),i=f=>f.replace(/\[@((?:\\.|[^\]])*)\]\(isodraw:([^)]+)\)/g,(m,k,v)=>{const x=cg(Ka+v);return x&&s.has(Nr(x))?`[@${k}](#${Zi(x)})`:`**@${k}**`}),a=(f,m)=>{const k=[...f.matchAll(/^(#{1,6})\s/gm)].map(x=>x[1].length);if(!k.length)return f;const v=Math.max(0,m+1-Math.min(...k));return f.replace(/^(#{1,6})(?=\s)/gm,x=>"#".repeat(Math.min(6,x.length+v)))},l=[`# ${n}`,""];Sn(e.doc)&&l.push(i(a(e.doc.trim(),1)),"");const d=(f,m)=>{const k=[...f.filter(ct),...f.filter(v=>!ct(v))];for(const v of k){if(!o(v))continue;const x={kind:"node",id:v.id};l.push(`<a id="${Zi(x)}"></a>`,"",`${"#".repeat(Math.min(6,m))} ${_o(v)}`,""),l.push(`_${Pr[v.kind]}_`,""),Sn(v.doc)&&l.push(i(a(v.doc.trim(),m)),""),d(r.get(v.id)??[],m+1)}};d(r.get(void 0)??[],2);const h=e.edges.filter(f=>Sn(f.doc));if(h.length){l.push("## Connections","");for(const f of h){const m={kind:"edge",id:f.id};l.push(`<a id="${Zi(m)}"></a>`,"",`### ${Ql(f,e.nodes)}`,"",i(a(f.doc.trim(),3)),"")}}return`${l.join(`
`).replace(/\n{3,}/g,`

`).trim()}
`}function yy(e,n){const t=new Set([n,...wr([n],e.nodes)]);return{version:1,...e.view?{view:e.view}:{},nodes:e.nodes.filter(r=>t.has(r.id)),edges:e.edges.filter(r=>t.has(r.from)&&t.has(r.to))}}const Ys={n:{x:0,y:-1},e:{x:1,y:0},s:{x:0,y:1},w:{x:-1,y:0}},eh=["n","e","s","w"],fg=.12,nr=.6,$n=1e-6,ju=new Set(["cylinder","cone","circleArea","sphere"]),Xs=(e,n,t)=>Math.min(t,Math.max(n,e)),Za=e=>Math.abs(e.x)>Math.abs(e.y)?"x":"y",hg=(e,n)=>Math.abs(e.x-n.x)<$n||Math.abs(e.y-n.y)<$n,Cn=(e,n,t=1)=>({x:e.x+n.x*t,y:e.y+n.y*t}),nh=e=>e.lineStyle??(e.dashed?"dashed":"solid"),th=e=>e.startMarker??(e.arrowStart?"arrow":"none"),rh=e=>e.endMarker??(e.arrowEnd?"arrow":"none");function xr(e,n,t=fg){const r=Xs(n.t,0,1),o=e.x+e.w/2,s=e.y+e.d/2;let i;if(n.side==="n"||n.side==="s"){const a=e.x+r*e.w;let l=n.side==="n"?e.y:e.y+e.d;if(ju.has(e.kind)){const d=(a-o)/(e.w/2);l=s+(n.side==="n"?-1:1)*(e.d/2)*Math.sqrt(Math.max(0,1-d*d))}i={x:a,y:l}}else{const a=e.y+r*e.d;let l=n.side==="w"?e.x:e.x+e.w;if(ju.has(e.kind)){const d=(a-s)/(e.d/2);l=o+(n.side==="w"?-1:1)*(e.w/2)*Math.sqrt(Math.max(0,1-d*d))}i={x:l,y:a}}return Cn(i,Ys[n.side],t)}function qs(e,n,t){return Xs(n==="e"||n==="w"?(t-e.y)/e.d:(t-e.x)/e.w,0,1)}function pg(e,n){const t={n:Math.abs(n.y-e.y),s:Math.abs(n.y-(e.y+e.d)),w:Math.abs(n.x-e.x),e:Math.abs(n.x-(e.x+e.w))},r=eh.reduce((s,i)=>t[i]<t[s]?i:s,"n"),o=Ln(r==="e"||r==="w"?n.y:n.x,.25);return{side:r,t:qs(e,r,o)}}function Ga(e,n){const t=Ae(e),r=(n.x-t.x)/Math.max(e.w,$n),o=(n.y-t.y)/Math.max(e.d,$n),s=Math.abs(r)>=Math.abs(o)?r>0?"e":"w":o>0?"s":"n",i=s==="e"||s==="w"?n.y:n.x,a=qs(e,s,i);return{side:s,t:a>0&&a<1?a:.5}}function mg(e,n){const t=Ae(e),r=Ae(n),o=r.x-t.x,s=r.y-t.y,i=Math.max(n.x-(e.x+e.w),e.x-(n.x+n.w)),a=Math.max(n.y-(e.y+e.d),e.y-(n.y+n.d));return(i>0||a>0?i>=a:Math.abs(o)>=Math.abs(s))?[{side:o>0?"e":"w",t:.5},{side:o>0?"w":"e",t:.5}]:[{side:s>0?"s":"n",t:.5},{side:s>0?"n":"s",t:.5}]}function Js(e){const n=[];for(const t of e){const r=n[n.length-1];r&&Math.abs(r.x-t.x)<$n&&Math.abs(r.y-t.y)<$n||n.push(t)}for(let t=1;t<n.length-1;){const r=n[t-1],o=n[t],s=n[t+1],i=(o.x-r.x)*(s.y-o.y)-(o.y-r.y)*(s.x-o.x);Math.abs(i)<$n?n.splice(t,1):t++}return n}function oh(e,n,t){const r=[e[0]];let o=n;for(let s=1;s<e.length;s++){const i=r[r.length-1],a=e[s];if(!hg(i,a)){const d=s===e.length-1&&t;let h;d?h=t==="x"?{x:i.x,y:a.y}:{x:a.x,y:i.y}:h=o==="x"?{x:a.x,y:i.y}:{x:i.x,y:a.y},r.push(h)}const l=r[r.length-1];Math.abs(a.x-l.x)>$n?o="x":Math.abs(a.y-l.y)>$n&&(o="y"),r.push(a)}return r}function gg(e,n,t,r){const o=Cn(e,n,nr),s=Cn(t,r,nr),i=n.x!==0,a=r.x!==0;if(i&&a){if(n.x===-r.x){if((s.x-o.x)*n.x>=0){const f=(o.x+s.x)/2;return[e,o,{x:f,y:o.y},{x:f,y:s.y},s,t]}const h=(o.y+s.y)/2;return[e,o,{x:o.x,y:h},{x:s.x,y:h},s,t]}const d=n.x>0?Math.max(o.x,s.x):Math.min(o.x,s.x);return[e,{x:d,y:e.y},{x:d,y:t.y},t]}if(!i&&!a){if(n.y===-r.y){if((s.y-o.y)*n.y>=0){const f=(o.y+s.y)/2;return[e,o,{x:o.x,y:f},{x:s.x,y:f},s,t]}const h=(o.x+s.x)/2;return[e,o,{x:h,y:o.y},{x:h,y:s.y},s,t]}const d=n.y>0?Math.max(o.y,s.y):Math.min(o.y,s.y);return[e,{x:e.x,y:d},{x:t.x,y:d},t]}return i?(s.x-o.x)*n.x>=0&&(s.y-o.y)*-r.y>=0?[e,o,{x:s.x,y:o.y},s,t]:[e,o,{x:o.x,y:s.y},s,t]:(s.y-o.y)*n.y>=0&&(s.x-o.x)*-r.x>=0?[e,o,{x:o.x,y:s.y},s,t]:[e,o,{x:s.x,y:o.y},s,t]}function yg(e,n,t,r,o){if(!o.length)return Js(gg(e,n,t,r));const s=Cn(e,n,nr),i=Cn(t,r,nr),a=oh([e,s,...o,i],Za(n),Za(r));return a.push(t),Js(a)}function vg(e,n,t){if(n===t)return e.map(()=>n);const r=e.slice(1).map((i,a)=>Math.hypot(i.x-e[a].x,i.y-e[a].y)),o=r.reduce((i,a)=>i+a,0)||1;let s=0;return e.map((i,a)=>(a>0&&(s+=r[a-1]),n+(t-n)*(s/o)))}function Qa(e,n,t){const r=e.waypoints??[],o=mg(n,t),s=e.fromAnchor??(r.length?Ga(n,r[0]):o[0]),i=e.toAnchor??(r.length?Ga(t,r[r.length-1]):o[1]),a=Ys[s.side],l=Ys[i.side];let d;if(e.routing==="orthogonal")d=yg(xr(n,s),a,xr(t,i),l,r);else if(e.routing==="straight"&&!e.fromAnchor&&!e.toAnchor){const h=Ae(n),f=Ae(t),m=r[0]??f,k=r[r.length-1]??h;d=[Su(m,h,n),...r,Su(k,f,t)]}else d=[xr(n,s),...r,xr(t,i)];return{pts:d,zs:vg(d,n.z,t.z),from:s,to:i,aDir:a,bDir:l}}function sh(e,n,t,r){const o=(a,l)=>{const d=r.project(a.x,a.y,l);return`${d.x.toFixed(2)},${d.y.toFixed(2)}`},{pts:s,zs:i}=e;if(n==="curved"){if(s.length===2){const[l,d]=s,h=Xs(Math.hypot(d.x-l.x,d.y-l.y)*.45,.8,5),f=(i[0]+i[1])/2;return`M${o(l,i[0])} C${o(Cn(l,e.aDir,h),f)} ${o(Cn(d,e.bDir,h),f)} ${o(d,i[1])}`}let a=`M${o(s[0],i[0])}`;for(let l=0;l<s.length-1;l++){const d=s[l-1]??Cn(s[0],e.aDir,-1),h=s[l],f=s[l+1],m=s[l+2]??Cn(s[s.length-1],e.bDir,-1),k={x:h.x+(f.x-d.x)/6,y:h.y+(f.y-d.y)/6},v={x:f.x-(m.x-h.x)/6,y:f.y-(m.y-h.y)/6};a+=` C${o(k,i[l])} ${o(v,i[l+1])} ${o(f,i[l+1])}`}return a}if(n==="orthogonal"&&t&&s.length>2){let a=`M${o(s[0],i[0])}`;for(let l=1;l<s.length-1;l++){const d=s[l-1],h=s[l],f=s[l+1],m=Math.hypot(h.x-d.x,h.y-d.y),k=Math.hypot(f.x-h.x,f.y-h.y),v=Math.min(.4,m/2,k/2),x={x:h.x-(h.x-d.x)/(m||1)*v,y:h.y-(h.y-d.y)/(m||1)*v},_={x:h.x+(f.x-h.x)/(k||1)*v,y:h.y+(f.y-h.y)/(k||1)*v};a+=` L${o(x,i[l])} Q${o(h,i[l])} ${o(_,i[l])}`}return`${a} L${o(s[s.length-1],i[i.length-1])}`}return`M${s.map((a,l)=>o(a,i[l])).join(" L")}`}function Ya(e,n){if(e.length<3)return e;const t=e[0],r=e[e.length-1],o=Math.hypot(r.x-t.x,r.y-t.y)||$n;let s=0,i=0;for(let a=1;a<e.length-1;a++){const l=e[a],d=Math.abs((r.x-t.x)*(t.y-l.y)-(t.x-l.x)*(r.y-t.y))/o;d>s&&(s=d,i=a)}return s<=n?[t,r]:[...Ya(e.slice(0,i+1),n).slice(0,-1),...Ya(e.slice(i),n)]}function Tu(e,n,t=.25){return n.x>=e.x-t&&n.x<=e.x+e.w+t&&n.y>=e.y-t&&n.y<=e.y+e.d+t}function Mu(e,n,t,r){const o=e.slice();for(;o.length&&Tu(n,o[0]);)o.shift();if(r)for(;o.length&&Tu(r,o[o.length-1]);)o.pop();const s=t?{fromAnchor:{side:t,t:.5}}:{};if(o.length<2)return{...s,waypoints:[]};const i=[],a=Ya(o,.45);for(let v=1;v<a.length;v++){const x=a[v-1],_=a[v],g=_.x-x.x,u=_.y-x.y,y=Math.hypot(g,u);if(y<.35)continue;const C=Math.abs(g)>=Math.abs(u)?"x":"y",N=C==="x"?(x.y+_.y)/2:(x.x+_.x)/2,R=C==="x"?g:u,z=i[i.length-1];z&&z.axis===C?(z.level=(z.level*z.len+N*y)/(z.len+y),z.len+=y,z.net+=R):i.push({axis:C,net:R,level:N,len:y})}for(const v of i)v.level=Ln(v.level,.5);if(i.length<2)return{...s,waypoints:[]};const l=i[0],d=t??(l.axis==="x"?l.net>0?"e":"w":l.net>0?"s":"n"),h=d==="e"||d==="w"?"x":"y",f={side:d,t:l.axis===h?qs(n,d,l.level):.5},m=[];for(let v=0;v<i.length-1;v++){const x=i[v],_=i[v+1];m.push(x.axis==="x"?{x:_.level,y:x.level}:{x:x.level,y:_.level})}let k;if(r){const v=i[i.length-1],x=v.axis==="x"?v.net>0?"w":"e":v.net>0?"n":"s";k={side:x,t:qs(r,x,v.level)}}return{fromAnchor:f,toAnchor:k,waypoints:m}}function wg(e,n,t){const r=n.fromAnchor??Ga(e,n.waypoints[0]??t),o=xr(e,r),s=Ys[r.side];return Js(oh([o,Cn(o,s,nr),...n.waypoints,t],Za(s),null))}function ih(e){let n=0;for(let t=1;t<e.length;t++)n+=Math.hypot(e[t].x-e[t-1].x,e[t].y-e[t-1].y);return n}function xg(e,n,t,r,o){let s=e.pts.map(v=>({...v}));const i=Math.abs(s[r].y-s[r+1].y)<$n,a=v=>{i?v.y=o:v.x=o},l=(v,x)=>{if(!(x.side==="e"||x.side==="w"?i:!i))return null;const g=i?v.y:v.x,u=i?v.d:v.w;return o>=g&&o<=g+u?{side:x.side,t:(o-g)/u}:null};let d=e.from,h=e.to;const f=s.length-2,m=r===0,k=r===f;if(!m&&!k)a(s[r]),a(s[r+1]);else{const v=m?l(n,d):null,x=k?l(t,h):null;if(m&&!k&&a(s[1]),k&&!m&&a(s[f]),m)if(v)d=v,a(s[0]);else{const _=Cn(s[0],e.aDir,nr),g={..._};a(g),s=[s[0],_,g,...s.slice(1)]}if(k){const _=s.length-1;if(x)h=x,a(s[_]);else{const g=Cn(s[_],e.bDir,nr),u={...g};a(u),s=[...s.slice(0,_),u,g,s[_]]}}}return{fromAnchor:d,toAnchor:h,waypoints:Js(s).slice(1,-1)}}const kg=new Set(["cylinder","cone"]),Sg=new Set(["block","cylinder","hexagon"]),Eg=1/Ce;function Yl(e,n,t){const r=t==="flip"?Zm(n):Km(n),o=Ae(e),s=r%2===1;return{transform:`rotate(${r*90} ${o.x*Ce} ${o.y*Ce})`,cx:o.x,cy:o.y,w:s?e.d:e.w,d:s?e.w:e.d}}function Xl({proj:e,z:n,children:t}){return c.jsx("g",{transform:Gm(e.groundMatrix(n)),children:c.jsx("g",{transform:`scale(${Eg})`,children:t})})}function ah({node:e,proj:n}){const t=kg.has(e.kind);return c.jsx(c.Fragment,{children:Qm(e,n).map((r,o)=>{const s=At(e.color,r.light);return c.jsx("polygon",{points:Dn(r.points),fill:s,stroke:t?s:At(e.color,r.light*.72),strokeWidth:t?.6:1,strokeLinejoin:"round"},o)})})}function Cg({node:e,proj:n}){const t=e.imageStyle??"tile",r=t==="tile"?Math.min(e.w,e.d)*.12:0;if(t==="standing"&&n.mode==="3d"){const i=Ae(e),a=n.project(i.x,i.y,e.z),l=Math.min(e.w,e.d)*Ce;return c.jsxs(c.Fragment,{children:[c.jsx("ellipse",{cx:a.x,cy:a.y,rx:l*.42,ry:l*.2,fill:"#000",opacity:.12}),c.jsx("image",{href:e.src,x:a.x-l/2,y:a.y-l*1.02,width:l,height:l,preserveAspectRatio:"xMidYMid meet"})]})}const o=t==="tile"?e.z+e.h:e.z,s=Yl(e,n,"turn");return c.jsxs(c.Fragment,{children:[t==="tile"&&c.jsx(ah,{node:{...e,kind:"block"},proj:n}),c.jsx(Xl,{proj:n,z:o,children:c.jsx("image",{href:e.src,transform:s.transform,x:(s.cx-s.w/2+r)*Ce,y:(s.cy-s.d/2+r)*Ce,width:(s.w-2*r)*Ce,height:(s.d-2*r)*Ce,preserveAspectRatio:"xMidYMid meet"})})]})}function jg({node:e,proj:n,gradId:t}){const r=Ae(e),o=Math.min(e.w,e.d)/2,s=n.project(r.x,r.y,e.z+o);return c.jsxs(c.Fragment,{children:[c.jsx("defs",{children:c.jsxs("radialGradient",{id:t,cx:"38%",cy:"32%",r:"70%",children:[c.jsx("stop",{offset:"0%",stopColor:At(e.color,1.45)}),c.jsx("stop",{offset:"55%",stopColor:e.color}),c.jsx("stop",{offset:"100%",stopColor:At(e.color,.6)})]})}),c.jsx("polygon",{points:Dn($e(e).map(i=>n.project(i.x,i.y,e.z))),fill:"#000",opacity:.1}),c.jsx("circle",{cx:s.x,cy:s.y,r:o*Ce,fill:`url(#${t})`})]})}function Tg({node:e,proj:n}){const t=Ae(e),r=(e.fontSize??.7)*Ce,o=(e.text??"").split(`
`);return c.jsx(Xl,{proj:n,z:e.z,children:c.jsx("text",{transform:Yl(e,n,"flip").transform,x:t.x*Ce,y:t.y*Ce-(o.length-1)*r*1.2/2,fontSize:r,fill:e.color,textAnchor:"middle",dominantBaseline:"central",fontWeight:600,style:{userSelect:"none"},children:o.map((s,i)=>c.jsx("tspan",{x:t.x*Ce,dy:i===0?0:r*1.2,children:s||" "},i))})})}function lh(e,n){const t=Ae(e);if(e.kind==="image"&&e.imageStyle==="standing"&&n.mode==="3d"){const s=n.project(t.x,t.y,e.z);return{x:s.x,y:s.y+16}}const r=$e(e).map(s=>n.project(s.x,s.y,e.z)),o=Math.max(...r.map(s=>s.y));return{x:n.project(t.x,t.y,e.z).x,y:o+15}}function Mg({node:e,proj:n}){if(!e.label||e.kind==="text")return null;if(e.kind==="area"){const r=Yl(e,n,"flip");return c.jsx(Xl,{proj:n,z:e.z,children:c.jsx("text",{transform:r.transform,x:(r.cx-r.w/2+.3)*Ce,y:(r.cy-r.d/2+.3)*Ce,fontSize:13,fontWeight:700,dominantBaseline:"hanging",fill:e.labelColor??At(e.color,.6),style:{userSelect:"none"},pointerEvents:"none",children:e.label})})}const t=lh(e,n);if(n.mode==="2d"&&Sg.has(e.kind)){const r=n.project(Ae(e).x,Ae(e).y);return c.jsx("text",{x:r.x,y:r.y,fontSize:12,fontWeight:600,textAnchor:"middle",dominantBaseline:"central",fill:e.labelColor??Ym(e.color),style:{userSelect:"none"},pointerEvents:"none",children:e.label})}return c.jsx("text",{x:t.x,y:t.y,fontSize:12,fontWeight:600,textAnchor:"middle",fill:e.labelColor??"#1f2937",stroke:"#ffffff",strokeWidth:3,strokeLinejoin:"round",paintOrder:"stroke",style:{userSelect:"none"},pointerEvents:"none",children:e.label})}function Xa({node:e,proj:n,idPrefix:t}){let r;switch(e.kind){case"area":case"circleArea":{const s=$e(e).map(i=>n.project(i.x,i.y,e.z));r=c.jsx("polygon",{points:Dn(s),fill:e.color,fillOpacity:e.opacity??.18,stroke:e.color,strokeWidth:1.5,strokeDasharray:e.dashed?"6 4":void 0,strokeLinejoin:"round"});break}case"text":r=c.jsx(Tg,{node:e,proj:n});break;case"sphere":r=c.jsx(jg,{node:e,proj:n,gradId:`${t}-sph-${e.id}`});break;case"image":r=c.jsx(Cg,{node:e,proj:n});break;default:r=c.jsx(ah,{node:e,proj:n})}const o=e.kind==="area"||e.kind==="circleArea";return c.jsx("g",{"data-node-id":e.id,opacity:o?void 0:e.opacity??1,children:r})}function ch(e){let n=ih(e)/2;for(let t=1;t<e.length;t++){const r=Math.hypot(e[t].x-e[t-1].x,e[t].y-e[t-1].y);if(n<=r&&r>0){const o=n/r;return{x:e[t-1].x+(e[t].x-e[t-1].x)*o,y:e[t-1].y+(e[t].y-e[t-1].y)*o}}n-=r}return e[0]}function Pg(e){const n=[...e].sort((o,s)=>o.x-s.x||o.y-s.y);if(n.length<3)return n;const t=(o,s,i)=>(s.x-o.x)*(i.y-o.y)-(s.y-o.y)*(i.x-o.x),r=o=>{const s=[];for(const i of o){for(;s.length>=2&&t(s[s.length-2],s[s.length-1],i)<=0;)s.pop();s.push(i)}return s.pop(),s};return[...r(n),...r([...n].reverse())]}function uh({target:e,diagram:n,proj:t}){const r={stroke:"#2563eb",strokeLinejoin:"round",pointerEvents:"none",vectorEffect:"non-scaling-stroke"};if(e.kind==="node"){const o=n.nodes.find(l=>l.id===e.id);if(!o)return null;const s=Zn(o),i=$e(o).map(l=>t.project(l.x,l.y,o.z)),a=s?i:Pg([...i,...$e(o).map(l=>t.project(l.x,l.y,o.z+o.h))]);return c.jsx("polygon",{className:"isd-target-highlight",points:Dn(a),fill:"rgba(37,99,235,0.14)",strokeWidth:2.5,...r})}if(e.kind==="edge"){const o=n.edges.find(l=>l.id===e.id),s=o&&n.nodes.find(l=>l.id===o.from),i=o&&n.nodes.find(l=>l.id===o.to);if(!o||!s||!i)return null;const{d:a}=Kt(o,s,i,t);return c.jsxs("g",{className:"isd-target-highlight",children:[c.jsx("path",{d:a,fill:"none",strokeOpacity:.3,strokeWidth:10,strokeLinecap:"round",...r}),c.jsx("path",{d:a,fill:"none",strokeWidth:2.5,strokeLinecap:"round",...r})]})}return null}function Kt(e,n,t,r){const o=Qa(e,n,t),s=o.pts.map((a,l)=>r.project(a.x,a.y,o.zs[l])),i=sh(o,e.routing,e.rounded??!1,r);return{r:o,screen:s,d:i,length:ih(s)}}function Pu({id:e,kind:n,color:t}){if(n==="none")return null;const r={id:e,viewBox:"0 0 10 10",markerWidth:5,markerHeight:5,orient:"auto-start-reverse"};switch(n){case"open":return c.jsx("marker",{...r,refX:"8.5",refY:"5",children:c.jsx("path",{d:"M1.5,1.5 L8.5,5 L1.5,8.5",fill:"none",stroke:t,strokeWidth:1.6,strokeLinecap:"round",strokeLinejoin:"round"})});case"circle":return c.jsx("marker",{...r,refX:"5",refY:"5",children:c.jsx("circle",{cx:"5",cy:"5",r:"3.6",fill:t})});case"diamond":return c.jsx("marker",{...r,refX:"9",refY:"5",children:c.jsx("path",{d:"M1,5 L5,1.5 L9,5 L5,8.5 z",fill:t})});default:return c.jsx("marker",{...r,refX:"8",refY:"5",children:c.jsx("path",{d:"M0,0 L10,5 L0,10 z",fill:t})})}}function Ng(e,n){if(e==="dashed")return`${n*3} ${n*2.5}`;if(e==="dotted")return`0.01 ${n*2.2}`}const bg=`
@keyframes isd-dash { from { stroke-dashoffset: var(--isd-from); } to { stroke-dashoffset: var(--isd-to); } }
@keyframes isd-glow { 0%, 100% { stroke-opacity: 0.04; } 50% { stroke-opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) { .isd-anim { animation: none !important; } }
`;function kr(e,n,t){return{animation:`isd-dash ${t.toFixed(2)}s linear infinite`,"--isd-from":`${e.toFixed(2)}px`,"--isd-to":`${n.toFixed(2)}px`}}function Ag({edge:e,d:n,length:t}){const r=e.animation??"none",o=e.width,s=Math.max(.1,e.animationSpeed??1),i=80*s,a=e.animationDirection??"forward",l=e.animationColor??At(e.color,1.55),d=Math.max(1,t);if(r==="packets"){const h=Math.max(1,Math.min(6,Math.round(d/130))),f=d/h,m=Math.max(.6/h,f/i),k=o+1.6,v=a==="both"?["forward","reverse"]:[a==="reverse"?"reverse":"forward"];return c.jsx("g",{pointerEvents:"none",children:v.map(x=>{const _=x==="reverse"&&a==="both"?f/2:0,g=x==="reverse"?kr(_-f,_,m):kr(_,_-f,m),u=x==="reverse"&&a==="both"?At(e.color,.7):l,y=`0.01 ${(f-.01).toFixed(2)}`;return c.jsxs("g",{children:[c.jsx("path",{className:"isd-anim",d:n,fill:"none",stroke:"#ffffff",strokeWidth:2*k+2.4,strokeLinecap:"round",strokeDasharray:y,style:g}),c.jsx("path",{className:"isd-anim",d:n,fill:"none",stroke:u,strokeWidth:2*k,strokeLinecap:"round",strokeDasharray:y,style:g})]},x)})})}if(r==="pulse"){const h=Math.min(70,Math.max(16,d*.25)),f=Math.max(.6,(d+h)/i),m=a==="both"?["forward","reverse"]:[a==="reverse"?"reverse":"forward"];return c.jsx("g",{pointerEvents:"none",children:m.map(k=>c.jsx("path",{className:"isd-anim",d:n,fill:"none",stroke:l,strokeWidth:o+2.5,strokeLinecap:"round",strokeDasharray:`${h} ${d+h}`,style:k==="forward"?kr(h,-d,f):kr(-d,h,f)},k))})}return r==="glow"?c.jsx("path",{className:"isd-anim",d:n,fill:"none",stroke:e.color,strokeOpacity:.04,strokeWidth:o+8,strokeLinecap:"round",strokeLinejoin:"round",pointerEvents:"none",style:{animation:`isd-glow ${(2/s).toFixed(2)}s ease-in-out infinite`}}):null}function zg({edge:e,a:n,b:t,proj:r,idPrefix:o,selected:s,animate:i=!0}){const{d:a,length:l}=Kt(e,n,t,r),d=`${o}-ms-${e.id}`,h=`${o}-me-${e.id}`,f=th(e),m=rh(e),k=nh(e),v=e.width,x=i&&e.animation==="flow";let _=Ng(k,v);e.animation==="flow"&&!_&&(_=`${v*3} ${v*2.5}`);const g=_?_.split(" ").reduce((C,N)=>C+parseFloat(N),0):0,u=Math.max(.1,e.animationSpeed??1),y=e.animationDirection==="reverse";return c.jsxs("g",{"data-edge-id":e.id,children:[c.jsxs("defs",{children:[c.jsx(Pu,{id:d,kind:f,color:e.color}),c.jsx(Pu,{id:h,kind:m,color:e.color})]}),c.jsx("path",{d:a,stroke:"transparent",strokeWidth:14,fill:"none"}),s&&c.jsx("path",{d:a,stroke:"#2563eb",strokeOpacity:.3,strokeWidth:v+6,fill:"none",strokeLinejoin:"round",strokeLinecap:"round","data-noexport":""}),e.animation==="flow"&&k==="solid"&&c.jsx("path",{d:a,stroke:e.color,strokeOpacity:.25,strokeWidth:v,fill:"none",strokeLinejoin:"round",strokeLinecap:"round"}),c.jsx("path",{d:a,stroke:e.color,strokeWidth:v,fill:"none",strokeLinejoin:"round",strokeLinecap:"round",strokeDasharray:_,markerEnd:m!=="none"?`url(#${h})`:void 0,markerStart:f!=="none"?`url(#${d})`:void 0,className:x?"isd-anim":void 0,style:x?y?kr(0,g,Math.max(.15,g/(40*u))):kr(g,0,Math.max(.15,g/(40*u))):void 0}),i&&c.jsx(Ag,{edge:e,d:a,length:l})]})}function Lg({edge:e,a:n,b:t,proj:r}){if(!e.label)return null;const o=ch(Kt(e,n,t,r).screen),s=e.label.length*6.6+12;return c.jsxs("g",{"data-edge-id":e.id,children:[c.jsx("rect",{x:o.x-s/2,y:o.y-9,width:s,height:18,rx:9,fill:"#ffffff",stroke:e.color,strokeWidth:1}),c.jsx("text",{x:o.x,y:o.y,fontSize:11,fontWeight:600,textAnchor:"middle",dominantBaseline:"central",fill:"#1f2937",children:e.label})]})}function dh({diagram:e,proj:n,idPrefix:t,selectedEdges:r,animate:o=!0}){const s=[],i=[];for(const m of e.nodes)(Zn(m)?s:i).push(m);const a=ng(e.nodes),l=new Map(e.nodes.map((m,k)=>[m.id,k]));s.sort((m,k)=>m.z-k.z||a.get(m.id)-a.get(k.id)||l.get(m.id)-l.get(k.id));const d=new Map(e.nodes.map(m=>[m.id,m])),h=Jm(i,n),f=o&&e.edges.some(m=>m.animation&&m.animation!=="none");return c.jsxs(c.Fragment,{children:[f&&c.jsx("style",{children:bg}),s.map(m=>c.jsx(I.Fragment,{children:c.jsx(Xa,{node:m,proj:n,idPrefix:t})},m.id)),e.edges.map(m=>{const k=d.get(m.from),v=d.get(m.to);return!k||!v?null:c.jsx(zg,{edge:m,a:k,b:v,proj:n,idPrefix:t,selected:r==null?void 0:r.has(m.id),animate:o},m.id)}),h.map(m=>c.jsx(Xa,{node:m,proj:n,idPrefix:t},m.id)),e.nodes.map(m=>c.jsx(Mg,{node:m,proj:n},`l-${m.id}`)),e.edges.map(m=>{const k=d.get(m.from),v=d.get(m.to);return k&&v?c.jsx(Lg,{edge:m,a:k,b:v,proj:n},`l-${m.id}`):null})]})}function Ig({node:e,size:n=44}){const t=new Lo("3d",0),r=$e(e).flatMap(f=>[t.project(f.x,f.y,e.z),t.project(f.x,f.y,e.z+e.h)]),o=r.map(f=>f.x),s=r.map(f=>f.y),i=Math.min(...o),a=Math.min(...s),l=Math.max(...o)-i,d=Math.max(...s)-a,h=Math.max(l,d)*.12;return c.jsx("svg",{width:n,height:n,viewBox:`${i-h} ${a-h} ${l+2*h} ${d+2*h}`,"aria-hidden":!0,children:c.jsx(Xa,{node:e,proj:t,idPrefix:"pv"})})}function _g(e,n,t=28){const r=[];for(const l of e.nodes){const d=l.z+(Zn(l)?0:l.kind==="sphere"?Math.min(l.w,l.d):l.h);for(const h of $e(l))r.push(n.project(h.x,h.y,l.z),n.project(h.x,h.y,d));if(l.label&&l.kind!=="text"&&l.kind!=="area"&&r.push(lh(l,n)),l.kind==="image"&&l.imageStyle==="standing"){const h=n.project(Ae(l).x,Ae(l).y,l.z);r.push({x:h.x,y:h.y-Math.min(l.w,l.d)*Ce*1.05})}}if(!r.length)return{x:-100,y:-60,w:200,h:120};const o=r.map(l=>l.x),s=r.map(l=>l.y),i=Math.min(...o)-t,a=Math.min(...s)-t;return{x:i,y:a,w:Math.max(...o)+t-i,h:Math.max(...s)+t-a}}function vy({diagram:e,view:n,rotation:t=0,highlight:r,focus:o,onNodeClick:s,animate:i=!0,maxHeight:a,className:l,label:d}){const h=I.useId().replace(/:/g,""),f=new Lo(n??e.view??"3d",t),m=_g(e,f),k=r?e.nodes.find(x=>x.id===r):void 0,v=x=>{var g;const _=(g=x.target.closest("[data-node-id]"))==null?void 0:g.getAttribute("data-node-id");_&&s&&s(_)};return c.jsxs("svg",{className:l,viewBox:`${m.x} ${m.y} ${m.w} ${m.h}`,width:"100%",preserveAspectRatio:"xMidYMid meet",role:"img","aria-label":d??"Architecture diagram",style:{display:"block",maxHeight:a,cursor:s?"pointer":void 0,fontFamily:"inherit"},onClick:v,children:[c.jsx(dh,{diagram:e,proj:f,idPrefix:h,animate:i}),k&&c.jsx("polygon",{points:Dn($e(k).map(x=>f.project(x.x,x.y,k.z))),fill:"rgba(37,99,235,0.1)",stroke:"#2563eb",strokeWidth:2,strokeDasharray:"6 4",pointerEvents:"none"}),o&&c.jsx(uh,{target:o,diagram:e,proj:f})]})}const qa="application/x-isodraw";function dn(e,n){var r;const t=(r=e==null?void 0:e.closest)==null?void 0:r.call(e,`[${n}]`);return t?t.getAttribute(n):null}const Ue="var(--isd-accent, #2563eb)";function Dg(e){var wn;const{diagram:n,view:t,rotation:r,camera:o,onCameraChange:s,selection:i,onSelectionChange:a,tool:l="select",readOnly:d,showGrid:h=!0,animate:f=!0,snapStep:m=.5}=e,k=I.useId().replace(/:/g,""),v=I.useMemo(()=>new Lo(t,r),[t,r]),x=I.useRef(null),[_,g]=I.useState({w:800,h:600}),[u,y]=I.useState(null),[C,N]=I.useState(null),[R,z]=I.useState(null),[F,le]=I.useState(!1),K=I.useRef(e);K.current=e;const Ze=w=>{x.current=w;const E=e.svgRef;typeof E=="function"?E(w):E&&(E.current=w)};I.useEffect(()=>{const w=x.current;if(!w)return;const E=new ResizeObserver(()=>{const j=w.getBoundingClientRect();g({w:j.width,h:j.height})});return E.observe(w),()=>E.disconnect()},[]),I.useEffect(()=>{const w=j=>{var A,B;j.code==="Space"&&!((B=(A=j.target)==null?void 0:A.closest)!=null&&B.call(A,'input,textarea,select,[contenteditable="true"]'))&&(le(!0),j.preventDefault())},E=j=>j.code==="Space"&&le(!1);return window.addEventListener("keydown",w),window.addEventListener("keyup",E),()=>{window.removeEventListener("keydown",w),window.removeEventListener("keyup",E)}},[]),I.useEffect(()=>{const w=x.current;if(!w)return;const E=j=>{j.preventDefault();const A=K.current.camera;if(!(j.ctrlKey||j.metaKey||j.deltaX===0&&(j.deltaMode!==0||Math.abs(j.deltaY)>=50))){K.current.onCameraChange({...A,x:A.x-j.deltaX,y:A.y-j.deltaY});return}const P=w.getBoundingClientRect(),$=j.clientX-P.left,Q=j.clientY-P.top,J=Math.exp(-j.deltaY*(j.ctrlKey?.01:.0015)),Re=Math.min(4,Math.max(.15,A.zoom*J)),Y=Re/A.zoom;K.current.onCameraChange({zoom:Re,x:$-($-A.x)*Y,y:Q-(Q-A.y)*Y})};return w.addEventListener("wheel",E,{passive:!1}),()=>w.removeEventListener("wheel",E)},[]);const cn=(w,E)=>{const j=x.current.getBoundingClientRect();return{x:(w-j.left-o.x)/o.zoom,y:(E-j.top-o.y)/o.zoom}},Me=(w,E,j=0)=>{const A=cn(w,E);return v.unproject(A.x,A.y,j)},Yn=(w,E)=>dn(document.elementFromPoint(w,E),"data-node-id"),ie=I.useMemo(()=>new Map(n.nodes.map(w=>[w.id,w])),[n.nodes]),ze=I.useMemo(()=>new Map(n.edges.map(w=>[w.id,w])),[n.edges]),Bn=w=>{var E;(E=e.onChange)==null||E.call(e,{...n,nodes:n.nodes.map(w)})},L=(w,E)=>{var j;(j=e.onChange)==null||j.call(e,{...n,edges:n.edges.map(A=>A.id===w?{...A,...E}:A)})},W=w=>{const E=ie.get(w.from),j=ie.get(w.to);return E&&j?[E,j]:null},H=(w,E)=>{var Q;const j=ze.get(i.edges[0]),A=j&&W(j);if(!j||!A)return!1;const[B,P]=w.split(":"),$=Number(P);if(B==="edge-from"||B==="edge-to")y({type:"edgeEnd",edgeId:j.id,end:B==="edge-from"?"from":"to",cursor:cn(E.clientX,E.clientY),target:null});else if(B==="seg"){const J=Qa(j,A[0],A[1]);y({type:"segment",edgeId:j.id,index:$,start:Me(E.clientX,E.clientY,J.zs[$]),base:J,began:!1})}else if(B==="wp")y({type:"waypoint",edgeId:j.id,index:$,began:!1});else if(B==="wpadd"){const J=Qa(j,A[0],A[1]),Re={x:(J.pts[$].x+J.pts[$+1].x)/2,y:(J.pts[$].y+J.pts[$+1].y)/2},Y=[...j.waypoints??[]];Y.splice($,0,Re),(Q=e.onBeginChange)==null||Q.call(e),L(j.id,{waypoints:Y}),y({type:"waypoint",edgeId:j.id,index:$,began:!0})}else return!1;return!0},te=w=>{var P,$,Q,J,Re,Y;if(w.button===2)return;try{($=(P=x.current)==null?void 0:P.setPointerCapture)==null||$.call(P,w.pointerId)}catch{}if((J=(Q=x.current)==null?void 0:Q.focus)==null||J.call(Q),w.button===1||F){y({type:"pan",sx:w.clientX,sy:w.clientY,cam:o,moved:!0});return}const E=dn(w.target,"data-handle"),j=dn(w.target,"data-node-id"),A=dn(w.target,"data-edge-id"),B=dn(w.target,"data-doc-badge");if(B){const[D,U]=B.split(":");a(D==="node"?{nodes:[U],edges:[]}:{nodes:[],edges:[U]}),(Re=e.onOpenDocs)==null||Re.call(e,{kind:D,id:U});return}if(E&&!d){if(H(E,w))return;if(E.startsWith("conn-")){const[U,re]=E.slice(5).split(":"),ee=ie.get(re);if(!ee)return;const ue=Me(w.clientX,w.clientY,ee.z);y({type:"connect",from:ee.id,fromSide:U,trail:[ue],cursor:ue,target:null});return}const D=ie.get(i.nodes[0]);if(!D)return;if(E==="height")y({type:"height",id:D.id,sy:w.clientY,h0:D.h,began:!1});else{const re=Io(D)[(Number(E)+2)%4];y({type:"resize",id:D.id,fixed:re,began:!1})}return}if(j&&l==="connect"&&!d){const D=ie.get(j),U=Me(w.clientX,w.clientY,D.z);y({type:"connect",from:j,trail:[U],cursor:U,target:null});return}if(j){let D=i.nodes;if(w.shiftKey||w.metaKey?D=D.includes(j)?D.filter(oe=>oe!==j):[...D,j]:D.includes(j)||(D=[j]),a({nodes:D,edges:[]}),d)return;const U=D.filter(oe=>{const se=ie.get(oe);return se&&ct(se)&&!se.locked}),re=new Set([...D,...wr(U,n.nodes)]),ee=new Map;for(const oe of re){const se=ie.get(oe);se&&!se.locked&&ee.set(oe,{x:se.x,y:se.y})}const ue=new Map;for(const oe of n.edges)(Y=oe.waypoints)!=null&&Y.length&&ee.has(oe.from)&&ee.has(oe.to)&&ue.set(oe.id,oe.waypoints);ee.has(j)&&y({type:"move",start:Me(w.clientX,w.clientY),primary:j,origins:ee,edgeOrigins:ue,moved:!1});return}if(A){a({nodes:[],edges:w.shiftKey?[...i.edges,A]:[A]});return}if(w.shiftKey){const D=cn(w.clientX,w.clientY);y({type:"marquee",start:D,cur:D,additive:i.nodes});return}y({type:"pan",sx:w.clientX,sy:w.clientY,cam:o,moved:!1})},Se=w=>{var j,A,B,P,$,Q,J,Re,Y;if(!u){l==="connect"&&!((j=dn(w.target,"data-handle"))!=null&&j.startsWith("conn-"))&&N(dn(w.target,"data-node-id"));const D=dn(w.target,"data-node-id"),U=dn(w.target,"data-edge-id");z(dn(w.target,"data-doc-badge")??(D?`node:${D}`:U?`edge:${U}`:null));return}const E=w.altKey;switch(u.type){case"pan":{const D=w.clientX-u.sx,U=w.clientY-u.sy;if(!u.moved&&Math.hypot(D,U)<3)return;u.moved||y({...u,moved:!0}),s({...u.cam,x:u.cam.x+D,y:u.cam.y+U});break}case"move":{const D=Me(w.clientX,w.clientY),U=D.x-u.start.x,re=D.y-u.start.y;if(!u.moved){if(Math.hypot(U,re)<.15)return;(A=e.onBeginChange)==null||A.call(e)}const ee=u.origins.get(u.primary),ue=E?U:Ln(ee.x+U,m)-ee.x,oe=E?re:Ln(ee.y+re,m)-ee.y,se=n.nodes.map(bn=>{const dt=u.origins.get(bn.id);return dt?{...bn,x:dt.x+ue,y:dt.y+oe}:bn}),tn=u.edgeOrigins.size?n.edges.map(bn=>{const dt=u.edgeOrigins.get(bn.id);return dt?{...bn,waypoints:dt.map(Ur=>({x:Ur.x+ue,y:Ur.y+oe}))}:bn}):n.edges,un=se.find(bn=>bn.id===u.primary),Uo=(B=xt(un,se,new Set(u.origins.keys())))==null?void 0:B.id;(Uo!==u.dropTarget||!u.moved)&&y({...u,moved:!0,dropTarget:Uo}),(P=e.onChange)==null||P.call(e,{...n,nodes:se,edges:tn});break}case"resize":{const D=ie.get(u.id);if(!D)return;const U=Me(w.clientX,w.clientY,D.z),re=E?U.x:Ln(U.x,m),ee=E?U.y:Ln(U.y,m),ue=.5,oe=Math.max(ue,Math.abs(re-u.fixed.x)),se=Math.max(ue,Math.abs(ee-u.fixed.y));u.began||(($=e.onBeginChange)==null||$.call(e),y({...u,began:!0})),Bn(tn=>tn.id===u.id?{...tn,x:re<u.fixed.x?u.fixed.x-oe:u.fixed.x,y:ee<u.fixed.y?u.fixed.y-se:u.fixed.y,w:oe,d:se}:tn);break}case"height":{const D=(u.sy-w.clientY)/(v.heightScale*o.zoom),U=Math.max(.1,E?u.h0+D:Ln(u.h0+D,.25));u.began||((Q=e.onBeginChange)==null||Q.call(e),y({...u,began:!0})),Bn(re=>re.id===u.id?{...re,h:U}:re);break}case"connect":{const D=ie.get(u.from),U=Me(w.clientX,w.clientY,D.z),re=u.trail[u.trail.length-1],ee=Math.hypot(U.x-re.x,U.y-re.y)>.1?[...u.trail,U]:u.trail;y({...u,trail:ee,cursor:U,target:Yn(w.clientX,w.clientY)});break}case"edgeEnd":y({...u,cursor:cn(w.clientX,w.clientY),target:Yn(w.clientX,w.clientY)});break;case"segment":{const{base:D}=u,U=D.pts[u.index],re=D.pts[u.index+1],ee=Math.abs(U.y-re.y)<1e-6,ue=Me(w.clientX,w.clientY,D.zs[u.index]),oe=ee?U.y+(ue.y-u.start.y):U.x+(ue.x-u.start.x),se=E?oe:Ln(oe,.25);if(Math.abs(se-(ee?U.y:U.x))<1e-6&&!u.began)return;const tn=ze.get(u.edgeId),un=tn&&W(tn);if(!un)return;u.began||((J=e.onBeginChange)==null||J.call(e),y({...u,began:!0})),L(u.edgeId,xg(D,un[0],un[1],u.index,se));break}case"waypoint":{const D=ze.get(u.edgeId);if(!(D!=null&&D.waypoints))return;const U=((Re=ie.get(D.from))==null?void 0:Re.z)??0,re=Me(w.clientX,w.clientY,U),ee=E?re:{x:Ln(re.x,.25),y:Ln(re.y,.25)};u.began||((Y=e.onBeginChange)==null||Y.call(e),y({...u,began:!0})),L(D.id,{waypoints:D.waypoints.map((ue,oe)=>oe===u.index?ee:ue)});break}case"marquee":{const D=cn(w.clientX,w.clientY);y({...u,cur:D});const U=Math.min(u.start.x,D.x),re=Math.max(u.start.x,D.x),ee=Math.min(u.start.y,D.y),ue=Math.max(u.start.y,D.y),oe=n.nodes.filter(se=>{const tn=Ae(se),un=v.project(tn.x,tn.y,se.z+(Zn(se)?0:se.h/2));return un.x>=U&&un.x<=re&&un.y>=ee&&un.y<=ue}).map(se=>se.id);a({nodes:[...new Set([...u.additive,...oe])],edges:[]});break}}},Pn=w=>{var E,j;if((u==null?void 0:u.type)==="pan"&&!u.moved&&a({nodes:[],edges:[]}),(u==null?void 0:u.type)==="connect"){const A=Yn(w.clientX,w.clientY),B=ie.get(u.from),P=A?ie.get(A):void 0;B&&P&&P.id!==B.id&&((E=e.onConnect)==null||E.call(e,B.id,P.id,Mu(u.trail,B,u.fromSide,P)))}if((u==null?void 0:u.type)==="edgeEnd"){const A=ze.get(u.edgeId),B=Yn(w.clientX,w.clientY),P=B?ie.get(B):void 0,$=A&&(u.end==="from"?A.to:A.from);if(A&&P&&P.id!==$){const Q=pg(P,Me(w.clientX,w.clientY,P.z)),J=P.id===(u.end==="from"?A.from:A.to);(j=e.onBeginChange)==null||j.call(e),L(A.id,{...u.end==="from"?{from:P.id,fromAnchor:Q}:{to:P.id,toAnchor:Q},...J?{}:{waypoints:void 0}})}}y(null)},Ge=w=>{var B,P,$;const E=dn(w.target,"data-handle");if(!E){const Q=dn(w.target,"data-node-id"),J=dn(w.target,"data-edge-id");Q?(B=e.onOpenDocs)==null||B.call(e,{kind:"node",id:Q}):J&&((P=e.onOpenDocs)==null||P.call(e,{kind:"edge",id:J}));return}const j=ze.get(i.edges[0]);if(!E.startsWith("wp:")||!(j!=null&&j.waypoints)||d)return;const A=Number(E.split(":")[1]);($=e.onBeginChange)==null||$.call(e),L(j.id,{waypoints:j.waypoints.filter((Q,J)=>J!==A)})},Vn=I.useMemo(()=>{if(!h)return null;const w=[[0,0],[_.w,0],[0,_.h],[_.w,_.h]].map(([Y,D])=>v.unproject((Y-o.x)/o.zoom,(D-o.y)/o.zoom)),E=Math.floor(Math.min(...w.map(Y=>Y.x)))-1,j=Math.ceil(Math.max(...w.map(Y=>Y.x)))+1,A=Math.floor(Math.min(...w.map(Y=>Y.y)))-1,B=Math.ceil(Math.max(...w.map(Y=>Y.y)))+1,P=Math.max(j-E,B-A),$=P>400?10:P>160?5:1;let Q="",J="";const Re=(Y,D,U,re)=>{const ee=v.project(Y,D),ue=v.project(U,re);return`M${ee.x.toFixed(1)},${ee.y.toFixed(1)}L${ue.x.toFixed(1)},${ue.y.toFixed(1)}`};for(let Y=Math.floor(E/$)*$;Y<=j;Y+=$){const D=Re(Y,A,Y,B);Y%($*5)===0?J+=D:Q+=D}for(let Y=Math.floor(A/$)*$;Y<=B;Y+=$){const D=Re(E,Y,j,Y);Y%($*5)===0?J+=D:Q+=D}return c.jsxs("g",{"data-noexport":"",pointerEvents:"none",children:[c.jsx("path",{d:Q,stroke:"var(--isd-grid, #dde3ec)",strokeWidth:1,vectorEffect:"non-scaling-stroke",fill:"none"}),c.jsx("path",{d:J,stroke:"var(--isd-grid-major, #c8d1de)",strokeWidth:1,vectorEffect:"non-scaling-stroke",fill:"none"})]})},[h,_,o,v]),Qe=I.useMemo(()=>new Set(i.edges),[i.edges]),ce=5/o.zoom,_t=i.nodes.map(w=>{const E=ie.get(w);if(!E)return null;const j=$e(E).map(P=>v.project(P.x,P.y,E.z)),B=!Zn(E)&&v.mode==="3d"&&E.kind!=="sphere"?$e(E).map(P=>v.project(P.x,P.y,E.z+E.h)):null;return c.jsxs("g",{children:[c.jsx("polygon",{points:Dn(j),fill:"none",stroke:Ue,strokeWidth:1.5,strokeDasharray:"5 3",vectorEffect:"non-scaling-stroke"}),B&&E.kind!=="pyramid"&&E.kind!=="cone"&&c.jsx("polygon",{points:Dn(B),fill:"none",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke"})]},w)}),Bo=w=>eh.map(E=>{const j=xr(w,{side:E,t:.5},.45),A=v.project(j.x,j.y,w.z);return c.jsx("circle",{"data-handle":`conn-${E}:${w.id}`,cx:A.x,cy:A.y,r:ce*.9,fill:"#fff",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"crosshair"},children:c.jsx("title",{children:"Drag to connect"})},E)});let Vo=null;const nn=i.nodes.length===1?ie.get(i.nodes[0]):void 0;if(nn&&!d&&l==="select"&&!u){const w=Io(nn).map(P=>v.project(P.x,P.y,nn.z));let E=0;w.forEach((P,$)=>{(P.y>w[E].y+.01||Math.abs(P.y-w[E].y)<.01&&P.x>w[E].x)&&(E=$)});const j=Ae(nn),A=v.mode==="3d"&&!Zn(nn)&&nn.kind!=="sphere"&&nn.kind!=="image",B=v.project(j.x,j.y,nn.z+nn.h);Vo=c.jsxs("g",{children:[Bo(nn),!nn.locked&&c.jsx("rect",{"data-handle":String(E),x:w[E].x-ce,y:w[E].y-ce,width:ce*2,height:ce*2,fill:"#fff",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"nwse-resize"}}),A&&!nn.locked&&c.jsx("circle",{"data-handle":"height",cx:B.x,cy:B.y-14/o.zoom,r:ce,fill:Ue,stroke:"#fff",strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"ns-resize"},children:c.jsx("title",{children:"Drag to change height"})})]})}let Fr=null;const vn=i.edges.length===1&&!i.nodes.length?ze.get(i.edges[0]):void 0,Dt=vn&&W(vn);if(vn&&Dt&&!d&&l==="select"&&(u==null?void 0:u.type)!=="edgeEnd"){const{r:w,screen:E}=Kt(vn,Dt[0],Dt[1],v),j=[];if(vn.routing==="orthogonal")w.pts.slice(0,-1).forEach((B,P)=>{const $=w.pts[P+1];if(Math.hypot($.x-B.x,$.y-B.y)<.6)return;const Q={x:(E[P].x+E[P+1].x)/2,y:(E[P].y+E[P+1].y)/2},J=Math.abs(B.y-$.y)<1e-6;j.push(c.jsx("rect",{"data-handle":`seg:${P}`,x:Q.x-ce*1.1,y:Q.y-ce*1.1,width:ce*2.2,height:ce*2.2,rx:ce*.6,fill:"#fff",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"move"},children:c.jsx("title",{children:`Drag to move this ${J?"east-west":"north-south"} segment`})},`seg${P}`))});else{const B=((wn=vn.waypoints)==null?void 0:wn.length)??0;for(let P=0;P<E.length-1;P++){const $={x:(E[P].x+E[P+1].x)/2,y:(E[P].y+E[P+1].y)/2};j.push(c.jsx("circle",{"data-handle":`wpadd:${P}`,cx:$.x,cy:$.y,r:ce*.75,fill:Ue,fillOpacity:.35,stroke:"#fff",strokeWidth:1,vectorEffect:"non-scaling-stroke",style:{cursor:"copy"},children:c.jsx("title",{children:"Drag to add a bend"})},`add${P}`))}for(let P=0;P<B;P++){const $=E[P+1];j.push(c.jsx("circle",{"data-handle":`wp:${P}`,cx:$.x,cy:$.y,r:ce,fill:"#fff",stroke:Ue,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"move"},children:c.jsx("title",{children:"Drag to move, double-click to remove"})},`wp${P}`))}}const A=(B,P)=>c.jsx("circle",{"data-handle":B,cx:P.x,cy:P.y,r:ce,fill:Ue,stroke:"#fff",strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"grab"},children:c.jsx("title",{children:"Drag onto a node side to re-attach"})},B);j.push(A("edge-from",E[0]),A("edge-to",E[E.length-1])),Fr=c.jsx("g",{children:j})}let Xn=null;if((u==null?void 0:u.type)==="connect"){const w=ie.get(u.from),E=u.target&&u.target!==u.from?ie.get(u.target):void 0;if(w){const j=Mu(u.trail,w,u.fromSide,E??null),A=e.newEdgeStyle??{},B=A.routing??"orthogonal";let P;if(E)P=Kt({from:w.id,to:E.id,routing:B,rounded:A.rounded,...j},w,E,v).d;else{const $=wg(w,j,u.cursor),Q={x:0,y:0};P=sh({pts:$,zs:$.map(()=>w.z),aDir:Q,bDir:Q},"orthogonal",A.rounded??!0,v)}Xn=c.jsxs("g",{pointerEvents:"none",children:[E&&c.jsx("polygon",{points:Dn($e(E).map($=>v.project($.x,$.y,E.z))),fill:"rgba(37,99,235,0.12)",stroke:Ue,strokeWidth:2,vectorEffect:"non-scaling-stroke"}),c.jsx("path",{d:P,fill:"none",stroke:Ue,strokeWidth:2.5,strokeDasharray:"7 5",strokeLinejoin:"round",strokeLinecap:"round",vectorEffect:"non-scaling-stroke",markerEnd:`url(#${k}-preview-arrow)`})]})}}else if((u==null?void 0:u.type)==="edgeEnd"){const w=ze.get(u.edgeId),E=w&&W(w);if(w&&E){const{screen:j}=Kt(w,E[0],E[1],v),A=u.end==="from"?j[j.length-1]:j[0],B=u.target?ie.get(u.target):void 0;Xn=c.jsxs("g",{pointerEvents:"none",children:[B&&c.jsx("polygon",{points:Dn($e(B).map(P=>v.project(P.x,P.y,B.z))),fill:"rgba(37,99,235,0.12)",stroke:Ue,strokeWidth:2,vectorEffect:"non-scaling-stroke"}),c.jsx("line",{x1:A.x,y1:A.y,x2:u.cursor.x,y2:u.cursor.y,stroke:Ue,strokeWidth:2,strokeDasharray:"6 4",vectorEffect:"non-scaling-stroke"})]})}}else(u==null?void 0:u.type)==="marquee"&&(Xn=c.jsx("rect",{x:Math.min(u.start.x,u.cur.x),y:Math.min(u.start.y,u.cur.y),width:Math.abs(u.cur.x-u.start.x),height:Math.abs(u.cur.y-u.start.y),fill:"rgba(37,99,235,0.08)",stroke:Ue,strokeWidth:1,vectorEffect:"non-scaling-stroke",pointerEvents:"none"}));const Rt=14/o.zoom,Nn=e.showDocBadges??"hover",Br=new Set([...R?[R]:[],...i.nodes.map(w=>`node:${w}`),...i.edges.map(w=>`edge:${w}`)]),Wo=w=>Nn==="always"||Nn==="hover"&&Br.has(w),Le=(w,E,j)=>Wo(w)?c.jsxs("g",{className:"isd-doc-badge","data-doc-badge":w,transform:`translate(${E.x} ${E.y}) scale(${1/o.zoom})`,children:[c.jsx("title",{children:`Open docs: ${j}`}),c.jsx("rect",{x:-7,y:-7,width:14,height:14,rx:3.5}),c.jsx("path",{d:"M-3.5,-3 H3.5 M-3.5,0 H3.5 M-3.5,3 H1"})]},w):null,gi=Nn==="never"?null:[...n.nodes.filter(w=>Sn(w.doc)).map(w=>{const E=Zn(w)||w.kind==="sphere",j=E?w.z:w.z+w.h,A=$e(w).map(P=>v.project(P.x,P.y,j));let B;if(E){const P=v.project(Ae(w).x,Ae(w).y,j),$=A.reduce((Q,J)=>J.y<Q.y?J:Q);B={x:$.x+(P.x-$.x)*.12,y:$.y+(P.y-$.y)*.12+Rt}}else{const P=A.reduce(($,Q)=>Q.x>$.x?Q:$);B={x:P.x+Rt*.2,y:P.y-Rt*.9}}return Le(`node:${w.id}`,B,w.label||w.kind)}),...n.edges.filter(w=>Sn(w.doc)).map(w=>{const E=W(w);if(!E)return null;const j=ch(Kt(w,E[0],E[1],v).screen),A=w.label?(w.label.length*6.6+12)/2+12:0;return Le(`edge:${w.id}`,{x:j.x+A,y:j.y-(w.label?0:Rt*.9)},w.label||"connection")})],Ot=C&&l==="connect"&&!u?ie.get(C):void 0,Vr=(u==null?void 0:u.type)==="pan"?u.moved?"grabbing":void 0:(u==null?void 0:u.type)==="move"?u.moved?"move":void 0:(u==null?void 0:u.type)==="connect"||(u==null?void 0:u.type)==="edgeEnd"?"crosshair":(u==null?void 0:u.type)==="segment"||(u==null?void 0:u.type)==="waypoint"?"move":void 0,Wr=Vr??(F?"grab":l==="connect"?"crosshair":"default");return c.jsxs("svg",{ref:Ze,className:Vr?"isd-canvas isd-canvas-dragging":"isd-canvas",tabIndex:0,style:{cursor:Wr,touchAction:"none"},onPointerDown:te,onPointerMove:Se,onPointerUp:Pn,onPointerCancel:()=>y(null),onPointerLeave:()=>z(null),onDoubleClick:Ge,onContextMenu:w=>w.preventDefault(),onDragOver:w=>{w.dataTransfer.types.includes(qa)&&(w.preventDefault(),w.dataTransfer.dropEffect="copy")},onDrop:w=>{var j;const E=w.dataTransfer.getData(qa);E&&(w.preventDefault(),(j=e.onDropPayload)==null||j.call(e,E,Me(w.clientX,w.clientY)))},children:[c.jsx("defs",{"data-noexport":"",children:c.jsx("marker",{id:`${k}-preview-arrow`,viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"4",markerHeight:"4",orient:"auto-start-reverse",children:c.jsx("path",{d:"M0,0 L10,5 L0,10 z",fill:"#2563eb"})})}),c.jsxs("g",{"data-camera":"",transform:`translate(${o.x} ${o.y}) scale(${o.zoom})`,children:[Vn,c.jsx("g",{"data-scene":"",children:c.jsx(dh,{diagram:n,proj:v,idPrefix:k,selectedEdges:Qe,animate:f})}),c.jsxs("g",{"data-noexport":"",children:[e.focus&&c.jsx(uh,{target:e.focus,diagram:n,proj:v}),Ot&&c.jsxs("g",{children:[c.jsx("polygon",{points:Dn($e(Ot).map(w=>v.project(w.x,w.y,Ot.z))),fill:"rgba(37,99,235,0.12)",stroke:Ue,strokeWidth:2,vectorEffect:"non-scaling-stroke",pointerEvents:"none"}),Bo(Ot)]}),(u==null?void 0:u.type)==="move"&&u.dropTarget&&ie.get(u.dropTarget)&&c.jsx("polygon",{points:Dn($e(ie.get(u.dropTarget)).map(w=>v.project(w.x,w.y,ie.get(u.dropTarget).z))),fill:"rgba(37,99,235,0.08)",stroke:Ue,strokeWidth:2.5,strokeDasharray:"8 5",vectorEffect:"non-scaling-stroke",pointerEvents:"none"}),c.jsx("g",{pointerEvents:"none",children:_t}),gi,Vo,Fr,Xn]})]})]})}const Gi="http://www.w3.org/2000/svg";async function Rg(e){if(e.startsWith("data:"))return e;const n=await fetch(e,{mode:"cors"});if(!n.ok)throw new Error(`Failed to fetch ${e}`);const t=await n.blob();return new Promise((r,o)=>{const s=new FileReader;s.onload=()=>r(s.result),s.onerror=()=>o(s.error),s.readAsDataURL(t)})}async function fh(e,n={}){const t=e.querySelector("[data-scene]");if(!t)throw new Error("No scene found in SVG");const r=n.padding??24,o=t.getBBox(),s=t.cloneNode(!0);s.querySelectorAll("[data-noexport]").forEach(d=>d.remove()),s.querySelectorAll("[data-node-id],[data-edge-id]").forEach(d=>{d.removeAttribute("style")}),await Promise.all([...s.querySelectorAll("image")].map(async d=>{const h=d.getAttribute("href");if(h)try{d.setAttribute("href",await Rg(h))}catch{}}));const i=document.createElementNS(Gi,"svg"),a=Math.ceil(o.width+r*2),l=Math.ceil(o.height+r*2);if(i.setAttribute("xmlns",Gi),i.setAttribute("viewBox",`${o.x-r} ${o.y-r} ${a} ${l}`),i.setAttribute("width",String(a)),i.setAttribute("height",String(l)),i.setAttribute("font-family","Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"),n.background){const d=document.createElementNS(Gi,"rect");d.setAttribute("x",String(o.x-r)),d.setAttribute("y",String(o.y-r)),d.setAttribute("width",String(a)),d.setAttribute("height",String(l)),d.setAttribute("fill",n.background),i.appendChild(d)}return i.appendChild(s),new XMLSerializer().serializeToString(i)}async function Og(e,n={}){const t=await fh(e,{background:n.background??"#ffffff"}),r=n.scale??2,o=URL.createObjectURL(new Blob([t],{type:"image/svg+xml"}));try{const s=new Image;s.src=o,await s.decode();const i=document.createElement("canvas");i.width=Math.ceil(s.width*r),i.height=Math.ceil(s.height*r);const a=i.getContext("2d");return a.scale(r,r),a.drawImage(s,0,0),await new Promise((l,d)=>i.toBlob(h=>h?l(h):d(new Error("PNG encoding failed")),"image/png"))}finally{URL.revokeObjectURL(o)}}function $g(e){return JSON.stringify(e,null,2)}function ds(e,n,t="application/octet-stream"){const r=typeof e=="string"?new Blob([e],{type:t}):e,o=URL.createObjectURL(r),s=document.createElement("a");s.href=o,s.download=n,s.click(),setTimeout(()=>URL.revokeObjectURL(o),1e3)}function Fg(e){return new Promise((n,t)=>{const r=new FileReader;r.onload=()=>n(r.result),r.onerror=()=>t(r.error),r.readAsDataURL(e)})}const Nu="aws-icons",Bg="3.3.0",Vg={"architecture-service":"Services",resource:"Resources","architecture-group":"Groups",category:"Categories"};function Wg(e){return e.replace(/\.svg$/i,"").replace(/^(Amazon|AWS)(?=[A-Z0-9])/,"$1 ").replace(/([a-z])([A-Z])/g,"$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g,"$1 $2").replace(/\s+/g," ").replace(/\b(Io T|Cloud (?:Front|Watch|Formation|Trail|Shell|Search|Map|HSM)|Dynamo DB|Elasti Cache|Sage Maker|Open Search|Event Bridge|Code (?:Build|Commit|Deploy|Pipeline|Guru|Catalyst|Whisperer)|Doc DB)\b/g,n=>n.replace(" ","")).trim()}async function Ug(e={}){const n=e.version??Bg,t=e.folders??["architecture-service","resource","architecture-group","category"],r=await fetch(`https://data.jsdelivr.com/v1/packages/npm/${Nu}@${n}?structure=flat`,{signal:e.signal});if(!r.ok)throw new Error(`Could not list AWS icons (${r.status})`);const o=await r.json(),s=[];for(const a of o.files){const l=/^\/icons\/([^/]+)\/([^/]+\.svg)$/.exec(a.name);!l||!t.includes(l[1])||s.push({id:`aws:${l[1]}/${l[2]}`,name:Wg(l[2]),src:`https://cdn.jsdelivr.net/npm/${Nu}@${n}${a.name}`,category:Vg[l[1]]??l[1]})}return s.sort((a,l)=>t.indexOf(i(a))-t.indexOf(i(l))||a.name.localeCompare(l.name)),{id:"aws",name:"AWS",icons:s};function i(a){var l;return((l=/^aws:([^/]+)/.exec(a.id))==null?void 0:l[1])??""}}const Hg={cube:c.jsx("path",{d:"M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L18.7 8 12 11.7 5.3 8 12 4.3ZM5 9.7l6 3.3v6.6l-6-3.3V9.7Zm8 9.9V13l6-3.3v6.6l-6 3.3Z"}),square:c.jsx("path",{d:"M4 4h16v16H4V4Zm2 2v12h12V6H6Z"}),rotl:c.jsx("path",{d:"M7.1 7.1A7 7 0 1 1 5 12H3a9 9 0 1 0 2.6-6.4L3 3v6h6L7.1 7.1Z"}),rotr:c.jsx("path",{d:"M16.9 7.1A7 7 0 1 0 19 12h2a9 9 0 1 1-2.6-6.4L21 3v6h-6l1.9-1.9Z"}),pointer:c.jsx("path",{d:"m5 3 14 7-6 2-2 6L5 3Z"}),link:c.jsx("path",{d:"M3 17h6v-2H5V9h4V7H3v10Zm12-10v2h4v6h-4v2h6V7h-6ZM8 11h8v2H8v-2Z"}),undo:c.jsx("path",{d:"M9 7V3L2 10l7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11Z"}),redo:c.jsx("path",{d:"M15 7V3l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11Z"}),plus:c.jsx("path",{d:"M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"}),minus:c.jsx("path",{d:"M5 11h14v2H5z"}),fit:c.jsx("path",{d:"M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z"}),download:c.jsx("path",{d:"M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16l-5.7-5.7 1.4-1.4 3.3 3.3V3ZM4 18h16v2H4v-2Z"}),upload:c.jsx("path",{d:"M11 16h2V6.8l3.3 3.3 1.4-1.4L12 3 6.3 8.7l1.4 1.4L11 6.8V16Zm-7 2h16v2H4v-2Z"}),trash:c.jsx("path",{d:"M9 3h6l1 2h4v2H4V5h4l1-2ZM6 9h12l-1 12H7L6 9Z"}),copy:c.jsx("path",{d:"M8 3h11v13h-2V5H8V3ZM4 7h11v14H4V7Zm2 2v10h7V9H6Z"}),grid:c.jsx("path",{d:"M3 3h18v18H3V3Zm2 2v4h4V5H5Zm6 0v4h4V5h-4Zm6 0v4h2V5h-2ZM5 11v4h4v-4H5Zm6 0v4h4v-4h-4Zm6 0v4h2v-4h-2ZM5 17v2h4v-2H5Zm6 0v2h4v-2h-4Zm6 0v2h2v-2h-2Z"}),panelL:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v12h4V6H5Zm6 0v12h8V6h-8Z"}),panelR:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v12h8V6H5Zm10 0v12h4V6h-4Z"}),close:c.jsx("path",{d:"m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z"}),group:c.jsx("path",{d:"M3 3h6v2H5v4H3V3Zm12 0h6v6h-2V5h-4V3ZM3 15h2v4h4v2H3v-6Zm16 0h2v6h-6v-2h4v-4ZM8 8h8v8H8V8Z"}),doc:c.jsx("path",{d:"M6 2h9l5 5v15H6V2Zm2 2v16h10V8h-4V4H8Zm2 7h6v2h-6v-2Zm0 4h6v2h-6v-2Z"}),play:c.jsx("path",{d:"M8 5v14l11-7L8 5Z"}),pause:c.jsx("path",{d:"M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"}),image:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v9.6l4-4 4 4 2-2 4 4V6H5Zm10 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"})};function Ye({name:e,size:n=16}){return c.jsx("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":!0,children:Hg[e]})}function Ie({icon:e,label:n,active:t,disabled:r,onClick:o,children:s}){return c.jsxs("button",{type:"button",className:`isd-btn${t?" is-active":""}`,title:n,"aria-label":n,"aria-pressed":t,disabled:r,onClick:o,children:[e&&c.jsx(Ye,{name:e}),s&&c.jsx("span",{className:"isd-btn-label",children:s})]})}function ye({label:e,children:n}){return c.jsxs("label",{className:"isd-field",children:[c.jsx("span",{children:e}),n]})}function ht({value:e,onChange:n,step:t=.5,min:r,max:o}){return c.jsx("input",{type:"number",className:"isd-input",value:Number.isFinite(e)?+e.toFixed(3):0,step:t,min:r,max:o,onChange:s=>{const i=parseFloat(s.target.value);Number.isFinite(i)&&n(r!==void 0?Math.max(r,i):i)}})}const Kg=I.lazy(()=>Xf(()=>import("./DocsPanel-D7tFykSl.js"),[],import.meta.url)),Zg=1e3,no={nodes:[],edges:[]};function Gg(e){var ac;const{readOnly:n,awsIcons:t=!0}=e,[r,o]=I.useState(()=>({d:e.value??e.defaultValue??Ha(),past:[],future:[]})),s=r.d,i=s.view??e.defaultView??"3d",[a,l]=I.useState(0),[d,h]=I.useState({x:0,y:0,zoom:1}),[f,m]=I.useState(no),[k,v]=I.useState("select"),[x,_]=I.useState(!0),[g,u]=I.useState(!0),[y,C]=I.useState({}),[N,R]=I.useState("shapes"),[z,F]=I.useState(""),[le,K]=I.useState(null),[Ze,cn]=I.useState(null),[Me,Yn]=I.useState(e.userIcons??[]),[ie,ze]=I.useState(null),[Bn,L]=I.useState(!1),W=I.useRef(null),H=I.useRef(null),[te,Se]=I.useState(!1),[Pn,Ge]=I.useState(!0),[Vn,Qe]=I.useState(!0),[ce,_t]=I.useState(!1),[Bo,Vo]=I.useState(null),[nn,Fr]=I.useState({kind:"diagram"}),vn=I.useRef(null),Dt=I.useRef(null),Xn=I.useRef(null),Rt=I.useRef(null),Nn=I.useMemo(()=>new Lo(i,a),[i,a]),Br=e.userIcons??Me,Wo=p=>{var S;Yn(p),(S=e.onUserIconsChange)==null||S.call(e,p)};I.useEffect(()=>{e.value&&e.value!==Rt.current&&e.value!==r.d&&o(p=>({d:e.value,past:[...p.past,p.d].slice(-200),future:[]}))},[e.value]),I.useEffect(()=>{var p;r.d!==e.value&&(Rt.current=r.d,(p=e.onChange)==null||p.call(e,r.d))},[r.d]),I.useEffect(()=>{if(!t)return;const p=new AbortController;return Ug({signal:p.signal}).then(K).catch(S=>!p.signal.aborted&&cn(String(S.message??S))),()=>p.abort()},[t]),I.useEffect(()=>{if(!ie)return;const p=setTimeout(()=>ze(null),2200);return()=>clearTimeout(p)},[ie]);const Le=I.useCallback((p,S="push",T)=>{o(b=>{var G;const V=typeof p=="function"?p(b.d):p;if(V===b.d)return b;const Z=Date.now(),Pe=T&&((G=Xn.current)==null?void 0:G.key)===T&&Z-Xn.current.t<1200;return Xn.current=T?{key:T,t:Z}:null,S==="replace"||Pe?{...b,d:V}:{d:V,past:[...b.past,b.d].slice(-200),future:[]}})},[]),gi=I.useCallback(()=>{Xn.current=null,o(p=>({d:p.d,past:[...p.past,p.d].slice(-200),future:[]}))},[]),Ot=(p,S)=>p.view===S.view?p:{...p,view:S.view},Vr=()=>o(p=>p.past.length?{d:Ot(p.past[p.past.length-1],p.d),past:p.past.slice(0,-1),future:[p.d,...p.future]}:p),Wr=()=>o(p=>p.future.length?{d:Ot(p.future[0],p.d),past:[...p.past,p.d],future:p.future.slice(1)}:p);I.useLayoutEffect(()=>{const p=W.current;if(!p)return;const S=b=>Se(V=>{const Z=b<Zg;return Z!==V&&(Ge(!Z),Qe(!Z)),Z});S(p.getBoundingClientRect().width);const T=new ResizeObserver(([b])=>S(b.contentRect.width));return T.observe(p),()=>T.disconnect()},[]),I.useEffect(()=>{te&&!ce&&!n&&(f.nodes.length||f.edges.length)&&Qe(!0)},[te,f]);const wn=f.nodes.length===1&&!f.edges.length?{kind:"node",id:f.nodes[0]}:f.edges.length===1&&!f.nodes.length?{kind:"edge",id:f.edges[0]}:!f.nodes.length&&!f.edges.length?{kind:"diagram"}:null;I.useEffect(()=>{if(wn&&(Fr(p=>lg(p,wn)?p:wn),n&&wn.kind!=="diagram")){const p=wn.kind==="node"?s.nodes.find(S=>S.id===wn.id):s.edges.find(S=>S.id===wn.id);Sn(p==null?void 0:p.doc)&&_t(!0)}},[wn&&Nr(wn)]);const w=p=>{p&&(Fr(p),m(p.kind==="diagram"?no:p.kind==="node"?{nodes:[p.id],edges:[]}:{nodes:[],edges:[p.id]})),_t(!0),te&&(Qe(!1),Ge(!1))},E=p=>{if(w(p),p.kind==="diagram")return;let S=null;if(p.kind==="node"){const Z=s.nodes.find(Pe=>Pe.id===p.id);Z&&(S=Nn.project(Z.x+Z.w/2,Z.y+Z.d/2,Z.z))}else{const Z=s.edges.find(de=>de.id===p.id),Pe=Z&&s.nodes.find(de=>de.id===Z.from),G=Z&&s.nodes.find(de=>de.id===Z.to);if(Pe&&G){const de=Nn.project(Pe.x+Pe.w/2,Pe.y+Pe.d/2,Pe.z),Wn=Nn.project(G.x+G.w/2,G.y+G.d/2,G.z);S={x:(de.x+Wn.x)/2,y:(de.y+Wn.y)/2}}}if(!S)return;const{w:T,h:b}=A(),V=te?T:Math.max(T/2,T-440);h(Z=>({...Z,x:V/2-S.x*Z.zoom,y:b/2-S.y*Z.zoom}))},j=(p,S)=>Le(T=>ug(T,p,S),"push",`doc:${Nr(p)}`),A=()=>{var S;const p=(S=H.current)==null?void 0:S.getBoundingClientRect();return{w:(p==null?void 0:p.width)??800,h:(p==null?void 0:p.height)??600}},B=I.useCallback((p,S)=>{const{w:T,h:b}=A(),V=p.nodes.flatMap(Jn=>$e(Jn).flatMap(Zo=>[S.project(Zo.x,Zo.y,Jn.z),S.project(Zo.x,Zo.y,Jn.z+(Zn(Jn)?0:Jn.h))]));if(!V.length){h({x:T/2,y:b/3,zoom:1});return}const Z=V.map(Jn=>Jn.x),Pe=V.map(Jn=>Jn.y),G=Math.min(...Z),de=Math.max(...Z),Wn=Math.min(...Pe),lc=Math.max(...Pe)+24,vi=Math.min(1.6,Math.max(.2,Math.min(T*.85/(de-G||1),b*.85/(lc-Wn||1))));h({zoom:vi,x:T/2-(G+de)/2*vi,y:b/2-(Wn+lc)/2*vi})},[]);I.useEffect(()=>{const p=H.current;if(!p)return;const S=new ResizeObserver(([T])=>{T.contentRect.width<10||T.contentRect.height<10||(S.disconnect(),B(r.d,Nn))});return S.observe(p),()=>S.disconnect()},[]);const P=(p=Nn,S=d)=>{const{w:T,h:b}=A();return p.unproject((T/2-S.x)/S.zoom,(b/2-S.y)/S.zoom)},$=(p,S)=>{const T=P(),V=new Lo(p,S).project(T.x,T.y),{w:Z,h:Pe}=A();h({...d,x:Z/2-V.x*d.zoom,y:Pe/2-V.y*d.zoom}),p!==i&&o(G=>({...G,d:{...G.d,view:p}})),l(S)},Q=p=>{const{w:S,h:T}=A(),b=Math.min(4,Math.max(.15,d.zoom*p)),V=b/d.zoom;h({zoom:b,x:S/2-(S/2-d.x)*V,y:T/2-(T/2-d.y)*V})},J=p=>{Le(S=>({...S,nodes:[...S.nodes,p]})),m({nodes:[p.id],edges:[]}),v("select")},Re=(p,S)=>{n||(te&&Ge(!1),p.type==="shape"&&p.kind&&J(Cs(p.kind,S.x,S.y)),p.type==="icon"&&p.src&&J(rg(p.src,p.name??"",S.x,S.y)))},Y=(p,S,T)=>Le(b=>({...b,nodes:b.nodes.map(V=>V.id===p?{...V,...S}:V)}),"push",T&&`${p}:${T}`),D=(p,S)=>Le(T=>({...T,nodes:T.nodes.map(b=>p.includes(b.id)?{...b,...S}:b)})),U=(p,S,T)=>{const b=Object.fromEntries(Object.entries(S).filter(([V])=>sg.includes(V)));Object.keys(b).length&&C(V=>({...V,...b})),re(p,S,T)},re=(p,S,T)=>Le(b=>({...b,edges:b.edges.map(V=>V.id===p?{...V,...S}:V)}),"push",T&&`${p}:${T}`),ee=p=>new Set([...p,...wr(p,s.nodes)]),ue=()=>{if(!f.nodes.length&&!f.edges.length)return;const p=ee(f.nodes),S=new Set(f.edges);Le(T=>({...T,nodes:T.nodes.filter(b=>!p.has(b.id)),edges:T.edges.filter(b=>!S.has(b.id)&&!p.has(b.from)&&!p.has(b.to))})),m(no)},oe=()=>{const p=ee(f.nodes);Dt.current={nodes:s.nodes.filter(S=>p.has(S.id)),edges:s.edges.filter(S=>p.has(S.from)&&p.has(S.to))}},se=(p=1)=>{const S=Dt.current;if(!(S!=null&&S.nodes.length))return;const T=new Map,b=S.nodes.map(G=>{const de=vr("n");return T.set(G.id,de),{...G,id:de,x:G.x+p,y:G.y+p}}),V=S.edges.map(G=>{var de;return{...G,id:vr("e"),from:T.get(G.from),to:T.get(G.to),waypoints:(de=G.waypoints)==null?void 0:de.map(Wn=>({x:Wn.x+p,y:Wn.y+p}))}});Le(G=>({...G,nodes:[...G.nodes,...b],edges:[...G.edges,...V]}));const Z=new Set(b.map(G=>G.id)),Pe=wr(Z,b);m({nodes:b.filter(G=>!Pe.has(G.id)).map(G=>G.id),edges:[]}),Dt.current={nodes:b,edges:V}},tn=()=>{const p=s.nodes.filter(V=>f.nodes.includes(V.id));if(!p.length)return;const S=Cu(p),T=xt({...p[0],...S,kind:"area"},s.nodes,new Set(p.map(V=>V.id))),b={...Cs("area",0,0,{z:Math.min(...p.map(V=>V.z)),color:"#64748b",opacity:.08,dashed:!0,label:"Group"}),...S};Le(V=>({...V,nodes:[b,...V.nodes]})),m({nodes:[b.id],edges:[]}),ze(T?`Grouped inside ${T.label||"area"}`:"Grouped")},un=()=>{const p=s.nodes.filter(b=>f.nodes.includes(b.id)&&ct(b));if(!p.length)return;const S=new Set(p.map(b=>b.id)),T=s.nodes.filter(b=>!S.has(b.id)&&p.some(V=>{var Z;return((Z=xt(b,s.nodes))==null?void 0:Z.id)===V.id}));Le(b=>({...b,nodes:b.nodes.filter(V=>!S.has(V.id))})),m({nodes:T.map(b=>b.id),edges:[]})},Uo=p=>{const S=s.nodes.find(V=>V.id===p),T=wr([p],s.nodes),b=s.nodes.filter(V=>T.has(V.id));S&&b.length&&Y(p,Cu(b))},bn=p=>{const S=new Set(f.nodes);Le(T=>{const b=T.nodes.filter(Z=>S.has(Z.id)),V=T.nodes.filter(Z=>!S.has(Z.id));return{...T,nodes:p==="front"?[...V,...b]:[...b,...V]}})},dt=p=>{if(p.target.closest('input,textarea,select,[contenteditable="true"]'))return;const S=p.metaKey||p.ctrlKey,T=p.key.toLowerCase();if(S&&T==="z")p.preventDefault(),p.shiftKey?Wr():Vr();else if(S&&T==="y")p.preventDefault(),Wr();else if(T==="d"&&!S)ce?_t(!1):w();else if(S&&T==="a")p.preventDefault(),m({nodes:s.nodes.map(b=>b.id),edges:[]});else{if(n)return;if(T==="delete"||T==="backspace")p.preventDefault(),ue();else if(S&&T==="c")oe();else if(S&&T==="x")oe(),ue();else if(S&&T==="v")se();else if(S&&T==="g")p.preventDefault(),p.shiftKey?un():tn();else if(S&&T==="d")p.preventDefault(),oe(),se();else if(T==="escape")m(no),v("select");else if(T==="v"&&!S)v("select");else if(T==="c"&&!S)v("connect");else if(T==="tab")p.preventDefault(),$(i==="3d"?"2d":"3d",a);else if(T==="r"&&i==="3d")$(i,(a+(p.shiftKey?3:1))%4);else if(T.startsWith("arrow")&&f.nodes.length){p.preventDefault();const b=p.shiftKey?1:.5,Z={arrowleft:{x:-1,y:0},arrowright:{x:1,y:0},arrowup:{x:0,y:-1},arrowdown:{x:0,y:1}}[T],Pe=ee(f.nodes.filter(G=>{var de;return!((de=s.nodes.find(Wn=>Wn.id===G))!=null&&de.locked)}));Le(G=>({...G,nodes:G.nodes.map(de=>Pe.has(de.id)&&!de.locked?{...de,x:de.x+Z.x*b,y:de.y+Z.y*b}:de)}),"push","nudge")}}},Ur=I.useRef(null),yi=I.useRef(null),Hr=async p=>{L(!1);try{p==="docs"&&ds(dg(s),"architecture.md","text/markdown"),p==="json"&&ds($g(s),"diagram.json","application/json"),p==="svg"&&vn.current&&ds(await fh(vn.current),"diagram.svg","image/svg+xml"),p==="png"&&vn.current&&ds(await Og(vn.current),"diagram.png")}catch(S){ze(`Export failed: ${S.message}`)}},tc=async p=>{try{const S=ag(JSON.parse(await p.text()));Le(S),m(no),B(S,Nn),ze(`Imported ${S.nodes.length} nodes`)}catch(S){ze(S.message)}},rc=async p=>{const S=[];for(const T of Array.from(p))T.type.startsWith("image/")&&S.push({id:vr("img"),name:T.name.replace(/\.[^.]+$/,""),src:await Fg(T),category:"Imported"});S.length&&(Wo([...Br,...S]),R("mine"),ze(`Imported ${S.length} image${S.length>1?"s":""}`))},oc=()=>{var T;const p=window.prompt("Image URL (PNG, SVG, JPG…)");if(!p)return;const S=((T=p.split("/").pop())==null?void 0:T.replace(/\.[^.]+$/,""))||"Image";Wo([...Br,{id:vr("img"),name:S,src:p,category:"Imported"}]),R("mine")},sc=[...le?[le]:[],...e.iconLibraries??[],{id:"mine",name:"My images",icons:Br}],or=sc.find(p=>p.id===N),Ho=z.trim().toLowerCase(),Ko=or?or.icons.filter(p=>{var S;return!Ho||p.name.toLowerCase().includes(Ho)||((S=p.category)==null?void 0:S.toLowerCase().includes(Ho))}):[],mh=I.useMemo(()=>{const p=new Map;for(const S of Ko.slice(0,400)){const T=S.category??"";p.has(T)||p.set(T,[]),p.get(T).push(S)}return[...p.entries()]},[or,Ho]),ic=p=>S=>{S.dataTransfer.setData(qa,JSON.stringify(p)),S.dataTransfer.effectAllowed="copy"},qn=f.nodes.length===1?s.nodes.find(p=>p.id===f.nodes[0]):void 0,Kr=f.edges.length===1&&!f.nodes.length?s.edges.find(p=>p.id===f.edges[0]):void 0;return c.jsxs("div",{ref:W,className:`isd-root${te?" is-compact":""} ${e.className??""}`,style:e.style,onKeyDown:dt,onDragOver:p=>p.dataTransfer.types.includes("Files")&&p.preventDefault(),onDrop:p=>{if(p.dataTransfer.files.length&&!n){p.preventDefault();const S=Array.from(p.dataTransfer.files),T=S.find(b=>b.name.endsWith(".json"));T?tc(T):rc(S)}},children:[c.jsxs("div",{className:"isd-toolbar-wrap",children:[c.jsxs("div",{className:"isd-toolbar",children:[!n&&c.jsx("div",{className:"isd-group",children:c.jsx(Ie,{icon:"panelL",label:Pn?"Hide shapes & icons":"Show shapes & icons",active:Pn,onClick:()=>Ge(!Pn)})}),c.jsxs("div",{className:"isd-group",children:[c.jsx(Ie,{icon:"cube",label:"2.5D view (Tab)",active:i==="3d",onClick:()=>$("3d",a),children:"2.5D"}),c.jsx(Ie,{icon:"square",label:"Flat view (Tab)",active:i==="2d",onClick:()=>$("2d",a),children:"2D"})]}),c.jsxs("div",{className:"isd-group",children:[c.jsx(Ie,{icon:"rotl",label:"Rotate left (Shift+R)",disabled:i==="2d",onClick:()=>$(i,(a+3)%4)}),c.jsx(Ie,{icon:"rotr",label:"Rotate right (R)",disabled:i==="2d",onClick:()=>$(i,(a+1)%4)})]}),!n&&c.jsxs("div",{className:"isd-group",children:[c.jsx(Ie,{icon:"pointer",label:"Select (V)",active:k==="select",onClick:()=>v("select")}),c.jsx(Ie,{icon:"link",label:"Connect (C): drag from one node to another",active:k==="connect",onClick:()=>v("connect")})]}),!n&&c.jsxs("div",{className:"isd-group",children:[c.jsx(Ie,{icon:"undo",label:"Undo (⌘Z)",disabled:!r.past.length,onClick:Vr}),c.jsx(Ie,{icon:"redo",label:"Redo (⇧⌘Z)",disabled:!r.future.length,onClick:Wr})]}),c.jsxs("div",{className:"isd-group isd-hide-compact",children:[c.jsx(Ie,{icon:"minus",label:"Zoom out",onClick:()=>Q(1/1.25)}),c.jsxs("span",{className:"isd-zoom",children:[Math.round(d.zoom*100),"%"]}),c.jsx(Ie,{icon:"plus",label:"Zoom in",onClick:()=>Q(1.25)})]}),c.jsxs("div",{className:"isd-group",children:[c.jsx(Ie,{icon:"fit",label:"Fit to content",onClick:()=>B(s,Nn)}),c.jsx(Ie,{icon:"grid",label:"Toggle grid",active:x,onClick:()=>_(!x)}),c.jsx(Ie,{icon:g?"pause":"play",label:g?"Pause connection animations":"Play connection animations",onClick:()=>u(!g)})]}),c.jsx("div",{className:"isd-spacer"}),!n&&c.jsx("div",{className:"isd-group",children:c.jsx(Ie,{icon:"upload",label:"Open diagram (.json)",onClick:()=>{var p;return(p=Ur.current)==null?void 0:p.click()},children:"Open"})}),c.jsx("div",{className:"isd-group",children:c.jsx(Ie,{icon:"doc",label:ce?"Hide docs (D)":"Show docs (D)",active:ce,onClick:()=>ce?_t(!1):w(),children:"Docs"})}),c.jsx("div",{className:"isd-group",children:c.jsx(Ie,{icon:"download",label:"Export",active:Bn,onClick:()=>L(!Bn),children:"Export"})}),!n&&c.jsx("div",{className:"isd-group",children:c.jsx(Ie,{icon:"panelR",label:Vn?"Hide inspector":"Show inspector",active:Vn,onClick:()=>Qe(!Vn)})}),c.jsx("input",{ref:Ur,type:"file",accept:".json,application/json",hidden:!0,onChange:p=>{var T;const S=(T=p.target.files)==null?void 0:T[0];S&&tc(S),p.target.value=""}}),c.jsx("input",{ref:yi,type:"file",accept:"image/*",multiple:!0,hidden:!0,onChange:p=>{p.target.files&&rc(p.target.files),p.target.value=""}})]}),Bn&&c.jsxs("div",{className:"isd-menu",onMouseLeave:()=>L(!1),children:[c.jsx("button",{type:"button",onClick:()=>Hr("png"),children:"PNG image"}),c.jsx("button",{type:"button",onClick:()=>Hr("svg"),children:"SVG vector"}),c.jsx("button",{type:"button",onClick:()=>Hr("json"),children:"Diagram JSON"}),c.jsx("button",{type:"button",onClick:()=>Hr("docs"),children:"Docs (Markdown)"})]})]}),c.jsxs("div",{className:"isd-body",children:[!n&&Pn&&c.jsxs("aside",{className:"isd-palette",children:[te&&c.jsx("button",{type:"button",className:"isd-drawer-close","aria-label":"Close panel",onClick:()=>Ge(!1),children:c.jsx(Ye,{name:"close"})}),c.jsxs("div",{className:"isd-tabs",role:"tablist",children:[[{id:"shapes",name:"Shapes"},...sc].map(p=>c.jsx("button",{type:"button",role:"tab","aria-selected":N===p.id,className:N===p.id?"is-active":"",onClick:()=>R(p.id),children:p.name},p.id)),t&&!le&&c.jsx("span",{className:"isd-tab-note",children:Ze?"AWS icons unavailable":"Loading AWS…"})]}),N==="shapes"?c.jsxs("div",{className:"isd-palette-scroll",children:[c.jsx("div",{className:"isd-shape-grid",children:Jf.map(p=>c.jsxs("button",{type:"button",className:"isd-tile",draggable:!0,onDragStart:ic({type:"shape",kind:p.kind}),onClick:()=>Re({type:"shape",kind:p.kind},P()),title:`${p.name} — click or drag onto canvas`,children:[c.jsx(Ig,{node:Cs(p.kind,0,0,{id:`pv-${p.kind}`,text:"Aa",fontSize:1.4})}),c.jsx("span",{children:p.name})]},p.kind))}),c.jsx("div",{className:"isd-section-title",children:"Images & logos"}),c.jsxs("div",{className:"isd-import-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{var p;return(p=yi.current)==null?void 0:p.click()},children:[c.jsx(Ye,{name:"upload"})," Upload"]}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:oc,children:[c.jsx(Ye,{name:"link"})," From URL"]})]}),c.jsx("p",{className:"isd-hint",children:"Tip: drop image files anywhere on the editor to import them."})]}):c.jsxs(c.Fragment,{children:[c.jsx("div",{className:"isd-search",children:c.jsx("input",{className:"isd-input",placeholder:`Search ${(or==null?void 0:or.name)??""}…`,value:z,onChange:p=>F(p.target.value)})}),c.jsxs("div",{className:"isd-palette-scroll",children:[N==="mine"&&c.jsxs("div",{className:"isd-import-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{var p;return(p=yi.current)==null?void 0:p.click()},children:[c.jsx(Ye,{name:"upload"})," Upload"]}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:oc,children:[c.jsx(Ye,{name:"link"})," From URL"]})]}),mh.map(([p,S])=>c.jsxs("div",{children:[p&&c.jsx("div",{className:"isd-section-title",children:p}),c.jsx("div",{className:"isd-icon-grid",children:S.map(T=>c.jsxs("button",{type:"button",className:"isd-icon-tile",title:T.name,draggable:!0,onDragStart:ic({type:"icon",src:T.src,name:T.name}),onClick:()=>Re({type:"icon",src:T.src,name:T.name},P()),children:[c.jsx("img",{src:T.src,alt:"",loading:"lazy",draggable:!1}),c.jsx("span",{children:T.name.replace(/^(Amazon|AWS) /,"")})]},T.id))})]},p)),Ko.length>400&&c.jsxs("p",{className:"isd-hint",children:["Showing 400 of ",Ko.length,". Refine your search."]}),!Ko.length&&c.jsx("p",{className:"isd-hint",children:N==="mine"?"No images yet. Upload PNG/SVG logos to use them as nodes.":"No matches."})]})]})]}),c.jsxs("div",{className:"isd-stage",ref:H,children:[c.jsx(Dg,{svgRef:vn,diagram:s,view:i,rotation:a,camera:d,onCameraChange:h,selection:f,onSelectionChange:m,tool:k,readOnly:n,showGrid:x,animate:g,onOpenDocs:w,focus:ce?Bo:null,showDocBadges:e.docBadges,newEdgeStyle:{routing:"orthogonal",rounded:!0,...y},onBeginChange:gi,onChange:p=>Le(p,"replace"),onConnect:(p,S,T)=>{const b=og(p,S,{...y,...T});Le(V=>({...V,edges:[...V.edges,b]})),m({nodes:[],edges:[b.id]})},onDropPayload:(p,S)=>{try{Re(JSON.parse(p),S)}catch{}}}),c.jsxs("div",{className:"isd-status",children:[i==="3d"?`2.5D · ${["N","E","S","W"][a]}`:"Flat"," · ",s.nodes.length," nodes · ",s.edges.length," connections"]}),ie&&c.jsx("div",{className:"isd-toast",children:ie}),ce&&c.jsx(I.Suspense,{fallback:c.jsx("aside",{className:"isd-docs isd-docs-loading",children:"Loading editor…"}),children:c.jsx(Kg,{target:nn,diagram:s,readOnly:n,onChange:j,onNavigate:E,onMentionHover:Vo,onClose:()=>_t(!1),onExport:()=>void Hr("docs")})})]}),!n&&Vn&&c.jsxs("aside",{className:"isd-inspector",children:[te&&c.jsx("button",{type:"button",className:"isd-drawer-close","aria-label":"Close inspector",onClick:()=>Qe(!1),children:c.jsx(Ye,{name:"close"})}),qn?c.jsx(Qg,{node:qn,onOpenDocs:()=>w({kind:"node",id:qn.id}),parent:xt(qn,s.nodes),contents:ct(qn)?wr([qn.id],s.nodes).size:0,onSelectNodes:p=>m({nodes:p,edges:[]}),onSelectContents:()=>m({nodes:s.nodes.filter(p=>{var S;return((S=xt(p,s.nodes))==null?void 0:S.id)===qn.id}).map(p=>p.id),edges:[]}),onFitContents:()=>Uo(qn.id),onUngroup:un,onChange:(p,S)=>Y(qn.id,p,S),onDelete:ue,onDuplicate:()=>{oe(),se()},onReorder:bn}):Kr?c.jsx(Xg,{edge:Kr,onOpenDocs:()=>w({kind:"edge",id:Kr.id}),onChange:(p,S)=>U(Kr.id,p,S),onRoute:p=>re(Kr.id,p),onDelete:ue}):f.nodes.length>1?c.jsxs("div",{className:"isd-panel",children:[c.jsxs("h3",{children:[f.nodes.length," nodes selected"]}),c.jsx(ye,{label:"Color",children:c.jsx(Jl,{value:"",onChange:p=>D(f.nodes,{color:p})})}),c.jsx(ye,{label:"Elevation",children:c.jsx(ht,{value:((ac=s.nodes.find(p=>p.id===f.nodes[0]))==null?void 0:ac.z)??0,onChange:p=>D(f.nodes,{z:p})})}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:tn,title:"Wrap the selection in a new area (⌘G)",children:[c.jsx(Ye,{name:"group"})," Group into area"]}),c.jsxs("div",{className:"isd-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{oe(),se()},children:[c.jsx(Ye,{name:"copy"})," Duplicate"]}),c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:ue,children:[c.jsx(Ye,{name:"trash"})," Delete"]})]})]}):c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:"Diagram"}),c.jsx("p",{className:"isd-hint",children:"Click a shape or icon to add it, or drag it onto the canvas. Select a node to edit it."}),c.jsx(ql,{has:Sn(s.doc),label:"diagram overview",onClick:()=>w({kind:"diagram"})}),c.jsxs("dl",{className:"isd-keys",children:[c.jsx("dt",{children:"Drag empty space"}),c.jsx("dd",{children:"Pan"}),c.jsx("dt",{children:"Scroll / pinch"}),c.jsx("dd",{children:"Zoom"}),c.jsx("dt",{children:"Shift + drag"}),c.jsx("dd",{children:"Box select"}),c.jsx("dt",{children:"C / V"}),c.jsx("dd",{children:"Connect / Select tool"}),c.jsx("dt",{children:"Tab"}),c.jsx("dd",{children:"Toggle 2D / 2.5D"}),c.jsx("dt",{children:"R / Shift+R"}),c.jsx("dd",{children:"Rotate view"}),c.jsx("dt",{children:"Arrows"}),c.jsx("dd",{children:"Nudge"}),c.jsx("dt",{children:"Alt + drag"}),c.jsx("dd",{children:"Move without snapping"}),c.jsx("dt",{children:"⌘D / ⌘C / ⌘V"}),c.jsx("dd",{children:"Duplicate / copy / paste"}),c.jsx("dt",{children:"⌘G / ⇧⌘G"}),c.jsx("dd",{children:"Group into area / ungroup"}),c.jsx("dt",{children:"D / double-click"}),c.jsx("dd",{children:"Open docs"}),c.jsx("dt",{children:"⌘Z / ⇧⌘Z"}),c.jsx("dd",{children:"Undo / redo"})]}),s.nodes.length>0&&c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:()=>{window.confirm("Clear the whole diagram?")&&Le(Ha())},children:[c.jsx(Ye,{name:"trash"})," Clear diagram"]})]})]})]})]})}function ql({has:e,label:n,onClick:t}){return c.jsxs("button",{type:"button",className:`isd-btn isd-docs-btn${e?" has-doc":""}`,onClick:t,title:"Open the docs panel (D)",children:[c.jsx(Ye,{name:"doc"})," ",e?`Open ${n}`:`Add ${n}`]})}function Jl({value:e,onChange:n}){return c.jsxs("div",{className:"isd-swatches",children:[tg.map(t=>c.jsx("button",{type:"button",className:`isd-swatch${t.toLowerCase()===e.toLowerCase()?" is-active":""}`,style:{background:t},title:t,onClick:()=>n(t)},t)),c.jsx("input",{type:"color",className:"isd-color",value:/^#[0-9a-f]{6}$/i.test(e)?e:"#4f8cf7",onChange:t=>n(t.target.value),title:"Custom color"})]})}function Qg({node:e,onOpenDocs:n,parent:t,contents:r,onChange:o,onDelete:s,onDuplicate:i,onReorder:a,onSelectNodes:l,onSelectContents:d,onFitContents:h,onUngroup:f}){const m=Zn(e),k=e.kind==="area"||e.kind==="circleArea",v=["block","cylinder","hexagon","pyramid","cone","sphere"];return c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:Pr[e.kind]}),c.jsx(ql,{has:Sn(e.doc),label:ct(e)?"area docs":"docs",onClick:n}),t&&c.jsxs("button",{type:"button",className:"isd-breadcrumb",onClick:()=>l([t.id]),title:"Select the containing area",children:["Inside ",c.jsx("strong",{children:t.label||Pr[t.kind]})]}),ct(e)&&c.jsxs("div",{className:"isd-container-box",children:[c.jsx("span",{children:r?`Contains ${r} item${r===1?"":"s"} — they move with this area.`:"Drop shapes inside to group them with this area."}),r>0&&c.jsxs("div",{className:"isd-container-actions",children:[c.jsx("button",{type:"button",className:"isd-btn is-wide",onClick:d,children:"Select contents"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:h,title:"Resize to wrap the contents",children:"Fit to contents"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:f,title:"Remove the area, keep its contents (⇧⌘G)",children:"Ungroup"})]})]}),e.kind==="text"?c.jsx(ye,{label:"Text",children:c.jsx("textarea",{className:"isd-input",rows:3,value:e.text??"",onChange:x=>o({text:x.target.value},"text")})}):c.jsx(ye,{label:"Label",children:c.jsx("input",{className:"isd-input",value:e.label??"",placeholder:"Add a label",onChange:x=>o({label:x.target.value},"label")})}),v.includes(e.kind)&&c.jsx(ye,{label:"Shape",children:c.jsx("select",{className:"isd-input",value:e.kind,onChange:x=>o({kind:x.target.value}),children:v.map(x=>c.jsx("option",{value:x,children:Pr[x]},x))})}),e.kind!=="image"||e.imageStyle==="tile"?c.jsx(ye,{label:e.kind==="image"?"Tile color":"Color",children:c.jsx(Jl,{value:e.color,onChange:x=>o({color:x})})}):null,e.kind==="image"&&c.jsxs(c.Fragment,{children:[c.jsx(ye,{label:"Style",children:c.jsxs("select",{className:"isd-input",value:e.imageStyle??"tile",onChange:x=>o({imageStyle:x.target.value}),children:[c.jsx("option",{value:"tile",children:"Tile (icon on a block)"}),c.jsx("option",{value:"flat",children:"Flat (on the ground)"}),c.jsx("option",{value:"standing",children:"Standing (billboard)"})]})}),c.jsx("div",{className:"isd-image-preview",children:c.jsx("img",{src:e.src,alt:""})})]}),c.jsxs("div",{className:"isd-grid2",children:[c.jsx(ye,{label:"X",children:c.jsx(ht,{value:e.x,onChange:x=>o({x},"x")})}),c.jsx(ye,{label:"Y",children:c.jsx(ht,{value:e.y,onChange:x=>o({y:x},"y")})}),c.jsx(ye,{label:"Width",children:c.jsx(ht,{value:e.w,min:.5,onChange:x=>o({w:x},"w")})}),c.jsx(ye,{label:"Depth",children:c.jsx(ht,{value:e.d,min:.5,onChange:x=>o({d:x},"d")})}),!m&&e.kind!=="sphere"&&c.jsx(ye,{label:"Height",children:c.jsx(ht,{value:e.h,min:.1,step:.25,onChange:x=>o({h:x},"h")})}),c.jsx(ye,{label:"Elevation",children:c.jsx(ht,{value:e.z,step:.25,onChange:x=>o({z:x},"z")})})]}),e.kind==="text"&&c.jsx(ye,{label:"Font size",children:c.jsx(ht,{value:e.fontSize??.7,min:.2,step:.1,onChange:x=>o({fontSize:x},"fs")})}),c.jsx(ye,{label:k?"Fill opacity":"Opacity",children:c.jsx("input",{type:"range",min:0,max:1,step:.05,value:e.opacity??(k?.18:1),onChange:x=>o({opacity:parseFloat(x.target.value)},"opacity")})}),k&&c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.dashed,onChange:x=>o({dashed:x.target.checked})})," Dashed border"]}),e.kind!=="text"&&c.jsx(ye,{label:"Label color",children:c.jsx("input",{type:"color",className:"isd-color",value:e.labelColor??"#1f2937",onChange:x=>o({labelColor:x.target.value},"lc")})}),c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.locked,onChange:x=>o({locked:x.target.checked})})," Lock position"]}),c.jsxs("div",{className:"isd-row",children:[c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>a("back"),title:"Draw first among flat items",children:"To back"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>a("front"),children:"To front"})]}),c.jsxs("div",{className:"isd-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:i,children:[c.jsx(Ye,{name:"copy"})," Duplicate"]}),c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:s,title:r?"Deletes the area and everything inside it":void 0,children:[c.jsx(Ye,{name:"trash"})," ",r?"Delete all":"Delete"]})]})]})}function Qi({value:e,options:n,onChange:t}){return c.jsx("div",{className:"isd-segmented",role:"radiogroup",children:n.map(([r,o])=>c.jsx("button",{type:"button",role:"radio","aria-checked":e===r,className:e===r?"is-active":"",onClick:()=>t(r),children:o},r))})}const bu=[["none","None"],["arrow","Arrow"],["open","Open arrow"],["circle","Circle"],["diamond","Diamond"]],Yg=[["none","None"],["flow","Flow (marching dashes)"],["packets","Data packets"],["pulse","Pulse (travelling)"],["glow","Glow (breathing)"]];function Xg({edge:e,onOpenDocs:n,onChange:t,onRoute:r,onDelete:o}){var a;const s=e.animation??"none",i=!!(e.fromAnchor||e.toAnchor||(a=e.waypoints)!=null&&a.length);return c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:"Connection"}),c.jsx(ql,{has:Sn(e.doc),label:"docs",onClick:n}),c.jsx(ye,{label:"Label",children:c.jsx("input",{className:"isd-input",value:e.label??"",placeholder:"e.g. HTTPS",onChange:l=>t({label:l.target.value},"label")})}),c.jsx(ye,{label:"Color",children:c.jsx(Jl,{value:e.color,onChange:l=>t({color:l})})}),c.jsx("div",{className:"isd-section-title",children:"Path"}),c.jsx(Qi,{value:e.routing,options:[["orthogonal","Right-angle"],["straight","Straight"],["curved","Curved"]],onChange:l=>t({routing:l})}),e.routing==="orthogonal"&&c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.rounded,onChange:l=>t({rounded:l.target.checked})})," Rounded corners"]}),c.jsx("p",{className:"isd-hint",children:e.routing==="orthogonal"?"Drag the square handles to move segments. Drag an end dot onto any side of a node to re-attach it.":"Drag the small dots to add bends; double-click a bend to remove it. Drag an end dot to re-attach."}),c.jsxs("div",{className:"isd-row",children:[c.jsx("button",{type:"button",className:"isd-btn",disabled:!i,onClick:()=>r({fromAnchor:void 0,toAnchor:void 0,waypoints:void 0}),children:"Reset route"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>{var l;return r({from:e.to,to:e.from,fromAnchor:e.toAnchor,toAnchor:e.fromAnchor,waypoints:(l=e.waypoints)==null?void 0:l.slice().reverse()})},children:"Reverse"})]}),c.jsx("div",{className:"isd-section-title",children:"Line"}),c.jsx(Qi,{value:nh(e),options:[["solid","Solid"],["dashed","Dashed"],["dotted","Dotted"]],onChange:l=>t({lineStyle:l,dashed:void 0})}),c.jsx(ye,{label:"Width",children:c.jsx("input",{type:"range",min:1,max:8,step:.5,value:e.width,onChange:l=>t({width:parseFloat(l.target.value)},"w")})}),c.jsxs("div",{className:"isd-grid2",children:[c.jsx(ye,{label:"Start",children:c.jsx("select",{className:"isd-input",value:th(e),onChange:l=>t({startMarker:l.target.value,arrowStart:void 0}),children:bu.map(([l,d])=>c.jsx("option",{value:l,children:d},l))})}),c.jsx(ye,{label:"End",children:c.jsx("select",{className:"isd-input",value:rh(e),onChange:l=>t({endMarker:l.target.value,arrowEnd:void 0}),children:bu.map(([l,d])=>c.jsx("option",{value:l,children:d},l))})})]}),c.jsx("div",{className:"isd-section-title",children:"Animation"}),c.jsx("select",{className:"isd-input",value:s,onChange:l=>t({animation:l.target.value}),children:Yg.map(([l,d])=>c.jsx("option",{value:l,children:d},l))}),s!=="none"&&c.jsxs(c.Fragment,{children:[s!=="glow"&&c.jsx(Qi,{value:e.animationDirection??"forward",options:s==="flow"?[["forward","Forward"],["reverse","Reverse"]]:[["forward","Forward"],["reverse","Reverse"],["both","Both ways"]],onChange:l=>t({animationDirection:l})}),c.jsx(ye,{label:`Speed · ${(e.animationSpeed??1).toFixed(2).replace(/\.?0+$/,"")}×`,children:c.jsx("input",{type:"range",min:.25,max:3,step:.25,value:e.animationSpeed??1,onChange:l=>t({animationSpeed:parseFloat(l.target.value)},"speed")})}),s!=="flow"&&s!=="glow"&&c.jsx(ye,{label:"Highlight color",children:c.jsx("input",{type:"color",className:"isd-color",value:e.animationColor??At(e.color,1.55),onChange:l=>t({animationColor:l.target.value},"ac")})})]}),c.jsx("div",{className:"isd-row",children:c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:o,children:[c.jsx(Ye,{name:"trash"})," Delete"]})})]})}const qg=I.lazy(()=>Xf(()=>import("./PublishedView-BYGwmeuV.js"),__vite__mapDeps([0,1]),import.meta.url));function Jg(e){return c.jsx(I.Suspense,{fallback:c.jsx("div",{className:"isd-pub isd-pub-loading",children:"Loading…"}),children:c.jsx(qg,{...e})})}function js(e,n,t={}){const r=new Map,o=n.split(/^<!-- (diagram|(?:node|edge):[\w-]+) -->$/m);for(let s=1;s<o.length;s+=2){const i=o[s+1].replace(/<!-- embed:([\w-]+) -->/g,(a,l)=>{const d=t[l];if(!d)throw new Error(`Unknown embed "${l}"`);return"```isodraw\n"+JSON.stringify(d)+"\n```"});r.set(o[s],i.trim())}return{...e,doc:r.get("diagram")??e.doc,nodes:e.nodes.map(s=>r.has(`node:${s.id}`)?{...s,doc:r.get(`node:${s.id}`)}:s),edges:e.edges.map(s=>r.has(`edge:${s.id}`)?{...s,doc:r.get(`edge:${s.id}`)}:s)}}const ey=`<!-- diagram -->
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
`,ny=`<!-- diagram -->
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
`,ty=`<!-- diagram -->
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
`,ry=`<!-- diagram -->
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
`,Yi="https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons/architecture-service",oy={version:1,nodes:[{id:"title",kind:"text",x:0,y:-4,w:16,d:2,h:0,z:0,color:"#0f172a",text:"Three-tier web app",fontSize:1.1},{id:"vpc",kind:"area",x:4,y:-1,w:17,d:13,h:0,z:0,color:"#8c4fff",opacity:.08,dashed:!0,label:"VPC 10.0.0.0/16",labelColor:"#6d28d9"},{id:"pub",kind:"area",x:5,y:0,w:4,d:11,h:0,z:0,color:"#7aa116",opacity:.14,label:"Public subnet"},{id:"app",kind:"area",x:10,y:0,w:5,d:11,h:0,z:0,color:"#4f8cf7",opacity:.14,label:"App subnet"},{id:"data",kind:"area",x:16,y:0,w:4,d:11,h:0,z:0,color:"#ed7100",opacity:.14,label:"Data subnet"},{id:"users",kind:"image",x:-4,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"standing",src:"https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons/resource/Users.svg",label:"Users"},{id:"cf",kind:"image",x:0,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${Yi}/AmazonCloudFront.svg`,label:"CloudFront"},{id:"s3",kind:"image",x:0,y:8,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${Yi}/AmazonSimpleStorageService.svg`,label:"S3 assets"},{id:"alb",kind:"image",x:6,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${Yi}/ElasticLoadBalancing.svg`,label:"ALB"},{id:"ec2a",kind:"block",x:11,y:1.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-1"},{id:"ec2b",kind:"block",x:11,y:4.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-2"},{id:"ec2c",kind:"block",x:11,y:7.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-3"},{id:"rds",kind:"cylinder",x:17,y:2,w:2,d:2,h:1.75,z:0,color:"#3b48cc",label:"RDS primary"},{id:"rds2",kind:"cylinder",x:17,y:6,w:2,d:2,h:1.75,z:0,color:"#6b77e5",label:"RDS replica"},{id:"cache",kind:"hexagon",x:17,y:9,w:2,d:1.5,h:.75,z:0,color:"#dd344c",label:"ElastiCache"}],edges:[{id:"e1",from:"users",to:"cf",color:"#475569",width:2,routing:"curved",endMarker:"arrow",label:"HTTPS",animation:"packets",animationDirection:"both"},{id:"e2",from:"cf",to:"alb",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"flow"},{id:"e3",from:"cf",to:"s3",color:"#7aa116",width:2,routing:"orthogonal",rounded:!0,lineStyle:"dashed",endMarker:"open"},{id:"e4",from:"alb",to:"ec2a",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e5",from:"alb",to:"ec2b",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e6",from:"alb",to:"ec2c",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e7",from:"ec2b",to:"rds",color:"#3b48cc",width:2,routing:"orthogonal",rounded:!0,startMarker:"circle",endMarker:"arrow",animation:"pulse"},{id:"e8",from:"rds",to:"rds2",color:"#3b48cc",width:2,routing:"straight",lineStyle:"dotted",endMarker:"arrow",label:"replication",animation:"flow",animationSpeed:.5},{id:"e9",from:"ec2c",to:"cache",color:"#dd344c",width:2,routing:"orthogonal",rounded:!0,startMarker:"diamond",endMarker:"arrow",animation:"glow"}]},hh=js(oy,ry),ph="https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons",ve=e=>`${ph}/architecture-service/${e}.svg`,ec=e=>`${ph}/resource/${e}.svg`;function fe(e,n,t,r,o,s={}){return{id:e,kind:"image",label:n,src:t,x:r,y:o,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",...s}}function Zt(e,n,t,r,o,s,i,a={}){return{id:e,kind:"area",label:n,color:t,x:r,y:o,w:s,d:i,h:0,z:0,opacity:.12,...a}}function nc(e,n,t,r,o){return{id:e,kind:"text",text:n,x:t,y:r,w:o,d:2,h:0,z:0,color:"#0f172a",fontSize:1.1}}function q(e,n,t,r={}){return{id:e,from:n,to:t,color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",...r}}const sy={version:1,nodes:[{id:"in",kind:"block",label:"API event",x:0,y:0,w:2,d:2,h:.5,z:0,color:"#8c4fff"},{id:"validate",kind:"hexagon",label:"validate()",x:4,y:0,w:2,d:2,h:.75,z:0,color:"#f2a93b"},{id:"idem",kind:"cylinder",label:"idempotency cache",x:4,y:4,w:2,d:2,h:1,z:0,color:"#64748b"},{id:"put",kind:"block",label:"table.put()",x:8,y:0,w:2,d:2,h:.75,z:0,color:"#3b48cc"},{id:"send",kind:"block",label:"queue.send()",x:12,y:0,w:2,d:2,h:.75,z:0,color:"#dd344c"},{id:"out",kind:"pyramid",label:"201 Created",x:12,y:4,w:2,d:2,h:1,z:0,color:"#3fb27f"}],edges:[q("i1","in","validate",{animation:"packets"}),q("i2","validate","idem",{lineStyle:"dashed",label:"seen?",startMarker:"arrow"}),q("i3","validate","put",{animation:"packets"}),q("i4","put","send",{animation:"packets"}),q("i5","send","out",{color:"#3fb27f"})]},iy={version:1,nodes:[nc("title","Serverless order API",-2,-5,14),fe("client","Mobile app",ec("Mobileclient"),-5,3,{imageStyle:"standing"}),fe("cognito","Cognito",ve("AmazonCognito"),0,-2.5),fe("apigw","API Gateway",ve("AmazonAPIGateway"),0,3),Zt("backend","Serverless backend","#ed7100",4,-2.5,17.5,14,{dashed:!0,opacity:.06}),fe("orders","orders-api",ve("AWSLambda"),6,3),fe("ddb","Orders table",ve("AmazonDynamoDB"),12.5,-1),fe("sqs","order-events",ve("AmazonSimpleQueueService"),12.5,3),fe("notify","notify",ve("AWSLambda"),17.5,3),fe("receipts","Receipts",ve("AmazonSimpleStorageService"),17.5,-1),fe("sns","order-updates",ve("AmazonSimpleNotificationService"),17.5,7.5),fe("logs","CloudWatch",ve("AmazonCloudWatch"),6,7.5)],edges:[q("e1","client","apigw",{routing:"curved",label:"HTTPS",animation:"packets",animationDirection:"both"}),q("e2","apigw","cognito",{lineStyle:"dashed",color:"#c925d1",endMarker:"open",label:"verify JWT"}),q("e3","apigw","orders",{animation:"flow"}),q("e4","orders","ddb",{color:"#3b48cc",animation:"packets",label:"PutItem"}),q("e5","orders","sqs",{color:"#dd344c",animation:"packets",label:"OrderPlaced"}),q("e6","sqs","notify",{color:"#dd344c",animation:"flow"}),q("e7","notify","receipts",{lineStyle:"dashed",color:"#7aa116"}),q("e8","notify","sns",{color:"#dd344c"}),q("e9","orders","logs",{lineStyle:"dotted",color:"#94a3b8",endMarker:"none",label:"logs"})]},Xi=(e,n,t)=>({id:e,kind:"block",label:n,x:-7,y:t,w:1.5,d:1.5,h:.75,z:0,color:"#7aa116"}),ay={version:1,nodes:[nc("title","Streaming IoT pipeline",-2,-5,16),Zt("floor","Factory floor","#7aa116",-8.5,-1,4.5,8.5),Xi("s1","Line 1",0),Xi("s2","Line 2",2.5),Xi("s3","Line 3",5),fe("iot","IoT Core",ve("AWSIoTCore"),-1.5,2),fe("kinesis","Kinesis",ve("AmazonKinesisDataStreams"),3,2),fe("enrich","enrich",ve("AWSLambda"),7.5,2),fe("search","OpenSearch",ve("AmazonOpenSearchService"),12.5,2),fe("firehose","Firehose",ve("AmazonDataFirehose"),7.5,7),Zt("lake","Data lake","#3fb27f",-2,10,12.5,7.5),fe("raw","raw",ve("AmazonSimpleStorageService"),-.5,11.5),fe("curated","curated",ve("AmazonSimpleStorageService"),6.5,11.5),fe("glue","Glue crawler",ve("AWSGlue"),3,14.5),fe("athena","Athena",ve("AmazonAthena"),13.5,14.5),fe("analysts","Analysts",ec("Users"),18,14.5,{imageStyle:"standing"})],edges:[q("e1","s1","iot",{color:"#7aa116",animation:"packets",label:"MQTT"}),q("e2","s2","iot",{color:"#7aa116",animation:"packets"}),q("e3","s3","iot",{color:"#7aa116",animation:"packets"}),q("e4","iot","kinesis",{animation:"packets",animationSpeed:1.5}),q("e5","kinesis","enrich",{animation:"packets",animationSpeed:1.5}),q("e6","enrich","search",{color:"#3b48cc",animation:"pulse",label:"hot path"}),q("e7","enrich","firehose",{animation:"flow",label:"cold path"}),q("e8","firehose","curated",{color:"#3fb27f",animation:"flow"}),q("e9","iot","raw",{lineStyle:"dashed",color:"#94a3b8",routing:"curved",label:"archive"}),q("e10","glue","curated",{lineStyle:"dotted",color:"#8c4fff",endMarker:"open"}),q("e11","athena","glue",{lineStyle:"dotted",color:"#8c4fff",label:"catalog"}),q("e12","analysts","athena",{routing:"straight",animation:"packets",animationDirection:"both"})]},qi=(e,n,t,r,o)=>({id:e,kind:"block",label:n,x:t,y:r,w:2.5,d:2,h:1,z:0,color:o}),ly={version:1,nodes:[nc("title","Kubernetes microservices",2,-7,18),fe("users","Shoppers",ec("Users"),-6,4,{imageStyle:"standing"}),fe("dns","Route 53",ve("AmazonRoute53"),-2,4),fe("alb","Ingress ALB",ve("ElasticLoadBalancing"),1.5,4),Zt("eks","EKS cluster","#ed7100",4.5,-3,20,16,{dashed:!0,opacity:.05}),Zt("ns-web","namespace: web","#4f8cf7",5.5,-2,8,7),Zt("ns-orders","namespace: orders","#dd344c",14.5,-2,9,7),Zt("ns-platform","namespace: platform","#64748b",5.5,6,18,6),qi("storefront","storefront",6.5,-.5,"#4f8cf7"),qi("cart","cart",10,2,"#4f8cf7"),qi("orders-svc","orders",15.5,-.5,"#dd344c"),{id:"payments",kind:"hexagon",label:"payments",x:20,y:1.5,w:2.5,d:2,h:1,z:0,color:"#c925d1"},{id:"prometheus",kind:"pyramid",label:"Prometheus",x:7,y:7.5,w:2.5,d:2.5,h:1.75,z:0,color:"#e5534b"},{id:"argocd",kind:"cone",label:"Argo CD",x:12,y:7.5,w:2.5,d:2.5,h:2,z:0,color:"#f2a93b"},{id:"mesh",kind:"cylinder",label:"Istio",x:17,y:7.5,w:2.5,d:2.5,h:1.25,z:0,color:"#39c5cf"},fe("ecr","ECR",ve("AmazonElasticContainerRegistry"),12.25,14.5),fe("aurora","Aurora",ve("AmazonAurora"),27,0),fe("redis","Redis",ve("AmazonElastiCache"),27,5)],edges:[q("e1","users","dns",{routing:"straight",animation:"packets",animationDirection:"both"}),q("e2","dns","alb",{animation:"flow"}),q("e3","alb","storefront",{animation:"packets",label:"HTTPS"}),q("e4","storefront","cart",{color:"#4f8cf7",animation:"flow"}),q("e5","storefront","orders-svc",{color:"#dd344c",animation:"packets",label:"gRPC"}),q("e6","orders-svc","payments",{color:"#c925d1",animation:"pulse"}),q("e7","orders-svc","aurora",{color:"#3b48cc",label:"SQL"}),q("e8","cart","redis",{color:"#dd344c",routing:"curved"}),q("e9","argocd","ecr",{lineStyle:"dashed",color:"#94a3b8",label:"pull images"})]},Au=[{id:"three-tier",name:"Three-tier web app",diagram:hh},{id:"serverless",name:"Serverless order API",diagram:js(iy,ny,{ordersInternals:sy})},{id:"streaming",name:"Streaming IoT pipeline",diagram:js(ay,ty)},{id:"kubernetes",name:"Kubernetes microservices",diagram:js(ly,ey)}],zu="isodraw-demo:diagram",Lu="isodraw-demo:icons";function Iu(e,n){try{const t=localStorage.getItem(e);return t?JSON.parse(t):n}catch{return n}}function cy(){const[e,n]=I.useState(()=>Iu(zu,hh)),[t,r]=I.useState(()=>Iu(Lu,[])),[o,s]=I.useState(0),[i,a]=I.useState(()=>window.location.hash.startsWith("#/")?"published":"edit");I.useEffect(()=>{try{localStorage.setItem(zu,JSON.stringify(e))}catch{}},[e]),I.useEffect(()=>{try{localStorage.setItem(Lu,JSON.stringify(t))}catch{}},[t]);const l=d=>{n(d),s(h=>h+1)};return c.jsxs("div",{className:"demo",children:[c.jsxs("header",{className:"demo-header",children:[c.jsxs("div",{className:"demo-brand",children:[c.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24","aria-hidden":!0,children:[c.jsx("path",{d:"M12 2 3 7l9 5 9-5-9-5Z",fill:"#60a5fa"}),c.jsx("path",{d:"M3 7v10l9 5V12L3 7Z",fill:"#2563eb"}),c.jsx("path",{d:"M21 7v10l-9 5V12l9-5Z",fill:"#1d4ed8"})]}),c.jsx("strong",{children:"IsoDraw"}),c.jsx("span",{children:"Cloudcraft-style diagrams for React"})]}),c.jsxs("div",{className:"demo-actions",children:[c.jsx("div",{className:"demo-modes",role:"radiogroup","aria-label":"Mode",children:[["edit","Edit","Draw and document"],["view","View","Browse the diagram and its docs without editing"],["published","Published","Docs-site view: a page per component"]].map(([d,h,f])=>c.jsx("button",{type:"button",role:"radio","aria-checked":i===d,className:i===d?"is-on":"",title:f,onClick:()=>{a(d),d!=="published"&&window.location.hash&&history.replaceState(null,"",window.location.pathname)},children:h},d))}),c.jsxs("label",{className:"demo-select",title:"Load an example diagram (replaces the current one)",children:[c.jsx("span",{children:"Examples"}),c.jsxs("select",{value:"","aria-label":"Load an example diagram",onChange:d=>{const h=Au.find(f=>f.id===d.target.value);h&&l(h.diagram)},children:[c.jsx("option",{value:"",disabled:!0,children:"Load example…"}),Au.map(d=>c.jsx("option",{value:d.id,children:d.name},d.id))]})]}),c.jsx("button",{type:"button",onClick:()=>l(Ha()),children:"New blank"})]})]}),c.jsx("main",{className:"demo-main",children:i==="published"?c.jsx(Jg,{diagram:e,useHash:!0}):c.jsx(Gg,{value:e,onChange:n,userIcons:t,onUserIconsChange:r,readOnly:i==="view"},o)})]})}Yf(document.getElementById("root")).render(c.jsx(I.StrictMode,{children:c.jsx(cy,{})}));export{Ye as I,Pr as K,Ka as M,uy as R,vy as S,yy as a,rh as b,xt as c,Qf as d,Ql as e,dy as f,_u as g,Sn as h,ct as i,c as j,my as k,nh as l,gy as m,_o as n,py as o,Gl as p,Nr as q,I as r,th as s,fy as t,hy as u,Ha as v,cg as w,ag as x,Gg as y};
