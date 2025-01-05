import{createComponent as e}from"solid-js/web";import{createContext as t,useContext as n,createRoot as r,getOwner as i,onCleanup as l,runWithOwner as o,createEffect as s,untrack as d}from"solid-js";import{produce as v,createStore as a}from"solid-js/store";const u=Symbol("currentId"),c=Symbol("setActiveCb");var m=t({elements:{},setElements:()=>{},setActiveCb:()=>{},aliveIds:()=>{}});const f=t({[u]:void 0,[c]:()=>{}});var A=(t,n,r)=>e(f.Provider,{value:{[u]:r,[c]:n},get children(){return t()}});function y(e,t,s){return function(d){var a,u,c=n(m);return(null===(a=c.aliveIds())||void 0===a?void 0:a.includes(t))?(c.elements[t]?null===(u=c.elements[t].onActivated)||void 0===u||u.forEach((e=>e())):(c.setElements({[t]:{id:t,subsets:Array.isArray(s)?s:null}}),r((n=>{c.setElements(v((r=>{r[t].dispose=n,r[t].id=t,r[t].owner=i(),r[t].element=A((()=>e(d)),c.setActiveCb,t)})))}))),l((()=>{var e;null===(e=c.elements[t].onDeactivated)||void 0===e||e.forEach((e=>e()))})),c.elements[t].owner&&o(c.elements[t].owner,(()=>c.elements[t].element))):A((()=>e(d)))}}function h(t){const[n,r]=a(),i=e=>{var t,l,o;if(Array.isArray(e))for(var s of e)i(null===(t=n[s])||void 0===t?void 0:t.subsets),null===(o=null===(l=n[s])||void 0===l?void 0:l.dispose)||void 0===o||o.call(l),r({[s]:void 0})};return s((e=>{var n=Array.isArray(t.include)?t.include:[];if(e.length>n.length){var r=new Set(n);i(e.filter((e=>!r.has(e))))}return n}),Array.isArray(t.include)?t.include:[]),e(m.Provider,{value:{elements:n,setElements:r,setActiveCb:(e,t,n,i)=>{r(v((r=>{r[e][t]?r[e][t][i](n):"add"===i&&(r[e][t]=new Set([n]))})))},aliveIds:()=>t.include},get children(){return t.children}})}function p(e,t){d((()=>{var r,i=n(f),o=i[u];o&&(null===(r=i[c])||void 0===r||r.call(i,o,e,t,"add"),"onActivated"===e&&s((()=>{!function(e){"undefined"!=typeof Promise&&"function"==typeof Promise.prototype.then?Promise.resolve().then(e):setTimeout(e)}(t)})),l((()=>{var n;null===(n=i[c])||void 0===n||n.call(i,o,e,t,"delete"),t=null})))}))}function b(e){p("onActivated",e)}function w(e){p("onDeactivated",e)}export{h as AliveProvider,y as aliveTransfer,b as onActivated,w as onDeactivated};
