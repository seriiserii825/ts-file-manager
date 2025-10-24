// Все мутации в одном месте + переиспользуем Sanitizer.
import { FS } from "../ports/Fs.js";
import { NameSanitizer } from "./NameSanitizer.js";

export class FileActions {
  constructor(private fs: FS, private sanitizer = new NameSanitizer(fs)) {}

  async mkdir(base: string, name: string, allowNested = false) {
    const clean = this.sanitizer.sanitize(name, allowNested);
    const abs = this.fs.resolve(base, clean);
    await this.fs.mkdir(abs);
    return abs;
  }

  async mkfile(base: string, name: string) {
    const clean = this.sanitizer.sanitize(name, false);
    const abs = this.fs.resolve(base, clean);
    if (!(await this.fs.exists(abs))) await this.fs.writeFile(abs, "");
    return abs;
  }

  async rename(targetAbs: string, newName: string) {
    const base = this.fs.dirname(targetAbs);
    const clean = this.sanitizer.sanitize(newName, false);
    const dest = this.fs.resolve(base, clean);
    await this.fs.rename(targetAbs, dest);
    return dest;
  }

  async delete(targetAbs: string) {
    await this.fs.rm(targetAbs);
  }

  async move(
    srcAbs: string,
    targetDirAbs: string,
    opts?: { newName?: string; overwrite?: boolean }
  ): Promise<string> {
    const srcBase = this.basename(srcAbs);
    const finalName = this.sanitizer.sanitize(opts?.newName ?? srcBase, false);
    const destAbs = this.fs.resolve(targetDirAbs, finalName);

    if (await this.fs.exists(destAbs)) {
      if (opts?.overwrite) {
        await this.fs.rm(destAbs);
      } else {
        const err: any = new Error(`EEXIST: ${destAbs}`);
        err.code = "EEXIST";
        throw err;
      }
    }

    try {
      await this.fs.rename(srcAbs, destAbs);
    } catch (e: any) {
      // If your concrete FS uses Node and you hit EXDEV (cross-device),
      // implement copy+rm inside the concrete adapter, not here in core.
      e.message = `Failed to move "${srcAbs}" -> "${destAbs}": ${e.message}`;
      throw e;
    }

    return destAbs;
  }

  /** Derive basename using only provided FS ops */
  private basename(p: string): string {
    // relative(dirname(p), p) gives the last segment
    return this.fs.relative(this.fs.dirname(p), p) || p;
  }
}
