## solid-alive

### 安装(install)
 - pnpm add solid-alive ／ npm i solid-alive / yarn add solid-alive
### 描述(describe)
- 用于 solid 组件缓存,只测试过2级路由缓存
- AliveProvider 
  - include : 数组,  ['/','/about'], 当数据变少时, 会自动去删除少的数据缓存
- 在 useAlive 
  - onActivated
  - onDeactivated

- 子父 缓存/删除 问题
  -  如果某组件下有子组件,在父的 aliveTransfer中, 
    第三个参数,为对象 写上子组件的唯一id: {children:['/childrenId','asf',...]}



###  使用(use)
 1 /index.tsx,AliveProvider将app 包裹
 ```jsx
import { render } from 'solid-js/web'
import App from './App'
import { AliveProvider } from  'solid-alive'

const root = document.getElementById('root')

render(() => 
  <AliveProvider include={[]}>
    <App />
  </AliveProvider>
, root!)
 ```

2 /App.tsx ,在 solid-alive 中 有 aliveTransfer, 参数: JSX , id:string, children?:[string..]
 ```jsx
 import { Route, Router } from '@solidjs/router';
import { aliveTransfer } from 'solid-alive';

import Home from './views/Home';
import Client from './views/Client';
import About from './views/About';
import Team from './views/Blog/Team';
import Blog from './views/Blog';
import Single from './views/Blog/Single';


const HomeTransfer = aliveTransfer(Home, '/'),
 AboutTsf = aliveTransfer(About, '/about'),
 BlogTsf = aliveTransfer(Blog, '/blog', ['/contact', 'single']),
 SingleTsf = aliveTransfer(Single,'single')

export default function App() {
  return (
    <Router>
      {/* 这个Client 只是用于标签加跳转的,使用时可不用 */}
      <Route component={Client}>
        <Route component={Home} path={'/'} />
        {/* 单个缓存 single */}
        <Route component={AboutTsf} path={'/about'} />
        {/* 父子 缓存 Parent Child Nesting */}
        <Route component={BlogTsf} path={'/blog'}>
          <Route component={SingleTsf} path={'single'} />
        </Route>
      </Route>
    </Router>
  );
}
 ```
3 父 /views/Blog/index.tsx 
```jsx
export default function Blog(props: any) {
  return (
    <div>
      <h2>Blog</h2>
      <div>{props.children}</div>
    </div>
  );
}
```

-  子  /views/Blog/Single/index.tsx 中
```tsx
import {  onActivated,onDeactivated,useAlive, AliveComponent } from "solid-alive"

export default function Single() {
  const { removeAliveElements,aliveFrozen } = useAlive()


  //todo call 这个会被调用
  onActivated(()=>{
    console.log('Single-activeated-1') 
  })
 
  //todo call 也会被调用
  onActivated(()=>{
    console.log('Single-activeated-2')
  })
  // 缓存离开,
  onDeactivated(()=>{
    console.log('Single-deactivated')
  })
  return (
    <div>
      <h2>Single</h2>
      <input type="text" style={{ border: '2px solid red' }} />
    </div>
  )
}
```

3 动态生成 路由
```tsx
/**  App.tsx */
import { createEffect, lazy, type Component } from 'solid-js'
import { Route, Router } from '@solidjs/router'
import { useAlive, aliveTransfer } from "solid-alive"

const modules = import.meta.glob<{ default: Component<any> }>([
  './views/**/**.tsx',
  './views/**.tsx'
])

const transferRouter = (data: MenuData[]) =>
  data.flatMap(item => {
    let module = modules[`./views${item.realPath}`]
    if (!module) return []
    const Transfer = aliveTransfer(
      lazy(module),
      item.path,
      item.children?.map(item => item.path)
    )
    return (
      <Route component={Transfer} path={item.path.split('/').at(-1)}>
        {item.children ? transferRouter(item.children) : null}
      </Route>
    )
  })

const App: Component = () => {
  const { aliveFrozen } = useAlive()

  const [data, setData] = createStore<MenuData[]>([])
  return (
    <Router>
      <Route component={Client}>
        {/* treeData 将 data变成 树结构数据 */}
        {transferRouter(treeData(data))}
      </Route>
    </Router>
  )
}

export default App
```