import { sdk } from './sdk'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { setPrimaryUrl } from './actions/set-primary-url'
import { store } from './file-models/store.json'
import { utils } from '@start9labs/start-sdk'

// **** Pre Install ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {
  store.write(effects, {
    GITEA__security__SECRET_KEY: utils.getDefaultString({
      charset: 'A-Z,a-z,0-9,+,/',
      len: 32,
    }),
    GITEA__server__ROOT_URL: '',
    GITEA__service__DISABLE_REGISTRATION: true,
    smtp: {
      selection: 'disabled',
      value: {},
    },
  })
})

// **** Post Install ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {
  await sdk.action.requestOwn(effects, setPrimaryUrl, 'critical')
})

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  preInstall,
  postInstall,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
)
