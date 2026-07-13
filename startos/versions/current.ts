import { VersionInfo, IMPOSSIBLE, FileHelper, z } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { getHttpInterfaceUrls, getSecretKey } from '../utils'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '1.27.0:0',
  releaseNotes: {
    en_US: `Updated Gitea to 1.27.0.

- Adds a Content-Security-Policy with a script nonce. Custom templates or themes that embed inline scripts must now carry that nonce, or they will stop running.
- Reusable workflows in Gitea Actions are now expanded by Gitea instead of the runner, and each called job appears as its own entry.
- Reusable workflows hosted on another Gitea instance are no longer supported. Clone those repositories to this server to keep using them.
- Includes numerous security fixes and Gitea Actions improvements.

Full release notes: https://github.com/go-gitea/gitea/releases/tag/v1.27.0`,
    es_ES: `Actualiza Gitea a 1.27.0.

- Añade una Content-Security-Policy con un nonce para los scripts. Las plantillas o temas personalizados que incrusten scripts en línea deben incluir ese nonce, o dejarán de ejecutarse.
- Los flujos de trabajo reutilizables de Gitea Actions ahora los expande Gitea en lugar del runner, y cada trabajo llamado aparece como una entrada propia.
- Ya no se admiten los flujos de trabajo reutilizables alojados en otra instancia de Gitea. Clona esos repositorios en este servidor para seguir usándolos.
- Incluye numerosas correcciones de seguridad y mejoras en Gitea Actions.

Notas de la versión completas: https://github.com/go-gitea/gitea/releases/tag/v1.27.0`,
    de_DE: `Aktualisiert Gitea auf 1.27.0.

- Fügt eine Content-Security-Policy mit einem Skript-Nonce hinzu. Benutzerdefinierte Templates oder Themes, die Inline-Skripte einbetten, müssen diesen Nonce nun mitführen, sonst werden sie nicht mehr ausgeführt.
- Wiederverwendbare Workflows in Gitea Actions werden jetzt von Gitea statt vom Runner expandiert, und jeder aufgerufene Job erscheint als eigener Eintrag.
- Wiederverwendbare Workflows auf einer anderen Gitea-Instanz werden nicht mehr unterstützt. Klone diese Repositories auf diesen Server, um sie weiter zu nutzen.
- Enthält zahlreiche Sicherheitskorrekturen und Verbesserungen an Gitea Actions.

Vollständige Versionshinweise: https://github.com/go-gitea/gitea/releases/tag/v1.27.0`,
    pl_PL: `Aktualizuje Gitea do 1.27.0.

- Dodaje Content-Security-Policy z nonce dla skryptów. Niestandardowe szablony i motywy osadzające skrypty w treści strony muszą teraz zawierać ten nonce, inaczej przestaną działać.
- Przepływy pracy wielokrotnego użytku w Gitea Actions są teraz rozwijane przez Gitea, a nie przez runnera, i każde wywołane zadanie pojawia się jako osobny wpis.
- Przepływy pracy wielokrotnego użytku hostowane na innej instancji Gitea nie są już obsługiwane. Sklonuj te repozytoria na ten serwer, aby nadal z nich korzystać.
- Zawiera liczne poprawki bezpieczeństwa i ulepszenia Gitea Actions.

Pełne informacje o wydaniu: https://github.com/go-gitea/gitea/releases/tag/v1.27.0`,
    fr_FR: `Met à jour Gitea vers 1.27.0.

- Ajoute une Content-Security-Policy avec un nonce pour les scripts. Les modèles ou thèmes personnalisés qui intègrent des scripts en ligne doivent désormais porter ce nonce, sans quoi ils cesseront de s'exécuter.
- Les workflows réutilisables de Gitea Actions sont désormais développés par Gitea et non plus par le runner, et chaque tâche appelée apparaît comme une entrée distincte.
- Les workflows réutilisables hébergés sur une autre instance Gitea ne sont plus pris en charge. Clonez ces dépôts sur ce serveur pour continuer à les utiliser.
- Inclut de nombreux correctifs de sécurité et des améliorations de Gitea Actions.

Notes de version complètes : https://github.com/go-gitea/gitea/releases/tag/v1.27.0`,
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
