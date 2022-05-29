// Libs
import { Router, Request, Response, NextFunction } from "express";

// Enums
import { EnumDecorators } from "@common/enums";

// Interfaces
import { IRouteDef } from "@common/interfaces";

// Types
import { TClass } from "@common/types";

// Utils
import { TokenUtils } from "@common/utils";

// Routes
import { RouteResponse } from "./RouteResponse";

/**
 * RoutesController
 *
 * Classe responsável por gerenciar os controllers
 */
export class RoutesController {
    /**
     * requiresAuth
     *
     * Valida o cabeçalho de autenticação das requisições
     *
     * @param req - Requisição
     * @param res - Resposta da requisição
     * @param next - Callback
     */
    public static requiresAuth(req: Request, res: Response, next: NextFunction): void {
        const { authorization } = req.headers;
        const bearerToken: string = req.body.token || req.query.token || authorization?.replace("Bearer", "").trim();

        if (bearerToken && TokenUtils.isValid(bearerToken)) {
            next();
        } else {
            RouteResponse.unauthorizedError(res, "Token inválido");
        }
    }

    /**
     * exportRoutes
     *
     * Exporta todos os métodos com os decorators
     *
     * @param controllers - Lista de controllers
     *
     * @returns Instância do Router
     */
    public static exportRoutes(controllers: TClass[]): Router {
        const router: Router = Router();

        // Percorre a lista de controllers para adicionar todas as rotas
        controllers.forEach((Controller: TClass<any>) => {
            const instance = new Controller();
            const prefix = Reflect.getMetadata(EnumDecorators.CONTROLLER_PREFIX, Controller);
            const routes: IRouteDef[] = Reflect.getMetadata(EnumDecorators.ROUTES, Controller);
            const publicRoutes: Array<string | symbol> = Reflect.getMetadata(EnumDecorators.PUBLIC_ROUTES, Controller) || [];
            const allMiddlewares: any = Reflect.getMetadata(EnumDecorators.MIDDLEWARE, Controller) || {};

            routes.forEach((route: IRouteDef) => {
                const methodMiddlewares: any[] = allMiddlewares[route.methodName] || [];

                if (!publicRoutes.includes(route.methodName)) {
                    methodMiddlewares.unshift(RoutesController.requiresAuth);
                }

                router[route.requestMethod](prefix + route.path, [
                    ...methodMiddlewares,
                    RoutesController.runAsyncWrapper(instance[route.methodName])
                ]);
            });
        });

        return router;
    }

    /**
     * runAsyncWrapper
     *
     * Encapsula middleware de erro das rotas
     *
     * @param callback - Função de callback
     */
    private static runAsyncWrapper(callback: any): any {
        return (req: Request, res: Response, next: NextFunction) => callback(req, res, next).catch(next);
    }
}
