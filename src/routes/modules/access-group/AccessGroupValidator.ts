// Libs
import { RequestHandler } from "express";
import { Meta, Schema } from "express-validator";

// Repositories
import { AccessGroupRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

// Entities
import { AccessGroup } from "@library/database/entity";

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

                        check = accessGroup ? req.body.id === accessGroup.id.toString() : true;
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
}
