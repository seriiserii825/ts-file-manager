import chalk from "chalk";
import fs from "fs";
import path from "node:path";

type TBase = "cwd" | "cwdParent" | string;

export class EnsureIsWp {
  public cwd!: string;

  constructor() {
    this.cwd = process.cwd();
    const baseDir = this.resolveBaseDir("cwd");
    const style_file = path.join(baseDir, "style.css");
    const functions_file = path.join(baseDir, "functions.php");
    if (!fs.existsSync(style_file) || !fs.existsSync(functions_file)) {
      console.log(chalk.red("The current directory is not a WordPress theme directory."));
      process.exit(1);
    }
  }
  private resolveBaseDir(base: TBase): string {
    if (base === "cwd") return this.cwd;
    if (base === "cwdParent") return path.dirname(this.cwd);
    // если передали произвольный путь
    return path.isAbsolute(base) ? path.resolve(base) : path.resolve(this.cwd, base);
  }
}
