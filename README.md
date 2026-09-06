# preflight

Shared repo-workflow toolkit, centralizing the checks that were being
reimplemented per-repo: markdown link validation and secret scanning before
publishing to GitHub, Version bumping handled by a CI.

One CLI is the source of truth; CI and the Claude Code plugin are thin
adapters over it, so logic isn't duplicated per surface.

```
├── cli/                    @laarnicayetano/preflight-cli — the source of truth
├── configs/                shared rule files (lychee, gitleaks)
├── .github/workflows/      CI + reusable workflow_call versions
└── plugin/                 Claude Code plugin (check-links, scan-secrets, propose-change skills)
```

## Usage

In a consuming repo:

```
npm install -D @laarnicayetano/preflight-cli   # or npx @laarnicayetano/preflight-cli <cmd>
preflight check-links
preflight scan-secrets
```

Or install the Claude Code plugin for the `check-links`, `scan-secrets`, and
`propose-change` skills. These are proactively invoked from plain language —
no slash command to remember — e.g. "check my links," "scan for secrets,"
or "ship this" (which runs `propose-change`: commits, opens a PR, and runs
both checks first):

```
/plugin marketplace add laarnicayetano/lumenis-repo-preflight
/plugin install preflight@lumenis-repo-preflight
```

## Reusable CI workflows

```yaml
jobs:
  check-links:
    uses: laarnicayetano/lumenis-repo-preflight/.github/workflows/check-links.yml@v1
  scan-secrets:
    uses: laarnicayetano/lumenis-repo-preflight/.github/workflows/scan-secrets.yml@v1

  bump:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    uses: laarnicayetano/lumenis-repo-preflight/.github/workflows/bump-version.yml@v1
    with:
      branch: master
      package-dir: cli   # optional, defaults to "." (repo root)

  publish:
    needs: bump
    if: needs.bump.outputs.tag != ''
    # ...do whatever publishing this repo needs, using needs.bump.outputs.tag
```

`bump-version.yml` only bumps the version, commits, and tags on merge — it
deliberately doesn't publish anywhere, since it's reusable and most
consumers won't want npm (or any other) publishing baked into a generic
bump-and-tag step. It exposes the tag it created (or an empty string, if
`bump:none`/no label meant nothing was bumped) as an output, so a consumer
can add its own `publish` job that runs after and does whatever publishing
it needs.

This repo does exactly that for itself: `.github/workflows/bump-on-merge.yml`
calls `bump-version.yml`, then a local `publish` job (not part of the
reusable workflow) uses its `tag` output to publish `cli/` to npm and
re-point the moving major tag (e.g. `v1`) to the new release. Attach a
`bump:none`/`patch`/`minor`/`major` label to a PR against `master`, and
merging it bumps, tags, and publishes accordingly.

## Open next steps

- [ ] Wire up `cli/` dependencies and test each command against a real repo
- [ ] Register this repo as a plugin marketplace source
- [ ] Migrate first consuming repo (lumenis-web-catalog) off its local copies
