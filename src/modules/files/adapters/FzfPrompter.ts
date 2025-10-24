// Реализация Prompter: select — через fzf (execSync), input — через ваш chalkInput.
import { execSync } from "node:child_process";
import chalk from "chalk";
import type { Prompter } from "../ports/Prompter.js";

export class FzfPrompter implements Prompter {
  async input({
    message,
    placeholder,
    defaultValue,
  }: {
    message: string;
    placeholder?: string;
    defaultValue?: string;
  }) {
    // Подключаем ваш существующий chalkInput
    const mod = await import("../../ui/ChalkInput.js");
    return mod.default({ message, placeholder, defaultValue });
  }

  select<T extends readonly { label: string; value: string }[]>(message: string, options: T) {
    console.log(chalk.blue(message));
    const labels = options.map((o) => o.label);
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
}
