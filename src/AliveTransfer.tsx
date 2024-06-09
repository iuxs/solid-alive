import { JSX, useContext, createRoot, createEffect, onCleanup } from 'solid-js'
import Context from './context'
import { ContextProps } from './default'
import styles from './index.module.css'

let prevTimer = 0

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
  // params?:{
  //   noGlobalScroll?:boolean,
  //   transitionEnterName?:pub['transitionEnterName']
  // }
): JSX.Element {
  var {
    behavior,
    elements,
    scrollDom,
    closeSymbol,
    transitionEnterName,
    insertElement,
    setElement,
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
        scroll: { top: 0, left: 0 },
        domList: null
      })
      // 一个组件完结后 ,将重置到其父组件
      let fatherId = Object.values(elements).find(item =>
        item.children?.has(id)
      )?.id
      fatherId && setCurrentComponentId(fatherId)
    })
  }
  // cache 将scrollTop 保存, scroll: 视口将滚动到指定位置
  var scrollType = (t: 'cacheScroll' | 'scrollTo') => {
    // 当没有 指定元素,
    if (!scrollDom.current) return
    if (t === 'cacheScroll') {
      var scroll =
        behavior === 'alwaysTop'
          ? { top: 0, left: 0 }
          : {
              top: scrollDom.current.scrollTop,
              left: scrollDom.current.scrollLeft
            }
      setElement(id, 'scroll', scroll)
    } else {
      // if (t === 'scrollTo')
      var nowDate = Date.now()
      // 用于 父子组件, 在父子组件 时, 用子的scrollTop
      if (nowDate - prevTimer > 200) {
        const { top = 0, left = 0 } = elements[id]?.scroll || {}
        scrollDom.current.scrollTop = top
        scrollDom.current.scrollLeft = left
        prevTimer = nowDate
      }
    }
  }

  // 这个返回 的永远是 顶级
  var getFatherId = (id: string): string | undefined => {
    if (elements[id].isTop) return id
    var fatherId = Object.values(elements).find(item =>
      item.children?.has(id)
    )?.id
    fatherId && (fatherId = getFatherId(fatherId))
    return fatherId || id
  }

  // 加动画
  if (transitionEnterName) {
    let fatherId = getFatherId(id),
      dom
    if (fatherId) {
      dom = elements[fatherId]?.component as unknown as Function
      setElement(fatherId, 'isTop', true)
    }
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
    elements[id].onActivated?.forEach(cb => cb())
    scrollType('scrollTo')
    // 当前页面绑定的的,要保存滚动条的元素,滚动到指定位置
    elements[id].domList?.forEach((d, el) => {
      el.scrollTop = d.top
      el.scrollLeft = d.left
    })
  })

  onCleanup(() => {
    setCurrentComponentId(closeSymbol)
    elements[id].onDeactivated?.forEach(cb => cb())
    scrollType('cacheScroll')
    // 当前页面绑定的的,要保存滚动条的元素,
    elements[id].domList?.forEach((_, el, map) =>
      map.set(el, { top: el.scrollTop, left: el.scrollLeft })
    )
  })

  return elements[id].component
}
