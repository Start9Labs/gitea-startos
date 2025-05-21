import { store } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { getHttpInterfaceUrls } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  url: Value.dynamicSelect(async ({ effects }) => {
    const systemUrls = await getHttpInterfaceUrls(effects)

    return {
      name: 'URL',
      values: systemUrls.reduce(
        (obj, url) => ({
          ...obj,
          [url]: url,
        }),
        {} as Record<string, string>,
      ),
      default:
        systemUrls.find((u) => u.startsWith('http:') && u.includes('.onion')) ||
        '',
    }
  }),
})

export const setPrimaryUrl = sdk.Action.withInput(
  // id
  'set-primary-url',

  // metadata
  async ({ effects }) => ({
    name: 'Set Primary Url',
    description:
      'Choose which of your Gitea http URLs should serve as the primary URL for the purposes of creating links, sending invites, etc.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => ({
    url:
      (await store.read((s) => s.GITEA__server__ROOT_URL).once()) || undefined,
  }),

  // the execution function
  async ({ effects, input }) =>
    store.merge(effects, { GITEA__server__ROOT_URL: input.url }),
)
