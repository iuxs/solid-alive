import {
  useContext,
  createRoot,
  createEffect,
  onCleanup,
  JSX,
  createComputed,
} from 'solid-js'
import Context from './context'
import { ContextProps } from './default'

let prevPathSet: Set<string> = new Set([])
/**
 * @description Alive 组件用的 转换函数
 * @param { ()=> JSX.Element } Component,
 * @param { string } id  string,自己的id 值,一定要唯一
 * @param { Array<string> } [subIds]  [string,...], 子组件的 id值 可不传，这样默认销毁时不会去干掉子组件，
 */
export default function aliveTransfer(
  Component: <T>(props: T) => JSX.Element,
  id: string,
  subIds?: Array<string>,
  saveComponent?: boolean
) {
  return function <T>(props: T) {
    var {
      info,
      elements,
      setInfo,
      insertElement,
      setCurrentComponentId,
      insertCacheCb
    } = useContext<ContextProps>(Context)

    if (!Reflect.has(elements, id)) {
      setInfo('frozen', false)
      setCurrentComponentId(id)
      createRoot(dispose => {
        insertElement({
          id,
          dispose,
          owner: null,
          component: saveComponent ? Component : null,
          element: Component<T>(props),
          subIds: Array.isArray(subIds) ? new Set(subIds) : null
        })
      })
    }

    var getFatherId = (id: string): string => {
      if (elements[id].isTop) return id
      var fatherId = Object.values(elements).find(item =>
        item.subIds?.has(id)
      )?.id
      fatherId && (fatherId = getFatherId(fatherId))
      return fatherId || id
    }

    if (!prevPathSet.has(getFatherId(id))) prevPathSet.clear()

    createComputed(() => {
      if (!elements[id].loaded) {
        let dom = elements[id]?.element as any
        while (typeof dom === 'function') {
          dom = dom()
        }
        dom instanceof HTMLElement && insertCacheCb(id)
      }
    })

    createEffect(() => {
      setInfo('frozen', false)
      if (prevPathSet.has(id)) return
      if ( elements[id].loaded) {
        prevPathSet.add(id)
        setInfo('frozen', true)
        elements[id].onActivated?.forEach(cb => cb())
        setInfo('frozen', false)
      }
    })

    onCleanup(() => {
      if (info.frozen) return
      setInfo('frozen', true)
      elements[id].onDeactivated?.forEach(cb => cb())
    })
    return elements[id].element
  }
}
