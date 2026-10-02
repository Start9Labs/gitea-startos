import { sdk } from '../sdk'
import { setPrimaryUrl } from './setPrimaryUrl'
import { registrations } from './registrations'
import { configureSmtp } from './configureSmtp'
import { resetAdmin } from './resetAdmin'
import { createAdmin } from './createAdmin'
import { configure } from './configure'
import { commitSigning } from './commitSigning'

export const actions = sdk.Actions.of()
  .addAction(setPrimaryUrl)
  .addAction(configure)
  .addAction(registrations)
  .addAction(configureSmtp)
  .addAction(commitSigning)
  .addAction(resetAdmin)
  .addAction(createAdmin)
