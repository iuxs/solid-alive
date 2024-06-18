import{createComponent as e}from"solid-js/web";import{createStore as l,produce as t}from"solid-js/store";import{createContext as o,createEffect as r,on as n,useContext as i,createRoot as a,onCleanup as s}from"solid-js";var c=o({elements:{},scrollDom:{current:null},closeSymbol:Symbol("close"),insertElement:()=>{},onDeactivated:()=>{},onActivated:()=>{},removeAliveElement:()=>{},setElement:()=>{},setCurrentComponentId:()=>{},saveElScroll:()=>{},resetElScroll:()=>!0,removeScrollEl:()=>!0});function d(o){var[i,a]=l(),s={current:null};let d=Symbol("close"),v=d,u=new Map,m=new Map,f=new Map;var p=e=>{let l=e.id,t=u.get(l),o=m.get(l),r=f.get(l);u.delete(l),m.delete(l),f.delete(l),a([l],Object.assign(Object.assign(Object.assign({},i[l]),e),{onActivated:t,onDeactivated:o,domList:r}))},E=e=>{var l;if(Reflect.has(i,e)){var t=null===(l=i[e])||void 0===l?void 0:l.children;null==t||t.forEach((l=>l!==e&&E(l))),a((l=>{var t,o;return l[e].onDeactivated=null,l[e].component=null,null===(o=(t=l[e]).dispose)||void 0===o||o.call(t),l[e].dispose=null,l[e].onActivated=null,l[e].onDeactivated=null,l[e].scroll=null,l[e].id="",l[e].children=null,l[e].domList=null,l[e].isTop=!1,l[e]=null,delete l[e],l}))}},L=e=>{if(null==e)for(const e of Object.values(i))E(e.id);else E(e)},h=e=>{v=e};const S=(e,l,o)=>{Reflect.has(i,e)&&a(t((t=>{t[e][l]=o})))};var b=(e,l)=>{var t={onActivated:u,onDeactivated:m}[e];if(v!==d){var o=t.get(v)||new Set;o.size<100&&o.add(l)&&t.set(v,o)}},D=e=>{b("onActivated",n([],e))},A=e=>{b("onDeactivated",n([],e))},_=(e,l)=>{var t,o;if(v!==d){var r=(null!==(t=f.get(v))&&void 0!==t?t:new Map([])).set(e,{top:0,left:0});f.set(v,r),null===(o=null==l?void 0:l())||void 0===o||o(e)}},T=e=>{var l;for(const t of Object.values(i))if(null===(l=t.domList)||void 0===l?void 0:l.has(e))return t.domList.delete(e),e.scrollTop=0,e.scrollLeft=0,!0;return!1},g=e=>{var l;for(const t of Object.values(i))if(null===(l=t.domList)||void 0===l?void 0:l.has(e))return t.domList.set(e,{top:0,left:0}),e.scrollTop=0,e.scrollLeft=0,!0;return!1};return r((()=>{o.scrollId&&(s.current=document.getElementById(o.scrollId),!s.current&&console.error(`[solid-alive] scrollId: ${o.scrollId} is null `))})),e(c.Provider,{get value(){return{scrollDom:s,behavior:o.behavior,transitionEnterName:o.transitionEnterName,elements:i,closeSymbol:d,onActivated:D,onDeactivated:A,insertElement:p,setElement:S,removeAliveElement:L,setCurrentComponentId:h,saveElScroll:_,resetElScroll:g,removeScrollEl:T}},get children(){return o.children}})}var v={appear:"index-module_appear__MaHzX",_appear:"index-module__appear__7KeRW",toLeft:"index-module_toLeft__s1PDL",_toLeft:"index-module__toLeft__SD-Zp"};let u=0;function m(l,t,o){var n,{behavior:d,elements:m,scrollDom:f,closeSymbol:p,transitionEnterName:E,insertElement:L,setElement:h,setCurrentComponentId:S}=i(c);Reflect.has(m,t)||(S(t),L({id:t,children:Array.isArray(o)?new Set(o):null}),a((o=>{var r;L({id:t,dispose:o,component:e(l,{}),onDeactivated:null,onActivated:null,scroll:{top:0,left:0},domList:null});let n=null===(r=Object.values(m).find((e=>{var l;return null===(l=e.children)||void 0===l?void 0:l.has(t)})))||void 0===r?void 0:r.id;n&&S(n)})));var b=e=>{var l;if(f.current)if("cacheScroll"===e){var o="alwaysTop"===d?{top:0,left:0}:{top:f.current.scrollTop,left:f.current.scrollLeft};h(t,"scroll",o)}else{var r=Date.now();if(r-u>200){const{top:e=0,left:o=0}=(null===(l=m[t])||void 0===l?void 0:l.scroll)||{};f.current.scrollTop=e,f.current.scrollLeft=o,u=r}}},D=e=>{var l;if(m[e].isTop)return e;var t=null===(l=Object.values(m).find((l=>{var t;return null===(t=l.children)||void 0===t?void 0:t.has(e)})))||void 0===l?void 0:l.id;return t&&(t=D(t)),t||e};if(E){let e,l=D(t);if(l&&(e=null===(n=m[l])||void 0===n?void 0:n.component,h(l,"isTop",!0)),"function"==typeof e&&(e=null==e?void 0:e()),e instanceof HTMLElement){var A=v[E]||E;e.classList.add(A);const l=()=>{e.classList.remove(A),e.removeEventListener("animationend",l)};e.addEventListener("animationend",l)}}return r((()=>{var e,l;null===(e=m[t].onActivated)||void 0===e||e.forEach((e=>e())),b("scrollTo"),null===(l=m[t].domList)||void 0===l||l.forEach(((e,l)=>{l.scrollTop=e.top,l.scrollLeft=e.left}))})),s((()=>{var e,l;S(p),null===(e=m[t].onDeactivated)||void 0===e||e.forEach((e=>e())),b("cacheScroll"),null===(l=m[t].domList)||void 0===l||l.forEach(((e,l,t)=>t.set(l,{top:l.scrollTop,left:l.scrollLeft})))})),m[t].component}function f(){var{onActivated:e,onDeactivated:l,removeAliveElement:t,saveElScroll:o,resetElScroll:r,removeScrollEl:n}=i(c);return{onActivated:e,onDeactivated:l,removeAliveElement:t,directiveSaveScroll:o,resetElScroll:r,removeScrollEl:n}}export{d as AliveProvider,m as AliveTransfer,f as useAlive};
