import { NodeFS } from "../../files/adapters/NodeFS.js";

export async function getLsFiles(dir_path: string, filter?: string): Promise<string[] | undefined> {
  const fs = new NodeFS();
  const files: string[] = [];
  await fs.readdir(dir_path).then((entries) => {
    entries.forEach((entry) => {
      if (!entry.isDir) {
        if (filter && !entry.name.includes(filter)) {
          return;
        }
        files.push(entry.name);
      }
    });
  });
  if (files.length > 0) {
    return files;
  }
}
