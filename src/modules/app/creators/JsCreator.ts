// creators/JsCreator.ts
import { BaseCreator } from "../core/BaseCreator.js";
import { ensureCamelCase, ensureJsIdentifier } from "../core/validators.js";

export class JsCreator extends BaseCreator {
  readonly id = "js";
  readonly label = "js";

  protected ext(): string {
    return "js";
  }

  // Подсказываем формат в промпте
  protected formatHint(): string {
    return "camelCase";
  }

  // Валидируем camelCase + валидный JS идентификатор
  protected async validateName(input: string): Promise<string | undefined> {
    return ensureCamelCase(input) ?? ensureJsIdentifier(input);
  }

  // Можно нормализовать (если бы позволяли, например, авто-конверсию).
  // Здесь просто trim:
  protected normalizeName(name: string): string {
    return name.trim();
  }

  // Имя функции = имя файла
  protected template(name: string): string {
    return `// ${new Date().toISOString()}
export default function ${name}() {
  console.log("${name}()");
}
`;
  }

  async run(basePath: string, ctx: any) {
    await this.create(basePath, ctx);
  }
}
