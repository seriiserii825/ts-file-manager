import {NodeFS} from "../../files/adapters/NodeFS.js";

export async function listFiles(dir_path: string) {
  const fs = new NodeFS();
  const folders: string[] = [];
  const files: string[] = [];
  await fs.readdir(dir_path).then((entries) => {
    entries.forEach((entry) => {
      if (entry.isDir) {
        folders.push(entry.name + "/");
      } else {
        files.push(entry.name);
      }
    });
  });
  if (folders.length > 0) {
    folders.forEach((folder) => {
      console.log(`📁 ${folder}`);
    });
  }
  if (files.length > 0) {
    files.forEach((file) => {
      console.log(`... 📄 ${file}`);
    });
  }
}
