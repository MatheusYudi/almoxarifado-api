/**
 * StringUtils
 *
 * Classe de utils para tratamento de strings
 */
export class StringUtils {
    /**
     * firstUpperCase
     *
     * Deixa a primeira letra de uma string em maiúsculo
     *
     * @param value - Texto a ser manipulado
     *
     * @returns Texto tratado
     */
    public static firstUpperCase(value: string): string {
        if (value) {
            const strings: string[] = value.split(" ");

            strings.forEach((item: string, index: number) => {
                strings[index] = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
            });

            return strings.join(" ").trim();
        }

        return value;
    }

    /**
     * firstLowerCase
     *
     * Deixa a primeira letra de uma string em minúsculo
     *
     * @param value - Texto a ser manipulado
     *
     * @returns Texto tratado
     */
    public static firstLowerCase(value: string): string {
        if (value) {
            const strings: string[] = value.split(" ");

            strings.forEach((item: string, index: number) => {
                strings[index] = item.charAt(0).toLowerCase() + item.slice(1);
            });

            return strings.join(" ").trim();
        }

        return value;
    }
}
