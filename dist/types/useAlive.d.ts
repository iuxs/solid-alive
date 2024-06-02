/**
 * @returns onActivated  激活缓存组件时触发,
 * @returns onDeactivated  退出缓存组件时触发,
 * @returns removeAliveElement  删除缓存组件,
 * @returns directiveSaveScroll 这个是指令, 缓存组件中需要存的 滚动条, use:directiveSaveScroll, ts 中加 //@ts-ignore
 * @returns resetElScroll  将缓存组件中 某个滚动条的scrollTop scrollLeft 变成 0
 * @returns removeScrollEl  将缓存组件中 某个滚动条dom元素删除了
 */
declare function useAlive(): {
    onActivated: (cb: () => void) => void;
    onDeactivated: (cb: () => void) => void;
    removeAliveElement: (id?: string | undefined) => void;
    directiveSaveScroll: (dom: Element) => void;
    resetElScroll: (dom: Element) => boolean;
    removeScrollEl: (dom: Element) => boolean;
};
export default useAlive;
