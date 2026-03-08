import { createStore, produce } from "solid-js/store"
import { createMemo } from "solid-js"
import { Context } from "./context"

import type {
  AliveProviderProps,
  Activate,
  Caches,
  MapType,
  SetType,
} from "./types"

/** 
 * @description 容器
 * @param {JSXElement} children 
 * @param {Array<string>} [include] ['home','about']
 * @param {string} [transitionEnterName] 动画名称, 要 css keyframes 动画
 * @param {string} [scrollContainerName] 滚动容器, 如 html, body, .contain, #xxy, ...
 * @example
 * ```jsx
 *  <AliveProvider
      include={['home','about']}
      transitionEnterName="ease-show"
      scrollContainerName=".contain"
    >
      <Router root={Contain} children={routes} />
    </AliveProvider>
 * ```
 * */
export default function (props: AliveProviderProps) {
  const [caches, setCaches] = createStore<Caches>({}),
    /** 保存 active的函数  */
    setActive = (id: string, t: Activate, cb: () => void, t1: SetType) =>
      setCaches(
        produce((data: Caches) =>
          data[id][t]
            ? data[id][t][t1](cb)
            : t1 === "add" && (data[id][t] = new Set([cb])),
        ),
      )
  /** 指令的dom */
  const setDirective = (id: string, dom: HTMLElement, t: MapType) =>
    setCaches(
      produce((data: Caches) => {
        // 新增 指令
        const cache = data[id]["scrollDtvs"]!
        if (t === "set") {
          !cache && (data[id]["scrollDtvs"] = new Map())
          data[id]["scrollDtvs"]!.set(dom, { left: 0, top: 0 })
        } else {
          //删除 指令
          if (cache?.has(dom)) {
            cache.delete(dom)
            !cache.size && delete data[id]["scrollDtvs"]
          }
        }
      }),
    )
  /** 删除 */
  const removeCaches = (ids: Set<string>) =>
    setCaches(
      produce((data: Caches) => {
        const remove = (ss: Set<string>) => {
          for (const s of ss) {
            if (!data[s]) continue
            data[s].dispose()
            data[s].parentId && data[data[s].parentId]?.childIds?.delete(s)
            data[s].component = null
            data[s].owner = null
            delete data[s]
          }
        }
        remove(ids)
      }),
    )

  /** 当 include 变少了, 找出 少了哪些, 然后将少了的 从 caches 中 删除 */
  const include = createMemo<Set<string>>((prev) => {
    if (!Array.isArray(props.include)) return new Set([])
    if (prev?.size) {
      for (const id of props.include) {
        prev.delete(id)
      }
      prev.size && removeCaches(prev)
    }
    const _set = new Set(props.include)
    _set.size &&
      _set.size !== props.include.length &&
      console.warn("[solid-alive]:include中有值重复")
    return _set
  })

  return (
    <Context.Provider
      value={{
        caches,
        include,
        currentIds: new Set(),
        setCaches,
        setActive,
        aniName: () => props.transitionEnterName,
        scrollName: props.scrollContainerName,
        setDirective,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
