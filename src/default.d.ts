import { JSX, Accessor } from 'solid-js'

export interface ProveiderProps {
  children: JSX.Element
  include?: Array<string> | null
}

export type tActivated = 'onActivated' | 'onDeactivated'

export interface NodeInfo {
  id: string
  owner?: any
  component?: ((props: any) => JSX.Element) | null
  element?: JSX.Element | null
  subIds?: Array<string> | null
  dispose?: (() => void) | null
  onActivated?: Array<() => void> | null
  onDeactivated?:  Array<() => void> | null
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
  currComponentId: string | symbol,
  aliveIds?:Array<string> | null,
  first:boolean
}

export interface ContextProps{
  elements: StoreProps
  info: IInfo
  symbolClose: symbol
  insertElement: (d: NodeInfo) => void
  removeAliveElements: (ids?: Array<IAliveElementIds>) => void
  setCb: (t: tActivated, cb: () => void) => void
}

interface IActive {
  [key: string]: string
}
export interface IPrevCall {
  onActivated: IActive
  onDeactivated: IActive
}

export type IAliveElementIds = string
