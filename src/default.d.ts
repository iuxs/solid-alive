import { JSX } from 'solid-js'

export interface ProveiderProps {
  children: JSX.Element
}

export interface NodeInfo {
  id: string
  loaded?: boolean
  owner: any
  props?: any
  component?: ((props: any) => JSX.Element) | null
  element?: JSX.Element | null
  subIds?: Set<string> | null
  dispose?: (() => void) | null
  onActivated?: null | Set<() => void>
  onDeactivated?: null | Set<() => void>
  fatherId?: string
}

export interface SetElement {
  (id: string, values: NodeInfo): void
}

export interface StoreProps {
  [key: string]: NodeInfo
}

export interface IInfo {
  frozen: boolean 
  cbOnOff: 'on' | 'off' 
  currComponentId: string | symbol 
}

export type TSetInfo = <T extends keyof IInfo>(key: T, value: IInfo[T]) => void

export interface ContextProps {
  elements: StoreProps
  info: IInfo
  symbolClose: symbol
  setInfo: TSetInfo
  insertElement: (d: NodeInfo) => void
  onActivated: (cb: () => void) => void
  onDeactivated: (cb: () => void) => void
  removeAliveElements: (ids?: Array<IAliveElementIds>) => void
  insertCacheCb: (id: string) => void
}

interface IActive {
  [key: string]: string
}
export interface IPrevCall {
  onActivated: IActive
  onDeactivated: IActive
}

export type IAliveElementIds = string
