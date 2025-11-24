import { sdk } from '../sdk'
import { getPassword, mount } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  username: Value.dynamicSelect(async ({ effects }) => {
    const result = await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'gitea' },
      mount,
      'list-admin-users',
      async (subc) => {
        const execResult = await subc.execFail(
          [
            'su',
            '-s',
            '/bin/sh',
            'git',
            '-c',
            `gitea admin user list --admin --work-path /data`,
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

    const lines = (result.stdout as string).trim().split('\n')

    // Remove header
    const dataLines = lines.slice(1)

    const admins = dataLines.map((line) => line.trim().split(/\s+/)[1]) // split on whitespace

    return {
      name: 'Admin User',
      default: '',
      values: admins.reduce(
        (obj, name) => ({
          ...obj,
          [name]: name,
        }),
        {},
      ),
    }
  }),
})

export const resetAdmin = sdk.Action.withInput(
  // id
  'reset-admin',

  // metadata
  async ({ effects }) => {
    return {
      name: 'Reset Admin Password',
      description: 'Generate a new password for an admin user',
      warning: null,
      allowedStatuses: 'only-running',
      group: null,
      visibility: 'enabled',
    }
  },

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {},

  // the execution function
  async ({ effects, input }) => {
    const password = getPassword()

    const passwordResult = await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'gitea' },
      mount,
      'reset-admin-password',
      async (subc) => {
        const execResult = await subc.exec(
          [
            'su',
            '-s',
            '/bin/sh',
            'git',
            '-c',
            `gitea admin user change-password --username ${input.username} --password ${password} --must-change-password=false --work-path /data`,
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

    if (passwordResult.exitCode !== 0) {
      const errorMsg =
        passwordResult.stderr?.toString() ||
        passwordResult.stdout?.toString() ||
        'Unknown error'
      throw new Error(`Failed to reset admin password: ${errorMsg}`)
    }

    // Show the generated password
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
