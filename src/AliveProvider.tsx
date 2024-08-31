import {
  ProveiderProps,
  StoreProps,
  NodeInfo,
  IInfo,
  TSetInfo,
} from "../dist/types/default"
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
    [info, _setInfo] = createStore<IInfo>({ frozen: true }),
    currComponentId: string | symbol = "",
    activeCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    deActiveCbMap: Map<string | symbol, Set<() => void>> = new Map(),
    prevCall = { cbType: "", caller: "", path: "" }
  var insertElement = (action: NodeInfo) => {
    let id = action.id
    setElements([id], {
      ...elements[id],
      ...action,
    })
  }
  var insertCacheCb = (id: string) => {
    let onActivated = activeCbMap.get(id),
      onDeactivated = deActiveCbMap.get(id)
    activeCbMap.delete(id)
    deActiveCbMap.delete(id)
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
    var children = elements[id]?.children
    children?.forEach((cid) => cid !== id && removeItem(cid))
    setElements((d) => {
      d[id].onDeactivated = null
      d[id].component = null
      d[id].dispose?.()
      d[id].dispose = null
      d[id].onActivated = null
      d[id].onDeactivated = null
      d[id].children = null
      ;(d[id] as any) = null
      delete d[id]
      return d
    })
  }

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

  // 是否是第一次推入函数
  var isFirstCb = (cbType: "onActivated" | "onDeactivated") => {
    var { caller, path } = getCallerFunctionName()
    if (!prevCall.caller || prevCall.cbType !== cbType) {
      prevCall = { caller, path, cbType }
      return true
    }
    if (prevCall.caller === caller && prevCall.path !== path) {
      console.warn(`[solid-alive]:检测到多个${cbType}函数 ${path}`)
      return false
    }
    prevCall = { caller, path, cbType }
    return true
  }

  var setCb = (t: "onActivated" | "onDeactivated", cb: () => void) => {
    if (!info.frozen && cb && isFirstCb(t)) {
      var obj = {
        onActivated: activeCbMap,
        onDeactivated: deActiveCbMap,
      }
      var v = obj[t]
      var prev = v.get(currComponentId) || new Set()
      prev.add(on([], cb)) && v.set(currComponentId, prev)
    }
  }

  //keepAlive下  激活缓存组件
  var onActivated = (cb: () => void) => {
    setCb("onActivated", cb)
  }

  // keepalive下 暂时退出缓存组件
  var onDeactivated = (cb: () => void) => {
    setCb("onDeactivated", cb)
  }

  var setInfo: TSetInfo = (key, value) => {
    _setInfo(key, value)
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
        removeAliveElement,
        setCurrentComponentId,
        insertCacheCb,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
