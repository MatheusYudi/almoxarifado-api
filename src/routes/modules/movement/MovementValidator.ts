// Libs
import { Meta, Schema } from "express-validator";
import { RequestHandler } from "express";

// Repositories
import { MaterialRepository, MovementRepository, UserRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { Material } from "@library/database/entity";

// Enums
import { EnumMovementTypes } from "@common/enums";

/**
 * MovementValidator
 *
 * Classe de validadores para o endpoint de movimentações
 */
export class MovementValidator extends BaseValidator {
    public static model: Schema = {
        userId: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: "Usuário não encontrado"
        },
        reason: {
            errorMessage: "Motivo inválido",
            in: "body",
            optional: true,
            isString: true
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList({
            ...MovementValidator.model,
            materialId: {
                ...BaseValidator.validators.id(new MaterialRepository()),
                errorMessage: "Material não encontrado"
            },
            quantity: {
                errorMessage: "Quantidade inválida",
                in: "body",
                toFloat: true,
                isFloat: {
                    options: {
                        gt: 0
                    }
                },
                custom: {
                    errorMessage: "Quantidade movimentada é maior que a disponível em estoque",
                    options: async (value: number, { req }: Meta) => {
                        const { materialRef } = req.body;

                        if (materialRef && value <= (materialRef as Material).stockQuantity) {
                            return Promise.resolve();
                        }

                        return Promise.reject();
                    }
                }
            },
            type: {
                errorMessage: "Tipo da movimentação inválido",
                in: "body",
                isIn: {
                    options: [Object.values(EnumMovementTypes)]
                }
            }
        });
    }

    public static batch(): RequestHandler[] {
        return BaseValidator.validationList({
            ...MovementValidator.model,
            items: {
                errorMessage: "Materiais da movimentação inválidos",
                in: "body",
                isArray: {
                    options: {
                        min: 1
                    }
                }
            },
            "items.*.materialId": {
                errorMessage: "Material não encontrado",
                in: "body",
                isNumeric: true,
                custom: {
                    options: async (value: number, { path, req }: Meta) => {
                        const material: Material | undefined = await new MaterialRepository().findOne(value);

                        if (material) {
                            const index: string = path.split("items")[1].replace(/\D/g, "");

                            req.body.items[+index].materialRef = material;

                            return Promise.resolve();
                        }

                        return Promise.reject();
                    }
                }
            },
            "items.*.quantity": {
                errorMessage: "Quantidade inválida",
                in: "body",
                isFloat: {
                    options: {
                        gt: 0
                    }
                },
                toFloat: true
            }
        });
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new MovementRepository()),
                errorMessage: "Movimentação não encontrada"
            }
        });
    }
}
