// Libs
import { RequestHandler } from "express";
import { Meta, Schema } from "express-validator";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Utils
import { TokenUtils } from "@common/utils";

// Validators
import { UserValidator } from "../user";

/**
 * AuthValidator
 *
 * Classe de validadores para o endpoint de autenticação
 */
export class AuthValidator extends BaseValidator {
    private static model: Schema = {
        email: {
            ...UserValidator.model.email,
            custom: undefined
        },
        password: {
            errorMessage: "Senha inválida",
            in: "body"
        }
    };

    public static login(): RequestHandler[] {
        return BaseValidator.validationList(AuthValidator.model);
    }

    public static recoverPassword(): Array<any> {
        return AuthValidator.validationList({
            email: AuthValidator.model.email,
            resetUrl: {
                in: "body",
                isURL: true
            }
        });
    }

    public static resetPassword(): RequestHandler[] {
        return BaseValidator.validationList({
            password: UserValidator.model.password,
            "x-reset-token": {
                in: "headers",
                custom: {
                    errorMessage: "Token inválido",
                    options: (token: string, { req }: Meta): boolean => {
                        req.body.decodedToken = TokenUtils.isValid(token);
                        return !!req.body.decodedToken;
                    }
                }
            }
        });
    }
}
