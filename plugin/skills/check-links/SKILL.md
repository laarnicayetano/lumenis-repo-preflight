---
name: check-links
description: Validate markdown links in this repo. Use when the user asks to check for broken links, validate documentation, or wants a link check before publishing.
---

Run `npx @laarnicayetano/preflight-cli check-links` in the project root and report the
result to the user. If broken links are found, list them clearly (file, line,
URL) and ask whether to fix them or leave them for later. Do not invent a fix
for a broken link without checking what the correct URL should be.
