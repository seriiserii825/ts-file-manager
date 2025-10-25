import { NodeFS } from "../../files/adapters/NodeFS.js";
import { Bash } from "../../files/command/Bash.js";
import { JsonPath } from "../../paths/JsonPath.js";
import {TIncludeFile} from "../types/TInclude.js";
import { appendToFile } from "../utils/appendToFile.js";

export default async function includeScssFile(props: TIncludeFile): Promise<void> {
  const { file_path } = props;
  const fs = new NodeFS();
  const jp = new JsonPath();
  const theme_path = jp.getThemePath();
  let path_to_include = fs.relative(theme_path, file_path).replace(/\\/g, "/");
  path_to_include = path_to_include.replace(/\.scss$/, ""); // Remove .scss extension
  const file_where_to_include = "src/scss/my.scss";
  const template_to_include = `@use '${path_to_include}';`;

  const file_where_to_include_path = fs.join(theme_path, file_where_to_include);

  await appendToFile(file_where_to_include_path, template_to_include);
  await Bash.run(`cat "${file_where_to_include_path}"`, true); // Display the modified file content
}
