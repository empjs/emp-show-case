import 'core-js/stable/global-this'
import {loadRemote} from '@module-federation/runtime'
import * as MFRuntime from '@module-federation/runtime'
import * as MFSDK from '@module-federation/sdk'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import empRuntime from './empRuntime'
import withReactAdapter from './withReactAdapter'
//
export {empRuntime, loadRemote, React, ReactDOM, MFRuntime, MFSDK, withReactAdapter}
