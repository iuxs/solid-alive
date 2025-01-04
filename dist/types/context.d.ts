import { Context } from "./types";
export declare const CURRENTID: unique symbol;
export declare const SETACTIVECB: unique symbol;
declare const _default: import("solid-js").Context<Context>;
export default _default;
export declare const ChildContext: import("solid-js").Context<{
    [CURRENTID]: string | undefined;
    [SETACTIVECB]: Context["setActiveCb"];
}>;
