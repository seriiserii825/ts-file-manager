// Реализация Logger через chalk.
import chalk from "chalk";
import type { Logger } from "../ports/Logger.js";

export class ChalkLogger implements Logger {
  info(msg: string) {
    console.log(chalk.blue(msg));
  }
  success(msg: string) {
    console.log(chalk.green(msg));
  }
  warn(msg: string) {
    console.log(chalk.yellow(msg));
  }
  error(msg: string) {
    console.log(chalk.red(msg));
  }
}
