import { setupExposeStore, utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export type Store = {
  GITEA__server__ROOT_URL: string
  GITEA__security__SECRET_KEY: string
  GITEA__service__DISABLE_REGISTRATION: boolean
  smtp: typeof sdk.inputSpecConstants.smtpInputSpec._TYPE
}

export const initStore: Store = {
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
}

export const exposedStore = setupExposeStore<Store>(() => [])
