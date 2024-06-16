import type {FederationRuntimePlugin} from '@module-federation/runtime'
import {init} from '@module-federation/runtime'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
//
type initOptions = Parameters<typeof init>[0]
//
const errorLoadPlugin: () => FederationRuntimePlugin = function () {
  return {
    name: 'fallback-plugin',
    errorLoadRemote(...args) {
      console.error('[errorLoadRemote]', ...args)
      const fallback = 'error loading modules'
      return fallback
    },
  }
}
const loadWithShare = (options: initOptions) => {
  const o: initOptions = {
    ...{
      name: 'emp-share-runtime',
      shared: {
        react: {
          lib: () => React,
          version: '18.2.0',
          scope: 'default',
          shareConfig: {
            singleton: true,
            requiredVersion: '^18.2.0',
          },
        },
        'react-dom': {
          lib: () => ReactDOM,
          version: '18.2.0',
          scope: 'default',
          shareConfig: {
            singleton: true,
            requiredVersion: '^18.2.0',
          },
        },
      },
      remotes: [],
      plugins: [errorLoadPlugin()],
    },
    ...options,
  }
  init(o)
}

export default loadWithShare
