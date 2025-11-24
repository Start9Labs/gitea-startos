import { sdk } from '../sdk'
import { getPassword, mount } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  username: Value.text({
    name: 'Username',
    description: 'The username for the administrator account',
    required: true,
    default: null,
  }),
  email: Value.text({
    name: 'Email',
    description: 'The email address for the administrator account',
    required: true,
    default: null,
  }),
})

export const resetAdmin = sdk.Action.withInput(
  // id
  'create-admin',

  // metadata
  async ({ effects }) => {
    return {
      name: 'Create Admin User',
      description: 'Create your first admin user and password',
      warning: null,
      allowedStatuses: 'only-stopped',
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

    const result = await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'gitea' },
      mount,
      'create-admin-user',
      async (subc) => {
        const execResult = await subc.exec(
          [
            'su',
            '-s',
            '/bin/sh',
            'git',
            '-c',
            `gitea admin user create --admin --username ${input.username} --password ${password} --email ${input.email} --must-change-password=false --work-path /data`,
          ],
          {
            env: {
              GITEA_WORK_DIR: '/data',
            },
          },
        )
        return execResult
      },
    )

    if (result.exitCode !== 0) {
      const errorMsg =
        result.stderr?.toString() ||
        result.stdout?.toString() ||
        'Unknown error'
      throw new Error(`Failed to create admin user: ${errorMsg}`)
    }

    return {
      version: '1',
      title: 'Success',
      message: 'Your admin user password has been reset',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: input.username,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
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
