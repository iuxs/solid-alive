import { createEffect, createRoot, JSX, onCleanup, useContext } from "solid-js"
import Context, {
  ChildContext,
  SETACTIVECB,
  CURRENTID,
  PARENTID,
} from "./context"
import { produce } from "solid-js/store"
import { Context as IContext, Element } from "./types"

var initComponent = (
    component: () => JSX.Element,
    parentId?: string,
    cb?: IContext["setActiveCb"],
    id?: string
  ) => (
    <ChildContext.Provider
      value={{
        [CURRENTID]: id,
        [SETACTIVECB]: cb,
        [PARENTID]: parentId,
      }}
    >
      {component()}
    </ChildContext.Provider>
  ),
  // 拿到dom
  getDom = (dom: any): HTMLElement | any[] | undefined => {
    while (typeof dom === "function") {
      dom = dom()
    }
    return dom
  },
  animation = false

/**
 * @description Alive 组件用的 转换函数; aliveTransfer(Comp, ‘/home’)
 * @param { ()=> JSX.Element } Component () => JSX.Element
 * @param { string } id  string,自己的id 值,一定要唯一
 * @param { Array<string> } [subsets]  [string,...], 子组件的 id值 可不传
 */
export default function aliveTransfer(
  Component: <T>(props: T) => JSX.Element,
  id: string,
  subsets?: Array<string> | null
) {
  return function <T>(props: T) {
    var ctx = useContext(Context),
      parentId = useContext(ChildContext)[CURRENTID],
      transitionEnterName = ctx.transitionEnterName() as string

    if (!ctx.aliveIds()?.includes(id))
      return initComponent(() => Component(props))

    if (
      parentId &&
      ctx.elements[id]?.parentId &&
      ctx.elements[id].parentId !== parentId
    ) {
      return null
    }

    if (ctx.elements[id]) {
      // 冻结, 在 路由 更新 时, 可用 这个 让 正在 使用的缓存 页面不刷新
      ctx.info.frozen
        ? ctx.elements[id].subsets?.some((_id) => ctx.elements[_id]) ||
          (ctx.info.frozen = false)
        : ctx.elements[id].onActivated?.forEach((cb) => cb())
    } else {
      ctx.setElements({
        [id]: { id, subsets: Array.isArray(subsets) ? subsets : null },
      })

      createRoot((dispose) => {
        ctx.setElements(
          produce((data: Record<string, Element>) => {
            data[id].dispose = dispose
            data[id].parentId = Object.values(ctx.elements).find((item) =>
              item.subsets?.includes(id)
            )?.id
            data[id].element = initComponent(
              () => Component(props),
              data[id].parentId,
              ctx.setActiveCb,
              id
            )
          })
        )
      })
    }
    var _animation = (dom?: HTMLElement | any[] | undefined) => {
      if (!(dom instanceof HTMLElement) || animation) return
      animation = true
      dom.classList.add(transitionEnterName)
      var _ = () => {
        dom.removeEventListener("animationend", _)
        dom.classList.remove(transitionEnterName)
        animation = false
      }
      dom.addEventListener("animationend", _)
    }

    transitionEnterName &&
      !ctx.info.frozen &&
      createEffect(() => {
        if (animation) return
        var parentId: string | undefined = id
        do {
          ctx.elements[parentId].parentId ||
            _animation(getDom(ctx.elements[parentId].element))

          parentId = ctx.elements[parentId].parentId
        } while (parentId)
      })

    onCleanup(() => {
      ctx.info.frozen || ctx.elements[id]?.onDeactivated?.forEach((cb) => cb())
    })

    return ctx.elements[id].element
  }
}
