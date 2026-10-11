import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.1.0:0',
  releaseNotes: {
    en_US: `Updated Gitea to 28.1.0.

- Improves npm client compatibility and fixes access checks in API and web handlers.
- Fixes Gitea Actions pushes to protected branches and reusable workflow status updates.
- Fixes Git operations during concurrent repository repacks and commit status queries on SQLite.
- On first start, Gitea repairs legacy team permissions in its database. Back up before updating; returning to an older release requires a pre-update backup.
- Updates start-sdk to 3.0.4.

[Full release notes](https://github.com/go-gitea/gitea/releases/tag/v28.1.0)`,
    es_ES: `Actualiza Gitea a 28.1.0.

- Mejora la compatibilidad con el cliente npm y corrige las comprobaciones de acceso en los controladores de la API y de la web.
- Corrige los envíos de Gitea Actions a ramas protegidas y las actualizaciones de estado de los flujos de trabajo reutilizables.
- Corrige las operaciones de Git durante reempaquetados simultáneos de repositorios y las consultas de estado de commits en SQLite.
- Al iniciar por primera vez, Gitea repara los permisos antiguos de los equipos en su base de datos. Haz una copia de seguridad antes de actualizar; volver a una versión anterior requiere una copia previa a la actualización.
- Actualiza start-sdk a 3.0.4.

[Notas de la versión completas](https://github.com/go-gitea/gitea/releases/tag/v28.1.0)`,
    de_DE: `Aktualisiert Gitea auf 28.1.0.

- Verbessert die Kompatibilität mit dem npm-Client und korrigiert Zugriffsprüfungen in API- und Web-Handlern.
- Behebt Pushes von Gitea Actions auf geschützte Branches und Statusaktualisierungen wiederverwendbarer Workflows.
- Korrigiert Git-Operationen während gleichzeitiger Repository-Neupackungen und Commit-Statusabfragen unter SQLite.
- Beim ersten Start repariert Gitea alte Team-Berechtigungen in seiner Datenbank. Vor dem Update ein Backup erstellen; die Rückkehr zu einer älteren Version erfordert ein Backup von vor dem Update.
- Aktualisiert start-sdk auf 3.0.4.

[Vollständige Versionshinweise](https://github.com/go-gitea/gitea/releases/tag/v28.1.0)`,
    pl_PL: `Aktualizuje Gitea do 28.1.0.

- Poprawia zgodność z klientem npm i kontrole dostępu w obsłudze API oraz stron internetowych.
- Naprawia wysyłanie zmian przez Gitea Actions do chronionych gałęzi i aktualizacje stanu przepływów pracy wielokrotnego użytku.
- Naprawia operacje Git podczas równoczesnego przepakowywania repozytoriów i zapytania o stan commitów w SQLite.
- Przy pierwszym uruchomieniu Gitea naprawia starsze uprawnienia zespołów w bazie danych. Przed aktualizacją wykonaj kopię zapasową; powrót do starszej wersji wymaga kopii sprzed aktualizacji.
- Aktualizuje start-sdk do 3.0.4.

[Pełne informacje o wydaniu](https://github.com/go-gitea/gitea/releases/tag/v28.1.0)`,
    fr_FR: `Met à jour Gitea vers 28.1.0.

- Améliore la compatibilité avec le client npm et corrige les contrôles d'accès dans les gestionnaires API et web.
- Corrige les envois de Gitea Actions vers les branches protégées et les mises à jour d'état des workflows réutilisables.
- Corrige les opérations Git pendant les réempaquetages simultanés de dépôts et les requêtes d'état des commits sous SQLite.
- Au premier démarrage, Gitea répare les anciennes permissions des équipes dans sa base de données. Faites une sauvegarde avant la mise à jour ; revenir à une ancienne version nécessite une sauvegarde antérieure à la mise à jour.
- Met à jour start-sdk vers 3.0.4.

[Notes de version complètes](https://github.com/go-gitea/gitea/releases/tag/v28.1.0)`,
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
