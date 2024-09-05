import { createContext } from 'solid-js'
import { ContextProps } from './default'

var Context = createContext<ContextProps>({
  elements: {},
  symbolClose: Symbol('close'),
  info: {
    frozen: false,
    cbOnOff: 'off',
    currComponentId: '',
    prevComponentId: ''
  },
  setInfo: () => void 0,
  insertElement: () => void 0,
  onDeactivated: () => void 0,
  onActivated: () => void 0,
  removeAliveElements: () => void 0,
  insertCacheCb: () => void 0,
  setCurrcomponent: () => void 0
})

export default Context
