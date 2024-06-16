import type {GlobalStore} from '@empjs/cli'
const libraryName = '@empjs/plugin-emp-runtime'
type EmpRuntimePluginType = {
  runtimeHost?: string
  externals?: any
  globalVal?: string
  libraryName?: string
}
const defaultOptons: EmpRuntimePluginType = {
  libraryName: '@empjs/plugin-emp-runtime',
  globalVal: 'EmpShareLib',
}
export const external_mf = (op = defaultOptons) => ({
  '@module-federation/runtime': `${op.globalVal}.MFRuntime`,
  '@module-federation/sdk': `${op.globalVal}.MFSDK`,
  [`${op.libraryName}/runtime`]: op.globalVal,
})
export const external_react = (op = defaultOptons) => ({
  react: `${op.globalVal}.React`,
  'react-dom': `${op.globalVal}.ReactDOM`,
  'react-router-dom': `${op.globalVal}.ReactRouterDOM`,
})
export default (o: EmpRuntimePluginType) => {
  const op: EmpRuntimePluginType = {
    ...{
      runtimeHost: '',
      externals: undefined,
      ...defaultOptons,
    },
    ...o,
  }
  return {
    name: libraryName,
    async rsConfig(store: GlobalStore) {
      const {chain} = store
      const externals = op.externals
        ? op.externals
        : {
            ...external_react(op),
            ...external_mf(op),
          }
      chain.merge({externals})
      //
      function injectEmp(chunkName: string) {
        store.chain.plugin(`html-plugin-empShare-${chunkName}`).tap(o => {
          o[0].js.unshift(`${op.runtimeHost}/runtime${store.mode === 'development' ? '.development' : ''}.umd.js`)
          return o
        })
      }
      for (const [chunkName] of Object.entries(store.entries)) {
        injectEmp(chunkName)
      }
    },
  }
}
