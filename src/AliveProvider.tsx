import {
  ProveiderProps,
  StoreProps,
  NodeInfo,
  IInfo,
  IAliveElementIds,
  tActivated
} from "./default"
import { createStore, produce } from "solid-js/store"
import Context from "./context"
import { createComputed, on } from "solid-js"

/**
 * @description Alive
 * @param children jsx.element
 * @param {Arrya<string> | null} [include]  哪些路由要缓存, 不写默认缓存所有
 */
export default function AliveProvider(props: ProveiderProps) {
  let [elements, setElements] = createStore<StoreProps>(),
    symbolClose = Symbol("close"),
    info: IInfo = {
      frozen: false,
      cbOnOff: "on",
      currComponentId: symbolClose,
      aliveIds: null,
      first:true
    }
  var insertElement = (action: NodeInfo) => {
    setElements([action.id], { ...elements[action.id], ...action })
  }
  var removeItem = (id: string) => {
    if (elements[id]) {
      elements[id].subIds?.forEach(cid => cid !== id && removeItem(cid))
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
      for (const id of Object.keys(elements)) {
        removeItem(id)
      }
    }
  }

  var setCb = (t: tActivated, cb: () => void) => {
    var cbOnOff = info.cbOnOff
    var id = info.currComponentId
    if (cbOnOff === "on" && typeof id === "string" && cb) {
      !elements[id] && setElements({ [id]: { id } })
      setElements(
        produce(d => {
          d[id as string][t] = [...(d[id as string][t] || []), on([], cb)]
        })
      )
      t === "onActivated" &&
        Promise.resolve().then(() => {
          info.cbOnOff = "off"
          cb()
          info.cbOnOff = "on"
        })
    }
  }

  createComputed<Array<string>>(
    prevIds => {
      var isArr = Array.isArray(props.include)
      var _inc = isArr ? props.include : []
      info.aliveIds = isArr ? props.include : null
      if (prevIds.length > _inc!.length) {
        removeAliveElements(prevIds.filter(id => !_inc!.includes(id)))
      }
      return _inc as Array<string>
    },
    Array.isArray(props.include) ? props.include : []
  )

  return (
    <Context.Provider
      value={{
        info,
        elements,
        symbolClose,
        setCb,
        insertElement,
        removeAliveElements
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
