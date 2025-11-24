import { setPrimaryUrl } from '../actions/setPrimaryUrl'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { getHttpInterfaceUrls } from '../utils'

export const taskSetPrimaryUrl = sdk.setupOnInit(async (effects) => {
  const httpUrls = await getHttpInterfaceUrls(effects)

  const rootUrl = await storeJson
    .read((s) => s.GITEA__server__ROOT_URL)
    .const(effects)

  console.log('** ROOT URL **', rootUrl)
  console.log('** URLS **', httpUrls)

  if (!rootUrl || !httpUrls.includes(rootUrl)) {
    await sdk.action.createOwnTask(effects, setPrimaryUrl, 'critical', {
      reason:
        'Gitea requires a primary URL for the purpose of creating links, sending invites, etc.',
    })
  }
})
