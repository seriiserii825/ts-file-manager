#!/usr/bin/env node

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
}

main();
