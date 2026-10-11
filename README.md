<p align="center">
  <img src="icon.svg" alt="Gitea Logo" width="21%">
</p>

# Gitea on StartOS

> Everything not listed in this document should behave the same as upstream
> Gitea. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Gitea](https://github.com/go-gitea/gitea) is a self-hosted git forge. On StartOS the installation wizard is skipped, the secret key and root URL are supplied by the package, and git over SSH is published alongside the web interface.

- **Upstream repo:** <https://github.com/go-gitea/gitea>
- **Wrapper repo:** <https://github.com/Start9Labs/gitea-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The upstream image is used unmodified, with its own entrypoint, and one subcontainer runs the whole service.

| Property      | Value                                                          |
| ------------- | -------------------------------------------------------------- |
| Image         | `gitea/gitea`                                                  |
| Architectures | x86_64, aarch64, riscv64                                       |
| Entrypoint    | Upstream default                                               |
| Subcontainer  | `gitea-sub` — the `primary` daemon, and the one to `attach` to |

One oneshot, `admin-user`, runs after the daemon: it asks Gitea whether any admin account exists and raises a task if none does.

## Volume and Data Layout

One volume, holding everything.

| Volume | Mount Point | Purpose                                                               |
| ------ | ----------- | --------------------------------------------------------------------- |
| `main` | `/data`     | Repositories, LFS objects, the application database, and `store.json` |

## File Models

One model, holding the values Gitea's installation wizard would otherwise ask for.

| File         | Format | Modelled                | Written by                           |
| ------------ | ------ | ----------------------- | ------------------------------------ |
| `store.json` | JSON   | Yes — `FileHelper.json` | Install, every init, and the actions |

| Key                                    | Set by                                 | Notes                                                      |
| -------------------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| `GITEA__security__SECRET_KEY`          | Install                                | Generated once; stable for the life of the install         |
| `GITEA__server__ROOT_URL`              | Set Primary URL                        | Your choice; not passed to Gitea as-is (see below)         |
| `GITEA__service__DISABLE_REGISTRATION` | Install, then the Registrations action | Defaults to **true**                                       |
| `smtp`                                 | The Configure SMTP action              | StartOS's system SMTP, your own server, or disabled        |
| `config`                               | The Configure action                   | Gitea's own defaults until changed                         |
| `signing`                              | The Commit Signing action              | Off by default                                             |
| `signingKey`                           | Init, when missing                     | Gitea's GPG key fingerprint and public key; never replaced |

**The stored `GITEA__server__ROOT_URL` is the choice, not what Gitea receives.** On each start the package passes `primaryUrl.bestUsable` (`sdk.setupPrimaryUrl`): the stored URL at its hostname's current port and scheme while that hostname is one of the `http` interface's addresses, and a public domain (HTTPS preferred) or, if none exists, the `.local` address otherwise. The stored choice is never overwritten, so Gitea returns to it when the address comes back. An empty value means nothing has been chosen yet.

The package supplies configuration through environment variables, composed fresh on each start. The upstream entrypoint persists these overrides in `/data/gitea/conf/app.ini`:

| Variable                                                                                                                                | Value                                                  | Why it differs from leaving Gitea alone                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITEA__security__INSTALL_LOCK`                                                                                                         | `true`                                                 | Skips the installation wizard entirely                                                                                                                                                |
| `GITEA__service__DISABLE_REGISTRATION`                                                                                                  | `true` at install                                      | A personal forge should not accept strangers by default                                                                                                                               |
| `GITEA__session__COOKIE_NAME`                                                                                                           | a name unique to this package                          | Gitea's default cookie name is generic, and cookies are host-scoped rather than port-scoped — so a second service on the same LAN host can collide with it and produce a 500 on login |
| `GITEA__server__ROOT_URL`, `SSH_DOMAIN`                                                                                                 | The primary URL in effect, and its hostname            | Links and HTTP and SSH clone URLs name the address you chose                                                                                                                          |
| `GITEA__server__SSH_PORT`                                                                                                               | Read from the published SSH binding                    | The clone URLs Gitea displays have to name the port StartOS actually assigned                                                                                                         |
| `GITEA__server__LFS_START_SERVER`, `GITEA__lfs__PATH`                                                                                   | `true`, a path on the volume                           | Enables the LFS server and keeps its objects with the repositories                                                                                                                    |
| `GITEA__repository__*`, `GITEA__service__*`, `GITEA__server__LANDING_PAGE`, `GITEA__actions__*`, `GITEA__migrations__ALLOWED_HOST_LIST` | From `config` — see [Configure](#configure)            | Always passed, even at Gitea's default, because Gitea writes each into `app.ini` and would otherwise keep a value you later reset                                                     |
| `GITEA__mailer__*`                                                                                                                      | Derived from the SMTP selection                        | Off unless configured                                                                                                                                                                 |
| `GITEA__repository_0X2E_signing__*`                                                                                                     | From `signing` — see [Commit Signing](#commit-signing) | `SIGNING_KEY` is `none` while signing is off, which is also Gitea's behaviour without a key; always passed for the same `app.ini` reason as `config`                                  |

## Dependencies

None. Gitea Runner depends on Gitea, not the other way round.

## Network Access and Interfaces

Two interfaces, both on one host.

| Interface             | Id     | Type | Port | Description                          |
| --------------------- | ------ | ---- | ---- | ------------------------------------ |
| Web UI and git (HTTP) | `http` | ui   | 3000 | The web interface, and git over HTTP |
| git (SSH)             | `ssh`  | api  | 22   | Git over SSH, as the `git` user      |

The SSH interface's external port is assigned by StartOS rather than fixed, which is why the package reads it back and hands it to Gitea — otherwise the clone URLs shown in the UI would name the wrong port.

**Open UI opens the primary URL** — the `http` interface nominates it — falling back to StartOS's usual choice when it is not one of the interface's addresses.

## Installation and First-Run Flow

Gitea's installation wizard never appears: install generates the secret key and locks the installer. No primary URL is chosen yet, so Gitea uses a public domain if available, otherwise the `.local` address, and a task asks for a choice.

That leaves one thing outstanding, and the package checks for it rather than assuming. Once the service is running, a oneshot asks Gitea whether any admin account exists; if none does, it raises a task pointing at Create Admin User. On a restored install the account already exists and no task appears.

Since registrations are disabled at install, creating that first admin through the action is the intended path rather than signing up through the web UI.

## Actions

Seven actions. Create Admin User is hidden from the action list and runs through its task.

### Create Admin User

Creates the first administrator. Run it when the install task prompts.

- **What it changes:** adds an admin account in Gitea's database.
- **Availability:** only while the service is running, because it goes through Gitea's own CLI against a live instance.
- **Repeat safety:** safe to re-run to add another admin; it does not replace an existing one.

### Reset Admin Password

Generates a new password for an existing admin account. Run it when locked out.

- **What it changes:** that account's password.
- **Input:** the admin account, from Gitea's list of admins; nothing is preselected.
- **Availability:** only while running.
- **Repeat safety:** safe to re-run; each run generates a fresh password and invalidates the previous one.

### Set Primary URL

Chooses which published address Gitea treats as its own — the base for clone URLs, links, and outbound email, and the address Open UI opens. Built by `sdk.setupPrimaryUrl`; with no valid stored choice, the select prefers a public domain (HTTPS first), otherwise the `.local` address.

- **What it changes:** `GITEA__server__ROOT_URL` in `store.json`, which becomes Gitea's `ROOT_URL` and `SSH_DOMAIN` while it is one of the interface's addresses.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent. Clone URLs already copied into someone's git remote keep pointing at the old address.
- **Input:** a dropdown of the interface's published addresses.

### Registrations

Toggles open sign-ups. The action describes what running it will do rather than presenting a form.

- **What it changes:** `GITEA__service__DISABLE_REGISTRATION` in `store.json`.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent in both directions; existing accounts are unaffected, and administrators can still create accounts from Site Administration while registrations are off. Both directions ask for confirmation.

### Configure

Sets Gitea options that upstream exposes only in `app.ini`, not in its admin panel. Every field defaults to Gitea's own default.

| Field                                   | `app.ini` key                                 | Default  |
| --------------------------------------- | --------------------------------------------- | -------- |
| Default Branch                          | `[repository] DEFAULT_BRANCH`                 | `main`   |
| Default Repository Visibility           | `[repository] DEFAULT_PRIVATE`                | `last`   |
| Push to Create (Users)                  | `[repository] ENABLE_PUSH_CREATE_USER`        | off      |
| Push to Create (Organizations)          | `[repository] ENABLE_PUSH_CREATE_ORG`         | off      |
| Require Sign-in to View                 | `[service] REQUIRE_SIGNIN_VIEW`               | off      |
| Keep Email Private by Default           | `[service] DEFAULT_KEEP_EMAIL_PRIVATE`        | off      |
| Allow Creating Organizations by Default | `[service] DEFAULT_ALLOW_CREATE_ORGANIZATION` | on       |
| Default User Visibility                 | `[service] DEFAULT_USER_VISIBILITY`           | `public` |
| Landing Page                            | `[server] LANDING_PAGE`                       | `home`   |
| Enable Actions                          | `[actions] ENABLED`                           | on       |
| Actions Run Retention                   | `[actions] RUN_RETENTION_DAYS`                | 400 days |
| Allowed Migration and Mirror Hosts      | `[migrations] ALLOWED_HOST_LIST`              | empty    |

Run retention deletes completed runs by creation date, including their jobs, logs, and artifacts. Setting it to 0 keeps run records indefinitely; independent log and artifact cleanup still applies. Gitea's cleanup task runs at midnight by default. On an upgrade, Configure can be run while stopped before starting Gitea and its cleanup scheduler.

The host list accepts comma-separated upstream host rules. Imports and mirrors to private addresses require an IP/CIDR allowance, such as `192.168.1.10:443`; a hostname alone does not authorize the private IP it resolves to. Prefer a narrow IP and port over `private:*`, which grants every permitted importer access to the private network. An empty value uses Gitea's default policy (including its compatibility handling of legacy migration settings). Gitea reports rejected rules in its startup logs.

- **What it changes:** `config` in `store.json`, passed to Gitea as `GITEA__<section>__<KEY>` on the next start.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent; the form is pre-filled. The "default" settings apply only to repositories and accounts created afterwards.
- **Dependents:** Gitea Runner raises a critical task on this action whenever Enable Actions is off.

### Configure SMTP

Sets up outbound email for notifications, password resets, and verification.

- **What it changes:** `smtp` in `store.json`; the credentials become Gitea's mailer environment on the next start.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent; the form is pre-filled.
- **Options:** StartOS's system SMTP, your own server, or disabled — which sets the mailer off rather than leaving stale credentials in place.

### Commit Signing

Has Gitea sign the commits it creates itself — pull request merges, and optionally web edits — so a branch protected by "require signed commits" can accept merges from the web UI. Without a signing key Gitea refuses every such merge.

- **The key:** init generates an ed25519 GPG key once, in the keyring Gitea reads (`/data/gitea/home/.gnupg`), and records its fingerprint and public key in `store.json`. Turning signing off keeps the key, so turning it back on keeps the same signer.
- **What it changes:** `signing` in `store.json`, passed as `GITEA__repository_0X2E_signing__*` on the next start.
- **Options:** signer name and email (the identity Gitea displays for its signing key, not a committer override under the default trust model); which merges to sign — always, only approved pull requests (default), only when the base branch is signed, or only when every pull request commit is signed; and whether to sign web edits.
- **Result:** the armored public key, copyable and downloadable as `gitea-signing-key.asc`, for adding wherever Gitea's signatures need to verify.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent; the form is pre-filled.

## Tasks

Two tasks, each raised by a check rather than unconditionally.

| Task              | Severity    | Raised when                                                          | Cleared when                                    |
| ----------------- | ----------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| Create Admin User | `important` | The service is running and Gitea reports no admin account            | The action runs                                 |
| Set Primary URL   | `important` | No primary URL is chosen, or the chosen one is not an `http` address | An address is chosen, or the chosen one returns |

Both are `important` rather than `critical`. Without a primary URL Gitea runs on a public domain if available, otherwise its `.local` address, and an admin-less Gitea still starts and serves, so blocking it would be worse than prompting. The check runs after the daemon is up, which is why the task appears a moment after a fresh install rather than at install time.

## Health Checks

One check, on the primary daemon.

| Check                     | Method                                  | Grace Period |
| ------------------------- | --------------------------------------- | ------------ |
| `primary` "Web Interface" | HTTP `GET /api/healthz` over the bridge | 120 seconds  |

It probes Gitea's own health endpoint through the service bridge using `curl --fail` with a five-second timeout. Gitea returns HTTP 200 when its database and cache checks pass and HTTP 424 when they fail; the latter fails readiness. Check the Gitea logs for database or cache errors if the check stays unhealthy. The two-minute grace covers a first start, where the database is created and migrated before anything binds. Until the bridge address resolves the check reports `starting` rather than failing.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. No dump step and nothing excluded.

- **Included:** every repository and its LFS objects, the database with accounts and settings, and `store.json` with the secret key, root URL, SMTP settings, Configure settings, and signing settings. The signing keyring travels with the volume, so a restored server signs with the same key.
- **Upgrades:** Gitea migrates its SQLite database on first start, including repairs to legacy team permissions. Package downgrades across this schema upgrade are blocked; recovery to an older release requires a pre-update backup.
- **Restore:** complete. Because the secret key travels with the backup, stored credentials and tokens keep working, and no admin task is raised since the account already exists. If the restored server does not publish the address the backup recorded, Gitea uses a public domain if available, otherwise the `.local` address, and the Set Primary URL task is raised — check [Set Primary URL](#set-primary-url) before handing out clone URLs.

## Limitations and Differences

1. **The installation wizard is skipped**, and the secret key is generated by the package rather than chosen.
2. **Registrations are disabled at install**; the first admin is created through an action.
3. **The SSH port is assigned by StartOS**, not fixed at 22 externally, and Gitea is told what it is so clone URLs are correct.
4. **The session cookie is renamed** to avoid a collision with other services on the same host.
5. **While the chosen primary URL is not published, Gitea uses a public domain if available, otherwise its `.local` address** for newly generated links, and a task asks for another choice.

---

## Quick Reference for AI Consumers

```yaml
package_id: gitea
image: gitea/gitea
architectures:
  - x86_64
  - aarch64
  - riscv64
subcontainers:
  - gitea-sub
volumes:
  main: /data
file_models:
  - store.json
startos_managed_env_vars:
  - GITEA__server__ROOT_URL
  - GITEA__server__SSH_DOMAIN
  - GITEA__server__SSH_PORT
  - GITEA__security__INSTALL_LOCK
  - GITEA__security__SECRET_KEY
  - GITEA__service__DISABLE_REGISTRATION
  - GITEA__session__COOKIE_NAME
  - GITEA__lfs__PATH
  - GITEA__server__LFS_START_SERVER
  - GITEA__repository__DEFAULT_BRANCH
  - GITEA__repository__DEFAULT_PRIVATE
  - GITEA__repository__ENABLE_PUSH_CREATE_USER
  - GITEA__repository__ENABLE_PUSH_CREATE_ORG
  - GITEA__service__REQUIRE_SIGNIN_VIEW
  - GITEA__service__DEFAULT_KEEP_EMAIL_PRIVATE
  - GITEA__service__DEFAULT_ALLOW_CREATE_ORGANIZATION
  - GITEA__service__DEFAULT_USER_VISIBILITY
  - GITEA__server__LANDING_PAGE
  - GITEA__actions__ENABLED
  - GITEA__actions__RUN_RETENTION_DAYS
  - GITEA__migrations__ALLOWED_HOST_LIST
  - GITEA__mailer__ENABLED
  - GITEA__mailer__PROTOCOL # when SMTP is configured
  - GITEA__mailer__SMTP_ADDR # when SMTP is configured
  - GITEA__mailer__SMTP_PORT # when SMTP is configured
  - GITEA__mailer__FROM # when SMTP is configured
  - GITEA__mailer__USER # when SMTP is configured
  - GITEA__mailer__PASSWD # when SMTP is configured
  - GITEA__repository_0X2E_signing__SIGNING_KEY # none while signing is off
  - GITEA__repository_0X2E_signing__SIGNING_NAME
  - GITEA__repository_0X2E_signing__SIGNING_EMAIL
  - GITEA__repository_0X2E_signing__MERGES
  - GITEA__repository_0X2E_signing__CRUD_ACTIONS
dependencies: []
interfaces:
  http: { type: ui, port: 3000 }
  ssh: { type: api, port: 22 } # external port assigned by StartOS
actions:
  - create-admin # only-running
  - reset-admin # only-running
  - set-primary-url
  - registrations
  - configure
  - manage-smtp # displayed "Configure SMTP"
  - commit-signing
tasks:
  - { action: create-admin, severity: important }
  - { action: set-primary-url, severity: important } # while unset or unpublished
health_checks:
  - primary # the daemon's ready check, displayed "Web Interface"
```
