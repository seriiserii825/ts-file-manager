import {TMainMenuResponse} from "../../../menus/types/TMainMenuResponse.js";
import {FS} from "../../files/ports/Fs.js";
import {Logger} from "../../files/ports/Logger.js";
import {Prompter} from "../../files/ports/Prompter.js";

export type CreateContext = {
  fs: FS;
  prompter: Prompter;
  logger: Logger;
  mainMenuChoice: TMainMenuResponse;
};

export type SelectOption = { value: string; label: string };

export interface FileCreator {
  /** Короткий ключ, попадает в меню */
  readonly id: string;
  /** Человекочитаемая метка */
  readonly label: string;
  /** Выполняет создание файла (и post-create шаги) */
  run(basePath: string, ctx: CreateContext): Promise<void>;
}
