// Рендер дерева с иконками по расширению, ветками ┣ ┗ ┃ и индексами [0.2.1]
import type { Logger } from "../ports/Logger.js";
import type { TreeNode } from "./TreeTypes.js";
import path from "node:path";

export class TreeRenderer {
  constructor(private logger: Logger) {}

  private getIcon(node: TreeNode): string {
    if (node.isDir) return "📁";

    const ext = path.extname(node.name).toLowerCase();
    switch (ext) {
      case ".scss":
      case ".css":
        return "🖌️";
      case ".js":
      case ".ts":
        return "⚡";
      case ".php":
        return "🐘";
      case ".html":
        return "🌐";
      case ".vue":
        return "🧩";
      default:
        return "📄";
    }
  }

  print(
    nodes: TreeNode[],
    level = 0,
    prefix: number[] = [],
    map = new Map<string, TreeNode>(),
    parentsLastMask: boolean[] = []
  ) {
    nodes.forEach((node, i) => {
      const idxArr = [...prefix, i];
      const idx = idxArr.join(".");
      const isLast = i === nodes.length - 1;

      const pipes =
        level === 0
          ? ""
          : parentsLastMask
              .map((wasLast) => (wasLast ? "   " : "┃  "))
              .join("");

      const branch = level === 0 ? "" : (isLast ? "┗━ " : "┣━ ");

      const icon = this.getIcon(node);
      const suffix = node.isDir ? "/" : "";
      const indexBadge = `[${idx}] `;
      const line = `${pipes}${branch}${indexBadge}${icon} ${node.name}${suffix}`;

      node.isDir ? this.logger.info(line) : this.logger.success(line);

      map.set(idx, node);

      if (node.isDir && node.children?.length) {
        this.print(
          node.children,
          level + 1,
          idxArr,
          map,
          [...parentsLastMask, isLast]
        );
      }
    });

    return map;
  }
}
