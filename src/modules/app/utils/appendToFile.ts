import { ChalkLogger } from "../../files/adapters/ChalkLogger.js";
import { NodeFS } from "../../files/adapters/NodeFS.js";
export async function appendToFile(filePath: string, content: string) {
  const fs = new NodeFS();
  const logger = new ChalkLogger();
  try {
    await fs.appendFile(filePath, content + "\n", "utf8");
    logger.success(`✅ Successfully added to file: ${filePath}`);
  } catch (err: any) {
    console.error(`❌ Error while adding to file: ${err.message}`);
  }
}
