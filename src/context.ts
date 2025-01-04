import { createContext } from "solid-js"
import { Context } from "./types"

export const CURRENTID = Symbol("currentId")
export const SETACTIVECB = Symbol("setActiveCb")

export default createContext<Context>({
  elements: {},
  setElements: () => void 0,
  setActiveCb: () => void 0,
  aliveIds: ()=> void 0,
})

export const ChildContext = createContext<{
  [CURRENTID]: string | undefined
  [SETACTIVECB]: Context["setActiveCb"]
}>({
  [CURRENTID]: undefined,
  [SETACTIVECB]: () => void 0,
})
