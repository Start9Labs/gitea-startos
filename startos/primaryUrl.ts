import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { httpInterfaceId, mainHostId } from './utils'

export const primaryUrl = sdk.setupPrimaryUrl({
  id: 'set-primary-url',
  hostId: mainHostId,
  interfaceId: httpInterfaceId,
  metadata: {
    name: i18n('Set Primary URL'),
    description: i18n(
      'Choose the address Gitea builds its links from: clone URLs, links in emails and notifications, and the host named in SSH clone URLs.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  field: { name: i18n('URL'), description: null },
  get: storeJson.read((s) => s.GITEA__server__ROOT_URL),
  set: (effects, url) =>
    storeJson.merge(effects, { GITEA__server__ROOT_URL: url }),
})
