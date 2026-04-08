import { T } from '@start9labs/start-sdk'
import { createAdmin } from './actions/createAdmin'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mount, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info(i18n('Starting Gitea!'))

  const store = await storeJson.read().const(effects)

  if (!store) {
    throw new Error(i18n('Store not found'))
  }

  const {
    GITEA__server__ROOT_URL,
    GITEA__security__SECRET_KEY,
    GITEA__service__DISABLE_REGISTRATION,
    smtp,
  } = store

  let smtpCredentials: T.SmtpValue | null = null

  if (smtp.selection === 'system') {
    smtpCredentials = await sdk.getSystemSmtp(effects).const()
    const customFrom = smtp.value.customFrom as string | undefined
    if (smtpCredentials && customFrom) smtpCredentials.from = customFrom
  } else if (smtp.selection === 'custom') {
    smtpCredentials = smtp.value as unknown as T.SmtpValue
  }

  let mailer: GiteaMailer = {
    GITEA__mailer__ENABLED: 'false',
  }
  if (smtpCredentials) {
    mailer = {
      GITEA__mailer__ENABLED: 'true',
      GITEA__mailer__SMTP_ADDR: smtpCredentials.host,
      GITEA__mailer__SMTP_PORT: String(smtpCredentials.port),
      GITEA__mailer__FROM: smtpCredentials.from,
      GITEA__mailer__USER: smtpCredentials.username,
    }
    if (smtpCredentials.password)
      mailer.GITEA__mailer__PASSWD = smtpCredentials.password
  }

  const sshDomain = new URL(GITEA__server__ROOT_URL).hostname
  const sshPort = await sdk.serviceInterface
    .getOwn(
      effects,
      'ssh',
      (i) =>
        i?.addressInfo?.filter({ kind: 'mdns' }).hostnames?.[0]?.port ?? null,
    )
    .once()

  const env: GiteaEnv = {
    GITEA__lfs__PATH: '/data/git/lfs',
    GITEA__server__ROOT_URL,
    GITEA__server__SSH_DOMAIN: sshDomain,
    ...(sshPort ? { GITEA__server__SSH_PORT: String(sshPort) } : {}),
    GITEA__service__DISABLE_REGISTRATION: String(
      GITEA__service__DISABLE_REGISTRATION,
    ),
    GITEA__security__INSTALL_LOCK: 'true',
    GITEA__security__SECRET_KEY,
    ...(mailer || {}),
  }

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'gitea' },
    mount,
    'gitea-sub',
  )

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects)
    .addDaemon('primary', {
      subcontainer,
      exec: {
        command: sdk.useEntrypoint(),
        env,
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 120000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://gitea.startos:${uiPort}/api/healthz`,
            {
              successMessage: i18n('Gitea is ready'),
              errorMessage: i18n(
                'Gitea is still starting. If this persists, please check the logs.',
              ),
            },
          ),
      },
      requires: [],
    })
    .addOneshot('admin-user', {
      subcontainer,
      exec: {
        fn: async () => {
          const res = await subcontainer.execFail(
            [
              'gitea',
              'admin',
              'user',
              'list',
              '--admin',
              '--work-path',
              '/data',
            ],
            {
              user: 'git',
            },
          )
          const lines = (res.stdout as string).trim().split('\n')
          if (lines.length <= 1) {
            await sdk.action.createOwnTask(effects, createAdmin, 'important', {
              reason: i18n('Create your first admin user and password'),
            })
          }
          return null
        },
      },
      requires: ['primary'],
    })
})

type GiteaEnv = GiteaMailer & {
  GITEA__lfs__PATH: '/data/git/lfs'
  GITEA__server__ROOT_URL: string
  GITEA__server__SSH_DOMAIN: string
  GITEA__server__SSH_PORT?: string
  GITEA__security__INSTALL_LOCK: 'true'
  GITEA__security__SECRET_KEY: string
  GITEA__service__DISABLE_REGISTRATION: string
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
