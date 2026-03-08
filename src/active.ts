import { onCleanup, useContext } from "solid-js"
import { ChildContext, Context } from "./context"

import type { Activate } from "./types"

const _ = (t: Activate, cb: () => void) => {
  if (typeof cb !== "function") return
  const { id } = useContext(ChildContext) || {}
  const ctx = useContext(Context)
  if (!id || !ctx) {
    return
  }
  ctx.setActive(id, t, cb, "add")
  onCleanup(() => {
    ctx.setActive(id, t, cb, "delete")
  })
}
/**
 *  @description 进入缓存
 * ```tsx
 * import { onActivated } from 'solid-alive'
 * //use
 * onActivated(()=> console.log(234))
 * ```
 */
export const onActivated = (cb: () => void) => {
  _("aSet", cb)
}

/**
 * @description  离开缓存
 * ```tsx
 * import { onDeactivated } from 'solid-alive'
 * onDeactivated(()=> console.log(234))
 * ```
 */
export const onDeactivated = (cb: () => void) => {
  _("dSet", cb)
}


