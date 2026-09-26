import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  GITEA__repository__DEFAULT_BRANCH: Value.text({
    name: i18n('Default Branch'),
    description: i18n(
      'Branch name given to newly created repositories. Existing repositories are unaffected.',
    ),
    required: true,
    default: 'main',
    patterns: [
      {
        regex:
          '^(?!.*(?:\\.\\.|//|/\\.|\\.lock(?:/|$)))[A-Za-z0-9](?:[A-Za-z0-9._/-]*[A-Za-z0-9_-])?$',
        description: i18n('Must be a valid branch name'),
      },
    ],
  }),
  GITEA__repository__DEFAULT_PRIVATE: Value.select({
    name: i18n('Default Repository Visibility'),
    description: i18n('Visibility preselected when creating a repository.'),
    default: 'last',
    values: {
      last: i18n('Last used'),
      private: i18n('Private'),
      public: i18n('Public'),
    },
  }),
  GITEA__repository__ENABLE_PUSH_CREATE_USER: Value.toggle({
    name: i18n('Push to Create (Users)'),
    description: i18n(
      'Allow users to create a repository by pushing to one that does not exist yet.',
    ),
    default: false,
  }),
  GITEA__repository__ENABLE_PUSH_CREATE_ORG: Value.toggle({
    name: i18n('Push to Create (Organizations)'),
    description: i18n(
      'Allow organization members to create a repository by pushing to one that does not exist yet.',
    ),
    default: false,
  }),
  GITEA__service__REQUIRE_SIGNIN_VIEW: Value.toggle({
    name: i18n('Require Sign-in to View'),
    description: i18n(
      'Hide every page, including public repositories, from visitors who are not signed in.',
    ),
    default: false,
  }),
  GITEA__service__DEFAULT_KEEP_EMAIL_PRIVATE: Value.toggle({
    name: i18n('Keep Email Private by Default'),
    description: i18n(
      'New accounts hide their email address from other users.',
    ),
    default: false,
  }),
  GITEA__service__DEFAULT_ALLOW_CREATE_ORGANIZATION: Value.toggle({
    name: i18n('Allow Creating Organizations by Default'),
    description: i18n('New accounts may create organizations.'),
    default: true,
  }),
  GITEA__service__DEFAULT_USER_VISIBILITY: Value.select({
    name: i18n('Default User Visibility'),
    description: i18n('Visibility given to newly created accounts.'),
    default: 'public',
    values: {
      public: i18n('Public'),
      limited: i18n('Limited (signed-in users only)'),
      private: i18n('Private'),
    },
  }),
  GITEA__server__LANDING_PAGE: Value.select({
    name: i18n('Landing Page'),
    description: i18n('Page shown to visitors at the root URL.'),
    default: 'home',
    values: {
      home: i18n('Home'),
      explore: i18n('Explore'),
      organizations: i18n('Organizations'),
      login: i18n('Sign In'),
    },
  }),
  GITEA__actions__ENABLED: Value.toggle({
    name: i18n('Enable Actions'),
    description: i18n(
      'Run CI/CD workflows with Gitea Actions. Gitea Runner requires this to be on.',
    ),
    default: true,
  }),
})

export const configure = sdk.Action.withInput(
  // id
  'configure',

  // metadata
  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n(
      'Set Gitea options that are only available in its configuration file',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => storeJson.read((s) => s.config).once(),

  // the execution function
  async ({ effects, input }) => storeJson.merge(effects, { config: input }),
)
