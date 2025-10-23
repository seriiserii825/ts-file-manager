// main.ts
import mainMenu from "./menus/mainMenu.js";
import { EnsureIsWp } from "./modules/ensure/EnsureIsWp.js";
import { FileHandle } from "./modules/files/FileHandle.js";
import { AppPaths } from "./modules/paths/AppPaths.js";
import { JsonPath } from "./modules/paths/JsonPath.js";

async function main() {
  const app_path = new AppPaths();
  new EnsureIsWp(app_path.getThemeDir()); // throws if not WP
  const jp = new JsonPath();

  const menu_choice = await mainMenu();

  switch (menu_choice) {
    case "module": {
      console.log("Module selected");
      const base = jp.getPath("modules"); // absolute base path to modules
      const path = await FileHandle.chooseFromIndexedTree(base)
      console.log("path", path);
      // await FileHandle.listDirsTree(base);
      // FileHandle.listDirsFromDir(base)
      // const selected = await FileHandle.chooseOrCreateUnder(base, { allowNested: true });
      // console.log("selected", selected);
      // await FileHandle.listDirsTree(base);
      // break;
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

main().catch(err => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
