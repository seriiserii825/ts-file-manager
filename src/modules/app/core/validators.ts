// core/validators.ts
export function ensureNonEmpty(input: string): string | undefined {
  if (!input || input.trim() === "") return "File name cannot be empty.";
}

export function ensureKebabCase(input: string): string | undefined {
  const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!kebab.test(input.trim())) return "File name must be in kebab-case (e.g. section-title).";
}

export function ensureCamelCase(input: string): string | undefined {
  // a simple strict camelCase validator: starts with [a-z], then letters/digits, no separators
  const camel = /^[a-z][a-zA-Z0-9]*$/;
  if (!camel.test(input.trim())) return "File name must be in camelCase (e.g. sectionTitle).";
}

export function ensureJsIdentifier(input: string): string | undefined {
  // very basic identifier check (doesn't cover unicode/escape), good for CLI usage
  const id = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
  if (!id.test(input.trim())) return "Name must be a valid JS identifier.";
}
