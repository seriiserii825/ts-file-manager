import clipboard from "clipboardy";

export default class ClipboardManager {
  static async write(text: string): Promise<void> {
    await clipboard.write(text);
  }

  static async read(): Promise<string> {
    return await clipboard.read();
  }
}
