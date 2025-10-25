// creators/ScssCreator.ts
import { BaseCreator } from "../core/BaseCreator.js";
import type { CreateContext } from "../core/types.js";
import includeScssFile from "../modules/includeScssFile.js";

export class ScssCreator extends BaseCreator {
  readonly id = "scss";
  readonly label = "scss";

  protected ext(): string { return "scss"; }

  protected subdir(): string { return "scss"; }

  protected template(name: string): string {
    return `.${name}{\n  opacity: 0;\n}\n`;
  }

  protected async postCreate(filePath: string, ctx: CreateContext) {
    await includeScssFile({
      base_path: "", // см. run()
      file_path: filePath,
    });
    ctx.logger.success("SCSS file created and included successfully.");
  }

  async run(basePath: string, ctx: CreateContext): Promise<void> {
    const filePath = await this.create(basePath, ctx);
    // includeScssFile уже вызван в postCreate()
  }
}
