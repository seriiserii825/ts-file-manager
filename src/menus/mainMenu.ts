import Select from "../classes/Select.js";
import {TOption} from "../types/TOption.js";
import {TMainMenuResponse} from "./types/TMainMenuResponse.js";

export default async function mainMenu(): Promise<TMainMenuResponse> {
  const message = "Select an option:";
  const options: TOption[] = [
    { label: "1.Module", value: "module" },
    { label: "2.Component", value: "component" },
    { label: "3.Ui", value: "ui" },
    { label: "4.Exit", value: "exit" },
  ];
  
  const choice = Select.selectOne(message, options) as TMainMenuResponse;
  return choice;
}
