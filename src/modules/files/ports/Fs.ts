// modules/files/ports/FS.ts
// Интерфейс абстракции над файловой системой.
// Core не знает, node это или in-memory — ему всё равно.
export interface DirEntry {
  name: string;
  isDir: boolean;
  isFile: boolean;
}
export interface FS {
  readdir(dir: string): Promise<DirEntry[]>;
  mkdir(dir: string): Promise<void>;
  writeFile(file: string, content: string): Promise<void>;
  rename(oldPath: string, newPath: string): Promise<void>;
  rm(target: string): Promise<void>; // рекурсивное удаление ок
  exists(p: string): Promise<boolean>;
  resolve(...parts: string[]): string;
  dirname(p: string): string;
  relative(from: string, to: string): string;
  isAbsolute(p: string): boolean;
  join(...parts: string[]): string;
}
