import {
  configDefaults,
  maxRunRetentionDays,
  storeJson,
} from '../fileModels/store.json'
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
    default: configDefaults.GITEA__repository__DEFAULT_BRANCH,
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
    description: i18n(
      'Preselected when someone creates a repository; they can still change it.\n- Last used: the visibility that person chose for their previous repository\n- Private: visible only to the owner and people given access\n- Public: visible to everyone who can view this server',
    ),
    default: configDefaults.GITEA__repository__DEFAULT_PRIVATE,
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
    default: configDefaults.GITEA__repository__ENABLE_PUSH_CREATE_USER,
  }),
  GITEA__repository__ENABLE_PUSH_CREATE_ORG: Value.toggle({
    name: i18n('Push to Create (Organizations)'),
    description: i18n(
      'Allow organization members to create a repository by pushing to one that does not exist yet.',
    ),
    default: configDefaults.GITEA__repository__ENABLE_PUSH_CREATE_ORG,
  }),
  GITEA__service__REQUIRE_SIGNIN_VIEW: Value.toggle({
    name: i18n('Require Sign-in to View'),
    description: i18n(
      'Hide every page, including public repositories, from visitors who are not signed in.',
    ),
    default: configDefaults.GITEA__service__REQUIRE_SIGNIN_VIEW,
  }),
  GITEA__service__DEFAULT_KEEP_EMAIL_PRIVATE: Value.toggle({
    name: i18n('Keep Email Private by Default'),
    description: i18n(
      'New accounts hide their email address from other users.',
    ),
    default: configDefaults.GITEA__service__DEFAULT_KEEP_EMAIL_PRIVATE,
  }),
  GITEA__service__DEFAULT_ALLOW_CREATE_ORGANIZATION: Value.toggle({
    name: i18n('Allow Creating Organizations by Default'),
    description: i18n('New accounts may create organizations.'),
    default: configDefaults.GITEA__service__DEFAULT_ALLOW_CREATE_ORGANIZATION,
  }),
  GITEA__service__DEFAULT_USER_VISIBILITY: Value.select({
    name: i18n('Default User Visibility'),
    description: i18n(
      'The visibility new accounts start with; each user can change their own later.\n- Public: visible to everyone\n- Limited (signed-in users only): visible only to signed-in users\n- Private: visible only to members of organizations the user has joined',
    ),
    default: configDefaults.GITEA__service__DEFAULT_USER_VISIBILITY,
    values: {
      public: i18n('Public'),
      limited: i18n('Limited (signed-in users only)'),
      private: i18n('Private'),
    },
  }),
  GITEA__server__LANDING_PAGE: Value.select({
    name: i18n('Landing Page'),
    description: i18n(
      "What visitors who are not signed in see at Gitea's root address.\n- Home: Gitea's welcome page\n- Explore: the list of repositories they can see\n- Organizations: the list of organizations\n- Sign In: the sign-in page",
    ),
    default: configDefaults.GITEA__server__LANDING_PAGE,
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
    default: configDefaults.GITEA__actions__ENABLED,
  }),
  GITEA__actions__RUN_RETENTION_DAYS: Value.number({
    name: i18n('Actions Run Retention'),
    description: i18n(
      'Delete completed workflow runs older than this many days. Set 0 to keep runs indefinitely. Logs and artifacts have separate retention policies.',
    ),
    warning: i18n(
      'Deleting a workflow run also deletes its jobs, logs, and artifacts. Back up before shortening retention.',
    ),
    required: true,
    default: configDefaults.GITEA__actions__RUN_RETENTION_DAYS,
    min: 0,
    max: maxRunRetentionDays,
    integer: true,
    units: i18n('Days'),
  }),
  GITEA__migrations__ALLOWED_HOST_LIST: Value.text({
    name: i18n('Allowed Migration and Mirror Hosts'),
    description: i18n(
      'Comma-separated Gitea host rules for imports and mirrors. Public destinations are allowed by default. For a private server, allow its IP or CIDR with a port, for example 192.168.1.10:443. Leave empty for the default policy.',
    ),
    warning: i18n(
      'Allow only trusted destinations. Every user permitted to import repositories can reach the addresses you allow.',
    ),
    required: false,
    default: configDefaults.GITEA__migrations__ALLOWED_HOST_LIST,
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
