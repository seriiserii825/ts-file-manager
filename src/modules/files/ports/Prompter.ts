// Интерфейс для input/select. Реализация может быть через fzf/ink/любое UI.
export interface Prompter {
  input(opts: { message: string; placeholder?: string; defaultValue?: string }): Promise<string>;
  select<T extends readonly { label: string; value: string }[]>(
    message: string,
    options: T
  ): T[number]["value"]; // может быть sync (execSync), ядру всё равно
}

