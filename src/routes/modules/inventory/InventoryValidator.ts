// Libs
import { RequestHandler } from "express";
import { Meta, Schema } from "express-validator";

// Repositories
import { InventoryMaterialRepository, InventoryRepository, MaterialRepository, UserRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { InventoryMaterial, Material } from "@library/database/entity";

/**
 * InventoryValidator
 *
 * Classe de validadores para o endpoint de inventários
 */
export class InventoryValidator extends BaseValidator {
    public static model: Schema = {
        userId: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: "Usuário não encontrado"
        },
        items: {
            errorMessage: "Materiais do inventário inválidos",
            in: "body",
            isArray: true
        },
        "items.*.systemQuantity": {
            errorMessage: "Quantidade do sistema inválida",
            in: "body",
            isFloat: true,
            toFloat: true
        },
        "items.*.physicQuantity": {
            errorMessage: "Quantidade física inválida",
            in: "body",
            isFloat: true,
            toFloat: true
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList({
            ...InventoryValidator.model,
            "items.*.materialId": {
                errorMessage: "Material não encontrado",
                in: "body",
                custom: {
                    options: async (value: string, { path, req }: Meta) => {
                        const material: Material | undefined = await new MaterialRepository().findOne(value);

                        if (material) {
                            const index = path.split("items")[1].replace(/\D/g, "");

                            req.body.items[+index].materialRef = material;

                            return Promise.resolve();
                        }

                        return Promise.reject();
                    }
                }
            }
        });
    }

    public static put(): RequestHandler[] {
        return [
            ...InventoryValidator.onlyId(),
            ...BaseValidator.validationList({
                ...InventoryValidator.model,
                "items.*.id": {
                    errorMessage: "Item do inventário não encontrado",
                    in: "body",
                    custom: {
                        options: async (value: string, { path, req }: Meta) => {
                            const inventoryMaterial: InventoryMaterial | undefined = await new InventoryMaterialRepository().findOne(value);

                            if (inventoryMaterial) {
                                const index = path.split("items")[1].replace(/\D/g, "");

                                req.body.items[+index].inventoryMaterialRef = inventoryMaterial;

                                return Promise.resolve();
                            }

                            return Promise.reject();
                        }
                    }
                }
            })
        ];
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new InventoryRepository()),
                errorMessage: "Inventário não encontrado"
            }
        });
    }
}
