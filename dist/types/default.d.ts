import { JSX } from 'solid-js'

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      directiveSaveScroll: ((dom: Element) => void) | boolean
    }
  }
}

export interface pub {
  scrollId?: string // 保存
  behavior?: 'alwaysTop' | 'saveScroll'
  transitionEnterName?: 'appear' | 'toLeft'
}

export interface ProveiderProps extends pub {
  children: JSX.Element
}

export interface NodeInfo {
  id: string
  component?: JSX.Element
  scroll?: { top: number; left: number } | null
  domList?: Map<Element, { top: number; left: number }> | null
  children?: Set<string> | null
  dispose?: (() => void) | null
  onActivated?: null | Set<() => void>
  onDeactivated?: null | Set<() => void>
  isTop?: boolean
}


export interface SetElement {
  <T extends keyof NodeInfo>(id: string, prop: T, v: NodeInfo[T]): void
}

export interface StoreProps {
  [propsName: string]: NodeInfo
}

export interface ContextProps extends pub {
  scrollDom: { current: Element | null }
  elements: StoreProps
  closeSymbol: symbol
  insertElement: (d: NodeInfo) => void
  onActivated: (cb: () => void) => void
  onDeactivated: (cb: () => void) => void
  removeAliveElement: (id?: string) => void
  setElement: SetElement
  setCurrentComponentId: (id: string | symbol) => void
  saveElScroll: (dom: Element) => void // 用来 保存 某一个dom, 暂时用来保存scroll
  resetElScroll: (dom: Element) => boolean // 重置高度, 变成0
  removeScrollEl: (dom: Element) => boolean // 删除 保存的 滚动条 元素
}
