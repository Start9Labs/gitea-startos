import { sdk } from '../sdk'
import { setPrimaryUrl } from './setPrimaryUrl'
import { registrations } from './registrations'
import { manageSmtp } from './manageSmtp'

export const actions = sdk.Actions.of()
  .addAction(setPrimaryUrl)
  .addAction(registrations)
  .addAction(manageSmtp)
