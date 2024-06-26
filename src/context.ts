import { createContext } from 'solid-js'
import { ContextProps } from './default'

var Context = createContext<ContextProps>({
  elements: {},
  scrollDom: { current: null },
  closeSymbol: Symbol('close'),
  insertElement: () => void 0,
  onDeactivated: () => void 0,
  onActivated: () => void 0,
  removeAliveElement: () => void 0,
  setElement: () => void 0,
  setCurrentComponentId: () => void 0,
  saveElScroll: () => void 0,
  resetElScroll: () => true,
  removeScrollEl: () => true
})

export default Context
