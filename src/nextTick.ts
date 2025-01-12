// copy yyx code
const nextTick = (() => {
  let cacheCbArr: Array<() => void> = [],
    pedding = false,
    timerFnc = () => void 0,
    isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    flushCallback = () => {
      pedding = false
      var cbs = cacheCbArr.slice(0)
      cacheCbArr.length = 0
      for (let i = 0; i < cbs.length; i++) {
        cbs[i]()
      }
    }

  if (
    typeof Promise !== "undefined" &&
    typeof Promise.prototype.then === "function"
  ) {
    const p = Promise.resolve()
    timerFnc = () => {
      p.then(flushCallback)
      isIOS && setTimeout(() => void 0)
    }
  } else
  if (typeof MutationObserver !== "undefined") {
    let counter = 1
    const observer = new MutationObserver(flushCallback),
      textNode = document.createTextNode(String(counter))
    observer.observe(textNode, { characterData: true })
    timerFnc = () => {
      counter = (counter + 1) % 2
      textNode.data = String(counter)
    }
  } else {
    timerFnc = () => {
      setTimeout(flushCallback, 0)
    }
  }

  return (cb: () => void) => {
    cacheCbArr.push(cb)
    if (!pedding) {
      pedding = true
      timerFnc()
    }
  }
})()

export default nextTick
