import { NodeFS } from "../../files/adapters/NodeFS.js";
import { Bash } from "../../files/command/Bash.js";
import { JsonPath } from "../../paths/JsonPath.js";
import { TIncludePhp } from "../types/TIncludePhp.js";
import { appendToFile } from "../utils/appendToFile.js";

export default async function includeScssFile(props: TIncludePhp): Promise<void> {
  const { file_path, main_menu_choice } = props;
  const fs = new NodeFS();
  const jp = new JsonPath();
  const theme_path = jp.getThemePath();
  const created_file_name = fs.basename(file_path, ".scss");
  const created_file_path = fs.join(main_menu_choice, created_file_name);
  const file_to_include = "src/scss/my.scss";
  const template_to_include = `@use '${created_file_path}';`;

  const file_to_include_path = fs.join(theme_path, file_to_include);

  await appendToFile(file_to_include_path, template_to_include);
  await Bash.run(`cat "${file_to_include_path}"`, true); // Display the modified file content
}
