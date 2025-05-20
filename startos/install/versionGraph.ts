import { utils, VersionGraph } from '@start9labs/start-sdk'
import { store } from '../file-models/store.json'
import { current, other } from './versions'

export const versions = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await store.write(effects, {
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
  },
})
