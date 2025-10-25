// JsonPath.ts (фрагмент с доработками)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { TJsonPath } from "./TJsonPath.js";

type TBase = "cwd" | "cwdParent" | string;

export class JsonPath {
  private _filename!: string;
  private _dirname!: string;
  public cwd!: string;
  public CONFIG_FILE!: string;

  constructor() {
    this._filename = fileURLToPath(import.meta.url);
    this._dirname = path.dirname(this._filename);
    this.cwd = process.cwd();
    this.CONFIG_FILE = path.join(this._dirname, "paths.json");
    if (!fs.existsSync(this.CONFIG_FILE)) {
      fs.writeFileSync(
        this.CONFIG_FILE,
        JSON.stringify(
          {
            modules: "",
            components: "",
            ui: "",
          },
          null,
          2
        ),
        "utf8"
      );
    }
    this.setResourcePaths();
  }

  // --- НОВОЕ: универсальный выбор базовой директории
  private resolveBaseDir(base: TBase): string {
    if (base === "cwd") return this.cwd;
    if (base === "cwdParent") return path.dirname(this.cwd);
    // если передали произвольный путь
    return path.isAbsolute(base) ? path.resolve(base) : path.resolve(this.cwd, base);
  }

  setPath(key: TJsonPath, value: string): void {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`Key "${key}" must be a non-empty string`);
    }
    const raw = fs.readFileSync(this.CONFIG_FILE, "utf8");
    let cfg: Record<string, string>;
    try {
      cfg = JSON.parse(raw);
    } catch (e: any) {
      throw new Error(`paths.json: invalid JSON. ${e.message}`);
    }
    cfg[key] = value;
    fs.writeFileSync(this.CONFIG_FILE, JSON.stringify(cfg, null, 2), "utf8");
  }

  getPath(key: TJsonPath): string {
    const raw = fs.readFileSync(this.CONFIG_FILE, "utf8");
    try {
      const cfg = JSON.parse(raw) as Record<string, string>;
      return cfg[key];
    } catch (e: any) {
      throw new Error(`paths.json: invalid JSON. ${e.message}`);
    }
  }

  getModulesPath(): string {
    return this.getPath("modules");
  }
  getComponentsPath(): string {
    return this.getPath("components");
  }
  getUiPath(): string {
    return this.getPath("ui");
  }

  getThemePath(): string {
    return this.cwd;
  }

  setResourcePaths(base: TBase = "cwd"): void {
    const baseDir = this.resolveBaseDir(base);
    (["modules", "components", "ui"] as const).forEach((key) => {
      const fullPath = path.join(baseDir, `app/${key}`);
      this.setPath(key, fullPath);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }
}
