import {
  JSX,
  getOwner,
  useContext,
  createRoot,
  runWithOwner,
  createEffect,
  onCleanup
} from 'solid-js'
import Context from './context'
import { ContextProps } from './default'

import styles from './index.module.css'

let prevTimer = 0,
  aniPrevTimer = 0,
  dom: Element | null = null // dom
/**
 * @description Alive 组件用的 转换函数
 * @param { string } Componet,
 * @param { string } id  string,自己的id 值,一定要唯一
 * @param { Array<string> } [children]  [string,...], 子组件的 id值 可不传，这样默认销毁时不会去干掉子组件，
 */
export default function AliveTransfer(
  Component: () => JSX.Element,
  id: string,
  children?: Array<string> | null
  // params?:{
  //   noGlobalScroll?:boolean,
  //   transitionEnterName?:pub['transitionEnterName']
  // }
): JSX.Element {
  var {
    behavior,
    elements,
    scrollId,
    closeSymbol,
    transitionEnterName,
    insertElement,
    saveScroll,
    setCurrentComponentId
  } = useContext<ContextProps>(Context)

  if (!Reflect.has(elements, id)) {
    setCurrentComponentId(id)
    createRoot(dispose => {
      insertElement({
        id,
        dispose,
        component: <Component />,
        onDeactivated: null,
        onActivated: null,
        owner: getOwner,
        scroll: { top: 0, left: 0 },
        children: Array.isArray(children) ? children : null,
        domList: null
      })
    })
  }
  // cache 将scrollTop 保存, scroll: 视口将滚动到指定位置
  var scrollType = (t: 'cacheScroll' | 'scrollTo') => {
    // 当没有 指定元素,
    if (!scrollId || !dom) return
    if (t === 'cacheScroll') {
      var scroll =
        behavior === 'alwaysTop'
          ? { top: 0, left: 0 }
          : { top: dom.scrollTop, left: dom.scrollLeft }
      saveScroll(id, scroll)
    } else {
      // if (t === 'scrollTo')
      var nowDate = Date.now()
      // 用于 父子组件, 在父子组件 时, 用子的scrollTop
      if (nowDate - prevTimer > 200) {
        const {top = 0,left = 0} = elements[id]?.scroll || {}
        dom.scrollTop = top
        dom.scrollLeft = left
        prevTimer = nowDate
      }
    }
  }

  // 加动画
  if (
    transitionEnterName &&
    elements[id]?.owner &&
    Date.now() - aniPrevTimer > 200
  ) {
    aniPrevTimer = Date.now()
    let comp = (() => elements[id]?.component) as Function
    let dom = comp?.()
    typeof dom === 'function' && (dom = dom?.())
    if (dom instanceof HTMLElement) {
      // 加样式
      var className = styles[transitionEnterName] || transitionEnterName
      dom.classList.add(className)
      const appear = () => {
        // 删样式
        dom.classList.remove(className)
        dom.removeEventListener('animationend', appear)
      }
      dom.addEventListener('animationend', appear)
    }
  }

  createEffect(() => {
    if (scrollId && !dom) {
      dom = document.getElementById(scrollId)
      !dom && console.error(`[solid-alive] scrollId: ${scrollId} is null `)
    }
    elements[id].onActivated?.()
    scrollType('scrollTo')
    // 当前页面绑定的的,要保存滚动条的元素,滚动到指定位置
    elements[id].domList?.forEach((d, el) => {
      el.scrollTop = d.top
      el.scrollLeft = d.left
    })
  })

  onCleanup(() => {
    setCurrentComponentId(closeSymbol)
    elements[id].onDeactivated?.()
    scrollType('cacheScroll')
    // 当前页面绑定的的,要保存滚动条的元素,
    elements[id].domList?.forEach((_, el, map) =>
      map.set(el, { top: el.scrollTop, left: el.scrollLeft })
    )
  })

  return runWithOwner(elements[id].owner, () => elements[id].component)
}
