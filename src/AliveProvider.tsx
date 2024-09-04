import {
  ProveiderProps,
  StoreProps,
  NodeInfo,
  IInfo,
  IPrevCall,
  IAliveElementIds
} from './default'
import { createStore, produce } from 'solid-js/store'
import Context from './context'
import { on } from 'solid-js'
import { getCallerFunctionName } from './utils'
/**
 * @description Alive
 * @param children jsx.element
 */
export default function AliveProvider(props: ProveiderProps) {
  let [elements, setElements] = createStore<StoreProps>(),
    [info, setInfo] = createStore<IInfo>({ frozen: true }),
    currComponentId: string | symbol = '',
    activeCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    deActiveCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    prevCall: IPrevCall = {
      onActivated: {}, 
      onDeactivated: {}
    }
  var insertElement = (action: NodeInfo) => {
    let id = action.id
    var res = Object.values(elements).find(item => item.subIds?.has(id))
    setElements([id], {
      ...elements[id],
      ...action,
      fatherId: res?.id
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
    if (!Reflect.has(elements, id)) return
    var subIds = elements[id]?.subIds
    subIds?.forEach(cid => cid !== id && removeItem(cid))
    setElements(d => {
      d[id].dispose?.()
      ;(d[id] as any) = null
      delete d[id]
      return d
    })
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

  var setCurrentComponentId = (id: string | symbol) => {
    currComponentId = id
  }

  var isFirstCb = (cbType: 'onActivated' | 'onDeactivated') => {
    var { caller, path } = getCallerFunctionName()
    var currCall = prevCall[cbType]
    if (currCall[caller] && currCall[caller] !== path) {
      return false
    }
    prevCall[cbType][caller] = path
    return true
  }

  var setCb = (t: 'onActivated' | 'onDeactivated', cb: () => void) => {
    if (!info.frozen && cb && isFirstCb(t)) {
      var obj = {
        onActivated: activeCbMap,
        onDeactivated: deActiveCbMap
      }
      var v = obj[t]
      var prev = v.get(currComponentId) || new Set()
      prev.add(on([], cb)) && v.set(currComponentId, prev)
    }
  }

  var onActivated = (cb: () => void) => {
    setCb('onActivated', cb)
  }

  var onDeactivated = (cb: () => void) => {
    setCb('onDeactivated', cb)
  }

  return (
    <Context.Provider
      value={{
        info,
        elements,
        setInfo,
        onActivated,
        onDeactivated,
        insertElement,
        removeAliveElements,
        setCurrentComponentId,
        insertCacheCb
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
