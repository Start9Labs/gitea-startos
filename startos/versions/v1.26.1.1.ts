import { VersionInfo, IMPOSSIBLE, FileHelper, z } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { getHttpInterfaceUrls, getSecretKey } from '../utils'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const v_1_26_1_1 = VersionInfo.of({
  version: '1.26.1:1',
  releaseNotes: {
    en_US: `**Bumps**

- Gitea → 1.26.1
- start-sdk → 1.5.0

**Internal**

- Reactive URL detection: Gitea now follows the upstream 1.26 default of \`PUBLIC_URL_DETECTION=auto\`, so links rendered in the web UI follow the URL you used to reach Gitea. The primary URL still drives generated clone URLs and email links.`,
    es_ES: `**Actualizaciones**

- Gitea → 1.26.1
- start-sdk → 1.5.0

**Interno**

- Detección de URL reactiva: Gitea sigue ahora el valor predeterminado de la versión 1.26 (\`PUBLIC_URL_DETECTION=auto\`), por lo que los enlaces que se muestran en la interfaz web siguen la URL que utilizaste para acceder a Gitea. La URL principal sigue determinando las URLs de clonación generadas y los enlaces de correo.`,
    de_DE: `**Aktualisierungen**

- Gitea → 1.26.1
- start-sdk → 1.5.0

**Intern**

- Reaktive URL-Erkennung: Gitea folgt jetzt dem Upstream-Standard von 1.26 (\`PUBLIC_URL_DETECTION=auto\`), sodass Links in der Web-Oberfläche der URL folgen, mit der du Gitea aufgerufen hast. Die primäre URL steuert weiterhin generierte Klon-URLs und E-Mail-Links.`,
    pl_PL: `**Aktualizacje**

- Gitea → 1.26.1
- start-sdk → 1.5.0

**Wewnętrzne**

- Reaktywne wykrywanie URL: Gitea używa teraz domyślnego ustawienia z wersji 1.26 (\`PUBLIC_URL_DETECTION=auto\`), więc linki w interfejsie webowym podążają za adresem URL, którego użyto do uzyskania dostępu do Gitea. URL główny nadal kontroluje generowane URL-e klonowania i linki w wiadomościach e-mail.`,
    fr_FR: `**Mises à niveau**

- Gitea → 1.26.1
- start-sdk → 1.5.0

**Interne**

- Détection d'URL réactive : Gitea suit désormais la valeur par défaut de la version 1.26 (\`PUBLIC_URL_DETECTION=auto\`), de sorte que les liens affichés dans l'interface web suivent l'URL que vous avez utilisée pour accéder à Gitea. L'URL principale continue de piloter les URL de clonage générées et les liens des e-mails.`,
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
