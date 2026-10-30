const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PublishedView-BaDfty2C.js","./DocsPanel-BUKv8SoO.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();function Zu(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Gu={exports:{}},ii={},Qu={exports:{}},q={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wo=Symbol.for("react.element"),Dh=Symbol.for("react.portal"),_h=Symbol.for("react.fragment"),Rh=Symbol.for("react.strict_mode"),Oh=Symbol.for("react.profiler"),$h=Symbol.for("react.provider"),Fh=Symbol.for("react.context"),Bh=Symbol.for("react.forward_ref"),Wh=Symbol.for("react.suspense"),Vh=Symbol.for("react.memo"),Hh=Symbol.for("react.lazy"),xc=Symbol.iterator;function Uh(e){return e===null||typeof e!="object"?null:(e=xc&&e[xc]||e["@@iterator"],typeof e=="function"?e:null)}var Yu={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Xu=Object.assign,qu={};function Vr(e,t,n){this.props=e,this.context=t,this.refs=qu,this.updater=n||Yu}Vr.prototype.isReactComponent={};Vr.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Vr.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Ju(){}Ju.prototype=Vr.prototype;function il(e,t,n){this.props=e,this.context=t,this.refs=qu,this.updater=n||Yu}var al=il.prototype=new Ju;al.constructor=il;Xu(al,Vr.prototype);al.isPureReactComponent=!0;var kc=Array.isArray,ed=Object.prototype.hasOwnProperty,ll={current:null},td={key:!0,ref:!0,__self:!0,__source:!0};function nd(e,t,n){var r,o={},s=null,i=null;if(t!=null)for(r in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(s=""+t.key),t)ed.call(t,r)&&!td.hasOwnProperty(r)&&(o[r]=t[r]);var l=arguments.length-2;if(l===1)o.children=n;else if(1<l){for(var a=Array(l),d=0;d<l;d++)a[d]=arguments[d+2];o.children=a}if(e&&e.defaultProps)for(r in l=e.defaultProps,l)o[r]===void 0&&(o[r]=l[r]);return{$$typeof:Wo,type:e,key:s,ref:i,props:o,_owner:ll.current}}function Kh(e,t){return{$$typeof:Wo,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function cl(e){return typeof e=="object"&&e!==null&&e.$$typeof===Wo}function Zh(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Sc=/\/+/g;function ji(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Zh(""+e.key):t.toString(36)}function vs(e,t,n,r,o){var s=typeof e;(s==="undefined"||s==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(s){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case Wo:case Dh:i=!0}}if(i)return i=e,o=o(i),e=r===""?"."+ji(i,0):r,kc(o)?(n="",e!=null&&(n=e.replace(Sc,"$&/")+"/"),vs(o,t,n,"",function(d){return d})):o!=null&&(cl(o)&&(o=Kh(o,n+(!o.key||i&&i.key===o.key?"":(""+o.key).replace(Sc,"$&/")+"/")+e)),t.push(o)),1;if(i=0,r=r===""?".":r+":",kc(e))for(var l=0;l<e.length;l++){s=e[l];var a=r+ji(s,l);i+=vs(s,t,n,a,o)}else if(a=Uh(e),typeof a=="function")for(e=a.call(e),l=0;!(s=e.next()).done;)s=s.value,a=r+ji(s,l++),i+=vs(s,t,n,a,o);else if(s==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function Jo(e,t,n){if(e==null)return e;var r=[],o=0;return vs(e,r,"","",function(s){return t.call(n,s,o++)}),r}function Gh(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var tt={current:null},ws={transition:null},Qh={ReactCurrentDispatcher:tt,ReactCurrentBatchConfig:ws,ReactCurrentOwner:ll};function rd(){throw Error("act(...) is not supported in production builds of React.")}q.Children={map:Jo,forEach:function(e,t,n){Jo(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Jo(e,function(){t++}),t},toArray:function(e){return Jo(e,function(t){return t})||[]},only:function(e){if(!cl(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};q.Component=Vr;q.Fragment=_h;q.Profiler=Oh;q.PureComponent=il;q.StrictMode=Rh;q.Suspense=Wh;q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Qh;q.act=rd;q.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=Xu({},e.props),o=e.key,s=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(s=t.ref,i=ll.current),t.key!==void 0&&(o=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(a in t)ed.call(t,a)&&!td.hasOwnProperty(a)&&(r[a]=t[a]===void 0&&l!==void 0?l[a]:t[a])}var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){l=Array(a);for(var d=0;d<a;d++)l[d]=arguments[d+2];r.children=l}return{$$typeof:Wo,type:e.type,key:o,ref:s,props:r,_owner:i}};q.createContext=function(e){return e={$$typeof:Fh,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:$h,_context:e},e.Consumer=e};q.createElement=nd;q.createFactory=function(e){var t=nd.bind(null,e);return t.type=e,t};q.createRef=function(){return{current:null}};q.forwardRef=function(e){return{$$typeof:Bh,render:e}};q.isValidElement=cl;q.lazy=function(e){return{$$typeof:Hh,_payload:{_status:-1,_result:e},_init:Gh}};q.memo=function(e,t){return{$$typeof:Vh,type:e,compare:t===void 0?null:t}};q.startTransition=function(e){var t=ws.transition;ws.transition={};try{e()}finally{ws.transition=t}};q.unstable_act=rd;q.useCallback=function(e,t){return tt.current.useCallback(e,t)};q.useContext=function(e){return tt.current.useContext(e)};q.useDebugValue=function(){};q.useDeferredValue=function(e){return tt.current.useDeferredValue(e)};q.useEffect=function(e,t){return tt.current.useEffect(e,t)};q.useId=function(){return tt.current.useId()};q.useImperativeHandle=function(e,t,n){return tt.current.useImperativeHandle(e,t,n)};q.useInsertionEffect=function(e,t){return tt.current.useInsertionEffect(e,t)};q.useLayoutEffect=function(e,t){return tt.current.useLayoutEffect(e,t)};q.useMemo=function(e,t){return tt.current.useMemo(e,t)};q.useReducer=function(e,t,n){return tt.current.useReducer(e,t,n)};q.useRef=function(e){return tt.current.useRef(e)};q.useState=function(e){return tt.current.useState(e)};q.useSyncExternalStore=function(e,t,n){return tt.current.useSyncExternalStore(e,t,n)};q.useTransition=function(){return tt.current.useTransition()};q.version="18.3.1";Qu.exports=q;var P=Qu.exports;const Ry=Zu(P);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yh=P,Xh=Symbol.for("react.element"),qh=Symbol.for("react.fragment"),Jh=Object.prototype.hasOwnProperty,ep=Yh.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,tp={key:!0,ref:!0,__self:!0,__source:!0};function od(e,t,n){var r,o={},s=null,i=null;n!==void 0&&(s=""+n),t.key!==void 0&&(s=""+t.key),t.ref!==void 0&&(i=t.ref);for(r in t)Jh.call(t,r)&&!tp.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)o[r]===void 0&&(o[r]=t[r]);return{$$typeof:Xh,type:e,key:s,ref:i,props:o,_owner:ep.current}}ii.Fragment=qh;ii.jsx=od;ii.jsxs=od;Gu.exports=ii;var c=Gu.exports,sd={exports:{}},yt={},id={exports:{}},ad={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(D,V){var K=D.length;D.push(V);e:for(;0<K;){var ie=K-1>>>1,re=D[ie];if(0<o(re,V))D[ie]=V,D[K]=re,K=ie;else break e}}function n(D){return D.length===0?null:D[0]}function r(D){if(D.length===0)return null;var V=D[0],K=D.pop();if(K!==V){D[0]=K;e:for(var ie=0,re=D.length,un=re>>>1;ie<un;){var ze=2*(ie+1)-1,dn=D[ze],wt=ze+1,Se=D[wt];if(0>o(dn,K))wt<re&&0>o(Se,dn)?(D[ie]=Se,D[wt]=K,ie=wt):(D[ie]=dn,D[ze]=K,ie=ze);else if(wt<re&&0>o(Se,K))D[ie]=Se,D[wt]=K,ie=wt;else break e}}return V}function o(D,V){var K=D.sortIndex-V.sortIndex;return K!==0?K:D.id-V.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;e.unstable_now=function(){return s.now()}}else{var i=Date,l=i.now();e.unstable_now=function(){return i.now()-l}}var a=[],d=[],h=1,m=null,p=3,k=!1,g=!1,x=!1,A=typeof setTimeout=="function"?setTimeout:null,y=typeof clearTimeout=="function"?clearTimeout:null,u=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function v(D){for(var V=n(d);V!==null;){if(V.callback===null)r(d);else if(V.startTime<=D)r(d),V.sortIndex=V.expirationTime,t(a,V);else break;V=n(d)}}function j(D){if(x=!1,v(D),!g)if(n(a)!==null)g=!0,Ve(z);else{var V=n(d);V!==null&&dt(j,V.startTime-D)}}function z(D,V){g=!1,x&&(x=!1,y(F),F=-1),k=!0;var K=p;try{for(v(V),m=n(a);m!==null&&(!(m.expirationTime>V)||D&&!Qe());){var ie=m.callback;if(typeof ie=="function"){m.callback=null,p=m.priorityLevel;var re=ie(m.expirationTime<=V);V=e.unstable_now(),typeof re=="function"?m.callback=re:m===n(a)&&r(a),v(V)}else r(a);m=n(a)}if(m!==null)var un=!0;else{var ze=n(d);ze!==null&&dt(j,ze.startTime-V),un=!1}return un}finally{m=null,p=K,k=!1}}var R=!1,L=null,F=-1,ce=5,U=-1;function Qe(){return!(e.unstable_now()-U<ce)}function ut(){if(L!==null){var D=e.unstable_now();U=D;var V=!0;try{V=L(!0,D)}finally{V?be():(R=!1,L=null)}}else R=!1}var be;if(typeof u=="function")be=function(){u(ut)};else if(typeof MessageChannel<"u"){var Qt=new MessageChannel,ue=Qt.port2;Qt.port1.onmessage=ut,be=function(){ue.postMessage(null)}}else be=function(){A(ut,0)};function Ve(D){L=D,R||(R=!0,be())}function dt(D,V){F=A(function(){D(e.unstable_now())},V)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(D){D.callback=null},e.unstable_continueExecution=function(){g||k||(g=!0,Ve(z))},e.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ce=0<D?Math.floor(1e3/D):5},e.unstable_getCurrentPriorityLevel=function(){return p},e.unstable_getFirstCallbackNode=function(){return n(a)},e.unstable_next=function(D){switch(p){case 1:case 2:case 3:var V=3;break;default:V=p}var K=p;p=V;try{return D()}finally{p=K}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(D,V){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var K=p;p=D;try{return V()}finally{p=K}},e.unstable_scheduleCallback=function(D,V,K){var ie=e.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?ie+K:ie):K=ie,D){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=K+re,D={id:h++,callback:V,priorityLevel:D,startTime:K,expirationTime:re,sortIndex:-1},K>ie?(D.sortIndex=K,t(d,D),n(a)===null&&D===n(d)&&(x?(y(F),F=-1):x=!0,dt(j,K-ie))):(D.sortIndex=re,t(a,D),g||k||(g=!0,Ve(z))),D},e.unstable_shouldYield=Qe,e.unstable_wrapCallback=function(D){var V=p;return function(){var K=p;p=V;try{return D.apply(this,arguments)}finally{p=K}}}})(ad);id.exports=ad;var np=id.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rp=P,gt=np;function b(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var ld=new Set,ko={};function or(e,t){_r(e,t),_r(e+"Capture",t)}function _r(e,t){for(ko[e]=t,e=0;e<t.length;e++)ld.add(t[e])}var rn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ia=Object.prototype.hasOwnProperty,op=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Ec={},Cc={};function sp(e){return ia.call(Cc,e)?!0:ia.call(Ec,e)?!1:op.test(e)?Cc[e]=!0:(Ec[e]=!0,!1)}function ip(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ap(e,t,n,r){if(t===null||typeof t>"u"||ip(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function nt(e,t,n,r,o,s,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=s,this.removeEmptyString=i}var We={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){We[e]=new nt(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];We[t]=new nt(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){We[e]=new nt(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){We[e]=new nt(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){We[e]=new nt(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){We[e]=new nt(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){We[e]=new nt(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){We[e]=new nt(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){We[e]=new nt(e,5,!1,e.toLowerCase(),null,!1,!1)});var ul=/[\-:]([a-z])/g;function dl(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ul,dl);We[t]=new nt(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ul,dl);We[t]=new nt(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ul,dl);We[t]=new nt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){We[e]=new nt(e,1,!1,e.toLowerCase(),null,!1,!1)});We.xlinkHref=new nt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){We[e]=new nt(e,1,!1,e.toLowerCase(),null,!0,!0)});function fl(e,t,n,r){var o=We.hasOwnProperty(t)?We[t]:null;(o!==null?o.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ap(t,n,o,r)&&(n=null),r||o===null?sp(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=n===null?o.type===3?!1:"":n:(t=o.attributeName,r=o.attributeNamespace,n===null?e.removeAttribute(t):(o=o.type,n=o===3||o===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var cn=rp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,es=Symbol.for("react.element"),fr=Symbol.for("react.portal"),hr=Symbol.for("react.fragment"),hl=Symbol.for("react.strict_mode"),aa=Symbol.for("react.profiler"),cd=Symbol.for("react.provider"),ud=Symbol.for("react.context"),pl=Symbol.for("react.forward_ref"),la=Symbol.for("react.suspense"),ca=Symbol.for("react.suspense_list"),ml=Symbol.for("react.memo"),yn=Symbol.for("react.lazy"),dd=Symbol.for("react.offscreen"),jc=Symbol.iterator;function qr(e){return e===null||typeof e!="object"?null:(e=jc&&e[jc]||e["@@iterator"],typeof e=="function"?e:null)}var ke=Object.assign,Ti;function ao(e){if(Ti===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ti=t&&t[1]||""}return`
`+Ti+e}var Mi=!1;function bi(e,t){if(!e||Mi)return"";Mi=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var r=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){r=d}e.call(t.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var o=d.stack.split(`
`),s=r.stack.split(`
`),i=o.length-1,l=s.length-1;1<=i&&0<=l&&o[i]!==s[l];)l--;for(;1<=i&&0<=l;i--,l--)if(o[i]!==s[l]){if(i!==1||l!==1)do if(i--,l--,0>l||o[i]!==s[l]){var a=`
`+o[i].replace(" at new "," at ");return e.displayName&&a.includes("<anonymous>")&&(a=a.replace("<anonymous>",e.displayName)),a}while(1<=i&&0<=l);break}}}finally{Mi=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?ao(e):""}function lp(e){switch(e.tag){case 5:return ao(e.type);case 16:return ao("Lazy");case 13:return ao("Suspense");case 19:return ao("SuspenseList");case 0:case 2:case 15:return e=bi(e.type,!1),e;case 11:return e=bi(e.type.render,!1),e;case 1:return e=bi(e.type,!0),e;default:return""}}function ua(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case hr:return"Fragment";case fr:return"Portal";case aa:return"Profiler";case hl:return"StrictMode";case la:return"Suspense";case ca:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case ud:return(e.displayName||"Context")+".Consumer";case cd:return(e._context.displayName||"Context")+".Provider";case pl:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ml:return t=e.displayName||null,t!==null?t:ua(e.type)||"Memo";case yn:t=e._payload,e=e._init;try{return ua(e(t))}catch{}}return null}function cp(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ua(t);case 8:return t===hl?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Ln(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function fd(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function up(e){var t=fd(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var o=n.get,s=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return o.call(this)},set:function(i){r=""+i,s.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ts(e){e._valueTracker||(e._valueTracker=up(e))}function hd(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=fd(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function zs(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function da(e,t){var n=t.checked;return ke({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Tc(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=Ln(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function pd(e,t){t=t.checked,t!=null&&fl(e,"checked",t,!1)}function fa(e,t){pd(e,t);var n=Ln(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?ha(e,t.type,n):t.hasOwnProperty("defaultValue")&&ha(e,t.type,Ln(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Mc(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function ha(e,t,n){(t!=="number"||zs(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var lo=Array.isArray;function br(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Ln(n),t=null,o=0;o<e.length;o++){if(e[o].value===n){e[o].selected=!0,r&&(e[o].defaultSelected=!0);return}t!==null||e[o].disabled||(t=e[o])}t!==null&&(t.selected=!0)}}function pa(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(b(91));return ke({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function bc(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(b(92));if(lo(n)){if(1<n.length)throw Error(b(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:Ln(n)}}function md(e,t){var n=Ln(t.value),r=Ln(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Nc(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function gd(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ma(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?gd(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var ns,yd=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,o)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(ns=ns||document.createElement("div"),ns.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=ns.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function So(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var fo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},dp=["Webkit","ms","Moz","O"];Object.keys(fo).forEach(function(e){dp.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),fo[t]=fo[e]})});function vd(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||fo.hasOwnProperty(e)&&fo[e]?(""+t).trim():t+"px"}function wd(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,o=vd(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}var fp=ke({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ga(e,t){if(t){if(fp[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(b(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(b(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(b(61))}if(t.style!=null&&typeof t.style!="object")throw Error(b(62))}}function ya(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var va=null;function gl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var wa=null,Nr=null,Pr=null;function Pc(e){if(e=Uo(e)){if(typeof wa!="function")throw Error(b(280));var t=e.stateNode;t&&(t=di(t),wa(e.stateNode,e.type,t))}}function xd(e){Nr?Pr?Pr.push(e):Pr=[e]:Nr=e}function kd(){if(Nr){var e=Nr,t=Pr;if(Pr=Nr=null,Pc(e),t)for(e=0;e<t.length;e++)Pc(t[e])}}function Sd(e,t){return e(t)}function Ed(){}var Ni=!1;function Cd(e,t,n){if(Ni)return e(t,n);Ni=!0;try{return Sd(e,t,n)}finally{Ni=!1,(Nr!==null||Pr!==null)&&(Ed(),kd())}}function Eo(e,t){var n=e.stateNode;if(n===null)return null;var r=di(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(b(231,t,typeof n));return n}var xa=!1;if(rn)try{var Jr={};Object.defineProperty(Jr,"passive",{get:function(){xa=!0}}),window.addEventListener("test",Jr,Jr),window.removeEventListener("test",Jr,Jr)}catch{xa=!1}function hp(e,t,n,r,o,s,i,l,a){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(h){this.onError(h)}}var ho=!1,Ls=null,Is=!1,ka=null,pp={onError:function(e){ho=!0,Ls=e}};function mp(e,t,n,r,o,s,i,l,a){ho=!1,Ls=null,hp.apply(pp,arguments)}function gp(e,t,n,r,o,s,i,l,a){if(mp.apply(this,arguments),ho){if(ho){var d=Ls;ho=!1,Ls=null}else throw Error(b(198));Is||(Is=!0,ka=d)}}function sr(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function jd(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ac(e){if(sr(e)!==e)throw Error(b(188))}function yp(e){var t=e.alternate;if(!t){if(t=sr(e),t===null)throw Error(b(188));return t!==e?null:e}for(var n=e,r=t;;){var o=n.return;if(o===null)break;var s=o.alternate;if(s===null){if(r=o.return,r!==null){n=r;continue}break}if(o.child===s.child){for(s=o.child;s;){if(s===n)return Ac(o),e;if(s===r)return Ac(o),t;s=s.sibling}throw Error(b(188))}if(n.return!==r.return)n=o,r=s;else{for(var i=!1,l=o.child;l;){if(l===n){i=!0,n=o,r=s;break}if(l===r){i=!0,r=o,n=s;break}l=l.sibling}if(!i){for(l=s.child;l;){if(l===n){i=!0,n=s,r=o;break}if(l===r){i=!0,r=s,n=o;break}l=l.sibling}if(!i)throw Error(b(189))}}if(n.alternate!==r)throw Error(b(190))}if(n.tag!==3)throw Error(b(188));return n.stateNode.current===n?e:t}function Td(e){return e=yp(e),e!==null?Md(e):null}function Md(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Md(e);if(t!==null)return t;e=e.sibling}return null}var bd=gt.unstable_scheduleCallback,zc=gt.unstable_cancelCallback,vp=gt.unstable_shouldYield,wp=gt.unstable_requestPaint,Te=gt.unstable_now,xp=gt.unstable_getCurrentPriorityLevel,yl=gt.unstable_ImmediatePriority,Nd=gt.unstable_UserBlockingPriority,Ds=gt.unstable_NormalPriority,kp=gt.unstable_LowPriority,Pd=gt.unstable_IdlePriority,ai=null,Zt=null;function Sp(e){if(Zt&&typeof Zt.onCommitFiberRoot=="function")try{Zt.onCommitFiberRoot(ai,e,void 0,(e.current.flags&128)===128)}catch{}}var $t=Math.clz32?Math.clz32:jp,Ep=Math.log,Cp=Math.LN2;function jp(e){return e>>>=0,e===0?32:31-(Ep(e)/Cp|0)|0}var rs=64,os=4194304;function co(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function _s(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,o=e.suspendedLanes,s=e.pingedLanes,i=n&268435455;if(i!==0){var l=i&~o;l!==0?r=co(l):(s&=i,s!==0&&(r=co(s)))}else i=n&~o,i!==0?r=co(i):s!==0&&(r=co(s));if(r===0)return 0;if(t!==0&&t!==r&&!(t&o)&&(o=r&-r,s=t&-t,o>=s||o===16&&(s&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-$t(t),o=1<<n,r|=e[n],t&=~o;return r}function Tp(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Mp(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,o=e.expirationTimes,s=e.pendingLanes;0<s;){var i=31-$t(s),l=1<<i,a=o[i];a===-1?(!(l&n)||l&r)&&(o[i]=Tp(l,t)):a<=t&&(e.expiredLanes|=l),s&=~l}}function Sa(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Ad(){var e=rs;return rs<<=1,!(rs&4194240)&&(rs=64),e}function Pi(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Vo(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-$t(t),e[t]=n}function bp(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var o=31-$t(n),s=1<<o;t[o]=0,r[o]=-1,e[o]=-1,n&=~s}}function vl(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-$t(n),o=1<<r;o&t|e[r]&t&&(e[r]|=t),n&=~o}}var se=0;function zd(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Ld,wl,Id,Dd,_d,Ea=!1,ss=[],jn=null,Tn=null,Mn=null,Co=new Map,jo=new Map,wn=[],Np="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Lc(e,t){switch(e){case"focusin":case"focusout":jn=null;break;case"dragenter":case"dragleave":Tn=null;break;case"mouseover":case"mouseout":Mn=null;break;case"pointerover":case"pointerout":Co.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":jo.delete(t.pointerId)}}function eo(e,t,n,r,o,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:s,targetContainers:[o]},t!==null&&(t=Uo(t),t!==null&&wl(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,o!==null&&t.indexOf(o)===-1&&t.push(o),e)}function Pp(e,t,n,r,o){switch(t){case"focusin":return jn=eo(jn,e,t,n,r,o),!0;case"dragenter":return Tn=eo(Tn,e,t,n,r,o),!0;case"mouseover":return Mn=eo(Mn,e,t,n,r,o),!0;case"pointerover":var s=o.pointerId;return Co.set(s,eo(Co.get(s)||null,e,t,n,r,o)),!0;case"gotpointercapture":return s=o.pointerId,jo.set(s,eo(jo.get(s)||null,e,t,n,r,o)),!0}return!1}function Rd(e){var t=Un(e.target);if(t!==null){var n=sr(t);if(n!==null){if(t=n.tag,t===13){if(t=jd(n),t!==null){e.blockedOn=t,_d(e.priority,function(){Id(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function xs(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Ca(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);va=r,n.target.dispatchEvent(r),va=null}else return t=Uo(n),t!==null&&wl(t),e.blockedOn=n,!1;t.shift()}return!0}function Ic(e,t,n){xs(e)&&n.delete(t)}function Ap(){Ea=!1,jn!==null&&xs(jn)&&(jn=null),Tn!==null&&xs(Tn)&&(Tn=null),Mn!==null&&xs(Mn)&&(Mn=null),Co.forEach(Ic),jo.forEach(Ic)}function to(e,t){e.blockedOn===t&&(e.blockedOn=null,Ea||(Ea=!0,gt.unstable_scheduleCallback(gt.unstable_NormalPriority,Ap)))}function To(e){function t(o){return to(o,e)}if(0<ss.length){to(ss[0],e);for(var n=1;n<ss.length;n++){var r=ss[n];r.blockedOn===e&&(r.blockedOn=null)}}for(jn!==null&&to(jn,e),Tn!==null&&to(Tn,e),Mn!==null&&to(Mn,e),Co.forEach(t),jo.forEach(t),n=0;n<wn.length;n++)r=wn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<wn.length&&(n=wn[0],n.blockedOn===null);)Rd(n),n.blockedOn===null&&wn.shift()}var Ar=cn.ReactCurrentBatchConfig,Rs=!0;function zp(e,t,n,r){var o=se,s=Ar.transition;Ar.transition=null;try{se=1,xl(e,t,n,r)}finally{se=o,Ar.transition=s}}function Lp(e,t,n,r){var o=se,s=Ar.transition;Ar.transition=null;try{se=4,xl(e,t,n,r)}finally{se=o,Ar.transition=s}}function xl(e,t,n,r){if(Rs){var o=Ca(e,t,n,r);if(o===null)Fi(e,t,r,Os,n),Lc(e,r);else if(Pp(o,e,t,n,r))r.stopPropagation();else if(Lc(e,r),t&4&&-1<Np.indexOf(e)){for(;o!==null;){var s=Uo(o);if(s!==null&&Ld(s),s=Ca(e,t,n,r),s===null&&Fi(e,t,r,Os,n),s===o)break;o=s}o!==null&&r.stopPropagation()}else Fi(e,t,r,null,n)}}var Os=null;function Ca(e,t,n,r){if(Os=null,e=gl(r),e=Un(e),e!==null)if(t=sr(e),t===null)e=null;else if(n=t.tag,n===13){if(e=jd(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Os=e,null}function Od(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(xp()){case yl:return 1;case Nd:return 4;case Ds:case kp:return 16;case Pd:return 536870912;default:return 16}default:return 16}}var kn=null,kl=null,ks=null;function $d(){if(ks)return ks;var e,t=kl,n=t.length,r,o="value"in kn?kn.value:kn.textContent,s=o.length;for(e=0;e<n&&t[e]===o[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===o[s-r];r++);return ks=o.slice(e,1<r?1-r:void 0)}function Ss(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function is(){return!0}function Dc(){return!1}function vt(e){function t(n,r,o,s,i){this._reactName=n,this._targetInst=o,this.type=r,this.nativeEvent=s,this.target=i,this.currentTarget=null;for(var l in e)e.hasOwnProperty(l)&&(n=e[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?is:Dc,this.isPropagationStopped=Dc,this}return ke(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=is)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=is)},persist:function(){},isPersistent:is}),t}var Hr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Sl=vt(Hr),Ho=ke({},Hr,{view:0,detail:0}),Ip=vt(Ho),Ai,zi,no,li=ke({},Ho,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:El,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==no&&(no&&e.type==="mousemove"?(Ai=e.screenX-no.screenX,zi=e.screenY-no.screenY):zi=Ai=0,no=e),Ai)},movementY:function(e){return"movementY"in e?e.movementY:zi}}),_c=vt(li),Dp=ke({},li,{dataTransfer:0}),_p=vt(Dp),Rp=ke({},Ho,{relatedTarget:0}),Li=vt(Rp),Op=ke({},Hr,{animationName:0,elapsedTime:0,pseudoElement:0}),$p=vt(Op),Fp=ke({},Hr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Bp=vt(Fp),Wp=ke({},Hr,{data:0}),Rc=vt(Wp),Vp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Hp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Up={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Kp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Up[e])?!!t[e]:!1}function El(){return Kp}var Zp=ke({},Ho,{key:function(e){if(e.key){var t=Vp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ss(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Hp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:El,charCode:function(e){return e.type==="keypress"?Ss(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ss(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Gp=vt(Zp),Qp=ke({},li,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Oc=vt(Qp),Yp=ke({},Ho,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:El}),Xp=vt(Yp),qp=ke({},Hr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Jp=vt(qp),em=ke({},li,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),tm=vt(em),nm=[9,13,27,32],Cl=rn&&"CompositionEvent"in window,po=null;rn&&"documentMode"in document&&(po=document.documentMode);var rm=rn&&"TextEvent"in window&&!po,Fd=rn&&(!Cl||po&&8<po&&11>=po),$c=" ",Fc=!1;function Bd(e,t){switch(e){case"keyup":return nm.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Wd(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var pr=!1;function om(e,t){switch(e){case"compositionend":return Wd(t);case"keypress":return t.which!==32?null:(Fc=!0,$c);case"textInput":return e=t.data,e===$c&&Fc?null:e;default:return null}}function sm(e,t){if(pr)return e==="compositionend"||!Cl&&Bd(e,t)?(e=$d(),ks=kl=kn=null,pr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Fd&&t.locale!=="ko"?null:t.data;default:return null}}var im={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Bc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!im[e.type]:t==="textarea"}function Vd(e,t,n,r){xd(r),t=$s(t,"onChange"),0<t.length&&(n=new Sl("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var mo=null,Mo=null;function am(e){ef(e,0)}function ci(e){var t=yr(e);if(hd(t))return e}function lm(e,t){if(e==="change")return t}var Hd=!1;if(rn){var Ii;if(rn){var Di="oninput"in document;if(!Di){var Wc=document.createElement("div");Wc.setAttribute("oninput","return;"),Di=typeof Wc.oninput=="function"}Ii=Di}else Ii=!1;Hd=Ii&&(!document.documentMode||9<document.documentMode)}function Vc(){mo&&(mo.detachEvent("onpropertychange",Ud),Mo=mo=null)}function Ud(e){if(e.propertyName==="value"&&ci(Mo)){var t=[];Vd(t,Mo,e,gl(e)),Cd(am,t)}}function cm(e,t,n){e==="focusin"?(Vc(),mo=t,Mo=n,mo.attachEvent("onpropertychange",Ud)):e==="focusout"&&Vc()}function um(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ci(Mo)}function dm(e,t){if(e==="click")return ci(t)}function fm(e,t){if(e==="input"||e==="change")return ci(t)}function hm(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Wt=typeof Object.is=="function"?Object.is:hm;function bo(e,t){if(Wt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var o=n[r];if(!ia.call(t,o)||!Wt(e[o],t[o]))return!1}return!0}function Hc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Uc(e,t){var n=Hc(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Hc(n)}}function Kd(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Kd(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Zd(){for(var e=window,t=zs();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=zs(e.document)}return t}function jl(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function pm(e){var t=Zd(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Kd(n.ownerDocument.documentElement,n)){if(r!==null&&jl(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var o=n.textContent.length,s=Math.min(r.start,o);r=r.end===void 0?s:Math.min(r.end,o),!e.extend&&s>r&&(o=r,r=s,s=o),o=Uc(n,s);var i=Uc(n,r);o&&i&&(e.rangeCount!==1||e.anchorNode!==o.node||e.anchorOffset!==o.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(o.node,o.offset),e.removeAllRanges(),s>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var mm=rn&&"documentMode"in document&&11>=document.documentMode,mr=null,ja=null,go=null,Ta=!1;function Kc(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ta||mr==null||mr!==zs(r)||(r=mr,"selectionStart"in r&&jl(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),go&&bo(go,r)||(go=r,r=$s(ja,"onSelect"),0<r.length&&(t=new Sl("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=mr)))}function as(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var gr={animationend:as("Animation","AnimationEnd"),animationiteration:as("Animation","AnimationIteration"),animationstart:as("Animation","AnimationStart"),transitionend:as("Transition","TransitionEnd")},_i={},Gd={};rn&&(Gd=document.createElement("div").style,"AnimationEvent"in window||(delete gr.animationend.animation,delete gr.animationiteration.animation,delete gr.animationstart.animation),"TransitionEvent"in window||delete gr.transitionend.transition);function ui(e){if(_i[e])return _i[e];if(!gr[e])return e;var t=gr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Gd)return _i[e]=t[n];return e}var Qd=ui("animationend"),Yd=ui("animationiteration"),Xd=ui("animationstart"),qd=ui("transitionend"),Jd=new Map,Zc="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function _n(e,t){Jd.set(e,t),or(t,[e])}for(var Ri=0;Ri<Zc.length;Ri++){var Oi=Zc[Ri],gm=Oi.toLowerCase(),ym=Oi[0].toUpperCase()+Oi.slice(1);_n(gm,"on"+ym)}_n(Qd,"onAnimationEnd");_n(Yd,"onAnimationIteration");_n(Xd,"onAnimationStart");_n("dblclick","onDoubleClick");_n("focusin","onFocus");_n("focusout","onBlur");_n(qd,"onTransitionEnd");_r("onMouseEnter",["mouseout","mouseover"]);_r("onMouseLeave",["mouseout","mouseover"]);_r("onPointerEnter",["pointerout","pointerover"]);_r("onPointerLeave",["pointerout","pointerover"]);or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));or("onBeforeInput",["compositionend","keypress","textInput","paste"]);or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var uo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),vm=new Set("cancel close invalid load scroll toggle".split(" ").concat(uo));function Gc(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,gp(r,t,void 0,e),e.currentTarget=null}function ef(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],o=r.event;r=r.listeners;e:{var s=void 0;if(t)for(var i=r.length-1;0<=i;i--){var l=r[i],a=l.instance,d=l.currentTarget;if(l=l.listener,a!==s&&o.isPropagationStopped())break e;Gc(o,l,d),s=a}else for(i=0;i<r.length;i++){if(l=r[i],a=l.instance,d=l.currentTarget,l=l.listener,a!==s&&o.isPropagationStopped())break e;Gc(o,l,d),s=a}}}if(Is)throw e=ka,Is=!1,ka=null,e}function he(e,t){var n=t[Aa];n===void 0&&(n=t[Aa]=new Set);var r=e+"__bubble";n.has(r)||(tf(t,e,2,!1),n.add(r))}function $i(e,t,n){var r=0;t&&(r|=4),tf(n,e,r,t)}var ls="_reactListening"+Math.random().toString(36).slice(2);function No(e){if(!e[ls]){e[ls]=!0,ld.forEach(function(n){n!=="selectionchange"&&(vm.has(n)||$i(n,!1,e),$i(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[ls]||(t[ls]=!0,$i("selectionchange",!1,t))}}function tf(e,t,n,r){switch(Od(t)){case 1:var o=zp;break;case 4:o=Lp;break;default:o=xl}n=o.bind(null,t,n,e),o=void 0,!xa||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(o=!0),r?o!==void 0?e.addEventListener(t,n,{capture:!0,passive:o}):e.addEventListener(t,n,!0):o!==void 0?e.addEventListener(t,n,{passive:o}):e.addEventListener(t,n,!1)}function Fi(e,t,n,r,o){var s=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var l=r.stateNode.containerInfo;if(l===o||l.nodeType===8&&l.parentNode===o)break;if(i===4)for(i=r.return;i!==null;){var a=i.tag;if((a===3||a===4)&&(a=i.stateNode.containerInfo,a===o||a.nodeType===8&&a.parentNode===o))return;i=i.return}for(;l!==null;){if(i=Un(l),i===null)return;if(a=i.tag,a===5||a===6){r=s=i;continue e}l=l.parentNode}}r=r.return}Cd(function(){var d=s,h=gl(n),m=[];e:{var p=Jd.get(e);if(p!==void 0){var k=Sl,g=e;switch(e){case"keypress":if(Ss(n)===0)break e;case"keydown":case"keyup":k=Gp;break;case"focusin":g="focus",k=Li;break;case"focusout":g="blur",k=Li;break;case"beforeblur":case"afterblur":k=Li;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=_c;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=_p;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=Xp;break;case Qd:case Yd:case Xd:k=$p;break;case qd:k=Jp;break;case"scroll":k=Ip;break;case"wheel":k=tm;break;case"copy":case"cut":case"paste":k=Bp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=Oc}var x=(t&4)!==0,A=!x&&e==="scroll",y=x?p!==null?p+"Capture":null:p;x=[];for(var u=d,v;u!==null;){v=u;var j=v.stateNode;if(v.tag===5&&j!==null&&(v=j,y!==null&&(j=Eo(u,y),j!=null&&x.push(Po(u,j,v)))),A)break;u=u.return}0<x.length&&(p=new k(p,g,null,n,h),m.push({event:p,listeners:x}))}}if(!(t&7)){e:{if(p=e==="mouseover"||e==="pointerover",k=e==="mouseout"||e==="pointerout",p&&n!==va&&(g=n.relatedTarget||n.fromElement)&&(Un(g)||g[on]))break e;if((k||p)&&(p=h.window===h?h:(p=h.ownerDocument)?p.defaultView||p.parentWindow:window,k?(g=n.relatedTarget||n.toElement,k=d,g=g?Un(g):null,g!==null&&(A=sr(g),g!==A||g.tag!==5&&g.tag!==6)&&(g=null)):(k=null,g=d),k!==g)){if(x=_c,j="onMouseLeave",y="onMouseEnter",u="mouse",(e==="pointerout"||e==="pointerover")&&(x=Oc,j="onPointerLeave",y="onPointerEnter",u="pointer"),A=k==null?p:yr(k),v=g==null?p:yr(g),p=new x(j,u+"leave",k,n,h),p.target=A,p.relatedTarget=v,j=null,Un(h)===d&&(x=new x(y,u+"enter",g,n,h),x.target=v,x.relatedTarget=A,j=x),A=j,k&&g)t:{for(x=k,y=g,u=0,v=x;v;v=dr(v))u++;for(v=0,j=y;j;j=dr(j))v++;for(;0<u-v;)x=dr(x),u--;for(;0<v-u;)y=dr(y),v--;for(;u--;){if(x===y||y!==null&&x===y.alternate)break t;x=dr(x),y=dr(y)}x=null}else x=null;k!==null&&Qc(m,p,k,x,!1),g!==null&&A!==null&&Qc(m,A,g,x,!0)}}e:{if(p=d?yr(d):window,k=p.nodeName&&p.nodeName.toLowerCase(),k==="select"||k==="input"&&p.type==="file")var z=lm;else if(Bc(p))if(Hd)z=fm;else{z=um;var R=cm}else(k=p.nodeName)&&k.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(z=dm);if(z&&(z=z(e,d))){Vd(m,z,n,h);break e}R&&R(e,p,d),e==="focusout"&&(R=p._wrapperState)&&R.controlled&&p.type==="number"&&ha(p,"number",p.value)}switch(R=d?yr(d):window,e){case"focusin":(Bc(R)||R.contentEditable==="true")&&(mr=R,ja=d,go=null);break;case"focusout":go=ja=mr=null;break;case"mousedown":Ta=!0;break;case"contextmenu":case"mouseup":case"dragend":Ta=!1,Kc(m,n,h);break;case"selectionchange":if(mm)break;case"keydown":case"keyup":Kc(m,n,h)}var L;if(Cl)e:{switch(e){case"compositionstart":var F="onCompositionStart";break e;case"compositionend":F="onCompositionEnd";break e;case"compositionupdate":F="onCompositionUpdate";break e}F=void 0}else pr?Bd(e,n)&&(F="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(F="onCompositionStart");F&&(Fd&&n.locale!=="ko"&&(pr||F!=="onCompositionStart"?F==="onCompositionEnd"&&pr&&(L=$d()):(kn=h,kl="value"in kn?kn.value:kn.textContent,pr=!0)),R=$s(d,F),0<R.length&&(F=new Rc(F,e,null,n,h),m.push({event:F,listeners:R}),L?F.data=L:(L=Wd(n),L!==null&&(F.data=L)))),(L=rm?om(e,n):sm(e,n))&&(d=$s(d,"onBeforeInput"),0<d.length&&(h=new Rc("onBeforeInput","beforeinput",null,n,h),m.push({event:h,listeners:d}),h.data=L))}ef(m,t)})}function Po(e,t,n){return{instance:e,listener:t,currentTarget:n}}function $s(e,t){for(var n=t+"Capture",r=[];e!==null;){var o=e,s=o.stateNode;o.tag===5&&s!==null&&(o=s,s=Eo(e,n),s!=null&&r.unshift(Po(e,s,o)),s=Eo(e,t),s!=null&&r.push(Po(e,s,o))),e=e.return}return r}function dr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Qc(e,t,n,r,o){for(var s=t._reactName,i=[];n!==null&&n!==r;){var l=n,a=l.alternate,d=l.stateNode;if(a!==null&&a===r)break;l.tag===5&&d!==null&&(l=d,o?(a=Eo(n,s),a!=null&&i.unshift(Po(n,a,l))):o||(a=Eo(n,s),a!=null&&i.push(Po(n,a,l)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var wm=/\r\n?/g,xm=/\u0000|\uFFFD/g;function Yc(e){return(typeof e=="string"?e:""+e).replace(wm,`
`).replace(xm,"")}function cs(e,t,n){if(t=Yc(t),Yc(e)!==t&&n)throw Error(b(425))}function Fs(){}var Ma=null,ba=null;function Na(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Pa=typeof setTimeout=="function"?setTimeout:void 0,km=typeof clearTimeout=="function"?clearTimeout:void 0,Xc=typeof Promise=="function"?Promise:void 0,Sm=typeof queueMicrotask=="function"?queueMicrotask:typeof Xc<"u"?function(e){return Xc.resolve(null).then(e).catch(Em)}:Pa;function Em(e){setTimeout(function(){throw e})}function Bi(e,t){var n=t,r=0;do{var o=n.nextSibling;if(e.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"){if(r===0){e.removeChild(o),To(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=o}while(n);To(t)}function bn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function qc(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Ur=Math.random().toString(36).slice(2),Ut="__reactFiber$"+Ur,Ao="__reactProps$"+Ur,on="__reactContainer$"+Ur,Aa="__reactEvents$"+Ur,Cm="__reactListeners$"+Ur,jm="__reactHandles$"+Ur;function Un(e){var t=e[Ut];if(t)return t;for(var n=e.parentNode;n;){if(t=n[on]||n[Ut]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=qc(e);e!==null;){if(n=e[Ut])return n;e=qc(e)}return t}e=n,n=e.parentNode}return null}function Uo(e){return e=e[Ut]||e[on],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function yr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(b(33))}function di(e){return e[Ao]||null}var za=[],vr=-1;function Rn(e){return{current:e}}function pe(e){0>vr||(e.current=za[vr],za[vr]=null,vr--)}function fe(e,t){vr++,za[vr]=e.current,e.current=t}var In={},Ge=Rn(In),at=Rn(!1),qn=In;function Rr(e,t){var n=e.type.contextTypes;if(!n)return In;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var o={},s;for(s in n)o[s]=t[s];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=o),o}function lt(e){return e=e.childContextTypes,e!=null}function Bs(){pe(at),pe(Ge)}function Jc(e,t,n){if(Ge.current!==In)throw Error(b(168));fe(Ge,t),fe(at,n)}function nf(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var o in r)if(!(o in t))throw Error(b(108,cp(e)||"Unknown",o));return ke({},n,r)}function Ws(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||In,qn=Ge.current,fe(Ge,e),fe(at,at.current),!0}function eu(e,t,n){var r=e.stateNode;if(!r)throw Error(b(169));n?(e=nf(e,t,qn),r.__reactInternalMemoizedMergedChildContext=e,pe(at),pe(Ge),fe(Ge,e)):pe(at),fe(at,n)}var Jt=null,fi=!1,Wi=!1;function rf(e){Jt===null?Jt=[e]:Jt.push(e)}function Tm(e){fi=!0,rf(e)}function On(){if(!Wi&&Jt!==null){Wi=!0;var e=0,t=se;try{var n=Jt;for(se=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Jt=null,fi=!1}catch(o){throw Jt!==null&&(Jt=Jt.slice(e+1)),bd(yl,On),o}finally{se=t,Wi=!1}}return null}var wr=[],xr=0,Vs=null,Hs=0,St=[],Et=0,Jn=null,en=1,tn="";function Bn(e,t){wr[xr++]=Hs,wr[xr++]=Vs,Vs=e,Hs=t}function of(e,t,n){St[Et++]=en,St[Et++]=tn,St[Et++]=Jn,Jn=e;var r=en;e=tn;var o=32-$t(r)-1;r&=~(1<<o),n+=1;var s=32-$t(t)+o;if(30<s){var i=o-o%5;s=(r&(1<<i)-1).toString(32),r>>=i,o-=i,en=1<<32-$t(t)+o|n<<o|r,tn=s+e}else en=1<<s|n<<o|r,tn=e}function Tl(e){e.return!==null&&(Bn(e,1),of(e,1,0))}function Ml(e){for(;e===Vs;)Vs=wr[--xr],wr[xr]=null,Hs=wr[--xr],wr[xr]=null;for(;e===Jn;)Jn=St[--Et],St[Et]=null,tn=St[--Et],St[Et]=null,en=St[--Et],St[Et]=null}var mt=null,pt=null,ge=!1,Rt=null;function sf(e,t){var n=jt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function tu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,mt=e,pt=bn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,mt=e,pt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Jn!==null?{id:en,overflow:tn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=jt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,mt=e,pt=null,!0):!1;default:return!1}}function La(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ia(e){if(ge){var t=pt;if(t){var n=t;if(!tu(e,t)){if(La(e))throw Error(b(418));t=bn(n.nextSibling);var r=mt;t&&tu(e,t)?sf(r,n):(e.flags=e.flags&-4097|2,ge=!1,mt=e)}}else{if(La(e))throw Error(b(418));e.flags=e.flags&-4097|2,ge=!1,mt=e}}}function nu(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;mt=e}function us(e){if(e!==mt)return!1;if(!ge)return nu(e),ge=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Na(e.type,e.memoizedProps)),t&&(t=pt)){if(La(e))throw af(),Error(b(418));for(;t;)sf(e,t),t=bn(t.nextSibling)}if(nu(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(b(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){pt=bn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}pt=null}}else pt=mt?bn(e.stateNode.nextSibling):null;return!0}function af(){for(var e=pt;e;)e=bn(e.nextSibling)}function Or(){pt=mt=null,ge=!1}function bl(e){Rt===null?Rt=[e]:Rt.push(e)}var Mm=cn.ReactCurrentBatchConfig;function ro(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(b(309));var r=n.stateNode}if(!r)throw Error(b(147,e));var o=r,s=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===s?t.ref:(t=function(i){var l=o.refs;i===null?delete l[s]:l[s]=i},t._stringRef=s,t)}if(typeof e!="string")throw Error(b(284));if(!n._owner)throw Error(b(290,e))}return e}function ds(e,t){throw e=Object.prototype.toString.call(t),Error(b(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function ru(e){var t=e._init;return t(e._payload)}function lf(e){function t(y,u){if(e){var v=y.deletions;v===null?(y.deletions=[u],y.flags|=16):v.push(u)}}function n(y,u){if(!e)return null;for(;u!==null;)t(y,u),u=u.sibling;return null}function r(y,u){for(y=new Map;u!==null;)u.key!==null?y.set(u.key,u):y.set(u.index,u),u=u.sibling;return y}function o(y,u){return y=zn(y,u),y.index=0,y.sibling=null,y}function s(y,u,v){return y.index=v,e?(v=y.alternate,v!==null?(v=v.index,v<u?(y.flags|=2,u):v):(y.flags|=2,u)):(y.flags|=1048576,u)}function i(y){return e&&y.alternate===null&&(y.flags|=2),y}function l(y,u,v,j){return u===null||u.tag!==6?(u=Qi(v,y.mode,j),u.return=y,u):(u=o(u,v),u.return=y,u)}function a(y,u,v,j){var z=v.type;return z===hr?h(y,u,v.props.children,j,v.key):u!==null&&(u.elementType===z||typeof z=="object"&&z!==null&&z.$$typeof===yn&&ru(z)===u.type)?(j=o(u,v.props),j.ref=ro(y,u,v),j.return=y,j):(j=Ns(v.type,v.key,v.props,null,y.mode,j),j.ref=ro(y,u,v),j.return=y,j)}function d(y,u,v,j){return u===null||u.tag!==4||u.stateNode.containerInfo!==v.containerInfo||u.stateNode.implementation!==v.implementation?(u=Yi(v,y.mode,j),u.return=y,u):(u=o(u,v.children||[]),u.return=y,u)}function h(y,u,v,j,z){return u===null||u.tag!==7?(u=Xn(v,y.mode,j,z),u.return=y,u):(u=o(u,v),u.return=y,u)}function m(y,u,v){if(typeof u=="string"&&u!==""||typeof u=="number")return u=Qi(""+u,y.mode,v),u.return=y,u;if(typeof u=="object"&&u!==null){switch(u.$$typeof){case es:return v=Ns(u.type,u.key,u.props,null,y.mode,v),v.ref=ro(y,null,u),v.return=y,v;case fr:return u=Yi(u,y.mode,v),u.return=y,u;case yn:var j=u._init;return m(y,j(u._payload),v)}if(lo(u)||qr(u))return u=Xn(u,y.mode,v,null),u.return=y,u;ds(y,u)}return null}function p(y,u,v,j){var z=u!==null?u.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return z!==null?null:l(y,u,""+v,j);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case es:return v.key===z?a(y,u,v,j):null;case fr:return v.key===z?d(y,u,v,j):null;case yn:return z=v._init,p(y,u,z(v._payload),j)}if(lo(v)||qr(v))return z!==null?null:h(y,u,v,j,null);ds(y,v)}return null}function k(y,u,v,j,z){if(typeof j=="string"&&j!==""||typeof j=="number")return y=y.get(v)||null,l(u,y,""+j,z);if(typeof j=="object"&&j!==null){switch(j.$$typeof){case es:return y=y.get(j.key===null?v:j.key)||null,a(u,y,j,z);case fr:return y=y.get(j.key===null?v:j.key)||null,d(u,y,j,z);case yn:var R=j._init;return k(y,u,v,R(j._payload),z)}if(lo(j)||qr(j))return y=y.get(v)||null,h(u,y,j,z,null);ds(u,j)}return null}function g(y,u,v,j){for(var z=null,R=null,L=u,F=u=0,ce=null;L!==null&&F<v.length;F++){L.index>F?(ce=L,L=null):ce=L.sibling;var U=p(y,L,v[F],j);if(U===null){L===null&&(L=ce);break}e&&L&&U.alternate===null&&t(y,L),u=s(U,u,F),R===null?z=U:R.sibling=U,R=U,L=ce}if(F===v.length)return n(y,L),ge&&Bn(y,F),z;if(L===null){for(;F<v.length;F++)L=m(y,v[F],j),L!==null&&(u=s(L,u,F),R===null?z=L:R.sibling=L,R=L);return ge&&Bn(y,F),z}for(L=r(y,L);F<v.length;F++)ce=k(L,y,F,v[F],j),ce!==null&&(e&&ce.alternate!==null&&L.delete(ce.key===null?F:ce.key),u=s(ce,u,F),R===null?z=ce:R.sibling=ce,R=ce);return e&&L.forEach(function(Qe){return t(y,Qe)}),ge&&Bn(y,F),z}function x(y,u,v,j){var z=qr(v);if(typeof z!="function")throw Error(b(150));if(v=z.call(v),v==null)throw Error(b(151));for(var R=z=null,L=u,F=u=0,ce=null,U=v.next();L!==null&&!U.done;F++,U=v.next()){L.index>F?(ce=L,L=null):ce=L.sibling;var Qe=p(y,L,U.value,j);if(Qe===null){L===null&&(L=ce);break}e&&L&&Qe.alternate===null&&t(y,L),u=s(Qe,u,F),R===null?z=Qe:R.sibling=Qe,R=Qe,L=ce}if(U.done)return n(y,L),ge&&Bn(y,F),z;if(L===null){for(;!U.done;F++,U=v.next())U=m(y,U.value,j),U!==null&&(u=s(U,u,F),R===null?z=U:R.sibling=U,R=U);return ge&&Bn(y,F),z}for(L=r(y,L);!U.done;F++,U=v.next())U=k(L,y,F,U.value,j),U!==null&&(e&&U.alternate!==null&&L.delete(U.key===null?F:U.key),u=s(U,u,F),R===null?z=U:R.sibling=U,R=U);return e&&L.forEach(function(ut){return t(y,ut)}),ge&&Bn(y,F),z}function A(y,u,v,j){if(typeof v=="object"&&v!==null&&v.type===hr&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case es:e:{for(var z=v.key,R=u;R!==null;){if(R.key===z){if(z=v.type,z===hr){if(R.tag===7){n(y,R.sibling),u=o(R,v.props.children),u.return=y,y=u;break e}}else if(R.elementType===z||typeof z=="object"&&z!==null&&z.$$typeof===yn&&ru(z)===R.type){n(y,R.sibling),u=o(R,v.props),u.ref=ro(y,R,v),u.return=y,y=u;break e}n(y,R);break}else t(y,R);R=R.sibling}v.type===hr?(u=Xn(v.props.children,y.mode,j,v.key),u.return=y,y=u):(j=Ns(v.type,v.key,v.props,null,y.mode,j),j.ref=ro(y,u,v),j.return=y,y=j)}return i(y);case fr:e:{for(R=v.key;u!==null;){if(u.key===R)if(u.tag===4&&u.stateNode.containerInfo===v.containerInfo&&u.stateNode.implementation===v.implementation){n(y,u.sibling),u=o(u,v.children||[]),u.return=y,y=u;break e}else{n(y,u);break}else t(y,u);u=u.sibling}u=Yi(v,y.mode,j),u.return=y,y=u}return i(y);case yn:return R=v._init,A(y,u,R(v._payload),j)}if(lo(v))return g(y,u,v,j);if(qr(v))return x(y,u,v,j);ds(y,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,u!==null&&u.tag===6?(n(y,u.sibling),u=o(u,v),u.return=y,y=u):(n(y,u),u=Qi(v,y.mode,j),u.return=y,y=u),i(y)):n(y,u)}return A}var $r=lf(!0),cf=lf(!1),Us=Rn(null),Ks=null,kr=null,Nl=null;function Pl(){Nl=kr=Ks=null}function Al(e){var t=Us.current;pe(Us),e._currentValue=t}function Da(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function zr(e,t){Ks=e,Nl=kr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(it=!0),e.firstContext=null)}function bt(e){var t=e._currentValue;if(Nl!==e)if(e={context:e,memoizedValue:t,next:null},kr===null){if(Ks===null)throw Error(b(308));kr=e,Ks.dependencies={lanes:0,firstContext:e}}else kr=kr.next=e;return t}var Kn=null;function zl(e){Kn===null?Kn=[e]:Kn.push(e)}function uf(e,t,n,r){var o=t.interleaved;return o===null?(n.next=n,zl(t)):(n.next=o.next,o.next=n),t.interleaved=n,sn(e,r)}function sn(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var vn=!1;function Ll(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function df(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function nn(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Nn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,te&2){var o=r.pending;return o===null?t.next=t:(t.next=o.next,o.next=t),r.pending=t,sn(e,n)}return o=r.interleaved,o===null?(t.next=t,zl(r)):(t.next=o.next,o.next=t),r.interleaved=t,sn(e,n)}function Es(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,vl(e,n)}}function ou(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var o=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?o=s=i:s=s.next=i,n=n.next}while(n!==null);s===null?o=s=t:s=s.next=t}else o=s=t;n={baseState:r.baseState,firstBaseUpdate:o,lastBaseUpdate:s,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Zs(e,t,n,r){var o=e.updateQueue;vn=!1;var s=o.firstBaseUpdate,i=o.lastBaseUpdate,l=o.shared.pending;if(l!==null){o.shared.pending=null;var a=l,d=a.next;a.next=null,i===null?s=d:i.next=d,i=a;var h=e.alternate;h!==null&&(h=h.updateQueue,l=h.lastBaseUpdate,l!==i&&(l===null?h.firstBaseUpdate=d:l.next=d,h.lastBaseUpdate=a))}if(s!==null){var m=o.baseState;i=0,h=d=a=null,l=s;do{var p=l.lane,k=l.eventTime;if((r&p)===p){h!==null&&(h=h.next={eventTime:k,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var g=e,x=l;switch(p=t,k=n,x.tag){case 1:if(g=x.payload,typeof g=="function"){m=g.call(k,m,p);break e}m=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=x.payload,p=typeof g=="function"?g.call(k,m,p):g,p==null)break e;m=ke({},m,p);break e;case 2:vn=!0}}l.callback!==null&&l.lane!==0&&(e.flags|=64,p=o.effects,p===null?o.effects=[l]:p.push(l))}else k={eventTime:k,lane:p,tag:l.tag,payload:l.payload,callback:l.callback,next:null},h===null?(d=h=k,a=m):h=h.next=k,i|=p;if(l=l.next,l===null){if(l=o.shared.pending,l===null)break;p=l,l=p.next,p.next=null,o.lastBaseUpdate=p,o.shared.pending=null}}while(!0);if(h===null&&(a=m),o.baseState=a,o.firstBaseUpdate=d,o.lastBaseUpdate=h,t=o.shared.interleaved,t!==null){o=t;do i|=o.lane,o=o.next;while(o!==t)}else s===null&&(o.shared.lanes=0);tr|=i,e.lanes=i,e.memoizedState=m}}function su(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],o=r.callback;if(o!==null){if(r.callback=null,r=n,typeof o!="function")throw Error(b(191,o));o.call(r)}}}var Ko={},Gt=Rn(Ko),zo=Rn(Ko),Lo=Rn(Ko);function Zn(e){if(e===Ko)throw Error(b(174));return e}function Il(e,t){switch(fe(Lo,t),fe(zo,e),fe(Gt,Ko),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ma(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=ma(t,e)}pe(Gt),fe(Gt,t)}function Fr(){pe(Gt),pe(zo),pe(Lo)}function ff(e){Zn(Lo.current);var t=Zn(Gt.current),n=ma(t,e.type);t!==n&&(fe(zo,e),fe(Gt,n))}function Dl(e){zo.current===e&&(pe(Gt),pe(zo))}var we=Rn(0);function Gs(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Vi=[];function _l(){for(var e=0;e<Vi.length;e++)Vi[e]._workInProgressVersionPrimary=null;Vi.length=0}var Cs=cn.ReactCurrentDispatcher,Hi=cn.ReactCurrentBatchConfig,er=0,xe=null,Ne=null,_e=null,Qs=!1,yo=!1,Io=0,bm=0;function He(){throw Error(b(321))}function Rl(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Wt(e[n],t[n]))return!1;return!0}function Ol(e,t,n,r,o,s){if(er=s,xe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Cs.current=e===null||e.memoizedState===null?zm:Lm,e=n(r,o),yo){s=0;do{if(yo=!1,Io=0,25<=s)throw Error(b(301));s+=1,_e=Ne=null,t.updateQueue=null,Cs.current=Im,e=n(r,o)}while(yo)}if(Cs.current=Ys,t=Ne!==null&&Ne.next!==null,er=0,_e=Ne=xe=null,Qs=!1,t)throw Error(b(300));return e}function $l(){var e=Io!==0;return Io=0,e}function Ht(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return _e===null?xe.memoizedState=_e=e:_e=_e.next=e,_e}function Nt(){if(Ne===null){var e=xe.alternate;e=e!==null?e.memoizedState:null}else e=Ne.next;var t=_e===null?xe.memoizedState:_e.next;if(t!==null)_e=t,Ne=e;else{if(e===null)throw Error(b(310));Ne=e,e={memoizedState:Ne.memoizedState,baseState:Ne.baseState,baseQueue:Ne.baseQueue,queue:Ne.queue,next:null},_e===null?xe.memoizedState=_e=e:_e=_e.next=e}return _e}function Do(e,t){return typeof t=="function"?t(e):t}function Ui(e){var t=Nt(),n=t.queue;if(n===null)throw Error(b(311));n.lastRenderedReducer=e;var r=Ne,o=r.baseQueue,s=n.pending;if(s!==null){if(o!==null){var i=o.next;o.next=s.next,s.next=i}r.baseQueue=o=s,n.pending=null}if(o!==null){s=o.next,r=r.baseState;var l=i=null,a=null,d=s;do{var h=d.lane;if((er&h)===h)a!==null&&(a=a.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var m={lane:h,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};a===null?(l=a=m,i=r):a=a.next=m,xe.lanes|=h,tr|=h}d=d.next}while(d!==null&&d!==s);a===null?i=r:a.next=l,Wt(r,t.memoizedState)||(it=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=a,n.lastRenderedState=r}if(e=n.interleaved,e!==null){o=e;do s=o.lane,xe.lanes|=s,tr|=s,o=o.next;while(o!==e)}else o===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Ki(e){var t=Nt(),n=t.queue;if(n===null)throw Error(b(311));n.lastRenderedReducer=e;var r=n.dispatch,o=n.pending,s=t.memoizedState;if(o!==null){n.pending=null;var i=o=o.next;do s=e(s,i.action),i=i.next;while(i!==o);Wt(s,t.memoizedState)||(it=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,r]}function hf(){}function pf(e,t){var n=xe,r=Nt(),o=t(),s=!Wt(r.memoizedState,o);if(s&&(r.memoizedState=o,it=!0),r=r.queue,Fl(yf.bind(null,n,r,e),[e]),r.getSnapshot!==t||s||_e!==null&&_e.memoizedState.tag&1){if(n.flags|=2048,_o(9,gf.bind(null,n,r,o,t),void 0,null),Re===null)throw Error(b(349));er&30||mf(n,t,o)}return o}function mf(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=xe.updateQueue,t===null?(t={lastEffect:null,stores:null},xe.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function gf(e,t,n,r){t.value=n,t.getSnapshot=r,vf(t)&&wf(e)}function yf(e,t,n){return n(function(){vf(t)&&wf(e)})}function vf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Wt(e,n)}catch{return!0}}function wf(e){var t=sn(e,1);t!==null&&Ft(t,e,1,-1)}function iu(e){var t=Ht();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Do,lastRenderedState:e},t.queue=e,e=e.dispatch=Am.bind(null,xe,e),[t.memoizedState,e]}function _o(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=xe.updateQueue,t===null?(t={lastEffect:null,stores:null},xe.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function xf(){return Nt().memoizedState}function js(e,t,n,r){var o=Ht();xe.flags|=e,o.memoizedState=_o(1|t,n,void 0,r===void 0?null:r)}function hi(e,t,n,r){var o=Nt();r=r===void 0?null:r;var s=void 0;if(Ne!==null){var i=Ne.memoizedState;if(s=i.destroy,r!==null&&Rl(r,i.deps)){o.memoizedState=_o(t,n,s,r);return}}xe.flags|=e,o.memoizedState=_o(1|t,n,s,r)}function au(e,t){return js(8390656,8,e,t)}function Fl(e,t){return hi(2048,8,e,t)}function kf(e,t){return hi(4,2,e,t)}function Sf(e,t){return hi(4,4,e,t)}function Ef(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Cf(e,t,n){return n=n!=null?n.concat([e]):null,hi(4,4,Ef.bind(null,t,e),n)}function Bl(){}function jf(e,t){var n=Nt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Rl(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Tf(e,t){var n=Nt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Rl(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Mf(e,t,n){return er&21?(Wt(n,t)||(n=Ad(),xe.lanes|=n,tr|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,it=!0),e.memoizedState=n)}function Nm(e,t){var n=se;se=n!==0&&4>n?n:4,e(!0);var r=Hi.transition;Hi.transition={};try{e(!1),t()}finally{se=n,Hi.transition=r}}function bf(){return Nt().memoizedState}function Pm(e,t,n){var r=An(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Nf(e))Pf(t,n);else if(n=uf(e,t,n,r),n!==null){var o=et();Ft(n,e,r,o),Af(n,t,r)}}function Am(e,t,n){var r=An(e),o={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Nf(e))Pf(t,o);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var i=t.lastRenderedState,l=s(i,n);if(o.hasEagerState=!0,o.eagerState=l,Wt(l,i)){var a=t.interleaved;a===null?(o.next=o,zl(t)):(o.next=a.next,a.next=o),t.interleaved=o;return}}catch{}finally{}n=uf(e,t,o,r),n!==null&&(o=et(),Ft(n,e,r,o),Af(n,t,r))}}function Nf(e){var t=e.alternate;return e===xe||t!==null&&t===xe}function Pf(e,t){yo=Qs=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Af(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,vl(e,n)}}var Ys={readContext:bt,useCallback:He,useContext:He,useEffect:He,useImperativeHandle:He,useInsertionEffect:He,useLayoutEffect:He,useMemo:He,useReducer:He,useRef:He,useState:He,useDebugValue:He,useDeferredValue:He,useTransition:He,useMutableSource:He,useSyncExternalStore:He,useId:He,unstable_isNewReconciler:!1},zm={readContext:bt,useCallback:function(e,t){return Ht().memoizedState=[e,t===void 0?null:t],e},useContext:bt,useEffect:au,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,js(4194308,4,Ef.bind(null,t,e),n)},useLayoutEffect:function(e,t){return js(4194308,4,e,t)},useInsertionEffect:function(e,t){return js(4,2,e,t)},useMemo:function(e,t){var n=Ht();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ht();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Pm.bind(null,xe,e),[r.memoizedState,e]},useRef:function(e){var t=Ht();return e={current:e},t.memoizedState=e},useState:iu,useDebugValue:Bl,useDeferredValue:function(e){return Ht().memoizedState=e},useTransition:function(){var e=iu(!1),t=e[0];return e=Nm.bind(null,e[1]),Ht().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=xe,o=Ht();if(ge){if(n===void 0)throw Error(b(407));n=n()}else{if(n=t(),Re===null)throw Error(b(349));er&30||mf(r,t,n)}o.memoizedState=n;var s={value:n,getSnapshot:t};return o.queue=s,au(yf.bind(null,r,s,e),[e]),r.flags|=2048,_o(9,gf.bind(null,r,s,n,t),void 0,null),n},useId:function(){var e=Ht(),t=Re.identifierPrefix;if(ge){var n=tn,r=en;n=(r&~(1<<32-$t(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Io++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=bm++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Lm={readContext:bt,useCallback:jf,useContext:bt,useEffect:Fl,useImperativeHandle:Cf,useInsertionEffect:kf,useLayoutEffect:Sf,useMemo:Tf,useReducer:Ui,useRef:xf,useState:function(){return Ui(Do)},useDebugValue:Bl,useDeferredValue:function(e){var t=Nt();return Mf(t,Ne.memoizedState,e)},useTransition:function(){var e=Ui(Do)[0],t=Nt().memoizedState;return[e,t]},useMutableSource:hf,useSyncExternalStore:pf,useId:bf,unstable_isNewReconciler:!1},Im={readContext:bt,useCallback:jf,useContext:bt,useEffect:Fl,useImperativeHandle:Cf,useInsertionEffect:kf,useLayoutEffect:Sf,useMemo:Tf,useReducer:Ki,useRef:xf,useState:function(){return Ki(Do)},useDebugValue:Bl,useDeferredValue:function(e){var t=Nt();return Ne===null?t.memoizedState=e:Mf(t,Ne.memoizedState,e)},useTransition:function(){var e=Ki(Do)[0],t=Nt().memoizedState;return[e,t]},useMutableSource:hf,useSyncExternalStore:pf,useId:bf,unstable_isNewReconciler:!1};function It(e,t){if(e&&e.defaultProps){t=ke({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function _a(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:ke({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var pi={isMounted:function(e){return(e=e._reactInternals)?sr(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=et(),o=An(e),s=nn(r,o);s.payload=t,n!=null&&(s.callback=n),t=Nn(e,s,o),t!==null&&(Ft(t,e,o,r),Es(t,e,o))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=et(),o=An(e),s=nn(r,o);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=Nn(e,s,o),t!==null&&(Ft(t,e,o,r),Es(t,e,o))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=et(),r=An(e),o=nn(n,r);o.tag=2,t!=null&&(o.callback=t),t=Nn(e,o,r),t!==null&&(Ft(t,e,r,n),Es(t,e,r))}};function lu(e,t,n,r,o,s,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,s,i):t.prototype&&t.prototype.isPureReactComponent?!bo(n,r)||!bo(o,s):!0}function zf(e,t,n){var r=!1,o=In,s=t.contextType;return typeof s=="object"&&s!==null?s=bt(s):(o=lt(t)?qn:Ge.current,r=t.contextTypes,s=(r=r!=null)?Rr(e,o):In),t=new t(n,s),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=pi,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=o,e.__reactInternalMemoizedMaskedChildContext=s),t}function cu(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&pi.enqueueReplaceState(t,t.state,null)}function Ra(e,t,n,r){var o=e.stateNode;o.props=n,o.state=e.memoizedState,o.refs={},Ll(e);var s=t.contextType;typeof s=="object"&&s!==null?o.context=bt(s):(s=lt(t)?qn:Ge.current,o.context=Rr(e,s)),o.state=e.memoizedState,s=t.getDerivedStateFromProps,typeof s=="function"&&(_a(e,t,s,n),o.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(t=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),t!==o.state&&pi.enqueueReplaceState(o,o.state,null),Zs(e,n,o,r),o.state=e.memoizedState),typeof o.componentDidMount=="function"&&(e.flags|=4194308)}function Br(e,t){try{var n="",r=t;do n+=lp(r),r=r.return;while(r);var o=n}catch(s){o=`
Error generating stack: `+s.message+`
`+s.stack}return{value:e,source:t,stack:o,digest:null}}function Zi(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Oa(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Dm=typeof WeakMap=="function"?WeakMap:Map;function Lf(e,t,n){n=nn(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){qs||(qs=!0,Ga=r),Oa(e,t)},n}function If(e,t,n){n=nn(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var o=t.value;n.payload=function(){return r(o)},n.callback=function(){Oa(e,t)}}var s=e.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Oa(e,t),typeof r!="function"&&(Pn===null?Pn=new Set([this]):Pn.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function uu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Dm;var o=new Set;r.set(t,o)}else o=r.get(t),o===void 0&&(o=new Set,r.set(t,o));o.has(n)||(o.add(n),e=Qm.bind(null,e,t,n),t.then(e,e))}function du(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function fu(e,t,n,r,o){return e.mode&1?(e.flags|=65536,e.lanes=o,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=nn(-1,1),t.tag=2,Nn(n,t,1))),n.lanes|=1),e)}var _m=cn.ReactCurrentOwner,it=!1;function Je(e,t,n,r){t.child=e===null?cf(t,null,n,r):$r(t,e.child,n,r)}function hu(e,t,n,r,o){n=n.render;var s=t.ref;return zr(t,o),r=Ol(e,t,n,r,s,o),n=$l(),e!==null&&!it?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,an(e,t,o)):(ge&&n&&Tl(t),t.flags|=1,Je(e,t,r,o),t.child)}function pu(e,t,n,r,o){if(e===null){var s=n.type;return typeof s=="function"&&!Ql(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=s,Df(e,t,s,r,o)):(e=Ns(n.type,null,r,t,t.mode,o),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!(e.lanes&o)){var i=s.memoizedProps;if(n=n.compare,n=n!==null?n:bo,n(i,r)&&e.ref===t.ref)return an(e,t,o)}return t.flags|=1,e=zn(s,r),e.ref=t.ref,e.return=t,t.child=e}function Df(e,t,n,r,o){if(e!==null){var s=e.memoizedProps;if(bo(s,r)&&e.ref===t.ref)if(it=!1,t.pendingProps=r=s,(e.lanes&o)!==0)e.flags&131072&&(it=!0);else return t.lanes=e.lanes,an(e,t,o)}return $a(e,t,n,r,o)}function _f(e,t,n){var r=t.pendingProps,o=r.children,s=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},fe(Er,ht),ht|=n;else{if(!(n&1073741824))return e=s!==null?s.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,fe(Er,ht),ht|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=s!==null?s.baseLanes:n,fe(Er,ht),ht|=r}else s!==null?(r=s.baseLanes|n,t.memoizedState=null):r=n,fe(Er,ht),ht|=r;return Je(e,t,o,n),t.child}function Rf(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function $a(e,t,n,r,o){var s=lt(n)?qn:Ge.current;return s=Rr(t,s),zr(t,o),n=Ol(e,t,n,r,s,o),r=$l(),e!==null&&!it?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~o,an(e,t,o)):(ge&&r&&Tl(t),t.flags|=1,Je(e,t,n,o),t.child)}function mu(e,t,n,r,o){if(lt(n)){var s=!0;Ws(t)}else s=!1;if(zr(t,o),t.stateNode===null)Ts(e,t),zf(t,n,r),Ra(t,n,r,o),r=!0;else if(e===null){var i=t.stateNode,l=t.memoizedProps;i.props=l;var a=i.context,d=n.contextType;typeof d=="object"&&d!==null?d=bt(d):(d=lt(n)?qn:Ge.current,d=Rr(t,d));var h=n.getDerivedStateFromProps,m=typeof h=="function"||typeof i.getSnapshotBeforeUpdate=="function";m||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(l!==r||a!==d)&&cu(t,i,r,d),vn=!1;var p=t.memoizedState;i.state=p,Zs(t,r,i,o),a=t.memoizedState,l!==r||p!==a||at.current||vn?(typeof h=="function"&&(_a(t,n,h,r),a=t.memoizedState),(l=vn||lu(t,n,l,r,p,a,d))?(m||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=a),i.props=r,i.state=a,i.context=d,r=l):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,df(e,t),l=t.memoizedProps,d=t.type===t.elementType?l:It(t.type,l),i.props=d,m=t.pendingProps,p=i.context,a=n.contextType,typeof a=="object"&&a!==null?a=bt(a):(a=lt(n)?qn:Ge.current,a=Rr(t,a));var k=n.getDerivedStateFromProps;(h=typeof k=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(l!==m||p!==a)&&cu(t,i,r,a),vn=!1,p=t.memoizedState,i.state=p,Zs(t,r,i,o);var g=t.memoizedState;l!==m||p!==g||at.current||vn?(typeof k=="function"&&(_a(t,n,k,r),g=t.memoizedState),(d=vn||lu(t,n,d,r,p,g,a)||!1)?(h||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,g,a),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,g,a)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||l===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&p===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=g),i.props=r,i.state=g,i.context=a,r=d):(typeof i.componentDidUpdate!="function"||l===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&p===e.memoizedState||(t.flags|=1024),r=!1)}return Fa(e,t,n,r,s,o)}function Fa(e,t,n,r,o,s){Rf(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return o&&eu(t,n,!1),an(e,t,s);r=t.stateNode,_m.current=t;var l=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=$r(t,e.child,null,s),t.child=$r(t,null,l,s)):Je(e,t,l,s),t.memoizedState=r.state,o&&eu(t,n,!0),t.child}function Of(e){var t=e.stateNode;t.pendingContext?Jc(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Jc(e,t.context,!1),Il(e,t.containerInfo)}function gu(e,t,n,r,o){return Or(),bl(o),t.flags|=256,Je(e,t,n,r),t.child}var Ba={dehydrated:null,treeContext:null,retryLane:0};function Wa(e){return{baseLanes:e,cachePool:null,transitions:null}}function $f(e,t,n){var r=t.pendingProps,o=we.current,s=!1,i=(t.flags&128)!==0,l;if((l=i)||(l=e!==null&&e.memoizedState===null?!1:(o&2)!==0),l?(s=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(o|=1),fe(we,o&1),e===null)return Ia(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(i=r.children,e=r.fallback,s?(r=t.mode,s=t.child,i={mode:"hidden",children:i},!(r&1)&&s!==null?(s.childLanes=0,s.pendingProps=i):s=yi(i,r,0,null),e=Xn(e,r,n,null),s.return=t,e.return=t,s.sibling=e,t.child=s,t.child.memoizedState=Wa(n),t.memoizedState=Ba,e):Wl(t,i));if(o=e.memoizedState,o!==null&&(l=o.dehydrated,l!==null))return Rm(e,t,i,r,l,o,n);if(s){s=r.fallback,i=t.mode,o=e.child,l=o.sibling;var a={mode:"hidden",children:r.children};return!(i&1)&&t.child!==o?(r=t.child,r.childLanes=0,r.pendingProps=a,t.deletions=null):(r=zn(o,a),r.subtreeFlags=o.subtreeFlags&14680064),l!==null?s=zn(l,s):(s=Xn(s,i,n,null),s.flags|=2),s.return=t,r.return=t,r.sibling=s,t.child=r,r=s,s=t.child,i=e.child.memoizedState,i=i===null?Wa(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},s.memoizedState=i,s.childLanes=e.childLanes&~n,t.memoizedState=Ba,r}return s=e.child,e=s.sibling,r=zn(s,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Wl(e,t){return t=yi({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function fs(e,t,n,r){return r!==null&&bl(r),$r(t,e.child,null,n),e=Wl(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Rm(e,t,n,r,o,s,i){if(n)return t.flags&256?(t.flags&=-257,r=Zi(Error(b(422))),fs(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(s=r.fallback,o=t.mode,r=yi({mode:"visible",children:r.children},o,0,null),s=Xn(s,o,i,null),s.flags|=2,r.return=t,s.return=t,r.sibling=s,t.child=r,t.mode&1&&$r(t,e.child,null,i),t.child.memoizedState=Wa(i),t.memoizedState=Ba,s);if(!(t.mode&1))return fs(e,t,i,null);if(o.data==="$!"){if(r=o.nextSibling&&o.nextSibling.dataset,r)var l=r.dgst;return r=l,s=Error(b(419)),r=Zi(s,r,void 0),fs(e,t,i,r)}if(l=(i&e.childLanes)!==0,it||l){if(r=Re,r!==null){switch(i&-i){case 4:o=2;break;case 16:o=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:o=32;break;case 536870912:o=268435456;break;default:o=0}o=o&(r.suspendedLanes|i)?0:o,o!==0&&o!==s.retryLane&&(s.retryLane=o,sn(e,o),Ft(r,e,o,-1))}return Gl(),r=Zi(Error(b(421))),fs(e,t,i,r)}return o.data==="$?"?(t.flags|=128,t.child=e.child,t=Ym.bind(null,e),o._reactRetry=t,null):(e=s.treeContext,pt=bn(o.nextSibling),mt=t,ge=!0,Rt=null,e!==null&&(St[Et++]=en,St[Et++]=tn,St[Et++]=Jn,en=e.id,tn=e.overflow,Jn=t),t=Wl(t,r.children),t.flags|=4096,t)}function yu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Da(e.return,t,n)}function Gi(e,t,n,r,o){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:o}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=r,s.tail=n,s.tailMode=o)}function Ff(e,t,n){var r=t.pendingProps,o=r.revealOrder,s=r.tail;if(Je(e,t,r.children,n),r=we.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&yu(e,n,t);else if(e.tag===19)yu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(fe(we,r),!(t.mode&1))t.memoizedState=null;else switch(o){case"forwards":for(n=t.child,o=null;n!==null;)e=n.alternate,e!==null&&Gs(e)===null&&(o=n),n=n.sibling;n=o,n===null?(o=t.child,t.child=null):(o=n.sibling,n.sibling=null),Gi(t,!1,o,n,s);break;case"backwards":for(n=null,o=t.child,t.child=null;o!==null;){if(e=o.alternate,e!==null&&Gs(e)===null){t.child=o;break}e=o.sibling,o.sibling=n,n=o,o=e}Gi(t,!0,n,null,s);break;case"together":Gi(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Ts(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function an(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),tr|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(b(153));if(t.child!==null){for(e=t.child,n=zn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=zn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Om(e,t,n){switch(t.tag){case 3:Of(t),Or();break;case 5:ff(t);break;case 1:lt(t.type)&&Ws(t);break;case 4:Il(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,o=t.memoizedProps.value;fe(Us,r._currentValue),r._currentValue=o;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(fe(we,we.current&1),t.flags|=128,null):n&t.child.childLanes?$f(e,t,n):(fe(we,we.current&1),e=an(e,t,n),e!==null?e.sibling:null);fe(we,we.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Ff(e,t,n);t.flags|=128}if(o=t.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),fe(we,we.current),r)break;return null;case 22:case 23:return t.lanes=0,_f(e,t,n)}return an(e,t,n)}var Bf,Va,Wf,Vf;Bf=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Va=function(){};Wf=function(e,t,n,r){var o=e.memoizedProps;if(o!==r){e=t.stateNode,Zn(Gt.current);var s=null;switch(n){case"input":o=da(e,o),r=da(e,r),s=[];break;case"select":o=ke({},o,{value:void 0}),r=ke({},r,{value:void 0}),s=[];break;case"textarea":o=pa(e,o),r=pa(e,r),s=[];break;default:typeof o.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Fs)}ga(n,r);var i;n=null;for(d in o)if(!r.hasOwnProperty(d)&&o.hasOwnProperty(d)&&o[d]!=null)if(d==="style"){var l=o[d];for(i in l)l.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(ko.hasOwnProperty(d)?s||(s=[]):(s=s||[]).push(d,null));for(d in r){var a=r[d];if(l=o!=null?o[d]:void 0,r.hasOwnProperty(d)&&a!==l&&(a!=null||l!=null))if(d==="style")if(l){for(i in l)!l.hasOwnProperty(i)||a&&a.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in a)a.hasOwnProperty(i)&&l[i]!==a[i]&&(n||(n={}),n[i]=a[i])}else n||(s||(s=[]),s.push(d,n)),n=a;else d==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,l=l?l.__html:void 0,a!=null&&l!==a&&(s=s||[]).push(d,a)):d==="children"?typeof a!="string"&&typeof a!="number"||(s=s||[]).push(d,""+a):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(ko.hasOwnProperty(d)?(a!=null&&d==="onScroll"&&he("scroll",e),s||l===a||(s=[])):(s=s||[]).push(d,a))}n&&(s=s||[]).push("style",n);var d=s;(t.updateQueue=d)&&(t.flags|=4)}};Vf=function(e,t,n,r){n!==r&&(t.flags|=4)};function oo(e,t){if(!ge)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Ue(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags&14680064,r|=o.flags&14680064,o.return=e,o=o.sibling;else for(o=e.child;o!==null;)n|=o.lanes|o.childLanes,r|=o.subtreeFlags,r|=o.flags,o.return=e,o=o.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function $m(e,t,n){var r=t.pendingProps;switch(Ml(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ue(t),null;case 1:return lt(t.type)&&Bs(),Ue(t),null;case 3:return r=t.stateNode,Fr(),pe(at),pe(Ge),_l(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(us(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Rt!==null&&(Xa(Rt),Rt=null))),Va(e,t),Ue(t),null;case 5:Dl(t);var o=Zn(Lo.current);if(n=t.type,e!==null&&t.stateNode!=null)Wf(e,t,n,r,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(b(166));return Ue(t),null}if(e=Zn(Gt.current),us(t)){r=t.stateNode,n=t.type;var s=t.memoizedProps;switch(r[Ut]=t,r[Ao]=s,e=(t.mode&1)!==0,n){case"dialog":he("cancel",r),he("close",r);break;case"iframe":case"object":case"embed":he("load",r);break;case"video":case"audio":for(o=0;o<uo.length;o++)he(uo[o],r);break;case"source":he("error",r);break;case"img":case"image":case"link":he("error",r),he("load",r);break;case"details":he("toggle",r);break;case"input":Tc(r,s),he("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},he("invalid",r);break;case"textarea":bc(r,s),he("invalid",r)}ga(n,s),o=null;for(var i in s)if(s.hasOwnProperty(i)){var l=s[i];i==="children"?typeof l=="string"?r.textContent!==l&&(s.suppressHydrationWarning!==!0&&cs(r.textContent,l,e),o=["children",l]):typeof l=="number"&&r.textContent!==""+l&&(s.suppressHydrationWarning!==!0&&cs(r.textContent,l,e),o=["children",""+l]):ko.hasOwnProperty(i)&&l!=null&&i==="onScroll"&&he("scroll",r)}switch(n){case"input":ts(r),Mc(r,s,!0);break;case"textarea":ts(r),Nc(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Fs)}r=o,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=o.nodeType===9?o:o.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=gd(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[Ut]=t,e[Ao]=r,Bf(e,t,!1,!1),t.stateNode=e;e:{switch(i=ya(n,r),n){case"dialog":he("cancel",e),he("close",e),o=r;break;case"iframe":case"object":case"embed":he("load",e),o=r;break;case"video":case"audio":for(o=0;o<uo.length;o++)he(uo[o],e);o=r;break;case"source":he("error",e),o=r;break;case"img":case"image":case"link":he("error",e),he("load",e),o=r;break;case"details":he("toggle",e),o=r;break;case"input":Tc(e,r),o=da(e,r),he("invalid",e);break;case"option":o=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},o=ke({},r,{value:void 0}),he("invalid",e);break;case"textarea":bc(e,r),o=pa(e,r),he("invalid",e);break;default:o=r}ga(n,o),l=o;for(s in l)if(l.hasOwnProperty(s)){var a=l[s];s==="style"?wd(e,a):s==="dangerouslySetInnerHTML"?(a=a?a.__html:void 0,a!=null&&yd(e,a)):s==="children"?typeof a=="string"?(n!=="textarea"||a!=="")&&So(e,a):typeof a=="number"&&So(e,""+a):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ko.hasOwnProperty(s)?a!=null&&s==="onScroll"&&he("scroll",e):a!=null&&fl(e,s,a,i))}switch(n){case"input":ts(e),Mc(e,r,!1);break;case"textarea":ts(e),Nc(e);break;case"option":r.value!=null&&e.setAttribute("value",""+Ln(r.value));break;case"select":e.multiple=!!r.multiple,s=r.value,s!=null?br(e,!!r.multiple,s,!1):r.defaultValue!=null&&br(e,!!r.multiple,r.defaultValue,!0);break;default:typeof o.onClick=="function"&&(e.onclick=Fs)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ue(t),null;case 6:if(e&&t.stateNode!=null)Vf(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(b(166));if(n=Zn(Lo.current),Zn(Gt.current),us(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ut]=t,(s=r.nodeValue!==n)&&(e=mt,e!==null))switch(e.tag){case 3:cs(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&cs(r.nodeValue,n,(e.mode&1)!==0)}s&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ut]=t,t.stateNode=r}return Ue(t),null;case 13:if(pe(we),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ge&&pt!==null&&t.mode&1&&!(t.flags&128))af(),Or(),t.flags|=98560,s=!1;else if(s=us(t),r!==null&&r.dehydrated!==null){if(e===null){if(!s)throw Error(b(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(b(317));s[Ut]=t}else Or(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Ue(t),s=!1}else Rt!==null&&(Xa(Rt),Rt=null),s=!0;if(!s)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||we.current&1?Pe===0&&(Pe=3):Gl())),t.updateQueue!==null&&(t.flags|=4),Ue(t),null);case 4:return Fr(),Va(e,t),e===null&&No(t.stateNode.containerInfo),Ue(t),null;case 10:return Al(t.type._context),Ue(t),null;case 17:return lt(t.type)&&Bs(),Ue(t),null;case 19:if(pe(we),s=t.memoizedState,s===null)return Ue(t),null;if(r=(t.flags&128)!==0,i=s.rendering,i===null)if(r)oo(s,!1);else{if(Pe!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(i=Gs(e),i!==null){for(t.flags|=128,oo(s,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)s=n,e=r,s.flags&=14680066,i=s.alternate,i===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=i.childLanes,s.lanes=i.lanes,s.child=i.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=i.memoizedProps,s.memoizedState=i.memoizedState,s.updateQueue=i.updateQueue,s.type=i.type,e=i.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return fe(we,we.current&1|2),t.child}e=e.sibling}s.tail!==null&&Te()>Wr&&(t.flags|=128,r=!0,oo(s,!1),t.lanes=4194304)}else{if(!r)if(e=Gs(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),oo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!i.alternate&&!ge)return Ue(t),null}else 2*Te()-s.renderingStartTime>Wr&&n!==1073741824&&(t.flags|=128,r=!0,oo(s,!1),t.lanes=4194304);s.isBackwards?(i.sibling=t.child,t.child=i):(n=s.last,n!==null?n.sibling=i:t.child=i,s.last=i)}return s.tail!==null?(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=Te(),t.sibling=null,n=we.current,fe(we,r?n&1|2:n&1),t):(Ue(t),null);case 22:case 23:return Zl(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?ht&1073741824&&(Ue(t),t.subtreeFlags&6&&(t.flags|=8192)):Ue(t),null;case 24:return null;case 25:return null}throw Error(b(156,t.tag))}function Fm(e,t){switch(Ml(t),t.tag){case 1:return lt(t.type)&&Bs(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Fr(),pe(at),pe(Ge),_l(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Dl(t),null;case 13:if(pe(we),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(b(340));Or()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return pe(we),null;case 4:return Fr(),null;case 10:return Al(t.type._context),null;case 22:case 23:return Zl(),null;case 24:return null;default:return null}}var hs=!1,Ze=!1,Bm=typeof WeakSet=="function"?WeakSet:Set,$=null;function Sr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ee(e,t,r)}else n.current=null}function Ha(e,t,n){try{n()}catch(r){Ee(e,t,r)}}var vu=!1;function Wm(e,t){if(Ma=Rs,e=Zd(),jl(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var o=r.anchorOffset,s=r.focusNode;r=r.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var i=0,l=-1,a=-1,d=0,h=0,m=e,p=null;t:for(;;){for(var k;m!==n||o!==0&&m.nodeType!==3||(l=i+o),m!==s||r!==0&&m.nodeType!==3||(a=i+r),m.nodeType===3&&(i+=m.nodeValue.length),(k=m.firstChild)!==null;)p=m,m=k;for(;;){if(m===e)break t;if(p===n&&++d===o&&(l=i),p===s&&++h===r&&(a=i),(k=m.nextSibling)!==null)break;m=p,p=m.parentNode}m=k}n=l===-1||a===-1?null:{start:l,end:a}}else n=null}n=n||{start:0,end:0}}else n=null;for(ba={focusedElem:e,selectionRange:n},Rs=!1,$=t;$!==null;)if(t=$,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,$=e;else for(;$!==null;){t=$;try{var g=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var x=g.memoizedProps,A=g.memoizedState,y=t.stateNode,u=y.getSnapshotBeforeUpdate(t.elementType===t.type?x:It(t.type,x),A);y.__reactInternalSnapshotBeforeUpdate=u}break;case 3:var v=t.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(b(163))}}catch(j){Ee(t,t.return,j)}if(e=t.sibling,e!==null){e.return=t.return,$=e;break}$=t.return}return g=vu,vu=!1,g}function vo(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var o=r=r.next;do{if((o.tag&e)===e){var s=o.destroy;o.destroy=void 0,s!==void 0&&Ha(t,n,s)}o=o.next}while(o!==r)}}function mi(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Ua(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Hf(e){var t=e.alternate;t!==null&&(e.alternate=null,Hf(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ut],delete t[Ao],delete t[Aa],delete t[Cm],delete t[jm])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Uf(e){return e.tag===5||e.tag===3||e.tag===4}function wu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Uf(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ka(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Fs));else if(r!==4&&(e=e.child,e!==null))for(Ka(e,t,n),e=e.sibling;e!==null;)Ka(e,t,n),e=e.sibling}function Za(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Za(e,t,n),e=e.sibling;e!==null;)Za(e,t,n),e=e.sibling}var $e=null,_t=!1;function mn(e,t,n){for(n=n.child;n!==null;)Kf(e,t,n),n=n.sibling}function Kf(e,t,n){if(Zt&&typeof Zt.onCommitFiberUnmount=="function")try{Zt.onCommitFiberUnmount(ai,n)}catch{}switch(n.tag){case 5:Ze||Sr(n,t);case 6:var r=$e,o=_t;$e=null,mn(e,t,n),$e=r,_t=o,$e!==null&&(_t?(e=$e,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):$e.removeChild(n.stateNode));break;case 18:$e!==null&&(_t?(e=$e,n=n.stateNode,e.nodeType===8?Bi(e.parentNode,n):e.nodeType===1&&Bi(e,n),To(e)):Bi($e,n.stateNode));break;case 4:r=$e,o=_t,$e=n.stateNode.containerInfo,_t=!0,mn(e,t,n),$e=r,_t=o;break;case 0:case 11:case 14:case 15:if(!Ze&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){o=r=r.next;do{var s=o,i=s.destroy;s=s.tag,i!==void 0&&(s&2||s&4)&&Ha(n,t,i),o=o.next}while(o!==r)}mn(e,t,n);break;case 1:if(!Ze&&(Sr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(l){Ee(n,t,l)}mn(e,t,n);break;case 21:mn(e,t,n);break;case 22:n.mode&1?(Ze=(r=Ze)||n.memoizedState!==null,mn(e,t,n),Ze=r):mn(e,t,n);break;default:mn(e,t,n)}}function xu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Bm),t.forEach(function(r){var o=Xm.bind(null,e,r);n.has(r)||(n.add(r),r.then(o,o))})}}function Lt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var o=n[r];try{var s=e,i=t,l=i;e:for(;l!==null;){switch(l.tag){case 5:$e=l.stateNode,_t=!1;break e;case 3:$e=l.stateNode.containerInfo,_t=!0;break e;case 4:$e=l.stateNode.containerInfo,_t=!0;break e}l=l.return}if($e===null)throw Error(b(160));Kf(s,i,o),$e=null,_t=!1;var a=o.alternate;a!==null&&(a.return=null),o.return=null}catch(d){Ee(o,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Zf(t,e),t=t.sibling}function Zf(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Lt(t,e),Vt(e),r&4){try{vo(3,e,e.return),mi(3,e)}catch(x){Ee(e,e.return,x)}try{vo(5,e,e.return)}catch(x){Ee(e,e.return,x)}}break;case 1:Lt(t,e),Vt(e),r&512&&n!==null&&Sr(n,n.return);break;case 5:if(Lt(t,e),Vt(e),r&512&&n!==null&&Sr(n,n.return),e.flags&32){var o=e.stateNode;try{So(o,"")}catch(x){Ee(e,e.return,x)}}if(r&4&&(o=e.stateNode,o!=null)){var s=e.memoizedProps,i=n!==null?n.memoizedProps:s,l=e.type,a=e.updateQueue;if(e.updateQueue=null,a!==null)try{l==="input"&&s.type==="radio"&&s.name!=null&&pd(o,s),ya(l,i);var d=ya(l,s);for(i=0;i<a.length;i+=2){var h=a[i],m=a[i+1];h==="style"?wd(o,m):h==="dangerouslySetInnerHTML"?yd(o,m):h==="children"?So(o,m):fl(o,h,m,d)}switch(l){case"input":fa(o,s);break;case"textarea":md(o,s);break;case"select":var p=o._wrapperState.wasMultiple;o._wrapperState.wasMultiple=!!s.multiple;var k=s.value;k!=null?br(o,!!s.multiple,k,!1):p!==!!s.multiple&&(s.defaultValue!=null?br(o,!!s.multiple,s.defaultValue,!0):br(o,!!s.multiple,s.multiple?[]:"",!1))}o[Ao]=s}catch(x){Ee(e,e.return,x)}}break;case 6:if(Lt(t,e),Vt(e),r&4){if(e.stateNode===null)throw Error(b(162));o=e.stateNode,s=e.memoizedProps;try{o.nodeValue=s}catch(x){Ee(e,e.return,x)}}break;case 3:if(Lt(t,e),Vt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{To(t.containerInfo)}catch(x){Ee(e,e.return,x)}break;case 4:Lt(t,e),Vt(e);break;case 13:Lt(t,e),Vt(e),o=e.child,o.flags&8192&&(s=o.memoizedState!==null,o.stateNode.isHidden=s,!s||o.alternate!==null&&o.alternate.memoizedState!==null||(Ul=Te())),r&4&&xu(e);break;case 22:if(h=n!==null&&n.memoizedState!==null,e.mode&1?(Ze=(d=Ze)||h,Lt(t,e),Ze=d):Lt(t,e),Vt(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!h&&e.mode&1)for($=e,h=e.child;h!==null;){for(m=$=h;$!==null;){switch(p=$,k=p.child,p.tag){case 0:case 11:case 14:case 15:vo(4,p,p.return);break;case 1:Sr(p,p.return);var g=p.stateNode;if(typeof g.componentWillUnmount=="function"){r=p,n=p.return;try{t=r,g.props=t.memoizedProps,g.state=t.memoizedState,g.componentWillUnmount()}catch(x){Ee(r,n,x)}}break;case 5:Sr(p,p.return);break;case 22:if(p.memoizedState!==null){Su(m);continue}}k!==null?(k.return=p,$=k):Su(m)}h=h.sibling}e:for(h=null,m=e;;){if(m.tag===5){if(h===null){h=m;try{o=m.stateNode,d?(s=o.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(l=m.stateNode,a=m.memoizedProps.style,i=a!=null&&a.hasOwnProperty("display")?a.display:null,l.style.display=vd("display",i))}catch(x){Ee(e,e.return,x)}}}else if(m.tag===6){if(h===null)try{m.stateNode.nodeValue=d?"":m.memoizedProps}catch(x){Ee(e,e.return,x)}}else if((m.tag!==22&&m.tag!==23||m.memoizedState===null||m===e)&&m.child!==null){m.child.return=m,m=m.child;continue}if(m===e)break e;for(;m.sibling===null;){if(m.return===null||m.return===e)break e;h===m&&(h=null),m=m.return}h===m&&(h=null),m.sibling.return=m.return,m=m.sibling}}break;case 19:Lt(t,e),Vt(e),r&4&&xu(e);break;case 21:break;default:Lt(t,e),Vt(e)}}function Vt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Uf(n)){var r=n;break e}n=n.return}throw Error(b(160))}switch(r.tag){case 5:var o=r.stateNode;r.flags&32&&(So(o,""),r.flags&=-33);var s=wu(e);Za(e,s,o);break;case 3:case 4:var i=r.stateNode.containerInfo,l=wu(e);Ka(e,l,i);break;default:throw Error(b(161))}}catch(a){Ee(e,e.return,a)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Vm(e,t,n){$=e,Gf(e)}function Gf(e,t,n){for(var r=(e.mode&1)!==0;$!==null;){var o=$,s=o.child;if(o.tag===22&&r){var i=o.memoizedState!==null||hs;if(!i){var l=o.alternate,a=l!==null&&l.memoizedState!==null||Ze;l=hs;var d=Ze;if(hs=i,(Ze=a)&&!d)for($=o;$!==null;)i=$,a=i.child,i.tag===22&&i.memoizedState!==null?Eu(o):a!==null?(a.return=i,$=a):Eu(o);for(;s!==null;)$=s,Gf(s),s=s.sibling;$=o,hs=l,Ze=d}ku(e)}else o.subtreeFlags&8772&&s!==null?(s.return=o,$=s):ku(e)}}function ku(e){for(;$!==null;){var t=$;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Ze||mi(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Ze)if(n===null)r.componentDidMount();else{var o=t.elementType===t.type?n.memoizedProps:It(t.type,n.memoizedProps);r.componentDidUpdate(o,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var s=t.updateQueue;s!==null&&su(t,s,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}su(t,i,n)}break;case 5:var l=t.stateNode;if(n===null&&t.flags&4){n=l;var a=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":a.autoFocus&&n.focus();break;case"img":a.src&&(n.src=a.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var h=d.memoizedState;if(h!==null){var m=h.dehydrated;m!==null&&To(m)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(b(163))}Ze||t.flags&512&&Ua(t)}catch(p){Ee(t,t.return,p)}}if(t===e){$=null;break}if(n=t.sibling,n!==null){n.return=t.return,$=n;break}$=t.return}}function Su(e){for(;$!==null;){var t=$;if(t===e){$=null;break}var n=t.sibling;if(n!==null){n.return=t.return,$=n;break}$=t.return}}function Eu(e){for(;$!==null;){var t=$;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{mi(4,t)}catch(a){Ee(t,n,a)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var o=t.return;try{r.componentDidMount()}catch(a){Ee(t,o,a)}}var s=t.return;try{Ua(t)}catch(a){Ee(t,s,a)}break;case 5:var i=t.return;try{Ua(t)}catch(a){Ee(t,i,a)}}}catch(a){Ee(t,t.return,a)}if(t===e){$=null;break}var l=t.sibling;if(l!==null){l.return=t.return,$=l;break}$=t.return}}var Hm=Math.ceil,Xs=cn.ReactCurrentDispatcher,Vl=cn.ReactCurrentOwner,Mt=cn.ReactCurrentBatchConfig,te=0,Re=null,Me=null,Be=0,ht=0,Er=Rn(0),Pe=0,Ro=null,tr=0,gi=0,Hl=0,wo=null,st=null,Ul=0,Wr=1/0,qt=null,qs=!1,Ga=null,Pn=null,ps=!1,Sn=null,Js=0,xo=0,Qa=null,Ms=-1,bs=0;function et(){return te&6?Te():Ms!==-1?Ms:Ms=Te()}function An(e){return e.mode&1?te&2&&Be!==0?Be&-Be:Mm.transition!==null?(bs===0&&(bs=Ad()),bs):(e=se,e!==0||(e=window.event,e=e===void 0?16:Od(e.type)),e):1}function Ft(e,t,n,r){if(50<xo)throw xo=0,Qa=null,Error(b(185));Vo(e,n,r),(!(te&2)||e!==Re)&&(e===Re&&(!(te&2)&&(gi|=n),Pe===4&&xn(e,Be)),ct(e,r),n===1&&te===0&&!(t.mode&1)&&(Wr=Te()+500,fi&&On()))}function ct(e,t){var n=e.callbackNode;Mp(e,t);var r=_s(e,e===Re?Be:0);if(r===0)n!==null&&zc(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&zc(n),t===1)e.tag===0?Tm(Cu.bind(null,e)):rf(Cu.bind(null,e)),Sm(function(){!(te&6)&&On()}),n=null;else{switch(zd(r)){case 1:n=yl;break;case 4:n=Nd;break;case 16:n=Ds;break;case 536870912:n=Pd;break;default:n=Ds}n=nh(n,Qf.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Qf(e,t){if(Ms=-1,bs=0,te&6)throw Error(b(327));var n=e.callbackNode;if(Lr()&&e.callbackNode!==n)return null;var r=_s(e,e===Re?Be:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=ei(e,r);else{t=r;var o=te;te|=2;var s=Xf();(Re!==e||Be!==t)&&(qt=null,Wr=Te()+500,Yn(e,t));do try{Zm();break}catch(l){Yf(e,l)}while(!0);Pl(),Xs.current=s,te=o,Me!==null?t=0:(Re=null,Be=0,t=Pe)}if(t!==0){if(t===2&&(o=Sa(e),o!==0&&(r=o,t=Ya(e,o))),t===1)throw n=Ro,Yn(e,0),xn(e,r),ct(e,Te()),n;if(t===6)xn(e,r);else{if(o=e.current.alternate,!(r&30)&&!Um(o)&&(t=ei(e,r),t===2&&(s=Sa(e),s!==0&&(r=s,t=Ya(e,s))),t===1))throw n=Ro,Yn(e,0),xn(e,r),ct(e,Te()),n;switch(e.finishedWork=o,e.finishedLanes=r,t){case 0:case 1:throw Error(b(345));case 2:Wn(e,st,qt);break;case 3:if(xn(e,r),(r&130023424)===r&&(t=Ul+500-Te(),10<t)){if(_s(e,0)!==0)break;if(o=e.suspendedLanes,(o&r)!==r){et(),e.pingedLanes|=e.suspendedLanes&o;break}e.timeoutHandle=Pa(Wn.bind(null,e,st,qt),t);break}Wn(e,st,qt);break;case 4:if(xn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,o=-1;0<r;){var i=31-$t(r);s=1<<i,i=t[i],i>o&&(o=i),r&=~s}if(r=o,r=Te()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Hm(r/1960))-r,10<r){e.timeoutHandle=Pa(Wn.bind(null,e,st,qt),r);break}Wn(e,st,qt);break;case 5:Wn(e,st,qt);break;default:throw Error(b(329))}}}return ct(e,Te()),e.callbackNode===n?Qf.bind(null,e):null}function Ya(e,t){var n=wo;return e.current.memoizedState.isDehydrated&&(Yn(e,t).flags|=256),e=ei(e,t),e!==2&&(t=st,st=n,t!==null&&Xa(t)),e}function Xa(e){st===null?st=e:st.push.apply(st,e)}function Um(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var o=n[r],s=o.getSnapshot;o=o.value;try{if(!Wt(s(),o))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function xn(e,t){for(t&=~Hl,t&=~gi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-$t(t),r=1<<n;e[n]=-1,t&=~r}}function Cu(e){if(te&6)throw Error(b(327));Lr();var t=_s(e,0);if(!(t&1))return ct(e,Te()),null;var n=ei(e,t);if(e.tag!==0&&n===2){var r=Sa(e);r!==0&&(t=r,n=Ya(e,r))}if(n===1)throw n=Ro,Yn(e,0),xn(e,t),ct(e,Te()),n;if(n===6)throw Error(b(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Wn(e,st,qt),ct(e,Te()),null}function Kl(e,t){var n=te;te|=1;try{return e(t)}finally{te=n,te===0&&(Wr=Te()+500,fi&&On())}}function nr(e){Sn!==null&&Sn.tag===0&&!(te&6)&&Lr();var t=te;te|=1;var n=Mt.transition,r=se;try{if(Mt.transition=null,se=1,e)return e()}finally{se=r,Mt.transition=n,te=t,!(te&6)&&On()}}function Zl(){ht=Er.current,pe(Er)}function Yn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,km(n)),Me!==null)for(n=Me.return;n!==null;){var r=n;switch(Ml(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Bs();break;case 3:Fr(),pe(at),pe(Ge),_l();break;case 5:Dl(r);break;case 4:Fr();break;case 13:pe(we);break;case 19:pe(we);break;case 10:Al(r.type._context);break;case 22:case 23:Zl()}n=n.return}if(Re=e,Me=e=zn(e.current,null),Be=ht=t,Pe=0,Ro=null,Hl=gi=tr=0,st=wo=null,Kn!==null){for(t=0;t<Kn.length;t++)if(n=Kn[t],r=n.interleaved,r!==null){n.interleaved=null;var o=r.next,s=n.pending;if(s!==null){var i=s.next;s.next=o,r.next=i}n.pending=r}Kn=null}return e}function Yf(e,t){do{var n=Me;try{if(Pl(),Cs.current=Ys,Qs){for(var r=xe.memoizedState;r!==null;){var o=r.queue;o!==null&&(o.pending=null),r=r.next}Qs=!1}if(er=0,_e=Ne=xe=null,yo=!1,Io=0,Vl.current=null,n===null||n.return===null){Pe=1,Ro=t,Me=null;break}e:{var s=e,i=n.return,l=n,a=t;if(t=Be,l.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){var d=a,h=l,m=h.tag;if(!(h.mode&1)&&(m===0||m===11||m===15)){var p=h.alternate;p?(h.updateQueue=p.updateQueue,h.memoizedState=p.memoizedState,h.lanes=p.lanes):(h.updateQueue=null,h.memoizedState=null)}var k=du(i);if(k!==null){k.flags&=-257,fu(k,i,l,s,t),k.mode&1&&uu(s,d,t),t=k,a=d;var g=t.updateQueue;if(g===null){var x=new Set;x.add(a),t.updateQueue=x}else g.add(a);break e}else{if(!(t&1)){uu(s,d,t),Gl();break e}a=Error(b(426))}}else if(ge&&l.mode&1){var A=du(i);if(A!==null){!(A.flags&65536)&&(A.flags|=256),fu(A,i,l,s,t),bl(Br(a,l));break e}}s=a=Br(a,l),Pe!==4&&(Pe=2),wo===null?wo=[s]:wo.push(s),s=i;do{switch(s.tag){case 3:s.flags|=65536,t&=-t,s.lanes|=t;var y=Lf(s,a,t);ou(s,y);break e;case 1:l=a;var u=s.type,v=s.stateNode;if(!(s.flags&128)&&(typeof u.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(Pn===null||!Pn.has(v)))){s.flags|=65536,t&=-t,s.lanes|=t;var j=If(s,l,t);ou(s,j);break e}}s=s.return}while(s!==null)}Jf(n)}catch(z){t=z,Me===n&&n!==null&&(Me=n=n.return);continue}break}while(!0)}function Xf(){var e=Xs.current;return Xs.current=Ys,e===null?Ys:e}function Gl(){(Pe===0||Pe===3||Pe===2)&&(Pe=4),Re===null||!(tr&268435455)&&!(gi&268435455)||xn(Re,Be)}function ei(e,t){var n=te;te|=2;var r=Xf();(Re!==e||Be!==t)&&(qt=null,Yn(e,t));do try{Km();break}catch(o){Yf(e,o)}while(!0);if(Pl(),te=n,Xs.current=r,Me!==null)throw Error(b(261));return Re=null,Be=0,Pe}function Km(){for(;Me!==null;)qf(Me)}function Zm(){for(;Me!==null&&!vp();)qf(Me)}function qf(e){var t=th(e.alternate,e,ht);e.memoizedProps=e.pendingProps,t===null?Jf(e):Me=t,Vl.current=null}function Jf(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Fm(n,t),n!==null){n.flags&=32767,Me=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Pe=6,Me=null;return}}else if(n=$m(n,t,ht),n!==null){Me=n;return}if(t=t.sibling,t!==null){Me=t;return}Me=t=e}while(t!==null);Pe===0&&(Pe=5)}function Wn(e,t,n){var r=se,o=Mt.transition;try{Mt.transition=null,se=1,Gm(e,t,n,r)}finally{Mt.transition=o,se=r}return null}function Gm(e,t,n,r){do Lr();while(Sn!==null);if(te&6)throw Error(b(327));n=e.finishedWork;var o=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(b(177));e.callbackNode=null,e.callbackPriority=0;var s=n.lanes|n.childLanes;if(bp(e,s),e===Re&&(Me=Re=null,Be=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ps||(ps=!0,nh(Ds,function(){return Lr(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Mt.transition,Mt.transition=null;var i=se;se=1;var l=te;te|=4,Vl.current=null,Wm(e,n),Zf(n,e),pm(ba),Rs=!!Ma,ba=Ma=null,e.current=n,Vm(n),wp(),te=l,se=i,Mt.transition=s}else e.current=n;if(ps&&(ps=!1,Sn=e,Js=o),s=e.pendingLanes,s===0&&(Pn=null),Sp(n.stateNode),ct(e,Te()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)o=t[n],r(o.value,{componentStack:o.stack,digest:o.digest});if(qs)throw qs=!1,e=Ga,Ga=null,e;return Js&1&&e.tag!==0&&Lr(),s=e.pendingLanes,s&1?e===Qa?xo++:(xo=0,Qa=e):xo=0,On(),null}function Lr(){if(Sn!==null){var e=zd(Js),t=Mt.transition,n=se;try{if(Mt.transition=null,se=16>e?16:e,Sn===null)var r=!1;else{if(e=Sn,Sn=null,Js=0,te&6)throw Error(b(331));var o=te;for(te|=4,$=e.current;$!==null;){var s=$,i=s.child;if($.flags&16){var l=s.deletions;if(l!==null){for(var a=0;a<l.length;a++){var d=l[a];for($=d;$!==null;){var h=$;switch(h.tag){case 0:case 11:case 15:vo(8,h,s)}var m=h.child;if(m!==null)m.return=h,$=m;else for(;$!==null;){h=$;var p=h.sibling,k=h.return;if(Hf(h),h===d){$=null;break}if(p!==null){p.return=k,$=p;break}$=k}}}var g=s.alternate;if(g!==null){var x=g.child;if(x!==null){g.child=null;do{var A=x.sibling;x.sibling=null,x=A}while(x!==null)}}$=s}}if(s.subtreeFlags&2064&&i!==null)i.return=s,$=i;else e:for(;$!==null;){if(s=$,s.flags&2048)switch(s.tag){case 0:case 11:case 15:vo(9,s,s.return)}var y=s.sibling;if(y!==null){y.return=s.return,$=y;break e}$=s.return}}var u=e.current;for($=u;$!==null;){i=$;var v=i.child;if(i.subtreeFlags&2064&&v!==null)v.return=i,$=v;else e:for(i=u;$!==null;){if(l=$,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:mi(9,l)}}catch(z){Ee(l,l.return,z)}if(l===i){$=null;break e}var j=l.sibling;if(j!==null){j.return=l.return,$=j;break e}$=l.return}}if(te=o,On(),Zt&&typeof Zt.onPostCommitFiberRoot=="function")try{Zt.onPostCommitFiberRoot(ai,e)}catch{}r=!0}return r}finally{se=n,Mt.transition=t}}return!1}function ju(e,t,n){t=Br(n,t),t=Lf(e,t,1),e=Nn(e,t,1),t=et(),e!==null&&(Vo(e,1,t),ct(e,t))}function Ee(e,t,n){if(e.tag===3)ju(e,e,n);else for(;t!==null;){if(t.tag===3){ju(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Pn===null||!Pn.has(r))){e=Br(n,e),e=If(t,e,1),t=Nn(t,e,1),e=et(),t!==null&&(Vo(t,1,e),ct(t,e));break}}t=t.return}}function Qm(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=et(),e.pingedLanes|=e.suspendedLanes&n,Re===e&&(Be&n)===n&&(Pe===4||Pe===3&&(Be&130023424)===Be&&500>Te()-Ul?Yn(e,0):Hl|=n),ct(e,t)}function eh(e,t){t===0&&(e.mode&1?(t=os,os<<=1,!(os&130023424)&&(os=4194304)):t=1);var n=et();e=sn(e,t),e!==null&&(Vo(e,t,n),ct(e,n))}function Ym(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),eh(e,n)}function Xm(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,o=e.memoizedState;o!==null&&(n=o.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(b(314))}r!==null&&r.delete(t),eh(e,n)}var th;th=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||at.current)it=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return it=!1,Om(e,t,n);it=!!(e.flags&131072)}else it=!1,ge&&t.flags&1048576&&of(t,Hs,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Ts(e,t),e=t.pendingProps;var o=Rr(t,Ge.current);zr(t,n),o=Ol(null,t,r,e,o,n);var s=$l();return t.flags|=1,typeof o=="object"&&o!==null&&typeof o.render=="function"&&o.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,lt(r)?(s=!0,Ws(t)):s=!1,t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,Ll(t),o.updater=pi,t.stateNode=o,o._reactInternals=t,Ra(t,r,e,n),t=Fa(null,t,r,!0,s,n)):(t.tag=0,ge&&s&&Tl(t),Je(null,t,o,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Ts(e,t),e=t.pendingProps,o=r._init,r=o(r._payload),t.type=r,o=t.tag=Jm(r),e=It(r,e),o){case 0:t=$a(null,t,r,e,n);break e;case 1:t=mu(null,t,r,e,n);break e;case 11:t=hu(null,t,r,e,n);break e;case 14:t=pu(null,t,r,It(r.type,e),n);break e}throw Error(b(306,r,""))}return t;case 0:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:It(r,o),$a(e,t,r,o,n);case 1:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:It(r,o),mu(e,t,r,o,n);case 3:e:{if(Of(t),e===null)throw Error(b(387));r=t.pendingProps,s=t.memoizedState,o=s.element,df(e,t),Zs(t,r,null,n);var i=t.memoizedState;if(r=i.element,s.isDehydrated)if(s={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){o=Br(Error(b(423)),t),t=gu(e,t,r,n,o);break e}else if(r!==o){o=Br(Error(b(424)),t),t=gu(e,t,r,n,o);break e}else for(pt=bn(t.stateNode.containerInfo.firstChild),mt=t,ge=!0,Rt=null,n=cf(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Or(),r===o){t=an(e,t,n);break e}Je(e,t,r,n)}t=t.child}return t;case 5:return ff(t),e===null&&Ia(t),r=t.type,o=t.pendingProps,s=e!==null?e.memoizedProps:null,i=o.children,Na(r,o)?i=null:s!==null&&Na(r,s)&&(t.flags|=32),Rf(e,t),Je(e,t,i,n),t.child;case 6:return e===null&&Ia(t),null;case 13:return $f(e,t,n);case 4:return Il(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=$r(t,null,r,n):Je(e,t,r,n),t.child;case 11:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:It(r,o),hu(e,t,r,o,n);case 7:return Je(e,t,t.pendingProps,n),t.child;case 8:return Je(e,t,t.pendingProps.children,n),t.child;case 12:return Je(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,o=t.pendingProps,s=t.memoizedProps,i=o.value,fe(Us,r._currentValue),r._currentValue=i,s!==null)if(Wt(s.value,i)){if(s.children===o.children&&!at.current){t=an(e,t,n);break e}}else for(s=t.child,s!==null&&(s.return=t);s!==null;){var l=s.dependencies;if(l!==null){i=s.child;for(var a=l.firstContext;a!==null;){if(a.context===r){if(s.tag===1){a=nn(-1,n&-n),a.tag=2;var d=s.updateQueue;if(d!==null){d=d.shared;var h=d.pending;h===null?a.next=a:(a.next=h.next,h.next=a),d.pending=a}}s.lanes|=n,a=s.alternate,a!==null&&(a.lanes|=n),Da(s.return,n,t),l.lanes|=n;break}a=a.next}}else if(s.tag===10)i=s.type===t.type?null:s.child;else if(s.tag===18){if(i=s.return,i===null)throw Error(b(341));i.lanes|=n,l=i.alternate,l!==null&&(l.lanes|=n),Da(i,n,t),i=s.sibling}else i=s.child;if(i!==null)i.return=s;else for(i=s;i!==null;){if(i===t){i=null;break}if(s=i.sibling,s!==null){s.return=i.return,i=s;break}i=i.return}s=i}Je(e,t,o.children,n),t=t.child}return t;case 9:return o=t.type,r=t.pendingProps.children,zr(t,n),o=bt(o),r=r(o),t.flags|=1,Je(e,t,r,n),t.child;case 14:return r=t.type,o=It(r,t.pendingProps),o=It(r.type,o),pu(e,t,r,o,n);case 15:return Df(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,o=t.pendingProps,o=t.elementType===r?o:It(r,o),Ts(e,t),t.tag=1,lt(r)?(e=!0,Ws(t)):e=!1,zr(t,n),zf(t,r,o),Ra(t,r,o,n),Fa(null,t,r,!0,e,n);case 19:return Ff(e,t,n);case 22:return _f(e,t,n)}throw Error(b(156,t.tag))};function nh(e,t){return bd(e,t)}function qm(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function jt(e,t,n,r){return new qm(e,t,n,r)}function Ql(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Jm(e){if(typeof e=="function")return Ql(e)?1:0;if(e!=null){if(e=e.$$typeof,e===pl)return 11;if(e===ml)return 14}return 2}function zn(e,t){var n=e.alternate;return n===null?(n=jt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Ns(e,t,n,r,o,s){var i=2;if(r=e,typeof e=="function")Ql(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case hr:return Xn(n.children,o,s,t);case hl:i=8,o|=8;break;case aa:return e=jt(12,n,t,o|2),e.elementType=aa,e.lanes=s,e;case la:return e=jt(13,n,t,o),e.elementType=la,e.lanes=s,e;case ca:return e=jt(19,n,t,o),e.elementType=ca,e.lanes=s,e;case dd:return yi(n,o,s,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case cd:i=10;break e;case ud:i=9;break e;case pl:i=11;break e;case ml:i=14;break e;case yn:i=16,r=null;break e}throw Error(b(130,e==null?e:typeof e,""))}return t=jt(i,n,t,o),t.elementType=e,t.type=r,t.lanes=s,t}function Xn(e,t,n,r){return e=jt(7,e,r,t),e.lanes=n,e}function yi(e,t,n,r){return e=jt(22,e,r,t),e.elementType=dd,e.lanes=n,e.stateNode={isHidden:!1},e}function Qi(e,t,n){return e=jt(6,e,null,t),e.lanes=n,e}function Yi(e,t,n){return t=jt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function eg(e,t,n,r,o){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Pi(0),this.expirationTimes=Pi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Pi(0),this.identifierPrefix=r,this.onRecoverableError=o,this.mutableSourceEagerHydrationData=null}function Yl(e,t,n,r,o,s,i,l,a){return e=new eg(e,t,n,l,a),t===1?(t=1,s===!0&&(t|=8)):t=0,s=jt(3,null,null,t),e.current=s,s.stateNode=e,s.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ll(s),e}function tg(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:fr,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function rh(e){if(!e)return In;e=e._reactInternals;e:{if(sr(e)!==e||e.tag!==1)throw Error(b(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(lt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(b(171))}if(e.tag===1){var n=e.type;if(lt(n))return nf(e,n,t)}return t}function oh(e,t,n,r,o,s,i,l,a){return e=Yl(n,r,!0,e,o,s,i,l,a),e.context=rh(null),n=e.current,r=et(),o=An(n),s=nn(r,o),s.callback=t??null,Nn(n,s,o),e.current.lanes=o,Vo(e,o,r),ct(e,r),e}function vi(e,t,n,r){var o=t.current,s=et(),i=An(o);return n=rh(n),t.context===null?t.context=n:t.pendingContext=n,t=nn(s,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=Nn(o,t,i),e!==null&&(Ft(e,o,i,s),Es(e,o,i)),i}function ti(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Tu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Xl(e,t){Tu(e,t),(e=e.alternate)&&Tu(e,t)}function ng(){return null}var sh=typeof reportError=="function"?reportError:function(e){console.error(e)};function ql(e){this._internalRoot=e}wi.prototype.render=ql.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(b(409));vi(e,t,null,null)};wi.prototype.unmount=ql.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;nr(function(){vi(null,e,null,null)}),t[on]=null}};function wi(e){this._internalRoot=e}wi.prototype.unstable_scheduleHydration=function(e){if(e){var t=Dd();e={blockedOn:null,target:e,priority:t};for(var n=0;n<wn.length&&t!==0&&t<wn[n].priority;n++);wn.splice(n,0,e),n===0&&Rd(e)}};function Jl(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function xi(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Mu(){}function rg(e,t,n,r,o){if(o){if(typeof r=="function"){var s=r;r=function(){var d=ti(i);s.call(d)}}var i=oh(t,r,e,0,null,!1,!1,"",Mu);return e._reactRootContainer=i,e[on]=i.current,No(e.nodeType===8?e.parentNode:e),nr(),i}for(;o=e.lastChild;)e.removeChild(o);if(typeof r=="function"){var l=r;r=function(){var d=ti(a);l.call(d)}}var a=Yl(e,0,!1,null,null,!1,!1,"",Mu);return e._reactRootContainer=a,e[on]=a.current,No(e.nodeType===8?e.parentNode:e),nr(function(){vi(t,a,n,r)}),a}function ki(e,t,n,r,o){var s=n._reactRootContainer;if(s){var i=s;if(typeof o=="function"){var l=o;o=function(){var a=ti(i);l.call(a)}}vi(t,i,e,o)}else i=rg(n,t,e,o,r);return ti(i)}Ld=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=co(t.pendingLanes);n!==0&&(vl(t,n|1),ct(t,Te()),!(te&6)&&(Wr=Te()+500,On()))}break;case 13:nr(function(){var r=sn(e,1);if(r!==null){var o=et();Ft(r,e,1,o)}}),Xl(e,1)}};wl=function(e){if(e.tag===13){var t=sn(e,134217728);if(t!==null){var n=et();Ft(t,e,134217728,n)}Xl(e,134217728)}};Id=function(e){if(e.tag===13){var t=An(e),n=sn(e,t);if(n!==null){var r=et();Ft(n,e,t,r)}Xl(e,t)}};Dd=function(){return se};_d=function(e,t){var n=se;try{return se=e,t()}finally{se=n}};wa=function(e,t,n){switch(t){case"input":if(fa(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var o=di(r);if(!o)throw Error(b(90));hd(r),fa(r,o)}}}break;case"textarea":md(e,n);break;case"select":t=n.value,t!=null&&br(e,!!n.multiple,t,!1)}};Sd=Kl;Ed=nr;var og={usingClientEntryPoint:!1,Events:[Uo,yr,di,xd,kd,Kl]},so={findFiberByHostInstance:Un,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},sg={bundleType:so.bundleType,version:so.version,rendererPackageName:so.rendererPackageName,rendererConfig:so.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:cn.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Td(e),e===null?null:e.stateNode},findFiberByHostInstance:so.findFiberByHostInstance||ng,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ms=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ms.isDisabled&&ms.supportsFiber)try{ai=ms.inject(sg),Zt=ms}catch{}}yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=og;yt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Jl(t))throw Error(b(200));return tg(e,t,null,n)};yt.createRoot=function(e,t){if(!Jl(e))throw Error(b(299));var n=!1,r="",o=sh;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),t=Yl(e,1,!1,null,null,n,!1,r,o),e[on]=t.current,No(e.nodeType===8?e.parentNode:e),new ql(t)};yt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(b(188)):(e=Object.keys(e).join(","),Error(b(268,e)));return e=Td(t),e=e===null?null:e.stateNode,e};yt.flushSync=function(e){return nr(e)};yt.hydrate=function(e,t,n){if(!xi(t))throw Error(b(200));return ki(null,e,t,!0,n)};yt.hydrateRoot=function(e,t,n){if(!Jl(e))throw Error(b(405));var r=n!=null&&n.hydratedSources||null,o=!1,s="",i=sh;if(n!=null&&(n.unstable_strictMode===!0&&(o=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=oh(t,null,e,1,n??null,o,!1,s,i),e[on]=t.current,No(e),r)for(e=0;e<r.length;e++)n=r[e],o=n._getVersion,o=o(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,o]:t.mutableSourceEagerHydrationData.push(n,o);return new wi(t)};yt.render=function(e,t,n){if(!xi(t))throw Error(b(200));return ki(null,e,t,!1,n)};yt.unmountComponentAtNode=function(e){if(!xi(e))throw Error(b(40));return e._reactRootContainer?(nr(function(){ki(null,null,e,!1,function(){e._reactRootContainer=null,e[on]=null})}),!0):!1};yt.unstable_batchedUpdates=Kl;yt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!xi(n))throw Error(b(200));if(e==null||e._reactInternals===void 0)throw Error(b(38));return ki(e,t,n,!1,r)};yt.version="18.3.1-next-f1338f8080-20240426";function ih(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ih)}catch(e){console.error(e)}}ih(),sd.exports=yt;var ah=sd.exports;const Oy=Zu(ah);var lh,bu=ah;lh=bu.createRoot,bu.hydrateRoot;const ig="modulepreload",ag=function(e,t){return new URL(e,t).href},Nu={},ch=function(t,n,r){let o=Promise.resolve();if(n&&n.length>0){const i=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),a=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));o=Promise.allSettled(n.map(d=>{if(d=ag(d,r),d in Nu)return;Nu[d]=!0;const h=d.endsWith(".css"),m=h?'[rel="stylesheet"]':"";if(!!r)for(let g=i.length-1;g>=0;g--){const x=i[g];if(x.href===d&&(!h||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const k=document.createElement("link");if(k.rel=h?"stylesheet":ig,h||(k.as="script"),k.crossOrigin="",k.href=d,a&&k.setAttribute("nonce",a),document.head.appendChild(k),h)return new Promise((g,x)=>{k.addEventListener("load",g),k.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(i){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=i,window.dispatchEvent(l),!l.defaultPrevented)throw i}return o.then(i=>{for(const l of i||[])l.status==="rejected"&&s(l.reason);return t().catch(s)})},Ce=32,Pu=.82,lg=Math.cos(Math.PI/6),cg=.5,ug=new Set(["area","circleArea","text"]);function Kt(e){return ug.has(e.kind)?!0:e.kind==="image"?e.imageStyle==="flat":!1}function ec(e,t,n){switch(n){case 1:return{x:-t,y:e};case 2:return{x:-e,y:-t};case 3:return{x:t,y:-e};default:return{x:e,y:t}}}class Oo{constructor(t,n){this.mode=t,this.rotation=n}project(t,n,r=0){if(this.mode==="2d")return{x:t*Ce,y:n*Ce};const o=ec(t,n,this.rotation);return{x:(o.x-o.y)*Ce*lg,y:(o.x+o.y)*Ce*cg-r*Ce*Pu}}groundMatrix(t=0){const n=this.project(0,0,t),r=this.project(1,0,t),o=this.project(0,1,t);return[r.x-n.x,r.y-n.y,o.x-n.x,o.y-n.y,n.x,n.y]}unproject(t,n,r=0){const[o,s,i,l,a,d]=this.groundMatrix(r),h=o*l-s*i,m=t-a,p=n-d;return{x:(l*m-i*p)/h,y:(-s*m+o*p)/h}}get heightScale(){return this.mode==="2d"?0:Ce*Pu}}function dg(e){const t=e.project(0,0),n=[{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}];let r=0,o=-1/0,s=-1/0;return n.forEach((i,l)=>{const a=e.project(i.x,i.y),d=a.x-t.x,h=a.y-t.y;(d>o+1e-6||Math.abs(d-o)<=1e-6&&h>s)&&(r=l,o=d,s=h)}),r}function fg(e){const t=e.project(0,0),n=e.project(1,0),r=n.x-t.x,o=n.y-t.y;return r<-1e-6||Math.abs(r)<=1e-6&&o<0?2:0}function hg(e){return`matrix(${e.map(t=>+t.toFixed(5)).join(" ")})`}function Au(e,t,n=0){const r=e.x+e.w/2,o=e.y+e.d/2,s=[];for(let i=0;i<t;i++){const l=n+i/t*Math.PI*2;s.push({x:r+Math.cos(l)*e.w/2,y:o+Math.sin(l)*e.d/2})}return s}function $o(e){return[{x:e.x,y:e.y},{x:e.x+e.w,y:e.y},{x:e.x+e.w,y:e.y+e.d},{x:e.x,y:e.y+e.d}]}function Fe(e){switch(e.kind){case"cylinder":case"cone":case"circleArea":case"sphere":return Au(e,40);case"hexagon":return Au(e,6);default:return $o(e)}}function Xi(e){let t=0;for(let n=0;n<e.length;n++){const r=e[n],o=e[(n+1)%e.length];t+=r.x*o.y-o.x*r.y}return t/2}function zu(e,t,n,r){const o=ec(t,n,e.rotation),s=Math.hypot(o.x,o.y,r)||1,l=.74+.12*((o.y-o.x)/Math.SQRT2/s);return l+(1-l)*Math.max(0,r/s)*.75}function pg(e,t){const n=Fe(e),r=e.z,o=e.z+Math.max(0,e.h),s=e.x+e.w/2,i=e.y+e.d/2,l=n.map(h=>t.project(h.x,h.y,o)),a=Math.sign(Xi(l))||1,d=[];if(e.kind==="pyramid"||e.kind==="cone"){const h=t.project(s,i,o),m=n.map(p=>t.project(p.x,p.y,r));t.mode==="2d"&&d.push({points:m,light:.9});for(let p=0;p<n.length;p++){const k=(p+1)%n.length,g=[m[p],m[k],h],x=Xi(g);if(Math.sign(x)!==a||Math.abs(x)<.01)continue;const A=n[k].x-n[p].x;let u=n[k].y-n[p].y,v=-A;const j=(n[p].x+n[k].x)/2-s,z=(n[p].y+n[k].y)/2-i;u*j+v*z<0&&(u=-u,v=-v);const R=Math.hypot(j,z)||1,L=Math.hypot(u,v)||1,F=R/Math.max(.01,o-r);d.push({points:g,light:zu(t,u/L,v/L,F)})}return d}for(let h=0;h<n.length;h++){const m=(h+1)%n.length,p=[t.project(n[h].x,n[h].y,r),t.project(n[m].x,n[m].y,r),t.project(n[m].x,n[m].y,o),t.project(n[h].x,n[h].y,o)],k=Xi(p);if(Math.sign(k)!==a||Math.abs(k)<.01)continue;const g=n[m].x-n[h].x;let A=n[m].y-n[h].y,y=-g;A*((n[h].x+n[m].x)/2-s)+y*((n[h].y+n[m].y)/2-i)<0&&(A=-A,y=-y),d.push({points:p,light:zu(t,A,y,0)})}return d.push({points:l,light:1}),d}function uh(e){const t=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim());if(!t)return null;let n=t[1];return n.length===3&&(n=n.split("").map(r=>r+r).join("")),[parseInt(n.slice(0,2),16),parseInt(n.slice(2,4),16),parseInt(n.slice(4,6),16)]}function Dn(e,t){const n=uh(e);return n?`#${n.map(o=>{const s=t<=1?o*t:o+(255-o)*(t-1);return Math.max(0,Math.min(255,Math.round(s)))}).map(o=>o.toString(16).padStart(2,"0")).join("")}`:e}function mg(e){const t=uh(e);if(!t)return"#1f2937";const[n,r,o]=t;return .299*n+.587*r+.114*o>160?"#1f2937":"#ffffff"}function gg(e,t){const n=$o(e).map(s=>ec(s.x,s.y,t)),r=n.map(s=>s.x),o=n.map(s=>s.y);return{minX:Math.min(...r),maxX:Math.max(...r),minY:Math.min(...o),maxY:Math.max(...o),minZ:e.z,maxZ:e.z+(Kt(e)?0:Math.max(.01,e.h))}}const Vn=1e-6;function yg(e,t){return e.maxX<=t.minX+Vn?!0:t.maxX<=e.minX+Vn?!1:e.maxY<=t.minY+Vn?!0:t.maxY<=e.minY+Vn?!1:e.maxZ<=t.minZ+Vn?!0:t.maxZ<=e.minZ+Vn?!1:null}function vg(e,t){if(t.mode==="2d")return e.map((h,m)=>({n:h,i:m})).sort((h,m)=>h.n.z+h.n.h-(m.n.z+m.n.h)||h.i-m.i).map(h=>h.n);const n=e.map(h=>gg(h,t.rotation)),r=e.length,o=e.map(()=>[]),s=new Array(r).fill(0);for(let h=0;h<r;h++)for(let m=h+1;m<r;m++){const p=yg(n[h],n[m]);if(p===null)continue;const[k,g]=p?[h,m]:[m,h];o[k].push(g),s[g]++}const i=h=>(n[h].minX+n[h].maxX+n[h].minY+n[h].maxY)/2+n[h].minZ*.01,l=[...Array(r).keys()].filter(h=>s[h]===0),a=[],d=new Array(r).fill(!1);for(;a.length<r;){if(l.length===0){let m=-1;for(let p=0;p<r;p++)!d[p]&&(m<0||i(p)<i(m))&&(m=p);l.push(m),s[m]=0}l.sort((m,p)=>i(m)-i(p));const h=l.shift();if(!d[h]){d[h]=!0,a.push(h);for(const m of o[h])--s[m]===0&&!d[m]&&l.push(m)}}return a.map(h=>e[h])}function Ae(e){return{x:e.x+e.w/2,y:e.y+e.d/2}}function Lu(e,t,n,r=.15){const o=n.x-r,s=n.x+n.w+r,i=n.y-r,l=n.y+n.d+r,a=t.x-e.x,d=t.y-e.y;let h=0,m=1;const p=(k,g)=>{if(Math.abs(k)<Vn)return g>=0;const x=g/k;return k<0?h=Math.max(h,x):m=Math.min(m,x),!0};return p(-a,e.x-o)&&p(a,s-e.x)&&p(-d,e.y-i)&&p(d,l-e.y)&&h<=m?{x:e.x+a*h,y:e.y+d*h}:t}function Dt(e,t){return t>0?Math.round(e/t)*t:e}function Ot(e){return e.map(t=>`${+t.x.toFixed(2)},${+t.y.toFixed(2)}`).join(" ")}let qi=0;function Cr(e="n"){return qi=(qi+1)%1e6,`${e}_${Date.now().toString(36)}${qi.toString(36)}${Math.random().toString(36).slice(2,6)}`}const ln=e=>e.kind==="area"||e.kind==="circleArea",Hn=1e-6;function Iu(e,t){if(e.kind==="circleArea"){const n=(t.x-(e.x+e.w/2))/(e.w/2),r=(t.y-(e.y+e.d/2))/(e.d/2);return n*n+r*r<=1+Hn}return t.x>=e.x-Hn&&t.x<=e.x+e.w+Hn&&t.y>=e.y-Hn&&t.y<=e.y+e.d+Hn}function wg(e,t){return e.id===t.id||!ln(e)||e.z>t.z+Hn?!1:ln(t)?e.w*e.d<=t.w*t.d+Hn?!1:$o(t).every(n=>Iu(e,n)):Iu(e,Ae(t))}function En(e,t,n){let r;for(const o of t)n!=null&&n.has(o.id)||!wg(o,e)||(!r||o.w*o.d<r.w*r.d)&&(r=o);return r}function tc(e){const t=new Map;for(const n of e){const r=En(n,e);r&&t.set(n.id,r.id)}return t}function jr(e,t,n=tc(t)){const r=new Map;for(const[i,l]of n)r.has(l)||r.set(l,[]),r.get(l).push(i);const o=new Set,s=[...e];for(;s.length;)for(const i of r.get(s.pop())??[])o.has(i)||(o.add(i),s.push(i));return o}function xg(e,t=tc(e)){const n=new Map,r=o=>{const s=n.get(o);if(s!==void 0)return s;const i=t.get(o),l=i?r(i)+1:0;return n.set(o,l),l};return e.forEach(o=>r(o.id)),n}function Du(e,t=1){const n=Math.floor((Math.min(...e.map(i=>i.x))-t)*2)/2,r=Math.floor((Math.min(...e.map(i=>i.y))-t)*2)/2,o=Math.ceil((Math.max(...e.map(i=>i.x+i.w))+t)*2)/2,s=Math.ceil((Math.max(...e.map(i=>i.y+i.d))+t)*2)/2;return{x:n,y:r,w:o-n,d:s-r}}const dh=[{kind:"block",name:"Block",defaults:{w:2,d:2,h:1,color:"#4f8cf7"}},{kind:"cylinder",name:"Cylinder",defaults:{w:2,d:2,h:1.5,color:"#3fb27f"}},{kind:"hexagon",name:"Hexagon",defaults:{w:2,d:2,h:1,color:"#f2a93b"}},{kind:"pyramid",name:"Pyramid",defaults:{w:2,d:2,h:1.5,color:"#e5534b"}},{kind:"cone",name:"Cone",defaults:{w:2,d:2,h:2,color:"#a371f7"}},{kind:"sphere",name:"Sphere",defaults:{w:2,d:2,h:2,color:"#39c5cf"}},{kind:"area",name:"Area",defaults:{w:6,d:4,h:0,color:"#4f8cf7",opacity:.18}},{kind:"circleArea",name:"Circle area",defaults:{w:4,d:4,h:0,color:"#3fb27f",opacity:.2}},{kind:"text",name:"Text",defaults:{w:4,d:1,h:0,color:"#1f2937",text:"Text",fontSize:.7}}],kg=["#4f8cf7","#3fb27f","#f2a93b","#e5534b","#a371f7","#39c5cf","#ed7100","#c925d1","#7aa116","#dd344c","#8c4fff","#232f3e","#64748b","#ffffff"];function Ps(e,t,n,r={}){var l;const o=((l=dh.find(a=>a.kind===e))==null?void 0:l.defaults)??{},s=r.w??o.w??2,i=r.d??o.d??2;return{id:Cr("n"),kind:e,h:1,z:0,color:"#4f8cf7",...o,...r,w:s,d:i,x:Math.round(t-s/2),y:Math.round(n-i/2)}}function Sg(e,t,n,r){return Ps("image",n,r,{w:2,d:2,h:.35,src:e,label:t,color:"#ffffff",imageStyle:"tile"})}function Eg(e,t,n={}){return{id:Cr("e"),from:e,to:t,color:"#475569",width:2,routing:"orthogonal",rounded:!0,lineStyle:"solid",endMarker:"arrow",...n}}const Cg=["color","width","routing","rounded","lineStyle","startMarker","endMarker","animation","animationDirection","animationSpeed","animationColor"];function jg(e){const{dashed:t,arrowStart:n,arrowEnd:r,...o}=e;return{...o,lineStyle:e.lineStyle??(t?"dashed":"solid"),startMarker:e.startMarker??(n?"arrow":"none"),endMarker:e.endMarker??(r?"arrow":"none")}}const qa=()=>({version:1,nodes:[],edges:[]});function Tg(e){const t=e;if(!t||!Array.isArray(t.nodes)||!Array.isArray(t.edges))throw new Error("Not an IsoDraw diagram: expected { nodes: [], edges: [] }");const n=new Set(t.nodes.map(r=>r.id));return{version:1,nodes:t.nodes.map(r=>({...r,z:r.z??0,h:r.h??0})),edges:t.edges.filter(r=>n.has(r.from)&&n.has(r.to)).map(jg),...typeof t.doc=="string"?{doc:t.doc}:{},...t.view==="2d"||t.view==="3d"?{view:t.view}:{}}}const Ir={block:"Block",cylinder:"Cylinder",hexagon:"Hexagon",pyramid:"Pyramid",cone:"Cone",sphere:"Sphere",area:"Area",circleArea:"Circle area",text:"Text",image:"Image"},Ja="isodraw:",Ct=e=>!!e&&e.trim().length>0,Mg=(e,t)=>e.kind===t.kind&&(e.kind==="diagram"||e.id===t.id),Dr=e=>e.kind==="diagram"?"diagram":`${e.kind}/${e.id}`;function bg(e){if(!e.startsWith(Ja))return null;const t=e.slice(Ja.length);if(t==="diagram")return{kind:"diagram"};const n=/^(node|edge)\/(.+)$/.exec(t);return n?{kind:n[1],id:decodeURIComponent(n[2])}:null}function Fo(e){var t,n,r;return((t=e.label)==null?void 0:t.trim())||(e.kind==="text"?(r=(n=e.text)==null?void 0:n.split(`
`)[0])==null?void 0:r.trim():"")||Ir[e.kind]}function nc(e,t){var s;const n=t.find(i=>i.id===e.from),r=t.find(i=>i.id===e.to),o=`${n?Fo(n):"?"} → ${r?Fo(r):"?"}`;return(s=e.label)!=null&&s.trim()?`${e.label.trim()} (${o})`:o}function $y(e,t){if(e.kind==="diagram")return"Diagram";if(e.kind==="node"){const r=t.nodes.find(o=>o.id===e.id);return r?Fo(r):"Missing item"}const n=t.edges.find(r=>r.id===e.id);return n?nc(n,t.nodes):"Missing connection"}function Fy(e,t){return e.kind==="diagram"?!0:e.kind==="node"?t.nodes.some(n=>n.id===e.id):t.edges.some(n=>n.id===e.id)}function By(e,t){var n,r;return e.kind==="diagram"?t.doc??"":e.kind==="node"?((n=t.nodes.find(o=>o.id===e.id))==null?void 0:n.doc)??"":((r=t.edges.find(o=>o.id===e.id))==null?void 0:r.doc)??""}function Ng(e,t,n){const r=Ct(n)?n:void 0;return t.kind==="diagram"?{...e,doc:r}:t.kind==="node"?{...e,nodes:e.nodes.map(o=>o.id===t.id?{...o,doc:r}:o)}:{...e,edges:e.edges.map(o=>o.id===t.id?{...o,doc:r}:o)}}function Wy(e,t){const n=[{kind:"diagram"}];if(e.kind!=="node")return n;const r=t.nodes.find(i=>i.id===e.id),o=[];let s=r&&En(r,t.nodes);for(;s;)o.unshift({kind:"node",id:s.id}),s=En(s,t.nodes);return[...n,...o]}function Vy(e){return[...e.nodes.map(t=>({target:{kind:"node",id:t.id},title:Fo(t),kind:Ir[t.kind]})),...e.edges.map(t=>({target:{kind:"edge",id:t.id},title:nc(t,e.nodes),kind:"Connection"}))]}const Ji=e=>Dr(e).replace("/","-");function Pg(e,t="Architecture"){const n=tc(e.nodes),r=new Map;for(const m of e.nodes){const p=n.get(m.id);r.has(p)||r.set(p,[]),r.get(p).push(m)}const o=m=>Ct(m.doc)||(r.get(m.id)??[]).some(o),s=new Set([...e.nodes.filter(o).map(m=>Dr({kind:"node",id:m.id})),...e.edges.filter(m=>Ct(m.doc)).map(m=>Dr({kind:"edge",id:m.id}))]),i=m=>m.replace(/\[@((?:\\.|[^\]])*)\]\(isodraw:([^)]+)\)/g,(p,k,g)=>{const x=bg(Ja+g);return x&&s.has(Dr(x))?`[@${k}](#${Ji(x)})`:`**@${k}**`}),l=(m,p)=>{const k=[...m.matchAll(/^(#{1,6})\s/gm)].map(x=>x[1].length);if(!k.length)return m;const g=Math.max(0,p+1-Math.min(...k));return m.replace(/^(#{1,6})(?=\s)/gm,x=>"#".repeat(Math.min(6,x.length+g)))},a=[`# ${t}`,""];Ct(e.doc)&&a.push(i(l(e.doc.trim(),1)),"");const d=(m,p)=>{const k=[...m.filter(ln),...m.filter(g=>!ln(g))];for(const g of k){if(!o(g))continue;const x={kind:"node",id:g.id};a.push(`<a id="${Ji(x)}"></a>`,"",`${"#".repeat(Math.min(6,p))} ${Fo(g)}`,""),a.push(`_${Ir[g.kind]}_`,""),Ct(g.doc)&&a.push(i(l(g.doc.trim(),p)),""),d(r.get(g.id)??[],p+1)}};d(r.get(void 0)??[],2);const h=e.edges.filter(m=>Ct(m.doc));if(h.length){a.push("## Connections","");for(const m of h){const p={kind:"edge",id:m.id};a.push(`<a id="${Ji(p)}"></a>`,"",`### ${nc(m,e.nodes)}`,"",i(l(m.doc.trim(),3)),"")}}return`${a.join(`
`).replace(/\n{3,}/g,`

`).trim()}
`}function Hy(e,t){const n=new Set([t,...jr([t],e.nodes)]);return{version:1,...e.view?{view:e.view}:{},nodes:e.nodes.filter(r=>n.has(r.id)),edges:e.edges.filter(r=>n.has(r.from)&&n.has(r.to))}}const rc=P.createContext("light"),_u="(prefers-color-scheme: dark)";function oc(e){const t=P.useContext(rc),[n,r]=P.useState(()=>{var o;return typeof window<"u"&&!!((o=window.matchMedia)!=null&&o.call(window,_u).matches)});return P.useEffect(()=>{if(e!=="system"||!window.matchMedia)return;const o=window.matchMedia(_u),s=()=>r(o.matches);return s(),o.addEventListener("change",s),()=>o.removeEventListener("change",s)},[e]),e==="system"?n?"dark":"light":e??t}const Ag={light:"#f4f7fb",dark:"#0b1220"},Bo={light:{text:"#1f2937",halo:"#ffffff",chip:"#ffffff"},dark:{text:"#e2e8f0",halo:"#0b1220",chip:"#1e293b"}};function zg(e){const t=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim());if(!t)return null;const n=t[1].length===3?[...t[1]].map(r=>r+r).join(""):t[1];return[0,2,4].map(r=>parseInt(n.slice(r,r+2),16)/255)}const Lg=e=>Math.round(Math.min(1,Math.max(0,e))*255).toString(16).padStart(2,"0");function gs(e,t){if(t==="light")return e;const n=zg(e);if(!n)return e;const r=Math.max(...n),o=Math.min(...n),s=(r+o)/2;if(s>=.5||r-o>.2)return e;const i=1-2*s;return`#${n.map(l=>Lg(l+i)).join("")}`}function Ig(e,t){return t==="light"?e:{...e,nodes:e.nodes.map(n=>({...n,...n.kind==="text"?{color:gs(n.color,t)}:{},...n.labelColor?{labelColor:gs(n.labelColor,t)}:{}})),edges:e.edges.map(n=>({...n,color:gs(n.color,t),...n.animationColor?{animationColor:gs(n.animationColor,t)}:{}}))}}const Si=()=>P.useContext(rc),ni={n:{x:0,y:-1},e:{x:1,y:0},s:{x:0,y:1},w:{x:-1,y:0}},fh=["n","e","s","w"],Dg=.12,rr=.6,Bt=1e-6,Ru=new Set(["cylinder","cone","circleArea","sphere"]),ri=(e,t,n)=>Math.min(n,Math.max(t,e)),el=e=>Math.abs(e.x)>Math.abs(e.y)?"x":"y",_g=(e,t)=>Math.abs(e.x-t.x)<Bt||Math.abs(e.y-t.y)<Bt,Tt=(e,t,n=1)=>({x:e.x+t.x*n,y:e.y+t.y*n}),hh=e=>e.lineStyle??(e.dashed?"dashed":"solid"),ph=e=>e.startMarker??(e.arrowStart?"arrow":"none"),mh=e=>e.endMarker??(e.arrowEnd?"arrow":"none");function Tr(e,t,n=Dg){const r=ri(t.t,0,1),o=e.x+e.w/2,s=e.y+e.d/2;let i;if(t.side==="n"||t.side==="s"){const l=e.x+r*e.w;let a=t.side==="n"?e.y:e.y+e.d;if(Ru.has(e.kind)){const d=(l-o)/(e.w/2);a=s+(t.side==="n"?-1:1)*(e.d/2)*Math.sqrt(Math.max(0,1-d*d))}i={x:l,y:a}}else{const l=e.y+r*e.d;let a=t.side==="w"?e.x:e.x+e.w;if(Ru.has(e.kind)){const d=(l-s)/(e.d/2);a=o+(t.side==="w"?-1:1)*(e.w/2)*Math.sqrt(Math.max(0,1-d*d))}i={x:a,y:l}}return Tt(i,ni[t.side],n)}function oi(e,t,n){return ri(t==="e"||t==="w"?(n-e.y)/e.d:(n-e.x)/e.w,0,1)}function Rg(e,t){const n={n:Math.abs(t.y-e.y),s:Math.abs(t.y-(e.y+e.d)),w:Math.abs(t.x-e.x),e:Math.abs(t.x-(e.x+e.w))},r=fh.reduce((s,i)=>n[i]<n[s]?i:s,"n"),o=Dt(r==="e"||r==="w"?t.y:t.x,.25);return{side:r,t:oi(e,r,o)}}function tl(e,t){const n=Ae(e),r=(t.x-n.x)/Math.max(e.w,Bt),o=(t.y-n.y)/Math.max(e.d,Bt),s=Math.abs(r)>=Math.abs(o)?r>0?"e":"w":o>0?"s":"n",i=s==="e"||s==="w"?t.y:t.x,l=oi(e,s,i);return{side:s,t:l>0&&l<1?l:.5}}function Og(e,t){const n=Ae(e),r=Ae(t),o=r.x-n.x,s=r.y-n.y,i=Math.max(t.x-(e.x+e.w),e.x-(t.x+t.w)),l=Math.max(t.y-(e.y+e.d),e.y-(t.y+t.d));return(i>0||l>0?i>=l:Math.abs(o)>=Math.abs(s))?[{side:o>0?"e":"w",t:.5},{side:o>0?"w":"e",t:.5}]:[{side:s>0?"s":"n",t:.5},{side:s>0?"n":"s",t:.5}]}function si(e){const t=[];for(const n of e){const r=t[t.length-1];r&&Math.abs(r.x-n.x)<Bt&&Math.abs(r.y-n.y)<Bt||t.push(n)}for(let n=1;n<t.length-1;){const r=t[n-1],o=t[n],s=t[n+1],i=(o.x-r.x)*(s.y-o.y)-(o.y-r.y)*(s.x-o.x);Math.abs(i)<Bt?t.splice(n,1):n++}return t}function gh(e,t,n){const r=[e[0]];let o=t;for(let s=1;s<e.length;s++){const i=r[r.length-1],l=e[s];if(!_g(i,l)){const d=s===e.length-1&&n;let h;d?h=n==="x"?{x:i.x,y:l.y}:{x:l.x,y:i.y}:h=o==="x"?{x:l.x,y:i.y}:{x:i.x,y:l.y},r.push(h)}const a=r[r.length-1];Math.abs(l.x-a.x)>Bt?o="x":Math.abs(l.y-a.y)>Bt&&(o="y"),r.push(l)}return r}function $g(e,t,n,r){const o=Tt(e,t,rr),s=Tt(n,r,rr),i=t.x!==0,l=r.x!==0;if(i&&l){if(t.x===-r.x){if((s.x-o.x)*t.x>=0){const m=(o.x+s.x)/2;return[e,o,{x:m,y:o.y},{x:m,y:s.y},s,n]}const h=(o.y+s.y)/2;return[e,o,{x:o.x,y:h},{x:s.x,y:h},s,n]}const d=t.x>0?Math.max(o.x,s.x):Math.min(o.x,s.x);return[e,{x:d,y:e.y},{x:d,y:n.y},n]}if(!i&&!l){if(t.y===-r.y){if((s.y-o.y)*t.y>=0){const m=(o.y+s.y)/2;return[e,o,{x:o.x,y:m},{x:s.x,y:m},s,n]}const h=(o.x+s.x)/2;return[e,o,{x:h,y:o.y},{x:h,y:s.y},s,n]}const d=t.y>0?Math.max(o.y,s.y):Math.min(o.y,s.y);return[e,{x:e.x,y:d},{x:n.x,y:d},n]}return i?(s.x-o.x)*t.x>=0&&(s.y-o.y)*-r.y>=0?[e,o,{x:s.x,y:o.y},s,n]:[e,o,{x:o.x,y:s.y},s,n]:(s.y-o.y)*t.y>=0&&(s.x-o.x)*-r.x>=0?[e,o,{x:o.x,y:s.y},s,n]:[e,o,{x:s.x,y:o.y},s,n]}function Fg(e,t,n,r,o){if(!o.length)return si($g(e,t,n,r));const s=Tt(e,t,rr),i=Tt(n,r,rr),l=gh([e,s,...o,i],el(t),el(r));return l.push(n),si(l)}function Bg(e,t,n){if(t===n)return e.map(()=>t);const r=e.slice(1).map((i,l)=>Math.hypot(i.x-e[l].x,i.y-e[l].y)),o=r.reduce((i,l)=>i+l,0)||1;let s=0;return e.map((i,l)=>(l>0&&(s+=r[l-1]),t+(n-t)*(s/o)))}function nl(e,t,n){const r=e.waypoints??[],o=Og(t,n),s=e.fromAnchor??(r.length?tl(t,r[0]):o[0]),i=e.toAnchor??(r.length?tl(n,r[r.length-1]):o[1]),l=ni[s.side],a=ni[i.side];let d;if(e.routing==="orthogonal")d=Fg(Tr(t,s),l,Tr(n,i),a,r);else if(e.routing==="straight"&&!e.fromAnchor&&!e.toAnchor){const h=Ae(t),m=Ae(n),p=r[0]??m,k=r[r.length-1]??h;d=[Lu(p,h,t),...r,Lu(k,m,n)]}else d=[Tr(t,s),...r,Tr(n,i)];return{pts:d,zs:Bg(d,t.z,n.z),from:s,to:i,aDir:l,bDir:a}}function yh(e,t,n,r){const o=(l,a)=>{const d=r.project(l.x,l.y,a);return`${d.x.toFixed(2)},${d.y.toFixed(2)}`},{pts:s,zs:i}=e;if(t==="curved"){if(s.length===2){const[a,d]=s,h=ri(Math.hypot(d.x-a.x,d.y-a.y)*.45,.8,5),m=(i[0]+i[1])/2;return`M${o(a,i[0])} C${o(Tt(a,e.aDir,h),m)} ${o(Tt(d,e.bDir,h),m)} ${o(d,i[1])}`}let l=`M${o(s[0],i[0])}`;for(let a=0;a<s.length-1;a++){const d=s[a-1]??Tt(s[0],e.aDir,-1),h=s[a],m=s[a+1],p=s[a+2]??Tt(s[s.length-1],e.bDir,-1),k={x:h.x+(m.x-d.x)/6,y:h.y+(m.y-d.y)/6},g={x:m.x-(p.x-h.x)/6,y:m.y-(p.y-h.y)/6};l+=` C${o(k,i[a])} ${o(g,i[a+1])} ${o(m,i[a+1])}`}return l}if(t==="orthogonal"&&n&&s.length>2){let l=`M${o(s[0],i[0])}`;for(let a=1;a<s.length-1;a++){const d=s[a-1],h=s[a],m=s[a+1],p=Math.hypot(h.x-d.x,h.y-d.y),k=Math.hypot(m.x-h.x,m.y-h.y),g=Math.min(.4,p/2,k/2),x={x:h.x-(h.x-d.x)/(p||1)*g,y:h.y-(h.y-d.y)/(p||1)*g},A={x:h.x+(m.x-h.x)/(k||1)*g,y:h.y+(m.y-h.y)/(k||1)*g};l+=` L${o(x,i[a])} Q${o(h,i[a])} ${o(A,i[a])}`}return`${l} L${o(s[s.length-1],i[i.length-1])}`}return`M${s.map((l,a)=>o(l,i[a])).join(" L")}`}function rl(e,t){if(e.length<3)return e;const n=e[0],r=e[e.length-1],o=Math.hypot(r.x-n.x,r.y-n.y)||Bt;let s=0,i=0;for(let l=1;l<e.length-1;l++){const a=e[l],d=Math.abs((r.x-n.x)*(n.y-a.y)-(n.x-a.x)*(r.y-n.y))/o;d>s&&(s=d,i=l)}return s<=t?[n,r]:[...rl(e.slice(0,i+1),t).slice(0,-1),...rl(e.slice(i),t)]}function Ou(e,t,n=.25){return t.x>=e.x-n&&t.x<=e.x+e.w+n&&t.y>=e.y-n&&t.y<=e.y+e.d+n}function $u(e,t,n,r){const o=e.slice();for(;o.length&&Ou(t,o[0]);)o.shift();if(r)for(;o.length&&Ou(r,o[o.length-1]);)o.pop();const s=n?{fromAnchor:{side:n,t:.5}}:{};if(o.length<2)return{...s,waypoints:[]};const i=[],l=rl(o,.45);for(let g=1;g<l.length;g++){const x=l[g-1],A=l[g],y=A.x-x.x,u=A.y-x.y,v=Math.hypot(y,u);if(v<.35)continue;const j=Math.abs(y)>=Math.abs(u)?"x":"y",z=j==="x"?(x.y+A.y)/2:(x.x+A.x)/2,R=j==="x"?y:u,L=i[i.length-1];L&&L.axis===j?(L.level=(L.level*L.len+z*v)/(L.len+v),L.len+=v,L.net+=R):i.push({axis:j,net:R,level:z,len:v})}for(const g of i)g.level=Dt(g.level,.5);if(i.length<2)return{...s,waypoints:[]};const a=i[0],d=n??(a.axis==="x"?a.net>0?"e":"w":a.net>0?"s":"n"),h=d==="e"||d==="w"?"x":"y",m={side:d,t:a.axis===h?oi(t,d,a.level):.5},p=[];for(let g=0;g<i.length-1;g++){const x=i[g],A=i[g+1];p.push(x.axis==="x"?{x:A.level,y:x.level}:{x:x.level,y:A.level})}let k;if(r){const g=i[i.length-1],x=g.axis==="x"?g.net>0?"w":"e":g.net>0?"n":"s";k={side:x,t:oi(r,x,g.level)}}return{fromAnchor:m,toAnchor:k,waypoints:p}}function Wg(e,t,n){const r=t.fromAnchor??tl(e,t.waypoints[0]??n),o=Tr(e,r),s=ni[r.side];return si(gh([o,Tt(o,s,rr),...t.waypoints,n],el(s),null))}function vh(e){let t=0;for(let n=1;n<e.length;n++)t+=Math.hypot(e[n].x-e[n-1].x,e[n].y-e[n-1].y);return t}function Vg(e,t,n,r,o){let s=e.pts.map(g=>({...g}));const i=Math.abs(s[r].y-s[r+1].y)<Bt,l=g=>{i?g.y=o:g.x=o},a=(g,x)=>{if(!(x.side==="e"||x.side==="w"?i:!i))return null;const y=i?g.y:g.x,u=i?g.d:g.w;return o>=y&&o<=y+u?{side:x.side,t:(o-y)/u}:null};let d=e.from,h=e.to;const m=s.length-2,p=r===0,k=r===m;if(!p&&!k)l(s[r]),l(s[r+1]);else{const g=p?a(t,d):null,x=k?a(n,h):null;if(p&&!k&&l(s[1]),k&&!p&&l(s[m]),p)if(g)d=g,l(s[0]);else{const A=Tt(s[0],e.aDir,rr),y={...A};l(y),s=[s[0],A,y,...s.slice(1)]}if(k){const A=s.length-1;if(x)h=x,l(s[A]);else{const y=Tt(s[A],e.bDir,rr),u={...y};l(u),s=[...s.slice(0,A),u,y,s[A]]}}}return{fromAnchor:d,toAnchor:h,waypoints:si(s).slice(1,-1)}}const Hg=new Set(["cylinder","cone"]),Ug=new Set(["block","cylinder","hexagon"]),Kg=1/Ce;function sc(e,t,n){const r=n==="flip"?fg(t):dg(t),o=Ae(e),s=r%2===1;return{transform:`rotate(${r*90} ${o.x*Ce} ${o.y*Ce})`,cx:o.x,cy:o.y,w:s?e.d:e.w,d:s?e.w:e.d}}function ic({proj:e,z:t,children:n}){return c.jsx("g",{transform:hg(e.groundMatrix(t)),children:c.jsx("g",{transform:`scale(${Kg})`,children:n})})}function wh({node:e,proj:t}){const n=Hg.has(e.kind);return c.jsx(c.Fragment,{children:pg(e,t).map((r,o)=>{const s=Dn(e.color,r.light);return c.jsx("polygon",{points:Ot(r.points),fill:s,stroke:n?s:Dn(e.color,r.light*.72),strokeWidth:n?.6:1,strokeLinejoin:"round"},o)})})}function Zg({node:e,proj:t}){const n=e.imageStyle??"tile",r=n==="tile"?Math.min(e.w,e.d)*.12:0;if(n==="standing"&&t.mode==="3d"){const i=Ae(e),l=t.project(i.x,i.y,e.z),a=Math.min(e.w,e.d)*Ce;return c.jsxs(c.Fragment,{children:[c.jsx("ellipse",{cx:l.x,cy:l.y,rx:a*.42,ry:a*.2,fill:"#000",opacity:.12}),c.jsx("image",{href:e.src,x:l.x-a/2,y:l.y-a*1.02,width:a,height:a,preserveAspectRatio:"xMidYMid meet"})]})}const o=n==="tile"?e.z+e.h:e.z,s=sc(e,t,"turn");return c.jsxs(c.Fragment,{children:[n==="tile"&&c.jsx(wh,{node:{...e,kind:"block"},proj:t}),c.jsx(ic,{proj:t,z:o,children:c.jsx("image",{href:e.src,transform:s.transform,x:(s.cx-s.w/2+r)*Ce,y:(s.cy-s.d/2+r)*Ce,width:(s.w-2*r)*Ce,height:(s.d-2*r)*Ce,preserveAspectRatio:"xMidYMid meet"})})]})}function Gg({node:e,proj:t,gradId:n}){const r=Ae(e),o=Math.min(e.w,e.d)/2,s=t.project(r.x,r.y,e.z+o);return c.jsxs(c.Fragment,{children:[c.jsx("defs",{children:c.jsxs("radialGradient",{id:n,cx:"38%",cy:"32%",r:"70%",children:[c.jsx("stop",{offset:"0%",stopColor:Dn(e.color,1.45)}),c.jsx("stop",{offset:"55%",stopColor:e.color}),c.jsx("stop",{offset:"100%",stopColor:Dn(e.color,.6)})]})}),c.jsx("polygon",{points:Ot(Fe(e).map(i=>t.project(i.x,i.y,e.z))),fill:"#000",opacity:.1}),c.jsx("circle",{cx:s.x,cy:s.y,r:o*Ce,fill:`url(#${n})`})]})}function Qg({node:e,proj:t}){const n=Ae(e),r=(e.fontSize??.7)*Ce,o=(e.text??"").split(`
`);return c.jsx(ic,{proj:t,z:e.z,children:c.jsx("text",{transform:sc(e,t,"flip").transform,x:n.x*Ce,y:n.y*Ce-(o.length-1)*r*1.2/2,fontSize:r,fill:e.color,textAnchor:"middle",dominantBaseline:"central",fontWeight:600,style:{userSelect:"none"},children:o.map((s,i)=>c.jsx("tspan",{x:n.x*Ce,dy:i===0?0:r*1.2,children:s||" "},i))})})}function xh(e,t){const n=Ae(e);if(e.kind==="image"&&e.imageStyle==="standing"&&t.mode==="3d"){const s=t.project(n.x,n.y,e.z);return{x:s.x,y:s.y+16}}const r=Fe(e).map(s=>t.project(s.x,s.y,e.z)),o=Math.max(...r.map(s=>s.y));return{x:t.project(n.x,n.y,e.z).x,y:o+15}}function Yg({node:e,proj:t}){const n=Si();if(!e.label||e.kind==="text")return null;if(e.kind==="area"){const o=sc(e,t,"flip");return c.jsx(ic,{proj:t,z:e.z,children:c.jsx("text",{transform:o.transform,x:(o.cx-o.w/2+.3)*Ce,y:(o.cy-o.d/2+.3)*Ce,fontSize:13,fontWeight:700,dominantBaseline:"hanging",fill:e.labelColor??Dn(e.color,n==="dark"?1.5:.6),style:{userSelect:"none"},pointerEvents:"none",children:e.label})})}const r=xh(e,t);if(t.mode==="2d"&&Ug.has(e.kind)){const o=t.project(Ae(e).x,Ae(e).y);return c.jsx("text",{x:o.x,y:o.y,fontSize:12,fontWeight:600,textAnchor:"middle",dominantBaseline:"central",fill:e.labelColor??mg(e.color),style:{userSelect:"none"},pointerEvents:"none",children:e.label})}return c.jsx("text",{x:r.x,y:r.y,fontSize:12,fontWeight:600,textAnchor:"middle",fill:e.labelColor??Bo[n].text,stroke:Bo[n].halo,strokeWidth:3,strokeLinejoin:"round",paintOrder:"stroke",style:{userSelect:"none"},pointerEvents:"none",children:e.label})}function ol({node:e,proj:t,idPrefix:n}){let r;switch(e.kind){case"area":case"circleArea":{const s=Fe(e).map(i=>t.project(i.x,i.y,e.z));r=c.jsx("polygon",{points:Ot(s),fill:e.color,fillOpacity:e.opacity??.18,stroke:e.color,strokeWidth:1.5,strokeDasharray:e.dashed?"6 4":void 0,strokeLinejoin:"round"});break}case"text":r=c.jsx(Qg,{node:e,proj:t});break;case"sphere":r=c.jsx(Gg,{node:e,proj:t,gradId:`${n}-sph-${e.id}`});break;case"image":r=c.jsx(Zg,{node:e,proj:t});break;default:r=c.jsx(wh,{node:e,proj:t})}const o=e.kind==="area"||e.kind==="circleArea";return c.jsx("g",{"data-node-id":e.id,opacity:o?void 0:e.opacity??1,children:r})}function kh(e){let t=vh(e)/2;for(let n=1;n<e.length;n++){const r=Math.hypot(e[n].x-e[n-1].x,e[n].y-e[n-1].y);if(t<=r&&r>0){const o=t/r;return{x:e[n-1].x+(e[n].x-e[n-1].x)*o,y:e[n-1].y+(e[n].y-e[n-1].y)*o}}t-=r}return e[0]}function Xg(e){const t=[...e].sort((o,s)=>o.x-s.x||o.y-s.y);if(t.length<3)return t;const n=(o,s,i)=>(s.x-o.x)*(i.y-o.y)-(s.y-o.y)*(i.x-o.x),r=o=>{const s=[];for(const i of o){for(;s.length>=2&&n(s[s.length-2],s[s.length-1],i)<=0;)s.pop();s.push(i)}return s.pop(),s};return[...r(t),...r([...t].reverse())]}function Sh({target:e,diagram:t,proj:n}){const r={stroke:"#2563eb",strokeLinejoin:"round",pointerEvents:"none",vectorEffect:"non-scaling-stroke"};if(e.kind==="node"){const o=t.nodes.find(a=>a.id===e.id);if(!o)return null;const s=Kt(o),i=Fe(o).map(a=>n.project(a.x,a.y,o.z)),l=s?i:Xg([...i,...Fe(o).map(a=>n.project(a.x,a.y,o.z+o.h))]);return c.jsx("polygon",{className:"isd-target-highlight",points:Ot(l),fill:"rgba(37,99,235,0.14)",strokeWidth:2.5,...r})}if(e.kind==="edge"){const o=t.edges.find(a=>a.id===e.id),s=o&&t.nodes.find(a=>a.id===o.from),i=o&&t.nodes.find(a=>a.id===o.to);if(!o||!s||!i)return null;const{d:l}=Gn(o,s,i,n);return c.jsxs("g",{className:"isd-target-highlight",children:[c.jsx("path",{d:l,fill:"none",strokeOpacity:.3,strokeWidth:10,strokeLinecap:"round",...r}),c.jsx("path",{d:l,fill:"none",strokeWidth:2.5,strokeLinecap:"round",...r})]})}return null}function Gn(e,t,n,r){const o=nl(e,t,n),s=o.pts.map((l,a)=>r.project(l.x,l.y,o.zs[a])),i=yh(o,e.routing,e.rounded??!1,r);return{r:o,screen:s,d:i,length:vh(s)}}function Fu({id:e,kind:t,color:n}){if(t==="none")return null;const r={id:e,viewBox:"0 0 10 10",markerWidth:5,markerHeight:5,orient:"auto-start-reverse"};switch(t){case"open":return c.jsx("marker",{...r,refX:"8.5",refY:"5",children:c.jsx("path",{d:"M1.5,1.5 L8.5,5 L1.5,8.5",fill:"none",stroke:n,strokeWidth:1.6,strokeLinecap:"round",strokeLinejoin:"round"})});case"circle":return c.jsx("marker",{...r,refX:"5",refY:"5",children:c.jsx("circle",{cx:"5",cy:"5",r:"3.6",fill:n})});case"diamond":return c.jsx("marker",{...r,refX:"9",refY:"5",children:c.jsx("path",{d:"M1,5 L5,1.5 L9,5 L5,8.5 z",fill:n})});default:return c.jsx("marker",{...r,refX:"8",refY:"5",children:c.jsx("path",{d:"M0,0 L10,5 L0,10 z",fill:n})})}}function qg(e,t){if(e==="dashed")return`${t*3} ${t*2.5}`;if(e==="dotted")return`0.01 ${t*2.2}`}const Jg=`
@keyframes isd-dash { from { stroke-dashoffset: var(--isd-from); } to { stroke-dashoffset: var(--isd-to); } }
@keyframes isd-glow { 0%, 100% { stroke-opacity: 0.04; } 50% { stroke-opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) { .isd-anim { animation: none !important; } }
`;function Mr(e,t,n){return{animation:`isd-dash ${n.toFixed(2)}s linear infinite`,"--isd-from":`${e.toFixed(2)}px`,"--isd-to":`${t.toFixed(2)}px`}}function ey({edge:e,d:t,length:n}){const r=Si(),o=e.animation??"none",s=e.width,i=Math.max(.1,e.animationSpeed??1),l=80*i,a=e.animationDirection??"forward",d=e.animationColor??Dn(e.color,1.55),h=Math.max(1,n);if(o==="packets"){const m=Math.max(1,Math.min(6,Math.round(h/130))),p=h/m,k=Math.max(.6/m,p/l),g=s+1.6,x=a==="both"?["forward","reverse"]:[a==="reverse"?"reverse":"forward"];return c.jsx("g",{pointerEvents:"none",children:x.map(A=>{const y=A==="reverse"&&a==="both"?p/2:0,u=A==="reverse"?Mr(y-p,y,k):Mr(y,y-p,k),v=A==="reverse"&&a==="both"?Dn(e.color,.7):d,j=`0.01 ${(p-.01).toFixed(2)}`;return c.jsxs("g",{children:[c.jsx("path",{className:"isd-anim",d:t,fill:"none",stroke:Bo[r].halo,strokeWidth:2*g+2.4,strokeLinecap:"round",strokeDasharray:j,style:u}),c.jsx("path",{className:"isd-anim",d:t,fill:"none",stroke:v,strokeWidth:2*g,strokeLinecap:"round",strokeDasharray:j,style:u})]},A)})})}if(o==="pulse"){const m=Math.min(70,Math.max(16,h*.25)),p=Math.max(.6,(h+m)/l),k=a==="both"?["forward","reverse"]:[a==="reverse"?"reverse":"forward"];return c.jsx("g",{pointerEvents:"none",children:k.map(g=>c.jsx("path",{className:"isd-anim",d:t,fill:"none",stroke:d,strokeWidth:s+2.5,strokeLinecap:"round",strokeDasharray:`${m} ${h+m}`,style:g==="forward"?Mr(m,-h,p):Mr(-h,m,p)},g))})}return o==="glow"?c.jsx("path",{className:"isd-anim",d:t,fill:"none",stroke:e.color,strokeOpacity:.04,strokeWidth:s+8,strokeLinecap:"round",strokeLinejoin:"round",pointerEvents:"none",style:{animation:`isd-glow ${(2/i).toFixed(2)}s ease-in-out infinite`}}):null}function ty({edge:e,a:t,b:n,proj:r,idPrefix:o,selected:s,animate:i=!0}){const{d:l,length:a}=Gn(e,t,n,r),d=`${o}-ms-${e.id}`,h=`${o}-me-${e.id}`,m=ph(e),p=mh(e),k=hh(e),g=e.width,x=i&&e.animation==="flow";let A=qg(k,g);e.animation==="flow"&&!A&&(A=`${g*3} ${g*2.5}`);const y=A?A.split(" ").reduce((j,z)=>j+parseFloat(z),0):0,u=Math.max(.1,e.animationSpeed??1),v=e.animationDirection==="reverse";return c.jsxs("g",{"data-edge-id":e.id,children:[c.jsxs("defs",{children:[c.jsx(Fu,{id:d,kind:m,color:e.color}),c.jsx(Fu,{id:h,kind:p,color:e.color})]}),c.jsx("path",{d:l,stroke:"transparent",strokeWidth:14,fill:"none"}),s&&c.jsx("path",{d:l,stroke:"#2563eb",strokeOpacity:.3,strokeWidth:g+6,fill:"none",strokeLinejoin:"round",strokeLinecap:"round","data-noexport":""}),e.animation==="flow"&&k==="solid"&&c.jsx("path",{d:l,stroke:e.color,strokeOpacity:.25,strokeWidth:g,fill:"none",strokeLinejoin:"round",strokeLinecap:"round"}),c.jsx("path",{d:l,stroke:e.color,strokeWidth:g,fill:"none",strokeLinejoin:"round",strokeLinecap:"round",strokeDasharray:A,markerEnd:p!=="none"?`url(#${h})`:void 0,markerStart:m!=="none"?`url(#${d})`:void 0,className:x?"isd-anim":void 0,style:x?v?Mr(0,y,Math.max(.15,y/(40*u))):Mr(y,0,Math.max(.15,y/(40*u))):void 0}),i&&c.jsx(ey,{edge:e,d:l,length:a})]})}function ny({edge:e,a:t,b:n,proj:r}){const o=Si();if(!e.label)return null;const s=kh(Gn(e,t,n,r).screen),i=e.label.length*6.6+12;return c.jsxs("g",{"data-edge-id":e.id,children:[c.jsx("rect",{x:s.x-i/2,y:s.y-9,width:i,height:18,rx:9,fill:Bo[o].chip,stroke:e.color,strokeWidth:1}),c.jsx("text",{x:s.x,y:s.y,fontSize:11,fontWeight:600,textAnchor:"middle",dominantBaseline:"central",fill:Bo[o].text,children:e.label})]})}function Eh({diagram:e,proj:t,idPrefix:n,selectedEdges:r,animate:o=!0}){const s=Si(),i=P.useMemo(()=>Ig(e,s),[e,s]),l=[],a=[];for(const g of i.nodes)(Kt(g)?l:a).push(g);const d=xg(i.nodes),h=new Map(i.nodes.map((g,x)=>[g.id,x]));l.sort((g,x)=>g.z-x.z||d.get(g.id)-d.get(x.id)||h.get(g.id)-h.get(x.id));const m=new Map(i.nodes.map(g=>[g.id,g])),p=vg(a,t),k=o&&i.edges.some(g=>g.animation&&g.animation!=="none");return c.jsxs(c.Fragment,{children:[k&&c.jsx("style",{children:Jg}),l.map(g=>c.jsx(P.Fragment,{children:c.jsx(ol,{node:g,proj:t,idPrefix:n})},g.id)),i.edges.map(g=>{const x=m.get(g.from),A=m.get(g.to);return!x||!A?null:c.jsx(ty,{edge:g,a:x,b:A,proj:t,idPrefix:n,selected:r==null?void 0:r.has(g.id),animate:o},g.id)}),p.map(g=>c.jsx(ol,{node:g,proj:t,idPrefix:n},g.id)),i.nodes.map(g=>c.jsx(Yg,{node:g,proj:t},`l-${g.id}`)),i.edges.map(g=>{const x=m.get(g.from),A=m.get(g.to);return x&&A?c.jsx(ny,{edge:g,a:x,b:A,proj:t},`l-${g.id}`):null})]})}function ry({node:e,size:t=44}){const n=new Oo("3d",0),r=Fe(e).flatMap(m=>[n.project(m.x,m.y,e.z),n.project(m.x,m.y,e.z+e.h)]),o=r.map(m=>m.x),s=r.map(m=>m.y),i=Math.min(...o),l=Math.min(...s),a=Math.max(...o)-i,d=Math.max(...s)-l,h=Math.max(a,d)*.12;return c.jsx("svg",{width:t,height:t,viewBox:`${i-h} ${l-h} ${a+2*h} ${d+2*h}`,"aria-hidden":!0,children:c.jsx(ol,{node:e,proj:n,idPrefix:"pv"})})}function oy(e,t,n=28){const r=[];for(const a of e.nodes){const d=a.z+(Kt(a)?0:a.kind==="sphere"?Math.min(a.w,a.d):a.h);for(const h of Fe(a))r.push(t.project(h.x,h.y,a.z),t.project(h.x,h.y,d));if(a.label&&a.kind!=="text"&&a.kind!=="area"&&r.push(xh(a,t)),a.kind==="image"&&a.imageStyle==="standing"){const h=t.project(Ae(a).x,Ae(a).y,a.z);r.push({x:h.x,y:h.y-Math.min(a.w,a.d)*Ce*1.05})}}if(!r.length)return{x:-100,y:-60,w:200,h:120};const o=r.map(a=>a.x),s=r.map(a=>a.y),i=Math.min(...o)-n,l=Math.min(...s)-n;return{x:i,y:l,w:Math.max(...o)+n-i,h:Math.max(...s)+n-l}}function Uy({diagram:e,view:t,rotation:n=0,highlight:r,focus:o,onNodeClick:s,animate:i=!0,maxHeight:l,className:a,label:d}){const h=P.useId().replace(/:/g,""),m=new Oo(t??e.view??"3d",n),p=oy(e,m),k=r?e.nodes.find(x=>x.id===r):void 0,g=x=>{var y;const A=(y=x.target.closest("[data-node-id]"))==null?void 0:y.getAttribute("data-node-id");A&&s&&s(A)};return c.jsxs("svg",{className:a,viewBox:`${p.x} ${p.y} ${p.w} ${p.h}`,width:"100%",preserveAspectRatio:"xMidYMid meet",role:"img","aria-label":d??"Architecture diagram",style:{display:"block",maxHeight:l,cursor:s?"pointer":void 0,fontFamily:"inherit"},onClick:g,children:[c.jsx(Eh,{diagram:e,proj:m,idPrefix:h,animate:i}),k&&c.jsx("polygon",{points:Ot(Fe(k).map(x=>m.project(x.x,x.y,k.z))),fill:"rgba(37,99,235,0.1)",stroke:"#2563eb",strokeWidth:2,strokeDasharray:"6 4",pointerEvents:"none"}),o&&c.jsx(Sh,{target:o,diagram:e,proj:m})]})}const sl="application/x-isodraw";function ft(e,t){var r;const n=(r=e==null?void 0:e.closest)==null?void 0:r.call(e,`[${t}]`);return n?n.getAttribute(t):null}const Ke="var(--isd-accent, #2563eb)";function sy(e){var Ie;const{diagram:t,view:n,rotation:r,camera:o,onCameraChange:s,selection:i,onSelectionChange:l,tool:a="select",readOnly:d,showGrid:h=!0,animate:m=!0,snapStep:p=.5}=e,k=P.useId().replace(/:/g,""),g=P.useMemo(()=>new Oo(n,r),[n,r]),x=P.useRef(null),[A,y]=P.useState({w:800,h:600}),[u,v]=P.useState(null),[j,z]=P.useState(null),[R,L]=P.useState(null),[F,ce]=P.useState(!1),U=P.useRef(e);U.current=e;const Qe=w=>{x.current=w;const E=e.svgRef;typeof E=="function"?E(w):E&&(E.current=w)};P.useEffect(()=>{const w=x.current;if(!w)return;const E=new ResizeObserver(()=>{const T=w.getBoundingClientRect();y({w:T.width,h:T.height})});return E.observe(w),()=>E.disconnect()},[]),P.useEffect(()=>{const w=T=>{var _,O;T.code==="Space"&&!((O=(_=T.target)==null?void 0:_.closest)!=null&&O.call(_,'input,textarea,select,[contenteditable="true"]'))&&(ce(!0),T.preventDefault())},E=T=>T.code==="Space"&&ce(!1);return window.addEventListener("keydown",w),window.addEventListener("keyup",E),()=>{window.removeEventListener("keydown",w),window.removeEventListener("keyup",E)}},[]),P.useEffect(()=>{const w=x.current;if(!w)return;const E=T=>{T.preventDefault();const _=U.current.camera;if(!(T.ctrlKey||T.metaKey||T.deltaX===0&&(T.deltaMode!==0||Math.abs(T.deltaY)>=50))){U.current.onCameraChange({..._,x:_.x-T.deltaX,y:_.y-T.deltaY});return}const M=w.getBoundingClientRect(),W=T.clientX-M.left,Y=T.clientY-M.top,X=Math.exp(-T.deltaY*(T.ctrlKey?.01:.0015)),Oe=Math.min(4,Math.max(.15,_.zoom*X)),Q=Oe/_.zoom;U.current.onCameraChange({zoom:Oe,x:W-(W-_.x)*Q,y:Y-(Y-_.y)*Q})};return w.addEventListener("wheel",E,{passive:!1}),()=>w.removeEventListener("wheel",E)},[]);const ut=(w,E)=>{const T=x.current.getBoundingClientRect();return{x:(w-T.left-o.x)/o.zoom,y:(E-T.top-o.y)/o.zoom}},be=(w,E,T=0)=>{const _=ut(w,E);return g.unproject(_.x,_.y,T)},Qt=(w,E)=>ft(document.elementFromPoint(w,E),"data-node-id"),ue=P.useMemo(()=>new Map(t.nodes.map(w=>[w.id,w])),[t.nodes]),Ve=P.useMemo(()=>new Map(t.edges.map(w=>[w.id,w])),[t.edges]),dt=w=>{var E;(E=e.onChange)==null||E.call(e,{...t,nodes:t.nodes.map(w)})},D=(w,E)=>{var T;(T=e.onChange)==null||T.call(e,{...t,edges:t.edges.map(_=>_.id===w?{..._,...E}:_)})},V=w=>{const E=ue.get(w.from),T=ue.get(w.to);return E&&T?[E,T]:null},K=(w,E)=>{var Y;const T=Ve.get(i.edges[0]),_=T&&V(T);if(!T||!_)return!1;const[O,M]=w.split(":"),W=Number(M);if(O==="edge-from"||O==="edge-to")v({type:"edgeEnd",edgeId:T.id,end:O==="edge-from"?"from":"to",cursor:ut(E.clientX,E.clientY),target:null});else if(O==="seg"){const X=nl(T,_[0],_[1]);v({type:"segment",edgeId:T.id,index:W,start:be(E.clientX,E.clientY,X.zs[W]),base:X,began:!1})}else if(O==="wp")v({type:"waypoint",edgeId:T.id,index:W,began:!1});else if(O==="wpadd"){const X=nl(T,_[0],_[1]),Oe={x:(X.pts[W].x+X.pts[W+1].x)/2,y:(X.pts[W].y+X.pts[W+1].y)/2},Q=[...T.waypoints??[]];Q.splice(W,0,Oe),(Y=e.onBeginChange)==null||Y.call(e),D(T.id,{waypoints:Q}),v({type:"waypoint",edgeId:T.id,index:W,began:!0})}else return!1;return!0},ie=w=>{var M,W,Y,X,Oe,Q;if(w.button===2)return;try{(W=(M=x.current)==null?void 0:M.setPointerCapture)==null||W.call(M,w.pointerId)}catch{}if((X=(Y=x.current)==null?void 0:Y.focus)==null||X.call(Y),w.button===1||F){v({type:"pan",sx:w.clientX,sy:w.clientY,cam:o,moved:!0});return}const E=ft(w.target,"data-handle"),T=ft(w.target,"data-node-id"),_=ft(w.target,"data-edge-id"),O=ft(w.target,"data-doc-badge");if(O){const[I,H]=O.split(":");l(I==="node"?{nodes:[H],edges:[]}:{nodes:[],edges:[H]}),(Oe=e.onOpenDocs)==null||Oe.call(e,{kind:I,id:H});return}if(E&&!d){if(K(E,w))return;if(E.startsWith("conn-")){const[H,ne]=E.slice(5).split(":"),ee=ue.get(ne);if(!ee)return;const me=be(w.clientX,w.clientY,ee.z);v({type:"connect",from:ee.id,fromSide:H,trail:[me],cursor:me,target:null});return}const I=ue.get(i.nodes[0]);if(!I)return;if(E==="height")v({type:"height",id:I.id,sy:w.clientY,h0:I.h,began:!1});else{const ne=$o(I)[(Number(E)+2)%4];v({type:"resize",id:I.id,fixed:ne,began:!1})}return}if(T&&a==="connect"&&!d){const I=ue.get(T),H=be(w.clientX,w.clientY,I.z);v({type:"connect",from:T,trail:[H],cursor:H,target:null});return}if(T){let I=i.nodes;if(w.shiftKey||w.metaKey?I=I.includes(T)?I.filter(ae=>ae!==T):[...I,T]:I.includes(T)||(I=[T]),l({nodes:I,edges:[]}),d)return;const H=I.filter(ae=>{const le=ue.get(ae);return le&&ln(le)&&!le.locked}),ne=new Set([...I,...jr(H,t.nodes)]),ee=new Map;for(const ae of ne){const le=ue.get(ae);le&&!le.locked&&ee.set(ae,{x:le.x,y:le.y})}const me=new Map;for(const ae of t.edges)(Q=ae.waypoints)!=null&&Q.length&&ee.has(ae.from)&&ee.has(ae.to)&&me.set(ae.id,ae.waypoints);ee.has(T)&&v({type:"move",start:be(w.clientX,w.clientY),primary:T,origins:ee,edgeOrigins:me,moved:!1});return}if(_){l({nodes:[],edges:w.shiftKey?[...i.edges,_]:[_]});return}if(w.shiftKey){const I=ut(w.clientX,w.clientY);v({type:"marquee",start:I,cur:I,additive:i.nodes});return}v({type:"pan",sx:w.clientX,sy:w.clientY,cam:o,moved:!1})},re=w=>{var T,_,O,M,W,Y,X,Oe,Q;if(!u){a==="connect"&&!((T=ft(w.target,"data-handle"))!=null&&T.startsWith("conn-"))&&z(ft(w.target,"data-node-id"));const I=ft(w.target,"data-node-id"),H=ft(w.target,"data-edge-id");L(ft(w.target,"data-doc-badge")??(I?`node:${I}`:H?`edge:${H}`:null));return}const E=w.altKey;switch(u.type){case"pan":{const I=w.clientX-u.sx,H=w.clientY-u.sy;if(!u.moved&&Math.hypot(I,H)<3)return;u.moved||v({...u,moved:!0}),s({...u.cam,x:u.cam.x+I,y:u.cam.y+H});break}case"move":{const I=be(w.clientX,w.clientY),H=I.x-u.start.x,ne=I.y-u.start.y;if(!u.moved){if(Math.hypot(H,ne)<.15)return;(_=e.onBeginChange)==null||_.call(e)}const ee=u.origins.get(u.primary),me=E?H:Dt(ee.x+H,p)-ee.x,ae=E?ne:Dt(ee.y+ne,p)-ee.y,le=t.nodes.map(Ye=>{const At=u.origins.get(Ye.id);return At?{...Ye,x:At.x+me,y:At.y+ae}:Ye}),rt=u.edgeOrigins.size?t.edges.map(Ye=>{const At=u.edgeOrigins.get(Ye.id);return At?{...Ye,waypoints:At.map(Gr=>({x:Gr.x+me,y:Gr.y+ae}))}:Ye}):t.edges,ot=le.find(Ye=>Ye.id===u.primary),pn=(O=En(ot,le,new Set(u.origins.keys())))==null?void 0:O.id;(pn!==u.dropTarget||!u.moved)&&v({...u,moved:!0,dropTarget:pn}),(M=e.onChange)==null||M.call(e,{...t,nodes:le,edges:rt});break}case"resize":{const I=ue.get(u.id);if(!I)return;const H=be(w.clientX,w.clientY,I.z),ne=E?H.x:Dt(H.x,p),ee=E?H.y:Dt(H.y,p),me=.5,ae=Math.max(me,Math.abs(ne-u.fixed.x)),le=Math.max(me,Math.abs(ee-u.fixed.y));u.began||((W=e.onBeginChange)==null||W.call(e),v({...u,began:!0})),dt(rt=>rt.id===u.id?{...rt,x:ne<u.fixed.x?u.fixed.x-ae:u.fixed.x,y:ee<u.fixed.y?u.fixed.y-le:u.fixed.y,w:ae,d:le}:rt);break}case"height":{const I=(u.sy-w.clientY)/(g.heightScale*o.zoom),H=Math.max(.1,E?u.h0+I:Dt(u.h0+I,.25));u.began||((Y=e.onBeginChange)==null||Y.call(e),v({...u,began:!0})),dt(ne=>ne.id===u.id?{...ne,h:H}:ne);break}case"connect":{const I=ue.get(u.from),H=be(w.clientX,w.clientY,I.z),ne=u.trail[u.trail.length-1],ee=Math.hypot(H.x-ne.x,H.y-ne.y)>.1?[...u.trail,H]:u.trail;v({...u,trail:ee,cursor:H,target:Qt(w.clientX,w.clientY)});break}case"edgeEnd":v({...u,cursor:ut(w.clientX,w.clientY),target:Qt(w.clientX,w.clientY)});break;case"segment":{const{base:I}=u,H=I.pts[u.index],ne=I.pts[u.index+1],ee=Math.abs(H.y-ne.y)<1e-6,me=be(w.clientX,w.clientY,I.zs[u.index]),ae=ee?H.y+(me.y-u.start.y):H.x+(me.x-u.start.x),le=E?ae:Dt(ae,.25);if(Math.abs(le-(ee?H.y:H.x))<1e-6&&!u.began)return;const rt=Ve.get(u.edgeId),ot=rt&&V(rt);if(!ot)return;u.began||((X=e.onBeginChange)==null||X.call(e),v({...u,began:!0})),D(u.edgeId,Vg(I,ot[0],ot[1],u.index,le));break}case"waypoint":{const I=Ve.get(u.edgeId);if(!(I!=null&&I.waypoints))return;const H=((Oe=ue.get(I.from))==null?void 0:Oe.z)??0,ne=be(w.clientX,w.clientY,H),ee=E?ne:{x:Dt(ne.x,.25),y:Dt(ne.y,.25)};u.began||((Q=e.onBeginChange)==null||Q.call(e),v({...u,began:!0})),D(I.id,{waypoints:I.waypoints.map((me,ae)=>ae===u.index?ee:me)});break}case"marquee":{const I=ut(w.clientX,w.clientY);v({...u,cur:I});const H=Math.min(u.start.x,I.x),ne=Math.max(u.start.x,I.x),ee=Math.min(u.start.y,I.y),me=Math.max(u.start.y,I.y),ae=t.nodes.filter(le=>{const rt=Ae(le),ot=g.project(rt.x,rt.y,le.z+(Kt(le)?0:le.h/2));return ot.x>=H&&ot.x<=ne&&ot.y>=ee&&ot.y<=me}).map(le=>le.id);l({nodes:[...new Set([...u.additive,...ae])],edges:[]});break}}},un=w=>{var E,T;if((u==null?void 0:u.type)==="pan"&&!u.moved&&l({nodes:[],edges:[]}),(u==null?void 0:u.type)==="connect"){const _=Qt(w.clientX,w.clientY),O=ue.get(u.from),M=_?ue.get(_):void 0;O&&M&&M.id!==O.id&&((E=e.onConnect)==null||E.call(e,O.id,M.id,$u(u.trail,O,u.fromSide,M)))}if((u==null?void 0:u.type)==="edgeEnd"){const _=Ve.get(u.edgeId),O=Qt(w.clientX,w.clientY),M=O?ue.get(O):void 0,W=_&&(u.end==="from"?_.to:_.from);if(_&&M&&M.id!==W){const Y=Rg(M,be(w.clientX,w.clientY,M.z)),X=M.id===(u.end==="from"?_.from:_.to);(T=e.onBeginChange)==null||T.call(e),D(_.id,{...u.end==="from"?{from:M.id,fromAnchor:Y}:{to:M.id,toAnchor:Y},...X?{}:{waypoints:void 0}})}}v(null)},ze=w=>{var O,M,W;const E=ft(w.target,"data-handle");if(!E){const Y=ft(w.target,"data-node-id"),X=ft(w.target,"data-edge-id");Y?(O=e.onOpenDocs)==null||O.call(e,{kind:"node",id:Y}):X&&((M=e.onOpenDocs)==null||M.call(e,{kind:"edge",id:X}));return}const T=Ve.get(i.edges[0]);if(!E.startsWith("wp:")||!(T!=null&&T.waypoints)||d)return;const _=Number(E.split(":")[1]);(W=e.onBeginChange)==null||W.call(e),D(T.id,{waypoints:T.waypoints.filter((Y,X)=>X!==_)})},dn=P.useMemo(()=>{if(!h)return null;const w=[[0,0],[A.w,0],[0,A.h],[A.w,A.h]].map(([Q,I])=>g.unproject((Q-o.x)/o.zoom,(I-o.y)/o.zoom)),E=Math.floor(Math.min(...w.map(Q=>Q.x)))-1,T=Math.ceil(Math.max(...w.map(Q=>Q.x)))+1,_=Math.floor(Math.min(...w.map(Q=>Q.y)))-1,O=Math.ceil(Math.max(...w.map(Q=>Q.y)))+1,M=Math.max(T-E,O-_),W=M>400?10:M>160?5:1;let Y="",X="";const Oe=(Q,I,H,ne)=>{const ee=g.project(Q,I),me=g.project(H,ne);return`M${ee.x.toFixed(1)},${ee.y.toFixed(1)}L${me.x.toFixed(1)},${me.y.toFixed(1)}`};for(let Q=Math.floor(E/W)*W;Q<=T;Q+=W){const I=Oe(Q,_,Q,O);Q%(W*5)===0?X+=I:Y+=I}for(let Q=Math.floor(_/W)*W;Q<=O;Q+=W){const I=Oe(E,Q,T,Q);Q%(W*5)===0?X+=I:Y+=I}return c.jsxs("g",{"data-noexport":"",pointerEvents:"none",children:[c.jsx("path",{d:Y,stroke:"var(--isd-grid, #dde3ec)",strokeWidth:1,vectorEffect:"non-scaling-stroke",fill:"none"}),c.jsx("path",{d:X,stroke:"var(--isd-grid-major, #c8d1de)",strokeWidth:1,vectorEffect:"non-scaling-stroke",fill:"none"})]})},[h,A,o,g]),wt=P.useMemo(()=>new Set(i.edges),[i.edges]),Se=5/o.zoom,fn=i.nodes.map(w=>{const E=ue.get(w);if(!E)return null;const T=Fe(E).map(M=>g.project(M.x,M.y,E.z)),O=!Kt(E)&&g.mode==="3d"&&E.kind!=="sphere"?Fe(E).map(M=>g.project(M.x,M.y,E.z+E.h)):null;return c.jsxs("g",{children:[c.jsx("polygon",{points:Ot(T),fill:"none",stroke:Ke,strokeWidth:1.5,strokeDasharray:"5 3",vectorEffect:"non-scaling-stroke"}),O&&E.kind!=="pyramid"&&E.kind!=="cone"&&c.jsx("polygon",{points:Ot(O),fill:"none",stroke:Ke,strokeWidth:1.5,vectorEffect:"non-scaling-stroke"})]},w)}),hn=w=>fh.map(E=>{const T=Tr(w,{side:E,t:.5},.45),_=g.project(T.x,T.y,w.z);return c.jsx("circle",{"data-handle":`conn-${E}:${w.id}`,cx:_.x,cy:_.y,r:Se*.9,fill:"#fff",stroke:Ke,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"crosshair"},children:c.jsx("title",{children:"Drag to connect"})},E)});let Yt=null;const Le=i.nodes.length===1?ue.get(i.nodes[0]):void 0;if(Le&&!d&&a==="select"&&!u){const w=$o(Le).map(M=>g.project(M.x,M.y,Le.z));let E=0;w.forEach((M,W)=>{(M.y>w[E].y+.01||Math.abs(M.y-w[E].y)<.01&&M.x>w[E].x)&&(E=W)});const T=Ae(Le),_=g.mode==="3d"&&!Kt(Le)&&Le.kind!=="sphere"&&Le.kind!=="image",O=g.project(T.x,T.y,Le.z+Le.h);Yt=c.jsxs("g",{children:[hn(Le),!Le.locked&&c.jsx("rect",{"data-handle":String(E),x:w[E].x-Se,y:w[E].y-Se,width:Se*2,height:Se*2,fill:"#fff",stroke:Ke,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"nwse-resize"}}),_&&!Le.locked&&c.jsx("circle",{"data-handle":"height",cx:O.x,cy:O.y-14/o.zoom,r:Se,fill:Ke,stroke:"#fff",strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"ns-resize"},children:c.jsx("title",{children:"Drag to change height"})})]})}let Pt=null;const xt=i.edges.length===1&&!i.nodes.length?Ve.get(i.edges[0]):void 0,Kr=xt&&V(xt);if(xt&&Kr&&!d&&a==="select"&&(u==null?void 0:u.type)!=="edgeEnd"){const{r:w,screen:E}=Gn(xt,Kr[0],Kr[1],g),T=[];if(xt.routing==="orthogonal")w.pts.slice(0,-1).forEach((O,M)=>{const W=w.pts[M+1];if(Math.hypot(W.x-O.x,W.y-O.y)<.6)return;const Y={x:(E[M].x+E[M+1].x)/2,y:(E[M].y+E[M+1].y)/2},X=Math.abs(O.y-W.y)<1e-6;T.push(c.jsx("rect",{"data-handle":`seg:${M}`,x:Y.x-Se*1.1,y:Y.y-Se*1.1,width:Se*2.2,height:Se*2.2,rx:Se*.6,fill:"#fff",stroke:Ke,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"move"},children:c.jsx("title",{children:`Drag to move this ${X?"east-west":"north-south"} segment`})},`seg${M}`))});else{const O=((Ie=xt.waypoints)==null?void 0:Ie.length)??0;for(let M=0;M<E.length-1;M++){const W={x:(E[M].x+E[M+1].x)/2,y:(E[M].y+E[M+1].y)/2};T.push(c.jsx("circle",{"data-handle":`wpadd:${M}`,cx:W.x,cy:W.y,r:Se*.75,fill:Ke,fillOpacity:.35,stroke:"#fff",strokeWidth:1,vectorEffect:"non-scaling-stroke",style:{cursor:"copy"},children:c.jsx("title",{children:"Drag to add a bend"})},`add${M}`))}for(let M=0;M<O;M++){const W=E[M+1];T.push(c.jsx("circle",{"data-handle":`wp:${M}`,cx:W.x,cy:W.y,r:Se,fill:"#fff",stroke:Ke,strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"move"},children:c.jsx("title",{children:"Drag to move, double-click to remove"})},`wp${M}`))}}const _=(O,M)=>c.jsx("circle",{"data-handle":O,cx:M.x,cy:M.y,r:Se,fill:Ke,stroke:"#fff",strokeWidth:1.5,vectorEffect:"non-scaling-stroke",style:{cursor:"grab"},children:c.jsx("title",{children:"Drag onto a node side to re-attach"})},O);T.push(_("edge-from",E[0]),_("edge-to",E[E.length-1])),Pt=c.jsx("g",{children:T})}let ir=null;if((u==null?void 0:u.type)==="connect"){const w=ue.get(u.from),E=u.target&&u.target!==u.from?ue.get(u.target):void 0;if(w){const T=$u(u.trail,w,u.fromSide,E??null),_=e.newEdgeStyle??{},O=_.routing??"orthogonal";let M;if(E)M=Gn({from:w.id,to:E.id,routing:O,rounded:_.rounded,...T},w,E,g).d;else{const W=Wg(w,T,u.cursor),Y={x:0,y:0};M=yh({pts:W,zs:W.map(()=>w.z),aDir:Y,bDir:Y},"orthogonal",_.rounded??!0,g)}ir=c.jsxs("g",{pointerEvents:"none",children:[E&&c.jsx("polygon",{points:Ot(Fe(E).map(W=>g.project(W.x,W.y,E.z))),fill:"rgba(37,99,235,0.12)",stroke:Ke,strokeWidth:2,vectorEffect:"non-scaling-stroke"}),c.jsx("path",{d:M,fill:"none",stroke:Ke,strokeWidth:2.5,strokeDasharray:"7 5",strokeLinejoin:"round",strokeLinecap:"round",vectorEffect:"non-scaling-stroke",markerEnd:`url(#${k}-preview-arrow)`})]})}}else if((u==null?void 0:u.type)==="edgeEnd"){const w=Ve.get(u.edgeId),E=w&&V(w);if(w&&E){const{screen:T}=Gn(w,E[0],E[1],g),_=u.end==="from"?T[T.length-1]:T[0],O=u.target?ue.get(u.target):void 0;ir=c.jsxs("g",{pointerEvents:"none",children:[O&&c.jsx("polygon",{points:Ot(Fe(O).map(M=>g.project(M.x,M.y,O.z))),fill:"rgba(37,99,235,0.12)",stroke:Ke,strokeWidth:2,vectorEffect:"non-scaling-stroke"}),c.jsx("line",{x1:_.x,y1:_.y,x2:u.cursor.x,y2:u.cursor.y,stroke:Ke,strokeWidth:2,strokeDasharray:"6 4",vectorEffect:"non-scaling-stroke"})]})}}else(u==null?void 0:u.type)==="marquee"&&(ir=c.jsx("rect",{x:Math.min(u.start.x,u.cur.x),y:Math.min(u.start.y,u.cur.y),width:Math.abs(u.cur.x-u.start.x),height:Math.abs(u.cur.y-u.start.y),fill:"rgba(37,99,235,0.08)",stroke:Ke,strokeWidth:1,vectorEffect:"non-scaling-stroke",pointerEvents:"none"}));const ar=14/o.zoom,lr=e.showDocBadges??"hover",$n=new Set([...R?[R]:[],...i.nodes.map(w=>`node:${w}`),...i.edges.map(w=>`edge:${w}`)]),Zr=w=>lr==="always"||lr==="hover"&&$n.has(w),Fn=(w,E,T)=>Zr(w)?c.jsxs("g",{className:"isd-doc-badge","data-doc-badge":w,transform:`translate(${E.x} ${E.y}) scale(${1/o.zoom})`,children:[c.jsx("title",{children:`Open docs: ${T}`}),c.jsx("rect",{x:-7,y:-7,width:14,height:14,rx:3.5}),c.jsx("path",{d:"M-3.5,-3 H3.5 M-3.5,0 H3.5 M-3.5,3 H1"})]},w):null,Zo=lr==="never"?null:[...t.nodes.filter(w=>Ct(w.doc)).map(w=>{const E=Kt(w)||w.kind==="sphere",T=E?w.z:w.z+w.h,_=Fe(w).map(M=>g.project(M.x,M.y,T));let O;if(E){const M=g.project(Ae(w).x,Ae(w).y,T),W=_.reduce((Y,X)=>X.y<Y.y?X:Y);O={x:W.x+(M.x-W.x)*.12,y:W.y+(M.y-W.y)*.12+ar}}else{const M=_.reduce((W,Y)=>Y.x>W.x?Y:W);O={x:M.x+ar*.2,y:M.y-ar*.9}}return Fn(`node:${w.id}`,O,w.label||w.kind)}),...t.edges.filter(w=>Ct(w.doc)).map(w=>{const E=V(w);if(!E)return null;const T=kh(Gn(w,E[0],E[1],g).screen),_=w.label?(w.label.length*6.6+12)/2+12:0;return Fn(`edge:${w.id}`,{x:T.x+_,y:T.y-(w.label?0:ar*.9)},w.label||"connection")})],kt=j&&a==="connect"&&!u?ue.get(j):void 0,cr=(u==null?void 0:u.type)==="pan"?u.moved?"grabbing":void 0:(u==null?void 0:u.type)==="move"?u.moved?"move":void 0:(u==null?void 0:u.type)==="connect"||(u==null?void 0:u.type)==="edgeEnd"?"crosshair":(u==null?void 0:u.type)==="segment"||(u==null?void 0:u.type)==="waypoint"?"move":void 0,Go=cr??(F?"grab":a==="connect"?"crosshair":"default");return c.jsxs("svg",{ref:Qe,className:cr?"isd-canvas isd-canvas-dragging":"isd-canvas",tabIndex:0,style:{cursor:Go,touchAction:"none"},onPointerDown:ie,onPointerMove:re,onPointerUp:un,onPointerCancel:()=>v(null),onPointerLeave:()=>L(null),onDoubleClick:ze,onContextMenu:w=>w.preventDefault(),onDragOver:w=>{w.dataTransfer.types.includes(sl)&&(w.preventDefault(),w.dataTransfer.dropEffect="copy")},onDrop:w=>{var T;const E=w.dataTransfer.getData(sl);E&&(w.preventDefault(),(T=e.onDropPayload)==null||T.call(e,E,be(w.clientX,w.clientY)))},children:[c.jsx("defs",{"data-noexport":"",children:c.jsx("marker",{id:`${k}-preview-arrow`,viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"4",markerHeight:"4",orient:"auto-start-reverse",children:c.jsx("path",{d:"M0,0 L10,5 L0,10 z",fill:"#2563eb"})})}),c.jsxs("g",{"data-camera":"",transform:`translate(${o.x} ${o.y}) scale(${o.zoom})`,children:[dn,c.jsx("g",{"data-scene":"",children:c.jsx(Eh,{diagram:t,proj:g,idPrefix:k,selectedEdges:wt,animate:m})}),c.jsxs("g",{"data-noexport":"",children:[e.focus&&c.jsx(Sh,{target:e.focus,diagram:t,proj:g}),kt&&c.jsxs("g",{children:[c.jsx("polygon",{points:Ot(Fe(kt).map(w=>g.project(w.x,w.y,kt.z))),fill:"rgba(37,99,235,0.12)",stroke:Ke,strokeWidth:2,vectorEffect:"non-scaling-stroke",pointerEvents:"none"}),hn(kt)]}),(u==null?void 0:u.type)==="move"&&u.dropTarget&&ue.get(u.dropTarget)&&c.jsx("polygon",{points:Ot(Fe(ue.get(u.dropTarget)).map(w=>g.project(w.x,w.y,ue.get(u.dropTarget).z))),fill:"rgba(37,99,235,0.08)",stroke:Ke,strokeWidth:2.5,strokeDasharray:"8 5",vectorEffect:"non-scaling-stroke",pointerEvents:"none"}),c.jsx("g",{pointerEvents:"none",children:fn}),Zo,Yt,Pt,ir]})]})]})}const ea="http://www.w3.org/2000/svg";async function iy(e){if(e.startsWith("data:"))return e;const t=await fetch(e,{mode:"cors"});if(!t.ok)throw new Error(`Failed to fetch ${e}`);const n=await t.blob();return new Promise((r,o)=>{const s=new FileReader;s.onload=()=>r(s.result),s.onerror=()=>o(s.error),s.readAsDataURL(n)})}async function Ch(e,t={}){const n=e.querySelector("[data-scene]");if(!n)throw new Error("No scene found in SVG");const r=t.padding??24,o=n.getBBox(),s=n.cloneNode(!0);s.querySelectorAll("[data-noexport]").forEach(d=>d.remove()),s.querySelectorAll("[data-node-id],[data-edge-id]").forEach(d=>{d.removeAttribute("style")}),await Promise.all([...s.querySelectorAll("image")].map(async d=>{const h=d.getAttribute("href");if(h)try{d.setAttribute("href",await iy(h))}catch{}}));const i=document.createElementNS(ea,"svg"),l=Math.ceil(o.width+r*2),a=Math.ceil(o.height+r*2);if(i.setAttribute("xmlns",ea),i.setAttribute("viewBox",`${o.x-r} ${o.y-r} ${l} ${a}`),i.setAttribute("width",String(l)),i.setAttribute("height",String(a)),i.setAttribute("font-family","Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"),t.background){const d=document.createElementNS(ea,"rect");d.setAttribute("x",String(o.x-r)),d.setAttribute("y",String(o.y-r)),d.setAttribute("width",String(l)),d.setAttribute("height",String(a)),d.setAttribute("fill",t.background),i.appendChild(d)}return i.appendChild(s),new XMLSerializer().serializeToString(i)}async function ay(e,t={}){const n=await Ch(e,{background:t.background??"#ffffff"}),r=t.scale??2,o=URL.createObjectURL(new Blob([n],{type:"image/svg+xml"}));try{const s=new Image;s.src=o,await s.decode();const i=document.createElement("canvas");i.width=Math.ceil(s.width*r),i.height=Math.ceil(s.height*r);const l=i.getContext("2d");return l.scale(r,r),l.drawImage(s,0,0),await new Promise((a,d)=>i.toBlob(h=>h?a(h):d(new Error("PNG encoding failed")),"image/png"))}finally{URL.revokeObjectURL(o)}}function ly(e){return JSON.stringify(e,null,2)}function ys(e,t,n="application/octet-stream"){const r=typeof e=="string"?new Blob([e],{type:n}):e,o=URL.createObjectURL(r),s=document.createElement("a");s.href=o,s.download=t,s.click(),setTimeout(()=>URL.revokeObjectURL(o),1e3)}function cy(e){return new Promise((t,n)=>{const r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(r.error),r.readAsDataURL(e)})}const Bu="aws-icons",uy="3.3.0",dy={"architecture-service":"Services",resource:"Resources","architecture-group":"Groups",category:"Categories"};function fy(e){return e.replace(/\.svg$/i,"").replace(/^(Amazon|AWS)(?=[A-Z0-9])/,"$1 ").replace(/([a-z])([A-Z])/g,"$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g,"$1 $2").replace(/\s+/g," ").replace(/\b(Io T|Cloud (?:Front|Watch|Formation|Trail|Shell|Search|Map|HSM)|Dynamo DB|Elasti Cache|Sage Maker|Open Search|Event Bridge|Code (?:Build|Commit|Deploy|Pipeline|Guru|Catalyst|Whisperer)|Doc DB)\b/g,t=>t.replace(" ","")).trim()}async function hy(e={}){const t=e.version??uy,n=e.folders??["architecture-service","resource","architecture-group","category"],r=await fetch(`https://data.jsdelivr.com/v1/packages/npm/${Bu}@${t}?structure=flat`,{signal:e.signal});if(!r.ok)throw new Error(`Could not list AWS icons (${r.status})`);const o=await r.json(),s=[];for(const l of o.files){const a=/^\/icons\/([^/]+)\/([^/]+\.svg)$/.exec(l.name);!a||!n.includes(a[1])||s.push({id:`aws:${a[1]}/${a[2]}`,name:fy(a[2]),src:`https://cdn.jsdelivr.net/npm/${Bu}@${t}${l.name}`,category:dy[a[1]]??a[1]})}return s.sort((l,a)=>n.indexOf(i(l))-n.indexOf(i(a))||l.name.localeCompare(a.name)),{id:"aws",name:"AWS",icons:s};function i(l){var a;return((a=/^aws:([^/]+)/.exec(l.id))==null?void 0:a[1])??""}}const py={cube:c.jsx("path",{d:"M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L18.7 8 12 11.7 5.3 8 12 4.3ZM5 9.7l6 3.3v6.6l-6-3.3V9.7Zm8 9.9V13l6-3.3v6.6l-6 3.3Z"}),square:c.jsx("path",{d:"M4 4h16v16H4V4Zm2 2v12h12V6H6Z"}),rotl:c.jsx("path",{d:"M7.1 7.1A7 7 0 1 1 5 12H3a9 9 0 1 0 2.6-6.4L3 3v6h6L7.1 7.1Z"}),rotr:c.jsx("path",{d:"M16.9 7.1A7 7 0 1 0 19 12h2a9 9 0 1 1-2.6-6.4L21 3v6h-6l1.9-1.9Z"}),pointer:c.jsx("path",{d:"m5 3 14 7-6 2-2 6L5 3Z"}),link:c.jsx("path",{d:"M3 17h6v-2H5V9h4V7H3v10Zm12-10v2h4v6h-4v2h6V7h-6ZM8 11h8v2H8v-2Z"}),undo:c.jsx("path",{d:"M9 7V3L2 10l7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11Z"}),redo:c.jsx("path",{d:"M15 7V3l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11Z"}),plus:c.jsx("path",{d:"M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"}),minus:c.jsx("path",{d:"M5 11h14v2H5z"}),fit:c.jsx("path",{d:"M4 4h6v2H6v4H4V4Zm10 0h6v6h-2V6h-4V4ZM4 14h2v4h4v2H4v-6Zm14 0h2v6h-6v-2h4v-4Z"}),download:c.jsx("path",{d:"M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16l-5.7-5.7 1.4-1.4 3.3 3.3V3ZM4 18h16v2H4v-2Z"}),upload:c.jsx("path",{d:"M11 16h2V6.8l3.3 3.3 1.4-1.4L12 3 6.3 8.7l1.4 1.4L11 6.8V16Zm-7 2h16v2H4v-2Z"}),trash:c.jsx("path",{d:"M9 3h6l1 2h4v2H4V5h4l1-2ZM6 9h12l-1 12H7L6 9Z"}),copy:c.jsx("path",{d:"M8 3h11v13h-2V5H8V3ZM4 7h11v14H4V7Zm2 2v10h7V9H6Z"}),grid:c.jsx("path",{d:"M3 3h18v18H3V3Zm2 2v4h4V5H5Zm6 0v4h4V5h-4Zm6 0v4h2V5h-2ZM5 11v4h4v-4H5Zm6 0v4h4v-4h-4Zm6 0v4h2v-4h-2ZM5 17v2h4v-2H5Zm6 0v2h4v-2h-4Zm6 0v2h2v-2h-2Z"}),panelL:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v12h4V6H5Zm6 0v12h8V6h-8Z"}),panelR:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v12h8V6H5Zm10 0v12h4V6h-4Z"}),close:c.jsx("path",{d:"m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z"}),group:c.jsx("path",{d:"M3 3h6v2H5v4H3V3Zm12 0h6v6h-2V5h-4V3ZM3 15h2v4h4v2H3v-6Zm16 0h2v6h-6v-2h4v-4ZM8 8h8v8H8V8Z"}),doc:c.jsx("path",{d:"M6 2h9l5 5v15H6V2Zm2 2v16h10V8h-4V4H8Zm2 7h6v2h-6v-2Zm0 4h6v2h-6v-2Z"}),play:c.jsx("path",{d:"M8 5v14l11-7L8 5Z"}),pause:c.jsx("path",{d:"M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"}),image:c.jsx("path",{d:"M3 4h18v16H3V4Zm2 2v9.6l4-4 4 4 2-2 4 4V6H5Zm10 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"})};function qe({name:e,size:t=16}){return c.jsx("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":!0,children:py[e]})}function De({icon:e,label:t,active:n,disabled:r,onClick:o,children:s}){return c.jsxs("button",{type:"button",className:`isd-btn${n?" is-active":""}`,title:t,"aria-label":t,"aria-pressed":n,disabled:r,onClick:o,children:[e&&c.jsx(qe,{name:e}),s&&c.jsx("span",{className:"isd-btn-label",children:s})]})}function ye({label:e,children:t}){return c.jsxs("label",{className:"isd-field",children:[c.jsx("span",{children:e}),t]})}function gn({value:e,onChange:t,step:n=.5,min:r,max:o}){return c.jsx("input",{type:"number",className:"isd-input",value:Number.isFinite(e)?+e.toFixed(3):0,step:n,min:r,max:o,onChange:s=>{const i=parseFloat(s.target.value);Number.isFinite(i)&&t(r!==void 0?Math.max(r,i):i)}})}const my=P.lazy(()=>ch(()=>import("./DocsPanel-BUKv8SoO.js"),[],import.meta.url)),Cn={palette:260,inspector:260,docs:440},jh="isodraw:panel-widths",gy=240;function yy(){try{const e=JSON.parse(localStorage.getItem(jh)??"{}"),t={...Cn};for(const n of Object.keys(Cn))typeof e[n]=="number"&&(t[n]=Math.max(Cn[n],e[n]));return t}catch{return{...Cn}}}const vy=1e3,io={nodes:[],edges:[]};function wy(e){var wc;const{readOnly:t,awsIcons:n=!0}=e,r=oc(e.theme),[o,s]=P.useState(()=>({d:e.value??e.defaultValue??qa(),past:[],future:[]})),i=o.d,l=i.view??e.defaultView??"3d",[a,d]=P.useState(0),[h,m]=P.useState({x:0,y:0,zoom:1}),[p,k]=P.useState(io),[g,x]=P.useState("select"),[A,y]=P.useState(!0),[u,v]=P.useState(!0),[j,z]=P.useState({}),[R,L]=P.useState("shapes"),[F,ce]=P.useState(""),[U,Qe]=P.useState(null),[ut,be]=P.useState(null),[Qt,ue]=P.useState(e.userIcons??[]),[Ve,dt]=P.useState(null),[D,V]=P.useState(!1),K=P.useRef(null),ie=P.useRef(null),[re,un]=P.useState(!1),[ze,dn]=P.useState(yy),[wt,Se]=P.useState(null),[fn,hn]=P.useState(!0),[Yt,Le]=P.useState(!0),[Pt,xt]=P.useState(!1),[Kr,ir]=P.useState(null),[ar,lr]=P.useState({kind:"diagram"}),$n=P.useRef(null),Zr=P.useRef(null),Fn=P.useRef(null),Zo=P.useRef(null),kt=P.useMemo(()=>new Oo(l,a),[l,a]),cr=e.userIcons??Qt,Go=f=>{var S;ue(f),(S=e.onUserIconsChange)==null||S.call(e,f)};P.useEffect(()=>{e.value&&e.value!==Zo.current&&e.value!==o.d&&s(f=>({d:e.value,past:[...f.past,f.d].slice(-200),future:[]}))},[e.value]),P.useEffect(()=>{var f;o.d!==e.value&&(Zo.current=o.d,(f=e.onChange)==null||f.call(e,o.d))},[o.d]),P.useEffect(()=>{if(!n)return;const f=new AbortController;return hy({signal:f.signal}).then(Qe).catch(S=>!f.signal.aborted&&be(String(S.message??S))),()=>f.abort()},[n]),P.useEffect(()=>{if(!Ve)return;const f=setTimeout(()=>dt(null),2200);return()=>clearTimeout(f)},[Ve]);const Ie=P.useCallback((f,S="push",C)=>{s(N=>{var Z;const B=typeof f=="function"?f(N.d):f;if(B===N.d)return N;const G=Date.now(),je=C&&((Z=Fn.current)==null?void 0:Z.key)===C&&G-Fn.current.t<1200;return Fn.current=C?{key:C,t:G}:null,S==="replace"||je?{...N,d:B}:{d:B,past:[...N.past,N.d].slice(-200),future:[]}})},[]),w=P.useCallback(()=>{Fn.current=null,s(f=>({d:f.d,past:[...f.past,f.d].slice(-200),future:[]}))},[]),E=(f,S)=>f.view===S.view?f:{...f,view:S.view},T=()=>s(f=>f.past.length?{d:E(f.past[f.past.length-1],f.d),past:f.past.slice(0,-1),future:[f.d,...f.future]}:f),_=()=>s(f=>f.future.length?{d:E(f.future[0],f.d),past:[...f.past,f.d],future:f.future.slice(1)}:f);P.useLayoutEffect(()=>{const f=K.current;if(!f)return;const S=N=>un(B=>{const G=N<vy;return G!==B&&(hn(!G),Le(!G)),G});S(f.getBoundingClientRect().width);const C=new ResizeObserver(([N])=>S(N.contentRect.width));return C.observe(f),()=>C.disconnect()},[]),P.useEffect(()=>{re&&!Pt&&!t&&(p.nodes.length||p.edges.length)&&Le(!0)},[re,p]);const O=p.nodes.length===1&&!p.edges.length?{kind:"node",id:p.nodes[0]}:p.edges.length===1&&!p.nodes.length?{kind:"edge",id:p.edges[0]}:!p.nodes.length&&!p.edges.length?{kind:"diagram"}:null;P.useEffect(()=>{if(O&&(lr(f=>Mg(f,O)?f:O),t&&O.kind!=="diagram")){const f=O.kind==="node"?i.nodes.find(S=>S.id===O.id):i.edges.find(S=>S.id===O.id);Ct(f==null?void 0:f.doc)&&xt(!0)}},[O&&Dr(O)]);const M=f=>{f&&(lr(f),k(f.kind==="diagram"?io:f.kind==="node"?{nodes:[f.id],edges:[]}:{nodes:[],edges:[f.id]})),xt(!0),re&&(Le(!1),hn(!1))},W=f=>{if(M(f),f.kind==="diagram")return;let S=null;if(f.kind==="node"){const G=i.nodes.find(je=>je.id===f.id);G&&(S=kt.project(G.x+G.w/2,G.y+G.d/2,G.z))}else{const G=i.edges.find(oe=>oe.id===f.id),je=G&&i.nodes.find(oe=>oe.id===G.from),Z=G&&i.nodes.find(oe=>oe.id===G.to);if(je&&Z){const oe=kt.project(je.x+je.w/2,je.y+je.d/2,je.z),Xe=kt.project(Z.x+Z.w/2,Z.y+Z.d/2,Z.z);S={x:(oe.x+Xe.x)/2,y:(oe.y+Xe.y)/2}}}if(!S)return;const{w:C,h:N}=X(),B=re?C:Math.max(C/2,C-ze.docs);m(G=>({...G,x:B/2-S.x*G.zoom,y:N/2-S.y*G.zoom}))},Y=(f,S)=>Ie(C=>Ng(C,f,S),"push",`doc:${Dr(f)}`),X=()=>{var S;const f=(S=ie.current)==null?void 0:S.getBoundingClientRect();return{w:(f==null?void 0:f.width)??800,h:(f==null?void 0:f.height)??600}},Oe=P.useCallback((f,S)=>{const{w:C,h:N}=X(),B=f.nodes.flatMap(zt=>Fe(zt).flatMap(qo=>[S.project(qo.x,qo.y,zt.z),S.project(qo.x,qo.y,zt.z+(Kt(zt)?0:zt.h))]));if(!B.length){m({x:C/2,y:N/3,zoom:1});return}const G=B.map(zt=>zt.x),je=B.map(zt=>zt.y),Z=Math.min(...G),oe=Math.max(...G),Xe=Math.min(...je),Xo=Math.max(...je)+24,Xr=Math.min(1.6,Math.max(.2,Math.min(C*.85/(oe-Z||1),N*.85/(Xo-Xe||1))));m({zoom:Xr,x:C/2-(Z+oe)/2*Xr,y:N/2-(Xe+Xo)/2*Xr})},[]);P.useEffect(()=>{const f=ie.current;if(!f)return;const S=new ResizeObserver(([C])=>{C.contentRect.width<10||C.contentRect.height<10||(S.disconnect(),Oe(o.d,kt))});return S.observe(f),()=>S.disconnect()},[]);const Q=(f=kt,S=h)=>{const{w:C,h:N}=X();return f.unproject((C/2-S.x)/S.zoom,(N/2-S.y)/S.zoom)},I=(f,S)=>{const C=Q(),B=new Oo(f,S).project(C.x,C.y),{w:G,h:je}=X();m({...h,x:G/2-B.x*h.zoom,y:je/2-B.y*h.zoom}),f!==l&&s(Z=>({...Z,d:{...Z.d,view:f}})),d(S)},H=f=>{const{w:S,h:C}=X(),N=Math.min(4,Math.max(.15,h.zoom*f)),B=N/h.zoom;m({zoom:N,x:S/2-(S/2-h.x)*B,y:C/2-(C/2-h.y)*B})},ne=f=>{Ie(S=>({...S,nodes:[...S.nodes,f]})),k({nodes:[f.id],edges:[]}),x("select")},ee=(f,S)=>{t||(re&&hn(!1),f.type==="shape"&&f.kind&&ne(Ps(f.kind,S.x,S.y)),f.type==="icon"&&f.src&&ne(Sg(f.src,f.name??"",S.x,S.y)))},me=(f,S,C)=>Ie(N=>({...N,nodes:N.nodes.map(B=>B.id===f?{...B,...S}:B)}),"push",C&&`${f}:${C}`),ae=(f,S)=>Ie(C=>({...C,nodes:C.nodes.map(N=>f.includes(N.id)?{...N,...S}:N)})),le=(f,S,C)=>{const N=Object.fromEntries(Object.entries(S).filter(([B])=>Cg.includes(B)));Object.keys(N).length&&z(B=>({...B,...N})),rt(f,S,C)},rt=(f,S,C)=>Ie(N=>({...N,edges:N.edges.map(B=>B.id===f?{...B,...S}:B)}),"push",C&&`${f}:${C}`),ot=f=>new Set([...f,...jr(f,i.nodes)]),pn=()=>{if(!p.nodes.length&&!p.edges.length)return;const f=ot(p.nodes),S=new Set(p.edges);Ie(C=>({...C,nodes:C.nodes.filter(N=>!f.has(N.id)),edges:C.edges.filter(N=>!S.has(N.id)&&!f.has(N.from)&&!f.has(N.to))})),k(io)},Ye=()=>{const f=ot(p.nodes);Zr.current={nodes:i.nodes.filter(S=>f.has(S.id)),edges:i.edges.filter(S=>f.has(S.from)&&f.has(S.to))}},At=(f=1)=>{const S=Zr.current;if(!(S!=null&&S.nodes.length))return;const C=new Map,N=S.nodes.map(Z=>{const oe=Cr("n");return C.set(Z.id,oe),{...Z,id:oe,x:Z.x+f,y:Z.y+f}}),B=S.edges.map(Z=>{var oe;return{...Z,id:Cr("e"),from:C.get(Z.from),to:C.get(Z.to),waypoints:(oe=Z.waypoints)==null?void 0:oe.map(Xe=>({x:Xe.x+f,y:Xe.y+f}))}});Ie(Z=>({...Z,nodes:[...Z.nodes,...N],edges:[...Z.edges,...B]}));const G=new Set(N.map(Z=>Z.id)),je=jr(G,N);k({nodes:N.filter(Z=>!je.has(Z.id)).map(Z=>Z.id),edges:[]}),Zr.current={nodes:N,edges:B}},Gr=()=>{const f=i.nodes.filter(B=>p.nodes.includes(B.id));if(!f.length)return;const S=Du(f),C=En({...f[0],...S,kind:"area"},i.nodes,new Set(f.map(B=>B.id))),N={...Ps("area",0,0,{z:Math.min(...f.map(B=>B.z)),color:"#64748b",opacity:.08,dashed:!0,label:"Group"}),...S};Ie(B=>({...B,nodes:[N,...B.nodes]})),k({nodes:[N.id],edges:[]}),dt(C?`Grouped inside ${C.label||"area"}`:"Grouped")},dc=()=>{const f=i.nodes.filter(N=>p.nodes.includes(N.id)&&ln(N));if(!f.length)return;const S=new Set(f.map(N=>N.id)),C=i.nodes.filter(N=>!S.has(N.id)&&f.some(B=>{var G;return((G=En(N,i.nodes))==null?void 0:G.id)===B.id}));Ie(N=>({...N,nodes:N.nodes.filter(B=>!S.has(B.id))})),k({nodes:C.map(N=>N.id),edges:[]})},bh=f=>{const S=i.nodes.find(B=>B.id===f),C=jr([f],i.nodes),N=i.nodes.filter(B=>C.has(B.id));S&&N.length&&me(f,Du(N))},Nh=f=>{const S=new Set(p.nodes);Ie(C=>{const N=C.nodes.filter(G=>S.has(G.id)),B=C.nodes.filter(G=>!S.has(G.id));return{...C,nodes:f==="front"?[...B,...N]:[...N,...B]}})},Ph=f=>{if(f.target.closest('input,textarea,select,[contenteditable="true"]'))return;const S=f.metaKey||f.ctrlKey,C=f.key.toLowerCase();if(S&&C==="z")f.preventDefault(),f.shiftKey?_():T();else if(S&&C==="y")f.preventDefault(),_();else if(C==="d"&&!S)Pt?xt(!1):M();else if(S&&C==="a")f.preventDefault(),k({nodes:i.nodes.map(N=>N.id),edges:[]});else{if(t)return;if(C==="delete"||C==="backspace")f.preventDefault(),pn();else if(S&&C==="c")Ye();else if(S&&C==="x")Ye(),pn();else if(S&&C==="v")At();else if(S&&C==="g")f.preventDefault(),f.shiftKey?dc():Gr();else if(S&&C==="d")f.preventDefault(),Ye(),At();else if(C==="escape")k(io),x("select");else if(C==="v"&&!S)x("select");else if(C==="c"&&!S)x("connect");else if(C==="tab")f.preventDefault(),I(l==="3d"?"2d":"3d",a);else if(C==="r"&&l==="3d")I(l,(a+(f.shiftKey?3:1))%4);else if(C.startsWith("arrow")&&p.nodes.length){f.preventDefault();const N=f.shiftKey?1:.5,G={arrowleft:{x:-1,y:0},arrowright:{x:1,y:0},arrowup:{x:0,y:-1},arrowdown:{x:0,y:1}}[C],je=ot(p.nodes.filter(Z=>{var oe;return!((oe=i.nodes.find(Xe=>Xe.id===Z))!=null&&oe.locked)}));Ie(Z=>({...Z,nodes:Z.nodes.map(oe=>je.has(oe.id)&&!oe.locked?{...oe,x:oe.x+G.x*N,y:oe.y+G.y*N}:oe)}),"push","nudge")}}},fc=P.useRef(null),Ei=P.useRef(null),Qr=async f=>{V(!1);try{f==="docs"&&ys(Pg(i),"architecture.md","text/markdown"),f==="json"&&ys(ly(i),"diagram.json","application/json");const S=r==="dark"?Ag.dark:void 0;f==="svg"&&$n.current&&ys(await Ch($n.current,{background:S}),"diagram.svg","image/svg+xml"),f==="png"&&$n.current&&ys(await ay($n.current,{background:S}),"diagram.png")}catch(S){dt(`Export failed: ${S.message}`)}},hc=async f=>{try{const S=Tg(JSON.parse(await f.text()));Ie(S),k(io),Oe(S,kt),dt(`Imported ${S.nodes.length} nodes`)}catch(S){dt(S.message)}},pc=async f=>{const S=[];for(const C of Array.from(f))C.type.startsWith("image/")&&S.push({id:Cr("img"),name:C.name.replace(/\.[^.]+$/,""),src:await cy(C),category:"Imported"});S.length&&(Go([...cr,...S]),L("mine"),dt(`Imported ${S.length} image${S.length>1?"s":""}`))},mc=()=>{var C;const f=window.prompt("Image URL (PNG, SVG, JPG…)");if(!f)return;const S=((C=f.split("/").pop())==null?void 0:C.replace(/\.[^.]+$/,""))||"Image";Go([...cr,{id:Cr("img"),name:S,src:f,category:"Imported"}]),L("mine")},gc=[...U?[U]:[],...e.iconLibraries??[],{id:"mine",name:"My images",icons:cr}],ur=gc.find(f=>f.id===R),Qo=F.trim().toLowerCase(),Yo=ur?ur.icons.filter(f=>{var S;return!Qo||f.name.toLowerCase().includes(Qo)||((S=f.category)==null?void 0:S.toLowerCase().includes(Qo))}):[],Ah=P.useMemo(()=>{const f=new Map;for(const S of Yo.slice(0,400)){const C=S.category??"";f.has(C)||f.set(C,[]),f.get(C).push(S)}return[...f.entries()]},[ur,Qo]),yc=f=>S=>{S.dataTransfer.setData(sl,JSON.stringify(f)),S.dataTransfer.effectAllowed="copy"},zh=f=>{var N,B;const S=((N=K.current)==null?void 0:N.clientWidth)??1200;if(f==="docs")return Math.max(Cn.docs,(((B=ie.current)==null?void 0:B.clientWidth)??S)-80);const C=f==="palette"?Yt?ze.inspector:0:fn?ze.palette:0;return Math.max(Cn[f],S-C-gy)},vc=f=>{try{localStorage.setItem(jh,JSON.stringify(f))}catch{}},Lh=(f,S)=>C=>{if(C.button!==0)return;C.preventDefault();const N=C.currentTarget,B=C.clientX,G=ze[f],je=zh(f);let Z=ze;N.setPointerCapture(C.pointerId),Se(f);const oe=Xo=>{const Xr=Math.round(Math.min(je,Math.max(Cn[f],G+S*(Xo.clientX-B))));dn(zt=>Z={...zt,[f]:Xr})},Xe=()=>{N.removeEventListener("pointermove",oe),N.removeEventListener("pointerup",Xe),N.removeEventListener("pointercancel",Xe),Se(null),vc(Z)};N.addEventListener("pointermove",oe),N.addEventListener("pointerup",Xe),N.addEventListener("pointercancel",Xe)},Ih=f=>dn(S=>{const C={...S,[f]:Cn[f]};return vc(C),C}),Ci=(f,S,C)=>re?null:c.jsx("div",{className:`isd-resizer is-${f}${wt===f?" is-active":""}`,role:"separator","aria-orientation":"vertical","aria-label":`Resize ${C}`,title:"Drag to resize · double-click to reset",onPointerDown:Lh(f,S),onDoubleClick:()=>Ih(f)}),Xt=p.nodes.length===1?i.nodes.find(f=>f.id===p.nodes[0]):void 0,Yr=p.edges.length===1&&!p.nodes.length?i.edges.find(f=>f.id===p.edges[0]):void 0;return c.jsx(rc.Provider,{value:r,children:c.jsxs("div",{ref:K,"data-theme":r,className:`isd-root${re?" is-compact":""}${wt?" is-resizing":""} ${e.className??""}`,style:{"--isd-palette-w":`${ze.palette}px`,"--isd-inspector-w":`${ze.inspector}px`,"--isd-docs-w":`${ze.docs}px`,...e.style},onKeyDown:Ph,onDragOver:f=>f.dataTransfer.types.includes("Files")&&f.preventDefault(),onDrop:f=>{if(f.dataTransfer.files.length&&!t){f.preventDefault();const S=Array.from(f.dataTransfer.files),C=S.find(N=>N.name.endsWith(".json"));C?hc(C):pc(S)}},children:[c.jsxs("div",{className:"isd-toolbar-wrap",children:[c.jsxs("div",{className:"isd-toolbar",children:[!t&&c.jsx("div",{className:"isd-group",children:c.jsx(De,{icon:"panelL",label:fn?"Hide shapes & icons":"Show shapes & icons",active:fn,onClick:()=>hn(!fn)})}),c.jsxs("div",{className:"isd-group",children:[c.jsx(De,{icon:"cube",label:"2.5D view (Tab)",active:l==="3d",onClick:()=>I("3d",a),children:"2.5D"}),c.jsx(De,{icon:"square",label:"Flat view (Tab)",active:l==="2d",onClick:()=>I("2d",a),children:"2D"})]}),c.jsxs("div",{className:"isd-group",children:[c.jsx(De,{icon:"rotl",label:"Rotate left (Shift+R)",disabled:l==="2d",onClick:()=>I(l,(a+3)%4)}),c.jsx(De,{icon:"rotr",label:"Rotate right (R)",disabled:l==="2d",onClick:()=>I(l,(a+1)%4)})]}),!t&&c.jsxs("div",{className:"isd-group",children:[c.jsx(De,{icon:"pointer",label:"Select (V)",active:g==="select",onClick:()=>x("select")}),c.jsx(De,{icon:"link",label:"Connect (C): drag from one node to another",active:g==="connect",onClick:()=>x("connect")})]}),!t&&c.jsxs("div",{className:"isd-group",children:[c.jsx(De,{icon:"undo",label:"Undo (⌘Z)",disabled:!o.past.length,onClick:T}),c.jsx(De,{icon:"redo",label:"Redo (⇧⌘Z)",disabled:!o.future.length,onClick:_})]}),c.jsxs("div",{className:"isd-group isd-hide-compact",children:[c.jsx(De,{icon:"minus",label:"Zoom out",onClick:()=>H(1/1.25)}),c.jsxs("span",{className:"isd-zoom",children:[Math.round(h.zoom*100),"%"]}),c.jsx(De,{icon:"plus",label:"Zoom in",onClick:()=>H(1.25)})]}),c.jsxs("div",{className:"isd-group",children:[c.jsx(De,{icon:"fit",label:"Fit to content",onClick:()=>Oe(i,kt)}),c.jsx(De,{icon:"grid",label:"Toggle grid",active:A,onClick:()=>y(!A)}),c.jsx(De,{icon:u?"pause":"play",label:u?"Pause connection animations":"Play connection animations",onClick:()=>v(!u)})]}),c.jsx("div",{className:"isd-spacer"}),!t&&c.jsx("div",{className:"isd-group",children:c.jsx(De,{icon:"upload",label:"Open diagram (.json)",onClick:()=>{var f;return(f=fc.current)==null?void 0:f.click()},children:"Open"})}),c.jsx("div",{className:"isd-group",children:c.jsx(De,{icon:"doc",label:Pt?"Hide docs (D)":"Show docs (D)",active:Pt,onClick:()=>Pt?xt(!1):M(),children:"Docs"})}),c.jsx("div",{className:"isd-group",children:c.jsx(De,{icon:"download",label:"Export",active:D,onClick:()=>V(!D),children:"Export"})}),!t&&c.jsx("div",{className:"isd-group",children:c.jsx(De,{icon:"panelR",label:Yt?"Hide inspector":"Show inspector",active:Yt,onClick:()=>Le(!Yt)})}),c.jsx("input",{ref:fc,type:"file",accept:".json,application/json",hidden:!0,onChange:f=>{var C;const S=(C=f.target.files)==null?void 0:C[0];S&&hc(S),f.target.value=""}}),c.jsx("input",{ref:Ei,type:"file",accept:"image/*",multiple:!0,hidden:!0,onChange:f=>{f.target.files&&pc(f.target.files),f.target.value=""}})]}),D&&c.jsxs("div",{className:"isd-menu",onMouseLeave:()=>V(!1),children:[c.jsx("button",{type:"button",onClick:()=>Qr("png"),children:"PNG image"}),c.jsx("button",{type:"button",onClick:()=>Qr("svg"),children:"SVG vector"}),c.jsx("button",{type:"button",onClick:()=>Qr("json"),children:"Diagram JSON"}),c.jsx("button",{type:"button",onClick:()=>Qr("docs"),children:"Docs (Markdown)"})]})]}),c.jsxs("div",{className:"isd-body",children:[!t&&fn&&c.jsxs("aside",{className:"isd-palette",children:[re&&c.jsx("button",{type:"button",className:"isd-drawer-close","aria-label":"Close panel",onClick:()=>hn(!1),children:c.jsx(qe,{name:"close"})}),c.jsxs("div",{className:"isd-tabs",role:"tablist",children:[[{id:"shapes",name:"Shapes"},...gc].map(f=>c.jsx("button",{type:"button",role:"tab","aria-selected":R===f.id,className:R===f.id?"is-active":"",onClick:()=>L(f.id),children:f.name},f.id)),n&&!U&&c.jsx("span",{className:"isd-tab-note",children:ut?"AWS icons unavailable":"Loading AWS…"})]}),R==="shapes"?c.jsxs("div",{className:"isd-palette-scroll",children:[c.jsx("div",{className:"isd-shape-grid",children:dh.map(f=>c.jsxs("button",{type:"button",className:"isd-tile",draggable:!0,onDragStart:yc({type:"shape",kind:f.kind}),onClick:()=>ee({type:"shape",kind:f.kind},Q()),title:`${f.name} — click or drag onto canvas`,children:[c.jsx(ry,{node:Ps(f.kind,0,0,{id:`pv-${f.kind}`,text:"Aa",fontSize:1.4})}),c.jsx("span",{children:f.name})]},f.kind))}),c.jsx("div",{className:"isd-section-title",children:"Images & logos"}),c.jsxs("div",{className:"isd-import-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{var f;return(f=Ei.current)==null?void 0:f.click()},children:[c.jsx(qe,{name:"upload"})," Upload"]}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:mc,children:[c.jsx(qe,{name:"link"})," From URL"]})]}),c.jsx("p",{className:"isd-hint",children:"Tip: drop image files anywhere on the editor to import them."})]}):c.jsxs(c.Fragment,{children:[c.jsx("div",{className:"isd-search",children:c.jsx("input",{className:"isd-input",placeholder:`Search ${(ur==null?void 0:ur.name)??""}…`,value:F,onChange:f=>ce(f.target.value)})}),c.jsxs("div",{className:"isd-palette-scroll",children:[R==="mine"&&c.jsxs("div",{className:"isd-import-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{var f;return(f=Ei.current)==null?void 0:f.click()},children:[c.jsx(qe,{name:"upload"})," Upload"]}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:mc,children:[c.jsx(qe,{name:"link"})," From URL"]})]}),Ah.map(([f,S])=>c.jsxs("div",{children:[f&&c.jsx("div",{className:"isd-section-title",children:f}),c.jsx("div",{className:"isd-icon-grid",children:S.map(C=>c.jsxs("button",{type:"button",className:"isd-icon-tile",title:C.name,draggable:!0,onDragStart:yc({type:"icon",src:C.src,name:C.name}),onClick:()=>ee({type:"icon",src:C.src,name:C.name},Q()),children:[c.jsx("img",{src:C.src,alt:"",loading:"lazy",draggable:!1}),c.jsx("span",{children:C.name.replace(/^(Amazon|AWS) /,"")})]},C.id))})]},f)),Yo.length>400&&c.jsxs("p",{className:"isd-hint",children:["Showing 400 of ",Yo.length,". Refine your search."]}),!Yo.length&&c.jsx("p",{className:"isd-hint",children:R==="mine"?"No images yet. Upload PNG/SVG logos to use them as nodes.":"No matches."})]})]})]}),!t&&fn&&Ci("palette",1,"shapes panel"),c.jsxs("div",{className:"isd-stage",ref:ie,children:[c.jsx(sy,{svgRef:$n,diagram:i,view:l,rotation:a,camera:h,onCameraChange:m,selection:p,onSelectionChange:k,tool:g,readOnly:t,showGrid:A,animate:u,onOpenDocs:M,focus:Pt?Kr:null,showDocBadges:e.docBadges,newEdgeStyle:{routing:"orthogonal",rounded:!0,...j},onBeginChange:w,onChange:f=>Ie(f,"replace"),onConnect:(f,S,C)=>{const N=Eg(f,S,{...j,...C});Ie(B=>({...B,edges:[...B.edges,N]})),k({nodes:[],edges:[N.id]})},onDropPayload:(f,S)=>{try{ee(JSON.parse(f),S)}catch{}}}),c.jsxs("div",{className:"isd-status",children:[l==="3d"?`2.5D · ${["N","E","S","W"][a]}`:"Flat"," · ",i.nodes.length," nodes · ",i.edges.length," connections"]}),Ve&&c.jsx("div",{className:"isd-toast",children:Ve}),Pt&&Ci("docs",-1,"docs panel"),Pt&&c.jsx(P.Suspense,{fallback:c.jsx("aside",{className:"isd-docs isd-docs-loading",children:"Loading editor…"}),children:c.jsx(my,{target:ar,diagram:i,readOnly:t,onChange:Y,onNavigate:W,onMentionHover:ir,onClose:()=>xt(!1),onExport:()=>void Qr("docs")})})]}),!t&&Yt&&Ci("inspector",-1,"properties panel"),!t&&Yt&&c.jsxs("aside",{className:"isd-inspector",children:[re&&c.jsx("button",{type:"button",className:"isd-drawer-close","aria-label":"Close inspector",onClick:()=>Le(!1),children:c.jsx(qe,{name:"close"})}),Xt?c.jsx(xy,{node:Xt,onOpenDocs:()=>M({kind:"node",id:Xt.id}),parent:En(Xt,i.nodes),contents:ln(Xt)?jr([Xt.id],i.nodes).size:0,onSelectNodes:f=>k({nodes:f,edges:[]}),onSelectContents:()=>k({nodes:i.nodes.filter(f=>{var S;return((S=En(f,i.nodes))==null?void 0:S.id)===Xt.id}).map(f=>f.id),edges:[]}),onFitContents:()=>bh(Xt.id),onUngroup:dc,onChange:(f,S)=>me(Xt.id,f,S),onDelete:pn,onDuplicate:()=>{Ye(),At()},onReorder:Nh}):Yr?c.jsx(Sy,{edge:Yr,onOpenDocs:()=>M({kind:"edge",id:Yr.id}),onChange:(f,S)=>le(Yr.id,f,S),onRoute:f=>rt(Yr.id,f),onDelete:pn}):p.nodes.length>1?c.jsxs("div",{className:"isd-panel",children:[c.jsxs("h3",{children:[p.nodes.length," nodes selected"]}),c.jsx(ye,{label:"Color",children:c.jsx(lc,{value:"",onChange:f=>ae(p.nodes,{color:f})})}),c.jsx(ye,{label:"Elevation",children:c.jsx(gn,{value:((wc=i.nodes.find(f=>f.id===p.nodes[0]))==null?void 0:wc.z)??0,onChange:f=>ae(p.nodes,{z:f})})}),c.jsxs("button",{type:"button",className:"isd-btn",onClick:Gr,title:"Wrap the selection in a new area (⌘G)",children:[c.jsx(qe,{name:"group"})," Group into area"]}),c.jsxs("div",{className:"isd-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:()=>{Ye(),At()},children:[c.jsx(qe,{name:"copy"})," Duplicate"]}),c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:pn,children:[c.jsx(qe,{name:"trash"})," Delete"]})]})]}):c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:"Diagram"}),c.jsx("p",{className:"isd-hint",children:"Click a shape or icon to add it, or drag it onto the canvas. Select a node to edit it."}),c.jsx(ac,{has:Ct(i.doc),label:"diagram overview",onClick:()=>M({kind:"diagram"})}),c.jsxs("dl",{className:"isd-keys",children:[c.jsx("dt",{children:"Drag empty space"}),c.jsx("dd",{children:"Pan"}),c.jsx("dt",{children:"Scroll / pinch"}),c.jsx("dd",{children:"Zoom"}),c.jsx("dt",{children:"Shift + drag"}),c.jsx("dd",{children:"Box select"}),c.jsx("dt",{children:"C / V"}),c.jsx("dd",{children:"Connect / Select tool"}),c.jsx("dt",{children:"Tab"}),c.jsx("dd",{children:"Toggle 2D / 2.5D"}),c.jsx("dt",{children:"R / Shift+R"}),c.jsx("dd",{children:"Rotate view"}),c.jsx("dt",{children:"Arrows"}),c.jsx("dd",{children:"Nudge"}),c.jsx("dt",{children:"Alt + drag"}),c.jsx("dd",{children:"Move without snapping"}),c.jsx("dt",{children:"⌘D / ⌘C / ⌘V"}),c.jsx("dd",{children:"Duplicate / copy / paste"}),c.jsx("dt",{children:"⌘G / ⇧⌘G"}),c.jsx("dd",{children:"Group into area / ungroup"}),c.jsx("dt",{children:"D / double-click"}),c.jsx("dd",{children:"Open docs"}),c.jsx("dt",{children:"⌘Z / ⇧⌘Z"}),c.jsx("dd",{children:"Undo / redo"})]}),i.nodes.length>0&&c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:()=>{window.confirm("Clear the whole diagram?")&&Ie(qa())},children:[c.jsx(qe,{name:"trash"})," Clear diagram"]})]})]})]})]})})}function ac({has:e,label:t,onClick:n}){return c.jsxs("button",{type:"button",className:`isd-btn isd-docs-btn${e?" has-doc":""}`,onClick:n,title:"Open the docs panel (D)",children:[c.jsx(qe,{name:"doc"})," ",e?`Open ${t}`:`Add ${t}`]})}function lc({value:e,onChange:t}){return c.jsxs("div",{className:"isd-swatches",children:[kg.map(n=>c.jsx("button",{type:"button",className:`isd-swatch${n.toLowerCase()===e.toLowerCase()?" is-active":""}`,style:{background:n},title:n,onClick:()=>t(n)},n)),c.jsx("input",{type:"color",className:"isd-color",value:/^#[0-9a-f]{6}$/i.test(e)?e:"#4f8cf7",onChange:n=>t(n.target.value),title:"Custom color"})]})}function xy({node:e,onOpenDocs:t,parent:n,contents:r,onChange:o,onDelete:s,onDuplicate:i,onReorder:l,onSelectNodes:a,onSelectContents:d,onFitContents:h,onUngroup:m}){const p=Kt(e),k=e.kind==="area"||e.kind==="circleArea",g=["block","cylinder","hexagon","pyramid","cone","sphere"];return c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:Ir[e.kind]}),c.jsx(ac,{has:Ct(e.doc),label:ln(e)?"area docs":"docs",onClick:t}),n&&c.jsxs("button",{type:"button",className:"isd-breadcrumb",onClick:()=>a([n.id]),title:"Select the containing area",children:["Inside ",c.jsx("strong",{children:n.label||Ir[n.kind]})]}),ln(e)&&c.jsxs("div",{className:"isd-container-box",children:[c.jsx("span",{children:r?`Contains ${r} item${r===1?"":"s"} — they move with this area.`:"Drop shapes inside to group them with this area."}),r>0&&c.jsxs("div",{className:"isd-container-actions",children:[c.jsx("button",{type:"button",className:"isd-btn is-wide",onClick:d,children:"Select contents"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:h,title:"Resize to wrap the contents",children:"Fit to contents"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:m,title:"Remove the area, keep its contents (⇧⌘G)",children:"Ungroup"})]})]}),e.kind==="text"?c.jsx(ye,{label:"Text",children:c.jsx("textarea",{className:"isd-input",rows:3,value:e.text??"",onChange:x=>o({text:x.target.value},"text")})}):c.jsx(ye,{label:"Label",children:c.jsx("input",{className:"isd-input",value:e.label??"",placeholder:"Add a label",onChange:x=>o({label:x.target.value},"label")})}),g.includes(e.kind)&&c.jsx(ye,{label:"Shape",children:c.jsx("select",{className:"isd-input",value:e.kind,onChange:x=>o({kind:x.target.value}),children:g.map(x=>c.jsx("option",{value:x,children:Ir[x]},x))})}),e.kind!=="image"||e.imageStyle==="tile"?c.jsx(ye,{label:e.kind==="image"?"Tile color":"Color",children:c.jsx(lc,{value:e.color,onChange:x=>o({color:x})})}):null,e.kind==="image"&&c.jsxs(c.Fragment,{children:[c.jsx(ye,{label:"Style",children:c.jsxs("select",{className:"isd-input",value:e.imageStyle??"tile",onChange:x=>o({imageStyle:x.target.value}),children:[c.jsx("option",{value:"tile",children:"Tile (icon on a block)"}),c.jsx("option",{value:"flat",children:"Flat (on the ground)"}),c.jsx("option",{value:"standing",children:"Standing (billboard)"})]})}),c.jsx("div",{className:"isd-image-preview",children:c.jsx("img",{src:e.src,alt:""})})]}),c.jsxs("div",{className:"isd-grid2",children:[c.jsx(ye,{label:"X",children:c.jsx(gn,{value:e.x,onChange:x=>o({x},"x")})}),c.jsx(ye,{label:"Y",children:c.jsx(gn,{value:e.y,onChange:x=>o({y:x},"y")})}),c.jsx(ye,{label:"Width",children:c.jsx(gn,{value:e.w,min:.5,onChange:x=>o({w:x},"w")})}),c.jsx(ye,{label:"Depth",children:c.jsx(gn,{value:e.d,min:.5,onChange:x=>o({d:x},"d")})}),!p&&e.kind!=="sphere"&&c.jsx(ye,{label:"Height",children:c.jsx(gn,{value:e.h,min:.1,step:.25,onChange:x=>o({h:x},"h")})}),c.jsx(ye,{label:"Elevation",children:c.jsx(gn,{value:e.z,step:.25,onChange:x=>o({z:x},"z")})})]}),e.kind==="text"&&c.jsx(ye,{label:"Font size",children:c.jsx(gn,{value:e.fontSize??.7,min:.2,step:.1,onChange:x=>o({fontSize:x},"fs")})}),c.jsx(ye,{label:k?"Fill opacity":"Opacity",children:c.jsx("input",{type:"range",min:0,max:1,step:.05,value:e.opacity??(k?.18:1),onChange:x=>o({opacity:parseFloat(x.target.value)},"opacity")})}),k&&c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.dashed,onChange:x=>o({dashed:x.target.checked})})," Dashed border"]}),e.kind!=="text"&&c.jsx(ye,{label:"Label color",children:c.jsx("input",{type:"color",className:"isd-color",value:e.labelColor??"#1f2937",onChange:x=>o({labelColor:x.target.value},"lc")})}),c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.locked,onChange:x=>o({locked:x.target.checked})})," Lock position"]}),c.jsxs("div",{className:"isd-row",children:[c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>l("back"),title:"Draw first among flat items",children:"To back"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>l("front"),children:"To front"})]}),c.jsxs("div",{className:"isd-row",children:[c.jsxs("button",{type:"button",className:"isd-btn",onClick:i,children:[c.jsx(qe,{name:"copy"})," Duplicate"]}),c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:s,title:r?"Deletes the area and everything inside it":void 0,children:[c.jsx(qe,{name:"trash"})," ",r?"Delete all":"Delete"]})]})]})}function ta({value:e,options:t,onChange:n}){return c.jsx("div",{className:"isd-segmented",role:"radiogroup",children:t.map(([r,o])=>c.jsx("button",{type:"button",role:"radio","aria-checked":e===r,className:e===r?"is-active":"",onClick:()=>n(r),children:o},r))})}const Wu=[["none","None"],["arrow","Arrow"],["open","Open arrow"],["circle","Circle"],["diamond","Diamond"]],ky=[["none","None"],["flow","Flow (marching dashes)"],["packets","Data packets"],["pulse","Pulse (travelling)"],["glow","Glow (breathing)"]];function Sy({edge:e,onOpenDocs:t,onChange:n,onRoute:r,onDelete:o}){var l;const s=e.animation??"none",i=!!(e.fromAnchor||e.toAnchor||(l=e.waypoints)!=null&&l.length);return c.jsxs("div",{className:"isd-panel",children:[c.jsx("h3",{children:"Connection"}),c.jsx(ac,{has:Ct(e.doc),label:"docs",onClick:t}),c.jsx(ye,{label:"Label",children:c.jsx("input",{className:"isd-input",value:e.label??"",placeholder:"e.g. HTTPS",onChange:a=>n({label:a.target.value},"label")})}),c.jsx(ye,{label:"Color",children:c.jsx(lc,{value:e.color,onChange:a=>n({color:a})})}),c.jsx("div",{className:"isd-section-title",children:"Path"}),c.jsx(ta,{value:e.routing,options:[["orthogonal","Right-angle"],["straight","Straight"],["curved","Curved"]],onChange:a=>n({routing:a})}),e.routing==="orthogonal"&&c.jsxs("label",{className:"isd-check",children:[c.jsx("input",{type:"checkbox",checked:!!e.rounded,onChange:a=>n({rounded:a.target.checked})})," Rounded corners"]}),c.jsx("p",{className:"isd-hint",children:e.routing==="orthogonal"?"Drag the square handles to move segments. Drag an end dot onto any side of a node to re-attach it.":"Drag the small dots to add bends; double-click a bend to remove it. Drag an end dot to re-attach."}),c.jsxs("div",{className:"isd-row",children:[c.jsx("button",{type:"button",className:"isd-btn",disabled:!i,onClick:()=>r({fromAnchor:void 0,toAnchor:void 0,waypoints:void 0}),children:"Reset route"}),c.jsx("button",{type:"button",className:"isd-btn",onClick:()=>{var a;return r({from:e.to,to:e.from,fromAnchor:e.toAnchor,toAnchor:e.fromAnchor,waypoints:(a=e.waypoints)==null?void 0:a.slice().reverse()})},children:"Reverse"})]}),c.jsx("div",{className:"isd-section-title",children:"Line"}),c.jsx(ta,{value:hh(e),options:[["solid","Solid"],["dashed","Dashed"],["dotted","Dotted"]],onChange:a=>n({lineStyle:a,dashed:void 0})}),c.jsx(ye,{label:"Width",children:c.jsx("input",{type:"range",min:1,max:8,step:.5,value:e.width,onChange:a=>n({width:parseFloat(a.target.value)},"w")})}),c.jsxs("div",{className:"isd-grid2",children:[c.jsx(ye,{label:"Start",children:c.jsx("select",{className:"isd-input",value:ph(e),onChange:a=>n({startMarker:a.target.value,arrowStart:void 0}),children:Wu.map(([a,d])=>c.jsx("option",{value:a,children:d},a))})}),c.jsx(ye,{label:"End",children:c.jsx("select",{className:"isd-input",value:mh(e),onChange:a=>n({endMarker:a.target.value,arrowEnd:void 0}),children:Wu.map(([a,d])=>c.jsx("option",{value:a,children:d},a))})})]}),c.jsx("div",{className:"isd-section-title",children:"Animation"}),c.jsx("select",{className:"isd-input",value:s,onChange:a=>n({animation:a.target.value}),children:ky.map(([a,d])=>c.jsx("option",{value:a,children:d},a))}),s!=="none"&&c.jsxs(c.Fragment,{children:[s!=="glow"&&c.jsx(ta,{value:e.animationDirection??"forward",options:s==="flow"?[["forward","Forward"],["reverse","Reverse"]]:[["forward","Forward"],["reverse","Reverse"],["both","Both ways"]],onChange:a=>n({animationDirection:a})}),c.jsx(ye,{label:`Speed · ${(e.animationSpeed??1).toFixed(2).replace(/\.?0+$/,"")}×`,children:c.jsx("input",{type:"range",min:.25,max:3,step:.25,value:e.animationSpeed??1,onChange:a=>n({animationSpeed:parseFloat(a.target.value)},"speed")})}),s!=="flow"&&s!=="glow"&&c.jsx(ye,{label:"Highlight color",children:c.jsx("input",{type:"color",className:"isd-color",value:e.animationColor??Dn(e.color,1.55),onChange:a=>n({animationColor:a.target.value},"ac")})})]}),c.jsx("div",{className:"isd-row",children:c.jsxs("button",{type:"button",className:"isd-btn is-danger",onClick:o,children:[c.jsx(qe,{name:"trash"})," Delete"]})})]})}const Ey=P.lazy(()=>ch(()=>import("./PublishedView-BaDfty2C.js"),__vite__mapDeps([0,1]),import.meta.url));function Cy(e){const t=oc(e.theme);return c.jsx(P.Suspense,{fallback:c.jsx("div",{className:"isd-pub isd-pub-loading","data-theme":t,children:"Loading…"}),children:c.jsx(Ey,{...e,resolvedTheme:t})})}function As(e,t,n={}){const r=new Map,o=t.split(/^<!-- (diagram|(?:node|edge):[\w-]+) -->$/m);for(let s=1;s<o.length;s+=2){const i=o[s+1].replace(/<!-- embed:([\w-]+) -->/g,(l,a)=>{const d=n[a];if(!d)throw new Error(`Unknown embed "${a}"`);return"```isodraw\n"+JSON.stringify(d)+"\n```"});r.set(o[s],i.trim())}return{...e,doc:r.get("diagram")??e.doc,nodes:e.nodes.map(s=>r.has(`node:${s.id}`)?{...s,doc:r.get(`node:${s.id}`)}:s),edges:e.edges.map(s=>r.has(`edge:${s.id}`)?{...s,doc:r.get(`edge:${s.id}`)}:s)}}const jy=`<!-- diagram -->
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
`,Ty=`<!-- diagram -->
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
`,My=`<!-- diagram -->
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
`,by=`<!-- diagram -->
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
`,na="https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons/architecture-service",Ny={version:1,nodes:[{id:"title",kind:"text",x:0,y:-4,w:16,d:2,h:0,z:0,color:"#0f172a",text:"Three-tier web app",fontSize:1.1},{id:"vpc",kind:"area",x:4,y:-1,w:17,d:13,h:0,z:0,color:"#8c4fff",opacity:.08,dashed:!0,label:"VPC 10.0.0.0/16",labelColor:"#6d28d9"},{id:"pub",kind:"area",x:5,y:0,w:4,d:11,h:0,z:0,color:"#7aa116",opacity:.14,label:"Public subnet"},{id:"app",kind:"area",x:10,y:0,w:5,d:11,h:0,z:0,color:"#4f8cf7",opacity:.14,label:"App subnet"},{id:"data",kind:"area",x:16,y:0,w:4,d:11,h:0,z:0,color:"#ed7100",opacity:.14,label:"Data subnet"},{id:"users",kind:"image",x:-4,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"standing",src:"https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons/resource/Users.svg",label:"Users"},{id:"cf",kind:"image",x:0,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${na}/AmazonCloudFront.svg`,label:"CloudFront"},{id:"s3",kind:"image",x:0,y:8,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${na}/AmazonSimpleStorageService.svg`,label:"S3 assets"},{id:"alb",kind:"image",x:6,y:4,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",src:`${na}/ElasticLoadBalancing.svg`,label:"ALB"},{id:"ec2a",kind:"block",x:11,y:1.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-1"},{id:"ec2b",kind:"block",x:11,y:4.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-2"},{id:"ec2c",kind:"block",x:11,y:7.5,w:3,d:2,h:1.25,z:0,color:"#ed7100",label:"web-3"},{id:"rds",kind:"cylinder",x:17,y:2,w:2,d:2,h:1.75,z:0,color:"#3b48cc",label:"RDS primary"},{id:"rds2",kind:"cylinder",x:17,y:6,w:2,d:2,h:1.75,z:0,color:"#6b77e5",label:"RDS replica"},{id:"cache",kind:"hexagon",x:17,y:9,w:2,d:1.5,h:.75,z:0,color:"#dd344c",label:"ElastiCache"}],edges:[{id:"e1",from:"users",to:"cf",color:"#475569",width:2,routing:"curved",endMarker:"arrow",label:"HTTPS",animation:"packets",animationDirection:"both"},{id:"e2",from:"cf",to:"alb",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"flow"},{id:"e3",from:"cf",to:"s3",color:"#7aa116",width:2,routing:"orthogonal",rounded:!0,lineStyle:"dashed",endMarker:"open"},{id:"e4",from:"alb",to:"ec2a",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e5",from:"alb",to:"ec2b",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e6",from:"alb",to:"ec2c",color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",animation:"packets"},{id:"e7",from:"ec2b",to:"rds",color:"#3b48cc",width:2,routing:"orthogonal",rounded:!0,startMarker:"circle",endMarker:"arrow",animation:"pulse"},{id:"e8",from:"rds",to:"rds2",color:"#3b48cc",width:2,routing:"straight",lineStyle:"dotted",endMarker:"arrow",label:"replication",animation:"flow",animationSpeed:.5},{id:"e9",from:"ec2c",to:"cache",color:"#dd344c",width:2,routing:"orthogonal",rounded:!0,startMarker:"diamond",endMarker:"arrow",animation:"glow"}]},Th=As(Ny,by),Mh="https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons",ve=e=>`${Mh}/architecture-service/${e}.svg`,cc=e=>`${Mh}/resource/${e}.svg`;function de(e,t,n,r,o,s={}){return{id:e,kind:"image",label:t,src:n,x:r,y:o,w:2,d:2,h:.35,z:0,color:"#ffffff",imageStyle:"tile",...s}}function Qn(e,t,n,r,o,s,i,l={}){return{id:e,kind:"area",label:t,color:n,x:r,y:o,w:s,d:i,h:0,z:0,opacity:.12,...l}}function uc(e,t,n,r,o){return{id:e,kind:"text",text:t,x:n,y:r,w:o,d:2,h:0,z:0,color:"#0f172a",fontSize:1.1}}function J(e,t,n,r={}){return{id:e,from:t,to:n,color:"#475569",width:2,routing:"orthogonal",rounded:!0,endMarker:"arrow",...r}}const Py={version:1,nodes:[{id:"in",kind:"block",label:"API event",x:0,y:0,w:2,d:2,h:.5,z:0,color:"#8c4fff"},{id:"validate",kind:"hexagon",label:"validate()",x:4,y:0,w:2,d:2,h:.75,z:0,color:"#f2a93b"},{id:"idem",kind:"cylinder",label:"idempotency cache",x:4,y:4,w:2,d:2,h:1,z:0,color:"#64748b"},{id:"put",kind:"block",label:"table.put()",x:8,y:0,w:2,d:2,h:.75,z:0,color:"#3b48cc"},{id:"send",kind:"block",label:"queue.send()",x:12,y:0,w:2,d:2,h:.75,z:0,color:"#dd344c"},{id:"out",kind:"pyramid",label:"201 Created",x:12,y:4,w:2,d:2,h:1,z:0,color:"#3fb27f"}],edges:[J("i1","in","validate",{animation:"packets"}),J("i2","validate","idem",{lineStyle:"dashed",label:"seen?",startMarker:"arrow"}),J("i3","validate","put",{animation:"packets"}),J("i4","put","send",{animation:"packets"}),J("i5","send","out",{color:"#3fb27f"})]},Ay={version:1,nodes:[uc("title","Serverless order API",-2,-5,14),de("client","Mobile app",cc("Mobileclient"),-5,3,{imageStyle:"standing"}),de("cognito","Cognito",ve("AmazonCognito"),0,-2.5),de("apigw","API Gateway",ve("AmazonAPIGateway"),0,3),Qn("backend","Serverless backend","#ed7100",4,-2.5,17.5,14,{dashed:!0,opacity:.06}),de("orders","orders-api",ve("AWSLambda"),6,3),de("ddb","Orders table",ve("AmazonDynamoDB"),12.5,-1),de("sqs","order-events",ve("AmazonSimpleQueueService"),12.5,3),de("notify","notify",ve("AWSLambda"),17.5,3),de("receipts","Receipts",ve("AmazonSimpleStorageService"),17.5,-1),de("sns","order-updates",ve("AmazonSimpleNotificationService"),17.5,7.5),de("logs","CloudWatch",ve("AmazonCloudWatch"),6,7.5)],edges:[J("e1","client","apigw",{routing:"curved",label:"HTTPS",animation:"packets",animationDirection:"both"}),J("e2","apigw","cognito",{lineStyle:"dashed",color:"#c925d1",endMarker:"open",label:"verify JWT"}),J("e3","apigw","orders",{animation:"flow"}),J("e4","orders","ddb",{color:"#3b48cc",animation:"packets",label:"PutItem"}),J("e5","orders","sqs",{color:"#dd344c",animation:"packets",label:"OrderPlaced"}),J("e6","sqs","notify",{color:"#dd344c",animation:"flow"}),J("e7","notify","receipts",{lineStyle:"dashed",color:"#7aa116"}),J("e8","notify","sns",{color:"#dd344c"}),J("e9","orders","logs",{lineStyle:"dotted",color:"#94a3b8",endMarker:"none",label:"logs"})]},ra=(e,t,n)=>({id:e,kind:"block",label:t,x:-7,y:n,w:1.5,d:1.5,h:.75,z:0,color:"#7aa116"}),zy={version:1,nodes:[uc("title","Streaming IoT pipeline",-2,-5,16),Qn("floor","Factory floor","#7aa116",-8.5,-1,4.5,8.5),ra("s1","Line 1",0),ra("s2","Line 2",2.5),ra("s3","Line 3",5),de("iot","IoT Core",ve("AWSIoTCore"),-1.5,2),de("kinesis","Kinesis",ve("AmazonKinesisDataStreams"),3,2),de("enrich","enrich",ve("AWSLambda"),7.5,2),de("search","OpenSearch",ve("AmazonOpenSearchService"),12.5,2),de("firehose","Firehose",ve("AmazonDataFirehose"),7.5,7),Qn("lake","Data lake","#3fb27f",-2,10,12.5,7.5),de("raw","raw",ve("AmazonSimpleStorageService"),-.5,11.5),de("curated","curated",ve("AmazonSimpleStorageService"),6.5,11.5),de("glue","Glue crawler",ve("AWSGlue"),3,14.5),de("athena","Athena",ve("AmazonAthena"),13.5,14.5),de("analysts","Analysts",cc("Users"),18,14.5,{imageStyle:"standing"})],edges:[J("e1","s1","iot",{color:"#7aa116",animation:"packets",label:"MQTT"}),J("e2","s2","iot",{color:"#7aa116",animation:"packets"}),J("e3","s3","iot",{color:"#7aa116",animation:"packets"}),J("e4","iot","kinesis",{animation:"packets",animationSpeed:1.5}),J("e5","kinesis","enrich",{animation:"packets",animationSpeed:1.5}),J("e6","enrich","search",{color:"#3b48cc",animation:"pulse",label:"hot path"}),J("e7","enrich","firehose",{animation:"flow",label:"cold path"}),J("e8","firehose","curated",{color:"#3fb27f",animation:"flow"}),J("e9","iot","raw",{lineStyle:"dashed",color:"#94a3b8",routing:"curved",label:"archive"}),J("e10","glue","curated",{lineStyle:"dotted",color:"#8c4fff",endMarker:"open"}),J("e11","athena","glue",{lineStyle:"dotted",color:"#8c4fff",label:"catalog"}),J("e12","analysts","athena",{routing:"straight",animation:"packets",animationDirection:"both"})]},oa=(e,t,n,r,o)=>({id:e,kind:"block",label:t,x:n,y:r,w:2.5,d:2,h:1,z:0,color:o}),Ly={version:1,nodes:[uc("title","Kubernetes microservices",2,-7,18),de("users","Shoppers",cc("Users"),-6,4,{imageStyle:"standing"}),de("dns","Route 53",ve("AmazonRoute53"),-2,4),de("alb","Ingress ALB",ve("ElasticLoadBalancing"),1.5,4),Qn("eks","EKS cluster","#ed7100",4.5,-3,20,16,{dashed:!0,opacity:.05}),Qn("ns-web","namespace: web","#4f8cf7",5.5,-2,8,7),Qn("ns-orders","namespace: orders","#dd344c",14.5,-2,9,7),Qn("ns-platform","namespace: platform","#64748b",5.5,6,18,6),oa("storefront","storefront",6.5,-.5,"#4f8cf7"),oa("cart","cart",10,2,"#4f8cf7"),oa("orders-svc","orders",15.5,-.5,"#dd344c"),{id:"payments",kind:"hexagon",label:"payments",x:20,y:1.5,w:2.5,d:2,h:1,z:0,color:"#c925d1"},{id:"prometheus",kind:"pyramid",label:"Prometheus",x:7,y:7.5,w:2.5,d:2.5,h:1.75,z:0,color:"#e5534b"},{id:"argocd",kind:"cone",label:"Argo CD",x:12,y:7.5,w:2.5,d:2.5,h:2,z:0,color:"#f2a93b"},{id:"mesh",kind:"cylinder",label:"Istio",x:17,y:7.5,w:2.5,d:2.5,h:1.25,z:0,color:"#39c5cf"},de("ecr","ECR",ve("AmazonElasticContainerRegistry"),12.25,14.5),de("aurora","Aurora",ve("AmazonAurora"),27,0),de("redis","Redis",ve("AmazonElastiCache"),27,5)],edges:[J("e1","users","dns",{routing:"straight",animation:"packets",animationDirection:"both"}),J("e2","dns","alb",{animation:"flow"}),J("e3","alb","storefront",{animation:"packets",label:"HTTPS"}),J("e4","storefront","cart",{color:"#4f8cf7",animation:"flow"}),J("e5","storefront","orders-svc",{color:"#dd344c",animation:"packets",label:"gRPC"}),J("e6","orders-svc","payments",{color:"#c925d1",animation:"pulse"}),J("e7","orders-svc","aurora",{color:"#3b48cc",label:"SQL"}),J("e8","cart","redis",{color:"#dd344c",routing:"curved"}),J("e9","argocd","ecr",{lineStyle:"dashed",color:"#94a3b8",label:"pull images"})]},Vu=[{id:"three-tier",name:"Three-tier web app",diagram:Th},{id:"serverless",name:"Serverless order API",diagram:As(Ay,Ty,{ordersInternals:Py})},{id:"streaming",name:"Streaming IoT pipeline",diagram:As(zy,My)},{id:"kubernetes",name:"Kubernetes microservices",diagram:As(Ly,jy)}],Hu="isodraw-demo:diagram",Uu="isodraw-demo:icons",Ku="isodraw-demo:theme";function sa(e,t){try{const n=localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}const Iy=()=>c.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round","aria-hidden":!0,children:[c.jsx("circle",{cx:"12",cy:"12",r:"4"}),c.jsx("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"})]}),Dy=()=>c.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:c.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})});function _y(){const[e,t]=P.useState(()=>sa(Hu,Th)),[n,r]=P.useState(()=>sa(Uu,[])),[o,s]=P.useState(0),[i,l]=P.useState(()=>window.location.hash.startsWith("#/")?"published":"edit"),[a,d]=P.useState(()=>sa(Ku,"system")),h=oc(a);P.useEffect(()=>{document.documentElement.dataset.theme=h},[h]),P.useEffect(()=>{try{localStorage.setItem(Ku,JSON.stringify(a))}catch{}},[a]),P.useEffect(()=>{try{localStorage.setItem(Hu,JSON.stringify(e))}catch{}},[e]),P.useEffect(()=>{try{localStorage.setItem(Uu,JSON.stringify(n))}catch{}},[n]);const m=p=>{t(p),s(k=>k+1)};return c.jsxs("div",{className:"demo",children:[c.jsxs("header",{className:"demo-header",children:[c.jsxs("div",{className:"demo-brand",children:[c.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24","aria-hidden":!0,children:[c.jsx("path",{d:"M12 2 3 7l9 5 9-5-9-5Z",fill:"#60a5fa"}),c.jsx("path",{d:"M3 7v10l9 5V12L3 7Z",fill:"#2563eb"}),c.jsx("path",{d:"M21 7v10l-9 5V12l9-5Z",fill:"#1d4ed8"})]}),c.jsx("strong",{children:"IsoDraw"}),c.jsx("span",{children:"Cloudcraft-style diagrams for React"})]}),c.jsxs("div",{className:"demo-actions",children:[c.jsx("div",{className:"demo-modes",role:"radiogroup","aria-label":"Mode",children:[["edit","Edit","Draw and document"],["view","View","Browse the diagram and its docs without editing"],["published","Published","Docs-site view: a page per component"]].map(([p,k,g])=>c.jsx("button",{type:"button",role:"radio","aria-checked":i===p,className:i===p?"is-on":"",title:g,onClick:()=>{l(p),p!=="published"&&window.location.hash&&history.replaceState(null,"",window.location.pathname)},children:k},p))}),c.jsxs("label",{className:"demo-select",title:"Load an example diagram (replaces the current one)",children:[c.jsx("span",{children:"Examples"}),c.jsxs("select",{value:"","aria-label":"Load an example diagram",onChange:p=>{const k=Vu.find(g=>g.id===p.target.value);k&&m(k.diagram)},children:[c.jsx("option",{value:"",disabled:!0,children:"Load example…"}),Vu.map(p=>c.jsx("option",{value:p.id,children:p.name},p.id))]})]}),c.jsx("button",{type:"button",onClick:()=>m(qa()),children:"New blank"})]}),c.jsx("button",{type:"button",className:"demo-theme",onClick:()=>d(h==="dark"?"light":"dark"),"aria-label":h==="dark"?"Switch to light theme":"Switch to dark theme",title:h==="dark"?"Switch to light theme":"Switch to dark theme",children:h==="dark"?c.jsx(Iy,{}):c.jsx(Dy,{})})]}),c.jsx("main",{className:"demo-main",children:i==="published"?c.jsx(Cy,{diagram:e,useHash:!0,theme:a}):c.jsx(wy,{value:e,onChange:t,userIcons:n,onUserIconsChange:r,readOnly:i==="view",theme:a},o)})]})}lh(document.getElementById("root")).render(c.jsx(P.StrictMode,{children:c.jsx(_y,{})}));export{qe as I,Ir as K,Ja as M,Ry as R,Uy as S,rc as T,Hy as a,mh as b,En as c,ah as d,nc as e,Oy as f,Zu as g,Ct as h,ln as i,c as j,Wy as k,hh as l,Vy as m,Fo as n,By as o,tc as p,Dr as q,P as r,ph as s,$y as t,Fy as u,qa as v,bg as w,Tg as x,Si as y,wy as z};
