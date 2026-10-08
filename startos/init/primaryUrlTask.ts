import { i18n } from '../i18n'
import { primaryUrl } from '../primaryUrl'

export const primaryUrlTask = primaryUrl.setupTask('important', {
  reason: i18n('Choose the address Gitea builds its links and clone URLs from'),
})
