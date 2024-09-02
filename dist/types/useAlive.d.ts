export declare function onActivated(fn: () => void): void;
export declare function onDeactivated(fn: () => void): void;
/**
 * @returns removeAliveElement  删除缓存组件,
 * @returns aliveFrozen 让 alive 暂时失去响应, 一般在加新增路由数据时使用
 */
export declare function useAlive(): {
    removeAliveElements: (ids?: Array<import("./default").IAliveElementIds>) => void;
    aliveFrozen: () => void;
};
