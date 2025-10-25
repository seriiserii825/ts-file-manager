import { promises as fsp } from "node:fs";

export async function insertBeforeMarker(
  filePath: string,
  phpFn: string,
  contentToInsert: string
): Promise<void> {
  const data = await fsp.readFile(filePath, "utf8");

  const EOL = data.includes("\r\n") ? "\r\n" : "\n";

  const re = new RegExp(
    String.raw`^[ \t]*<\?php[^\n]*?\b${phpFn}\s*\(.*?\)\s*;?[^\n]*?\?>?`,
    "m"
  );

  const m = re.exec(data);
  if (!m) {
    throw new Error(`Не найдена строка с вызовом ${phpFn}() в ${filePath}`);
  }

  // Начало строки с get_footer — это m.index (так как ^ с флагом m матчится с началом строки)
  const insertPos = m.index;

  // Формируем новый контент: всё до начала строки + вставка + перевод строки (если нужно) + хвост
  let before = data.slice(0, insertPos);
  let after = data.slice(insertPos);

  // гарантируем, что перед вставкой есть перенос (если блок до этого не оканчивается переводом)
  if (before.length && !before.endsWith("\n") && !before.endsWith("\r")) {
    before += EOL;
  }

  // гарантируем, что после вставки будет перенос (если вставляемый текст не заканчивается переводом)
  let insert = contentToInsert;
  if (!insert.endsWith("\n") && !insert.endsWith("\r")) {
    insert += EOL;
  }

  const newData = before + insert + after;
  await fsp.writeFile(filePath, newData, "utf8");
}
