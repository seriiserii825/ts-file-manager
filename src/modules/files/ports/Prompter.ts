// ports/Prompter.ts
type BaseInputOpts = {
  message: string;
  placeholder?: string;
  defaultValue?: string;
};

export interface Prompter {
  // Любые доп. поля поверх BaseInputOpts допустимы
  input<T extends BaseInputOpts>(opts: T): Promise<string>;
  select<T extends readonly { label: string; value: string }[]>(
    message: string,
    options: T
  ): Promise<T[number]["value"]>;
}
