// Реализация FS через node:fs и node:path.
import path from "node:path";
import { promises as fsp } from "node:fs";
import {DirEntry, FS} from "../ports/Fs.js";

export class NodeFS implements FS {
  async readdir(dir: string): Promise<DirEntry[]> {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    return entries.map(e => ({ name: e.name, isDir: e.isDirectory(), isFile: e.isFile() }));
  }
  async mkdir(dir: string) { await fsp.mkdir(dir, { recursive: true }); }
  async writeFile(file: string, content: string) { await fsp.writeFile(file, content); }
  async rename(a: string, b: string) { await fsp.rename(a, b); }
  async rm(target: string) { await fsp.rm(target, { recursive: true, force: true }); }
  async exists(p: string) { try { await fsp.access(p); return true; } catch { return false; } }
  resolve = path.resolve.bind(path);
  dirname = path.dirname.bind(path);
  relative = path.relative.bind(path);
  isAbsolute = path.isAbsolute.bind(path);
  basename = path.basename.bind(path);
  join = path.join.bind(path);
}

