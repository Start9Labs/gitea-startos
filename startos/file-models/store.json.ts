import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, string, boolean, any } = matches

const shape = object({
  GITEA__server__ROOT_URL: string,
  GITEA__security__SECRET_KEY: string,
  GITEA__service__DISABLE_REGISTRATION: boolean,
  smtp: object({
    selection: any,
    value: any,
  }),
})

export const store = FileHelper.json(
  { volumeId: 'main', subpath: '/store.json' },
  shape,
)
