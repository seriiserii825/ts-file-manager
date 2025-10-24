import {NodeFS} from "../../files/adapters/NodeFS.js";

export async function listDirs(dir_path: string) {
  const fs = new NodeFS();
  const folders: string[] = [];
  await fs.readdir(dir_path).then((entries) => {
    entries.forEach((entry) => {
      if (entry.isDir) {
        folders.push(entry.name + "/");
      }
    });
  });
  if (folders.length > 0) {
    folders.forEach((folder) => {
      console.log(`📁 ${folder}`);
    });
  }
}
