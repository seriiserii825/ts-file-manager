import { ITemplate } from "../interfaces/ITemplate.js";

export class PhpTemplate implements ITemplate {
  generate(name: string): string {
    return `<?php
      defined('ABSPATH') || exit;`;
  }
}
