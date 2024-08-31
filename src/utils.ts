export function getCallerFunctionName() {
  var caller = null
  var path = null
  try {
    throw new Error()
  } catch (e: any) {
    var stack = e.stack.split('\n')
    var index = stack[0].includes('@') ? 5 : 6
    var str = stack[index].trim()
    var arr = str.includes('@') ? str.split('@') : str.split(' ').slice(1) // 假设当前函数是直接被另一个函数调用的
    caller = arr[0]
    path = arr[1]
  }
  return { caller, path }
}
