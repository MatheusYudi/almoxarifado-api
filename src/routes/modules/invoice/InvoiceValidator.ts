// Libs
import { Meta, Schema } from "express-validator";
import { RequestHandler } from "express";

// Repositories
import { InvoiceRepository, MaterialRepository, SupplierRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { Invoice, Material } from "@library/database/entity";

/**
 * InvoiceValidator
 *
 * Classe de validadores para o endpoint de notas fiscais
 */
export class InvoiceValidator extends BaseValidator {
    public static model: Schema = {
        supplierId: {
            ...BaseValidator.validators.id(new SupplierRepository()),
            errorMessage: "Fornecedor não encontrado"
        },
        number: {
            errorMessage: "Número inválido",
            in: "body",
            isNumeric: true
        },
        key: {
            errorMessage: "Chave inválida",
            in: "body",
            isString: true,
            custom: {
                errorMessage: "Chave já existe",
                options: async (value: string, { req }: Meta) => {
                    let check = false;

                    if (value) {
                        const invoiceRepository: InvoiceRepository = new InvoiceRepository();
                        const invoice: Invoice | undefined = await invoiceRepository.findByKey(value);

                        check = invoice ? req.body.id === invoice.id : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        items: {
            errorMessage: "Materiais da nota fiscal inválidos",
            in: "body",
            isArray: true
        },
        "items.*.materialId": {
            errorMessage: "Material não encontrado",
            in: "body",
            isNumeric: true,
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
        },
        "items.*.quantity": {
            errorMessage: "Quantidade inválida",
            in: "body",
            isFloat: true,
            toFloat: true
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList(InvoiceValidator.model);
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new InvoiceRepository()),
                errorMessage: "Nota fiscal não encontrada"
            }
        });
    }
}
