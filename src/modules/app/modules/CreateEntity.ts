import { TOption } from "../../../types/TOption.js";
import { ChalkFzfPrompter } from "../../../ui/ChalkFzfPrompter.js";
import { ChalkLogger } from "../../files/adapters/ChalkLogger.js";
import { NodeFS } from "../../files/adapters/NodeFS.js";
import { FS } from "../../files/ports/Fs.js";
import { Logger } from "../../files/ports/Logger.js";
import { Prompter } from "../../files/ports/Prompter.js";
import { getLsDirs } from "../utils/getLsDirs.js";
import { listDirs } from "../utils/listDirs.js";

export class CreateEntity {
  private base_path: string;
  private new_dir_path: string;
  private logger: Logger;
  private prompter: Prompter;
  private fs: FS;
  constructor(base_path: string) {
    this.base_path = base_path;
    this.new_dir_path = "";
    this.logger = new ChalkLogger();
    this.prompter = new ChalkFzfPrompter();
    this.fs = new NodeFS();
  }
  async run(): Promise<string | undefined> {
    await listDirs(this.base_path);
    let choices = [
      { value: "create", label: "Create a new directory" },
      { value: "select", label: "Select an existing directory" },
    ];
    const current_path_dirs = await getLsDirs(this.base_path);
    if (current_path_dirs.length === 0) {
      this.logger.info("No directories found in the current path.");
      choices = [{ value: "create", label: "Create a new directory" }];
    }

    const action = await this.prompter.select("What would you like to do?", choices);

    if (action === "create") {
      const new_dir_name = await this.prompter.input({
        message: "Enter the name of the new directory to create:",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Directory name cannot be empty.";
          }
          if (current_path_dirs.includes(input.trim())) {
            return "A directory with this name already exists.";
          }
        },
      });
      this.logger.info(`Creating new directory: ${new_dir_name}`);
      this.new_dir_path = this.base_path + "/" + new_dir_name;
      await this.fs.mkdir(this.new_dir_path);
      await listDirs(this.base_path);
    } else {
      const dirs_options: TOption[] = current_path_dirs.map((dir) => ({ value: dir, label: dir }));
      const selected_dir = await this.prompter.select(
        "Select a directory to create the entity in:",
        dirs_options
      );
      this.logger.info(`You selected: ${selected_dir}`);
      this.new_dir_path = this.base_path + "/" + selected_dir;
    }
    return this.new_dir_path;
  }
}
