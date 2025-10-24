import { text, select } from "@clack/prompts";
import {Prompter} from "../files/ports/Prompter.js";

export class ChalkPrompter implements Prompter {
  async input(opts: {
    message: string;
    placeholder?: string;
    defaultValue?: string;
  }): Promise<string> {
    const { message, placeholder, defaultValue } = opts;

    const fullMessage = placeholder ? `${message} (${placeholder})` : message;

    const value = await text({
      message: fullMessage,
      initialValue: defaultValue ?? "",
    });

    // clack возвращает объект { value }, но если промпт отменён — undefined
    if (typeof value !== "string") throw new Error("Cancelled by user");
    return value.trim();
  }

  select<T extends readonly { label: string; value: string }[]>(
    message: string,
    options: T
  ): T[number]["value"] {
    // для select можно позже сделать через clack.select()
    // пока просто синхронный вывод в консоль
    console.log("\n" + message);
    options.forEach((o, i) => console.log(`${i + 1}. ${o.label}`));

    // временный input через stdin
    const choice = Number.parseInt(prompt("Select: ") ?? "1", 10);
    return options[choice - 1]?.value ?? options[0].value;
  }
}
