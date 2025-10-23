// modules/files/FileHandle.ts
import path from "node:path";
import { promises as fsp } from "node:fs";
import chalkInput from "../ui/ChalkInput.js";
import Select from "../../classes/Select.js";

type ChooseCreate = "choose" | "create";

export class FileHandle {
  // ---- helpers -------------------------------------------------------------

  /** Defend against traversal and weird chars; allow nested segments if wanted */
  static sanitizeName(name: string, { allowNested = false } = {}) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Folder name cannot be empty.");

    // no absolute paths
    if (path.isAbsolute(trimmed)) throw new Error("Please provide a relative folder name.");

    // block traversal
    if (trimmed.split(path.sep).some((seg) => seg === ".."))
      throw new Error("Folder name cannot contain '..'.");

    const segmentRe = /^[a-zA-Z0-9._-]+$/;
    const segments = trimmed.split(path.sep);
    if (!allowNested && segments.length > 1) {
      throw new Error("Nested paths are not allowed here.");
    }
    for (const seg of segments) {
      if (!segmentRe.test(seg)) {
        throw new Error(`Illegal folder segment: "${seg}". Use letters, numbers, . _ -`);
      }
    }
    return trimmed;
  }

  static async ensureDir(dir: string) {
    await fsp.mkdir(dir, { recursive: true });
    return dir;
  }

  static async pathExists(p: string) {
    try {
      await fsp.access(p);
      return true;
    } catch {
      return false;
    }
  }

  // ---- listings ------------------------------------------------------------

  static async listDirForDirs(basePath: string): Promise<string[]> {
    const entries = await fsp.readdir(basePath, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort(Intl.Collator().compare);
  }

  static async listDirForFiles(basePath: string): Promise<string[]> {
    const entries = await fsp.readdir(basePath, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .sort(Intl.Collator().compare);
  }

  // ---- selection & creation ------------------------------------------------

  static async chooseDir(basePath: string): Promise<string> {
    const dirs = await FileHandle.listDirForDirs(basePath);

    if (dirs.length === 0) {
      // no dirs → fall back to create
      return await FileHandle.createDir(basePath);
    }

    const value = Select.selectOne(
      "Select a directory:",
      dirs.map((d) => ({ label: d, value: d }))
    );

    // Return absolute path
    return path.resolve(basePath, String(value));
  }

  static async chooseOrCreateDir(): Promise<ChooseCreate> {
    const choice = Select.selectOne("Choose an option:", [
      { label: "Choose existing directory", value: "choose" },
      { label: "Create new directory", value: "create" },
    ]);
    return choice as ChooseCreate;
  }

  /**
   * Create a dir under basePath. If `name` not provided, prompt the user.
   * Returns the absolute path.
   */
  static async createDir(basePath: string, name?: string, opts?: { allowNested?: boolean }) {
    let message = "Enter the name for the new directory:";
    if (opts?.allowNested === true) {
      message = "Enter the name for the new directory (can be nested), like folder1/folder2 :";
    }
    const dirName =
      name ??
      (await chalkInput({
        message,
        placeholder: "NewDirectory",
      }));

    const clean = FileHandle.sanitizeName(dirName, { allowNested: opts?.allowNested === true });
    const full = path.resolve(basePath, clean);

    await FileHandle.ensureDir(full);
    return full;
  }

  /**
   * High-level helper: choose or create under basePath.
   * Returns the chosen/created absolute path.
   */
  static async chooseOrCreateUnder(basePath: string, opts?: { allowNested?: boolean }) {
    const action = await FileHandle.chooseOrCreateDir();
    if (action === "choose") {
      return await FileHandle.chooseDir(basePath);
    }
    return await FileHandle.createDir(basePath, undefined, opts);
  }
}
