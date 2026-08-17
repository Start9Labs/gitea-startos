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

| Key                                    | Set by                                 | Notes                                                           |
| -------------------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| `GITEA__security__SECRET_KEY`          | Install                                | Generated once; stable for the life of the install              |
| `GITEA__server__ROOT_URL`              | Init, then Set Primary URL             | Re-asserted by init if the stored address stops being published |
| `GITEA__service__DISABLE_REGISTRATION` | Install, then the Registrations action | Defaults to **true**                                            |
| `smtp`                                 | The Configure SMTP action              | StartOS's system SMTP, your own server, or disabled             |

`ROOT_URL` is the one value the package re-asserts rather than leaving alone: init compares it against the addresses currently published for the interface and falls back to the `.local` one when the stored address has gone away. An address you chose is kept for as long as it stays reachable.

**No configuration file reaches the application.** Gitea is configured entirely by environment, composed fresh on each start, and that is where this package's overrides live:

| Variable                                | Value                                  | Why it differs from leaving Gitea alone                                                                                                                                               |
| --------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GITEA__security__INSTALL_LOCK`         | `true`                                 | Skips the installation wizard entirely                                                                                                                                                |
| `GITEA__service__DISABLE_REGISTRATION`  | `true` at install                      | A personal forge should not accept strangers by default                                                                                                                               |
| `GITEA__session__COOKIE_NAME`           | a name unique to this package          | Gitea's default cookie name is generic, and cookies are host-scoped rather than port-scoped — so a second service on the same LAN host can collide with it and produce a 500 on login |
| `GITEA__server__SSH_DOMAIN`, `SSH_PORT` | Derived from the published SSH binding | The clone URLs Gitea displays have to name the port StartOS actually assigned                                                                                                         |
| `GITEA__lfs__PATH`                      | A path on the volume                   | Keeps LFS objects with the repositories                                                                                                                                               |
| `GITEA__mailer__*`                      | Derived from the SMTP selection        | Off unless configured                                                                                                                                                                 |

## Dependencies

None. Gitea Runner depends on Gitea, not the other way round.

## Network Access and Interfaces

Two interfaces, both on one host.

| Interface             | Id     | Type | Port | Description                          |
| --------------------- | ------ | ---- | ---- | ------------------------------------ |
| Web UI and git (HTTP) | `http` | ui   | 3000 | The web interface, and git over HTTP |
| git (SSH)             | `ssh`  | api  | 22   | Git over SSH, as the `git` user      |

The SSH interface's external port is assigned by StartOS rather than fixed, which is why the package reads it back and hands it to Gitea — otherwise the clone URLs shown in the UI would name the wrong port.

## Installation and First-Run Flow

Gitea's installation wizard never appears: install generates the secret key, locks the installer, and chooses a root URL from the interface's published addresses, preferring the `.local` one.

That leaves one thing outstanding, and the package checks for it rather than assuming. Once the service is running, a oneshot asks Gitea whether any admin account exists; if none does, it raises a task pointing at Create Admin User. On a restored install the account already exists and no task appears.

Since registrations are disabled at install, creating that first admin through the action is the intended path rather than signing up through the web UI.

## Actions

Five actions, all user-facing.

### Create Admin User

Creates the first administrator. Run it when the install task prompts.

- **What it changes:** adds an admin account in Gitea's database.
- **Availability:** only while the service is running, because it goes through Gitea's own CLI against a live instance.
- **Repeat safety:** safe to re-run to add another admin; it does not replace an existing one.

### Reset Admin Password

Generates a new password for an existing admin account. Run it when locked out.

- **What it changes:** that account's password.
- **Availability:** only while running.
- **Repeat safety:** safe to re-run; each run generates a fresh password and invalidates the previous one.

### Set Primary URL

Chooses which published address Gitea treats as its own — the base for clone URLs, links, and outbound email.

- **What it changes:** `GITEA__server__ROOT_URL` in `store.json`, and with it the SSH domain derived from it.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent. Clone URLs already copied into someone's git remote keep pointing at the old address.
- **Input:** a dropdown of the interface's non-local addresses, so an unreachable URL cannot be chosen.

### Registrations

Toggles open sign-ups. The action describes what running it will do rather than presenting a form.

- **What it changes:** `GITEA__service__DISABLE_REGISTRATION` in `store.json`.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent in both directions; existing accounts are unaffected.

### Configure SMTP

Sets up outbound email for notifications, password resets, and verification.

- **What it changes:** `smtp` in `store.json`; the credentials become Gitea's mailer environment on the next start.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent; the form is pre-filled.
- **Options:** StartOS's system SMTP, your own server, or disabled — which sets the mailer off rather than leaving stale credentials in place.

## Tasks

One task, and it is raised by a check rather than unconditionally.

| Task              | Severity    | Raised when                                               | Cleared when    |
| ----------------- | ----------- | --------------------------------------------------------- | --------------- |
| Create Admin User | `important` | The service is running and Gitea reports no admin account | The action runs |

`important` rather than `critical`: an admin-less Gitea still starts and serves, so blocking it would be worse than prompting. The check runs after the daemon is up, which is why the task appears a moment after a fresh install rather than at install time.

## Health Checks

One check, on the primary daemon.

| Check                     | Method                                  | Grace Period |
| ------------------------- | --------------------------------------- | ------------ |
| `primary` "Web Interface" | HTTP `GET /api/healthz` over the bridge | 120 seconds  |

It probes Gitea's own health endpoint through the service bridge rather than only the port, so a pass means the application is serving. The two-minute grace covers a first start, where the database is created and migrated before anything binds. Until the bridge address resolves the check reports `starting` rather than failing.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. No dump step and nothing excluded.

- **Included:** every repository and its LFS objects, the database with accounts and settings, and `store.json` with the secret key, root URL, and SMTP settings.
- **Restore:** complete. Because the secret key travels with the backup, stored credentials and tokens keep working, and no admin task is raised since the account already exists. If the restored server does not publish the address the backup recorded, init picks a local one — check [Set Primary URL](#actions) before handing out clone URLs.

## Limitations and Differences

1. **The installation wizard is skipped**, and the secret key is generated by the package rather than chosen.
2. **Registrations are disabled at install**; the first admin is created through an action.
3. **The SSH port is assigned by StartOS**, not fixed at 22 externally, and Gitea is told what it is so clone URLs are correct.
4. **The session cookie is renamed** to avoid a collision with other services on the same host.
5. **The root URL is re-asserted when the recorded address stops being published**, so a network change can move the base of newly-generated links.

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
  - GITEA__mailer__ENABLED
  - GITEA__mailer__PROTOCOL # when SMTP is configured
  - GITEA__mailer__SMTP_ADDR # when SMTP is configured
  - GITEA__mailer__SMTP_PORT # when SMTP is configured
  - GITEA__mailer__FROM # when SMTP is configured
  - GITEA__mailer__USER # when SMTP is configured
  - GITEA__mailer__PASSWD # when SMTP is configured
dependencies: []
interfaces:
  http: { type: ui, port: 3000 }
  ssh: { type: api, port: 22 } # external port assigned by StartOS
actions:
  - create-admin # only-running
  - reset-admin # only-running
  - set-primary-url
  - registrations
  - manage-smtp
tasks:
  - { action: create-admin, severity: important }
health_checks:
  - primary # the daemon's ready check, displayed "Web Interface"
```
