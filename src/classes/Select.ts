// Select.ts
import { execSync } from "node:child_process";
import chalk from "chalk";

export type TSelectOne = { label: string; value: string };

// T is a readonly array/tuple of options.
// The return type is the union of all option .value's.
export default class Select {
  static selectOne<T extends readonly TSelectOne[]>(message: string, options: T): T[number]["value"] {
    const labels = options.map((o) => o.label);

    console.log(chalk.blue(message));
    let choice = "";
    try {
      choice = execSync(`fzf --no-clear --height=10 --reverse`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "inherit"],
        input: labels.join("\n"),
      }).trim();
    } catch {
      throw new Error("No selection made.");
    }

    const hit = options.find((o) => o.label === choice);
    if (!hit) throw new Error(`Choice "${choice}" not found`);
    return hit.value as T[number]["value"];
  }

  static selectMultiple<T extends readonly TSelectOne[]>(
    message: string,
    options: T
  ): Array<T[number]["value"]> {
    const labels = options.map((o) => o.label);

    console.log(chalk.blue(message));
    try {
      const output = execSync(`fzf --multi --no-clear --height=10 --reverse --prompt='Select> '`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "inherit"],
        input: labels.join("\n"),
      })
        .trim()
        .split("\n")
        .filter(Boolean);

      const picked = options.filter((o) => output.includes(o.label)).map((o) => o.value) as Array<
        T[number]["value"]
      >;

      return picked;
    } catch {
      return [];
    }
  }
}
