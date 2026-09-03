# preflight

Shared repo-workflow toolkit, centralizing the checks that were being
reimplemented per-repo: markdown link validation and secret scanning before
publishing to GitHub, Version bumping handled by a CI.

One CLI is the source of truth; CI and the Claude Code plugin are thin
adapters over it, so logic isn't duplicated per surface.

```
├── cli/                    @lumenis/preflight-cli — the source of truth
├── configs/                shared rule files (lychee, gitleaks)
├── .github/workflows/      CI + reusable workflow_call versions + release
└── plugin/                 Claude Code plugin (slash commands + propose-change skill)
```

## Usage

In a consuming repo:

```
npm install -D @lumenis/preflight-cli   # or npx @lumenis/preflight-cli <cmd>
preflight check-links
preflight scan-secrets
```

Or install the Claude Code plugin for `/check-links`, `/scan-secrets`, and
the `propose-change` skill (commits, opens a PR, and runs both checks first):

```
claude plugin marketplace add laarnicayetano/lumenis-repo-preflight
claude plugin install preflight
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
```

## Status

Scaffold only — command implementations shell out to `lychee`, `gitleaks`,
and `gh` but haven't been run end-to-end yet. See open items below.

## Open next steps

- [ ] Confirm final name (currently: preflight)
- [ ] Wire up `cli/` dependencies and test each command against a real repo
- [ ] Register this repo as a plugin marketplace source
- [ ] Set up `NPM_TOKEN` secret for `release-cli.yml`
- [ ] Migrate first consuming repo (lumenis-web-catalog) off its local copies
