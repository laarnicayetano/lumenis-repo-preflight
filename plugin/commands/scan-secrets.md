---
description: Scan this repo for secrets before pushing
---

Run `npx @laarnicayetano/preflight-cli scan-secrets` in the project root and report
the result. If any findings come back, treat them as sensitive — do not print
the actual secret values in full; show enough context (file, line, rule) for
the user to locate and rotate/remove them.
