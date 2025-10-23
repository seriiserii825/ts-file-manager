import fs from "fs";
import path from "path";
import { Log } from "../logs/Log.js";
export class EnsureIsWp {
  constructor(theme_dir: string) {
    const style_file = path.join(theme_dir, "style.css");
    const functions_file = path.join(theme_dir, "functions.php");
    if (!fs.existsSync(style_file) || !fs.existsSync(functions_file)) {
      Log.error("The current directory is not a WordPress theme directory.");
      process.exit(1);
    } else {
      Log.success("WordPress theme directory verified.");
    }
  }
}
