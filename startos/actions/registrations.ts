import { store } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const registrations = sdk.Action.withoutInput(
  // id
  'registrations',

  // metadata
  async ({ effects }) => {
    const disabled = await store
      .read((s) => s.GITEA__service__DISABLE_REGISTRATION)
      .const(effects)

    return {
      name: disabled ? 'Enable Registrations' : 'Disable Registrations',
      description: disabled
        ? 'Allow new accounts to be created on your server'
        : 'Prohibit new accounts from being created on your server',
      warning: disabled
        ? 'Anyone with your Gitea URL will be able to create an account on your server, which represents a security risk. Be careful!'
        : null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const disabled = await store
      .read((s) => s.GITEA__service__DISABLE_REGISTRATION)
      .const(effects)

    await store.merge(effects, {
      GITEA__service__DISABLE_REGISTRATION: !disabled,
    })
  },
)
