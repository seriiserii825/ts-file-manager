import chalk from "chalk";
import fs from 'fs';
import path from "path";
export class EnsureIsWp {
  constructor(theme_dir: string) {
    const style_file = path.join(theme_dir, "style.css");
    const functions_file = path.join(theme_dir, "functions.php");
    if (!fs.existsSync(style_file) || !fs.existsSync(functions_file)) {
      console.log(chalk.red("The current directory is not a WordPress theme directory."));
      process.exit(1);
    }
  }
}
