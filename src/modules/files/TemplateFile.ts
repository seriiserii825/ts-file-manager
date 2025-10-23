import { ITemplate } from "./interfaces/ITemplate.js";
import { PhpTemplate } from "./classes/PhpTemplate.js";
import { ScssTemplate } from "./classes/ScssTemplate.js";
import { TsTemplate } from "./classes/TsTemplate.js";
export class TemplateFile {
  private templateRegistry: Record<string, ITemplate> = {
    php: new PhpTemplate(),
    scss: new ScssTemplate(),
    ts: new TsTemplate(),
  };

  getTemplate(fileName: string): string | null {
    const ext = fileName.split('.').pop();
    const template = ext ? this.templateRegistry[ext] : undefined;
    if (template) {
      return template.generate(fileName);
    }
    return null;
  }
}
