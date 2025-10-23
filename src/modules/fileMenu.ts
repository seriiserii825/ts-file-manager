import chalk from "chalk";
import UrlsManager from "./getDomain.js";
import { TOption } from "../types/TOption.js";
import Select from "../classes/Select.js";

export default async function fileMenu(): Promise<string | undefined> {
  while (true) {
    const message = "File Menu: choose an action";
    const options = [
      { label: "1.Select", value: "select" },
      { label: "2.View", value: "list" },
      { label: "3.Add", value: "add" },
      { label: "4.Edit", value: "edit" },
      { label: "5.Delete", value: "remove" },
      { label: "6.Clear", value: "clear" },
      { label: "7.Exit", value: "exit" },
    ] as const satisfies readonly TOption[];

    const action = Select.selectOne(message, options); // ✅ action is the union

    try {
      if (action === "list") await UrlsManager.list();
      else if (action === "select") {
        const url = await UrlsManager.select();
        return url;
      } else if (action === "add") {
        await UrlsManager.add();
        await UrlsManager.list();
      } else if (action === "edit") await UrlsManager.edit();
      else if (action === "remove") await UrlsManager.remove();
      else if (action === "clear") await UrlsManager.clear();
      else if (action === "exit") break;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(chalk.red("Ошибка:"), msg);
    }
  }
}
