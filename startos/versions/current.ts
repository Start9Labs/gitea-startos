import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.27.3:1',
  releaseNotes: {
    en_US: `Adds a Configure action for Gitea settings that are otherwise only available in its configuration file, including the default branch name for new repositories and whether Gitea Actions is enabled.

Updated Gitea to 1.27.3, a security release. Updating is recommended.

- Security: eighteen fixes, including package registry access-scope enforcement, attachment and markup access checks tied to the owning repository, stricter trust boundaries for pull requests from forks, restricted hook permissions, and hidden owners' repositories no longer being listed.
- Gitea Actions: raw artifact signatures are verified first, step-level \`continue-on-error\` expressions are left unevaluated, matrix jobs are grouped correctly, non-mapping matrix \`include\`/\`exclude\` is rejected, and YAML anchors and aliases are resolved.
- Pull requests: the merged state is kept in sync with Git, review permalinks are available, and default compare links name the head repository.
- Fixes for co-author trailers that are not valid email addresses, OpenPGP signatures no longer being verified against an SSH instance key, and correct Bleve search-index token filters.

Full release notes: https://github.com/go-gitea/gitea/releases/tag/v1.27.3`,
    es_ES: `Añade una acción Configurar para los ajustes de Gitea que de otro modo solo están disponibles en su archivo de configuración, incluidos el nombre de la rama predeterminada de los repositorios nuevos y si Gitea Actions está activado.

Actualiza Gitea a 1.27.3, una versión de seguridad. Se recomienda actualizar.

- Seguridad: dieciocho correcciones, entre ellas la aplicación de los ámbitos de acceso del registro de paquetes, comprobaciones de acceso de los adjuntos y del marcado vinculadas al repositorio propietario, límites de confianza más estrictos para las solicitudes de incorporación desde bifurcaciones, permisos restringidos de los hooks y repositorios de propietarios ocultos que ya no se listan.
- Gitea Actions: las firmas de los artefactos sin procesar se verifican primero, las expresiones \`continue-on-error\` a nivel de paso quedan sin evaluar, los trabajos de matriz se agrupan correctamente, se rechazan los \`include\`/\`exclude\` de matriz que no son asignaciones y se resuelven los anclas y alias de YAML.
- Solicitudes de incorporación: el estado de fusión se mantiene sincronizado con Git, hay enlaces permanentes a las revisiones y los enlaces de comparación predeterminados nombran el repositorio de origen.
- Correcciones para los remolques de coautoría que no son direcciones de correo válidas, las firmas OpenPGP que ya no se verifican con una clave SSH de la instancia y los filtros de tokens del índice de búsqueda Bleve.

Notas de la versión completas: https://github.com/go-gitea/gitea/releases/tag/v1.27.3`,
    de_DE: `Fügt eine Aktion „Konfigurieren“ für Gitea-Einstellungen hinzu, die sonst nur in der Konfigurationsdatei verfügbar sind, darunter der Standard-Branch-Name für neue Repositories und ob Gitea Actions aktiviert ist.

Aktualisiert Gitea auf 1.27.3, eine Sicherheitsversion. Ein Update wird empfohlen.

- Sicherheit: achtzehn Korrekturen, darunter die Durchsetzung der Zugriffsbereiche der Paket-Registry, an das besitzende Repository gebundene Zugriffsprüfungen für Anhänge und Markup, strengere Vertrauensgrenzen für Pull Requests aus Forks, eingeschränkte Hook-Berechtigungen und Repositories verborgener Eigentümer, die nicht mehr aufgelistet werden.
- Gitea Actions: Rohe Artefaktsignaturen werden zuerst geprüft, \`continue-on-error\`-Ausdrücke auf Schrittebene bleiben unausgewertet, Matrix-Jobs werden korrekt gruppiert, Matrix-\`include\`/-\`exclude\` ohne Zuordnung wird abgelehnt, und YAML-Anker und -Aliase werden aufgelöst.
- Pull Requests: Der Merge-Zustand bleibt mit Git synchron, Permalinks zu Reviews sind verfügbar, und Standard-Vergleichslinks nennen das Quell-Repository.
- Korrekturen für Co-Author-Trailer, die keine gültigen E-Mail-Adressen sind, für OpenPGP-Signaturen, die nicht mehr mit einem SSH-Instanzschlüssel geprüft werden, und für die Token-Filter des Bleve-Suchindex.

Vollständige Versionshinweise: https://github.com/go-gitea/gitea/releases/tag/v1.27.3`,
    pl_PL: `Dodaje akcję Konfiguruj dla ustawień Gitea dostępnych w przeciwnym razie tylko w jej pliku konfiguracyjnym, w tym nazwy domyślnej gałęzi nowych repozytoriów i włączenia Gitea Actions.

Aktualizuje Gitea do 1.27.3, wydania zabezpieczeń. Zalecana jest aktualizacja.

- Bezpieczeństwo: osiemnaście poprawek, w tym egzekwowanie zakresów dostępu rejestru pakietów, kontrole dostępu do załączników i znaczników powiązane z repozytorium właściciela, ściślejsze granice zaufania dla żądań scalenia z rozwidleń, ograniczone uprawnienia hooków oraz repozytoria ukrytych właścicieli, które nie są już wymieniane.
- Gitea Actions: surowe podpisy artefaktów są weryfikowane w pierwszej kolejności, wyrażenia \`continue-on-error\` na poziomie kroku pozostają nieobliczone, zadania macierzowe są poprawnie grupowane, macierzowe \`include\`/\`exclude\` niebędące mapowaniem są odrzucane, a kotwice i aliasy YAML są rozwiązywane.
- Żądania scalenia: stan scalenia pozostaje zsynchronizowany z Gitem, dostępne są odnośniki bezpośrednie do recenzji, a domyślne odnośniki porównania wskazują repozytorium źródłowe.
- Poprawki dla przyczepek współautorstwa niebędących poprawnymi adresami e-mail, podpisów OpenPGP, które nie są już weryfikowane kluczem SSH instancji, oraz filtrów tokenów indeksu wyszukiwania Bleve.

Pełne informacje o wydaniu: https://github.com/go-gitea/gitea/releases/tag/v1.27.3`,
    fr_FR: `Ajoute une action Configurer pour les paramètres de Gitea autrement disponibles uniquement dans son fichier de configuration, dont le nom de la branche par défaut des nouveaux dépôts et l'activation de Gitea Actions.

Met à jour Gitea vers 1.27.3, une version de sécurité. La mise à jour est recommandée.

- Sécurité : dix-huit corrections, dont l'application des portées d'accès du registre de paquets, des contrôles d'accès aux pièces jointes et au balisage liés au dépôt propriétaire, des limites de confiance plus strictes pour les demandes de tirage issues de bifurcations, des permissions restreintes pour les hooks et les dépôts des propriétaires masqués qui ne sont plus répertoriés.
- Gitea Actions : les signatures brutes des artefacts sont vérifiées en premier, les expressions \`continue-on-error\` au niveau de l'étape ne sont plus évaluées, les tâches de matrice sont regroupées correctement, les \`include\`/\`exclude\` de matrice qui ne sont pas des mappages sont rejetés et les ancres et alias YAML sont résolus.
- Demandes de tirage : l'état de fusion reste synchronisé avec Git, des liens permanents vers les revues sont disponibles et les liens de comparaison par défaut nomment le dépôt source.
- Corrections des lignes de co-auteur qui ne sont pas des adresses e-mail valides, des signatures OpenPGP qui ne sont plus vérifiées avec une clé SSH de l'instance et des filtres de jetons de l'index de recherche Bleve.

Notes de version complètes : https://github.com/go-gitea/gitea/releases/tag/v1.27.3`,
  },
  migrations: {},
})
