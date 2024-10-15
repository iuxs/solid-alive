import { createContext } from 'solid-js'
import { ContextProps } from './default'

var Context = createContext<ContextProps>({
  elements: {},
  symbolClose: Symbol('close'),
  info: {
    frozen: false,
    cbOnOff: 'off',
    currComponentId: '',
    first:true
  },
  insertElement: () => void 0,
  removeAliveElements: () => void 0,
  setCb:()=>void 0
})

export default Context
