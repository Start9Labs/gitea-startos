import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.3.0:0',
  releaseNotes: {
    en_US:
      'Updated Gitea to 28.3.0 with tighter access checks, faster issue and pull request lists, and fixes for Actions artifacts and review-triggered workflows. The upstream image now includes the fixed CA store, replacing the temporary package layer without restoring trust in the compromised eMudhra root. Full release notes: https://github.com/go-gitea/gitea/releases/tag/v28.3.0',
    es_ES:
      'Gitea actualizado a 28.3.0 con controles de acceso más estrictos, listas de incidencias y solicitudes de incorporación más rápidas y correcciones de artefactos de Actions y flujos activados por revisiones. La imagen original ya incluye el almacén de certificados corregido y sustituye la capa temporal del paquete sin volver a confiar en la raíz comprometida de eMudhra. Notas completas: https://github.com/go-gitea/gitea/releases/tag/v28.3.0',
    de_DE:
      'Gitea auf 28.3.0 aktualisiert: strengere Zugriffsprüfungen, schnellere Issue- und Pull-Request-Listen sowie Korrekturen für Actions-Artefakte und durch Reviews ausgelöste Workflows. Das Upstream-Image enthält nun den korrigierten Zertifikatsspeicher und ersetzt die temporäre Paketschicht, ohne der kompromittierten eMudhra-Wurzel erneut zu vertrauen. Vollständige Versionshinweise: https://github.com/go-gitea/gitea/releases/tag/v28.3.0',
    pl_PL:
      'Zaktualizowano Gitea do 28.3.0: dokładniejsze kontrole dostępu, szybsze listy zgłoszeń i żądań scalenia oraz poprawki artefaktów Actions i przepływów uruchamianych przez recenzje. Obraz źródłowy zawiera już poprawiony magazyn certyfikatów, zastępując tymczasową warstwę pakietu bez przywracania zaufania do skompromitowanego certyfikatu głównego eMudhra. Pełne informacje: https://github.com/go-gitea/gitea/releases/tag/v28.3.0',
    fr_FR:
      'Gitea mis à jour vers 28.3.0 : contrôles d’accès renforcés, listes de tickets et de demandes de tirage plus rapides, et corrections des artefacts Actions et des workflows déclenchés par les revues. L’image amont inclut désormais le magasin de certificats corrigé et remplace la couche temporaire du paquet sans rétablir la confiance dans la racine eMudhra compromise. Notes complètes : https://github.com/go-gitea/gitea/releases/tag/v28.3.0',
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
