import { createContext } from "solid-js"

import { Context } from "./types"

export const CURRENTID = Symbol("currentId")
export const SETACTIVECB = Symbol("setActiveCb")
export const PARENTID = Symbol('parentId')

export default createContext<Context>({
  elements: {},
  setElements: () => void 0,
  setActiveCb: () => void 0,
  aliveIds: () => void 0,
  info: { frozen: false },
  transitionEnterName:()=> void 0,
})

export const ChildContext = createContext<{
  [CURRENTID]: string | undefined
  [SETACTIVECB]?: Context["setActiveCb"]
  [PARENTID]?:string
}>({
  [CURRENTID]: undefined,
  [SETACTIVECB]: () => void 0,
})
