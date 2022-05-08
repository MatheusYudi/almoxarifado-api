// Types
import { TObject } from "@common/types";

/**
 * ObjectUtils
 *
 * Classe de utils para tratamento de objetos
 */
export class ObjectUtils {
    /**
     * isObject
     *
     * Verifica se o argumento passado tem o tipo primitivo 'object'
     *
     * @param value - Valor a ser validado
     *
     * @returns É um objeto
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static isObject(value: any): boolean {
        const type = typeof value;
        return (
            (type === "function" || type === "object") &&
            !!value &&
            value.constructor === Object
        );
    }

    /**
     * clearData
     *
     * Limpa todos os campos sem valor do objeto (primeiro nível)
     *
     * @param value - Valor a ser manipulado
     *
     * @returns Objeto tratado
     */
    public static clearData(value: TObject): TObject {
        const response: TObject = { ...value };

        Object.keys(response).forEach((key: string) => {
            // Ignora valores 'false' e '0'
            if (
                !response[key] &&
                response[key] !== 0 &&
                response[key] !== false
            ) {
                delete response[key];
            }
        });

        return response;
    }
}
