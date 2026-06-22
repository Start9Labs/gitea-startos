import { VersionInfo, IMPOSSIBLE, FileHelper, z } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { getHttpInterfaceUrls, getSecretKey } from '../utils'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '1.26.4:0',
  releaseNotes: {
    en_US: `Updated Gitea to 1.26.4.

**Security**

- Disabled users are no longer auto-reactivated on OAuth2 login, plus several LFS, host-matcher, and IP-range hardening fixes.

**Breaking**

- Gitea Actions now requires a merged PR to bypass the fork PR approval gate.

**Fixes**

- Resolves the "context deadline exceeded" regression from 1.26.3 when opening repository code pages, plus numerous other bug fixes.

Full notes: https://github.com/go-gitea/gitea/releases/tag/v1.26.4`,
    es_ES: `Gitea actualizado a 1.26.4.

**Seguridad**

- Los usuarios deshabilitados ya no se reactivan automáticamente al iniciar sesión con OAuth2, además de varias mejoras de seguridad en LFS, el comparador de hosts y los rangos de IP.

**Cambios importantes**

- Gitea Actions ahora requiere un PR fusionado para omitir la verificación de aprobación de PR de bifurcaciones.

**Correcciones**

- Soluciona la regresión "context deadline exceeded" de la 1.26.3 al abrir las páginas de código de un repositorio, junto con numerosas correcciones de errores.

Notas completas: https://github.com/go-gitea/gitea/releases/tag/v1.26.4`,
    de_DE: `Gitea auf 1.26.4 aktualisiert.

**Sicherheit**

- Deaktivierte Benutzer werden bei der OAuth2-Anmeldung nicht mehr automatisch reaktiviert, dazu mehrere Härtungsfixes für LFS, den Host-Matcher und IP-Bereiche.

**Wichtige Änderungen**

- Gitea Actions erfordert nun einen zusammengeführten PR, um die Genehmigungsprüfung für Fork-PRs zu umgehen.

**Fehlerbehebungen**

- Behebt die Regression "context deadline exceeded" aus 1.26.3 beim Öffnen der Code-Seiten eines Repositorys sowie zahlreiche weitere Fehlerbehebungen.

Vollständige Hinweise: https://github.com/go-gitea/gitea/releases/tag/v1.26.4`,
    pl_PL: `Zaktualizowano Gitea do 1.26.4.

**Bezpieczeństwo**

- Wyłączeni użytkownicy nie są już automatycznie ponownie aktywowani podczas logowania OAuth2, a także kilka poprawek zabezpieczeń dla LFS, dopasowywania hostów i zakresów IP.

**Zmiany niekompatybilne**

- Gitea Actions wymaga teraz scalonego PR, aby ominąć bramkę zatwierdzania PR z forka.

**Poprawki**

- Naprawia regresję "context deadline exceeded" z wersji 1.26.3 przy otwieraniu stron z kodem repozytorium oraz wiele innych błędów.

Pełne informacje: https://github.com/go-gitea/gitea/releases/tag/v1.26.4`,
    fr_FR: `Gitea mis à jour vers 1.26.4.

**Sécurité**

- Les utilisateurs désactivés ne sont plus réactivés automatiquement lors de la connexion OAuth2, ainsi que plusieurs correctifs de sécurité pour LFS, le comparateur d'hôtes et les plages d'IP.

**Changements majeurs**

- Gitea Actions exige désormais une PR fusionnée pour contourner le contrôle d'approbation des PR de forks.

**Corrections**

- Corrige la régression « context deadline exceeded » de la 1.26.3 lors de l'ouverture des pages de code d'un dépôt, ainsi que de nombreux autres correctifs.

Notes complètes: https://github.com/go-gitea/gitea/releases/tag/v1.26.4`,
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
