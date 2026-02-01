import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec } = sdk

export const inputSpec = InputSpec.of({
  smtp: sdk.inputSpecConstants.smtpInputSpec,
})

export const manageSmtp = sdk.Action.withInput(
  // id
  'manage-smtp',

  // metadata
  async ({ effects }) => ({
    name: i18n('Configure SMTP'),
    description: i18n('Add SMTP credentials for sending emails'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => ({
    smtp: (await storeJson.read((s) => s.smtp).const(effects)) || undefined,
  }),

  // the execution function
  async ({ effects, input }) => storeJson.merge(effects, { smtp: input.smtp }),
)
