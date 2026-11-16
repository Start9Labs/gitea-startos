import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.4.0:0',
  releaseNotes: {
    en_US:
      'Updates Gitea to 28.4.0. Requires StartOS 0.4.2 or later. Limits failed two-factor login attempts per account, fixes several permission checks and occasional deadlocks when pushing or creating issues, and includes a security update. Full notes: https://github.com/go-gitea/gitea/releases/tag/v28.4.0',
    es_ES:
      'Actualiza Gitea a 28.4.0. Requiere StartOS 0.4.2 o posterior. Limita los intentos fallidos de inicio de sesión con doble factor por cuenta, corrige varias comprobaciones de permisos y bloqueos ocasionales al hacer push o crear incidencias, e incluye una actualización de seguridad. Notas completas: https://github.com/go-gitea/gitea/releases/tag/v28.4.0',
    de_DE:
      'Aktualisiert Gitea auf 28.4.0. Erfordert StartOS 0.4.2 oder neuer. Begrenzt fehlgeschlagene Zwei-Faktor-Anmeldeversuche pro Konto, behebt mehrere Berechtigungsprüfungen sowie gelegentliche Blockaden beim Pushen oder Erstellen von Issues und enthält ein Sicherheitsupdate. Vollständige Versionshinweise: https://github.com/go-gitea/gitea/releases/tag/v28.4.0',
    pl_PL:
      'Aktualizuje Gitea do 28.4.0. Wymaga StartOS 0.4.2 lub nowszego. Ogranicza liczbę nieudanych prób logowania dwuskładnikowego na konto, poprawia kilka kontroli uprawnień i sporadyczne zakleszczenia przy wypychaniu zmian lub tworzeniu zgłoszeń oraz zawiera aktualizację bezpieczeństwa. Pełne informacje o wydaniu: https://github.com/go-gitea/gitea/releases/tag/v28.4.0',
    fr_FR:
      "Met à jour Gitea vers 28.4.0. Nécessite StartOS 0.4.2 ou une version ultérieure. Limite les tentatives de connexion à deux facteurs échouées par compte, corrige plusieurs vérifications d'autorisations et des blocages occasionnels lors d'un push ou de la création de tickets, et inclut une mise à jour de sécurité. Notes de version complètes : https://github.com/go-gitea/gitea/releases/tag/v28.4.0",
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
