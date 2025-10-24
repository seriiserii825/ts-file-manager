// Правила проверки имен: запрещаем абсолютные пути, '..', неподходящие символы и т.д.

import { FS } from "../ports/Fs.js";

export class NameSanitizer {
  constructor(private fs: FS) {}

  sanitize(name: string, allowNested = false): string {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Имя не может быть пустым.");
    if (this.fs.isAbsolute(trimmed))
      throw new Error("Нужно относительное имя (не абсолютный путь).");
    if (trimmed.split("/").some((seg) => seg === ".."))
      throw new Error("Имя не может содержать '..'.");

    const segmentRe = /^[a-zA-Z0-9._-]+$/;
    const segments = trimmed.split("/");
    if (!allowNested && segments.length > 1) throw new Error("Вложенные сегменты запрещены.");

    for (const seg of segments) {
      if (!segmentRe.test(seg)) throw new Error(`Недопустимый сегмент: "${seg}"`);
    }
    return trimmed;
  }
}
