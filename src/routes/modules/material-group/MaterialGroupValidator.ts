// Libs
import { Meta, Schema } from "express-validator";
import { RequestHandler } from "express";

// Repositories
import { MaterialGroupRepository, MaterialRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { Material, MaterialGroup } from "@library/database/entity";

/**
 * MaterialGroupValidator
 *
 * Classe de validadores para o endpoint de grupos de material
 */
export class MaterialGroupValidator extends BaseValidator {
    public static model: Schema = {
        name: {
            ...BaseValidator.validators.name,
            custom: {
                errorMessage: "Grupo de material já existe",
                options: async (value: string, { req }: Meta) => {
                    let check = false;

                    if (value) {
                        const materialGroupRepository: MaterialGroupRepository = new MaterialGroupRepository();
                        const materialGroup: MaterialGroup | undefined = await materialGroupRepository.findByName(value);

                        check = materialGroup ? req.body.id === materialGroup.id : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList(MaterialGroupValidator.model);
    }

    public static put(): RequestHandler[] {
        return [...MaterialGroupValidator.onlyId(), ...MaterialGroupValidator.post()];
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new MaterialGroupRepository()),
                errorMessage: "Grupo de material não encontrado"
            }
        });
    }

    public static delete(): RequestHandler[] {
        return [
            ...MaterialGroupValidator.onlyId(),
            ...BaseValidator.validationList({
                materialLinked: {
                    errorMessage: "Grupo vinculado a material(ais)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const materialGroup: MaterialGroup = req.body?.materialGroupRef;
                            let check = false;

                            if (materialGroup) {
                                const materialRepository: MaterialRepository = new MaterialRepository();
                                const material: Material | undefined = await materialRepository.findByMaterialGroup(materialGroup);

                                check = material ? materialGroup.id === material.materialGroup.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                }
            })
        ];
    }
}
