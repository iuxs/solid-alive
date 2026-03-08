import { createContext } from "solid-js"

import type { ContextProps } from "./types"

const Context = createContext<ContextProps>()

const ChildContext = createContext<{ id: string }>()

export { ChildContext, Context }
