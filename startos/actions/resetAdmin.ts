import { sdk } from '../sdk'
import { utils } from '@start9labs/start-sdk'
import { mount } from '../utils'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const randomPassword = {
  charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
  len: 22,
}

export const inputSpec = InputSpec.of({
  username: Value.text({
    name: 'Username',
    description: 'The username for the administrator account',
    required: true,
    default: null,
  }),
  password: Value.text({
    name: 'Password',
    description: 'The password for the administrator account',
    required: true,
    default: null,
    masked: true,
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
  'reset-admin',

  // metadata
  async ({ effects }) => {
    const adminUserCreated = await storeJson
      .read((s) => s.adminUserCreated)
      .const(effects)

    return {
      name: adminUserCreated ? 'Reset Admin Password' : 'Create Admin User',
      description: adminUserCreated
        ? 'Generate a new password for your admin user'
        : 'Create your admin user and password',
      warning: null,
      allowedStatuses: adminUserCreated ? 'only-running' : 'only-running',
      group: null,
      visibility: 'enabled',
    }
  },

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const adminUserCreated = await storeJson
      .read((s) => s.adminUserCreated)
      .once()
    
    if (adminUserCreated) {
      const storedUsername = await storeJson
        .read((s) => s.adminUsername)
        .once()
      const storedEmail = await storeJson
        .read((s) => s.adminEmail)
        .once()
      
      return {
        username: storedUsername || undefined,
        email: storedEmail || undefined,
        password: undefined, // Will be generated, but field is required
      }
    }
    
    return {}
  },

  // the execution function
  async ({ effects, input }) => {
    const adminUserCreated = await storeJson
      .read((s) => s.adminUserCreated)
      .once()
    const storedAdminUsername = await storeJson
      .read((s) => s.adminUsername)
      .once()

    if (adminUserCreated) {
      // Reset password - generate new password automatically
      const username = storedAdminUsername || input.username
      const password = utils.getDefaultString(randomPassword)

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
              `gitea admin user change-password --username ${String(username)} --password ${String(password)} --must-change-password=false --work-path /data`,
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
          passwordResult.stderr?.toString() || passwordResult.stdout?.toString() || 'Unknown error'
        throw new Error(
          `Failed to reset admin password: ${errorMsg}`,
        )
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
              value: username,
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
    } else {
      // Creating new admin user - use provided input
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
              `gitea admin user create --admin --username ${String(input.username)} --password ${String(input.password)} --email ${String(input.email)} --must-change-password=false --work-path /data`,
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
          result.stderr?.toString() || result.stdout?.toString() || 'Unknown error'
        throw new Error(
          `Failed to create admin user: ${errorMsg}`,
        )
      }

      // Store admin user info for future edits
      await storeJson.merge(effects, {
        adminUserCreated: true,
        adminUsername: input.username,
        adminEmail: input.email,
      })

      // User just entered credentials, no need to show them again
    }
  },
)

