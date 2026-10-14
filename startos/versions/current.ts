import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.1.0:1',
  releaseNotes: {
    en_US:
      'Updates start-sdk to 3.0.6 and makes admin credential and commit-signing results compatible with it, enabling the Gitea Runner 5.1.0 package update.',
    es_ES:
      'Actualiza start-sdk a 3.0.6 y adapta los resultados de credenciales de administrador y firma de commits para permitir la actualización del paquete Gitea Runner a 5.1.0.',
    de_DE:
      'Aktualisiert start-sdk auf 3.0.6 und passt die Ergebnisse für Administrator-Zugangsdaten und Commit-Signierung daran an, um das Paket-Update für Gitea Runner auf 5.1.0 zu ermöglichen.',
    pl_PL:
      'Aktualizuje start-sdk do 3.0.6 i dostosowuje wyniki akcji danych logowania administratora oraz podpisywania commitów, umożliwiając aktualizację pakietu Gitea Runner do 5.1.0.',
    fr_FR:
      'Met à jour start-sdk vers 3.0.6 et adapte les résultats des identifiants administrateur et de la signature des commits, permettant la mise à jour du paquet Gitea Runner vers 5.1.0.',
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
