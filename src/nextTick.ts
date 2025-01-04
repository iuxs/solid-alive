export function nextTick(cb: () => void) {
  typeof Promise !== "undefined" && typeof Promise.prototype.then === "function"
    ? Promise.resolve().then(cb)
    : setTimeout(cb)
}
