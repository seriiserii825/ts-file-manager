export default function isKebabCase(str: string): boolean {
  return /^[a-z]+(-[a-z0-9]+)*$/.test(str);
}
