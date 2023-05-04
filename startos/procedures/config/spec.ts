import { Config } from '@start9labs/start-sdk/lib/config/builder/config'
import { Value } from '@start9labs/start-sdk/lib/config/builder/value'
import { smtpConfig } from '@start9labs/start-sdk/lib/config/constants'

export const configSpec = Config.of({
  primary_domain: Value.select({
    name: 'Primary Domain',
    required: { default: 'tor' },
    description:
      'Your primary domain is used for creating links inside the Gitea UI',
    values: {
      tor: '.onion',
      local: '.local',
      ip: 'IP Address',
    },
  }),
  GITEA__service__DISABLE_REGISTRATION: Value.toggle({
    name: 'Disable Registration',
    default: false,
    description:
      'Prevent new users from signing themselves up. Once registrations are disabled, only an admin can sign up new users. It is recommended that you activate this option after creating your first user, since anyone with your Gitea URL can sign up and create an account, which represents a security risk.',
  }),
  smtp: smtpConfig,
})

export type ConfigSpec = typeof configSpec.validator._TYPE
