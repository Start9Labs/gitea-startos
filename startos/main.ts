import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { uiPort } from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Gitea!')

  const { GITEA__server__ROOT_URL, GITEA__security__SECRET_KEY, smtp } =
    (await storeJson.read().const(effects))!

  let smtpCredentials: T.SmtpValue | null = null

  if (smtp.selection === 'system') {
    smtpCredentials = await sdk.getSystemSmtp(effects).const()
    if (smtpCredentials && smtp.value.customFrom)
      smtpCredentials.from = smtp.value.customFrom
  } else if (smtp.selection === 'custom') {
    smtpCredentials = smtp.value
  }

  let mailer: GiteaMailer = {
    GITEA__mailer__ENABLED: 'false',
  }
  if (smtpCredentials) {
    mailer = {
      GITEA__mailer__ENABLED: 'true',
      GITEA__mailer__SMTP_ADDR: smtpCredentials.server,
      GITEA__mailer__SMTP_PORT: String(smtpCredentials.port),
      GITEA__mailer__FROM: smtpCredentials.from,
      GITEA__mailer__USER: smtpCredentials.login,
    }
    if (smtpCredentials.password)
      mailer.GITEA__mailer__PASSWD = smtpCredentials.password
  }

  const env: GiteaEnv = {
    GITEA__lfs__PATH: '/data/git/lfs',
    GITEA__server__ROOT_URL,
    GITEA__security__INSTALL_LOCK: 'true',
    GITEA__security__SECRET_KEY,
    ...(mailer || {}),
  }

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'gitea' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      }),
      'gitea-sub',
    ),
    exec: {
      command: ['/usr/bin/entrypoint', '--', '/usr/bin/s6-svscan', '/etc/s6'],
      env,
    },
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: 'Server is ready',
          errorMessage:
            'Server is experiencing an issue. Please check the logs.',
        }),
    },
    requires: [],
  })
})

type GiteaEnv = Partial<NonNullable<GiteaMailer>> & {
  GITEA__lfs__PATH: '/data/git/lfs'
  GITEA__server__ROOT_URL: string
  GITEA__security__INSTALL_LOCK: 'true'
  GITEA__security__SECRET_KEY: string
}

type GiteaMailer =
  | {
      GITEA__mailer__ENABLED: 'false'
    }
  | {
      GITEA__mailer__ENABLED: 'true'
      GITEA__mailer__SMTP_ADDR: string
      GITEA__mailer__SMTP_PORT: string
      GITEA__mailer__FROM: string
      GITEA__mailer__USER: string
      GITEA__mailer__PASSWD?: string
    }
