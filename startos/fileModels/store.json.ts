import { FileHelper, smtpShape, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Gitea multiplies retention days by a nanosecond duration.
export const maxRunRetentionDays = 100000

// Keys are Gitea env vars; every one is always passed, since Gitea persists them into app.ini.
const configShape = z.object({
  GITEA__repository__DEFAULT_BRANCH: z.string().catch('main'),
  GITEA__repository__DEFAULT_PRIVATE: z
    .enum(['last', 'private', 'public'])
    .catch('last'),
  GITEA__repository__ENABLE_PUSH_CREATE_USER: z.boolean().catch(false),
  GITEA__repository__ENABLE_PUSH_CREATE_ORG: z.boolean().catch(false),
  GITEA__service__REQUIRE_SIGNIN_VIEW: z.boolean().catch(false),
  GITEA__service__DEFAULT_KEEP_EMAIL_PRIVATE: z.boolean().catch(false),
  GITEA__service__DEFAULT_ALLOW_CREATE_ORGANIZATION: z.boolean().catch(true),
  GITEA__service__DEFAULT_USER_VISIBILITY: z
    .enum(['public', 'limited', 'private'])
    .catch('public'),
  GITEA__server__LANDING_PAGE: z
    .enum(['home', 'explore', 'organizations', 'login'])
    .catch('home'),
  GITEA__actions__ENABLED: z.boolean().catch(true),
  GITEA__actions__RUN_RETENTION_DAYS: z
    .number()
    .int()
    .min(0)
    .max(maxRunRetentionDays)
    .catch(400),
  GITEA__migrations__ALLOWED_HOST_LIST: z.string().nullable().catch(null),
})

export const configDefaults = configShape.parse({})

export const signingShape = z.object({
  enabled: z.boolean().catch(false),
  name: z.string().catch('Gitea'),
  email: z.string().catch(''),
  merges: z
    .enum(['always', 'approved', 'basesigned', 'commitssigned'])
    .catch('approved'),
  crudActions: z.boolean().catch(false),
})

const shape = z.looseObject({
  GITEA__server__ROOT_URL: z.string().catch(''),
  GITEA__security__SECRET_KEY: z.string(),
  GITEA__service__DISABLE_REGISTRATION: z.boolean().catch(true),
  smtp: smtpShape,
  config: configShape.catch(() => configShape.parse({})),
  signing: signingShape.catch(() => signingShape.parse({})),
  signingKey: z
    .object({ fingerprint: z.string(), publicKey: z.string() })
    .nullable()
    .catch(null),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
