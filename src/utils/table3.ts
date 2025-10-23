// table3.ts
import pkg from "cli-table3";

type Cell = string | number | boolean | null | undefined;

// совместимость CJS/ESM для cli-table3
const TableCtor: any = (pkg as any).default ?? (pkg as any);

const toStr = (v: unknown): string => (v ?? "").toString();

type TupleStrings<K extends readonly unknown[]> = { [I in keyof K]: string };
type TupleNumbers<K extends readonly unknown[]> = { [I in keyof K]: number };

export interface Table3GenericOptions<T, K extends readonly (keyof T)[]> {
  /** Заголовки; по умолчанию = String(columns[i]) */
  head?: Readonly<TupleStrings<K>>;
  /** Ширины колонок; длина точно как у columns */
  colWidths?: Readonly<TupleNumbers<K>>;
  /** Перенос слов */
  wordWrap?: boolean;
}

/**
 * Генерик-таблица:
 * - rows: массив записей T
 * - columns: кортеж ключей из T, порядок задаёт порядок колонок
 * - opts: заголовки/ширины/перенос; заголовки по умолчанию = имена ключей
 *
 * Возвращает готовую строку таблицы (печатай снаружи).
 */
export default function table3<
  T extends Record<string | number | symbol, unknown>,
  const K extends readonly (keyof T)[]
>(rows: ReadonlyArray<T>, columns: K, opts: Table3GenericOptions<T, K> = {}): string {
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new TypeError(`"columns" must be a non-empty array of keys`);
  }

  const head: Readonly<TupleStrings<K>> =
    (opts.head as Readonly<TupleStrings<K>> | undefined) ??
    (columns.map((c) => String(c)) as unknown as Readonly<TupleStrings<K>>);

  // соберём базовый конфиг
  const cfg: any = {
    head,
    wordWrap: opts.wordWrap ?? true,
  };

  // colWidths подключаем только если заданы (cli-table3 это любит)
  if (opts.colWidths) cfg.colWidths = opts.colWidths;

  const t = new TableCtor(cfg);

  for (const row of rows) {
    const line = columns.map((key) => toStr(row[key]));
    t.push(line);
  }

  return t.toString();
}
