// modules/files/FileHandle.ts
import path from "node:path";
import { promises as fsp } from "node:fs";
import chalkInput from "../ui/ChalkInput.js";
import Select from "../../classes/Select.js";
import chalk from "chalk";

// --- Tree types -------------------------------------------------------------
type TreeNode = {
  name: string;
  absPath: string;
  isDir: boolean;
  children?: TreeNode[];
};

type RenderedTree = {
  lines: string[];
  indexToNode: Map<string, TreeNode>;
};

export class FileHandle {
  static async buildTree(root: string): Promise<TreeNode[]> {
    const entries = await fsp.readdir(root, { withFileTypes: true });

    // You can flip these two blocks if you prefer files-first at each level
    const dirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => ({ name: e.name, absPath: path.resolve(root, e.name), isDir: true as const }));

    const files = entries
      .filter((e) => e.isFile())
      .map((e) => ({ name: e.name, absPath: path.resolve(root, e.name), isDir: false as const }));

    const nodes: TreeNode[] = [];
    for (const d of dirs) {
      const children = await FileHandle.buildTree(d.absPath);
      nodes.push({ ...d, children });
    }
    for (const f of files) {
      nodes.push({ ...f });
    }
    return nodes;
  }

  // --- Render with numbered indices like 0)., - 0)., --1). --------------------
  static renderIndexedTree(nodes: TreeNode[], level = 0, prefix: number[] = []): RenderedTree {
    const lines: string[] = [];
    const indexToNode = new Map<string, TreeNode>();
    const dash = level === 0 ? "" : "-".repeat(level) + " ";

    nodes.forEach((node, i) => {
      const idxArr = [...prefix, i];
      const idxStr = idxArr.join(".");
      const marker = `${i}).`;
      const suffix = node.isDir ? "/" : "";
      const line =
        level === 0 ? `${marker}${node.name}${suffix}` : `${dash}${marker}${node.name}${suffix}`;

      lines.push(line);
      indexToNode.set(idxStr, node);

      if (node.isDir && node.children && node.children.length > 0) {
        const child = FileHandle.renderIndexedTree(node.children, level + 1, idxArr);
        lines.push(...child.lines);
        child.indexToNode.forEach((v, k) => indexToNode.set(k, v));
      }
    });

    return { lines, indexToNode };
  }

  // --- Show tree, pick by "0.2.1", allow create inside folders ----------------
  static async chooseFromIndexedTree(
    rootPath: string,
    opts?: { allowNested?: boolean }
  ): Promise<string> {
    const root = path.resolve(rootPath);

    // Always-initialized, so TS is happy.
    let lastPath: string = root;

    // helper: rebuild + print tree; return index map
    const rebuild = async () => {
      const tree = await FileHandle.buildTree(root);
      console.log(chalk.yellow(`Root: ${root}`));
      if (tree.length === 0) {
        console.log(chalk.red("(empty)"));
        return new Map<string, TreeNode>();
      }
      return FileHandle.printIndexedTree(tree);
    };

    let indexToNode = await rebuild();

    while (true) {
      // 1) pick index like "0.2.1"
      const indexInput = await chalkInput({
        message:
          "Type index path (e.g. 0.2.1). Selecting a folder lets you create/rename/delete. Type 'q' to cancel:",
        placeholder: "0 or 0.1 or 0.2.1",
      });

      if (!indexInput || indexInput.trim().toLowerCase() === "q") {
        throw new Error("Selection cancelled");
      }

      const idx = indexInput.trim();
      const node = indexToNode.get(idx);
      if (!node) {
        console.log(chalk.red(`Invalid index path: ${idx}`));
        continue; // ask again
      }

      // If a file picked: set lastPath and ask next step
      if (!node.isDir) {
        lastPath = node.absPath;
      } else {
        // Directory picked: show actions (sync selectOne)
        const selectOptions = [
          { label: "✅ Select this folder", value: "select" },
          { label: "📁 Create new folder here", value: "mkdir" },
          { label: "📄 Create new file here", value: "mkfile" },
          { label: "✏️  Rename", value: "rename" },
          { label: "🗑️  Delete", value: "delete" },
        ] as const;

        const action = Select.selectOne(
          `Selected: ${path.relative(root, node.absPath) || "."}`,
          selectOptions
        );

        if (action === "select") {
          lastPath = node.absPath;
        } else if (action === "mkdir") {
          const name = await chalkInput({ message: "New folder name:", placeholder: "new-folder" });
          const clean = FileHandle.sanitizeName(name, { allowNested: !!opts?.allowNested });
          const newPath = path.resolve(node.absPath, clean);
          await FileHandle.ensureDir(newPath);
          lastPath = newPath;
          indexToNode = await rebuild();
        } else if (action === "mkfile") {
          const name = await chalkInput({
            message: "New file name (with extension):",
            placeholder: "file.txt",
          });
          const clean = FileHandle.sanitizeName(name, { allowNested: false });
          const newPath = path.resolve(node.absPath, clean);
          const exists = await FileHandle.pathExists(newPath);
          if (!exists) await fsp.writeFile(newPath, "");
          lastPath = newPath;
          indexToNode = await rebuild();
        } else if (action === "rename") {
          const name = await chalkInput({
            message: "New name:",
            placeholder: node.name,
            defaultValue: node.name,
          });
          const clean = FileHandle.sanitizeName(name, { allowNested: false });
          const newPath = path.resolve(path.dirname(node.absPath), clean);
          await fsp.rename(node.absPath, newPath);
          lastPath = newPath;
          indexToNode = await rebuild();
        } else if (action === "delete") {
          const confirm = Select.selectOne(`Delete "${node.name}"? This cannot be undone.`, [
            { label: "❌ No", value: "no" },
            { label: "✅ Yes, delete", value: "yes" },
          ] as const);
          if (confirm === "yes") {
            await fsp.rm(node.absPath, { recursive: true, force: true });
            console.log(chalk.red(`Deleted: ${node.absPath}`));
            lastPath = path.dirname(node.absPath); // fallback to parent
            indexToNode = await rebuild();
          }
        }
      }

      // After any selection/action, decide what to do next
      const next = Select.selectOne("What next?", [
        { label: "✅ Return selected path", value: "return" },
        { label: "🔁 Keep browsing", value: "continue" },
      ] as const);

      if (next === "return") {
        // lastPath is guaranteed initialized
        return lastPath;
      }

      // Otherwise loop and keep browsing
    }
  }

  // Returns a Map from "0.2.1" → TreeNode for later selection.
  static printIndexedTree(
    nodes: TreeNode[],
    level = 0,
    prefix: number[] = [],
    parentIsDir = true, // only for formatting the first dash level
    indexToNode: Map<string, TreeNode> = new Map()
  ): Map<string, TreeNode> {
    const dash = level === 0 ? "" : "---".repeat(level) + " ";

    nodes.forEach((node, i) => {
      const idxArr = [...prefix, i];
      const idxStr = idxArr.join(".");
      const marker = `${i})`;
      const suffix = node.isDir ? "/" : "";
      const line =
        level === 0 ? `${marker}${node.name}${suffix}` : `${dash}${marker}${node.name}${suffix}`;

      // log with proper level
      if (node.isDir) {
        console.log(chalk.blue(line));
      } else {
        console.log(chalk.green(line));
      }

      indexToNode.set(idxStr, node);

      if (node.isDir && node.children && node.children.length > 0) {
        FileHandle.printIndexedTree(node.children, level + 1, idxArr, true, indexToNode);
      }
    });

    return indexToNode;
  }

  /** Defend against traversal and weird chars; allow nested segments if wanted */
  static sanitizeName(name: string, { allowNested = false } = {}) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Folder name cannot be empty.");

    // no absolute paths
    if (path.isAbsolute(trimmed)) throw new Error("Please provide a relative folder name.");

    // block traversal
    if (trimmed.split(path.sep).some((seg) => seg === ".."))
      throw new Error("Folder name cannot contain '..'.");

    const segmentRe = /^[a-zA-Z0-9._-]+$/;
    const segments = trimmed.split(path.sep);
    if (!allowNested && segments.length > 1) {
      throw new Error("Nested paths are not allowed here.");
    }
    for (const seg of segments) {
      if (!segmentRe.test(seg)) {
        throw new Error(`Illegal folder segment: "${seg}". Use letters, numbers, . _ -`);
      }
    }
    return trimmed;
  }

  static async ensureDir(dir: string) {
    await fsp.mkdir(dir, { recursive: true });
    return dir;
  }

  static async pathExists(p: string) {
    try {
      await fsp.access(p);
      return true;
    } catch {
      return false;
    }
  }
}
