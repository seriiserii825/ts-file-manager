import Select, { TSelectOne } from "../../classes/Select.js";
import { ChalkLogger } from "../files/adapters/ChalkLogger.js";
import createJsFile from "./modules/createJsFile.js";
import createPhpFile from "./modules/createPhpFile.js";

export default async function appMenu(base_path: string) {
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
      await createPhpFile(base_path);
      return;
    case "js":
      logger.info("=== js");
      await createJsFile(base_path);
      return;
    case "scss":
      console.log(`You selected scss files in ${base_path}`);
      return;
    case "icon":
      console.log(`You selected icon (svg) files in ${base_path}`);
      return;
    case "exit":
      logger.error("Exiting the application.");
      return;
  }
}
