import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.0.0:1',
  releaseNotes: {
    en_US: `Adds a Commit Signing action. When enabled, Gitea signs pull request merges, and optionally web edits, with its own key, so branches that require signed commits can accept merges. It is off by default, and the action shows the public key to trust.`,
    es_ES: `Añade la acción Firma de commits. Al activarla, Gitea firma las fusiones de pull requests, y opcionalmente las ediciones web, con su propia clave, para que las ramas que exigen commits firmados puedan aceptar fusiones. Está desactivada por defecto y la acción muestra la clave pública en la que confiar.`,
    de_DE: `Fügt die Aktion Commit-Signierung hinzu. Ist sie aktiviert, signiert Gitea Pull-Request-Merges und optional Web-Bearbeitungen mit einem eigenen Schlüssel, sodass Branches, die signierte Commits verlangen, Merges annehmen können. Sie ist standardmäßig aus, und die Aktion zeigt den öffentlichen Schlüssel, dem vertraut werden muss.`,
    pl_PL: `Dodaje akcję Podpisywanie commitów. Po włączeniu Gitea podpisuje scalenia pull requestów, a opcjonalnie także edycje w przeglądarce, własnym kluczem, dzięki czemu gałęzie wymagające podpisanych commitów mogą przyjmować scalenia. Domyślnie jest wyłączona, a akcja pokazuje klucz publiczny, któremu należy zaufać.`,
    fr_FR: `Ajoute l'action Signature des commits. Une fois activée, Gitea signe les fusions de pull requests, et en option les modifications web, avec sa propre clé, pour que les branches qui exigent des commits signés puissent accepter les fusions. Elle est désactivée par défaut et l'action affiche la clé publique à approuver.`,
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
