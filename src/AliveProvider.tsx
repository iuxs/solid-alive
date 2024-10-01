import {
  ProveiderProps,
  StoreProps,
  NodeInfo,
  IInfo,
  IPrevCall,
  IAliveElementIds,
  TSetInfo,
  tActivated
} from './default'
import { createStore, produce } from 'solid-js/store'
import Context from './context'
import { createComputed, on } from 'solid-js'

/**
 * @description Alive
 * @param children jsx.element
 * @param {Arrya<string> | null} [includes]  哪些路由要缓存, 不写默认缓存所有
 */
export default function AliveProvider(props: ProveiderProps) {
  let [elements, setElements] = createStore<StoreProps>(),
    info: IInfo = {
      frozen: false,
      cbOnOff: 'off',
      currComponentId: ''
    },
    symbolClose = Symbol('close'),
    activeCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    deActiveCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    prevCall: IPrevCall = {
      onActivated: {}, 
      onDeactivated: {}
    }
  var insertElement = (action: NodeInfo) => {
    let id = action.id,
      father = Object.values(elements).find(item => item.subIds?.has(id))
    setElements([id], {
      ...elements[id],
      ...action,
      fatherId: father?.id
    })
  }
  var insertCacheCb = (id: string) => {
    let onActivated = activeCbMap.get(id),
      onDeactivated = deActiveCbMap.get(id)
    activeCbMap.delete(id)
    deActiveCbMap.delete(id)
    prevCall.onActivated = {}
    prevCall.onDeactivated = {}
    Reflect.has(elements, id) &&
      setElements(
        produce(d => {
          d[id]['onActivated'] = onActivated
          d[id]['onDeactivated'] = onDeactivated
          d[id]['loaded'] = true
        })
      )
  }

  var removeItem = (id: string) => {
    if (Reflect.has(elements, id)) {
      var subIds = elements[id]?.subIds
      subIds?.forEach(cid => cid !== id && removeItem(cid))
      elements[id].dispose?.()
      setElements({ [id]: undefined })
    }
  }

  var removeAliveElements = (ids?: Array<IAliveElementIds>) => {
    if (Array.isArray(ids)) {
      for (const id of ids) {
        removeItem(id)
      }
    } else if (!ids) {
      for (const elenment of Object.values(elements)) {
        removeItem(elenment.id)
      }
    }
  }

  var setCb = (t: tActivated, cb: () => void) => {
    var { cbOnOff, currComponentId } = info
    if (cbOnOff === 'on' && currComponentId !== symbolClose && cb) {
      var v = {
        onActivated: activeCbMap,
        onDeactivated: deActiveCbMap
      }[t]
      var prev = v.get(currComponentId) || new Set()
      prev.add(on([], cb)) && v.set(currComponentId, prev)
    }
  }

  var setInfo: TSetInfo = (key, value) => {
    info[key] = value
  }

  createComputed<Array<string>>((prevIds = []) => {
    var _inc = props.includes || []
    if (prevIds.length > _inc.length) {
      var set = new Set(_inc)
      removeAliveElements(prevIds.filter(id => !set.has(id)))
    }
    return _inc
  },props.includes || [])

  return (
    <Context.Provider
      value={{
        info,
        elements,
        symbolClose,
        setInfo,
        setCb,
        insertElement,
        removeAliveElements,
        insertCacheCb,
        aliveIds: props.includes
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
