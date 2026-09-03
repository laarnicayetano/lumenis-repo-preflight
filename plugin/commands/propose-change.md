---
description: Open a PR for changes made in this repo, running link and secret checks first. Use when the user says "ship this", "publish this change", "release this", "open a PR", or has finished editing and wants it up for review.
---

# Propose a change

The person invoking this is often not a developer. Do the git work for them
— don't ask them to run commands themselves unless something is genuinely
ambiguous. This skill opens a PR for human review; it never pushes straight
to the default branch.

## Steps

1. **Start from an up-to-date default branch before doing anything else**,
   so a new branch never forks off stale code or an old feature branch the
   user happens to be sitting on:

   ```
   default_branch=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
   git checkout "$default_branch"
   git pull origin "$default_branch"
   ```

   If there are uncommitted changes in the working tree that aren't related
   to what the user wants to publish, stop and ask rather than switching
   branches out from under them — don't discard or carry over unrelated work
   silently.

2. **See what changed.** Run `git status` and `git diff` (or `git diff --staged`
   if things are already staged) to see which files changed.

3. **Scan for secrets.** Run `npx @laarnicayetano/preflight-cli scan-secrets`. If it
   finds anything, **stop — do not commit, push, or open a PR.** Tell the
   user plainly what it found and where, and let them decide whether to
   remove it or confirm it's safe to publish.

4. **Read the diff for anything a regex scan won't catch.** This needs
   judgment, not pattern-matching — a keyword or date-shaped lint can't tell
   a real leak from a public roadmap date or an illustrative example, so
   this step is what actually carries that weight. Look for:
   - Real customer/personal data (names + emails, phone numbers, addresses,
     account IDs) rather than placeholder data.
   - Internal-only material that reads as confidential: unreleased pricing,
     revenue or sales figures, internal strategy docs.
   - Signals of an unannounced product or launch — a codename not seen in
     public materials, forward-looking dates ("launching Q3 2027", an
     embargo date), or language like "unreleased," "not yet announced,"
     "NPI," "embargo," "internal only." Weigh these in context: a future
     date on a public roadmap page or in a discussion *about* this check
     isn't a leak; the same date attached to a specific product/feature
     that isn't public yet is.

   If this repo is public, treat this check as blocking too. Don't guess or
   silently redact; a false positive costs one clarifying question, a false
   negative publishes a leak.

5. **Check links**, if the change touches markdown or docs: run
   `npx @laarnicayetano/preflight-cli check-links`. Fix or confirm any broken links
   before continuing.

6. **Verify the repo's own checks still pass**, if it has any (e.g. a
   `test` or `build` script in `package.json`). If one fails because of the
   change being proposed, stop and fix it — or tell the user what's broken —
   before opening a PR.

7. **Create a branch and commit.**

   ```
   git checkout -b claude/<short-slug>
   git add <changed files>
   git commit -m "<plain-language summary of the change>"
   git push -u origin claude/<short-slug>
   ```

8. **Open the PR.**

   ```
   gh pr create --title "<summary>" --body "<what changed and why>"
   ```

   If this repo has a `bump-version.yml` workflow wired up (check
   `.github/workflows/` for a job that `uses:` it), also attach a
   `bump:<level>` label so that workflow bumps the version on merge — use
   your judgment on the diff (`none` for docs/tooling-only changes, `patch`
   for fixes and small tweaks, `minor` for new capability, `major` for a
   breaking change), and ask the user in one short sentence if it's
   genuinely ambiguous. If the repo doesn't use that workflow, skip labeling
   entirely — don't invent a convention it doesn't have.

9. **Switch back to the default branch** once the branch is pushed and the
   PR is open:

   ```
   git checkout "$default_branch"
   ```

   Don't leave the working directory sitting on the just-opened PR branch —
   the next task should start clean, not accidentally stack changes onto a
   branch that's already up for review.

10. **Report back in plain language**, e.g.:
    > Opened a PR: <url>. It's up for review — once someone approves and
    > merges it, [whatever this repo's merge automation does].

## Notes

- Never invent content changes — only publish what the user actually edited.
- If nothing changed at all, say so rather than opening an empty PR.
- This skill's job ends at opening the PR. Merging and approving are handled
  by a human, not by this skill.
