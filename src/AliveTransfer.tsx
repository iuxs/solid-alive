import { JSX, useContext, createRoot, createEffect, onCleanup } from 'solid-js'
import Context from './context'
import { ContextProps } from './default'

/**
 * @description Alive 组件用的 转换函数
 * @param { ()=> JSX.Element } Componet,
 * @param { string } id  string,自己的id 值,一定要唯一
 * @param { Array<string> } [children]  [string,...], 子组件的 id值 可不传，这样默认销毁时不会去干掉子组件，
 */
export default function AliveTransfer(
  Component: () => JSX.Element,
  id: string,
  children?: Array<string> | null
): JSX.Element {
  var {
    elements,
    closeSymbol,
    insertElement,
    setCurrentComponentId
  } = useContext<ContextProps>(Context)

  if (!Reflect.has(elements, id)) {
    setCurrentComponentId(id)
    insertElement({
      id,
      children: Array.isArray(children) ? new Set(children) : null
    })

    createRoot(dispose => {
      insertElement({
        id,
        dispose,
        component: <Component />,
        onDeactivated: null,
        onActivated: null,
      })
      // 一个组件完结后 ,将重置到其父组件
      var fatherId = Object.values(elements).find(item =>
        item.children?.has(id)
      )?.id
      fatherId && setCurrentComponentId(fatherId)
    })
  }

  createEffect(() => {
    elements[id].onActivated?.forEach(cb => cb())
  })

  onCleanup(() => {
    setCurrentComponentId(closeSymbol)
    elements[id].onDeactivated?.forEach(cb => cb())
  })

  return elements[id].component
}
