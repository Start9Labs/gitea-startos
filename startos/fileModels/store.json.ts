import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z
  .object({
    GITEA__server__ROOT_URL: z.string().catch(''),
    GITEA__security__SECRET_KEY: z.string(),
    GITEA__service__DISABLE_REGISTRATION: z.boolean().catch(true),
    smtp: z
      .object({
        selection: z.enum(['disabled', 'system', 'custom']),
        value: z.record(z.string(), z.any()),
      })
      .catch({ selection: 'disabled' as const, value: {} }),
  })
  .strip()

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
