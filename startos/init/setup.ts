import { resetAdmin } from '../actions/resetAdmin'
import { sdk } from '../sdk'

export const setup = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await sdk.action.createOwnTask(effects, resetAdmin, 'optional', {
    reason: 'Create an administrator user for your Gitea instance',
  })
})

