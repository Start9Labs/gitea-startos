import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.27.1:0',
  releaseNotes: {
    en_US: `Updated Gitea to 1.27.1, a maintenance release.

- Security: the mandatory two-factor authentication policy is now enforced on the OAuth2 authorize and grant endpoints.
- Many Gitea Actions fixes, including \`cancelled()\` and \`matrix\` in job \`if\` expressions, boolean \`workflow_dispatch\` inputs, and clearer explanations for blocked or waiting jobs.
- A valid ACME certificate is now kept in service when renewal fails at startup.
- Deleting a repository or a user now cleans up rows that were previously left behind.
- Improved diff contrast in the light and dark themes.

Full release notes: https://github.com/go-gitea/gitea/releases/tag/v1.27.1`,
    es_ES: `Actualiza Gitea a 1.27.1, una versión de mantenimiento.

- Seguridad: la política de autenticación de dos factores obligatoria ahora se aplica en los puntos de acceso de autorización y concesión de OAuth2.
- Numerosas correcciones en Gitea Actions, incluidas \`cancelled()\` y \`matrix\` en las expresiones \`if\` de los trabajos, las entradas booleanas de \`workflow_dispatch\` y explicaciones más claras de por qué un trabajo está bloqueado o en espera.
- Un certificado ACME válido se mantiene en servicio cuando la renovación falla al iniciar.
- Al eliminar un repositorio o un usuario ahora se limpian los registros que antes quedaban huérfanos.
- Mejora el contraste de las diferencias en los temas claro y oscuro.

Notas de la versión completas: https://github.com/go-gitea/gitea/releases/tag/v1.27.1`,
    de_DE: `Aktualisiert Gitea auf 1.27.1, eine Wartungsversion.

- Sicherheit: Die Pflicht zur Zwei-Faktor-Authentifizierung wird jetzt auch an den OAuth2-Endpunkten für Autorisierung und Freigabe durchgesetzt.
- Zahlreiche Korrekturen an Gitea Actions, darunter \`cancelled()\` und \`matrix\` in \`if\`-Ausdrücken von Jobs, boolesche \`workflow_dispatch\`-Eingaben und klarere Erklärungen, warum ein Job blockiert ist oder wartet.
- Ein gültiges ACME-Zertifikat bleibt in Betrieb, wenn die Erneuerung beim Start fehlschlägt.
- Beim Löschen eines Repositories oder eines Benutzers werden nun Datensätze aufgeräumt, die zuvor zurückblieben.
- Verbesserter Kontrast von Diffs im hellen und im dunklen Design.

Vollständige Versionshinweise: https://github.com/go-gitea/gitea/releases/tag/v1.27.1`,
    pl_PL: `Aktualizuje Gitea do 1.27.1, wydania konserwacyjnego.

- Bezpieczeństwo: obowiązkowa polityka uwierzytelniania dwuskładnikowego jest teraz egzekwowana w punktach końcowych autoryzacji i przyznawania OAuth2.
- Wiele poprawek w Gitea Actions, w tym \`cancelled()\` i \`matrix\` w wyrażeniach \`if\` zadań, wartości logiczne w danych wejściowych \`workflow_dispatch\` oraz czytelniejsze wyjaśnienia, dlaczego zadanie jest zablokowane lub oczekuje.
- Prawidłowy certyfikat ACME pozostaje w użyciu, gdy jego odnowienie nie powiedzie się przy starcie.
- Usuwanie repozytorium lub użytkownika porządkuje teraz rekordy, które wcześniej pozostawały osierocone.
- Lepszy kontrast różnic w motywie jasnym i ciemnym.

Pełne informacje o wydaniu: https://github.com/go-gitea/gitea/releases/tag/v1.27.1`,
    fr_FR: `Met à jour Gitea vers 1.27.1, une version de maintenance.

- Sécurité : la politique d'authentification à deux facteurs obligatoire est désormais appliquée aux points d'accès d'autorisation et d'octroi OAuth2.
- De nombreuses corrections dans Gitea Actions, dont \`cancelled()\` et \`matrix\` dans les expressions \`if\` des tâches, les entrées booléennes de \`workflow_dispatch\` et des explications plus claires lorsqu'une tâche est bloquée ou en attente.
- Un certificat ACME valide reste en service lorsque son renouvellement échoue au démarrage.
- La suppression d'un dépôt ou d'un utilisateur nettoie désormais des enregistrements qui subsistaient auparavant.
- Meilleur contraste des différences dans les thèmes clair et sombre.

Notes de version complètes : https://github.com/go-gitea/gitea/releases/tag/v1.27.1`,
  },
  migrations: {},
})
