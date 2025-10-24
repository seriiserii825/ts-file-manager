// Строим дерево (папки сначала, потом файлы). Никакой печати и ввода — только данные.
import {FS} from "../ports/Fs.js";
import type { TreeNode } from "./TreeTypes.js";

export class TreeBuilder {
  constructor(private fs: FS) {}

  async build(root: string): Promise<TreeNode[]> {
    const entries = await this.fs.readdir(root);
    const dirs  = entries.filter(e => e.isDir);
    const files = entries.filter(e => e.isFile);

    const nodes: TreeNode[] = [];
    for (const d of dirs) {
      const abs = this.fs.resolve(root, d.name);
      const children = await this.build(abs);
      nodes.push({ name: d.name, absPath: abs, isDir: true, children });
    }
    for (const f of files) {
      const abs = this.fs.resolve(root, f.name);
      nodes.push({ name: f.name, absPath: abs, isDir: false });
    }
    return nodes;
  }
}
