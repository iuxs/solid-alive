import { createEffect, onCleanup, untrack, useContext } from "solid-js"
import { ChildContext, CURRENTID, SETACTIVECB } from "./context"
import { nextTick } from "./nextTick"
import { Activate } from "./types"

function _(t: Activate, cb: () => void) {
  untrack(() => {
    var ctx = useContext(ChildContext),
      currentId = ctx[CURRENTID]

    if (!currentId) return
    ctx[SETACTIVECB]?.(currentId, t, cb, "add")
    t === "onActivated" &&
      createEffect(() => {
        nextTick(cb)
      })
    onCleanup(() => {
      ctx[SETACTIVECB]?.(currentId!, t, cb, "delete")
      ;(cb as any) = null
    })
  })
}

export function onActivated(cb: () => void) {
  _("onActivated", cb)
}

export function onDeactivated(cb: () => void) {
  _("onDeactivated", cb)
}
