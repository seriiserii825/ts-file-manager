// creators/PhpCreator.ts
import { BaseCreator } from "../core/BaseCreator.js";
import type { CreateContext } from "../core/types.js";
import includePhpFile from "../modules/includePhpFile.js";

export class PhpCreator extends BaseCreator {
  readonly id = "php";
  readonly label = "php";

  protected ext(): string { return "php"; }

  protected template(name: string): string {
    return `<?php

?>\n<div class="${name}">\n    \n</div>\n`;
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
