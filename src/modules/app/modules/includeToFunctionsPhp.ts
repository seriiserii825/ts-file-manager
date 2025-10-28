import { NodeFS } from "../../files/adapters/NodeFS.js";
import { Bash } from "../../files/command/Bash.js";
import { JsonPath } from "../../paths/JsonPath.js";
import {appendToFile} from "../utils/appendToFile.js";

export default async function includeToFunctionsPhp(file_path: string): Promise<void> {
  const fs = new NodeFS();
  const jp = new JsonPath();
  const theme_path = jp.getThemePath();
  let path_to_include = fs.relative(theme_path, file_path).replace(/\\/g, "/");
  path_to_include = path_to_include.replace(/\.php$/, ""); // Remove .php extension
  const template_to_include = `require_once __DIR__ . '/${path_to_include}';`;
  const file_to_include_path = fs.join(theme_path, "functions.php");
  await appendToFile(file_to_include_path, `${template_to_include}\n`);
  await Bash.run(`cat "${file_to_include_path}"`, true); // Display the modified file content
}
