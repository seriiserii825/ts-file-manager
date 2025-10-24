// Печатаем дерево + формируем индексную карту "0.2.1" → узел.
import type { Logger } from "../ports/Logger.js";
import type { TreeNode } from "./TreeTypes.js";

export class TreeRenderer {
  constructor(private logger: Logger) {}

  print(nodes: TreeNode[], level = 0, prefix: number[] = [], map = new Map<string, TreeNode>()) {
    const dash = level === 0 ? "" : "___".repeat(level) + " ";
    nodes.forEach((node, i) => {
      const idxArr = [...prefix, i];
      const idx = idxArr.join(".");
      const marker = `${i}.`;
      const suffix = node.isDir ? "/" : "";
      const line =
        level === 0 ? `${marker}${node.name}${suffix}` : `${dash}${marker}${node.name}${suffix}`;
      node.isDir ? this.logger.info(line) : this.logger.success(line);
      map.set(idx, node);
      if (node.isDir && node.children?.length) this.print(node.children, level + 1, idxArr, map);
    });
    return map;
  }
}
