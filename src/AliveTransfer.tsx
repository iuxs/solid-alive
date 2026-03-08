import {
  createComponent,
  createRoot,
  onCleanup,
  runWithOwner,
  useContext,
  type JSXElement,
  createEffect,
  untrack,
  getOwner,
} from "solid-js"
import { ChildContext, Context } from "./context"
import { produce } from "solid-js/store"
import type { Caches } from "./types"

/** 标记页面是否是 刚刷新的状态, true :表明刚刷新 */
let pageRefresh = false

/**
 * @description 转换
 * @param {()=> JSXElement} Component 组件
 * @param {string} id 唯一id
 * @param {{isolated?:boolean, disableAnimation?:boolean, transitionEnterName?:string}} [params] 其它参数
 * @example
 * ```tsx
 *  import Home from 'xxx'
 *  const Home1 = aliveTransfer(Home, 'home')
 * ```
 * */
const aliveTransfer = (
  Component: <T>(props: T) => JSXElement,
  id: string,
  params?: {
    /** 成一个独立缓存组件 */
    isolated?: boolean
    /** 禁用动画 */
    disableAnimation?: boolean
    /** 动画名称, 要 css keyframes */
    transitionEnterName?: string
    /** 当前组件不去管制 滚动条 */
    stopSaveScroll?: boolean
  },
) => {
  params?.isolated || (pageRefresh = true)
  return function <T extends Record<string, any>>(props: T) {
    if (!id) {
      console.error(`[solid-alive]: id:'${id}' 不正确`)
      return null
    }
    const ctx = useContext(Context)
    // 如果父路由缓存,而子路由没有缓存, 将会有问题
    if (!ctx || !ctx.include().has(id)) return Component(props)

    const ani = params?.transitionEnterName || ctx.aniName()
    // 父级的, 只在这里有,如果没有表示非 alive
    const parentCtx = useContext(ChildContext)
    /**如果 当前组件是属于当前路由的 */
    const myRoute = () =>
      !parentCtx?.id || ctx.caches[id]?.parentId === parentCtx.id

    /** 加id */
    const addCurrentIds = (id: string) =>
      params?.isolated || ctx.currentIds.add(id)

    /** 有数据了 */
    if (ctx.caches[id]) {
      addCurrentIds(id)
    } else {
      /** 当没有缓存时 */
      const parentId = params?.isolated ? null : [...ctx.currentIds].at(-1)

      parentId &&
        ctx.caches[parentId] &&
        ctx.setCaches(
          produce((data: Caches) => {
            const _ = data[parentId]
            _.childIds ? _.childIds.add(id) : (_.childIds = new Set([id]))
          }),
        )

      addCurrentIds(id)
      ctx.setCaches({
        [id]: { id, parentId, init: null } as any,
      })
      createRoot((dispose) =>
        ctx.setCaches(
          produce((data: Caches) => {
            data[id].dispose = dispose
            data[id].owner = getOwner()
            data[id].component = (
              <ChildContext.Provider
                value={{ id }}
                children={createComponent(Component, props)}
              />
            )
          }),
        ),
      )
    }

    /** 滚动条, activated 获取, deactivated 保存滚动数据 */
    const setScrollContain = (t: "set" | "save") => {
      const sn = ctx.scrollName
      if (!sn || ctx.caches[id].childIds?.size || params?.stopSaveScroll) return
      const dom = document.querySelector(sn) as HTMLElement
      if (!dom)
        return console.warn(
          `[solid-alive]:未找到为scrollContainerName=${sn} 的HTML元素`,
        )

      t === "set"
        ? requestAnimationFrame(() =>
            dom.scrollTo(ctx.caches[id].scrollContainer || { left: 0, top: 0 }),
          )
        : ctx.setCaches(
            produce((data: Caches) => {
              const { scrollLeft, scrollTop } = dom
              data[id].scrollContainer = {
                left: scrollLeft,
                top: scrollTop,
              }
            }),
          )
    }

    /** 上次动画函数 */
    let prevAniFn: (() => void) | null = null
    /** 动画 */
    const animation = () => {
      if (ani && !params?.disableAnimation) {
        // 找最顶的父级id
        let _id = id
        while (_id) {
          const parentId = ctx.caches[_id]?.parentId
          if (!parentId) break
          _id = parentId
        }
        //动画函数
        ;((dom: HTMLElement | any[]) => {
          if (!(dom instanceof HTMLElement)) return
          dom.classList.add(ani)
          prevAniFn = () => {
            if (!prevAniFn) return
            dom.removeEventListener("animationend", prevAniFn)
            dom.classList.remove(ani)
          }
          dom.addEventListener("animationend", prevAniFn)
        })((ctx.caches[_id]?.component as any)?.())
      }
    }

    const setEl = () => {
      if ((ctx.caches[id]?.component as any)?.()) {
        ctx.setCaches(
          produce((data: Caches) => {
            data[id].init = true
            data[id].hasEl = true
            data[id].owner = getOwner()
            for (const cb of data[id].aOnceSet || []) {
              cb()
            }
            delete data[id]["aOnceSet"]
          }),
        )
        return true
      }
    }

    createEffect(() => {
      const cache = ctx.caches[id]
      if (!cache) {
        console.warn(`[solid-alive]: include中 id = ${id} 的值不存在`)
        return
      }
      if (!myRoute()) return
      if (pageRefresh && !params?.isolated && cache.childIds?.size) {
        pageRefresh = false
      }
      if (!cache.init && (cache.hasEl || setEl())) {
        untrack(() => {
          animation()
          setScrollContain("set")
          const { scrollDtvs, aSet } = cache
          /** 对 指令加的dom, 保存滚动数据 */
          for (const item of scrollDtvs || []) {
            item[0].scrollTo(item[1])
          }
          for (const cb of aSet || []) {
            cb()
          }
        })
      }
    })

    onCleanup(() => {
      if (!params?.isolated && (pageRefresh || !ctx.caches[id])) return
      prevAniFn?.()
      prevAniFn = null
      const cache = ctx.caches[id]
      if (ctx.currentIds.has(id)) {
        if (cache.parentId) {
          ctx.currentIds.delete(id)
          // 循环删除 currentIds 中的子id
          const del = (ids: Set<string>) => {
            for (const _id of ids) {
              ctx.currentIds.delete(_id)
              const childIds = ctx.caches[_id]?.childIds
              childIds?.size && del(childIds)
            }
          }
          cache.childIds?.size && del(cache.childIds)
        } else {
          // 在销毁一个组件时, 如果其 没有 父级, 就表明它本身是一个根级别的组件, 就去清空 currentIds
          ctx.currentIds.clear()
        }
      }

      if (myRoute()) {
        setScrollContain("save")
        /** 对 指令加的dom, 保存滚动数据 */
        ctx.setCaches(
          produce((data: Caches) => {
            for (const value of data[id].scrollDtvs || []) {
              const { scrollLeft, scrollTop } = value[0]
              value[1].left = scrollLeft
              value[1].top = scrollTop
            }
            data[id].init = false
          }),
        )
        for (const cb of cache.dSet || []) {
          cb()
        }
      }
    })

    /** !!!组件是否要展示 , 为什么要写这个 : 因为在多个路由都缓存的情况下, 子路由会加入 所有未被销毁的父路由中, 暂时没有办法解决 */
    return (
      myRoute() &&
      runWithOwner(ctx.caches[id].owner, () => ctx.caches[id].component)
    )
  }
}
export default aliveTransfer
