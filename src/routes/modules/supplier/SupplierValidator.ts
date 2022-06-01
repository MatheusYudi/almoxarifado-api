// Libs
import { RequestHandler } from "express";
import { Meta, Schema } from "express-validator";

// Repositories
import { InvoiceRepository, SupplierRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { Invoice, Supplier } from "@library/database/entity";

// Utils
import { CNPJUtils } from "@common/utils";

// Enums
import { EnumBrazilStates, EnumCalculationRegimes, EnumStateRegistrationTypes } from "@common/enums";

/**
 * SupplierValidator
 *
 * Classe de validadores para o endpoint de fornecedores
 */
export class SupplierValidator extends BaseValidator {
    private static verifyDuplicate = async (value: string, { req }: Meta): Promise<void> => {
        let check = false;

        if (value) {
            const supplier: Supplier | undefined = await new SupplierRepository().findDuplicate(value);

            check = supplier ? req.body.id === supplier.id : true;
        }

        return check ? Promise.resolve() : Promise.reject();
    };

    public static model: Schema = {
        document: {
            errorMessage: "CNPJ inválido",
            in: "body",
            isString: true,
            custom: {
                errorMessage: "CNPJ já existe",
                options: async (value: string, meta: Meta) => {
                    if (typeof value === "string" && CNPJUtils.isValid(value)) {
                        return SupplierValidator.verifyDuplicate(value, meta);
                    }

                    return Promise.reject();
                }
            }
        },
        stateRegistrationType: {
            errorMessage: "Tipo da inscrição estadual inválido",
            in: "body",
            isIn: {
                options: [Object.values(EnumStateRegistrationTypes)]
            }
        },
        stateRegistration: {
            errorMessage: "Inscrição estadual inválida",
            in: "body",
            isString: true,
            custom: {
                errorMessage: "Inscrição estadual já existe",
                options: SupplierValidator.verifyDuplicate
            }
        },
        corporateName: {
            errorMessage: "Razão social inválida",
            in: "body",
            isString: true,
            custom: {
                errorMessage: "Razão social já existe",
                options: SupplierValidator.verifyDuplicate
            }
        },
        tradingName: {
            errorMessage: "Nome fantasia inválido",
            in: "body",
            isString: true,
            custom: {
                errorMessage: "Nome fantasia já existe",
                options: SupplierValidator.verifyDuplicate
            }
        },
        calculationRegime: {
            errorMessage: "Regime de apuração inválido",
            in: "body",
            isIn: {
                options: [Object.values(EnumCalculationRegimes)]
            }
        },
        state: {
            errorMessage: "Estado inválido",
            in: "body",
            isIn: {
                options: [Object.values(EnumBrazilStates)]
            }
        },
        postalCode: {
            errorMessage: "CEP inválido",
            in: "body",
            isPostalCode: {
                options: "BR"
            }
        },
        address: {
            errorMessage: "Endereço inválido",
            in: "body",
            isString: true
        },
        addressNumber: {
            errorMessage: "Número do endereço inválido",
            in: "body",
            isNumeric: true
        },
        city: {
            errorMessage: "Cidade inválida",
            in: "body",
            isString: true
        },
        district: {
            errorMessage: "Bairro inválido",
            in: "body",
            isString: true
        },
        complement: {
            errorMessage: "Complemento inválido",
            in: "body",
            optional: true,
            isString: true
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList(SupplierValidator.model);
    }

    public static put(): RequestHandler[] {
        return [...SupplierValidator.onlyId(), ...BaseValidator.validationList(SupplierValidator.model)];
    }

    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new SupplierRepository()),
                errorMessage: "Fornecedor não encontrado"
            }
        });
    }

    public static delete(): RequestHandler[] {
        return [
            ...SupplierValidator.onlyId(),
            ...BaseValidator.validationList({
                invoiceLinked: {
                    errorMessage: "Nota fiscal vinculada a usuário(s)",
                    custom: {
                        options: async (_, { req }: Meta) => {
                            const supplier: Supplier = req.body?.supplierRef;
                            let check = false;

                            if (supplier) {
                                const userRepository: InvoiceRepository = new InvoiceRepository();
                                const user: Invoice | undefined = await userRepository.findBySupplier(supplier);

                                check = user ? supplier.id === user.supplier.id : false;
                            }

                            return check ? Promise.reject() : Promise.resolve();
                        }
                    }
                }
            })
        ];
    }
}
