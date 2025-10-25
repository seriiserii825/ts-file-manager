import Select, { TSelectOne } from "../../classes/Select.js";
import { TMainMenuResponse } from "../../menus/types/TMainMenuResponse.js";
import { ChalkLogger } from "../files/adapters/ChalkLogger.js";
import createJsFile from "./modules/createJsFile.js";
import createPhpFile from "./modules/createPhpFile.js";
import createScssFile from "./modules/createScssFile.js";
import includePhpFile from "./modules/includePhpFile.js";
import includeScssFile from "./modules/includeScssFile.js";

export default async function appMenu(base_path: string, main_menu_choice: TMainMenuResponse) {
  const logger = new ChalkLogger();
  const file_types_options: TSelectOne[] = [
    { value: "php", label: "php" },
    { value: "js", label: "js" },
    { value: "scss", label: "scss" },
    { value: "icon", label: "icon (svg)" },
    { value: "exit", label: "exit" },
  ];

  const base_option = Select.selectOne("Select file type", file_types_options);
  switch (base_option) {
    case "php":
      logger.info("=== php");
      const file_path = await createPhpFile(base_path);
      await includePhpFile({ base_path, file_path, main_menu_choice });
      logger.success("PHP file created and included successfully.");
      return;
    case "js":
      logger.info("=== js");
      await createJsFile(base_path);
      return;
    case "scss":
      logger.info("=== scss");
      const created_scss_file_path = await createScssFile(base_path);
      await includeScssFile({ base_path, file_path: created_scss_file_path, main_menu_choice });
      return;
    case "icon":
      console.log(`You selected icon (svg) files in ${base_path}`);
      return;
    case "exit":
      logger.error("Exiting the application.");
      return;
  }
}
