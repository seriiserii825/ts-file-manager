// creators/PhpCreator.ts
import { BaseCreator } from "../core/BaseCreator.js";
import type { CreateContext } from "../core/types.js";
import {ensureCamelCase} from "../core/validators.js";
import includePhpFile from "../modules/includePhpFile.js";

export class PhpComponentCreator extends BaseCreator {
  readonly id = "php_component";
  readonly label = "php component";

  protected ext(): string {
    return "php";
  }

  protected template(name: string): string {
    return `<?php function ${name}() { ?>
      <div class="${name}"></div>
<?php } ?>
      `;
  }

  protected formatHint(): string {
    return "camelCase";
  }

  protected validateName(input: string): Promise<string | undefined> {
    return Promise.resolve(ensureCamelCase(input));
  }

  protected async postCreate(filePath: string, ctx: CreateContext) {
    await includePhpFile({
      base_path: "", // Возьмём из параметров вызова run (см. ниже)
      file_path: filePath,
    });
    ctx.logger.success("PHP file created and included successfully.");
  }

  async run(basePath: string, ctx: CreateContext): Promise<void> {
    // Передадим basePath позже в include (не меняем сигнатуру includePhpFile)
    const filePath = await this.create(basePath, ctx);
    // includePhpFile уже вызван в postCreate()
  }
}
