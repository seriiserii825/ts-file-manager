import Select, { TSelectOne } from "../../../classes/Select.js";
import { NodeFS } from "../../files/adapters/NodeFS.js";
import { Bash } from "../../files/command/Bash.js";
import { JsonPath } from "../../paths/JsonPath.js";
import { TIncludePhp } from "../types/TIncludePhp.js";
import { getLsFiles } from "../utils/getLsFiles.js";
import { insertBeforeMarker } from "../utils/insertBeforeMarker.js";

export default async function includePhpFile(props: TIncludePhp): Promise<void> {
  const { file_path, main_menu_choice } = props;
  const fs = new NodeFS();
  const jp = new JsonPath();
  const theme_path = jp.getThemePath();
  const theme_root_files = await getLsFiles(theme_path, ".php");
  const created_file_name = fs.basename(file_path, ".php");
  const created_file_path = fs.join(main_menu_choice, created_file_name);
  const template_to_include = `<?php get_template_part( '${created_file_path}' ); ?>`;
  if (!theme_root_files) {
    console.log("No PHP files found in the theme root directory.");
    return;
  }
  const options_files: TSelectOne[] = theme_root_files.map((file_name) => {
    return { value: file_name, label: file_name };
  });
  const selected_file = Select.selectOne("Select a PHP file to include", options_files);
  const file_to_include_path = fs.join(theme_path, selected_file);
  await insertBeforeMarker(file_to_include_path, "get_footer", template_to_include);
  await Bash.run(`cat "${file_to_include_path}"`, true); // Display the modified file content
}
