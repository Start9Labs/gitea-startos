# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `gitea`.** Both the `http` (web UI + git-over-HTTP) and `ssh` (git-over-SSH) interfaces bind on the single `main` host — look them up by their interface id after fetching that host.
- **`gitea-runner` is a dependent** and imports `mainHostId` / `httpInterfaceId` from `startos/utils.ts` to resolve Gitea's HTTP interface over the bridge. Treat those exported ids as a small API: if you rename one, update the runner in the same change.

## Inspecting a running install

To run a command inside the service's container (read config, tail logs), use `start-cli package attach gitea -n gitea-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `gitea-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name.
