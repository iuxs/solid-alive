import { ProveiderProps, StoreProps, NodeInfo, SetElement } from './default'
import { createStore, produce } from 'solid-js/store'
import Context from './context'
import { on } from 'solid-js'
/**
 * @description Alive
 * @param children jsx.element
 */
export default function AliveProvider(props: ProveiderProps) {
  var [elements, setElements] = createStore<StoreProps>()

  // 当前正进入的id
  let closeSymbol = Symbol('close'),
    currComponentId: string | symbol = closeSymbol,
    activeCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    deActiveCbMap: Map<string | symbol, Set<() => void>> = new Map()

  // 插入需要缓存的组件
  var insertElement = (action: NodeInfo) => {
    let id = action.id,
      onActivated = activeCbMap.get(id),
      onDeactivated = deActiveCbMap.get(id)

    activeCbMap.delete(id)
    deActiveCbMap.delete(id)
    setElements([id], {
      ...elements[id],
      ...action,
      onActivated,
      onDeactivated
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
      d[id].id = ''
      d[id].children = null
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
  var setElement: SetElement = (id, prop, v) => {
    Reflect.has(elements, id) &&
      setElements(
        produce(d => {
          d[id][prop] = v
        })
      )
  }
  var setCb = (t: 'onActivated' | 'onDeactivated', cb: () => void) => {
    if (currComponentId !== closeSymbol && cb) {
      const obj = {
        onActivated: activeCbMap,
        onDeactivated: deActiveCbMap
      }
      var v = obj[t]
      var prev = v.get(currComponentId) || new Set()
      prev.size < 100 && prev.add(on([], cb)) && v.set(currComponentId, prev)
    }
  }

  //keepAlive下  激活缓存组件
  var onActivated = (cb: () => void) => {
    setCb('onActivated', cb)
  }

  // keepalive下 暂时退出缓存组件
  var onDeactivated = (cb: () => void) => {
    setCb('onDeactivated', cb)
  }

  return (
    <Context.Provider
      value={{
        elements,
        closeSymbol,
        onActivated,
        onDeactivated,
        insertElement,
        setElement,
        removeAliveElement,
        setCurrentComponentId
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
