import { Owner, JSX } from "solid-js"
import { SetStoreFunction } from "solid-js/store"

export type EmitType = keyof Emit

export type EmitValue<T extends EmitType> = Emit[T]

export type Activate = "onActivated" | "onDeactivated"

export interface Emit {
  onActivated: () => void
  onDeactivated: () => void
}

export interface ProveiderProps {
  children: JSX.Element
  include?:  Array<string>
}

export interface Element {
  id: string
  element: JSX.Element
  dispose?: () => void
  onActivated?: Set<() => void>
  onDeactivated?: Set<() => void>
  subsets?: Array<string>
  owner?: Owner | null
}
export interface Context {
  elements: Record<string, Element>
  setElements: SetStoreFunction<{}>
  aliveIds: ()=> Array<string> | undefined
  setActiveCb: (id:string,t: Activate, cb: () => void, t1: 'add'| 'delete') => void
}
