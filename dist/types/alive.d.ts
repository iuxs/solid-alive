/**
 * @returns onActivated  激活缓存组件时触发,
 * @returns onDeactivated  退出缓存组件时触发,
 * @returns removeAliveElement  删除缓存组件,
 */
export declare function useAlive(): {
    onActivated: (cb: () => void) => void;
    onDeactivated: (cb: () => void) => void;
    removeAliveElement: (id?: string) => void;
};
export declare function onActivated(fn: () => void): void;
export declare function onDeactivated(fn: () => void): void;
