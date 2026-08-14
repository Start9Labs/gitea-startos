import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.27.2:0',
  releaseNotes: {
    en_US: `Updated Gitea to 1.27.2, a maintenance release.

- Security: fixes to collaborator access modes and HTTP signature handling, per-request WebAuthn user verification, and hardening of the markup and external renderers.
- Gitea Actions: \`pull_request_target\` reusable workflows are resolved at the base commit, \`workflow_dispatch\` inputs keep their string type, rerunning selected jobs can read the previous attempt's artifacts, and runs without running jobs can be cancelled.
- Git LFS: successful transfer responses are accepted, and a failed upload no longer deletes a concurrent upload's metadata.
- Fixes for URLs and archive downloads when Gitea is served under a sub-path.
- Package registry fixes for npm metadata, Swift, Alpine and Arch packages.

Full release notes: https://github.com/go-gitea/gitea/releases/tag/v1.27.2`,
    es_ES: `Actualiza Gitea a 1.27.2, una versión de mantenimiento.

- Seguridad: correcciones en los modos de acceso de los colaboradores y en el manejo de firmas HTTP, verificación WebAuthn del usuario por solicitud y refuerzo de los renderizadores de marcado y externos.
- Gitea Actions: los flujos de trabajo reutilizables de \`pull_request_target\` se resuelven en la confirmación base, las entradas de \`workflow_dispatch\` conservan su tipo de cadena, al reejecutar trabajos seleccionados se pueden leer los artefactos del intento anterior y se pueden cancelar las ejecuciones sin trabajos en curso.
- Git LFS: se aceptan las respuestas de transferencia correctas y una subida fallida ya no elimina los metadatos de una subida concurrente.
- Correcciones de las URL y de la descarga de archivos cuando Gitea se sirve bajo una subruta.
- Correcciones en el registro de paquetes para los metadatos de npm y para los paquetes de Swift, Alpine y Arch.

Notas de la versión completas: https://github.com/go-gitea/gitea/releases/tag/v1.27.2`,
    de_DE: `Aktualisiert Gitea auf 1.27.2, eine Wartungsversion.

- Sicherheit: Korrekturen an den Zugriffsmodi für Mitarbeitende und an der Verarbeitung von HTTP-Signaturen, WebAuthn-Benutzerüberprüfung pro Anfrage sowie Härtung der Markup- und externen Renderer.
- Gitea Actions: Wiederverwendbare \`pull_request_target\`-Workflows werden am Basis-Commit aufgelöst, \`workflow_dispatch\`-Eingaben behalten ihren Zeichenkettentyp, beim erneuten Ausführen ausgewählter Jobs können die Artefakte des vorherigen Versuchs gelesen werden, und Läufe ohne laufende Jobs lassen sich abbrechen.
- Git LFS: Erfolgreiche Übertragungsantworten werden akzeptiert, und ein fehlgeschlagener Upload löscht nicht mehr die Metadaten eines gleichzeitigen Uploads.
- Korrekturen für URLs und Archiv-Downloads, wenn Gitea unter einem Unterpfad bereitgestellt wird.
- Korrekturen an der Paket-Registry für npm-Metadaten sowie für Swift-, Alpine- und Arch-Pakete.

Vollständige Versionshinweise: https://github.com/go-gitea/gitea/releases/tag/v1.27.2`,
    pl_PL: `Aktualizuje Gitea do 1.27.2, wydania konserwacyjnego.

- Bezpieczeństwo: poprawki trybów dostępu współpracowników i obsługi podpisów HTTP, weryfikacja użytkownika WebAuthn dla każdego żądania oraz wzmocnienie mechanizmów renderowania znaczników i renderowania zewnętrznego.
- Gitea Actions: wielokrotnego użytku przepływy pracy \`pull_request_target\` są rozwiązywane na zatwierdzeniu bazowym, dane wejściowe \`workflow_dispatch\` zachowują typ tekstowy, ponowne uruchomienie wybranych zadań pozwala odczytać artefakty z poprzedniej próby, a uruchomienia bez działających zadań można anulować.
- Git LFS: udane odpowiedzi transferu są akceptowane, a nieudane przesyłanie nie usuwa już metadanych równoległego przesyłania.
- Poprawki adresów URL i pobierania archiwów, gdy Gitea działa w podścieżce.
- Poprawki w rejestrze pakietów dotyczące metadanych npm oraz pakietów Swift, Alpine i Arch.

Pełne informacje o wydaniu: https://github.com/go-gitea/gitea/releases/tag/v1.27.2`,
    fr_FR: `Met à jour Gitea vers 1.27.2, une version de maintenance.

- Sécurité : corrections des modes d'accès des collaborateurs et du traitement des signatures HTTP, vérification WebAuthn de l'utilisateur à chaque requête et renforcement des moteurs de rendu du balisage et externes.
- Gitea Actions : les workflows réutilisables \`pull_request_target\` sont résolus sur le commit de base, les entrées \`workflow_dispatch\` conservent leur type chaîne, la réexécution de tâches sélectionnées peut lire les artefacts de la tentative précédente et les exécutions sans tâche en cours peuvent être annulées.
- Git LFS : les réponses de transfert réussies sont acceptées et un envoi en échec ne supprime plus les métadonnées d'un envoi concurrent.
- Corrections des URL et des téléchargements d'archives lorsque Gitea est servi sous un sous-chemin.
- Corrections du registre de paquets pour les métadonnées npm et pour les paquets Swift, Alpine et Arch.

Notes de version complètes : https://github.com/go-gitea/gitea/releases/tag/v1.27.2`,
  },
  migrations: {},
})
