import { JSX } from 'solid-js'

export interface ProveiderProps{
  children: JSX.Element
}

export interface NodeInfo {
  id: string
  component?: JSX.Element
  children?: Set<string> | null
  dispose?: (() => void) | null
  onActivated?: null | Set<() => void>
  onDeactivated?: null | Set<() => void>
}


export interface SetElement {
  <T extends keyof NodeInfo>(id: string, prop: T, v: NodeInfo[T]): void
}

export interface StoreProps {
  [propsName: string]: NodeInfo
}

export interface ContextProps {
  elements: StoreProps
  closeSymbol: symbol
  insertElement: (d: NodeInfo) => void
  onActivated: (cb: () => void) => void
  onDeactivated: (cb: () => void) => void
  removeAliveElement: (id?: string) => void
  setElement: SetElement
  setCurrentComponentId: (id: string | symbol) => void
}
