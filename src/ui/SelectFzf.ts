// ui/SelectFzf.ts
import { execSync } from "node:child_process";
import chalk from "chalk";

type AnyOpt = { label: string; value: string };

const DELIM = "\t"; // надёжный разделитель label↔value

function runFzf(input: string, flags: string): string {
  try {
    return execSync(`fzf ${flags}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "inherit"],
      input,
    }).trim();
  } catch {
    throw new Error("No selection made.");
  }
}

export class SelectFzf {
  static selectOne<T extends readonly AnyOpt[]>(
    message: string,
    options: T,
    flags = `--no-clear --height=15 --reverse --ansi --prompt='Select> ' --select-1 --exit-0`
  ): T[number]["value"] {
    // красим только label; value остаётся «сырым» после DELIM
    const lines = options.map(o => `${chalk.cyan(o.label)}${DELIM}${o.value}`).join("\n");
    console.log(chalk.blue(message));
    const out = runFzf(lines, flags);
    const delimIdx = out.lastIndexOf(DELIM);
    if (delimIdx === -1) throw new Error(`Unexpected fzf output: "${out}"`);
    return out.slice(delimIdx + DELIM.length) as T[number]["value"];
  }

  static selectMultiple<T extends readonly AnyOpt[]>(
    message: string,
    options: T,
    flags = `--multi --no-clear --height=15 --reverse --ansi --prompt='Select> ' --marker='✓ ' --exit-0`
  ): Array<T[number]["value"]> {
    const lines = options.map(o => `${chalk.cyan(o.label)}${DELIM}${o.value}`).join("\n");
    console.log(chalk.blue(message));
    try {
      const out = runFzf(lines, flags);
      if (!out) return [];
      return out
        .split("\n")
        .filter(Boolean)
        .map(line => {
          const i = line.lastIndexOf(DELIM);
          if (i === -1) throw new Error(`Unexpected fzf output: "${line}"`);
          return line.slice(i + DELIM.length) as T[number]["value"];
        });
    } catch {
      return [];
    }
  }
}
