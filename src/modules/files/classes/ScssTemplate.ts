import { toKebab } from "../helpers/toKebab.js";
import { ITemplate } from "../interfaces/ITemplate.js";

export class ScssTemplate implements ITemplate {
  generate(name: string): string {
    return `/* ${name}.scss */
.${toKebab(name)} {
  // styles
}
`;
  }
}
