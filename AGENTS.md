# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **This package and `forgejo-startos` are near-identical by design.** Same structure, same actions, same init flow; the differences are the `GITEA__` environment prefix, the upstream image, the MIT license, and riscv64 support. A fix to one almost always belongs in the other — check before assuming it does not.
- **`GITEA__session__COOKIE_NAME` is not cosmetic.** Gitea's default cookie name is generic, and browser cookies are scoped by host rather than by port — so another service on the same StartOS host can overwrite it and 500 the login with a stale value. Don't remove it, and don't let it collide with Forgejo's.
- **`SSH_PORT` must be read back from the binding, never hardcoded.** StartOS assigns the external port; the clone URLs Gitea renders come from this value, so a fixed 22 shows users a port that is not listening.
- **The admin task is raised from a oneshot after `primary`, not from init.** It asks Gitea whether an admin exists, which needs a running instance — that is also why `create-admin` and `reset-admin` are `only-running`. A restored install has an admin already and correctly gets no task.
- **`ROOT_URL` is re-asserted at init when the stored address is no longer published**, so a network change cannot strand every generated link. Keep the check, and keep `.local` as the fallback rather than the preference.
