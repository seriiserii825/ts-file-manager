import chalk from "chalk";

export class Log {
  static info(message: string) {
    console.log(chalk.blue(`[INFO]: ${message}`));
  }
  static success(message: string) {
    console.log(chalk.green(`[SUCCESS]: ${message}`));
  }
  static error(message: string) {
    console.log(chalk.red(`[ERROR]: ${message}`));
  }
  static warning(message: string) {
    console.log(chalk.yellow(`[WARNING]: ${message}`));
  }
}
