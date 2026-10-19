import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.2.0:0',
  releaseNotes: {
    en_US: `Updated Gitea to 28.2.0. Adds a built-in OAuth2 application for gitea-vscode and improves custom watch emails. Includes security hardening for LFS paths, OpenID validation and Actions artifact requests, plus fixes for cancelled workflows, npm tarball URLs, sign-in sessions and pull requests. Full release notes: https://github.com/go-gitea/gitea/releases/tag/v28.2.0

Adds Forward Email to the SMTP provider presets.`,
    es_ES: `Actualiza Gitea a 28.2.0. Añade una aplicación OAuth2 integrada para gitea-vscode y mejora los correos de seguimiento personalizado. Incluye refuerzos de seguridad para las rutas LFS, la validación OpenID y las solicitudes de artefactos de Actions, además de correcciones en flujos cancelados, URL de archivos npm, sesiones de acceso y solicitudes de incorporación. Notas completas: https://github.com/go-gitea/gitea/releases/tag/v28.2.0

Añade Forward Email a los proveedores SMTP predefinidos.`,
    de_DE: `Aktualisiert Gitea auf 28.2.0. Fügt eine integrierte OAuth2-Anwendung für gitea-vscode hinzu und verbessert E-Mails für benutzerdefinierte Beobachtungen. Enthält Sicherheitshärtungen für LFS-Pfade, OpenID-Validierung und Actions-Artefaktanfragen sowie Korrekturen für abgebrochene Workflows, npm-Tarball-URLs, Anmeldesitzungen und Pull Requests. Vollständige Versionshinweise: https://github.com/go-gitea/gitea/releases/tag/v28.2.0

Fügt Forward Email zu den vordefinierten SMTP-Anbietern hinzu.`,
    pl_PL: `Aktualizuje Gitea do 28.2.0. Dodaje wbudowaną aplikację OAuth2 dla gitea-vscode i ulepsza wiadomości e-mail dla niestandardowego obserwowania. Zawiera wzmocnienia zabezpieczeń ścieżek LFS, walidacji OpenID i żądań artefaktów Actions oraz poprawki anulowanych przepływów pracy, adresów archiwów npm, sesji logowania i żądań scalenia. Pełne informacje o wydaniu: https://github.com/go-gitea/gitea/releases/tag/v28.2.0

Dodaje Forward Email do predefiniowanych dostawców SMTP.`,
    fr_FR: `Met à jour Gitea vers 28.2.0. Ajoute une application OAuth2 intégrée pour gitea-vscode et améliore les courriels de suivi personnalisé. Inclut un renforcement de la sécurité des chemins LFS, de la validation OpenID et des requêtes d’artefacts Actions, ainsi que des corrections des workflows annulés, des URL d’archives npm, des sessions de connexion et des demandes de fusion. Notes de version complètes : https://github.com/go-gitea/gitea/releases/tag/v28.2.0

Ajoute Forward Email aux fournisseurs SMTP prédéfinis.`,
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
