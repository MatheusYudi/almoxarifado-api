// Libs
import { NextFunction, Request, Response } from "express";

// Common
import { AppDef } from "@common/AppDef";

// Utils
import { EnvUtils } from "@common/utils";

/**
 * RouteResponse
 *
 * Classe responsável por gerenciar as respostas das requisições
 */
export class RouteResponse {
    /**
     * success
     *
     * Retorna sucesso e exibe data como resposta - 200
     *
     * @param data - Objeto a ser enviado
     * @param res - Resposta da requisição
     */
    public static success(data: string | any, res: Response): void {
        res.status(200);
        res.json(RouteResponse.formatData(true, data));
    }

    /**
     * successCreate
     *
     * Retorna sucesso sem mensagem de resposta para criação de registros - 201
     *
     * @param res - Resposta da requisição
     */
    public static successCreate(res: Response): void {
        res.status(201).send();
    }

    /**
     * successEmpty
     *
     * Retorna sucesso sem mensagem de resposta - 204
     *
     * @param res - Resposta da requisição
     */
    public static successEmpty(res: Response): void {
        res.status(204).send();
    }

    /**
     * error
     *
     * Retorno padrão para erro - 400 (Erros do cliente)
     *
     * @param error - Mensagem de erro ou object
     * @param res - Resposta da requisição
     */
    public static error(error: string | any, res: Response): void {
        res.status(400);
        res.json(RouteResponse.formatData(false, error));
    }

    /**
     * serverError
     *
     * Retorno padrão para erro - 500 (Erros do servidor)
     *
     * @param error - Mensagem de erro
     * @param req - Requisição
     * @param res - Resposta da requisição
     * @param next - Callback
     */
    public static serverError(error: Error, req: Request, res: Response, next: NextFunction): void {
        if (res.headersSent) {
            next(error);
        } else {
            new AppDef().logger.error(req.method, req.path, error.message, error.stack || "");

            res.status(500);
            res.json(RouteResponse.formatData(false, error.message));
        }
    }

    /**
     * notFound
     *
     * Retorno padrão para pagina não encontrada - 404
     *
     * @param req - Requisição
     * @param res - Resposta da requisição
     */
    public static notFound(req: Request, res: Response): void {
        new AppDef().logger.warning(req.method, req.path, "404 : Not Found");

        // Seta cache para a rota procurada durante 60 minutos
        RouteResponse.setCache(60, res);
        res.status(404);
        res.json(RouteResponse.formatData(false, "Not Found"));
    }

    /**
     * unauthorizedError
     *
     * Retorno para autenticação não autorizada
     *
     * @param res - Resposta da requisição
     * @param message - Mensagem de retorno
     */
    public static unauthorizedError(res: Response, message?: string | any): void {
        res.status(401);
        res.json(RouteResponse.formatData(false, message || "No permission to access this service"));
    }

    /**
     * setCache
     *
     * Seta o cache em minutos na requisição
     *
     * @param minutes - Tempo de cache
     * @param res - Resposta da requisição
     */
    public static setCache(minutes: number, res: Response): void {
        const time: number = EnvUtils.isDevelopment() ? 1 : minutes;
        res.set("Cache-Control", `public, max-age=${time * 60}, s-maxage=${time * 60}`);
    }

    /**
     * formatData
     *
     * Padroniza resposta da API
     *
     * @param status - Status da requisição (success = true | failure = false)
     * @param data - Objeto a ser enviado
     *
     * @returns Resposta formatada
     */
    private static formatData(status: boolean, data: string | any): any {
        const response: any = {
            status,
            date: new Date().toISOString()
        };

        response[!response.status ? "error" : "data"] = data;
        return response;
    }
}
