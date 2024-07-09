## solid-alive

### 安装(install)
 - pnpm add solid-alive ／ npm i solid-alive / yarn add solid-alive
### 描述(describe)
- 用于 solid 组件缓存,只测试过2级路由缓存
- 在 useAlive 
  - removeAliveElement: 函数, 可传一个参数, 不传就删除所有缓存 :
    removeAliveElement('/home')
  -  onActivated / onDeactivated: 函数,只能传一个函数  
  -  onActivated(()=> console.log('actived'))
  - <table><tr><td bgcolor=#ff0>现在多个onActivated/onDeactivated 会被保存,在一个组件 内不要有多个onActivated/onDeactivated函数</td></tr></table>
- 子父 缓存/删除 问题
  -  如果某组件下有子组件,在父的 AliveTransfer中, 
    第三个参数,为对象 写上子组件的唯一id: {children:['/childrenId','asf',...]}
  -  使用见下图, 也可用     -removeAliveElement 删除



###  使用(use)
 ```jsx
import { render } from 'solid-js/web'
import App from './App'
import { AliveProvider } from  'solid-alive'

const root = document.getElementById('root')

render(() => 
  <AliveProvider>
    <App />
  </AliveProvider>
, root!)
 ```

2 /App.tsx ,在 solid-alive 中 有 AliveTransfer, 参数: JSX , id:string, children?:[string..]
 ```jsx
 import { Route, Router } from '@solidjs/router';
import { AliveTransfer } from 'solid-alive';

import Home from './views/Home';
import Client from './views/Client';
import About from './views/About';
import Team from './views/Blog/Team';
import Blog from './views/Blog';
import Single from './views/Blog/Single';

const AboutTsf = () => AliveTransfer(About, '/about');

// 当Blog 下有子组件时, 第三个参数一定要, 与子组件的
const BlogTsf = (props: any) =>
  AliveTransfer(Blog.bind(null, props), '/blog', ['single', '/team']);
// blog 下的子组件
const SingleTsf = () => AliveTransfer(Single, 'single');
const TeamTsf = () => AliveTransfer(Team, '/team');

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
          <Route component={TeamTsf} path={'team'} />
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
import { useAlive , onActivated, onDeactivated} from "solid-alive"

export default function Single() {
  const { removeAliveElement } = useAlive()

  let divRef: Element | undefined = undefined
  const click = () => {
    removeAliveElement('/about') // delete '/about'; 删除 /about
    // removeAliveElement() // delete all alive element; 会删除所有缓存的组件
  }

  //todo call 这个会被调用
  onActivated(()=>{
    console.log('Single-activeated-1')
  })
 
  //todo call 这个依然会被调用
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
      <div
        style={{ height: '500px', width: '200px',border:'1px solid green',overflow:'auto'}}
      >
        <div style="height:900px;border:1px solid red">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam earum
          aspernatur omnis, fugiat doloremque repellat facilis fugit nisi magni
          provident hic aliquid nostrum reiciendis, dolores rem, quasi dolor
          officia? Quidem? Sit alias tempore ab provident ea aliquid nostrum
          quaerat? Natus aut dignissimos, illo nisi officiis adipisci ipsam
          totam quasi ratione laboriosam eius recusandae asperiores nobis quis
          assumenda odio consectetur animi. Debitis architecto mollitia sapiente
        </div>
      </div>
    </div>
  )
}
```