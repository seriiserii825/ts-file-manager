// core/FileTypeRegistry.ts
import type { FileCreator, SelectOption } from "./types.js";

export class FileTypeRegistry {
  private map = new Map<string, FileCreator>();

  register(creator: FileCreator) {
    this.map.set(creator.id, creator);
    return this;
  }

  getOptions(): SelectOption[] {
    return Array.from(this.map.values()).map(c => ({ value: c.id, label: c.label }));
  }

  get(id: string): FileCreator | undefined {
    return this.map.get(id);
  }
}
