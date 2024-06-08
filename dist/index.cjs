"use strict";var e=require("solid-js/web"),l=require("solid-js/store"),t=require("solid-js"),o=t.createContext({elements:{},scrollDom:{current:null},closeSymbol:Symbol("close"),insertElement:()=>{},onDeactivated:()=>{},onActivated:()=>{},removeAliveElement:()=>{},setElement:()=>{},setCurrentComponentId:()=>{},saveElScroll:()=>{},resetElScroll:()=>!0,removeScrollEl:()=>!0});var r={appear:"index-module_appear__MaHzX",_appear:"index-module__appear__7KeRW",toLeft:"index-module_toLeft__s1PDL",_toLeft:"index-module__toLeft__SD-Zp"};let n=0;exports.AliveProvider=function(r){var[n,i]=l.createStore(),a={current:null};let c=Symbol("close"),s=c,d=new Map,v=new Map,u=new Map;var m=e=>{let l=e.id,t=d.get(l),o=v.get(l),r=u.get(l);d.delete(l),v.delete(l),u.delete(l),i([l],Object.assign(Object.assign(Object.assign({},n[l]),e),{onActivated:t,onDeactivated:o,domList:r}))},f=e=>{var l;if(Reflect.has(n,e)){var t=null===(l=n[e])||void 0===l?void 0:l.children;null==t||t.forEach((l=>l!==e&&f(l))),i((l=>{var t,o;return l[e].onDeactivated=null,l[e].component=null,null===(o=(t=l[e]).dispose)||void 0===o||o.call(t),l[e].dispose=null,l[e].onActivated=null,l[e].onDeactivated=null,l[e].scroll=null,l[e].id="",l[e].children=null,l[e].domList=null,l[e].isTop=!1,l[e]=null,delete l[e],l}))}},p=e=>{if(null==e)for(const e of Object.values(n))f(e.id);else f(e)},E=e=>{s=e};const L=(e,t,o)=>{Reflect.has(n,e)&&i(l.produce((l=>{l[e][t]=o})))};var h=(e,l)=>{var t={onActivated:d,onDeactivated:v}[e];if(s!==c){var o=t.get(s)||new Set;o.size<100&&o.add(l)&&t.set(s,o)}},S=e=>{h("onActivated",e)},A=e=>{h("onDeactivated",e)},b=(e,l)=>{var t,o;if(s!==c){var r=(null!==(t=u.get(s))&&void 0!==t?t:new Map([])).set(e,{top:0,left:0});u.set(s,r),null===(o=null==l?void 0:l())||void 0===o||o(e)}},D=e=>{var l;for(const t of Object.values(n))if(null===(l=t.domList)||void 0===l?void 0:l.has(e))return t.domList.delete(e),e.scrollTop=0,e.scrollLeft=0,!0;return!1},_=e=>{var l;for(const t of Object.values(n))if(null===(l=t.domList)||void 0===l?void 0:l.has(e))return t.domList.set(e,{top:0,left:0}),e.scrollTop=0,e.scrollLeft=0,!0;return!1};return t.createEffect((()=>{r.scrollId&&(a.current=document.getElementById(r.scrollId),!a.current&&console.error(`[solid-alive] scrollId: ${r.scrollId} is null `))})),e.createComponent(o.Provider,{get value(){return{scrollDom:a,behavior:r.behavior,transitionEnterName:r.transitionEnterName,elements:n,closeSymbol:c,onActivated:S,onDeactivated:A,insertElement:m,setElement:L,removeAliveElement:p,setCurrentComponentId:E,saveElScroll:b,resetElScroll:_,removeScrollEl:D}},get children(){return r.children}})},exports.AliveTransfer=function(l,i,a){var c,{behavior:s,elements:d,scrollDom:v,closeSymbol:u,transitionEnterName:m,insertElement:f,setElement:p,setCurrentComponentId:E}=t.useContext(o);Reflect.has(d,i)||(E(i),f({id:i,children:Array.isArray(a)?new Set(a):null}),t.createRoot((t=>{var o;f({id:i,dispose:t,component:e.createComponent(l,{}),onDeactivated:null,onActivated:null,scroll:{top:0,left:0},domList:null});let r=null===(o=Object.values(d).find((e=>{var l;return null===(l=e.children)||void 0===l?void 0:l.has(i)})))||void 0===o?void 0:o.id;r&&E(r)})));var L=e=>{var l;if(v.current)if("cacheScroll"===e){var t="alwaysTop"===s?{top:0,left:0}:{top:v.current.scrollTop,left:v.current.scrollLeft};p(i,"scroll",t)}else{var o=Date.now();if(o-n>200){const{top:e=0,left:t=0}=(null===(l=d[i])||void 0===l?void 0:l.scroll)||{};v.current.scrollTop=e,v.current.scrollLeft=t,n=o}}},h=e=>{var l;if(d[e].isTop)return e;var t=null===(l=Object.values(d).find((l=>{var t;return null===(t=l.children)||void 0===t?void 0:t.has(e)})))||void 0===l?void 0:l.id;return t&&(t=h(t)),t||e};if(m){let e,l=h(i);if(l&&(e=null===(c=d[l])||void 0===c?void 0:c.component,p(l,"isTop",!0)),"function"==typeof e&&(e=null==e?void 0:e()),e instanceof HTMLElement){var S=r[m]||m;e.classList.add(S);const l=()=>{e.classList.remove(S),e.removeEventListener("animationend",l)};e.addEventListener("animationend",l)}}return t.createEffect((()=>{var e,l;null===(e=d[i].onActivated)||void 0===e||e.forEach((e=>e())),L("scrollTo"),null===(l=d[i].domList)||void 0===l||l.forEach(((e,l)=>{l.scrollTop=e.top,l.scrollLeft=e.left}))})),t.onCleanup((()=>{var e,l;E(u),null===(e=d[i].onDeactivated)||void 0===e||e.forEach((e=>e())),L("cacheScroll"),null===(l=d[i].domList)||void 0===l||l.forEach(((e,l,t)=>t.set(l,{top:l.scrollTop,left:l.scrollLeft})))})),d[i].component},exports.useAlive=function(){var{onActivated:e,onDeactivated:l,removeAliveElement:r,saveElScroll:n,resetElScroll:i,removeScrollEl:a}=t.useContext(o);return{onActivated:e,onDeactivated:l,removeAliveElement:r,directiveSaveScroll:n,resetElScroll:i,removeScrollEl:a}};
