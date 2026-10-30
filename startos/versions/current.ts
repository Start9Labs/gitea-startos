import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.2.0:2',
  releaseNotes: {
    en_US:
      'Updates start-sdk to 3.1.1 and provides public documentation and English Markdown source links.',
    es_ES:
      'Actualiza start-sdk a 3.1.1 y proporciona enlaces a la documentación pública y al código fuente Markdown en inglés.',
    de_DE:
      'Aktualisiert start-sdk auf 3.1.1 und verlinkt die öffentliche Dokumentation sowie die englischen Markdown-Quelldateien.',
    pl_PL:
      'Aktualizuje start-sdk do 3.1.1 i dodaje odnośniki do publicznej dokumentacji oraz angielskich plików źródłowych Markdown.',
    fr_FR:
      'Met à jour start-sdk vers 3.1.1 et fournit des liens vers la documentation publique et les sources Markdown en anglais.',
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
