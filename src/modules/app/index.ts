import Select, { TSelectOne } from "../../classes/Select.js";
import { ChalkFzfPrompter } from "../../ui/ChalkFzfPrompter.js";
import { NodeFS } from "../files/adapters/NodeFS.js";
import { ChalkLogger } from "../files/adapters/ChalkLogger.js";

export default async function appMenu(base_path: string) {
  const fs = new NodeFS();
  const prompter = new ChalkFzfPrompter();
  const logger = new ChalkLogger();

  const file_types_options: TSelectOne[] = [
    { value: "php", label: "php" },
    { value: "js", label: "js" },
    { value: "scss", label: "scss" },
    { value: "icon", label: "icon (svg)" },
  ];

  const base_option = Select.selectOne("Select file type", file_types_options);
  switch (base_option) {
    case "php":
      console.log(`You selected php files in ${base_path}`);
      await createPhpFile(base_path);
      break;
    case "js":
      console.log(`You selected js files in ${base_path}`);
      await createJsFile(base_path);
      break;
    case "scss":
      console.log(`You selected scss files in ${base_path}`);
      break;
    case "icon":
      console.log(`You selected icon (svg) files in ${base_path}`);
      break;
  }

  async function createPhpFile(base_path: string) {
    await listFiles(base_path);
    const name = await prompter.input({
      message: "Enter the PHP file name (without extension):",
      asyncValidate: async (input) => {
        if (!input || input.trim() === "") {
          return "File name cannot be empty.";
        }
        if (await fs.exists(fs.join(base_path, `${input.trim()}.php`))) {
          return "A file with this name already exists.";
        }
      },
    });
    const filePath = fs.join(base_path, `${name.trim()}.php`);
    const phpTemplate = `<?php\n\n ?>\n<div class="${name.trim()}">\n    \n</div>\n`;
    await fs.writeFile(filePath, phpTemplate);
    logger.success(`PHP file created at: ${filePath}`);
    await listFiles(base_path);
  }

  async function createJsFile(base_path: string) {
    const ext = "ts";
    base_path = fs.join(base_path, "js");
    if (!(await fs.exists(base_path))) {
      await fs.mkdir(base_path);
      logger.info(`Created directory: ${base_path}`);
    }
    await listFiles(base_path);
    const name = await prompter.input({
      message: `Enter the ${ext} file name (without extension):`,
      asyncValidate: async (input) => {
        if (!input || input.trim() === "") {
          return "File name cannot be empty.";
        }
        if (!isCamelCase(input.trim())) {
          return "File name must be in camelCase format.";
        }
        if (await fs.exists(fs.join(base_path, `${input.trim()}.ts`))) {
          return "A file with this name already exists.";
        }
      },
    });
    const filePath = fs.join(base_path, `${name.trim()}.${ext}`);
    const template = `export default function ${name.trim()}() {\n    \n}\n`;
    await fs.writeFile(filePath, template);
    logger.success(`${ext} file created at: ${filePath}`);
    await listFiles(base_path);
  }

  async function listFiles(dir_path: string) {
    await fs.readdir(dir_path).then((entries) => {
      entries.forEach((entry) => {
        console.log(`${entry.isDir ? "DIR " : "FILE"}: ${entry.name}`);
      });
    });
  }

  function isCamelCase(str: string): boolean {
    return /^[a-z][a-zA-Z0-9]*$/.test(str);
  }

  function toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  }

  function showFileContent(file_path: string) {

  }
}
