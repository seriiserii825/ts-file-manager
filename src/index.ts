// main.ts
import mainMenu from "./menus/mainMenu.js";
import appMenu from "./modules/app/index.js";
import { EnsureIsWp } from "./modules/ensure/EnsureIsWp.js";
import { navigator } from "./modules/files/index.js";
import { AppPaths } from "./modules/paths/AppPaths.js";
import { JsonPath } from "./modules/paths/JsonPath.js";

async function main() {
  const app_path = new AppPaths();
  new EnsureIsWp(app_path.getThemeDir()); // throws if not WP
  const jp = new JsonPath();

  const menu_choice = await mainMenu();

  switch (menu_choice) {
    case "module": {
      appMenu(jp.getModulesPath())
    }
    case "component":
      console.log("Component selected");
      break;
    case "ui":
      console.log("UI selected");
      break;
    case "exit":
      console.log("Exiting...");
      return;
  }
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
