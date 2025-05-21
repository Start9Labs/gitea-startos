import { setPrimaryUrl } from '../actions/setPrimaryUrl'
import { store } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const setPrimaryUrlTask = sdk.setupOnInit(async (effects) => {
  if (!(await store.read((s) => s.GITEA__server__ROOT_URL).const(effects))) {
    await sdk.action.requestOwn(effects, setPrimaryUrl, 'critical')
  }
})
