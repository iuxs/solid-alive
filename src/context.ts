import { createContext } from 'solid-js'
import { ContextProps } from "../dist/types/default"

var Context = createContext<ContextProps>({
  elements: {},
  info:{ frozen:false},
  setInfo:()=>void 0,
  insertElement: () => void 0,
  onDeactivated: () => void 0,
  onActivated: () => void 0,
  removeAliveElement: () => void 0,
  setCurrentComponentId: () => void 0,
  insertCacheCb:()=>void 0,
})

export default Context
