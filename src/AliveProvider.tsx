import { ProveiderProps, StoreProps, NodeInfo, SetElement } from './default'
import { createStore, produce } from 'solid-js/store'
import Context from './context'
import { createEffect,on } from 'solid-js'
/**
 * @description Alive
 * @param children jsx.element
 * @param { string } [scrollId] id,如 'root' 会在切换组件时的动作,默认saveScrollTop
 * @param { 'alwaysTop'|'saveScroll' } [behavior] 'alwaysTop'|'saveScroll' dom元素滚动条会如何保持
 * @param { 'appear'|'toLeft' } [transitionEnterName] 'appear'|'toLeft' 路由切换动画, 可以自己加,看dist 中的样式格式
 */
export default function AliveProvider(props: ProveiderProps) {
  var [elements, setElements] = createStore<StoreProps>()
  var scrollDom: { current: Element | null } = { current: null }

  // 当前正进入的id
  let closeSymbol = Symbol('close'),
    currComponentId: string | symbol = closeSymbol,
    activeCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    deActiveCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    domMap: Map<
      string | symbol,
      Map<Element, { top: number; left: number }>
    > = new Map() // 保存 对应的路由 dom
  // 插入需要缓存的组件
  var insertElement = (action: NodeInfo) => {
    let id = action.id,
      onActivated = activeCbMap.get(id),
      onDeactivated = deActiveCbMap.get(id),
      domList = domMap.get(id)
    activeCbMap.delete(id)
    deActiveCbMap.delete(id)
    domMap.delete(id)
    setElements([id], {
      ...elements[id],
      ...action,
      onActivated,
      onDeactivated,
      domList
    })
  }
  var removeItem = (id: string) => {
    if (!Reflect.has(elements, id)) return
    var children = elements[id]?.children
    // 当缓存了的父组件被删除，　这里会删除子组件
    children?.forEach(cid => cid !== id && removeItem(cid))
    setElements(d => {
      d[id].onDeactivated = null
      d[id].component = null
      d[id].dispose?.()
      d[id].dispose = null
      d[id].onActivated = null
      d[id].onDeactivated = null
      d[id].scroll = null
      d[id].id = ''
      d[id].children = null
      d[id].domList = null // 它需要保存滚动条的Map 数据
      d[id].isTop = false
      ;(d[id] as any) = null
      delete d[id]
      return d
    })
  }

  // id 没有就删除全部缓存的组件, id有就删除对应的id组件
  var removeAliveElement = (id?: string) => {
    if (id == null) {
      for (const elenment of Object.values(elements)) {
        removeItem(elenment.id)
      }
    } else removeItem(id)
  }
  // 当前创建id
  var setCurrentComponentId = (id: string | symbol) => {
    currComponentId = id
  }

  // 设置属性
  const setElement: SetElement = (id, prop, v) => {
    Reflect.has(elements, id) &&
      setElements(
        produce(d => {
          d[id][prop] = v
        })
      )
  }
  var setCb = (t: 'onActivated' | 'onDeactivated', cb: () => void) => {
    const obj = {
      onActivated: activeCbMap,
      onDeactivated: deActiveCbMap
    }
    var v = obj[t]
    if (currComponentId !== closeSymbol) {
      var prev = v.get(currComponentId) || new Set()
      prev.size < 100 && prev.add(cb) && v.set(currComponentId, prev)
    }
  }

  //keepAlive下  激活缓存组件
  var onActivated = (cb: () => void) => {
    setCb('onActivated', on([],cb) )
  }

  // keepalive下 暂时退出缓存组件
  var onDeactivated = (cb: () => void) => {
    setCb('onDeactivated', on([],cb))
  }

  // 缓存dom, 现在暂时用于缓存高度
  var saveElScroll = (dom: Element, cb?: () => (d: Element) => void) => {
    if (currComponentId !== closeSymbol) {
      var prevWeakMap = domMap.get(currComponentId) ?? new Map([]) // 上次的Map数据
      var currWeakMap = prevWeakMap.set(dom, { top: 0, left: 0 }) // 加入新的
      domMap.set(currComponentId, currWeakMap) // 加入到对应路由
      cb?.()?.(dom)
    }
  }
  // 删除 保存的 滚动条 元素
  var removeScrollEl = (dom: Element) => {
    for (const obj of Object.values(elements)) {
      if (obj.domList?.has(dom)) {
        obj.domList.delete(dom)
        dom.scrollTop = 0
        dom.scrollLeft = 0
        return true
      }
    }
    return false
  }
  // 重置 保存的某个滚动条元素
  var resetElScroll = (dom: Element) => {
    for (const obj of Object.values(elements)) {
      if (obj.domList?.has(dom)) {
        obj.domList.set(dom, { top: 0, left: 0 })
        dom.scrollTop = 0
        dom.scrollLeft = 0
        return true
      }
    }
    return false
  }

  createEffect(() => {
    if (props.scrollId) {
      scrollDom.current = document.getElementById(props.scrollId)
      !scrollDom.current &&
        console.error(`[solid-alive] scrollId: ${props.scrollId} is null `)
    }
  })

  return (
    <Context.Provider
      value={{
        scrollDom,
        behavior: props.behavior,
        transitionEnterName: props.transitionEnterName,
        elements,
        closeSymbol,
        onActivated,
        onDeactivated,
        insertElement,
        setElement,
        removeAliveElement,
        setCurrentComponentId,
        saveElScroll,
        resetElScroll,
        removeScrollEl,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
