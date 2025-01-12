import { JSX } from "solid-js";
/**
 * @description Alive 组件用的 转换函数; aliveTransfer(Comp, ‘/home’)
 * @param { ()=> JSX.Element } Component () => JSX.Element
 * @param { string } id  string,自己的id 值,一定要唯一
 * @param { Array<string> } [subsets]  [string,...], 子组件的 id值 可不传
 */
export default function aliveTransfer(Component: <T>(props: T) => JSX.Element, id: string, subsets?: Array<string> | null): <T>(props: T) => JSX.Element;
