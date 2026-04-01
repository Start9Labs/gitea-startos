import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { getHttpInterfaceUrls } from '../utils'

export const setPrimaryUrl = sdk.setupOnInit(async (effects) => {
  const httpUrls = await getHttpInterfaceUrls(effects)

  const rootUrl = await storeJson
    .read((s) => s.GITEA__server__ROOT_URL)
    .const(effects)

  if (!rootUrl || !httpUrls.includes(rootUrl)) {
    await storeJson.merge(
      effects,
      {
        GITEA__server__ROOT_URL: httpUrls.find((u) => u.includes('.local')),
      },
      { allowWriteAfterConst: true },
    )
  }
})
