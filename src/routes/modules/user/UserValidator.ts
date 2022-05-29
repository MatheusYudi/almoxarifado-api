// Libs
import { RequestHandler } from "express";
import { Meta, Schema } from "express-validator";

// Repositories
import { UserRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { User } from "@library/database/entity";

// Utils
import { CPFUtils, TokenUtils } from "@common/utils";

/**
 * UserValidator
 *
 * Classe de validadores para o endpoint de usuários
 */
export class UserValidator extends BaseValidator {
    private static duplicateEmailOrDocument = async (value: string, { req }: Meta): Promise<void> => {
        let check = false;

        if (value) {
            const user: User | undefined = await new UserRepository().findByEmailOrDocument(value);

            check = user ? req.body.id === user.id.toString() : true;
        }

        return check ? Promise.resolve() : Promise.reject();
    };

    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: "Usuário não encontrado"
        },
        // TODO: add access group validation
        // accessGroup: {
        //     ...BaseValidator.validators.id(new AccessGroupRepository()),
        //     errorMessage: "Grupo de acesso não encontrado"
        // },
        name: {
            ...BaseValidator.validators.name,
            custom: {
                errorMessage: "Usuário já existe",
                options: async (value: string, { req }: Meta) => {
                    let check = false;

                    if (value) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByName(value);

                        check = user ? req.body.id === user.id.toString() : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        document: {
            errorMessage: "CPF inválido",
            in: "body",
            isString: true,
            custom: {
                errorMessage: "CPF já existe",
                options: async (value: string, meta: Meta) => {
                    if (CPFUtils.isValid(value)) {
                        return UserValidator.duplicateEmailOrDocument(value, meta);
                    }

                    return false;
                }
            }
        },
        email: {
            errorMessage: "Email inválido",
            in: "body",
            optional: true,
            normalizeEmail: true,
            isEmail: {
                bail: true
            },
            custom: {
                errorMessage: "Email já existe",
                options: UserValidator.duplicateEmailOrDocument
            }
        },
        password: {
            errorMessage: "Senha inválida",
            in: "body",
            isLength: { options: { min: 6 } }
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList(UserValidator.model);
    }

    public static put(): RequestHandler[] {
        return [...UserValidator.onlyId(), ...BaseValidator.validationList(UserValidator.model)];
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new UserRepository()),
                errorMessage: "Usuário não encontrado"
            }
        });
    }

    public static changePassword(): RequestHandler[] {
        return BaseValidator.validationList({
            password: UserValidator.model.password,
            "x-reset-token": {
                in: "headers",
                custom: {
                    errorMessage: "Token inválido",
                    options: (token: string, { req }: Meta): Promise<void> => {
                        req.body.decodedToken = TokenUtils.isValid(token);
                        return !req.body.decodedToken ? Promise.reject() : Promise.resolve();
                    }
                }
            }
        });
    }
}
