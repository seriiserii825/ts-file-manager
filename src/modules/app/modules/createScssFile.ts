import {ChalkFzfPrompter} from "../../../ui/ChalkFzfPrompter.js";
import {ChalkLogger} from "../../files/adapters/ChalkLogger.js";
import { NodeFS } from "../../files/adapters/NodeFS.js";
import isKebabCase from "../utils/isKebabCase.js";
import listDirFiles from "../utils/listDirFiles.js";
import showFileContent from "../utils/showFileContent.js";

export default async function createScssFile(base_path: string): Promise<string> {
  const logger = new ChalkLogger();
  const fs = new NodeFS();
  const prompter = new ChalkFzfPrompter();
  const ext = "scss";
  base_path = fs.join(base_path, ext);
  if (!(await fs.exists(base_path))) {
    await fs.mkdir(base_path);
    logger.info(`Created directory: ${base_path}`);
  }
  await listDirFiles(base_path);
  const name = await prompter.input({
    message: `Enter the ${ext} file name (without extension):`,
    asyncValidate: async (input) => {
      if (!input || input.trim() === "") {
        return "File name cannot be empty.";
      }
      if (!isKebabCase(input.trim())) {
        return "File name must be in kebab-case format.";
      }
      if (await fs.exists(fs.join(base_path, `${input.trim()}.${ext}`))) {
        return "A file with this name already exists.";
      }
    },
  });
  const filePath = fs.join(base_path, `${name.trim()}.${ext}`);
  const template = `.${name.trim()}{\n opacity: 0;\n}\n`;
  await fs.writeFile(filePath, template);
  logger.success(`${ext} file created at: ${filePath}`);
  await listDirFiles(base_path);
  await showFileContent(filePath);
  return filePath;
}
