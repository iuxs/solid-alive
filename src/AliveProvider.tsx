import { createStore, produce } from "solid-js/store"
import { ProveiderProps, Activate, Element, Info } from "./types"
import Context from "./context"
import { createEffect} from "solid-js"

/**
 * @description Alive
 * @param children jsx.element
 * @param {Arrya<string> | null} [include]  哪些路由要缓存, 默认不缓存, ['/','/about',...]
 * @param {string} [transitionEnterName] 动画名称 transitionEnterName="appear"
 */
export default function AliveProvider(props: ProveiderProps) {
  const [elements, setElements] = createStore<Record<string, Element>>(),
    info: Info = { frozen: false },
    delElements = (ids?: Array<string>) => {
      if (Array.isArray(ids))
        for (var id of ids) {
          elements[id]?.dispose?.()
          setElements({ [id]: undefined })
        }
    },
    setActiveCb = (
      id: string,
      t: Activate,
      cb: () => void,
      t1: "add" | "delete"
    ) => {
      setElements(
        produce((data) => {
          data[id][t]
            ? data[id][t][t1](cb)
            : t1 === "add" && (data[id][t] = new Set([cb]))
        })
      )
    }

  createEffect<Array<string>>(
    (prev) => {
      var arr = Array.isArray(props.include) ? props.include : []
      if (prev.length > arr.length) {
        var set = new Set(arr)
        delElements(prev.filter((id) => !set.has(id)))
      }
      return arr
    },
    Array.isArray(props.include) ? props.include : []
  )

  return (
    <Context.Provider
      value={{
        info,
        elements,
        setElements,
        setActiveCb,
        aliveIds: () => props.include,
        transitionEnterName: () => props.transitionEnterName,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
