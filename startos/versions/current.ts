import { VersionInfo, IMPOSSIBLE, FileHelper, z } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { getHttpInterfaceUrls, getSecretKey } from '../utils'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '1.26.2:1',
  releaseNotes: {
    en_US: `**Improvements**

- Use a unique session cookie name (\`i_like_gitea\`) instead of the generic \`session\`, preventing login errors when other services share the same local hostname. You may need to sign in again after updating.`,
    es_ES: `**Mejoras**

- Se usa un nombre único para la cookie de sesión (\`i_like_gitea\`) en lugar del genérico \`session\`, evitando errores de inicio de sesión cuando otros servicios comparten el mismo nombre de host local. Es posible que debas iniciar sesión de nuevo tras la actualización.`,
    de_DE: `**Verbesserungen**

- Es wird ein eindeutiger Name für das Sitzungs-Cookie (\`i_like_gitea\`) anstelle des generischen \`session\` verwendet, um Anmeldefehler zu vermeiden, wenn andere Dienste denselben lokalen Hostnamen nutzen. Nach dem Update musst du dich möglicherweise erneut anmelden.`,
    pl_PL: `**Ulepszenia**

- Używana jest unikalna nazwa ciasteczka sesji (\`i_like_gitea\`) zamiast ogólnej \`session\`, co zapobiega błędom logowania, gdy inne usługi współdzielą tę samą lokalną nazwę hosta. Po aktualizacji może być konieczne ponowne zalogowanie.`,
    fr_FR: `**Améliorations**

- Utilisation d'un nom unique pour le cookie de session (\`i_like_gitea\`) au lieu du générique \`session\`, évitant les erreurs de connexion lorsque d'autres services partagent le même nom d'hôte local. Vous devrez peut-être vous reconnecter après la mise à jour.`,
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
