#!/usr/bin/env node
import { runCommitCommand } from "./commands/commit.js";
import type { GenerateOptions } from "./types.js";

const MASCOT = `
         ✦   ˚   ✦
        ╭─────────╮
        │  ◕   ◕  │
        ╰────┬────╯
  ◉━━━━━━━━━━┻━━━━━━━━━━◉
  ┃   ╭─────────────╮   ┃
  ┃   │ ●  ───────  │   ┃
  ┃   │    ───────  │   ┃
  ┃   │    ─────    │   ┃
  ┃   │ ●  ───────  │   ┃
  ┃   ╰─────────────╯   ┃
  ◉━━━━━━━━━━━━━━━━━━━━━◉

    commitloom · git loom · weave your commits
`;

function parseParams(args: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const raw = args[i];
    if (!raw.startsWith("-")) continue;
    const stripped = raw.replace(/^-+/, "");
    if (stripped.includes("=")) {
      const eq = stripped.indexOf("=");
      params[stripped.slice(0, eq)] = stripped.slice(eq + 1);
    } else {
      const next = args[i + 1];
      if (next !== undefined && !next.startsWith("-")) {
        params[stripped] = next;
        i++;
      } else {
        params[stripped] = "true";
      }
    }
  }
  return params;
}

const args = process.argv.slice(2);
const ddIdx = args.indexOf("--");
const cliArgs = ddIdx >= 0 ? args.slice(0, ddIdx) : args;
const extraArgs = ddIdx >= 0 ? args.slice(ddIdx + 1) : [];

const options: GenerateOptions = { params: parseParams(extraArgs) };
let i = 0;
while (i < cliArgs.length) {
  const a = cliArgs[i];
  if ((a === "--config" || a === "-c") && cliArgs[i + 1]) {
    options.config = cliArgs[++i];
  } else if ((a === "--instructions" || a === "-I") && cliArgs[i + 1]) {
    options.instructions = cliArgs[++i];
  } else if (a === "--verbose" || a === "-v") {
    options.verbose = true;
  }
  i++;
}

process.stderr.write(MASCOT);

runCommitCommand(options).catch((err: Error) => {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
});
