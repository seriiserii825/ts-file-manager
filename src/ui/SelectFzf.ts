// ui/SelectFzf.ts
import { execSync } from "node:child_process";
import chalk from "chalk";

type AnyOpt = { label: string; value: string };

const DELIMITER = "\t"; // надёжный разделитель label↔value

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

// ui/SelectFzf.ts
export class SelectFzf {
  static selectOne<T extends readonly AnyOpt[]>(
    message: string,
    options: T,
    // было: --no-clear ...
    flags = `--height=15 --reverse --ansi --border --prompt='Select> ' --select-1 --exit-0 --delimiter='\t' --with-nth=1 --nth=1`
  ): T[number]["value"] {
    const lines = options.map(o => `${chalk.cyan(o.label)}${DELIMITER}${o.value}`).join("\n");
    console.log(chalk.blue(message));
    const out = runFzf(lines, flags);
    console.log(); // отступ после fzf — на всякий случай
    const i = out.lastIndexOf(DELIMITER);
    if (i === -1) throw new Error(`Unexpected fzf output: "${out}"`);
    return out.slice(i + DELIMITER.length) as T[number]["value"];
  }

  static selectMultiple<T extends readonly AnyOpt[]>(
    message: string,
    options: T,
    flags = `--multi --height=15 --reverse --ansi --border --prompt='Select> ' --marker='✓ ' --exit-0 --delimiter='\t' --with-nth=1 --nth=1`
  ): Array<T[number]["value"]> {
    const lines = options.map(o => `${chalk.cyan(o.label)}${DELIMITER}${o.value}`).join("\n");
    console.log(chalk.blue(message));
    const out = runFzf(lines, flags);
    console.log();
    if (!out) return [];
    return out.split("\n").filter(Boolean).map(line => {
      const i = line.lastIndexOf(DELIMITER);
      if (i === -1) throw new Error(`Unexpected fzf output: "${line}"`);
      return line.slice(i + DELIMITER.length) as T[number]["value"];
    });
  }
}
