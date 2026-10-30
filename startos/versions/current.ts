import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.2.0:2',
  releaseNotes: {
    en_US:
      "The instructions' Documentation link opens Gitea's public documentation site.",
    es_ES:
      'El enlace de Documentación de las instrucciones abre el sitio público de documentación de Gitea.',
    de_DE:
      'Der Dokumentationslink in der Anleitung öffnet die öffentliche Dokumentationsseite von Gitea.',
    pl_PL:
      'Odnośnik Dokumentacja w instrukcjach otwiera publiczną stronę dokumentacji Gitea.',
    fr_FR:
      'Le lien Documentation des instructions ouvre le site public de documentation de Gitea.',
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
