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
let routeRefresh = false

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
const aliveTransfer = <T extends Record<string, any>>(
  Component: (props: T) => JSXElement,
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
  params?.isolated || (routeRefresh = true)
  return function (props: T) {
    const ctx = useContext(Context)
    // 如果父路由缓存,而子路由没有缓存, 将会有问题
    if (!ctx || (!id && console.error(`[solid-alive]:id='${id}' 不正确`)))
      return createComponent(Component, props)
    /** 动画名称 */
    const aniName = params?.transitionEnterName || ctx.aniName()
    /** 父级的, 只在这里有,如果没有表示非 alive */
    const parentCtxId = useContext(ChildContext)?.id

    /**如果 当前组件是属于当前路由的 */
    const myRoute = () =>
      !parentCtxId || ctx.caches[id]?.parentId === parentCtxId

    /** 独立组件 */
    const isolated = params?.isolated

    if (ctx.caches[id]) {
      isolated || ctx.currentIds.add(id)
    } else {
      /** 当没有缓存时 */
      const parentId = isolated ? null : [...ctx.currentIds].at(-1)

      parentId &&
        ctx.caches[parentId] &&
        ctx.setCaches(
          produce((data: Caches) => {
            const _ = data[parentId]
            _.childIds ? _.childIds.add(id) : (_.childIds = new Set([id]))
          }),
        )

      isolated || ctx.currentIds.add(id)
      // 不是缓存数据
      const noCache = !ctx.include().has(id)
      ctx.setCaches({
        [id]: { id, parentId, ...(noCache && { noCache }) } as any,
      })
      createRoot((dispose) =>
        ctx.setCaches(
          produce((data: Caches) => {
            data[id].dispose = dispose
            data[id].owner = getOwner()
            data[id].component = (
              <ChildContext.Provider
                value={{ id, ...(noCache && { noCache }) }}
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
      if (
        !sn ||
        params?.stopSaveScroll ||
        isolated ||
        ctx.caches[id].childIds?.size
      )
        return
      const dom = document.querySelector(sn) as HTMLElement
      if (!dom)
        return console.warn(
          `[solid-alive]:未找到为scrollContainerName='${sn}' 的HTML元素`,
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
      if (aniName && !params?.disableAnimation) {
        // 找最顶的父级id
        let _id = id
        while (_id) {
          const parentId = ctx.caches[_id]?.parentId
          if (!parentId) break
          _id = parentId
        }
        //动画函数
        ;((dom: HTMLElement) => {
          if (!(dom instanceof HTMLElement)) return
          dom.classList.add(aniName)
          prevAniFn = () => {
            dom.removeEventListener("animationend", prevAniFn!)
            dom.classList.remove(aniName)
            prevAniFn = null
          }
          dom.addEventListener("animationend", prevAniFn)
        })((ctx.caches[_id].component as any)?.())
      }
    }

    const setEl = () => {
      if ((ctx.caches[id]?.component as any)?.()) {
        ctx.setCaches(
          produce((data: Caches) => {
            data[id].hasEl = true
            data[id].owner = getOwner()
            for (const cb of data[id].aOnceSet || []) {
              cb()
            }
            delete data[id].aOnceSet
          }),
        )
        return true
      }
    }

    createEffect(() => {
      const cache = ctx.caches[id]
      if (!cache || !myRoute()) return
      if (routeRefresh && !isolated && !cache.childIds?.size) {
        routeRefresh = false
      }
      if (!cache.init && (cache.hasEl || setEl())) {
        untrack(() => {
          ctx.setCaches(id, "init", true)
          animation()
          setScrollContain("set")
          /** 对 指令加的dom, 保存滚动数据 */
          for (const item of cache.scrollDtvs || []) {
            item[0].scrollTo(item[1])
          }
          for (const cb of cache.aSet || []) {
            cb()
          }
        })
      }
    })

    onCleanup(() => {
      const cache = ctx.caches[id]
      if (!isolated && (routeRefresh || !cache)) return
      prevAniFn?.()

      // 循环删除 currentIds 中的子id
      // 在销毁一个组件时, 如果其 没有 父级, 就表明它本身是一个根级别的组件, 就去清空 currentIds
      if (!cache.parentId) ctx.currentIds.clear()
      else if (ctx.currentIds.has(id)) {
        const delCurrIds = (ids: Array<string> | Set<string>) => {
          for (const _id of ids) {
            ctx.currentIds.delete(_id)
            const childIds = ctx.caches[_id]?.childIds
            childIds?.size && delCurrIds(childIds)
          }
        }
        delCurrIds([id])
      }

      if (!myRoute()) return

      const needCache = !cache.noCache && cache.hasEl

      if (needCache) {
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
      }

      for (const cb of cache.dSet || []) {
        cb()
      }
      /** 已删除页面 与 未缓存的页面 的数据清空*/
      needCache ||
        ctx.setCaches(
          produce((data: Caches) => {
            data[id].parentId && data[data[id].parentId]?.childIds?.delete(id)
            data[id].dispose?.()
            delete data[id]
          }),
        )
    })

    /** !!!组件是否要展示 , 为什么要写这个 : 因为在多个路由都缓存的情况下, 子路由会加入 所有未被销毁的父路由中, 暂时没有办法解决 */
    return (
      myRoute() &&
      runWithOwner(ctx.caches[id].owner, () => ctx.caches[id].component)
    )
  }
}
export default aliveTransfer
