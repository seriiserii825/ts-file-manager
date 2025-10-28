// creators/ScssCreator.ts
import {toKebab} from "../../files/helpers/toKebab.js";
import type { CreateContext } from "../core/types.js";
import { FileCreator } from "../core/types.js";
import {PhpComponentCreator} from "./PhpComponentCreator.js";
import { ScssCreator } from "./ScssCreator.js";

export class PhpComponentScssCreator implements FileCreator {
  id = "pcs";
  label = "pcs(php component + scss)";
  basePath: string;
  ctx: CreateContext;

  constructor(basePath: string, ctx: CreateContext) {
    this.basePath = basePath;
    this.ctx = ctx;
  }

  async run(): Promise<void> {
    const php = new PhpComponentCreator();
    const full_file_path = await php.run(this.basePath, this.ctx);
    const full_file_name = full_file_path.split("/").pop() as string;
    const file_name_camel_case = full_file_name.replace(".php", "");
    const file_name = toKebab(file_name_camel_case);
    const dir_path = full_file_path.replace(`/${full_file_name}`, "");

    const scss = new ScssCreator();
    scss.run(this.basePath, this.ctx, dir_path, file_name);
  }
}
