import { spawnSync } from "node:child_process";

export function checkLinks(opts) {
  const result = spawnSync("lychee", ["--config", opts.config, "."], {
    stdio: "inherit",
  });

  if (result.error) {
    console.error(
      "Failed to run lychee — is it installed? https://lychee.cli.rs",
    );
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}
