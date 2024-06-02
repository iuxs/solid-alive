import { JSX } from 'solid-js';
/**
 * @description Alive 组件用的 转换函数
 * @param { string } Componet,
 * @param { string } id  string,自己的id 值,一定要唯一
 * @param { Array<string> } [children]  [string,...], 子组件的 id值 可不传，这样默认销毁时不会去干掉子组件，
 */
export default function AliveTransfer(Component: () => JSX.Element, id: string, children?: Array<string> | null): JSX.Element;
