// Libs
import { RequestHandler } from "express";
import { Meta, Schema } from "express-validator";

// Repositories
import { AccessGroupRepository, UserRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { AccessGroup, User } from "@library/database/entity";

/**
 * AccessGroupValidator
 *
 * Classe de validadores para o endpoint de grupos de acesso
 */
export class AccessGroupValidator extends BaseValidator {
    public static model: Schema = {
        name: {
            ...BaseValidator.validators.name,
            custom: {
                errorMessage: "Grupo de acesso já existe",
                options: async (value: string, { req }: Meta) => {
                    let check = false;

                    if (value) {
                        const accessGroupRepository: AccessGroupRepository = new AccessGroupRepository();
                        const accessGroup: AccessGroup | undefined = await accessGroupRepository.findByName(value);

                        check = accessGroup ? req.body.id === accessGroup.id : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList(AccessGroupValidator.model);
    }

    public static put(): RequestHandler[] {
        return [...AccessGroupValidator.onlyId(), ...AccessGroupValidator.post()];
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new AccessGroupRepository()),
                errorMessage: "Grupo de acesso não encontrado"
            }
        });
    }

    public static delete(): RequestHandler[] {
        return [
            ...AccessGroupValidator.onlyId(),
            ...BaseValidator.validationList({
                userLinked: {
                    errorMessage: "Grupo de acesso vinculado a usuário(s)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const accessGroup: AccessGroup = req.body?.accessGroupRef;
                            let check = false;

                            if (accessGroup) {
                                const userRepository: UserRepository = new UserRepository();
                                const user: User | undefined = await userRepository.findByAccessGroup(accessGroup);

                                check = user ? accessGroup.id === user.accessGroup.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                }
            })
        ];
    }
}
