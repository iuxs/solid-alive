import { useContext } from 'solid-js'
import { ContextProps } from './default'
import Context from './context'

function useAlive1() {
  var { onActivated, onDeactivated, removeAliveElement, setInfo } =
    useContext<ContextProps>(Context)

  return {
    onActivated,
    onDeactivated,
    removeAliveElement,
    setInfo
  }
}

export function onActivated(fn: () => void) {
  var { onActivated } = useAlive1()
  onActivated(fn)
}
export function onDeactivated(fn: () => void) {
  var { onDeactivated } = useAlive1()
  onDeactivated(fn)
}

/**
 * @returns removeAliveElement  删除缓存组件,
 * @returns aliveFrozen 让 alive 暂时失去响应, 一般在加新增路由数据时使用
 */
export function useAlive() {
  var { removeAliveElement, setInfo } = useAlive1()

  return {
    removeAliveElement,
    aliveFrozen:() => setInfo('frozen', true)
  }
}
