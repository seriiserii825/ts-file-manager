import { listDirs } from "./listDirs.js";
import { listFiles } from "./listFiles.js";

export default async function listDirFiles(dir_path: string, filter?: string) {
  await listDirs(dir_path);
  await listFiles(dir_path, filter);
}
