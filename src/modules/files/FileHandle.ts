import fs from "fs";
import path from "path";
export class FileHandle {
  static listDirForDirs(dir_path: string): string[] {
    return fs
      .readdirSync(dir_path)
      .filter((name) => fs.statSync(path.join(dir_path, name)).isDirectory());
  }
  static listDirForFiles(dir_path: string): string[] {
    return fs
      .readdirSync(dir_path)
      .filter((name) => fs.statSync(path.join(dir_path, name)).isFile());
  }
}
