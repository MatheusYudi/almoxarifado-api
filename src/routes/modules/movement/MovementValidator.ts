// Libs
import { RequestHandler } from "express";
import { Schema } from "express-validator";

// Repositories
import { MaterialRepository, MovementRepository, UserRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

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
        materialId: {
            ...BaseValidator.validators.id(new MaterialRepository()),
            errorMessage: "Material não encontrado"
        },
        quantity: {
            errorMessage: "Quantidade inválida",
            in: "body",
            isFloat: true,
            toFloat: true
        },
        type: {
            errorMessage: "Tipo da movimentação inválido",
            in: "body",
            isIn: {
                options: [Object.values(EnumMovementTypes)]
            }
        },
        reason: {
            errorMessage: "Motivo inválido",
            in: "body",
            optional: true,
            isString: true
        }
    };

    public static post(): RequestHandler[] {
        return BaseValidator.validationList(MovementValidator.model);
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
