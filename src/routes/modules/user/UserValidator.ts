// Libs
import { Meta, Schema } from "express-validator";
import { RequestHandler } from "express";

// Repositories
import { AccessGroupRepository, InventoryRepository, MovementRepository, RequisitionRepository, UserRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { Inventory, Movement, Requisition, User } from "@library/database/entity";

// Utils
import { CPFUtils } from "@common/utils";

/**
 * UserValidator
 *
 * Classe de validadores para o endpoint de usuários
 */
export class UserValidator extends BaseValidator {
    private static duplicateEmailOrDocument = async (value: string, { req }: Meta): Promise<void> => {
        let check = !value;

        if (value) {
            const user: User | undefined = await new UserRepository().findByEmailOrDocument(value, false, true);

            check = user ? req.body.id === user.id : true;
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
                    let check = !value;

                    if (value) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByName(value);

                        check = user ? req.body.id === user.id : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        document: {
            errorMessage: "CPF inválido",
            in: "body",
            isString: true,
            customSanitizer: {
                options: (value: string) => {
                    return value?.replace(/[^\d]+/g, "");
                }
            },
            custom: {
                options: CPFUtils.isValid
            }
        },
        duplicateDocument: {
            errorMessage: "CPF já existe",
            in: "body",
            custom: {
                options: async (_, meta: Meta): Promise<void> => {
                    return UserValidator.duplicateEmailOrDocument(meta.req.body.document, meta);
                }
            }
        },
        email: {
            errorMessage: "Email inválido",
            in: "body",
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
                            optional: true,
                            ...(key === "password" && { isLength: undefined })
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

    public static delete(): RequestHandler[] {
        return [
            ...UserValidator.onlyId(),
            ...BaseValidator.validationList({
                movementLinked: {
                    errorMessage: "Movimentação vinculada a usuário(s)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const user: User = req.body?.userRef;
                            let check = false;

                            if (user) {
                                const movementRepository: MovementRepository = new MovementRepository();
                                const movement: Movement | undefined = await movementRepository.findByUser(user);

                                check = movement ? user.id === movement.user.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                },
                inventoryLinked: {
                    errorMessage: "Inventário vinculado a usuário(s)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const user: User = req.body?.userRef;
                            let check = false;

                            if (user) {
                                const inventoryRepository: InventoryRepository = new InventoryRepository();
                                const inventory: Inventory | undefined = await inventoryRepository.findByUser(user);

                                check = inventory ? user.id === inventory.user.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                },
                requisitionLinked: {
                    errorMessage: "Requisição vinculada a usuário(s)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const user: User = req.body?.userRef;
                            let check = false;

                            if (user) {
                                const requisitionRepository: RequisitionRepository = new RequisitionRepository();
                                const requisition: Requisition | undefined = await requisitionRepository.findByUser(user);

                                check = requisition ? user.id === requisition.user.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                }
            })
        ];
    }
}
