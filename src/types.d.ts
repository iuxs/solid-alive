import type { JSXElement, Accessor, Owner } from "solid-js"
import type { SetStoreFunction } from "solid-js/store"
import type { RouteSectionProps } from "@solidjs/router"

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type RouteProps2<T> = RouteSectionProps<T>

export type AliveProviderProps = {
  /** 子组件 */
  children: JSXElement
  /** 缓存的路由, 如 include:['home','about'] */
  include?: Array<string>
  /** 动画类名,要 css keyframes 动画 */
  transitionEnterName?: string
  /** 保存滚动条, 使用 document.querySelector(scrollContainerName) 获取dom */
  scrollContainerName?: string
}

/** 缓存的数据 */
export type Cache = Expand<{
  /** 唯一值 */
  id: string
  /** 没有在 include 中的路由 */
  noCache?: boolean
  /** 表明dom加载过了 */
  hasEl?: boolean
  /** 是否有加载过,  */
  init?: boolean
  /** 其子数据 */
  childIds?: Set<string>
  /** 父级 */
  parentId?: string | null
  /** JSX */
  component?: JSXElement
  /** 上下文 */
  owner: Owner | null
  /** 销毁函数 */
  dispose?: () => void
  /** 只执行一次的 active */
  aOnceSet?: Set<() => void>
  /** 激活 */
  aSet?: Set<() => void>
  /** 离开 */
  dSet?: Set<() => void>
  /** 当 saveScroll 有值时 */
  scrollContainer?: { left: number; top: number }
  /** 指令的 滚动条数据 */
  scrollDtvs?: Map<HTMLElement, { left: number; top: number }>
}>

/** 所有缓存数据 */
export type Caches = Record<string, Cache>

/** 共享数据 */
export type ContextProps = Expand<{
  /** 当前正在展示的 所有id */
  currentIds: Set<string>
  /** 需要缓存的组件 id */
  include: Accessor<Set<string>>
  /** 数据 */
  caches: Record<string, Cache>
  /** 加 缓存 */
  setCaches: SetStoreFunction<Caches>
  /** 缓存回调函数 */
  setActive: (id: string, t: Activate, cb: () => void, t1: SetType) => void
  /** 动画类名, 要 css keyframes 动画*/
  aniName: () => string | void
  /** 滚动容器 名称 */
  scrollName?: string
  /** 指令函数 */
  setDirective: (id: string, dom: HTMLElement, t: MapType) => void
  /** 删除 cache,  deep:深度删除 */
  removeCaches: (ids: Set<string> | Array<string>, deep?: boolean) => void
}>

export type Activate = "aSet" | "dSet" | "aOnceSet"
export type MapType = "set" | "delete"
export type SetType = "add" | "delete"

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      /** 保存当前元素的滚动条数据 */
      aliveSaveScrollDtv?: boolean | ((el: HTMLElement) => boolean | void | any)
    }
  }
}
