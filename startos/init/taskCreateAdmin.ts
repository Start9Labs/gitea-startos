import { resetAdmin } from '../actions/resetAdmin'
import { sdk } from '../sdk'

export const taskCreateAdmin = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await sdk.action.createOwnTask(effects, resetAdmin, 'critical', {
    reason: 'Create an admin user for your Gitea instance',
  })
})
