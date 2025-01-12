## solid-alive

### 安装(install)

- pnpm add solid-alive ／ npm i solid-alive / yarn add solid-alive

### 描述(describe)

- 用于 solid 组件缓存,只测试过 2 级路由缓存
- AliveProvider
  - include : 数组, 默认不缓存, ['/','/about'], 当数据变少时, 会自动去删除少的数据缓存
  - transitionEnterName 动画, class 名称, 案例下面
- onActivated
- onDeactivated
- useAliveFrozen: hooks 在新增路由时 ,暂时不响应 路由数据变化
  使用: var aliveFrozen = useAliveFrozen()
- nextTick

### 使用(use)

1 /index.tsx,AliveProvider 将 app 包裹

```jsx
import { render } from 'solid-js/web'
import App from './App'
import { AliveProvider } from  'solid-alive'
// import styles from  "css.path"

const root = document.getElementById('root')

render(() =>
  // cache  id = '/'   ;
  // transitionEnterName={styles.appear}
 <AliveProvider include={['/']} transitionEnterName="xxx">
   <App />
 </AliveProvider>
, root!)
```

transitionEnterName 动画 css

```css
.appear {
  animation: _appear 0.3s ease-in;
  -webkit-animation: _appear 0.3s ease-in;
}

@keyframes _appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

2 /App.tsx ,在 solid-alive 中 有 aliveTransfer, 参数: JSX , id:string, children?:[string..]

```jsx
import { Route, Router } from "@solidjs/router"
import { aliveTransfer } from "solid-alive"

import Home from "./views/Home"
import Client from "./views/Client"
import About from "./views/About"
import Team from "./views/Blog/Team"
import Blog from "./views/Blog"
import Single from "./views/Blog/Single"
import Contact from "./views/Contact"

const HomeTransfer = aliveTransfer(Home, "/"),
  AboutTsf = aliveTransfer(About, "/about"),
  BlogTsf = aliveTransfer(Blog, "/blog", ["single", "/contact"]),
  SingleTsf = aliveTransfer(Single, "single"),
  ContactTsf = aliveFransfer(Contact, "/contact")

export default function App() {
  return (
    <Router>
      <Route component={Home} path={"/"} />
      {/* 单个缓存 single */}
      <Route component={AboutTsf} path={"/about"} />
      {/* 父子 缓存 Parent Child Nesting */}
      <Route component={BlogTsf} path={"/blog"}>
        <Route component={SingleTsf} path={"single"} />
        <Route component={ContactTsf} path={"contact"} />
      </Route>
    </Router>
  )
}
```

3 父 /views/Blog/index.tsx

```jsx
import { onActivated, onDeactivated, useAliveFrozen } from "@/alives"
export default function Blog(props: any) {
  // 新增路由时用
  const aliveFrozen = useAliveFrozen()
  const addRouter = () => {
    aliveFrozen()
    // add route....
  }
  //todo call 这个会被调用
  onActivated(() => {
    console.log("Blog-activeated-1")
  })

  //todo call 也会被调用
  onActivated(() => {
    console.log("Blog-activeated-2")
  })
  // 缓存离开,
  onDeactivated(() => {
    console.log("Blog-deactivated")
  })

  // createEffect(()=>{
  //   console.log('blog-createEffect')
  // })

  return (
    <div>
      <h2>Blog</h2>
      {props.children}
    </div>
  )
}
```

2 动态生成 路由

```tsx
/**  App.tsx */
import { createEffect, lazy, type Component } from "solid-js"
import { Route, Router } from "@solidjs/router"
import { aliveTransfer } from "solid-alive"

const modules = import.meta.glob<{ default: Component<any> }>([
  "./views/**/**.tsx",
  "./views/**.tsx",
])

const transferRouter = (data: IMenuData[]) => (
  <For each={data}>
    {(item) => {
      var module = modules[`./views${item.realPath.replace(/\.\./g, "")}`]
      if (!module) return []
      return (
        <Route
          component={aliveTransfer(
            lazy(module),
            item.path,
            item.children?.map((item) => item.path)
          )}
          path={item.path.split("/").at(-1)}
        >
          {item.children ? transferRouter(item.children) : null}
        </Route>
      )
    }}
  </For>
)

const App: Component = () => {
  return (
    <Router>
      {/* treeData 将 data变成 树结构数据 */}
      {transferRouter(treeData(data))}
    </Router>
  )
}

export default App
```
