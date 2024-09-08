import {
  ProveiderProps,
  StoreProps,
  NodeInfo,
  IInfo,
  IPrevCall,
  IAliveElementIds,
  TSetInfo,
} from "./default"
import { createStore, produce } from "solid-js/store"
import Context from "./context"
import { on } from "solid-js"
import { getCallerFunctionName } from "./utils"

/**
 * @description Alive
 * @param children jsx.element
 */
export default function AliveProvider(props: ProveiderProps) {
  let [elements, setElements] = createStore<StoreProps>(),
    info: IInfo = {
      frozen: false,
      cbOnOff: "off",
      currComponentId: "",
    },
    symbolClose = Symbol("close"),
    activeCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    deActiveCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    prevCall: IPrevCall = {
      onActivated: {}, 
      onDeactivated: {},
    }

  var insertElement = (action: NodeInfo) => {
    let id = action.id,
      father = Object.values(elements).find((item) => item.subIds?.has(id))
    setElements([id], {
      ...elements[id],
      ...action,
      fatherId: father?.id,
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
        produce((d) => {
          d[id]["onActivated"] = onActivated
          d[id]["onDeactivated"] = onDeactivated
          d[id]["loaded"] = true
        })
      )
  }

  var removeItem = (id: string) => {
    if (!Reflect.has(elements, id)) return
    var subIds = elements[id]?.subIds
    subIds?.forEach((cid) => cid !== id && removeItem(cid))
    elements[id].dispose?.()
    setElements({ [id]: undefined })
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

  var isFirstCb = (cbType: "onActivated" | "onDeactivated") => {
    var { caller, path } = getCallerFunctionName()
    var currCall = prevCall[cbType]
    if (currCall[caller] && currCall[caller] !== path) {
      return false
    }
    prevCall[cbType][caller] = path
    return true
  }

  var setCb = (t: "onActivated" | "onDeactivated", cb: () => void) => {
    var { cbOnOff, currComponentId } = info
    if (
      cbOnOff === "on" &&
      currComponentId !== symbolClose &&
      cb &&
      isFirstCb(t)
    ) {
      var obj = {
        onActivated: activeCbMap,
        onDeactivated: deActiveCbMap,
      }
      var v = obj[t]
      var prev = v.get(currComponentId) || new Set()
      prev.add(on([], cb)) && v.set(currComponentId, prev)
    }
  }

  var onActivated = (cb: () => void) => {
    setCb("onActivated", cb)
  }

  var onDeactivated = (cb: () => void) => {
    setCb("onDeactivated", cb)
  }

  var setInfo: TSetInfo = (key, value) => {
    info[key] = value
  }

  return (
    <Context.Provider
      value={{
        info,
        elements,
        symbolClose,
        setInfo,
        onActivated,
        onDeactivated,
        insertElement,
        removeAliveElements,
        insertCacheCb,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
