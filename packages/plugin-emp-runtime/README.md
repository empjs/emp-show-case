# @empjs/plugin-emp-runtime

## 配置 
### emp-config.js
```js
import {defineConfig} from '@empjs/cli'
import pluginEmpRuntime from '@empjs/plugin-emp-runtime'

export default defineConfig(store => {
  return {
    plugins: [
        // runtimeHost 为当前 库地址
        pluginEmpRuntime({runtimeHost: `http://localhost:3011`}),
        ],
  }
})

```
### 项目调用
+ [参考项目 federation-runtime](projects/federation-runtime) 
```js
import React, {useEffect, useState, version} from 'react'
import ReactDOM from 'react-dom'
// 引用runtime
import {empRuntime, withReactAdapter} from '@empjs/plugin-emp-runtime/runtime'
// 实例化远程 emp
empRuntime.init({
  remotes: [
    {
      name: 'mfHost',
      entry: `http://${process.env.lanIp}:8001/emp.js`,
    },
  ],
  name: 'federationRuntimeDemo',
})
// 封装 React 18的组件 以便插入到 React 16
const RemoteApp = withReactAdapter<any>(empRuntime.load('mfHost/App'))
// 创建 React 16 组件
const ParentComponent = () => {
  const [count, setCount] = useState(0)
  return (
    <div style={{border: '1px solid #eee', padding: '10px', background: '#f7f7f7'}}>
      <h1>React Version {React.version}!</h1>
      <button onClick={() => setCount(count + 1)}>Click Count {count}</button>
    </div>
  )
}
// 封装 React 16的组件 以便插入到 React 18
const ParentComponentAdepter = withReactAdapter(ParentComponent, React, ReactDOM)
const App = () => {
  return (
    <>
      <h1>app React Version {version}</h1>
      <RemoteApp component={ParentComponentAdepter} />
    </>
  )
}
export default App
```