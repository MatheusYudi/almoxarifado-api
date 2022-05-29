/**
 * CPFUtils
 *
 * Classe de utils para tratamento de CPF
 */
export class CPFUtils {
    /**
     * isValid
     *
     * Verifica se é um CPF válido
     *
     * Exemplo e regras do site da receita federal
     *
     * @param { string } cpf - Valor do CPF
     * @returns { boolean } Retorna `true` caso o CPF seja válido e `false` caso não.
     */
    public static isValid(cpf: string): boolean {
        if (!cpf) {
            return false;
        }

        const cpfWithoutMask: string = cpf.replace(/[^\d]+/g, "");

        if (cpfWithoutMask.length > 11) {
            return false;
        }

        if (CPFUtils.isRepeated(cpfWithoutMask)) {
            return false;
        }

        return CPFUtils.isCheckerDigitValid(cpfWithoutMask);
    }

    /**
     * isRepeated
     *
     * Verifica se todos os dígitos são iguais
     *
     * @param { string } cpf - Valor do CPF
     * @returns { boolean } Retorna `true` caso o CPF seja composto de números repetidos e `false` caso não.
     */
    private static isRepeated(cpf: string): boolean {
        return cpf === cpf[0]?.repeat(11);
    }

    /**
     * isCheckerDigitValid
     *
     * Verifica se os dígitos verificadores são válidos
     *
     * @param { string } cpf - Valor do CPF
     * @returns { boolean } Retorna `true` caso os dígitos sejam válidos e `false` caso não.
     */
    private static isCheckerDigitValid(cpf: string): boolean {
        let sum = 0;
        let mod: number;

        // Primeiro dígito verificador
        for (let index = 1; index <= 9; index += 1) {
            sum += parseInt(cpf.substring(index - 1, index), 10) * (11 - index);
        }

        mod = (sum * 10) % 11;

        if (mod === 10 || mod === 11) {
            mod = 0;
        }

        if (mod !== parseInt(cpf.substring(9, 10), 10)) {
            return false;
        }

        // Segundo dígito verificador
        sum = 0;

        for (let index = 1; index <= 10; index += 1) {
            sum += parseInt(cpf.substring(index - 1, index), 10) * (12 - index);
        }

        mod = (sum * 10) % 11;

        if (mod === 10 || mod === 11) {
            mod = 0;
        }

        if (mod !== parseInt(cpf.substring(10, 11), 10)) {
            return false;
        }

        return true;
    }
}
