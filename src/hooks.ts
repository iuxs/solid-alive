import { ChildContext, Context as Context1 } from "./context"

import { useContext, getOwner, runWithOwner, type Context } from "solid-js"

import { createStore } from "solid-js/store"

/**
 * @description alive hook
 * @example
 * ```jsx
 *  export function Fn(){
 *    const divRef
 *    //@ts-ignore
 *    const { aliveScrollDelete, aliveSaveScrollDtv } = useAlive()
 *    const del = () => { divRef && aliveScrollDelete(divRef) }
 *
 *    return <div use:aliveSaveScrollDtv={(cn)=>(divRef = cn)} >123</div>
 *  }
 *
 * ```
 */
export const useAlive = () => {
  const { id, noCache } = useContext(ChildContext) || {}
  const ctx = useContext(Context1)

  return {
    /** 当前id */
    aliveId: id,
    /**
     * @description 删除 dom的滚动条
     * @example
     * ```jsx
     * aliveScrollDelete(divRef)
     * ```
     * */
    aliveScrollDelete: (dom: HTMLElement) =>
      noCache || (id && ctx && dom && ctx.setDirective(id, dom, "delete")),
    /**
     * @description directive 指令: 保存 dom的滚动条
     * @example
     * ```jsx
     *  <div use:aliveSaveScrollDtv >123</div>
     * ```
     * */
    aliveSaveScrollDtv: (
      el: HTMLElement,
      v?: () => ((v: HTMLElement) => Boolean | void | any) | boolean,
    ) => {
      if (!id || noCache) return
      const fn = v && v()
      if (typeof fn === "function" && fn(el) === false) return
      ctx && ctx.setDirective(id, el, "set")
    },
    /** 在更新 routes 数据 时, 要用到这个 */
    // aliveFrozen: () => {
    //   ctx && (ctx.frozen = true)
    // },
  }
}

/**
 * @description alive context
 * @example
 * ```
 * import UserContext from 'xxx'
 * const data = useAliveContext(UserContext)
 * ```
 */
export const useAliveContext = <T>(context: Context<T>): T => {
  const ctx = useContext(Context1)
  const { id } = useContext(ChildContext) || {}
  const [data, setData] = createStore<any>()

  id &&
    ctx?.setActive(
      id,
      "aOnceSet",
      () => {
        runWithOwner(getOwner(), () => {
          setData(useContext(context))
        })
      },
      "add",
    )
  return data
}
