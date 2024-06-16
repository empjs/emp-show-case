import {init, loadRemote} from '@module-federation/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
//
type initOptionsType = Parameters<typeof init>[0]
//
class EmpRuntime {
  private isInit = false
  public load = loadRemote
  private scope = 'default'
  private initOptions!: initOptionsType
  init(options: initOptionsType, framework = 'react', scope = 'default') {
    if (this.isInit) return
    if (framework === 'react') this.prepareReactShareConfig()
    this.scope = scope
    //
    const op = {...this.initOptions, ...options}
    init(op)
    //
    this.isInit = true
  }

  prepareReactShareConfig() {
    const {scope} = this
    this.initOptions = {
      name: 'emp-runtime',
      shared: {
        react: {
          lib: () => React,
          version: React.version,
          scope,
          shareConfig: {
            singleton: true,
            requiredVersion: `^${React.version}`,
          },
        },
        'react-dom': {
          lib: () => ReactDOM,
          version: ReactDOM.version,
          scope,
          shareConfig: {
            singleton: true,
            requiredVersion: `^${React.version}`,
          },
        },
      },
      remotes: [],
    }
  }
}
export default new EmpRuntime()
