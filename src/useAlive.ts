import { useContext } from 'solid-js'
import { ContextProps } from './default'
import Context from './context'

/**
 * @returns onActivated  激活缓存组件时触发,
 * @returns onDeactivated  退出缓存组件时触发,
 * @returns removeAliveElement  删除缓存组件,
 * @returns directiveSaveScroll 这个是指令, 缓存组件中需要存的 滚动条, use:directiveSaveScroll, ts 中加 //@ts-ignore
 * @returns resetElScroll  将缓存组件中 某个滚动条的scrollTop scrollLeft 变成 0
 * @returns removeScrollEl  将缓存组件中 某个滚动条dom元素删除了
 */
function useAlive() {
  var {
    onActivated,
    onDeactivated,
    removeAliveElement,
    saveElScroll,
    resetElScroll,
    removeScrollEl
  } = useContext<ContextProps>(Context)

  return {
    onActivated,
    onDeactivated,
    removeAliveElement,
    directiveSaveScroll: saveElScroll,
    resetElScroll,
    removeScrollEl
  }
}

export default useAlive
