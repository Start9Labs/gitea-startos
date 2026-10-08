import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.0.0:2',
  releaseNotes: {
    en_US: `Adds a Commit Signing action. When enabled, Gitea signs pull request merges, and optionally web edits, with its own key, so branches that require signed commits can accept merges. It is off by default, and the action shows the public key to trust.

- Open UI opens Gitea at its primary URL.
- A task asks you to choose the primary URL while none is chosen, or while the chosen one is not one of Gitea's addresses. Until then Gitea uses its public domain if it has one, otherwise its .local address, and it returns to your choice when that address comes back.
- Disable Registrations asks for confirmation before running.
- Reset Admin Password no longer preselects an administrator.
- Commit Signing shows Gitea's public key with its line breaks, and offers it as a file to download.
- The Default Repository Visibility, Default User Visibility, Landing Page and Sign Merges options explain each choice.`,
    es_ES: `Añade la acción Firma de commits. Al activarla, Gitea firma las fusiones de pull requests, y opcionalmente las ediciones web, con su propia clave, para que las ramas que exigen commits firmados puedan aceptar fusiones. Está desactivada por defecto y la acción muestra la clave pública en la que confiar.

- Abrir interfaz abre Gitea en su URL principal.
- Una tarea le pide elegir la URL principal mientras no haya ninguna elegida, o mientras la elegida no sea una de las direcciones de Gitea. Hasta entonces Gitea usa su dominio público si tiene uno o, si no, su dirección .local, y vuelve a su elección cuando esa dirección regresa.
- Deshabilitar registros pide confirmación antes de ejecutarse.
- Restablecer contraseña de administrador ya no preselecciona ningún administrador.
- Firma de commits muestra la clave pública de Gitea con sus saltos de línea y la ofrece como archivo para descargar.
- Las opciones Visibilidad predeterminada de los repositorios, Visibilidad predeterminada de los usuarios, Página de inicio y Firmar fusiones explican cada alternativa.`,
    de_DE: `Fügt die Aktion Commit-Signierung hinzu. Ist sie aktiviert, signiert Gitea Pull-Request-Merges und optional Web-Bearbeitungen mit einem eigenen Schlüssel, sodass Branches, die signierte Commits verlangen, Merges annehmen können. Sie ist standardmäßig aus, und die Aktion zeigt den öffentlichen Schlüssel, dem vertraut werden muss.

- „Oberfläche öffnen“ öffnet Gitea unter seiner primären URL.
- Eine Aufgabe fordert Sie auf, die primäre URL zu wählen, solange keine gewählt ist oder die gewählte keine Adresse von Gitea ist. Bis dahin verwendet Gitea seine öffentliche Domain, falls vorhanden, sonst seine .local-Adresse, und kehrt zu Ihrer Wahl zurück, sobald diese Adresse wieder verfügbar ist.
- „Registrierungen deaktivieren“ fragt vor der Ausführung nach einer Bestätigung.
- „Admin-Passwort zurücksetzen“ wählt keinen Administrator mehr vor.
- „Commit-Signierung“ zeigt den öffentlichen Schlüssel von Gitea mit seinen Zeilenumbrüchen und bietet ihn als Datei zum Herunterladen an.
- Die Optionen „Standard-Sichtbarkeit von Repositories“, „Standard-Sichtbarkeit von Benutzern“, „Einstiegsseite“ und „Merges signieren“ erklären jede Auswahl.`,
    pl_PL: `Dodaje akcję Podpisywanie commitów. Po włączeniu Gitea podpisuje scalenia pull requestów, a opcjonalnie także edycje w przeglądarce, własnym kluczem, dzięki czemu gałęzie wymagające podpisanych commitów mogą przyjmować scalenia. Domyślnie jest wyłączona, a akcja pokazuje klucz publiczny, któremu należy zaufać.

- „Otwórz interfejs” otwiera Gitea pod jego głównym URL.
- Zadanie prosi o wybranie głównego URL, dopóki żaden nie jest wybrany lub wybrany nie jest jednym z adresów Gitea. Do tego czasu Gitea używa swojej domeny publicznej, jeśli ją ma, a w przeciwnym razie adresu .local, i wraca do Twojego wyboru, gdy ten adres znów jest dostępny.
- „Wyłącz rejestracje” prosi o potwierdzenie przed uruchomieniem.
- „Zresetuj hasło administratora” nie wybiera już wstępnie żadnego administratora.
- „Podpisywanie commitów” pokazuje klucz publiczny Gitea z podziałem na wiersze i udostępnia go jako plik do pobrania.
- Opcje „Domyślna widoczność repozytoriów”, „Domyślna widoczność użytkowników”, „Strona startowa” i „Podpisuj scalenia” objaśniają każdy wybór.`,
    fr_FR: `Ajoute l'action Signature des commits. Une fois activée, Gitea signe les fusions de pull requests, et en option les modifications web, avec sa propre clé, pour que les branches qui exigent des commits signés puissent accepter les fusions. Elle est désactivée par défaut et l'action affiche la clé publique à approuver.

- Ouvrir l'interface ouvre Gitea sur son URL principale.
- Une tâche vous demande de choisir l'URL principale tant qu'aucune n'est choisie, ou tant que celle choisie n'est pas l'une des adresses de Gitea. En attendant, Gitea utilise son domaine public s'il en a un, sinon son adresse .local, et revient à votre choix dès que cette adresse est de nouveau disponible.
- Désactiver les inscriptions demande une confirmation avant de s'exécuter.
- Réinitialiser le mot de passe administrateur ne présélectionne plus d'administrateur.
- Signature des commits affiche la clé publique de Gitea avec ses retours à la ligne et la propose en téléchargement sous forme de fichier.
- Les options Visibilité par défaut des dépôts, Visibilité par défaut des utilisateurs, Page d'accueil et Signer les fusions expliquent chaque choix.`,
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
