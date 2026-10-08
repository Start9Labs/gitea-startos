# Gitea

## Documentation

- [Gitea documentation](https://gitea.com/gitea/docs) — upstream reference covering repositories, organizations, the admin panel, Gitea Actions, the API, and `app.ini` settings.

## What you get on StartOS

- A **Web UI and git (HTTP)** interface — the Gitea web app, and the endpoint for cloning, pushing, and pulling over HTTP.
- A **git (SSH)** interface (user `git`) for cloning, pushing, and pulling over SSH.
- An embedded SQLite database stored alongside repositories and LFS objects in a single managed volume — no separate database to install or configure.

## Getting set up

On first start Gitea posts a **Create Admin User** task. Until you complete it, the service has no administrator. It also posts a **Set Primary URL** task; until you choose, Gitea uses its `.local` address.

1. Start Gitea and wait for the **Create Admin User** task.
2. Run the **Create Admin User** task. Provide a username and email. A strong password is generated and shown once — copy it before dismissing the result. If you lose it later, run **Reset Admin Password**.
3. Sign in to the Web UI with those credentials.
4. Run the **Set Primary URL** task and pick the address you want clone URLs and links to use.
5. If you plan to send emails (notifications, invitations, password resets), run **Configure SMTP** and pick either your StartOS system SMTP or custom credentials.

## Using Gitea

### Web UI and git over HTTP

Open the **Web UI and git (HTTP)** interface to reach the Gitea web app. The same hostnames serve git over HTTP, so you can clone, push, and pull using the URLs Gitea shows on each repository page.

### git over SSH

Open the **git (SSH)** interface to see the SSH host and port. Add your SSH public key under your Gitea user settings, then use the `git@…` URLs Gitea generates on each repository page.

### Actions

- **Set Primary URL** — pick which of the available HTTP URLs Gitea uses when generating clone URLs, links in emails, OAuth callbacks, and so on, and which one **Open UI** opens. Its hostname is also the host in the SSH clone URLs. Switch this whenever you add or change a domain you want users to see. If the chosen address stops being available, Gitea uses its `.local` address until it returns, and a task asks you to choose again.
- **Enable / Disable Registrations** — toggle whether anyone with your Gitea URL can create an account. Registrations are disabled by default; the action asks for confirmation in both directions, and warns that enabling them lets anyone sign up.
- **Configure** — set Gitea options that otherwise live only in its configuration file: the default branch name and visibility for new repositories, push-to-create, whether visitors must sign in to see anything, defaults for new accounts, the landing page, whether Gitea Actions is enabled (Gitea Runner requires it), workflow run retention, and trusted import/mirror destinations. Changes to defaults apply only to repositories and accounts created afterwards.
- **Configure SMTP** — set the credentials Gitea uses to send mail. Choose your StartOS system SMTP or supply a custom host, port, from-address, username, and password.
- **Commit Signing** — have Gitea sign pull request merges, and optionally web edits, with its own key. Turn this on if you protect a branch with "require signed commits"; without it Gitea cannot merge pull requests into that branch. The action shows Gitea's public key, which you can add wherever those signatures need to verify.
- **Reset Admin Password** — pick an existing admin user (none is preselected) and generate a new password for them; their current password stops working. Use this to rotate the password or to recover an account whose password you've lost.

### Workflow history and private mirrors

**Actions Run Retention** in Configure defaults to 400 days. Gitea automatically deletes older completed runs and their jobs, logs, and artifacts. Set it to 0 to keep run history indefinitely; logs and artifacts still follow their separate retention policies. Back up before shortening retention. When upgrading an existing installation, stop Gitea before updating and set retention in Configure before starting it again.

For imports or mirrors from a private server, use **Allowed Migration and Mirror Hosts** in Configure. Enter trusted IPs or CIDRs with ports, separated by commas, such as `192.168.1.10:443`. A hostname alone does not permit its private IP address. Allow only the specific destinations your users need; these allowances apply to everyone permitted to import repositories.

### Updates and recovery

Back up before updating. Gitea upgrades its database on first start. To return to an older release, restore a backup made before the update.

### Large file storage

Git LFS is enabled and stored alongside your repositories in the managed volume. Enable LFS per repository in its settings; use the Git LFS client on the pushing machine as you would with upstream Gitea.
