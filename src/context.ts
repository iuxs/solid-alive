import { createContext } from 'solid-js'
import { ContextProps } from './default'

var Context = createContext<ContextProps>({
  elements: {},
  symbolClose: Symbol('close'),
  info: {
    frozen: false,
    cbOnOff: 'off',
    currComponentId: '',
  },
  setInfo: () => void 0,
  insertElement: () => void 0,
  removeAliveElements: () => void 0,
  insertCacheCb: () => void 0,
  setCb:()=>void 0
})

export default Context
