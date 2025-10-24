// Bash.js
import { spawn, exec } from "node:child_process";

export class Bash {
  static run(command: string, print = false) {
    return new Promise((resolve, reject) => {
      const child = exec(command, { shell: "/bin/bash" }, (err, stdout, stderr) => {
        if (err) {
          reject(new Error(stderr || err.message));
          return;
        }
        resolve(stdout.trim());
      });

      if (print && child.stdout && child.stderr) {
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
      }
    });
  }

  static stream(command: string, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { stdio: "inherit", shell: true });

      child.on("error", (err) => reject(err));
      child.on("exit", (code) => resolve(code ?? 0));
    });
  }
}
