import { VersionInfo, IMPOSSIBLE, FileHelper, z } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { getHttpInterfaceUrls, getSecretKey } from '../utils'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const v_1_25_5_1 = VersionInfo.of({
  version: '1.25.5:1',
  releaseNotes: {
    en_US: 'Fix SSH clone URL to match the configured primary URL',
    es_ES: 'Corregir la URL de clonación SSH para que coincida con la URL principal configurada',
    de_DE: 'SSH-Klon-URL korrigiert, damit sie mit der konfigurierten primären URL übereinstimmt',
    pl_PL: 'Naprawiono URL klonowania SSH, aby pasował do skonfigurowanego głównego URL',
    fr_FR: "Correction de l'URL de clonage SSH pour correspondre à l'URL principale configurée",
  },
  migrations: {
    up: async ({ effects }) => {
      // Read legacy config from start9/config.yaml
      const legacyConfig = await FileHelper.yaml(
        {
          base: sdk.volumes.main,
          subpath: 'start9/config.yaml',
        },
        z
          .object({
            'email-notifications': z
              .object({
                'smtp-host': z.string().optional(),
                'smtp-port': z.number().optional(),
                'smtp-user': z.string().optional(),
                'smtp-pass': z.string().optional(),
                'from-name': z.string().optional(),
              })
              .optional(),
            'local-mode': z.boolean().optional(),
          })
          .strip(),
      )
        .read()
        .once()

      if (!legacyConfig) return

      // Read legacy secret key if it exists, otherwise generate a new one
      let secretKey: string
      try {
        secretKey = await readFile(
          '/media/startos/volumes/main/start9/secret-key.txt',
          'base64',
        )
      } catch (e) {
        console.error('Legacy secret not found, creating one')
        secretKey = getSecretKey()
      }

      const urls = await getHttpInterfaceUrls(effects)

      // initialize the store
      await storeJson.merge(effects, {
        GITEA__security__SECRET_KEY: secretKey,
        GITEA__server__ROOT_URL:
          urls.find((u) =>
            legacyConfig['local-mode']
              ? u.includes('.local')
              : u.startsWith('http:') && u.includes('.onion'),
          ) || '',
        GITEA__service__DISABLE_REGISTRATION: true,
        smtp: legacyConfig['email-notifications']
          ? {
              selection: 'custom' as const,
              value: {
                provider: {
                  selection: 'other',
                  value: {
                    host:
                      legacyConfig['email-notifications']['smtp-host'] || '',
                    from:
                      legacyConfig['email-notifications']['from-name'] || '',
                    username:
                      legacyConfig['email-notifications']['smtp-user'] || '',
                    password:
                      legacyConfig['email-notifications']['smtp-pass'] || '',
                    security: {
                      selection:
                        legacyConfig['email-notifications']['smtp-port'] === 465
                          ? ('tls' as const)
                          : ('starttls' as const),
                      value: {
                        port: String(
                          legacyConfig['email-notifications']['smtp-port'] ||
                            587,
                        ),
                      },
                    },
                  },
                },
              },
            }
          : {
              selection: 'disabled' as const,
              value: {},
            },
      })

      // Clean up legacy folder
      await rm('/media/startos/volumes/main/start9', {
        recursive: true,
      }).catch(console.error)
    },
    down: IMPOSSIBLE,
  },
})
