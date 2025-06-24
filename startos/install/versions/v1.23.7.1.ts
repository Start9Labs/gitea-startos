import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { load } from 'js-yaml'
import { getHttpInterfaceUrls } from '../../utils'
import { storeJson } from '../../fileModels/store.json'

export const v1_23_7_1 = VersionInfo.of({
  version: '1.23.7:1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
      const configYaml = load(
        await readFile(
          '/media/startos/volumes/main/start9/config.yaml',
          'utf-8',
        ),
      ) as
        | {
            'email-notifications'?: {
              'smtp-host': string
              'smtp-port': number
              'smtp-user': string
              'smtp-pass': string
              'from-name': string
            }
            'local-mode': boolean
          }
        | undefined

      const urls = await getHttpInterfaceUrls(effects)

      // initialize the store
      await storeJson.write(effects, {
        GITEA__security__SECRET_KEY: await readFile(
          '/data/start9/secret-key.txt',
          'base64',
        ),
        GITEA__server__ROOT_URL: urls.find((u) =>
          configYaml?.['local-mode']
            ? u.includes('.local')
            : u.startsWith('http:') && u.includes('.onion'),
        )!,
        GITEA__service__DISABLE_REGISTRATION: true,
        smtp: configYaml?.['email-notifications']
          ? {
              selection: 'custom',
              value: {
                server: configYaml['email-notifications']['smtp-host'],
                port: configYaml['email-notifications']['smtp-port'],
                from: configYaml['email-notifications']['from-name'],
                login: configYaml['email-notifications']['smtp-user'],
                password: configYaml['email-notifications']['smtp-pass'],
              },
            }
          : {
              selection: 'disabled',
              value: {},
            },
      })

      // remove old start9 dir
      await rm('/media/startos/volumes/main/start9', { recursive: true }).catch(
        console.error,
      )
    },
    down: IMPOSSIBLE,
  },
})
