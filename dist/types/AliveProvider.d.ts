import { ProveiderProps } from './default';
/**
 * @description Alive
 * @param children jsx.element
 * @param { string } [scrollId] id,如 'root' 会在切换组件时的动作,默认saveScrollTop
 * @param { 'alwaysTop'|'saveScroll' } [behavior] 'alwaysTop'|'saveScroll' dom元素滚动条会如何保持
 * @param { 'appear'|'toLeft' } [transitionEnterName] 'appear'|'toLeft' 路由切换动画, 可以自己加,看dist 中的样式格式
 */
export default function AliveProvider(props: ProveiderProps): import("solid-js").JSX.Element;
