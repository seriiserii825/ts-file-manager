// Все мутации в одном месте + переиспользуем Sanitizer.
import {FS} from "../ports/Fs.js";
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
}
