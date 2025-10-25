// utils/renderTree.ts
import { NodeFS } from "../../files/adapters/NodeFS.js";

type RenderTreeOptions = {
  /** Максимальная глубина (1 = только корневая папка, 3 — по умолчанию) */
  maxDepth?: number;
  /** Показывать ли файлы */
  showFiles?: boolean;
  /** Фильтр по подстроке ("" = всё) */
  filter?: string;
  /** Игнор-лист имён (точное совпадение) */
  ignore?: string[];
};

type TreeNode = {
  name: string;
  isDir: boolean;
  children?: TreeNode[];
};

// ✅ Дефолтные настройки
const DEFAULTS: Required<RenderTreeOptions> = {
  maxDepth: 3,
  showFiles: true,
  filter: "",
  ignore: [
    ".git",
    "node_modules",
    ".DS_Store",
    "dist",
    "vendor",
    "venv",
    "__pycache__",
  ],
};

export async function renderTree(dirPath: string, opts: RenderTreeOptions = {}) {
  const options = { ...DEFAULTS, ...opts };
  const fs = new NodeFS();

  async function build(dir: string, depth: number): Promise<TreeNode[]> {
    if (depth > options.maxDepth) return [];

    const entries = await fs.readdir(dir);
    const nodes: TreeNode[] = [];

    for (const e of entries) {
      // пропускаем игнорируемые имена
      if (options.ignore.includes(e.name)) continue;

      if (e.isDir) {
        const abs = fs.join(dir, e.name);
        const children = await build(abs, depth + 1);

        // оставляем папку, если совпала с фильтром или у неё есть дети
        const nameMatches = !options.filter || e.name.includes(options.filter);
        if (children.length > 0 || nameMatches) {
          nodes.push({ name: e.name, isDir: true, children });
        }
      } else if (options.showFiles) {
        if (options.filter && !e.name.includes(options.filter)) continue;
        nodes.push({ name: e.name, isDir: false });
      }
    }

    // сортировка: сначала папки, потом файлы
    nodes.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return nodes;
  }

  function print(nodes: TreeNode[], prefix = "") {
    nodes.forEach((node, idx) => {
      const isLast = idx === nodes.length - 1;
      const branch = isLast ? "└── " : "├── ";
      const nextPrefix = prefix + (isLast ? "    " : "│   ");

      if (node.isDir) {
        console.log(`${prefix}${branch}📁 ${node.name}/`);
        if (node.children && node.children.length) {
          print(node.children, nextPrefix);
        }
      } else {
        console.log(`${prefix}${branch}📄 ${node.name}`);
      }
    });
  }

  // Заголовок
  console.log(`📂 ${dirPath}`);
  const rootChildren = await build(dirPath, 1);
  if (rootChildren.length === 0) {
    console.log("└── (empty or filtered)");
    return;
  }
  print(rootChildren);
}
