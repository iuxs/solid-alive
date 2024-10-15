import {
  useContext,
  createRoot,
  onCleanup,
  JSX,
  getOwner,
  runWithOwner,
} from "solid-js"
import Context from "./context"
import { ContextProps } from "./default"

/**
 * @description Alive 组件用的 转换函数; aliveTransfer(Comp, ‘/home’)
 * @param { ()=> JSX.Element } Component () => JSX.Element
 * @param { string } id  string,自己的id 值,一定要唯一
 * @param { Array<string> } [subIds]  [string,...], 子组件的 id值 可不传，这样默认销毁时不会去干掉子组件，
 */
export default function aliveTransfer(
  Component: <T>(props: T) => JSX.Element,
  id: string,
  subIds?: Array<string>
) {
  return function <T>(props: T) {
    var { info, elements, symbolClose, insertElement } =
      useContext<ContextProps>(Context)
    if (Array.isArray(info.aliveIds) && !info.aliveIds.includes(id))
      return Component(props)

    if (elements[id]) {
      info.frozen
        ? !elements[id].subIds?.length && (info.frozen = false)
        : Promise.resolve().then(() =>
            elements[id].onActivated?.forEach((cb) => cb())
          )
    } else {
      info.currComponentId = id
      createRoot((dispose) => {
        insertElement({
          id,
          dispose,
          owner: getOwner(),
          element: Component(props),
          subIds: Array.isArray(subIds) ? subIds : null,
        })
      })
    }

    onCleanup(() => {
      if (info.frozen) return
      if (info.first) {
        info.currComponentId = symbolClose
        info.first = false
      }
      !elements[id].subIds?.length && (info.first = true)
      info.cbOnOff = "off"
      elements[id]?.onDeactivated?.forEach((cb) => cb())
      info.cbOnOff = "on"
    })

    return (
      elements[id].owner &&
      runWithOwner(elements[id].owner, () => elements[id].element)
    )
  }
}
