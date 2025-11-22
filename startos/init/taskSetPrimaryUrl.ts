import { setPrimaryUrl } from '../actions/setPrimaryUrl'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { httpInterfaceId } from '../utils'

export const taskSetPrimaryUrl = sdk.setupOnInit(async (effects) => {
  const httpUrls =
    (await sdk.serviceInterface.getOwn(effects, httpInterfaceId).const())
      ?.addressInfo?.publicUrls || []

  const rootUrl = await storeJson
    .read((s) => s.GITEA__server__ROOT_URL)
    .const(effects)

  if (!rootUrl || !httpUrls.includes(rootUrl)) {
    await sdk.action.createOwnTask(effects, setPrimaryUrl, 'critical', {
      reason:
        'Gitea requires a primary URL for the purpose of creating links, sending invites, etc.',
    })
  }
})
