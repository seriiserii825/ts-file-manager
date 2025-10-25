// main.ts
import mainMenu from "./menus/mainMenu.js";
import appMenu from "./modules/app/index.js";
import {CreateEntity} from "./modules/app/modules/CreateEntity.js";
import { EnsureIsWp } from "./modules/ensure/EnsureIsWp.js";
import { AppPaths } from "./modules/paths/AppPaths.js";
import { JsonPath } from "./modules/paths/JsonPath.js";

async function main() {
  const app_path = new AppPaths();
  new EnsureIsWp(app_path.getThemeDir()); // throws if not WP
  const jp = new JsonPath();

  const menu_choice = await mainMenu();

  switch (menu_choice) {
    case "module": {
      const entity_path = await new CreateEntity(jp.getModulesPath()).run();
      if (!entity_path) return;
      appMenu(entity_path, "module")
      return
    }
    case "component":
      return
    case "ui":
      return
    case "exit":
      return;
  }
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
