import { ChalkLogger } from "../files/adapters/ChalkLogger.js";
import { NodeFS } from "../files/adapters/NodeFS.js";
import { ChalkFzfPrompter } from "../../ui/ChalkFzfPrompter.js";
import type { TMainMenuResponse } from "../../menus/types/TMainMenuResponse.js";

import { FileTypeRegistry } from "./core/FileTypeRegistry.js";
import { PhpCreator } from "./creators/PhpCreator.js";
import { JsCreator } from "./creators/JsCreator.js";
import { ScssCreator } from "./creators/ScssCreator.js";
import {renderTree} from "./utils/renderTree.js";

export default async function appMenu(basePath: string, mainMenuChoice: TMainMenuResponse) {
  const logger = new ChalkLogger();
  const fs = new NodeFS();
  const prompter = new ChalkFzfPrompter();

  // Регистрируем стратегии
  const registry = new FileTypeRegistry()
    .register(new PhpCreator())
    .register(new JsCreator())
    .register(new ScssCreator());
  // .register(new IconCreator()) и т.д.

  await renderTree(basePath)

  const options = [
    ...registry.getOptions(),
    { value: "icon", label: "icon (svg)" },
    { value: "exit", label: "exit" },
  ];

  const choice = await prompter.select("Select file type", options)

  if (choice === "exit") {
    logger.error("Exiting the application.");
    return;
  }
  if (choice === "icon") {
    logger.info(`You selected icon (svg) files in ${basePath}`);
    return;
  }

  const creator = registry.get(choice);
  if (!creator) {
    logger.error(`Unknown file type: ${choice}`);
    return;
  }

  // Контекст для стратегий
  const ctx = { fs, prompter, logger, mainMenuChoice, basePath };

  // Вызов выбранной стратегии
  await creator.run(basePath, ctx as any);
}
