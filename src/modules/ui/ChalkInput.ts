import { text } from "@clack/prompts";

export default async function chalkInput<
  T extends {
    message: string;
    placeholder?: string;
    initialValue?: string;
    validate?: (value: string) => string | Error | undefined;
  }
>(data: T): Promise<string> {
  return String(await text(data));
}
