// Interactive "navigator": shows a tree, accepts index like 0.2.1,
// offers actions (select/mkdir/mkfile/rename/delete/exit), stores lastPath.
import type { Prompter } from "../ports/Prompter.js";
import type { Logger } from "../ports/Logger.js";
import { TreeBuilder } from "./TreeBuilder.js";
import { TreeRenderer } from "./TreeRenderer.js";
import { FileActions } from "./FileActions.js";
import type { TreeNode } from "./TreeTypes.js";
import { FS } from "../ports/Fs.js";

export class Navigator {
  private builder: TreeBuilder;
  private renderer: TreeRenderer;
  private actions: FileActions;

  constructor(private fs: FS, private prompter: Prompter, private logger: Logger) {
    this.builder = new TreeBuilder(fs);
    this.renderer = new TreeRenderer(logger);
    this.actions = new FileActions(fs);
  }

  private async rebuild(root: string) {
    const tree = await this.builder.build(root);
    this.logger.info(`Root: ${root}`);
    if (!tree.length) {
      this.logger.warn("(empty)");
      return new Map<string, TreeNode>();
    }
    return this.renderer.print(tree);
  }

  async chooseFromIndexedTree(rootPath: string, opts?: { allowNested?: boolean }): Promise<string> {
    const root = this.fs.resolve(rootPath);
    let lastPath = root;
    let index = await this.rebuild(root);

    while (true) {
      const indexInput = await this.prompter.input({
        message: "Enter path index (e.g. 0.2.1). 'q' to cancel:",
        placeholder: "0 or 0.1 or 0.2.1",
      });
      if (!indexInput || indexInput.trim().toLowerCase() === "q")
        throw new Error("Cancelled by user");

      const node = index.get(indexInput.trim());
      if (!node) {
        this.logger.warn(`Invalid index: ${indexInput}`);
        continue;
      }
      
      let action: "select" | "mkdir" | "mkfile" | "rename" | "delete" | "exit";

      if (!node.isDir) {
        // Selected a folder → show actions
        action = this.prompter.select(
          `Selected: ${this.fs.relative(root, node.absPath) || "."}`,
          [
            { label: "✏️  Rename file/folder", value: "rename" },
            { label: "🗑️  Delete file/folder", value: "delete" },
            { label: "🚪 Exit", value: "exit" },
          ] as const
        );
      } else {
        // Selected a folder → show actions
        action = this.prompter.select(
          `Selected: ${this.fs.relative(root, node.absPath) || "."}`,
          [
            { label: "✅ Select folder", value: "select" },
            { label: "📁 Create folder inside", value: "mkdir" },
            { label: "📄 Create file inside", value: "mkfile" },
            { label: "✏️  Rename file/folder", value: "rename" },
            { label: "🗑️  Delete file/folder", value: "delete" },
            { label: "🚪 Exit", value: "exit" },
          ] as const
        );
      }

      if (action === "select") {
        lastPath = node.absPath;
      } else if (action === "mkdir") {
        const name = await this.prompter.input({
          message: "New folder name:",
          placeholder: "new-folder",
        });
        lastPath = await this.actions.mkdir(node.absPath, name, !!opts?.allowNested);
        index = await this.rebuild(root);
      } else if (action === "mkfile") {
        const name = await this.prompter.input({
          message: "File name (with extension):",
          placeholder: "file.txt",
        });
        lastPath = await this.actions.mkfile(node.absPath, name);
        index = await this.rebuild(root);
      } else if (action === "rename") {
        const name = await this.prompter.input({
          message: "New name:",
          placeholder: node.name,
          defaultValue: node.name,
        });
        lastPath = await this.actions.rename(node.absPath, name);
        index = await this.rebuild(root);
      } else if (action === "delete") {
        const confirm = this.prompter.select(`Delete "${node.name}"?`, [
          { label: "❌ No", value: "no" },
          { label: "✅ Yes, delete", value: "yes" },
        ] as const);
        if (confirm === "yes") {
          await this.actions.delete(node.absPath);
          lastPath = this.fs.dirname(node.absPath);
          index = await this.rebuild(root);
        }
      } else if (action === "exit") {
        break;
      }

      const next = this.prompter.select("What's next?", [
        { label: "🔁 Continue navigation", value: "continue" },
        { label: "✅ Return selected path", value: "return" },
      ] as const);

      if (next === "return") return lastPath;
      // otherwise repeat the loop
    }

    return lastPath;
  }
}
