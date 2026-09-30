import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '28.0.0:0',
  releaseNotes: {
    en_US: `Updated Gitea to 28.0.0.

**Upgrade precautions**

- Back up before updating. Gitea upgrades its database on first start; returning to an older version requires restoring a pre-update backup.
- Completed Actions runs older than 400 days are automatically deleted, including their jobs, logs, and artifacts. The Configure action now exposes Actions Run Retention; set it to 0 before starting the upgraded service to keep run history indefinitely. Logs and artifacts retain their separate retention policies.
- Git imports and mirrors use Gitea's egress policy. For private destinations, use Allowed Migration and Mirror Hosts in Configure to allow trusted IPs or CIDRs and ports.

**Features and fixes**

- Adds bot account management, deploy tokens, token regeneration, and richer Actions workflow management.
- Includes security fixes for Git pushes, SSH authentication, repository permissions, and fork workflow approval gates.
- Enables the Git LFS server with objects stored on the managed volume.
- The readiness check now rejects unhealthy HTTP responses from Gitea's health endpoint.

Full release notes: https://github.com/go-gitea/gitea/releases/tag/v28.0.0`,
    es_ES: `Actualiza Gitea a 28.0.0.

**Precauciones para la actualización**

- Haz una copia de seguridad antes de actualizar. Gitea actualiza su base de datos en el primer inicio; volver a una versión anterior requiere restaurar una copia previa a la actualización.
- Las ejecuciones completadas de Actions con más de 400 días se eliminan automáticamente, incluidos sus trabajos, registros y artefactos. La acción Configurar ahora ofrece la retención de ejecuciones de Actions; ponla en 0 antes de iniciar el servicio actualizado para conservar el historial indefinidamente. Los registros y los artefactos mantienen sus políticas de retención independientes.
- Las importaciones y los espejos de Git usan la política de salida de Gitea. Para destinos privados, usa los hosts permitidos para importaciones y espejos en Configurar para permitir IP o CIDR y puertos de confianza.

**Funciones y correcciones**

- Añade gestión de cuentas bot, tokens de despliegue, regeneración de tokens y una gestión más completa de los flujos de Actions.
- Incluye correcciones de seguridad para envíos de Git, autenticación SSH, permisos de repositorios y aprobación de flujos desde bifurcaciones.
- Activa el servidor Git LFS con los objetos almacenados en el volumen administrado.
- La comprobación de disponibilidad ahora rechaza las respuestas HTTP que indican un fallo en el punto de salud de Gitea.

Notas de la versión completas: https://github.com/go-gitea/gitea/releases/tag/v28.0.0`,
    de_DE: `Aktualisiert Gitea auf 28.0.0.

**Vorsichtsmaßnahmen beim Update**

- Vor dem Update ein Backup erstellen. Gitea aktualisiert die Datenbank beim ersten Start; die Rückkehr zu einer älteren Version erfordert die Wiederherstellung eines Backups von vor dem Update.
- Abgeschlossene Actions-Läufe, die älter als 400 Tage sind, werden automatisch samt Jobs, Logs und Artefakten gelöscht. Die Aktion Konfigurieren bietet jetzt die Aufbewahrung von Actions-Läufen an; vor dem Start des aktualisierten Dienstes auf 0 setzen, um den Verlauf unbegrenzt aufzubewahren. Logs und Artefakte behalten ihre eigenen Aufbewahrungsregeln.
- Git-Importe und -Spiegel verwenden Giteas Richtlinie für ausgehende Verbindungen. Für private Ziele in Konfigurieren unter den erlaubten Hosts für Importe und Spiegel vertrauenswürdige IPs oder CIDRs und Ports freigeben.

**Funktionen und Korrekturen**

- Fügt die Verwaltung von Bot-Konten, Deployment-Tokens, Token-Neugenerierung und erweiterte Actions-Workflow-Verwaltung hinzu.
- Enthält Sicherheitskorrekturen für Git-Pushes, SSH-Authentifizierung, Repository-Berechtigungen und Freigaben für Fork-Workflows.
- Aktiviert den Git-LFS-Server mit Objekten auf dem verwalteten Volume.
- Die Bereitschaftsprüfung lehnt jetzt HTTP-Antworten ab, die einen Fehler am Gitea-Gesundheitsendpunkt anzeigen.

Vollständige Versionshinweise: https://github.com/go-gitea/gitea/releases/tag/v28.0.0`,
    pl_PL: `Aktualizuje Gitea do 28.0.0.

**Środki ostrożności przy aktualizacji**

- Wykonaj kopię zapasową przed aktualizacją. Gitea aktualizuje bazę danych przy pierwszym uruchomieniu; powrót do starszej wersji wymaga przywrócenia kopii sprzed aktualizacji.
- Zakończone uruchomienia Actions starsze niż 400 dni są automatycznie usuwane wraz z zadaniami, logami i artefaktami. Akcja Konfiguruj udostępnia teraz okres przechowywania uruchomień Actions; ustaw 0 przed uruchomieniem zaktualizowanej usługi, aby zachować historię bezterminowo. Logi i artefakty zachowują odrębne zasady przechowywania.
- Importy i kopie lustrzane Git korzystają z polityki połączeń wychodzących Gitea. Dla prywatnych adresów użyj dozwolonych hostów importów i kopii lustrzanych w akcji Konfiguruj, aby zezwolić na zaufane IP lub CIDR i porty.

**Funkcje i poprawki**

- Dodaje zarządzanie kontami botów, tokeny wdrożeniowe, ponowne generowanie tokenów i rozszerzone zarządzanie przepływami Actions.
- Zawiera poprawki bezpieczeństwa wypychania Git, uwierzytelniania SSH, uprawnień repozytoriów i zatwierdzania przepływów z rozwidleń.
- Włącza serwer Git LFS z obiektami przechowywanymi na zarządzanym woluminie.
- Kontrola gotowości odrzuca teraz odpowiedzi HTTP sygnalizujące błąd w punkcie kontroli stanu Gitea.

Pełne informacje o wydaniu: https://github.com/go-gitea/gitea/releases/tag/v28.0.0`,
    fr_FR: `Met à jour Gitea vers 28.0.0.

**Précautions pour la mise à jour**

- Faites une sauvegarde avant la mise à jour. Gitea met à niveau sa base de données au premier démarrage ; revenir à une version antérieure nécessite de restaurer une sauvegarde réalisée avant la mise à jour.
- Les exécutions Actions terminées depuis plus de 400 jours sont automatiquement supprimées avec leurs tâches, journaux et artefacts. L'action Configurer propose maintenant la conservation des exécutions Actions ; indiquez 0 avant de démarrer le service mis à jour pour conserver l'historique indéfiniment. Les journaux et artefacts gardent leurs règles de conservation distinctes.
- Les imports et miroirs Git utilisent la politique de connexions sortantes de Gitea. Pour les destinations privées, utilisez les hôtes autorisés pour les imports et les miroirs dans Configurer afin d'autoriser des IP ou CIDR et ports de confiance.

**Fonctionnalités et correctifs**

- Ajoute la gestion des comptes bots, les jetons de déploiement, la régénération des jetons et une gestion enrichie des workflows Actions.
- Inclut des correctifs de sécurité pour les pushes Git, l'authentification SSH, les permissions des dépôts et l'approbation des workflows issus de forks.
- Active le serveur Git LFS avec les objets stockés sur le volume géré.
- Le contrôle de disponibilité rejette maintenant les réponses HTTP signalant un échec au point de contrôle de santé de Gitea.

Notes de version complètes : https://github.com/go-gitea/gitea/releases/tag/v28.0.0`,
  },
  migrations: {
    down: IMPOSSIBLE,
  },
})
