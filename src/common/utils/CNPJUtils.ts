/**
 * CNPJUtils
 *
 * Métodos para tratamento de CNPJ
 */
export class CNPJUtils {
    /**
     * isValid
     *
     * Verifica se é um CNPJ válido
     *
     * Exemplo e regras do site da receita federal
     *
     * @param { string } cnpj - Valor do CNPJ
     *
     * @returns { boolean } Retorna `true` caso o CNPJ seja válido e `false` caso não.
     */
    public static isValid(cnpj: string): boolean {
        if (!cnpj) {
            return false;
        }

        const cnpjWithoutMask: string = cnpj.replace(/[^\d]+/g, "");

        if (cnpjWithoutMask.length !== 14) {
            return false;
        }

        if (CNPJUtils.isRepeated(cnpjWithoutMask)) {
            return false;
        }

        return CNPJUtils.isCheckerDigitValid(cnpjWithoutMask);
    }

    /**
     * isRepeated
     *
     * Verifica se todos os dígitos são iguais
     *
     * @param { string } cnpj - Valor do CNPJ
     *
     * @returns { boolean } Retorna `true` caso o CNPJ seja composto de números repetidos e `false` caso não.
     */
    private static isRepeated(cnpj: string): boolean {
        return cnpj === cnpj[0]?.repeat(14);
    }

    /**
     * isCheckerDigitValid
     *
     * Verifica se os dígitos verificadores são válidos
     *
     * @param { string } cnpj - Valor do CNPJ
     *
     * @returns { boolean } Retorna `true` caso os dígitos sejam válidos e `false` caso não.
     */
    private static isCheckerDigitValid(cnpj: string): boolean {
        const weights: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let acc: number;
        let index: number;

        // Primeiro dígito verificador
        for (index = 0, acc = 0; index < 12; index += 1) {
            acc += parseInt(cnpj[index], 10) * weights[index + 1];
        }

        acc %= 11;

        if (parseInt(cnpj[12], 10) !== (acc < 2 ? 0 : 11 - acc)) {
            return false;
        }

        // Segundo dígito verificador
        for (index = 0, acc = 0; index < 13; index += 1) {
            acc += parseInt(cnpj[index], 10) * weights[index];
        }

        acc %= 11;

        if (parseInt(cnpj[13], 10) !== (acc < 2 ? 0 : 11 - acc)) {
            return false;
        }

        return true;
    }
}
