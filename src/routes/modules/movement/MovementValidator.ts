// Libs
import { RequestHandler } from "express";

// Repositories
import { MovementRepository } from "@library/database/repository";

// Middlewares
import { BaseValidator } from "@middlewares/index";

/**
 * MovementValidator
 *
 * Classe de validadores para o endpoint de movimentações
 */
export class MovementValidator extends BaseValidator {
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: {
                ...BaseValidator.validators.id(new MovementRepository()),
                errorMessage: "Movimentação não encontrada"
            }
        });
    }
}
