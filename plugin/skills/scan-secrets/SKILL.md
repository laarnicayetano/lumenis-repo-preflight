---
name: scan-secrets
description: Scan this repo for secrets before pushing or publishing. Use when the user asks to check for leaked credentials, wants a secret scan before opening a PR, or is about to push to a public repo.
---

Run `npx @laarnicayetano/preflight-cli scan-secrets` in the project root and report
the result. If any findings come back, treat them as sensitive — do not print
the actual secret values in full; show enough context (file, line, rule) for
the user to locate and rotate/remove them.
