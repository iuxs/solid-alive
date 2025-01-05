import {
  createRoot,
  getOwner,
  JSX,
  onCleanup,
  runWithOwner,
  useContext,
} from "solid-js"
import Context, { ChildContext, SETACTIVECB, CURRENTID } from "./context"
import { produce } from "solid-js/store"
import { Context as IContext, Element } from "./types"

var initComponent = (
  component: () => JSX.Element,
  cb?: IContext["setActiveCb"],
  id?: string
) => (
  <ChildContext.Provider
    value={{
      [CURRENTID]: id,
      [SETACTIVECB]: cb,
    }}
  >
    {component()}
  </ChildContext.Provider>
)

export default function aliveTransfer(
  Component: <T>(props: T) => JSX.Element,
  id: string,
  subsets?: Array<string>
) {
  return function <T>(props: T) {
    var ctx = useContext(Context)

    if (!ctx.aliveIds()?.includes(id))
      return initComponent(() => Component(props))
    if (ctx.elements[id]) {
      ctx.elements[id].onActivated?.forEach((cb) => cb())
    } else {
      ctx.setElements({
        [id]: { id, subsets: Array.isArray(subsets) ? subsets : null },
      })
      createRoot((dispose) => {
        ctx.setElements(
          produce((data:Record<string, Element>) => {
            data[id].dispose = dispose
            data[id].id = id
            data[id].owner = getOwner()
            data[id].element = initComponent(
              () => Component(props),
              ctx.setActiveCb,
              id
            )
          })
        )
      })
    }

    onCleanup(() => {
      ctx.elements[id].onDeactivated?.forEach((cb) => cb())
    })

    return (
      ctx.elements[id].owner &&
      runWithOwner(ctx.elements[id].owner, () => ctx.elements[id].element)
    )
  }
}
