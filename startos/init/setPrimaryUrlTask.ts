import { T } from '@start9labs/start-sdk'
import { setPrimaryUrl } from '../actions/set-primary-url'
import { store } from '../file-models/store.json'
import { sdk } from '../sdk'

export const setPrimaryUrlTask = sdk.setupOnInit(async (effects) => {
  if (!(await store.read((s) => s.GITEA__server__ROOT_URL).const(effects)))
    sdk.action.requestOwn(effects, setPrimaryUrl, 'critical')
})
