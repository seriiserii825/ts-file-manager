import { ChalkFzfPrompter } from "../../../ui/ChalkFzfPrompter.js";
import { ChalkLogger } from "../../files/adapters/ChalkLogger.js";
import { NodeFS } from "../../files/adapters/NodeFS.js";
import isKebabCase from "../utils/isKebabCase.js";
import { listFiles } from "../utils/listFiles.js";
import showFileContent from "../utils/showFileContent.js";

export default async function createPhpFile(base_path: string) {
  const fs = new NodeFS();
  const prompter = new ChalkFzfPrompter();
  const logger = new ChalkLogger();
  await listFiles(base_path);
  const name = await prompter.input({
    message: "Enter the PHP file name (without extension):",
    asyncValidate: async (input) => {
      if (!input || input.trim() === "") {
        return "File name cannot be empty.";
      }
      if (!isKebabCase(input.trim())) {
        return "File name must be in kebab-case format.";
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
  await showFileContent(filePath);
}
