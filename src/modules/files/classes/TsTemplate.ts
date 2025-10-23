import toCamel from "../helpers/toCamel.js";
import { ITemplate } from "../interfaces/ITemplate.js";

export class TsTemplate implements ITemplate {
  generate(name: string): string {
    return `// ${name}.ts
export function ${toCamel(name)}() {
  console.log("${name} ready");
}
`;
  }
}
