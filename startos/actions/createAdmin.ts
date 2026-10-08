import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getPassword, mount } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  username: Value.text({
    name: i18n('Username'),
    description: i18n(
      'Used to sign in, and appears in the address of every repository this account owns.',
    ),
    required: true,
    default: null,
  }),
  email: Value.text({
    name: i18n('Email'),
    description: i18n(
      "Where Gitea sends this account's notifications and password resets, once SMTP is configured.",
    ),
    required: true,
    default: null,
    patterns: [utils.Patterns.email],
  }),
})

export const createAdmin = sdk.Action.withInput(
  // id
  'create-admin',

  // metadata
  async ({ effects }) => {
    return {
      name: i18n('Create Admin User'),
      description: i18n('Create your first admin user and password'),
      warning: null,
      allowedStatuses: 'only-running',
      group: null,
      visibility: 'hidden',
    }
  },

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {},

  // the execution function
  async ({ effects, input }) => {
    const password = getPassword()

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'gitea' },
      mount,
      'create-admin-user',
      async (subc) => {
        const execResult = await subc.execFail(
          [
            'gitea',
            'admin',
            'user',
            'create',
            '--admin',
            '--username',
            input.username,
            '--password',
            password,
            '--email',
            input.email,
            '--must-change-password=false',
            '--work-path',
            '/data',
          ],
          {
            user: 'git',
          },
        )
        return execResult
      },
    )

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n('Your admin user has been created'),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: input.username,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
