// Libs
import { RequestHandler } from "express";
import { Meta, Schema } from "express-validator";

// Repositories
import { RequisitionMaterialRepository, RequisitionRepository, MaterialRepository, UserRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { RequisitionMaterial, Material } from "@library/database/entity";

/**
 * RequisitionValidator
 *
 * Classe de validadores para o endpoint de requisições
 */
export class RequisitionValidator extends BaseValidator {
    public static model: Schema = {
        userId: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: "Usuário não encontrado"
        },
        items: {
            errorMessage: "Materiais da requisição inválidos",
            in: "body",
            isArray: true
        },
        "items.*.quantity": {
            errorMessage: "Quantidade inválida",
            in: "body",
            isFloat: true,
            toFloat: true
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList({
            ...RequisitionValidator.model,
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
            ...RequisitionValidator.onlyId(),
            ...BaseValidator.validationList({
                ...RequisitionValidator.model,
                "items.*.id": {
                    errorMessage: "Item da requisição não encontrado",
                    in: "body",
                    custom: {
                        options: async (value: string, { path, req }: Meta) => {
                            const requisitionMaterial: RequisitionMaterial | undefined = await new RequisitionMaterialRepository().findOne(value);

                            if (requisitionMaterial) {
                                const index = path.split("items")[1].replace(/\D/g, "");

                                req.body.items[+index].requisitionMaterialRef = requisitionMaterial;

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
                ...BaseValidator.validators.id(new RequisitionRepository()),
                errorMessage: "Requisição não encontrada"
            }
        });
    }
}
