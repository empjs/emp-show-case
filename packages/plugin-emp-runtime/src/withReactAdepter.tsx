import React, * as LocalReact from 'react'
import * as LocalReactDOM from 'react-dom'
import {createRoot, hydrateRoot} from 'react-dom/client'

const checkVersion = (version: string) => (version ? Number(version.split('.')[0]) : 0)
const isPromise = (p: any) => p && Object.prototype.toString.call(p) === '[object Promise]'

function withReactAdepter<P>(
  component: any,
  scope = 'default',
  React: any = LocalReact,
  ReactDOM: any = LocalReactDOM,
) {
  // console.log(component, React, ReactDOM, scope)
  //
  const reactVersion = checkVersion(React.version)
  class WrappedComponent extends React.Component {
    containerRef: React.RefObject<HTMLDivElement>
    root: any
    constructor(props: P) {
      super(props)
      this.containerRef = React.createRef()
    }

    componentDidMount() {
      this.mountOriginalComponent(true)
    }

    componentDidUpdate() {
      this.mountOriginalComponent()
    }

    componentWillUnmount() {
      this.unMountOriginalComponent()
    }
    unMountOriginalComponent() {
      if (!this.containerRef.current) return
      if (reactVersion < 18) {
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.unmountComponentAtNode(this.containerRef.current)
      } else {
        this.root.unmount()
      }
    }

    async mountOriginalComponent(shouldRender?: boolean) {
      if (isPromise(component))
        component = await component.then((m: any) => {
          // console.log(m, m[scope], scope)
          return m[scope]
        })
      const element = React.createElement(component, this.props)
      if (reactVersion < 18) {
        // eslint-disable-next-line react/no-deprecated
        const Render = shouldRender ? ReactDOM.render : ReactDOM.hydrate
        Render(element, this.containerRef.current)
      } else {
        if (shouldRender) {
          this.root = createRoot(this.containerRef.current!)
          this.root.render(element)
        } else {
          this.root = hydrateRoot(this.containerRef.current!, element)
        }
      }
    }

    render() {
      return <div ref={this.containerRef} />
    }
  }
  return WrappedComponent as unknown as (props: P) => any
}
export default withReactAdepter
