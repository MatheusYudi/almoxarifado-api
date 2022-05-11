// Libs
import { Request } from "express";

// Interfaces
import { IGetListParams } from "@common/interfaces";

/**
 * BaseController
 *
 * Classe base para os controllers
 */
export class BaseController {
    /**
     * listParams
     *
     * Retorna os parâmetros básicos para listagem
     *
     * @param req - Requisição
     *
     * @returns Objeto com os parâmetros
     */
    protected static listParams(req: Request): IGetListParams {
        const { page, size, order, orderBy } = req.query;

        return {
            page: page ? Number(page) : 1,
            size: size ? Number(size) : 10,
            order: order ? String(order) : undefined,
            orderBy: <"ASC" | "DESC">String(orderBy) || "ASC"
        };
    }
}
