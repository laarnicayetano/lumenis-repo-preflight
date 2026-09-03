import { spawnSync } from "node:child_process";

export function scanSecrets(opts) {
  const result = spawnSync(
    "gitleaks",
    ["detect", "--config", opts.config, "--source", ".", "--no-git", "-v"],
    { stdio: "inherit" }
  );

  if (result.error) {
    console.error("Failed to run gitleaks — is it installed? https://github.com/gitleaks/gitleaks");
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}
