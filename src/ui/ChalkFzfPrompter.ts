// ui/ChalkFzfPrompter.ts
import { text, isCancel } from "@clack/prompts";
import { SelectFzf } from "./SelectFzf.js";
import type { Prompter } from "../modules/files/ports/Prompter.js";

export class ChalkFzfPrompter implements Prompter {
  async input(opts: {
    message: string;
    placeholder?: string;
    defaultValue?: string;
    validate?: (v: string) => string | Error | undefined;
  }): Promise<string> {
    const { message, placeholder, defaultValue, validate } = opts;
    const fullMessage = placeholder ? `${message} (${placeholder})` : message;

    const value = await text({
      message: fullMessage,
      initialValue: defaultValue ?? "",
      validate,
    });

    if (isCancel(value) || typeof value !== "string") {
      throw new Error("Cancelled by user");
    }
    return value.trim();
  }

  // // ⬇⬇⬇ СИНХРОННЫЙ select, без async и без Promise
  // select<T extends readonly { label: string; value: string }[]>(
  //   message: string,
  //   options: T
  // ): T[number]["value"] {
  //   return SelectFzf.selectOne(message, options);
  // }
  //
  // make it async
  async select<T extends readonly { label: string; value: string }[]>(
    message: string,
    options: T
  ): Promise<T[number]["value"]> {
    // if SelectFzf.selectOne is sync, just wrap its result in Promise.resolve
    const result = SelectFzf.selectOne(message, options);
    return Promise.resolve(result);
  }
}
