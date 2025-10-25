// core/BaseCreator.ts
import { ensureKebabCase, ensureNonEmpty } from "./validators.js";
import type { CreateContext } from "./types.js";
import listDirFiles from "../utils/listDirFiles.js";
import showFileContent from "../utils/showFileContent.js";

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
    const workdir = sub ? fs.join(basePath, sub) : basePath;

    if (!(await fs.exists(workdir))) {
      await fs.mkdir(workdir);
      logger.info(`Created directory: ${workdir}`);
    }

    await listDirFiles(workdir);

    const name = this.normalizeName(
      await prompter.input({
        message: `Enter the ${ext} file name (${this.formatHint()}), without extension:`,
        asyncValidate: async (input: string) => {
          // 1) кастомная валидация формата
          const formatErr = await this.validateName(input);
          if (formatErr) return formatErr;

          // 2) уникальность файла
          if (await fs.exists(fs.join(workdir, `${input.trim()}.${ext}`))) {
            return "A file with this name already exists.";
          }
        },
      })
    );

    const filePath = fs.join(workdir, `${name}.${ext}`);
    await fs.writeFile(filePath, this.template(name));
    logger.success(`${ext.toUpperCase()} file created at: ${filePath}`);

    await listDirFiles(workdir);
    await showFileContent(filePath);

    await this.postCreate(filePath, ctx);
    await listDirFiles(workdir);
    return filePath;
  }
}
