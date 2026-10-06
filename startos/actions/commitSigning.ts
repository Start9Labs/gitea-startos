import { utils } from '@start9labs/start-sdk'
import { signingShape, storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { primaryUrl } from '../primaryUrl'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const signingDefaults = signingShape.parse({})

export const inputSpec = InputSpec.of({
  enabled: Value.toggle({
    name: i18n('Enable'),
    description: i18n(
      'Sign commits Gitea creates itself, so branches that require signed commits accept pull request merges.',
    ),
    default: signingDefaults.enabled,
  }),
  name: Value.text({
    name: i18n('Signer Name'),
    description: i18n('Name Gitea displays for its signing key.'),
    required: true,
    default: signingDefaults.name,
  }),
  email: Value.text({
    name: i18n('Signer Email'),
    description: i18n('Email Gitea displays for its signing key.'),
    required: true,
    default: null,
    inputmode: 'email',
    patterns: [utils.Patterns.email],
  }),
  merges: Value.select({
    name: i18n('Sign Merges'),
    description: i18n(
      'Which pull request merges Gitea signs.\n- Always: every merge\n- Only approved pull requests: merges of approved pull requests into protected branches\n- Only when the base branch is signed: merges onto a base branch whose latest commit is signed\n- Only when every pull request commit is signed: merges whose commits are all signed',
    ),
    default: signingDefaults.merges,
    values: {
      always: i18n('Always'),
      approved: i18n('Only approved pull requests'),
      basesigned: i18n('Only when the base branch is signed'),
      commitssigned: i18n('Only when every pull request commit is signed'),
    },
  }),
  crudActions: Value.toggle({
    name: i18n('Sign Web Edits'),
    description: i18n(
      'Also sign commits made by editing, uploading, or deleting files in the web interface.',
    ),
    default: signingDefaults.crudActions,
  }),
})

export const commitSigning = sdk.Action.withInput(
  // id
  'commit-signing',

  // metadata
  async ({ effects }) => ({
    name: i18n('Commit Signing'),
    description: i18n(
      'Sign pull request merges and other commits Gitea creates with its own key',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const store = await storeJson.read().once()
    if (!store) return {}
    const rootUrl = await primaryUrl.bestUsable(effects).once()
    const host = rootUrl ? new URL(rootUrl).hostname : ''
    return {
      ...store.signing,
      email: store.signing.email || (host ? `gitea@${host}` : ''),
    }
  },

  // the execution function
  async ({ effects, input }) => {
    await storeJson.merge(effects, { signing: input })
    const key = await storeJson.read((s) => s.signingKey).once()
    if (!key) throw new Error(i18n('Gitea has no signing key yet'))
    return {
      version: '1',
      title: i18n('Commit Signing'),
      message: input.enabled
        ? i18n(
            'Gitea signs with this public key. Add it wherever its signatures need to verify.',
          )
        : i18n(
            'Signing is off. This is the public key Gitea signs with when it is on.',
          ),
      result: {
        type: 'multiline',
        value: key.publicKey,
        copyable: true,
        filename: 'gitea-signing-key.asc',
      },
    }
  },
)
