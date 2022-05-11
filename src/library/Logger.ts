// Libs
import { Request, Response, NextFunction } from "express";

// Interfaces
import { ILogger } from "@common/interfaces";

/**
 * Logger
 *
 * Classe para tratamento de logs
 */
export class Logger implements ILogger {
    /**
     * middleware
     *
     * Exibe logs de middleware
     *
     * @param req - Requisição
     * @param _res - Resposta da requisição
     * @param next - Callback
     */
    public static middleware(req: Request, _res: Response, next: NextFunction): void {
        const logger: Logger = new Logger();

        logger.log("\x1b[1m- Log ::\x1b[0m", "Request:", req.method, req.path);

        next();
    }

    /**
     * log
     *
     * Exibe logs
     *
     * @param args - Lista de argumentos
     */
    public log(...args: any[]): void {
        // eslint-disable-next-line no-console
        console.log(...args);
    }

    /**
     * error
     *
     * Exibe logs de erro
     *
     * @param args - Lista de argumentos
     */
    public error(...args: any[]): void {
        this.log("\x1b[31m ✖\x1b[0m \x1b[41m\x1b[37m\x1b[1m Error \x1b[0m\x1b[31m ::", ...args, "\x1b[0m");
    }

    /**
     * warning
     *
     * Exibe logs de aviso
     *
     * @param args - Lista de argumentos
     */
    public warning(...args: any[]): void {
        this.log("\x1b[33m ✖\x1b[0m \x1b[43m\x1b[30m\x1b[1m Warning \x1b[0m\x1b[33m ::", ...args, "\x1b[0m");
    }
}
