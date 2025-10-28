// creators/PhpCreator.ts
import { BaseCreator } from "../core/BaseCreator.js";
import type { CreateContext } from "../core/types.js";
import includePhpFile from "../modules/includePhpFile.js";

export class PhpCreator extends BaseCreator {
  readonly id = "php";
  readonly label = "php";

  protected ext(): string {
    return "php";
  }

  protected template(name: string): string {
    return `<?php

?>\n<div class="${name}">\n    \n</div>\n`;
  }

  protected async postCreate(file_path: string, ctx: CreateContext) {
    await includePhpFile(file_path);
    ctx.logger.success("PHP file created and included successfully.");
  }

  async run(basePath: string, ctx: CreateContext): Promise<string> {
    // Передадим basePath позже в include (не меняем сигнатуру includePhpFile)
    const filePath = await this.create(basePath, ctx);
    return filePath;
    // includePhpFile уже вызван в postCreate()
  }
}
