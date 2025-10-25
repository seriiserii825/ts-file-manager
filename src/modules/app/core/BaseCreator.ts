// core/BaseCreator.ts
import { ensureKebabCase, ensureNonEmpty } from "./validators.js";
import type { CreateContext } from "./types.js";
import listDirFiles from "../utils/listDirFiles.js";
import showFileContent from "../utils/showFileContent.js";
import {renderTree} from "../utils/renderTree.js";

export abstract class BaseCreator {
  protected subdir(): string {
    return "";
  }
  protected abstract ext(): string;
  protected abstract template(name: string): string;
  protected async postCreate(_filePath: string, _ctx: CreateContext): Promise<void> {}

  /** Можно переопределить подсказку формата в промпте */
  protected formatHint(): string {
    return "kebab-case";
  }

  /** Можно переопределить нормализацию (например, привести к camelCase) */
  protected normalizeName(name: string): string {
    return name.trim();
  }

  /** Можно переопределить свою валидацию имени */
  protected async validateName(input: string): Promise<string | undefined> {
    // БАЗА: kebab-case
    return ensureNonEmpty(input) ?? ensureKebabCase(input);
  }

  async create(basePath: string, ctx: CreateContext): Promise<string> {
    const { fs, prompter, logger } = ctx;
    const ext = this.ext();
    const sub = this.subdir();
    const work_dir = sub ? fs.join(basePath, sub) : basePath;

    if (!(await fs.exists(work_dir))) {
      await fs.mkdir(work_dir);
      logger.info(`Created directory: ${work_dir}`);
    }

    await renderTree(work_dir);

    const name = this.normalizeName(
      await prompter.input({
        message: `Enter the ${ext} file name (${this.formatHint()}), without extension:`,
        asyncValidate: async (input: string) => {
          // 1) кастомная валидация формата
          const formatErr = await this.validateName(input);
          if (formatErr) return formatErr;

          // 2) уникальность файла
          if (await fs.exists(fs.join(work_dir, `${input.trim()}.${ext}`))) {
            return "A file with this name already exists.";
          }
        },
      })
    );

    const filePath = fs.join(work_dir, `${name}.${ext}`);
    await fs.writeFile(filePath, this.template(name));
    logger.success(`${ext.toUpperCase()} file created at: ${filePath}`);

    await showFileContent(filePath);

    await this.postCreate(filePath, ctx);
    await renderTree(basePath);
    return filePath;
  }
}
