// creators/ScssCreator.ts
import type { CreateContext } from "../core/types.js";
import { PhpCreator } from "./PhpCreator.js";
import { FileCreator } from "../core/types.js";
import { ScssCreator } from "./ScssCreator.js";

export class PhpScssCreator implements FileCreator {
  id = "php_scss";
  label = "Php Scss";
  basePath: string;
  ctx: CreateContext;

  constructor(basePath: string, ctx: CreateContext) {
    this.basePath = basePath;
    this.ctx = ctx;
  }

  async run(): Promise<void> {
    const php = new PhpCreator();
    const full_file_path = await php.run(this.basePath, this.ctx);
    const full_file_name = full_file_path.split("/").pop();
    const file_name = full_file_name?.replace(".php", "");
    const dir_path = full_file_path.replace(`/${full_file_name}`, "");

    const scss = new ScssCreator();
    scss.run(this.basePath, this.ctx, dir_path, file_name);
  }
}
