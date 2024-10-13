import { useContext } from 'solid-js'
import { ContextProps } from './default'
import Context from './context'

function useAlive1() {
  var { setCb, removeAliveElements, info } =
    useContext<ContextProps>(Context)

  return {
    onActivated: (cb: () => void) => setCb('onActivated', cb),
    onDeactivated: (cb: () => void) => setCb('onDeactivated', cb),
    removeAliveElements,
    info
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
 * @returns onActivated 进入
 * @returns onDeactivated 离开
 */
export function useAlive() {
  var { removeAliveElements, info, onActivated, onDeactivated } = useAlive1()

  return {
    onActivated,
    onDeactivated,
    removeAliveElements,
    aliveFrozen: () => info.frozen = true
  }
}
