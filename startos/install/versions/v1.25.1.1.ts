import {
  VersionInfo,
  IMPOSSIBLE,
  FileHelper,
  matches,
  utils,
} from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { getHttpInterfaceUrls } from '../../utils'
import { storeJson } from '../../fileModels/store.json'

export const v1_25_1_1 = VersionInfo.of({
  version: '1.25.1:1-alpha.1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      // Read legacy config from start9/config.yaml
      const legacyConfig = await FileHelper.yaml(
        {
          volumeId: 'main',
          subpath: 'start9/config.yaml',
        },
        matches.object({
          'email-notifications': matches
            .object({
              'smtp-host': matches.string.optional(),
              'smtp-port': matches.number.optional(),
              'smtp-user': matches.string.optional(),
              'smtp-pass': matches.string.optional(),
              'from-name': matches.string.optional(),
            })
            .optional(),
          'local-mode': matches.boolean.optional(),
        }),
      )
        .read()
        .once()

      // Read legacy secret key if it exists, otherwise generate a new one
      let secretKey: string
      try {
        secretKey = await readFile(
          '/media/startos/volumes/main/start9/secret-key.txt',
          'base64',
        )
      } catch {
        // Generate a new secret key if the legacy one doesn't exist
        secretKey = utils.getDefaultString({
          charset: 'A-Z,a-z,0-9,+,/',
          len: 32,
        })
      }

      const urls = await getHttpInterfaceUrls(effects)

      // initialize the store
      await storeJson.write(effects, {
        GITEA__security__SECRET_KEY: secretKey,
        GITEA__server__ROOT_URL:
          urls.find((u) =>
            legacyConfig?.['local-mode']
              ? u.includes('.local')
              : u.startsWith('http:') && u.includes('.onion'),
          ) || '',
        GITEA__service__DISABLE_REGISTRATION: true,
        smtp: legacyConfig?.['email-notifications']
          ? {
              selection: 'custom',
              value: {
                server: legacyConfig['email-notifications']['smtp-host'] || '',
                port: legacyConfig['email-notifications']['smtp-port'] || 587,
                from: legacyConfig['email-notifications']['from-name'] || '',
                login: legacyConfig['email-notifications']['smtp-user'] || '',
                password:
                  legacyConfig['email-notifications']['smtp-pass'] || '',
              },
            }
          : {
              selection: 'disabled',
              value: {},
            },
      })

      // Clean up legacy folder
      await rm('/media/startos/volumes/main/start9', { recursive: true }).catch(
        console.error,
      )
    },
    down: IMPOSSIBLE,
  },
})
