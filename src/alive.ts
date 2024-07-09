import { useContext } from 'solid-js'
import { ContextProps } from './default'
import Context from './context'

/**
 * @returns onActivated  激活缓存组件时触发,
 * @returns onDeactivated  退出缓存组件时触发,
 * @returns removeAliveElement  删除缓存组件,
 */
export function useAlive() {
  var { onActivated, onDeactivated, removeAliveElement } =
    useContext<ContextProps>(Context)

  return {
    onActivated,
    onDeactivated,
    removeAliveElement
  }
}

export function onActivated(fn: () => void) {
  var { onActivated: a } = useAlive()
  a(fn)
}
export function onDeactivated(fn: () => void) {
  var { onDeactivated: a } = useAlive()
  a(fn)
}
