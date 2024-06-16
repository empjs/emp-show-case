import {defineConfig} from 'tsup'
const env = process.env.NODE_ENV
const type = process.env.TYPE
const watch = process.env.WATCH === 'true'

class RunCli {
  plugin() {
    return defineConfig({
      entry: ['src/plugin.ts'],
      splitting: false,
      sourcemap: true,
      clean: false,
      dts: true,
      env: {NODE_ENV: env},
      minify: env !== 'development',
      format: ['esm'],
      watch: watch,
      async onSuccess() {
        console.log('onSuccess!')
      },
    })
  }
  lib() {
    return [this.lib_es5(), this.lib_esm()]
  }
  lib_es5() {
    return defineConfig({
      target: 'es5',
      entry: ['src/runtime.ts'],
      // splitting: false,
      sourcemap: true,
      clean: false,
      dts: true,
      env: {NODE_ENV: env},
      minify: env !== 'development',
      esbuildOptions(options, context) {
        options.legalComments = 'none'
      },
      globalName: 'EmpShareLib',
      format: ['cjs', 'iife'],
      watch: watch,
      outExtension: ({format}) => {
        return {
          js: this.getFormatName(format),
        }
      },
      async onSuccess() {
        console.log('onSuccess!')
      },
    })
  }
  lib_esm() {
    return defineConfig({
      entry: ['src/runtime.ts'],
      // splitting: false,
      sourcemap: true,
      clean: false,
      dts: false,
      env: {NODE_ENV: env},
      // skipNodeModulesBundle: true,
      minify: env !== 'development',
      esbuildOptions(options, context) {
        options.legalComments = 'none'
      },
      format: ['esm'],
      watch: watch,
      outExtension: ({format}) => {
        return {
          js: this.getFormatName(format),
        }
      },
      async onSuccess() {
        console.log('onSuccess!')
      },
    })
  }
  toConfig() {
    return this[type]()
  }
  getFormatName(format) {
    let cb = '.js'
    switch (format) {
      case 'esm':
        cb = '.mjs'
        break
      case 'cjs':
        cb = '.cjs'
        break
      case 'iife':
        cb = '.umd.js'
        break
    }
    return env === 'development' ? `.${env}${cb}` : cb
  }
}
const runCli = new RunCli()
export default runCli.toConfig()
