// Libs
import jwt from "jsonwebtoken";

// Types
import { TObject } from "@common/types";

/**
 * TokenUtils
 *
 * Classe de utils para tratamento de tokens
 */
export class TokenUtils {
    private static SECRET: string = process.env.TOKEN_SECRET || "new_secret";

    /**
     * create
     *
     * Gera um novo token
     *
     * @param payload - Conteúdo a ser assinado
     *
     * @returns Token
     */
    public static create(payload?: string | TObject | Buffer, options?: jwt.SignOptions): string {
        return jwt.sign(payload || {}, TokenUtils.SECRET, options);
    }

    /**
     * isValid
     *
     * Verifica se um token é válido
     *
     * @param token - Valor do token
     *
     * @returns Token validado
     */
    public static isValid(token: string): string | TObject | false {
        try {
            const verifiedToken: string | jwt.JwtPayload = jwt.verify(token, TokenUtils.SECRET);
            return verifiedToken;
        } catch (error) {
            return false;
        }
    }
}
