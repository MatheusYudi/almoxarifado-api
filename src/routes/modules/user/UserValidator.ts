// Libs
import { RequestHandler } from "express";
import { Meta, Schema } from "express-validator";

// Repositories
import { AccessGroupRepository, UserRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { User } from "@library/database/entity";

// Utils
import { CPFUtils } from "@common/utils";

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

    public static model: Schema = {
        accessGroupId: {
            ...BaseValidator.validators.id(new AccessGroupRepository()),
            errorMessage: "Grupo de acesso não encontrado"
        },
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
                options: async (value: string, meta: Meta) => {
                    if (typeof value === "string" && CPFUtils.isValid(value)) {
                        return UserValidator.duplicateEmailOrDocument(value, meta);
                    }

                    return Promise.reject();
                }
            }
        },
        email: {
            errorMessage: "Email inválido",
            in: "body",
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
        return [
            ...UserValidator.onlyId(),
            ...BaseValidator.validationList(
                Object.entries(UserValidator.model).reduce((acc, [key, value]) => {
                    return {
                        ...acc,
                        [key]: {
                            ...value,
                            optional: true
                        }
                    };
                }, {})
            )
        ];
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new UserRepository()),
                errorMessage: "Usuário não encontrado"
            }
        });
    }
}
