// Libs
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Meta, Schema } from "express-validator";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Routes
import { RouteResponse } from "@routes/RouteResponse";

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

    public static verifyToken(req: Request, res: Response, next: NextFunction): void {
        const { authorization } = req.headers;
        const bearerToken: string = req.body.token || req.query.token || authorization?.replace("Bearer", "").trim();

        if (bearerToken && TokenUtils.isValid(bearerToken)) {
            next();
        } else {
            RouteResponse.unauthorizedError(res, "Token inválido");
        }
    }

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
