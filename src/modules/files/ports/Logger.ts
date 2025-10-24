// Интерфейс логгера: ядро просто вызывает методы.
export interface Logger {
  info(msg: string): void;     // для папок
  success(msg: string): void;  // для файлов
  warn(msg: string): void;
  error(msg: string): void;
}
