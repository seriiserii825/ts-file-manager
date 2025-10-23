import Select from "../classes/Select.js";
import {TOption} from "../types/TOption.js";
import {TFileMenuResponse} from "./types/TFileMenuResponse.js";

export default async function mainMenu(): Promise<TFileMenuResponse> {
  const message = "Select an file type:";
  const options: TOption[] = [
    { label: "1.Php", value: "php" },
    { label: "2.Scss", value: "scss" },
    { label: "3.Typescript", value: "ts" },
    { label: "4.Exit", value: "exit" },
  ];
  
  const choice = Select.selectOne(message, options) as TFileMenuResponse;
  return choice;
}
