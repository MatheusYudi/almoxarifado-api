export interface ILogger {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warning(...args: any[]): void;
}
