// modules/files/
// ├─ ports/
// │  ├─ FS.ts                 // Интерфейс файловой системы
// │  ├─ Prompter.ts           // Интерфейс ввода/выбора (prompt/select)
// │  └─ Logger.ts             // Интерфейс логгера
// ├─ adapters/
// │  ├─ NodeFS.ts             // Реализация FS на node:fs
// │  ├─ FzfPrompter.ts        // Реализация Prompter через fzf/chalkInput
// │  └─ ChalkLogger.ts        // Реализация Logger через chalk
// ├─ core/
// │  ├─ TreeTypes.ts          // Типы узлов дерева
// │  ├─ NameSanitizer.ts      // Проверка имен (безопасность, формат)
// │  ├─ TreeBuilder.ts        // Построение дерева из FS
// │  ├─ TreeRenderer.ts       // Печать дерева + индексная карта
// │  ├─ FileActions.ts        // mkdir/mkfile/rename/delete
// │  └─ Navigator.ts          // Интерактивная навигация (цикл)
// └─ index.ts                 // Композиция (связывание адаптеров и ядра)
import { NodeFS } from "./adapters/NodeFS.js";
import { FzfPrompter } from "./adapters/FzfPrompter.js";
import { ChalkLogger } from "./adapters/ChalkLogger.js";
import { Navigator } from "./core/Navigator.js";

const fs = new NodeFS();
const prompter = new FzfPrompter();
const logger = new ChalkLogger();

export const navigator = new Navigator(fs, prompter, logger);
