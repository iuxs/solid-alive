import{createComponent as e}from"solid-js/web";import{createStore as n,produce as t}from"solid-js/store";import{createContext as o,on as r,useContext as i,createRoot as l,createComputed as a,createEffect as d,onCleanup as s}from"solid-js";var v=o({elements:{},symbolClose:Symbol("close"),info:{frozen:!1,cbOnOff:"off",currComponentId:""},setInfo:()=>{},insertElement:()=>{},onDeactivated:()=>{},onActivated:()=>{},removeAliveElements:()=>{},insertCacheCb:()=>{}});function c(o){let[i,l]=n(),a={frozen:!1,cbOnOff:"off",currComponentId:""},d=Symbol("close"),s=new Map,c=new Map,f={onActivated:{},onDeactivated:{}};var u=e=>{var n,t,o;if(Reflect.has(i,e)){var r=null===(n=i[e])||void 0===n?void 0:n.subIds;null==r||r.forEach((n=>n!==e&&u(n))),null===(o=null===(t=i[e])||void 0===t?void 0:t.dispose)||void 0===o||o.call(t),l({[e]:void 0})}},m=e=>{var{caller:n,path:t}=function(){var e=null,n=null;try{throw new Error}catch(l){var t=l.stack.split("\n"),o=t[0].includes("@")?5:6,r=t[o].trim(),i=r.includes("@")?r.split("@"):r.split(" ").slice(1);e=i[0],n=i[1]}return{caller:e,path:n}}(),o=f[e];return(!o[n]||o[n]===t)&&(f[e][n]=t,!0)},b=(e,n)=>{var{cbOnOff:t,currComponentId:o}=a;if("on"===t&&o!==d&&n&&m(e)){var i={onActivated:s,onDeactivated:c}[e],l=i.get(o)||new Set;l.add(r([],n))&&i.set(o,l)}};return e(v.Provider,{value:{info:a,elements:i,symbolClose:d,setInfo:(e,n)=>{a[e]=n},onActivated:e=>{b("onActivated",e)},onDeactivated:e=>{b("onDeactivated",e)},insertElement:e=>{let n=e.id,t=Object.values(i).find((e=>{var t;return null===(t=e.subIds)||void 0===t?void 0:t.has(n)}));l([n],Object.assign(Object.assign(Object.assign({},i[n]),e),{fatherId:null==t?void 0:t.id}))},removeAliveElements:e=>{if(Array.isArray(e))for(const n of e)u(n);else if(!e)for(const e of Object.values(i))u(e.id)},insertCacheCb:e=>{let n=s.get(e),o=c.get(e);s.delete(e),c.delete(e),f.onActivated={},f.onDeactivated={},Reflect.has(i,e)&&l(t((t=>{t[e].onActivated=n,t[e].onDeactivated=o,t[e].loaded=!0})))}},get children(){return o.children}})}let f=new Set([]);function u(e,n,t){return function(o){var{info:r,elements:c,symbolClose:u,setInfo:m,insertElement:b,insertCacheCb:A}=i(v);Reflect.has(c,n)||l((r=>{m("currComponentId",n),m("cbOnOff","on"),b({id:n,dispose:r,owner:null,element:e(o),subIds:Array.isArray(t)?new Set(t):null})}));var O=e=>{var n=c[e].fatherId;return n?O(n):e};return f.size&&!f.has(O(n))&&f.clear(),a((()=>{var e;!c[n].loaded&&(e=>{var n;let t=null===(n=c[e])||void 0===n?void 0:n.element;for(;"function"==typeof t;)t=t();return!!(t instanceof HTMLElement||Array.isArray(t))&&t})(n)&&(A(n),!(null===(e=c[n].subIds)||void 0===e?void 0:e.size)&&m("currComponentId",u))})),d((()=>{var e,t,o;r.frozen?!(null===(e=c[n].subIds)||void 0===e?void 0:e.size)&&m("frozen",!1):(null===(t=c[n])||void 0===t?void 0:t.loaded)&&(f.add(n),m("cbOnOff","off"),null===(o=c[n].onActivated)||void 0===o||o.forEach((e=>e())),m("cbOnOff","on"))})),s((()=>{var e,t;r.frozen||(m("cbOnOff","off"),null===(t=null===(e=c[n])||void 0===e?void 0:e.onDeactivated)||void 0===t||t.forEach((e=>e())),m("cbOnOff","on"))})),c[n].element}}function m(n){var t=u((()=>n.children),n.id,n.subIds);return e(t,{})}function b(){var{onActivated:e,onDeactivated:n,removeAliveElements:t,setInfo:o}=i(v);return{onActivated:e,onDeactivated:n,removeAliveElements:t,setInfo:o}}function A(e){var{onActivated:n}=b();n(e)}function O(e){var{onDeactivated:n}=b();n(e)}function h(){var{removeAliveElements:e,setInfo:n}=b();return{removeAliveElements:e,aliveFrozen:()=>n("frozen",!0)}}export{m as AliveComponent,c as AliveProvider,u as aliveTransfer,A as onActivated,O as onDeactivated,h as useAlive};
