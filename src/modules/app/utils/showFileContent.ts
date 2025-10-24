import {Bash} from "../../files/command/Bash.js";

export default async function showFileContent(file_path: string) {
  console.log(`\n--- Content of ${file_path} ---\n`);
  await Bash.run(`bat "${file_path}"`, true);
}
