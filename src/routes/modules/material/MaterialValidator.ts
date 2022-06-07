// Libs
import { Meta, Schema } from "express-validator";
import { RequestHandler } from "express";

// Repositories
import {
    InventoryMaterialRepository,
    InvoiceMaterialRepository,
    MaterialGroupRepository,
    MaterialRepository,
    MovementRepository,
    NCMRepository,
    RequisitionMaterialRepository
} from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { InventoryMaterial, InvoiceMaterial, Material, Movement, RequisitionMaterial } from "@library/database/entity";

/**
 * MaterialValidator
 *
 * Classe de validadores para o endpoint de materiais
 */
export class MaterialValidator extends BaseValidator {
    public static model: Schema = {
        name: {
            ...BaseValidator.validators.name,
            custom: {
                errorMessage: "Material já existe",
                options: async (value: string, { req }: Meta) => {
                    let check = !value;

                    if (value) {
                        const materialRepository: MaterialRepository = new MaterialRepository();
                        const material: Material | undefined = await materialRepository.findByName(value);

                        check = material ? req.body.id === material.id : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        materialGroupId: {
            ...BaseValidator.validators.id(new MaterialGroupRepository()),
            errorMessage: "Grupo de material não encontrado"
        },
        unit: {
            errorMessage: "Unidade inválida",
            in: "body",
            isString: true
        },
        ncmId: {
            ...BaseValidator.validators.id(new NCMRepository()),
            errorMessage: "Código NCM não encontrado"
        },
        barcode: {
            errorMessage: "Código de barras inválido",
            in: "body",
            isString: true,
            custom: {
                errorMessage: "Código de barras já existe",
                options: async (value: string, { req }: Meta) => {
                    let check = !value;

                    if (value) {
                        const materialRepository: MaterialRepository = new MaterialRepository();
                        const material: Material | undefined = await materialRepository.findByBarcode(value);

                        check = material ? req.body.id === material.id : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        unitPrice: {
            errorMessage: "Preço unitário inválido",
            in: "body",
            isFloat: true,
            toFloat: true
        },
        stockQuantity: {
            errorMessage: "Quantidade de estoque inválida",
            in: "body",
            isFloat: true,
            toFloat: true
        },
        minimumStock: {
            errorMessage: "Estoque mínimo inválido",
            in: "body",
            isFloat: true,
            toFloat: true
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList(MaterialValidator.model);
    }

    public static put(): RequestHandler[] {
        return [...MaterialValidator.onlyId(), ...BaseValidator.validationList(MaterialValidator.model)];
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new MaterialRepository()),
                errorMessage: "Material não encontrado"
            }
        });
    }

    public static delete(): RequestHandler[] {
        return [
            ...MaterialValidator.onlyId(),
            ...BaseValidator.validationList({
                inventoryMaterialLinked: {
                    errorMessage: "Inventário vinculado a material(ais)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const material: Material = req.body?.materialRef;
                            let check = false;

                            if (material) {
                                const inventoryMaterialRepository: InventoryMaterialRepository = new InventoryMaterialRepository();
                                const inventoryMaterial: InventoryMaterial | undefined = await inventoryMaterialRepository.findByMaterial(material);

                                check = inventoryMaterial ? material.id === inventoryMaterial.material.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                },
                invoiceMaterialLinked: {
                    errorMessage: "Nota fiscal vinculada a material(ais)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const material: Material = req.body?.materialRef;
                            let check = false;

                            if (material) {
                                const invoiceMaterialRepository: InvoiceMaterialRepository = new InvoiceMaterialRepository();
                                const invoiceMaterial: InvoiceMaterial | undefined = await invoiceMaterialRepository.findByMaterial(material);

                                check = invoiceMaterial ? material.id === invoiceMaterial.material.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                },
                movementLinked: {
                    errorMessage: "Movimentação vinculada a material(ais)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const material: Material = req.body?.materialRef;
                            let check = false;

                            if (material) {
                                const movementRepository: MovementRepository = new MovementRepository();
                                const movement: Movement | undefined = await movementRepository.findByMaterial(material);

                                check = movement ? material.id === movement.material.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                },
                requisitionMaterialLinked: {
                    errorMessage: "Requisição vinculada a material(ais)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const material: Material = req.body?.materialRef;
                            let check = false;

                            if (material) {
                                const requisitionMaterialRepository: RequisitionMaterialRepository = new RequisitionMaterialRepository();
                                const requisitionMaterial: RequisitionMaterial | undefined = await requisitionMaterialRepository.findByMaterial(
                                    material
                                );

                                check = requisitionMaterial ? material.id === requisitionMaterial.material.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                }
            })
        ];
    }

    public static requestPurchase(): Array<any> {
        return MaterialValidator.validationList({
            email: {
                errorMessage: "Email inválido",
                in: "body",
                normalizeEmail: true,
                isEmail: {
                    bail: true
                }
            }
        });
    }
}
