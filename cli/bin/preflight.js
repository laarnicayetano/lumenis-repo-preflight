#!/usr/bin/env node
import { Command } from "commander";
import { checkLinks } from "../src/commands/check-links.js";
import { scanSecrets } from "../src/commands/scan-secrets.js";

const program = new Command();

program
  .name("preflight")
  .description("Shared repo-workflow toolkit: link checking and secret scanning");

program
  .command("check-links")
  .description("Validate markdown links against configs/lychee.toml")
  .option("-c, --config <path>", "path to lychee config", "configs/lychee.toml")
  .action(checkLinks);

program
  .command("scan-secrets")
  .description("Scan the repo for secrets against configs/gitleaks.toml")
  .option(
    "-c, --config <path>",
    "path to gitleaks config",
    "configs/gitleaks.toml",
  )
  .action(scanSecrets);

program.parseAsync(process.argv);
