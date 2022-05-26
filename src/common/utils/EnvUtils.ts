/**
 * EnvUtils
 *
 * Classe de utils para tratamento de ambiente
 */
export class EnvUtils {
    /**
     * isProduction
     *
     * Retorna `true` se o ambiente for de produção
     *
     * @returns É produção
     */
    public static isProduction(): boolean {
        return process.env.NODE_ENV === "production";
    }

    /**
     * isDevelopment
     *
     * Retorna `true` se o ambiente for de desenvolvimento
     *
     * @returns É desenvolvimento
     */
    public static isDevelopment(): boolean {
        return process.env.NODE_ENV === "development";
    }
}
