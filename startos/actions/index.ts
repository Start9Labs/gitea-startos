import { sdk } from '../sdk'
import { setPrimaryUrl } from './setPrimaryUrl'
import { registrations } from './registrations'
import { manageSmtp } from './manageSmtp'
import { resetAdmin } from './resetAdmin'
import { createAdmin } from './createAdmin'

export const actions = sdk.Actions.of()
  .addAction(setPrimaryUrl)
  .addAction(registrations)
  .addAction(manageSmtp)
  .addAction(resetAdmin)
  .addAction(createAdmin)
