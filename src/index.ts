#!/usr/bin/env node

import fileMenu from "./menus/fileMenu.js";
import mainMenu from "./menus/mainMenu.js";
import { EnsureIsWp } from "./modules/ensure/EnsureIsWp.js";
import { AppPaths } from "./modules/paths/AppPaths.js";
import { JsonPath } from "./modules/paths/JsonPath.js";

async function main() {
  const app_path = new AppPaths();
  new EnsureIsWp(app_path.getThemeDir());
  new JsonPath();

  const menu_choice = await mainMenu();
  switch (menu_choice) {
    case "module":
      console.log("Module selected");
      break;
    case "component":
      console.log("Component selected");
      break;
    case "ui":
      console.log("UI selected");
      break;
    case "exit":
      console.log("Exiting...");
      return
  }

  const file_menu_choice = await fileMenu();
  console.log("file_menu_choice", file_menu_choice);
}

main();
