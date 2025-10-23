import path from "node:path";

type TBase = "cwd" | "cwdParent" | string;
export class AppPaths {
  public cwd!: string;
  public theme_dir!: string;
  constructor() {
    this.cwd = process.cwd();
    this.cwd = process.cwd();
    this.theme_dir = this.resolveBaseDir("cwd");
  }

  private resolveBaseDir(base: TBase): string {
    if (base === "cwd") return this.cwd;
    if (base === "cwdParent") return path.dirname(this.cwd);
    // если передали произвольный путь
    return path.isAbsolute(base) ? path.resolve(base) : path.resolve(this.cwd, base);
  }
  public getThemeDir(): string {
    return this.theme_dir;
  }
}
