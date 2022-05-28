// Libraries
import crypto from "crypto";

/**
 * CryptoUtils
 *
 * Classe de utils para tratamento de hashes
 */
export class CryptoUtils {
    /**
     * getRandomString
     *
     * Cria uma string randômica
     *
     * @param length - Tamanho a ser gerada
     *
     * @returns String aleatória
     */
    public static getRandomString(length: number): string {
        if (length > 0) {
            return crypto
                .randomBytes(Math.ceil(length / 2))
                .toString("hex")
                .slice(0, length);
        }

        throw new RangeError("Invalid length");
    }

    /**
     * sha512
     *
     * Gera um hash a partir de 2 salt's
     *
     * @param payload - Conteúdo a ser encriptado
     * @param salt - String base
     *
     * @returns String encriptada
     */
    public static sha512(payload: string, salt: string): string {
        const hash: crypto.Hmac = crypto.createHmac("sha512", salt);

        hash.update(String(process.env.ENCRYPT_HASH));
        hash.update(payload);

        return hash.digest("hex");
    }
}
