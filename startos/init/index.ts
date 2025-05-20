import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versions } from '../install/versionGraph'
import { actions } from '../actions'
import { setPrimaryUrl } from '../actions/set-primary-url'
import { store } from '../file-models/store.json'
import { utils } from '@start9labs/start-sdk'
import { restoreInit } from '../backups'
import { setPrimaryUrlTask } from './setPrimaryUrlTask'

export const init = sdk.setupInit(
  restoreInit,
  versions,
  setInterfaces,
  setDependencies,
  actions,
  setPrimaryUrlTask,
)

export const uninit = sdk.setupUninit(versions)
