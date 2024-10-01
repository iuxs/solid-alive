import {
  useContext,
  createRoot,
  createEffect,
  onCleanup,
  JSX,
  createComputed,
  getOwner,
  runWithOwner
} from 'solid-js'
import Context from './context'
import { ContextProps } from './default'

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
    var {
      info,
      elements,
      symbolClose,
      setInfo,
      insertElement,
      insertCacheCb,
      aliveIds
    } = useContext<ContextProps>(Context)

    if (aliveIds && aliveIds.includes(id)) {
      !Reflect.has(elements, id) &&
        createRoot(dispose => {
          setInfo('currComponentId', id)
          setInfo('cbOnOff', 'on')
          insertElement({
            id,
            dispose,
            owner: getOwner(),
            element: Component(props),
            subIds: Array.isArray(subIds) ? new Set(subIds) : null
          })
        })
    } else {
      return Component(props)
    }

    var getDom = (id: string) => {
      var dom = elements[id]?.element as any
      while (typeof dom === 'function') {
        dom = dom()
      }
      return dom
    }

    createComputed(() => {
      if (!elements[id].loaded && getDom(id)) {
        insertCacheCb(id)
        !elements[id].subIds?.size && setInfo('currComponentId', symbolClose)
      }
    })

    createEffect(() => {
      if (info.frozen) {
        !elements[id].subIds?.size && setInfo('frozen', false)
        return
      }
      if (elements[id]?.loaded) {
        setInfo('cbOnOff', 'off')
        elements[id].onActivated?.forEach(cb => cb())
        setInfo('cbOnOff', 'on')
      }
    })

    onCleanup(() => {
      if (info.frozen) return
      setInfo('cbOnOff', 'off')
      elements[id]?.onDeactivated?.forEach(cb => cb())
      setInfo('cbOnOff', 'on')
    })

    return (
      elements[id].owner &&
      runWithOwner(elements[id].owner, () => elements[id].element)
    )
  }
}
