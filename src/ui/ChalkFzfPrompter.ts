// ui/ChalkFzfPrompter.ts
import { text, isCancel } from "@clack/prompts";
import { SelectFzf } from "./SelectFzf.js";
import type { Prompter } from "../modules/files/ports/Prompter.js";
import { ChalkLogger } from "../modules/files/adapters/ChalkLogger.js";

export class ChalkFzfPrompter implements Prompter {
  private logger: ChalkLogger;
  constructor() {
    this.logger = new ChalkLogger();
  }
  async input(opts: {
    message: string;
    placeholder?: string;
    defaultValue?: string;
    // только sync, как требует твоя версия clack
    validate?: (v: string) => string | Error | undefined;
    // добавим опциональный async-валидатор для себя
    asyncValidate?: (v: string) => Promise<string | Error | undefined>;
  }): Promise<string> {
    const { message, placeholder, defaultValue, validate, asyncValidate } = opts;
    const fullMessage = placeholder ? `${message} (${placeholder})` : message;

    while (true) {
      const value = await text({
        message: fullMessage,
        initialValue: defaultValue ?? "",
        validate, // строго sync
      });
      
      let v = value;
      if (typeof v === "string" && v.trim() === "") {
        this.logger.error("Input cannot be empty");
        continue;
      }

      if (asyncValidate) {
        const res = await asyncValidate(v);
        if (res) {
          // показать ошибку и повторить вопрос
          this.logger.error(typeof res === "string" ? res : res.message);
          // крутим цикл заново
          continue;
        }
      }

      if (isCancel(value) || typeof value !== "string") {
        throw new Error("Cancelled by user");
      }

      return String(v);
    }
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
